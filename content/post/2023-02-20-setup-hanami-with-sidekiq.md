---
title: "Setup Hanami with Sidekiq"
image: /covers/setup-hanami-with-sidekiq.jpg
thumbnail: /thumbnails/setup-hanami-with-sidekiq.jpg
date: 2023-02-20
description: |
  Set up a Hanami app with Sidekiq using Docker Compose.
tags:
  - hanami
  - ruby
  - guides
  - howto
  - sidekiq
keywords:
  - "Getting Started"
  - "Setup"
  - "Hanami"
  - "Sidekiq"
  - "Background Job"
  - "Redis"
  - "Web Development"
  - "Ruby"
  - "Framework"
  - "API"
  - "Docker"
  - "Docker Compose"
---

## Introduction

[Sidekiq](https://sidekiq.org/) is the standard in the Ruby ecosystem for background jobs.
This short tutorial will show you how to set up Sidekiq in a [Hanami](https://hanamirb.org/) application using Docker Compose.

**For the basic setup, please look at my previous tutorial**: [Getting Started with Hanami and Docker Compose](/2023/02/13/getting-started-with-hanami-and-docker-compose/).
We'll modify that demo application to support Sidekiq.

## Steps

### 1. Add the Sidekiq gem

```bash
⚡ bundle add sidekiq
```

### 2. Add a Sidekiq provider

Add a Hanami provider for Sidekiq (`config/providers/sidekiq.rb`).

```ruby
# frozen_string_literal: true

Hanami.app.register_provider(:sidekiq) do
  prepare do
    require "sidekiq"
  end

  start do
    Sidekiq.configure_client do |config|
      config.redis = {url: target["settings"].redis_url}
    end

    Sidekiq.configure_server do |config|
      config.redis = {url: target["settings"].redis_url}
    end
  end
end
```

### 3. Create a Base Job

Create a convenience base class for the background jobs (`app/job.rb`).

```ruby
# frozen_string_literal: true

require "sidekiq"

module Bookshelf
  class Job
    def self.inherited(base)
      super
      base.include(Sidekiq::Job)
    end
  end
end
```

### 4. Create a Background Job

Create your first background job (`app/jobs/index_book.rb`).

```ruby
# frozen_string_literal: true

module Bookshelf
  module Jobs
    class IndexBook < Bookshelf::Job
      def perform(_book_id)
        # simulate a long-running job
        sleep 5
      end
    end
  end
end
```

### 5. Configure Sidekiq with Docker Compose

Add a `config/boot.rb` which Sidekiq will use to boot the app code.

```ruby
# frozen_string_literal: true

require_relative "./app"

Hanami.boot
```

Add the `sidekiq` service to `docker-compose.yml`

```
# ...
  sidekiq:
    image: bookshelf
    volumes:
      - ./storage/redis/data:/data
    command: bundle exec sidekiq -r ./config/boot.rb
    env_file:
      - .env
    depends_on:
      - redis
```

### 6. Setup HTTP Sessions

Set up HTTP Sessions (required by Sidekiq Web).

Add a `SESSION_SECRET` to `.env`:

```bash
# ...
SESSION_SECRET="..."
```

Add the corresponding setting to `config/settings.rb`:

```ruby
# frozen_string_literal: true

module Bookshelf
  class Settings < Hanami::Settings
    # ...
    setting :session_secret, constructor: Types::String
  end
end
```

Enable HTTP Sessions into `config/app.rb`:

```ruby
# frozen_string_literal: true

require "hanami"

module Bookshelf
  class App < Hanami::App
    # ...

    config.actions.sessions = :cookie, {
      key: "_bookshelf.session",
      secret: settings.session_secret,
      expire_after: 60 * 60 * 24 * 365
    }
  end
end
```

### 7. Mount Sidekiq Web

Edit `config/routes.rb`:

```ruby
# frozen_string_literal: true

require "sidekiq/web"

module Bookshelf
  class Routes < Hanami::Routes
    # ...
    mount Sidekiq::Web, at: "/sidekiq"
  end
end
```

### 8. Rebuild Docker image

Rebuild the Docker image and restart Docker Compose.

```bash
⚡ docker build -t bookshelf .
```

```bash
⚡ docker compose down
⚡ docker compose up
```

### 9. Try it

Visit `http://localhost:2300/sidekiq`. You should see the Sidekiq Web dashboard.

From another console, ssh into the Sidekiq container.

```bash
⚡ docker exec -it bookshelf-sidekiq-1 /bin/sh
# bundle exec hanami console
```

Then enqueue several times the job:

```ruby
bookshelf[development]> Bookshelf::Jobs::IndexBook.perform_async("books:123")
# repeat several times
```

Go to the browser, and you should see the performed jobs.

## Conclusion

We set up Hanami with Sidekiq in few simple steps.

## Update

If you want to learn this topic from a different angle, check this [Hanami Mastery episode](https://hanamimastery.com/episodes/27-integrate-sidekiq-with-hanami).
