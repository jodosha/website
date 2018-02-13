---
title: "How To Test Ruby CLI: Code Generators"
image: /covers/how-to-test-ruby-cli-code-generators.jpg
thumbnail: /thumbnails/how-to-test-ruby-cli-code-generators.jpg
date: 2017-02-01
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

## Code Generators

Code generators is a helpful feature that allows to generate code files. The main purpose is to speedup the development process. Hanami has [code generators](http://hanamirb.org/guides/command-line/generators) for projects, apps, actions, models, and migrations. Here's an example:

```shell
➜ hanami generate model book
      create  lib/bookshelf/entities/book.rb
      create  lib/bookshelf/repositories/book_repository.rb
      create  db/migrations/20170131083319_create_books.rb
      create  spec/bookshelf/entities/book_spec.rb
      create  spec/bookshelf/repositories/book_repository_spec.rb
```

This generator creates an entity, a repository, a migration and the related testing code.

## How To Test Code Generators

There are a few things to verify that a code generator is working as expected. The first one is the [exit code](http://tldp.org/LDP/abs/html/exit-status.html) of the command, then we can verify the output of the command, and finally inspect the files.

```ruby
it 'generates model' do
  input      = "book"
  model      = "book"
  class_name = "Book"
  table_name = "books"
  project    = "bookshelf"

  with_project(project) do
    output = [
      "create  lib/#{project}/entities/#{model}.rb",
      "create  lib/#{project}/repositories/#{model}_repository.rb",
      /create  db\/migrations\/(\d+)_create_#{table_name}.rb/,
      "create  spec/#{project}/entities/#{model}_spec.rb",
      "create  spec/#{project}/repositories/#{model}_repository_spec.rb"
    ]

    run_command "hanami generate model #{input}", output

    expect("lib/#{project}/entities/#{model}.rb").to have_file_content <<-END
class #{class_name} < Hanami::Entity
end
END

    # ...
  end
end
```

This is a simplified version of the [testing code](https://github.com/hanami/hanami/blob/master/spec/support/shared_examples/cli/generate/model.rb).

I use the [`with_project` helper](/2017/01/20/how-to-test-ruby-cli-the-setup), to setup a new Hanami project at the runtime. Within its block the commands are run at the root of this fixture project.

The `output` variable sets the expected lines of output of the `hanami generate` command. Each element in the array is a matcher for a line of output. If you look at the example output above, you can spot the similarities.

When the test invokes `run_command`, it uses a real shell command to actually generate these files. I pass the command as first argument and the expected output as second one. The helper asserts that the exit code of the command is successful.

At this point I want to verify that the files were generated correctly. [Aruba](https://github.com/cucumber/aruba), the CLI testing framework used here, offers convenient [RSpec matchers](https://github.com/cucumber/aruba/tree/master/lib/aruba/matchers) like `be_an_existing_file`.

Using the `have_file_content` matcher, I can assert that the generated file has the expected contents.

## Conclusion

To test Hanami CLI is complex: it requires **a reliable CI build** (with full isolation of each spec), and **a deep knowledge of the Ruby toolchain**. **Next time we'll talk about testing the Hanami console**.
