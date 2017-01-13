---
cover: /covers/isolate-global-state.jpg
thumbnail: /thumbnails/isolate-global-state.jpg
date: 2016-12-27
description: |
  Using global state in software programs, is handy for development, but evil to maintain.
  It can easily become source of bugs.
  We'll learn from Hanami source code why this is a problem and how we fixed it.
tags:
  - programming
  - ruby
  - design patterns
  - hanami
title: Isolate Global State
aliases:
  - /2016/12/27/isolate-global-state/
  - /2016/12/27/isolate-global-state.html
---

Using global state in software programs, is handy for development, but evil to maintain.

It can easily become source of **bugs** that are triggered by edge cases which are hard to track down.

Let's see why, and how we can mitigate the problem.

## An Example Of The Problem

For instance, in Hanami code base we need to test how the framework configures itself according to certain env variables.

We **used** to test like this:

{{< highlight ruby >}}
RSpec.describe Hanami::Environment do
  before do
    ENV['HANAMI_ENV']  = nil
    ENV['RACK_ENV']    = nil
    ENV['HANAMI_HOST'] = nil
    ENV['HANAMI_PORT'] = nil

    # ...
  end

  context "when HANAMI_ENV is set" do
    before do
      ENV['HANAMI_ENV'] = 'production'
      @env = described_class.new
    end

    # ...
  end
end
{{< / highlight >}}

We used to **reset all the env vars before of each test**, and setup only the one that we needed for a specific context.

The **problem** with this approach is that it **pollutes** the global state of the Ruby process. When we run that spec file alone, it works because of the reset in the `before` block.

But when it comes to run the entire test suite, the specs are shuffled and the env vars cleanup doesn't work all the times.

If a spec alters the `ENV` state and it doesn't cleanup, the next one that is ran will **inherit** the `ENV` changes and it may not work as expected.

Sometimes the alteration is **explicit** like in the example above, so we can cleanup with an `after` block. But some other times the mutation it's a **side effect** triggered by something else far away from our eyes.

This is the source of bugs, and hairy edge cases which are hard to debug.

**For long time, the combination of multiple global states led Hanami to have brittle CI builds and bugs.**

In my experience of developer, I can tell you that the only way to mitigate this kind of problems is to **isolate global state**, or **avoid it at all**. We're moving **Hanami** internal implementation to **reduce global state as much as possible**.

## A Solution For Our Problem

For this specific case we introduced a new object to isolate `ENV`, it's called `Hanami::Env`.

{{< highlight ruby >}}
module Hanami
  class Env
    def initialize(env: ENV)
      @env = env
    end

    def [](key)
      @env[key]
    end

    def []=(key, value)
      @env[key] = value
    end

    # ...
  end
end
{{< / highlight >}}

The implementation is trivial: **it encapsulates `ENV` access**.

We define **our own interface to manage env vars**. We depend upon this **abstraction** (`Hanami::Env`), rather than the concrete implementation (`ENV`) (see [Dependency Inversion Principle](https://en.wikipedia.org/wiki/Dependency_inversion_principle)).

From `Hanami::Environment`, which is responsible of setup the env vars for a project, we use it like this:

{{< highlight ruby >}}
module Hanami
  class Environment
    def initialize(options)
      opts = options.to_h.dup
      @env = Hanami::Env.new(env: opts.delete(:env) || ENV)

      # ...
    end
  end
end
{{< / highlight >}}

When we use our Hanami project, the `:env` option is **not set**. This causes `@env` to reference `ENV` and it read/write from/to the real env variables of the Ruby process.

But during the test of `Hanami::Environment`, we can simplify a lot the code and **avoid shared mutable state** (aka `ENV`). We pass as `:env` option an object that behaves like `ENV`, but it isn't `ENV`: a `Hash`.

{{< highlight ruby >}}
RSpec.describe Hanami::Environment do
  context "when HANAMI_ENV is set" do
    let(:env) {
      Hash["HANAMI_ENV" => "production"]
    }

    it "tests something interesting"
      @env = described_class.new(env: env)  
    end

    # ...
  end
end
{{< / highlight >}}

## Conclusion

With the proper usage of [Encapsulation](https://en.wikipedia.org/wiki/Encapsulation_(computer_programming)) and [Dependency Injection](http://solnic.eu/2013/12/17/the-world-needs-another-post-about-dependency-injection-in-ruby.html), the mutations that happen during each single test aren't visible to the rest of the process. This results in a reliable test suite and a solid design of the Hanami internals.
