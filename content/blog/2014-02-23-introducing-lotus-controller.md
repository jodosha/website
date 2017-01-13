---
cover: /covers/introducing-lotus-controller.jpg
thumbnail: /thumbnails/introducing-lotus-controller.jpg
date: 2014-02-23
description: |
  Lotus development is going well. This month, I’m proud to announce Lotus::Controller. It’s a small, powerful and fast Rack framework.
tags: lotus
title: Introducing Lotus::Controller
aliases:
  - /2014/02/23/introducing-lotus-controller/
  - /2014/02/23/introducing-lotus-controller.html
---

Lotus development is going well.
The experiment of open source a framework per month is **sustainable**.
I have the time to cleanup the code, write a good documentation and deliver great solutions.

This month, I’m proud to announce [Lotus::Controller](https://github.com/lotus/controller).

It’s a **small but powerful** and **fast** framework.
It works standalone or with [Lotus::Router](https://github.com/lotus/router) and it implements the [Rack](http://rack.github.io) protocol.

## Actions

The core of Lotus::Controller are the actions.
**An action is an HTTP endpoint.**
This is the biggest difference with other frameworks where they use huge classes as controllers.
Think of Rails, where a single controller is responsible of many actions and holds too much informations.
Lotus is simple: **one class per action**.

{{< highlight ruby >}}
require 'rubygems'
require 'lotus/controller'

class Show
  include Lotus::Action

  def call(params)
    @article = Article.find params[:id]
  end
end
{{< / highlight >}}

With this design I wanted to solve a some annoying problems.

**An action is an object**, whose ownership belongs to its author.
She or he, should be free to build their own hierarchy between classes.
Lotus offers Ruby modules to be included instead of superclasses to be inherited.

Smaller classes are <a href="http://en.wikipedia.org/wiki/Cohesion_(computer_science)#High_cohesion">high cohesive</a> components, where the instance variables have a strong relationship between them.
This level of isolation **prevents accidental data leaks** and **less moving parts**.

A tiny API of one method makes **straightforward** the usage of Lotus::Controller.
Its argument (`params`), makes it easy to integrate with existing Rack applications.
It returns automatically a serialized [Rack response](http://rack.rubyforge.org/doc/SPEC.html).

A side benefit of this architecture is to take over the **control of instantiate an action**.

{{< highlight ruby >}}
require 'rubygems'
require 'lotus/controller'

class Show
  include Lotus::Action

  def initialize(repository = Article)
    @repository = repository
  end

  def call(params)
    @article = @repository.find params[:id]
  end
end

action   = Show.new(MemoryArticleRepository)
response = action.call({ id: 23 })

assert_equal response[0], 200
{{< / highlight >}}

In the example above we define `Article` as the default repository, but during the testing we're using a **stub**.
In this way we can avoid hairy setup steps for our tests, and **avoid to hit the database**.
Also notice that we're not simulating HTTP requests, but only calling the method that we want to examine.
**Imagine how fast can be a unit test like this.**

## Exposures

Instance variables represent the internal state of an object.
From an outside perspective we don't know which is that state.
The simplest and recommended way to get this information is to ask for it.
This mechanism is called <a href="http://en.wikipedia.org/wiki/Encapsulation_(object-oriented_programming)">Encapsulation</a>.
It's one of the pillars of Object Oriented Programming.

The instance variables of an action are necessary for returning the body of an HTTP response.
While we're creating that result from the inside of an action, we can access these informations directly.
External objects can retrieve them with getters. These getters are defined with a simple DSL: `#expose`.

{{< highlight ruby >}}
require 'rubygems'
require 'lotus/controller'

class Show
  include Lotus::Action

  expose :article

  def call(params)
    @article = Article.find params[:id]
  end
end

action = Show.new
action.call({ id: 23 })

assert_equal 23, action.article.id

puts action.exposures
  # => { article: <Article:0x007f965c1d0318 @id=23> }
{{< / highlight >}}

## No Rendering, Please

Lotus::Controller helps to build pure HTTP endpoints, **rendering belongs to other layers of MVC**.
It provides a private setter for the body of the response.

{{< highlight ruby >}}
require 'rubygems'
require 'lotus/controller'

class Show
  include Lotus::Action

  def call(params)
    self.body = 'Hello, World!'
  end
end
{{< / highlight >}}

Views and presenters can manipulate the body of the returned response.

{{< highlight ruby >}}
require 'rubygems'
require 'lotus/controller'

class Show
  include Lotus::Action

  expose :article

  def call(params)
    @article = Article.find params[:id]
  end
end

action      = Show.new
response    = action.call({ id: 23 })
response[2] = ArticlePresenter.new(action.article).render
{{< / highlight >}}

## Other features

Lotus::Controller offers a set of powerful features: callbacks, automatic management for exceptions and mime types.
It also supports redirects, cookies and sessions.
They are explained in detail in the [README](https://github.com/lotus/controller#lotuscontroller) and the [API documentation](http://rdoc.info/gems/lotus-controller).

## Roadmap

On **March 23rd** I will release **Lotus::View**.

{% include _lotusml.html %}
