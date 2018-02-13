---
image: /covers/25000-requests-per-second-for-rack-json-api-with-mruby.jpg
thumbnail: /thumbnails/25000-requests-per-second-for-rack-json-api-with-mruby.jpg
date: 2015-12-09
description: |
  Use MRuby with H2O and Redis to build a Rack JSON API that servers 25,000+ requests per second.
tags:
  - api
  - lotus
  - hanami
  - json
  - ruby
  - mruby
title: 25,000+ Req/s for Rack JSON API with MRuby
slug: 25000-requests-per-second-for-rack-json-api-with-mruby
categories:
  - featured
---

Last month I gave the [closing keynote](https://speakerdeck.com/jodosha/lotus-rubyday-2015) at [RubyDay 2015](http://www.rubyday.it) by talking about [Lotus](http://lotusrb.org) and the future of Ruby.

For the attendees, the most surprising part of my speech was about [MRuby](http://mruby.org). It’s a minimal version of Ruby, that can be embedded in any system that supports C.

I think that this technology can play a key role for Ruby in the next years. The simplicity of the language can be used within complex systems.

Imagine if Vim, Postgres, Redis, Nginx, Arduino, Raspberry PI, Android, Windows DLLs, Git, GTK, WebKit, V8, just to name a few **can speak Ruby**. There are endless possibilities to use it today.

## Ruby Is Slow

We know that Ruby is slow. A simple _”hello world”_ Rack application has a poor performance if compared with other HTTP libraries for other languages.

If we use [lightweight frameworks](/2015/11/24/json-api-apps-with-lotus.html) for Ruby like [Lotus](http://lotusrb.org) (or Sinatra) to build a simple JSON API app, we get only `~1,600` requests per second.

## MRuby JSON API Application

There is a new HTTP web server called [H2O](https://h2o.examp1e.net), which is really, really fast. The team recently released a new version with MRuby support.

We can use it to build a high-speed microservice that speaks [Rack](http://rack.github.io) and returns a JSON payload. For simplicity, we employ [Redis](http://redis.io) as data store.

### How MRuby Works?

When H2O is compiled, it embeds a MRuby interpreter that can be used to run Ruby code. In our case we use it to build a **Rack application**.

By default the official build [bundles](https://github.com/h2o/h2o/tree/master/deps) a lot of _“mgems”_ (MRuby gems), but it lacks of support for Redis.

For this reason we have to compile and deploy our own version of H2O.

### Redis Support

We need to [download](https://github.com/h2o/h2o/releases) and unpack the source code from GitHub and add [Hiredis](https://github.com/redis/hiredis) bindings by cloning [mruby-hiredis](https://github.com/Asmod4n/mruby-hiredis) under `deps/mruby-hiredis`.

With `cmake` and `gcc` we compile and install it.

{{< highlight bash >}}
➜ cmake -DCMAKE_C_FLAGS_RELEASE= \
    -DCMAKE_CXX_FLAGS_RELEASE= \
    -DCMAKE_INSTALL_PREFIX=./dist \
    -DCMAKE_BUILD_TYPE=Release \
    -DCMAKE_FIND_FRAMEWORK=LAST \
    -DCMAKE_VERBOSE_MAKEFILE=ON \
    -Wno-dev

➜ make
➜ make install
{{< / highlight >}}

### Rack Application

Now we can write our Rack application that reads `"foo"` key from Redis and return it as JSON payload.

{{< highlight ruby >}}
class JsonApi
  def initialize
    @storage = Hiredis.new
    @storage['foo'] = 'bar'
  end

  def call(env)
    body = JSON.generate({foo: @storage['foo']})

    [
      200,
        {'Content-Type'   => 'application/json',
         'Content-Length' => body.size},
       [body]
     ]
  end
end

JsonApi.new
{{< / highlight >}}

We start the server and test it.

{{< highlight bash >}}
➜ curl http://localhost:8080/json_api/
{"foo":"bar"}
{{< / highlight >}}

### Benchmark

If we measure the speed with [wrk](https://github.com/wg/wrk), the results are astonishing: **28,000+ requests per second**.

{{< highlight bash >}}
➜ wrk --threads 2 --duration 10 \
http://localhost:8080/json_api/

Measuring /json_api
Running 10s test @ http://localhost:8080/json_api/
  2 threads and 10 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   389.09us  328.37us   9.64ms   93.09%
    Req/Sec    14.24k     2.54k   18.09k    76.24%
  286091 requests in 10.10s, 55.11MB read
Requests/sec:  28326.73
Transfer/sec:      5.46MB
{{< / highlight >}}

The numbers are more impressive for a [“hello world” version](https://github.com/jodosha/mruby-rack-json-api/blob/master/app/hardcoded.rb) that doesn’t use JSON and Redis. We get **120,000+ requests per second**.

### Demo

For a ready setup of H2O, MRuby, Redis and Rack, please use this [GitHub repository](https://github.com/jodosha/mruby-rack-json-api) that I’ve created for you. It ships with scripts to compile, install, start the server and run the benchmarks.
