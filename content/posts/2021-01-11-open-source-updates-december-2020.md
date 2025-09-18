---
title: "Open Source Updates: December 2020"
image: /covers/open-source-updates.jpg
thumbnail: /thumbnails/open-source-updates.jpg
date: 2021-01-11
description: |
  My monthly Open Source progress in December 2020.
tags:
  - "open source"
  - ruby
  - hanami
---

## Brief 2020 recap

During 2020 due to the pandemic and new job role (software backend architect at Toptal) I had less time to dedicate to Open Source.
Luckily enough, other amazing people took care of projects that I care about.

**Two people above all: [Tim Riley](https://github.com/timriley) for [Hanami 2](https://github.com/hanami) and [Tom Scott](https://github.com/tubbo) for [redis-store](https://github.com/redis-store).**

---

Let's start with the easy one: **I don't actively maintain redis-store anymore**, Tom is the main person behind it, but I'm immensely grateful that he's devoted to the project, which **after 12 years is very mature**.

---

Regarding Hanami 2, Tim transfrormed the old `dry-view` gem into the new implementation of `hanami-view` 2.0.
Alongside with other great work, he integrated [`dry-system`](https://dry-rb.org/gems/dry-system) as main engine behind Hanami 2.

All this amazing work wasn't released yet, we plan to do in the upcoming months.

## December 2020

**`hanami-utils` 2.0 is ready.**
The last bit was the transformation of `Hanami::Utils::String` [from a class into a module](https://github.com/hanami/utils/pull/390).

Introducing framework classes that are inheriting from core Ruby classes, in order to provide more features, it turned out to not play well for maintenance, performance, and compatibility with the Ruby ecosystem. 
The change of `Hanami::Utils::String` (and `Hanami::Utils::Hash`) into modules, allows us to keep the features that are needed internally for Hanami, without introducing new types and working with the core ones.

We may decide to remove even more code from this Ruby gem.

---

**`hanami-router` 2.0 is almost ready.**
There are some cleanup and performance improvements to do.
The last missing feature is routes inspection. I've implemented a [first draft](https://github.com/hanami/router/pull/208) that reuses most of the existing code, but it doesn't scale well for memory consumption. A second iteration is needed to change the implementation, reuse less code, but make it more efficient.

---

**`hanami-view` 2.0 is in the work.**
[I added the ability to create](https://github.com/hanami/view/pull/183) _custom anonymous scopes_ to give the ability to introduce ad-hoc helpers for views.

Here's an example of it:

```ruby
class ApplicationScope < Hanami::View::Scope
  private

  def formatted_timestamp(time)
    time.strftime("...")
  end
end

class ApplicationView < Hanami::View
  config.scope = ApplicationScope
end

class MyView < ApplicationView
  scope do
    def last_updated_at
      formatted_timestamp(_locals[:article].updated_at)
    end
  end
end

MyView.new.call(article: OpenStruct.new(updated_at: Time.now.utc)) # => "2020-12-23 13:39:57"
```

---

**The implementation on `hanami-helpers` 2.0 has just started**
The work on the views was needed as preparatory work to make `hanami-helpers` 2.0 [compatible with the new view rendering context](https://github.com/hanami/helpers/pull/166).

This is still a work in progress effort.

## Sponsorship

I want to thank my [sponsors](/sponsors) that support my Open Source work.

👉
**[Please consider to becoming my sponsor.](https://github.com/sponsors/jodosha)**
👈

---

Until the next month. 😎
