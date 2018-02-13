---
cover: /covers/building-sinatra-with-lotus.jpg
thumbnail: /thumbnails/building-sinatra-with-lotus.jpg
date: 2014-01-28
description: |
  The beauty of Lotus is the composition of its frameworks. Each of them is well designed to achieve one and only one goal. The main advantage of this architecture is that delevopers can easily use and reuse those frameworks in countless ways. Lotus::Router accepts anonymous functions as endpoints. This feature can be used to build Sinatra with it.
tags:
  - lotus
title: Building Sinatra with Lotus
---

The beauty of [Lotus](http://lotusrb.org) is the composition of its frameworks. Each of them is well designed to achieve one and only one goal.
The main advantage of this architecture is that delevopers can easily use and reuse those frameworks in countless ways.

[Lotus::Router](/2014/01/23/introducing-lotus-router.html) accepts anonymous functions as endpoints.
This feature can be used to build [Sinatra](http://sinatrarb.com) with it.

## Initial setup

We need to setup a `Gemfile` with:

{{< highlight ruby >}}
source 'https://rubygems.org'
gem 'lotus-router'
{{< / highlight >}}

As second step, we create an _Hello World_ application with Lotus::Router (run with `rackup application.rb`):

{{< highlight ruby >}}
require 'rubygems'
require 'bundler/setup'
require 'lotus/router'

Application = Rack::Builder.new do
  app = Lotus::Router.new do
    get '/' do
      [200, {}, ['Hello, World!']]
    end
  end
  run app
end.to_app
{{< / highlight >}}

## Return value of the block as response body

You may have noticed a discrepancy between the typical Sinatra usage and the example above: __the framework sets the return value of that endpoint as the body of the response__, here we're returning a serialized Rack response.

Internally, Lotus::Router uses [Lotus::Routing::Endpoint](http://rdoc.info/gems/lotus-router/Lotus/Routing/Endpoint) to wrap application's endpoints.
They can be any type of object that respond to `#call`, and it's up to us to return a `Rack::Response`.
In our case, we have just a string, if we inherit from that class, we can wrap the body in a proper response:

{{< highlight ruby >}}
class Endpoint < Lotus::Routing::Endpoint
  def call(env)
    [200, {}, [super]]
  end
end
{{< / highlight >}}

The next step is to use this endpoint.

Lotus::Router uses a __specific set of rules__ to understand which endpoint needs to be associated with a given path.
For instance, when you write `get '/dashboard', to: 'dashboard#index'`, that `:to` option is processed and the router will look for a `DashboardController::Index` class.

[Those](https://github.com/lotus/router#duck-typed-endpoints) [conventions](http://rdoc.info/gems/lotus-router/Lotus/Routing/EndpointResolver#resolve-instance_method) are implemented by [Lotus::Routing::EndpointResolver](http://rdoc.info/gems/lotus-router/Lotus/Routing/EndpointResolver), which is [used as default resolver](https://github.com/lotus/router/blob/master/lib/lotus/routing/http_router.rb#L43).
If you want to use __a different policy__, or __customize__ the way it works, pass your own resolver to the router constructor (`:resolver` option).
We want to use the defaults, and only specify to usa of our custom endpoint.

{{< highlight ruby >}}
require 'rubygems'
require 'bundler/setup'
require 'lotus/router'

class Endpoint < Lotus::Routing::Endpoint
  def call(env)
    [200, {}, [super]]
  end
end

r = Lotus::Routing::EndpointResolver.new(endpoint: Endpoint)

Application = Rack::Builder.new do
  app = Lotus::Router.new(resolver: r) do
    get '/' do
      'Hello, World!'
    end
  end
  run app
end.to_app
{{< / highlight >}}

## Request params

Now that we have mimicked the simplest Sinatra usage, let's have a look at the next example: request params.
`Endpoint` is agnostic, it's part of an HTTP router, that's why it passes the complete Rack `env` to the real endpoint that it wraps.
Instead, we want to use only the tokens coming from the URL. This is really simple to do:

{{< highlight ruby >}}
require 'rubygems'
require 'bundler/setup'
require 'lotus/router'

class Endpoint < Lotus::Routing::Endpoint
  def call(env)
    [200, {}, [super(params(env))]]
  end

  private
  def params(env)
    env.fetch('router.params')
  end
end

r = Lotus::Routing::EndpointResolver.new(endpoint: Endpoint)

Application = Rack::Builder.new do
  app = Lotus::Router.new(resolver: r) do
    get '/' do
      'Hello, World!'
    end

    get '/greet/:planet' do |params|
      "Hello from the #{ params[:planet] }!"
    end
  end
  run app
end.to_app
{{< / highlight >}}

## A step further

What we did until now it's great but noisy.
We want to extract the boilerplate code into a separated file.
I've prepared a [microgem](http://jeffkreeftmeijer.com/2011/microgems-five-minute-rubygems/) to be used with our `Gemfile`.

{{< highlight ruby >}}
source 'https://rubygems.org'
gem 'lotus-sinatra', git: 'https://gist.github.com/8665228.git'
{{< / highlight >}}

Now we can leave that beautiful DSL alone.

{{< highlight ruby >}}
require 'rubygems'
require 'bundler/setup'
require 'lotus-sinatra'

get '/' do
  'Hello, World!'
end

get '/greet/:planet' do |params|
  "Hello from the #{ params[:planet] }!"
end
{{< / highlight >}}

## Conclusion

This example confirms how valuable is the separation between Lotus frameworks and that Dependency Injection __is__ a [virtue](http://solnic.eu/2013/12/17/the-world-needs-another-post-about-dependency-injection-in-ruby.html).

{% include _lotusml.html %}
