---
title: "How To Test Ruby CLI: The Setup"
image: /covers/how-to-test-ruby-cli-the-setup.jpg
thumbnail: /thumbnails/how-to-test-ruby-cli-the-setup.jpg
date: 2017-01-20
description: |
  One of the most difficult tasks I met during Hanami development is to write integration tests for the Command Line Interface (CLI).
  This challenge required a deep knowledge of the Ruby toolchain.
tags:
  - ruby
  - command line
  - testing
series:
  - how to test ruby cli
---

One of the most **interesting challenges** I met during [Hanami](http://hanamirb.org) development is to write isolated integration tests.
The framework ships with an extensive Command Line Interface (CLI) to generate (or destroy) code, start the server, open a Ruby (or a database) console, create/drop the database, run the migrations, precompile assets, and print informations.

## Full Isolation

As I want to have integration tests to **use CLI commands for real**, the test suite is free of mocks/stubs.
When I ran it, only real commands are executed against the shell.

In this realistic scenario, I **can't use fixtures**: the cost of maintaining them is too high.
Instead, **each single spec generates** at the runtime **a new Hanami project** (via `hanami new`) with a given set of preconditions.

You may want to use `pry` as gem of choice for your Hanami console, or precompile `sass` assets.
Did you forget to create the database before to migrate?
There is a test for that!

There is only one way to guarantee correctness for these specs, and it is to run them in **full isolation**.
The `ci` script looks for all the specs in `spec/integration` and it runs them one by one via `rspec path/to/my_spec.rb`.
This is important: **each spec uses its own fresh Hanami project in a separated Ruby process**.

## Preparatory Steps

This is a basic integration test to verify that the CLI command `hanami version` will print the current Hanami version.

```ruby
RSpec.describe 'hanami version', type: :cli do
  it 'prints current version' do
    with_project do
      run_command 'hanami version', "v#{Hanami::VERSION}"
    end
  end
end
```

When the build starts there are a lot of preparatory steps.
Let's see what happens before this spec is executed.

Hanami uses [Bundler](http://bundler.io) to manage development dependencies.
I want to use the _"under-development"_ version of each Hanami framework.
To do that, here's how I declare the dependency:

```ruby
# Gemfile
# ...
gem "hanami-utils", github: "hanami/utils"
```

This specifies to use `hanami-utils` from the GitHub repository, instead of the latest version from Rubygems.
Bundler will clone the repository and `hanami-utils` source code will be **copied** in a **directory**.

But in order to make the tests real, **I want to install Hanami frameworks as a gem**, instead of using their code from a directory.

For this purpose the `ci` script runs `bundle package --all`.
This command copies all the gems (`*.gem`) into `vendor/cache`.
For all the dependencies declared with `:github`, it copies the updated repository into `vendor/cache` as well.

Here's a simplified version of Hanami [`Gemfile`](https://github.com/hanami/hanami/blob/master/Gemfile):

```ruby
# Gemfile
source "https://rubygems.org"

gem "i18n"
gem "hanami-utils", github: "hanami/utils"

# ...
```

That Bundler command will copy `vendor/cache/i18n-0.7.0.gem` and `vendor/cache/utils-36a630acaf9e/` (**still as a directory**).

Then I use another [script](https://github.com/hanami/hanami/blob/master/script/setup#L17) to packages each Hanami framework into a gem (eg: `vendor/cache/hanami-utils-1.0.0.beta1.gem`).

After that, the script [generates an index](http://guides.rubygems.org/command-reference/#gem-generate_index) of all the vendored gems (in `vendor/cache`).

## Spec Execution

Now that all the dependencies are installed as a gem, the build can execute the single spec.

The method [`with_project`](https://github.com/hanami/hanami/blob/master/spec/support/with_project.rb#L13) (_see the example above_) is a testing facility that does a lot of useful things.
It creates a **temporary directory**, it changes the current Ruby directory to into the temporary one (see [`Dir.chdir`](https://ruby-doc.org/core/Dir.html#method-c-chdir)), and **it generates a new full blown Hanami project**.

### Vendored Gems

When you generate a new Hanami project, its `Gemfile` uses Rubygems as `source`, but because I want to use the vendored gems, `with_project` patches the `Gemfile` for the new generated project:

```ruby
# tmp/aruba/bookshelf/Gemfile
source 'file://vendor/cache'

# ...
```

Yes, **Bundler allows the `source` to be a directory**, only if that directory has an index of all the gems.
This is why the `ci` script generates that index as last step of the setup (see above).

At this point, `with_project` runs `bundler install --local`, so the new generated project can use the vendored gems.

### Run Commands

Now it can finally yield the block inside `with_project`.
For our example it runs the `hanami version` command and it verifies if the output is correct.

This set of operations are delegated to [`run_command`](https://github.com/hanami/hanami/blob/master/spec/support/cli.rb#L19).
It's a wrapper on top of [Aruba](https://github.com/cucumber/aruba), a great CLI testing framework.

This `run_command` method, guarantees that the Hanami commands used at the testing time, are coming from the vendored gems.
It also has the responsibility **of running a given command via a system call**, and to verify if `stdout`/`stderr` streams have the expected output.
As last verification, it checks if the exit code was successful.

### Cleanup

After the block is yielded, `with_project` cleans the temporary directory, which wipes the Hanami project used during that test.
This prevents the same project to be used twice.

## Conclusion

To test Hanami CLI is complex: it requires **a reliable CI build** (with full isolation of each spec), and **a deep knowledge of the Ruby toolchain**.
If this looks complex, I can tell you we've just scratched the surface.
**Next time we'll talk about code generators**.
