---
title: "Open Source Updates: Q1 2021"
image: /covers/open-source-updates.jpg
thumbnail: /thumbnails/open-source-updates.jpg
date: 2021-04-12
description: |
  Open Source progress in Q1 2021.
tags:
  - "open source"
  - ruby
  - hanami
---

## Hanami CI stability

I was one of the early adopters of Travis CI, but in more than a decade the service that served so well the Open Source community is not the first class solution that it used to be.

We decided to migrate to GitHub Actions, so **I spent time to migrate all the Hanami gems to GitHub Actions**. Not all the Open Source work is for the game of the fame.

If you want to keep an eye on the healthiness of Hanami, have a look at the [Hanami status page](https://hanamirb.org/status/).

## Hanami CLI

The other biggest news is that **I'm working on Hanami 2.0 CLI**.

The most annoying CLI part is to work on code generators, because they are full of options, they require internal framework introspection, and dealing with tests that touch the file system isn't the most pleasant experience.

But leveraging the lastest features from `dry-cli` (see the next section), the [work](https://github.com/hanami/cli) is going **pretty smooth**.

## `dry-cli` file utils enhancements

This CLI framework, that I extracted from Hanami 1.0, has builtin files utilities (extracted from `hanami-utils`).
This module provides a very good unified abstraction for file manipulation: create, delete files, but also inject and remove contents from them.

The problem is that it hardcodes Ruby's `File` and `FileUtils`, so it doesn't play well with Dependency Injection, and it forces the final user to write integration tests that work with the Operating System real _file system_.

To solve my own problem (building `hanami-cli`), I [reworked](https://github.com/dry-rb/dry-cli/pull/112) these file utilities to **work with Dependency Injection** and to allow **in memory file system for fast and easy unit tests** for code generators.

## Hanami::API DSL

`hanami-api` can be now used not just to build [blazing fast Ruby web apps](https://twitter.com/hanamirb/status/1364925421951848449), but also to **build frameworks out of it**.

Imagine **you're building a Ruby web framework**, or simply you need a routing DSL. You declare a superclass like this:

```ruby
# framework.rb
require "hanami/api"

module Framework
  class App
    def self.inherited(base)
      super
      base.extend(Hanami::API::DSL)
    end
  end
end
```

Then in your app, you inherit from your superclass, which has now a `.routes` class method that can wrap all the routes. Within that block you have all the Hanami::API methods available.

```ruby
 # app.rb
require "framework/app"

class MyApp < Framework::App
  routes do
    root { "Hello, World!" }
  end
end
```

In `config.ru` (for Rack web servers), you just initialize your app.

```ruby
# config.ru
require_relative "./app"

run MyApp.new
```

## Hanami routes inspection

With the `hanami-router` 2.0 rewriting, I had to [rework](https://github.com/hanami/router/pull/208) the [inspection](https://github.com/hanami/router/pull/212) of the routes.
This feature produces a long string blob that containts all the routes of an application in a pretty printed formatted way.

## Sponsorship

I want to thank my [sponsors](/sponsors) that support my Open Source work.

👉
**[Please consider to becoming my sponsor.](https://github.com/sponsors/jodosha)**
👈

---

Until the next quarter. 😎
