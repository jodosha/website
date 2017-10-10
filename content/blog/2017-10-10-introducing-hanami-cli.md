---
title: "Introducing hanami-cli"
cover: /covers/introducing-hanami-cli.jpg
thumbnail: /thumbnails/introducing-hanami-cli.jpg
date: 2017-10-10
description: |
  Introducing hanami-cli: a general purpose Command Line Interface (CLI) for Ruby.
  Learn why Hanami replaced thor in favor of hanami-cli and how to use it to build a CLI application in 5 minutes.
tags:
  - ruby
  - hanami
  - command line
---

Introducing `hanami-cli`: a general purpose Command Line Interface (CLI) for Ruby.
Learn why [Hanami](http://hanamirb.org) replaced `thor` in favor of `hanami-cli` and how to use it **to build a CLI application in 5 minutes**.

## Why not `thor`?

For long time we used `thor` 🔨 to build the Command Line Interface (CLI) of Hanami. But as the time passed, we needed more control on the internals of our implementation.

The Hanami 🌸 command line needs **two crucial features**: subcommands and extendibility.

### Subcommands

A subcommand is a nested command under the main executable. For instance `hanami` is the executable and `generate action` is the subcommand.

`thor` doesn't play well with subcommands, which lead to a lot of hacks to make it to work 🙀🙀🙀. We reached a point of code fragility, and immobility. We were afraid to touch it and that made impossible to introduce new features.

### Extendibility

On the other side, to grow an ecosystem around Hanami, we needed **third-party gems** to extend the basic set of subcommands that we provide out of the box.

Imagine a developer who wants to integrate Webpack with Hanami, they can build a gem to make it happen. This gem may need to generate some configuration, so **it can register a subcommand** to do so: `hanami generate webpack`.

This feature was impossible with `thor` because it wasn't designed for it. 😭

## hanami-cli

At this point we decided to roll-out our own solution to solve these problems 💪. Good news are: `hanami-cli` is a **general purpose toolkit to build CLIs** 🙌.

Following our tradition, **we build components that can be used outside of Hanami**, and this is the case for `hanami-cli` too!

To recap: `hanami-cli` is a `thor` alternative to **build your own CLI outside of Hanami**

### A quick example

Let's build a small CLI utility to convert money from one currency to another.

As first thing we generate a new gem via [Bundler](http://bundler.io/):

```shell
$ gem install bundler
$ bundler gem curex
```

Then we create the executable for our gem:

```shell
$ mkdir exe
$ vim exe/curex
```

And now we can edit it:

```ruby
#!/usr/bin/env ruby

require "bundler/setup"
require "curex"
Curex::CLI.new.call
```

Don't forget to give it the right permissions:

```shell
$ chmod +x exe/curex
```

Now we need to setup the `curex.gemspec` file. The fastest way is:

```shell
$ curl https://raw.githubusercontent.com/jodosha/curex/master/curex.gemspec > curex.gemspec
```

At this point we can try to run the executable:

```shell
$ ./exe/curex
./exe/curex:5:in `<main>': uninitialized constant Curex::CLI (NameError)
```

This returns an error because, we haven't implemented our code yet. Let's do it now in `lib/curex.rb`.

```ruby
module Curex
  require "curex/version"

  class CLI
    def call(*args)
    end
  end
end
```

By running the code now, it doesn't raise an exception anymore:

```shell
$ ./exe/curex

```

Our CLI isn't really useful at the moment. Let's build our first command:

```ruby
require "hanami/cli"

module Curex
  require "curex/version"

  class CLI
    def call(*args)
      Hanami::CLI.new(Commands).call(*args)
    end

    module Commands
      extend Hanami::CLI::Registry

      class Convert < Hanami::CLI::Command
        def call(*)
          puts "converting.."
        end
      end

      register "convert", Convert
    end
  end
end
```

We can try it again:

```shell
$ ./exe/curex
Commands:
  curex convert
```

This output indicates the available (sub)commands, in our case we have only `convert`:

```shell
$ ./exe/curex convert
converting..
```

Yay! We have our working CLI, now it needs some logic.

```ruby
require "hanami/cli"
require "bigdecimal"
require "money"
require "money/bank/google_currency"

Money.use_i18n = false
Money.default_bank = Money::Bank::GoogleCurrency.new

module Curex
  require "curex/version"

  class CLI
    def call(*args)
      Hanami::CLI.new(Commands).call(*args)
    end

    module Commands
      extend Hanami::CLI::Registry

      class Convert < Hanami::CLI::Command
        argument :amount, required: true
        argument :from,   required: true
        argument :to,     required: true

        def call(amount:, from:, to:)
          money = Money.new(amount.to_d * 100, from)
          result = money.exchange_to(to)

          puts "#{amount} #{from} == #{result} #{to}"
        end
      end

      register "convert", Convert
    end
  end
end
```

Let's try it again:

```shell
$ ./exe/curex convert
ERROR: "curex convert" was called with no arguments
Usage: "curex convert AMOUNT FROM TO"
```

It now tells us which args are required to run the subcommand:

```shell
$ ./exe/curex convert 100 USD EUR
100 USD == 84,76 EUR
```

It works! 🎉

If you want to expand the command with more hints for your users, please check the [`curex`](https://github.com/jodosha/curex) repository or the [`hanami-cli`](https://github.com/hanami/cli) docs.

## Conclusion

In 5 minutes we were able to build a Command Line Interface (CLI) app with `hanami-cli`.

The first `hanami-cli` (`v0.1.0`) version will be released with `hanami` `v1.1.0` in **October 2017**.

Hanami provides both an integrated web framework (the `hanami` gem) and also a toolkit of general purpose gems like `hanami-cli`.

Indeed, in the near future, both **[dry-rb](http://dry-rb.org/)** and **[Trailblazer](http://trailblazer.to/)** will adopt `hanami-cli` to build their own command lines.

We love Ruby 💎❤️ and we build tools for the entire ecosystem.
