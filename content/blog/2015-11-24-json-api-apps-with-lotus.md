---
cover: /covers/json-api-apps-with-lotus.jpg
thumbnail: /thumbnails/json-api-apps-with-lotus.jpg
date: 2015-11-24
description: |
  Do you need a fast and lightweight JSON API app? It must be powerful, flexible, quick to develop and easy to deploy? There is a simple solution for all these requirements: to use Lotus gems to build it.
tags:
  - api
  - lotus
  - hanami
  - json
  - ruby
title: JSON API Apps With Lotus
categories:
  - featured
---

Do you need a fast and lightweight JSON API app? It must be powerful, flexible, quick to develop and easy to deploy?

There is a simple solution for all these requirements: to use Lotus gems to build it.

Lotus is well known for full stack web applications (via `lotusrb`), but all the gems of this **toolkit** can be used as standalone components in existing Ruby applications.

It this case we will compose together the router and the actions to create a JSON API app that returns informations for books.

Before to get started, this application will take you 15 minutes. If you are too busy to read how to build it from scratch, jump on [this repository](https://github.com/jodosha/lotus-api-example) with the complete code.

## Setup

We’re gonna need to create the directory with `mkdir bookshelf && cd $_` a `Gemfile`:

```ruby
source 'https://rubygems.org'
ruby   '2.2.3'

gem 'rake'
gem 'lotus-router'
gem 'lotus-controller'
gem 'redis'
gem 'puma'

group :development, :test do
  gem 'pry-byebug'
end

group :test do
  gem 'rspec'
  gem 'rack-test'
end
```

..a `Rakefile`:

```ruby
require 'rake'
require 'rspec/core/rake_task'

RSpec::Core::RakeTask.new(:spec)
task default: :spec
```

Then we can `bundle` and `bundle exec spec --init`.

At the **top** of `spec/spec_helper.rb` add the following lines:

```ruby
require 'support/api'
require_relative '../app'
```

Our `spec/support/api.rb` file is useful to bring `rack-test` support to RSpec and to use it only where needed.

```ruby
module ApiHelper
  require 'rack/test'
  include Rack::Test::Methods

  private

  def app
    Bookshelf::API::Application.new
  end

  def response
    last_response
  end
end

RSpec.configure do |config|
  config.include ApiHelper, type: :api
end
```

Let’s run `bundle exec rake` to test that the setup is valid.

## Testing

With the project up and running, we can write a smoke test for one endpoint.

```ruby
# spec/requests/books_spec.rb
RSpec.describe "/books", type: :api do
  it "is successful" do
    get "/books"

    expect(response.status).to eq(200)
  end
end
```

If we run it, RSpec will complain that `Bookshelf` isn’t a defined constant. That’s because we need to write the application.

This is how the final code will appear, we postpone the explanation for a minute.

```ruby
require 'json'
require 'redis'
require 'lotus/router'
require 'lotus/controller'

module Bookshelf
  module API

    Lotus::Controller.configure do
      handle_exceptions ENV['RACK_ENV'] == 'production'

      default_request_format  :json
      default_response_format :json

      prepare do
        include Controllers::Authentication
        accept :json
      end
    end

    class Repository
      # …
    end

    class Application
      def initialize
        @router = Lotus::Router.new(
          namespace: Bookshelf::API::Controllers,
          parsers: [:json],
          &Proc.new { eval(File.read('config/routes.rb')) }
        )
      end

      def call(env)
        @router.call(env)
      end
    end

    module Controllers
      module Authentication
        def self.included(action)
          action.class_eval do
            before :authenticate!
          end
        end

        private

        def authenticate!
          authenticated? or halt(401)
        end

        def authenticated?
          true
        end
      end

      require_relative './controllers/books'
    end
  end
end
```

If we run the spec again, it will return a `404` (Not Found), because we’re still missing the route.

Edit `config/routes.rb` with the following line:

```ruby
get '/books', to: 'books#index'
```

Now we need the last component, the action:

```ruby
# controllers/books.rb
module Bookshelf::API::Controllers::Books
  class Index
    include Lotus::Action

    def call(params)
    end
  end
end
```

Now we can finally run the spec successfully

```bash
➜ bundle exec rspec spec/requests/books_spec.rb

Randomized with seed 59536
.

Finished in 0.01566 seconds (files took 0.13151 seconds to load)
1 example, 0 failures

Randomized with seed 59536
```

## Application

With our first test passing, we can stop and have a deeper look at our application.

### Lotus Configuration

The first block that we meet is the configuration for `Lotus::Controller`.

We tell the framework to threat [exceptions as HTTP status codes](https://github.com/lotus/controller#exceptions-management) only in production mode (with `handle_exceptions`). For instance, when our application is deployed and an error is raised, we want to show a generic “Server Side Error” message, rather than show the entire stack-trace. While in development and testing mode, this is useful to understand the reason behind an error.

Because we want only to deal with JSON, we specify that the fallback format for requests is JSON (`default_request_format`). When we receive the generic HTTP header `Accept: */*`, we consider it as a JSON request.

For responses we use `default_response_format`, to send `Content-Type: application/json` header.

Next to it there is the `prepare` block. This is a special feature that allows us to share code and behaviours across **all** the classes that include `Lotus::Action`. This is similar to Ruby’s [`Module.included`](http://ruby-doc.org/core-2.2.0/Module.html#method-i-included) hook.

That means the `accept :json` code will be executed for all the actions in our application. That [restrict the access](https://github.com/lotus/controller#mime-types) to only JSON requests. If another MIME Type is required, the application will respond with a `406 Not Acceptable`.

The other useful purpose of `prepare` is to DRY our application and let to inject code in just one place. Imagine we have 50 actions and we need to authenticate them, it would be tedious to do `include Authentication` for all of them. With `prepare` we can include it only once, and it will **propagated to all the actions**.

### Authentication

For the purpose of this test application, we won’t implement an authentication strategy, but only put the code in place for it.

The idea is really simple: every time an action includes this module, it will setup a [callback](https://github.com/lotus/controller#callbacks) for the private method `#authenticate!`. It verifies if the request is allowed via `#authenticated?`, if not it will [stop the execution](https://github.com/lotus/controller#throwable-http-statuses) (via `#halt`) and returns a `401 Unauthorized`.

Again, this mechanism is **enabled for all the actions**, if you need to bypass this check you can override `#authenticated?` in an action, by returning `true`. This trick helps you to **“skip” that callback**.

### Router

The router is at the core of our application, it will dispatch the incoming requests and parse the params from the URI and Rack env.

We initialize it as an instance variable of our application, by specifying a few options.

We the Ruby namespace where to find the actions. In the routes file we defined the action with the `"books#index"` syntax. It is translated to `Books::Index`, which will be searched under the `Bookshelf::API::Controllers` module.

The next setting is to tell the router to [parse the body of non-GET requests](https://github.com/lotus/router#body-parsers) and make them available as params. For instance, if we receive a JSON payload in the body `{"book”:”…”}`, it we can access that data via `params[:book]`.

`Lotus::Router` [accepts a block](https://github.com/lotus/router#getting-started) to that let us to define the routes. Now if we have too many entries, it’s convenient to keep them in a separated file. In our case it’s `config/routes.rb`, we’re reading the content and wrapping into a `Proc`.

## Expanding The Feature

Until now, our application isn’t interesting. It’s able to return a successful response, but nothing more.

Let’s say we want to return a bunch of data for our `/books` endpoint.

```ruby
# spec/requests/book_spec.rb
RSpec.describe "/books", type: :api do
  before do
    repository = Bookshelf::API::Repository.new
    repository.clear

    repository.create(:books, [{title: 'TDD'}, {title: 'Refactoring'}])
    @body = JSON.dump(repository.all(:books))
  end

  it "is successful" do
    get "/books"

    expect(response.status).to                  eq(200)
    expect(response.body).to                    eq(@body)
    expect(response.headers['Content-Type']).to match('application/json')
  end
end
```

To make it pass, we need to implement some business logic into the action:

```ruby
module Bookshelf::API::Controllers::Books
  class Index
    include Lotus::Action

    def call(params)
      books = Bookshelf::API::Repository.new.all(:books)
      self.body = JSON.dump(books)
    end
  end
end
```

We use `Repository` to find all the books in our datastore, we dump the contents into a JSON string and pass it as body of the response.

## Unit Tests

The testing strategy that we used until now exercises the full stack of involved components: we simulate HTTP requests, we go through the router, the action, we hit the database to load data and return it.

This is still really fast, because Lotus and Redis are lightweight technologies, but in the long run the testing suite can slow down if we involve other components in our stack.

To observe action behaviours in isolation, we can unit-test them.

Please note that this is **completely optional**: we can deploy it in production with our current tests. The following code, demonstrates a few interesting testing techniques.

```ruby
# spec/controllers/books/index_spec.rb
RSpec.describe Bookshelf::API::Controllers::Books::Index do
  let(:action)     do
    described_class.new(repository: repository)
  end

  let(:repository) do
    object_double(Bookshelf::API::Repository.new, all: books)
  end

  let(:books)      { [] }
  let(:body)       { [JSON.dump(books)] }

  it "is successful" do
    response = action.call({})

    expect(response[0]).to eq(200)
    expect(response[2]).to eq(body)
    expect(response[1]['Content-Type']).to match('application/json')
  end

  it "consider */* requests as JSON" do
    response = action.call({"HTTP_ACCEPT" => "*/*"})

    expect(response[0]).to eq(200)
    expect(response[1]['Content-Type']).to match('application/json')
  end

  it "rejects text/xml requests" do
    response = action.call({"HTTP_ACCEPT" => "text/xml"})

    expect(response[0]).to eq(406)
    expect(response[2]).to eq(["Not Acceptable"])
  end
end
```

In order to avoid to hit the database, we use a fake repository to return in memory data. Because actions are objects, we can use [Dependency Injection](http://solnic.eu/2013/12/17/the-world-needs-another-post-about-dependency-injection-in-ruby.html) to pass this collaborator to the constructor.

We have three examples, one to verify a successful base scenario and two for MIME Types acceptance. Look at how it’s **simple** to unit test an action. We instantiate it, invoke `#call` and assert that the returned Rack response has the informations that we’re looking about.

There isn’t need of special glue code with RSpec (no `lotus-rspec` gem). Lotus exposes objects as framework boundary, and because RSpec knows how to test objects, we’re already up and running.

We need to change the production code to make these tests to pass:

```ruby
# controllers/books.rb
module Bookshelf::API::Controllers::Books
  class Index
    include Lotus::Action

    def initialize(repository: Bookshelf::API::Repository.new)
      @repository = repository
    end

    def call(params)
      self.body = JSON.dump(
        @repository.all(:books)
      )
    end
  end
end
```

We can now finally run the entire test suite.

```bash
➜ bundle exec rake
# …
Randomized with seed 22851
....

Finished in 0.0228 seconds (files took 0.1566 seconds to load)
4 examples, 0 failures

Randomized with seed 22851
```

## Server

In order to let our server to run, we need to add a `config.ru` file at the root of the project. This will make it compatible with Rack.

```ruby
require 'bundler/setup'
require_relative './app'

run Bookshelf::API::Application.new
```

To start it:

```bash
➜ bundle exec rackup
Puma 2.15.3 starting...
* Min threads: 0, max threads: 16
* Environment: development
* Listening on tcp://localhost:9292
```

## Conclusion

We have built a lightweight JSON API app in **a few minutes**, by using Lotus.

For reference, when we start our app in production mode, the memory footprint is `21.6 Mb` . If we translate into a Sinatra app, it’s `21.4 Mb`. They perform more or less the same: **~1600 req/s**.

## Next Steps

For advanced features such as cookies, sessions, HTTP caching (Cache Control, Expires and Conditional GET), streamed responses, RESTful resources, redirects, params validations and coercions, etc.. please have a look at the [Lotus guides](http://lotusrb.org/guides/).

For deployment instructions, please refer to the `README` of the [example application](https://github.com/jodosha/lotus-api-example#deployment).

Related articles:

  * [Building Sinatra with Lotus](http://lucaguidi.com/2014/01/28/building-sinatra-with-lotus.html)
  * [Introducing Lotus::Router](http://lucaguidi.com/2014/01/23/introducing-lotus-router.html)
  * [Introducing Lotus::Controller](http://lucaguidi.com/2014/02/23/introducing-lotus-controller.html)
