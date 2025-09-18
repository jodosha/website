---
title: "Getting Started with Hanami and Docker Compose"
image: /covers/getting-started-with-hanami-and-docker-compose.jpg
thumbnail: /thumbnails/getting-started-with-hanami-and-docker-compose.jpg
date: 2023-02-13
description: |
  Run Hanami and Redis via Docker Compose
tags:
  - hanami
  - redis
  - docker
  - ruby
  - guides
  - howto
keywords:
  - "Getting Started"
  - "Hanami"
  - "Docker"
  - "Docker Compose"
  - "Redis"
  - "Web Development"
  - "Ruby"
  - "Framework"
  - "API"
---

# Introduction

[Hanami 2.0](https://hanamirb.org/) is the perfect Ruby framework for building robust and fast API applications. The 2.0 version comes without a persistency layer (that will be a 2.2 feature).

Today we'll learn how to set up a Hanami app with a secure Redis instance using Docker Compose in a few steps.

As a prerequisite, you'll need [Docker](https://www.docker.com/), [cURL](https://curl.se/), [Ruby](https://www.ruby-lang.org/en/) 3.2+, and [Hanami](https://hanamirb.org) 2.0+.

# Steps

## 1. Generate the app

Generate a new Hanami 2.0 app.

```bash
⚡ hanami new bookshelf
```

## 2. Configure Docker

Configure a Docker image for the app.
We'll use [Alpine Linux](https://www.alpinelinux.org/) and [multi-stage builds](https://docs.docker.com/build/building/multi-stage/) to reduce the size of the Docker image.

Here's how our `Dockerfile` will look like:

```
FROM ruby:3.0.1-alpine as builder
RUN apk add build-base
COPY Gemfile* ./
RUN bundle install
FROM ruby:3.0.1-alpine as runner
WORKDIR /app
COPY --from=builder /usr/local/bundle/ /usr/local/bundle/
COPY . .
EXPOSE 2300
CMD ["bundle", "exec", "hanami", "server", "--host", "0.0.0.0"]
```

## 3. Set up Docker Compose

As a first thing edit `.env` like the following:

```
REDIS_PASSWORD=secret
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_DB=0
REDIS_URL="redis://:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}/${REDIS_DB}"
```

Then create a `docker-compose.yml` file at the root of the app:

```
version: "3.9"
services:
  app:
    image: bookshelf
    env_file:
      - .env
    ports:
      - 2300:2300
    depends_on:
      - redis
  redis:
    image: redis:7.0-alpine
    restart: unless-stopped
    volumes:
      - ./storage/redis/data:/data
    command: redis-server --protected-mode yes --requirepass $REDIS_PASSWORD
    env_file:
      - .env
```

The Docker image `bookshelf` we declared in the previous step will be used for the primary service `app`.
This service depends on the `redis` service: Docker Compose will boot `redis` first, then `app`.

The Redis installation uses `protected-mode` and a password to enforce the [Redis Security](https://redis.io/docs/management/security/) model.

## 4. Add a Hanami Provider for Redis

Add the `redis` gem:

```bash
⚡ bundle add redis
```

Reference the Redis URL from `.env` in application settings (`config/settings.rb`):

```ruby
# frozen_string_literal: true

module Bookshelf
  class Settings < Hanami::Settings
    setting :redis_url, constructor: Types::Params::String
  end
end
```

Hanami [maps environment variables into settings](https://guides.hanamirb.org/v2.0/app/settings/#using-dotenv-to-manage-environment-variables) entries.
For instance, the env var `REDIS_URL` is automatically detected, read, and assigned to `redis_url` setting.

Create the Hanami Provider for Redis (`config/providers/redis.rb`):

```ruby
# frozen_string_literal: true

Hanami.app.register_provider(:redis) do
  prepare do
    require "redis"
  end

  start do
    client = Redis.new(url: target["settings"].redis_url)

    register "redis", client
  end
end
```

The `target["settings"].redis_url` is referencing the `redis_url` setting that we set up earlier.

## 5. Generate Actions

Generate actions to interact with the app.

We want to the actions accept and produce JSON format. Let's configure in `config/app.rb`

```ruby
# frozen_string_literal: true

require "hanami"

module Bookshelf
  class App < Hanami::App
    config.actions.format :json
  end
end
```

Generate an action to create books:

```bash
⚡ bundle exec hanami generate action books.create
```

Edit it (`app/actions/books/create.rb`):

```ruby
# frozen_string_literal: true

module Bookshelf
  module Actions
    module Books
      class Create < Bookshelf::Action
        include Deps["redis"]

        def handle(req, res)
          req.params[:book] => {id:, **data}
          redis.hset("books:#{id}", data)

          halt 201
        end
      end
    end
  end
end
```

Generate another action to show a book:

```bash
⚡ bundle exec hanami generate action books.show
```

Edit it (`app/actions/books/show.rb`):

```ruby
# frozen_string_literal: true

module Bookshelf
  module Actions
    module Books
      class Show < Bookshelf::Action
        include Deps["redis"]

        def handle(req, res)
          books = redis.hgetall("books:#{req.params[:id]}")
          res.body = books.to_json
        end
      end
    end
  end
end
```

## 6. Try it

Build the Docker image:

```bash
⚡ docker build -t bookshelf .
```

Start the app via Docker Compose:

```bash
⚡ docker compose up
```

Create a book:

```bash
⚡ curl \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"book": {"id": "1", "title": "Hanami book"}}' \
  http://localhost:2300/books

Created
```

Fetch it:

```bash
⚡ curl \
  -H "Accept: application/json" \
  http://localhost:2300/books/1

{"title":"Hanami book"}
```

# Conclusion

We could set up a full working Hanami 2.0 API in a few steps, using Redis as a persistency layer and Docker Compose to run it.
