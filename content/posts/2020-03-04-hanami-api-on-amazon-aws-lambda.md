---
title: "Hanami::API on Amazon AWS Lambda"
image: /covers/hanami-api-on-amazon-aws-lambda.jpg
thumbnail: /thumbnails/hanami-api-on-amazon-aws-lambda.jpg
date: 2020-03-04
description: |
  Deploy Hanami::API on Amazon AWS Lambda to build a serverless microservice.
tags:
  - ruby
  - hanami
  - api
  - microservices
---

The [Hanami](https://hanamirb.org) team & I, recently [announced](http://hanamirb.org/blog/2020/02/26/introducing-hanami-api.html) **Hanami::API**: a minimal, extremely fast, lightweight Ruby framework for HTTP APIs.

Its minimalism, the small memory footprint and its performance, make **Hanami::API** a **good candidate to build microservices**.

Today, we're gonna deploy a small service on [Amazon AWS Lambda](https://aws.amazon.com/lambda/).
It's an Amazon AWS product that allows to deploy an autoscaling HTTP service.
You are charged for every 100ms your code executes and the number of times your code is triggered.
Having a fast framework like **Hanami::API** helps to reduce the costs of running a service on AWS Lambda.

## Ruby on Amazon AWS Lambda

By looking at the Amazon AWS Lambda [documentation for Ruby](https://docs.aws.amazon.com/lambda/latest/dg/lambda-ruby.html), the classic _hello world_ function looks like this:

```ruby
# frozen_string_literal: true
require "json"

def handler(event:, context:)
  { event: JSON.generate(event), context: JSON.generate(context.inspect) }
end
```

It's a toplevel function named `handler` that accepts two keyword arguments: `event` and `context`.
The first argument is a free form `Hash` that carries on the optional input.
The last argument is the [execution context](https://docs.aws.amazon.com/lambda/latest/dg/ruby-context.html) of the AWS Lambda function; it exposes information like the `function_name`, or `aws_request_id`.

This design is simple, but it has one problem: it isn't compatible with Ruby HTTP services based on [Rack](https://rack.github.io/), like Hanami::API.

## Rack on Amazon AWS Lambda

When we deploy Ruby HTTP apps, Rack compatible servers take care to transform the raw HTTP request into an input called **Rack env**.
Because on AWS Lambda we don't have a Ruby server, but a generic server that takes care only to pass the incoming request to the AWS Lambda function, we can't expect a Rack compatible framework to work out of the box.

We need to construct manually the **Rack env** from the AWS Lambda `event` argument, and then pass it to the Ruby microservice.

This is a **simplified** version of the code required to process the `event` argument:

```ruby
# frozen_string_literal: true
require "rack"

module AWS
  module Lambda
    module Rack
      def self.env_for(event)
        {
          "REQUEST_METHOD" => event.fetch("httpMethod", "GET"),
          "SCRIPT_NAME" => "",
          "PATH_INFO" => event.fetch("path", "/"),
          "rack.version" => ::Rack::VERSION,
        }
      end
    end
  end
end
```

Please remember that the `event` is a free **form argument**, we're constructing a **convention** to pass special payload attributes to determine the HTTP request (see `httpMethod`), or the path that we want to hit on the service (e.g. `/`).
To establish this convention, we are going to follow AWS Lambda documentation, that uses `"httpMethod"` and `"path"` attributes.

With the Rack env, now we can invoke the Rack app, but we're not done yet.
Because, Rack protocol says that a Rack response is an Array made of three elements (HTTP status code, headers, and body), we need to translate this value back to something meaningful for AWS Lambda.

```ruby
# frozen_string_literal: true
require "rack"

module AWS
  module Lambda
    module Rack
      def self.success(response)
        {
          statusCode: response[0],
          headers: response[1],
          body: response[2].map(&:to_s).join
        }
      end
    end
  end
end
```

Our AWS Lambda handler (`handler.rb`) delegates our `AWS::Lambda` private library:

```ruby
# frozen_string_literal: true

require_relative "./aws/lambda"
require_relative "./app"

$app ||= App.new

def handler(event:, context:)
  AWS::Lambda.call($app, event, context)
end
```

## Hanami::API on Amazon AWS Lambda

Now that we're able to run a Rack based application, it's time to build our service with **Hanami::API**

```ruby
# frozen_string_literal: true

require "bundler/setup"
require "hanami/api"

class App < Hanami::API
  get "/" do
    "Hello, World"
  end
end
```

Because we resolved the mismatch between the AWS Lambda request and Rack, the **Hanami::API** application is completely unware that it's being deployed on AWS Lambda.
This has a **great advantage development process**: you can still keep using a Rack based server (e.g. [Puma](https://puma.io/)) and unit test the service with [`rack-test`](https://github.com/rack-test/rack-test).

We can also receive and send JSON data:

```ruby
# frozen_string_literal: true

require "bundler/setup"
require "hanami/api"
require "hanami/middleware/body_parser"

class App < Hanami::API
  use Hanami::Middleware::BodyParser, :json

  post "/tracks" do
    status 201
    json(track: params[:track])
  end
end
```

## AWS Lambda Deployment

AWS Lambda expects a `.zip` package file to be uploaded on its servers.
Because AWS Lambda don't run `bundle install`, in order to work, our app package **must contain all the Ruby gems that are needed to run the app itself**.

With a bit of Bundle-fu, we can package only the gems that are required in production and excluding testing libraries (e.g. `rspec`).

Our resulting `function.zip` file, which contains the app, `hanami-api`, and all the other Ruby gems, it's only 1.2 Megabyte.
**It can fit into an old `💾` [floppy disk](https://en.wikipedia.org/wiki/Floppy_disk)!**

```bash
⚡ ls -al function.zip
-rw-r--r--  1 luca  staff  1248377 Mar  4 11:38 function.zip
```

## Conclusion

The small code footprint, its great performance, make Hanami::API a natural candidate to run serverless microservices on Amazon AWS Lambda.

For a complete working example, that includes tests, deploy script, and Rack utilities for AWS Lambda, please have a look at this **GitHub repository: [jodosha/hanami-api-amazon-aws-lambda](https://github.com/jodosha/hanami-api-amazon-aws-lambda)**.
