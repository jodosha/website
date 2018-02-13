---
title: "How To Test Ruby CLI: Console"
image: /covers/how-to-test-ruby-cli-console.jpg
thumbnail: /thumbnails/how-to-test-ruby-cli-console.jpg
date: 2017-02-08
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

One of the most **interesting challenges** I met during [Hanami](http://hanamirb.org) development is to write isolated integration tests. The framework ships with an extensive Command Line Interface (CLI) to generate (or destroy) code, start the server, open a Ruby (or a database) console, create/drop the database, run the migrations, precompile assets, and print informations.

## Console

Hanami console is an interactive [REPL](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop) based on [IRB](https://en.wikipedia.org/wiki/Interactive_Ruby_Shell), which is useful to interact with the objects defined in a project.

```ruby
➜ hanami console
irb(main):001:0> repository = AuthorRepository.new
=> #<AuthorRepository:0x007fdc917373a8 ...>
irb(main):002:0> repository.all
=> []
irb(main):003:0> author = repository.create(name: "Luca")
=> #<Author:0x007fdc9170dd78 @attributes={:id=>1, :name=>"Luca", :created_at=>2017-02-07 09:39:46 UTC, :updated_at=>2017-02-07 09:39:46 UTC}>
irb(main):004:0> author.id
=> 1
irb(main):005:0> repository.all
=> [#<Author:0x007fdc916f70c8 @attributes={:id=>1, :name=>"Luca", :created_at=>2017-02-07 09:39:46 UTC, :updated_at=>2017-02-07 09:39:46 UTC}>]
irb(main):006:0>
```

## How To Test Console

In order to test the console the test generates a fresh project (see [`with_project`](/2017/01/20/how-to-test-ruby-cli-the-setup)), it installs the dependencies, setup the database. Now I want to be able to programmatically interact with the console.

```ruby
RSpec.describe "hanami console", type: :cli do
  context "irb" do
    it "starts console" do
      with_project("bookshelf_console_irb", console: :irb) do
        setup_model

        console do |input, _, _|
          input.puts("Hanami::VERSION")
          input.puts("Web::Application")
          input.puts("Web.routes")
          input.puts("BookRepository.new.all.to_a")
          input.puts("exit")
        end

        expect(out).to include(Hanami::VERSION)
        expect(out).to include("Web::Application")
        expect(out).to include("#<Hanami::Routes")
        expect(out).to include("[]")
        expect(out).to include("[#{project_name}] [INFO]")
        expect(out).to include("SELECT `id`, `title` FROM `books` ORDER BY `books`.`id`")
      end
    end
  end # irb

  # ...
end
```

The [`console`](https://github.com/hanami/hanami/blob/master/spec/support/hanami_commands.rb#L27) spec helper [uses](https://github.com/hanami/hanami/blob/master/spec/support/bundler.rb#L77) [`Open3`](https://docs.ruby-lang.org/en/2.4.0/Open3.html) from Ruby Standard Library to start a child process for the console. Specifically, I use `Open3.popen3` with a proc to create a blocking execution of the console commands. That means the first part of the test simulates the inputs, while the second part asserts the output.

The `console` block yields `input`, which represents the stream for the console standard input. Just by using [`IO#puts`](http://ruby-doc.org/core-2.4.0/IO.html#method-i-puts), I'm able to **simulate a human that types the commands**.

When IRB receives `"exit"`, it terminates the child process. At this point the thread for the child process is freed so I can capture the output and make it available as `out` variable.

The last part of the test asserts:

  * The Hanami version
  * That the Hanami applications and their routes are accessible from the console
  * The user is able to query the database via a repository
  * The database queries are logged in the console

## Conclusion

I oversimplified the explanation for this article. If you want to level up your Ruby skills, it may worth to have a closer look at the [code behind](https://github.com/hanami/hanami/blob/master/spec/support/bundler.rb#L77) it.

To test Hanami CLI is complex: it requires **a reliable CI build** (with full isolation of each spec), and **a deep knowledge of the Ruby toolchain**. **Next time we'll talk about testing the Hanami server**.
