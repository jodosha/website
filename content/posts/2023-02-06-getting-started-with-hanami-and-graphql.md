---
title: "Getting Started with Hanami and GraphQL"
image: /covers/getting-started-with-hanami-and-graphql.jpg
thumbnail: /thumbnails/getting-started-with-hanami-and-graphql.jpg
date: 2023-02-06
description: |
  Create a simple GraphQL service with Hanami and Ruby
tags:
  - graphql
  - hanami
  - ruby
  - guides
  - howto
keywords:
  - "Getting Started"
  - "Hanami"
  - "GraphQL"
  - "Web Development"
  - "Ruby"
  - "Framework"
  - "API"
---

# Introduction

[Hanami 2.0](https://hanamirb.org/) is a productive Ruby framework that quickly supports you in building API applications.

Today we will see how to get started with Hanami and GraphQL in ten steps.

We will create the app and a simple code to support the GraphQL schema with a simple Query, including a request spec. The theme is a classic Star Wars schema.

As a prerequisite, you'll need Ruby 3.2 and Hanami 2.0.3.

# Steps

## 1. Generate the app

Generate a new Hanami 2.0 app.

```bash
⚡ hanami new star_wars
```

## 2. Create a request spec

Hanami encourages BDD/TDD, so let's start with a failing spec.

```ruby
# frozen_string_literal: true

require "json"

RSpec.describe "GraphQL", type: :request do
  it "is successful" do
    query = <<~QUERY
      query getFilm($filmId: ID!) {
        film(id: $filmId) {
          title
        }
      }
    QUERY

    variables = {"filmId" => "1"}

    post "/graphql", {query: query, variables: variables}, {"CONTENT_TYPE" => "application/graphql"}

    expect(last_response).to be_successful
    expect(last_response.headers).to include("Content-Type" => "application/graphql; charset=utf-8")
    expect(JSON.parse(last_response.body)).to eq("data" => {"film" => {"title" => "A New Hope"}})
  end
end
```

Keep running this spec with `bundle exec rake`.

## 3. Add the GraphQL gem

Add the GraphQL gem.

```bash
⚡ bundle add graphql
```

Add the new GraphQL MIME Type to the application (`config/app.rb`).

```ruby
config.actions.formats.add(:graphql, "application/graphql")
```

## 4. Add the persistence layer

Hanami 2.0 comes without a persistence layer. We will ship it with the 2.2 version.
For now, mimic the persistency layer by adding a struct (`app/structs/film.rb`):

```ruby
# auto_register: false
# frozen_string_literal: true

module StarWars
  module Structs
    Film = Data.define(:id, :title)
  end
end
```

...and a repository (`app/repositories/film_repository.rb`).

```ruby
# frozen_string_literal: true

module StarWars
  module Repositories
    class FilmRepository
      def find(id)
        Structs::Film.new(id: id, title: "A New Hope")
      end
    end
  end
end
```

The `# auto_register: false` _magic comment_ will tell the Hanami application to [not auto-register the struct as a component](https://guides.hanamirb.org/v2.0/app/container-and-components/#opting-out-of-the-container).

## 5. Add the Film type

Add a GraphQL Type for the Film (`app/graphql/types/film.rb`).

```ruby
# auto_register: false
# frozen_string_literal: true

require "graphql/schema/object"

module StarWars
  module Graphql
    module Types
      class Film < GraphQL::Schema::Object
        field :title, String, null: false
      end
    end
  end
end
```

## 6. Add the GraphQL Query

Add the GraphQL Query Type (`app/graphql/query.rb`).

```ruby
# auto_register: false
# frozen_string_literal: true

require "graphql/schema/object"

module StarWars
  module Graphql
    class Query < ::GraphQL::Schema::Object
      description "The query root of this schema"

      # First describe the field signature:
      field :film, Types::Film, "Find a film by ID" do
        argument :id, ID
      end

      # Then provide an implementation:
      def film(id:)
        Repositories::FilmRepository.new.find(id)
      end
    end
  end
end
```

## 7. Add the GraphQL schema

Add the GraphQL Schema (`app/graphql/schema.rb`).

```ruby
# auto_register: false
# frozen_string_literal: true

require "graphql"
require "graphql/schema"

module StarWars
  module Graphql
    class Schema < ::GraphQL::Schema
      query Graphql::Query
    end
  end
end
```

## 8. Generate a Hanami Action

Now that we have set up the GraphQL part, we can generate an action.

```bash
⚡ bundle exec hanami generate action graphql.show --url=/graphql --http=POST
```

Remove the unit test (`rm spec/actions/graphql/show_spec.rb`).

## 9. Edit the Hanami Action

Edit the action (`app/actions/graphql/show.rb`).

```ruby
# frozen_string_literal: true

module StarWars
  module Actions
    module Graphql
      class Show < StarWars::Action
        format :graphql

        params do
          required(:query).filled(:string)
          optional(:variables).maybe(:hash)
        end

        def initialize(schema: StarWars::Graphql::Schema, **)
          @schema = schema
          super(**)
        end

        def handle(req, res)
          halt 400, req.params.errors unless req.params.valid?

          req.params => {query:, variables:}
          res.body = schema.execute(query, variables:).to_json
        end

        private

        attr_reader :schema
      end
    end
  end
end
```

## 10. Dump the GraphQL schema

Dump the schema by adding the following Rake task in `Rakefile`.

```ruby
# frozen_string_literal: true

require "hanami/rake_tasks"
require "graphql/rake_task"

GraphQL::RakeTask.new(schema_name: "StarWars::Graphql::Schema", directory: "public")
```

```bash
⚡ bundle exec rake graphql:schema:dump
```

# Conclusion

That's ten simple steps to get started with Hanami 2.0 and GraphQL.

