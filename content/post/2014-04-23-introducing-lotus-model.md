---
image: /covers/introducing-lotus-model.jpg
thumbnail: /thumbnails/introducing-lotus-model.jpg
date: 2014-04-23
description: |
  Almost all the Ruby frameworks for the Model layer mix up business logic with database details. This kind of architecture leads to god classes, slow build times and to a general poor design.
  What if we assign these roles to smaller components that are able to collaborate together? Imagine how life changing would be to work just with object, without worrying how to persist them. How easy and fast would be testing them? How small and well defined would be your objects?
  Let me introduce Lotus::Model.
tags:
  - software
title: Introducing Lotus::Model
---

Almost all the Ruby frameworks for the Model layer mix up business logic with database details.
This kind of architecture leads to [god classes](http://en.wikipedia.org/wiki/God_object), slow build times and to a general [bad design](https://speakerdeck.com/jodosha/a-rails-criticism).
These problems are well known to legacy projects's maintainers.

What if we assign these roles to **smaller components** that are able to collaborate **together**?
Imagine how life changing would be to **work just with objects**, without worrying how to persist them.
How easy and fast would be testing them? How small and well defined would be your objects?

Let me introduce [Lotus::Model](https://github.com/lotus/model).

It brings a new level of decoupling that is a huge step in that direction.
The framework constitutes a boundary that offers a convenient public API to execute **queries and commands** to persist and fetch entities.

## Entities

An entity is the core of an application, where the part of the domain logic is implemented.
It's a small, cohesive object that express coherent and meaningful behaviors.

It deals with one and only one responsibility that is pertinent to the domain of the application, without caring about details such as persistence or validations.

This simplicity of design allows you to focus on behaviors, or message passing if you will, which is the [quintessence](http://c2.com/cgi/wiki?AlanKayOnMessaging) of Object Oriented Programming.

Consider this object:

{{< highlight ruby >}}
class Article
  attr_accessor :id, :title, :text

  def initialize(attributes = {})
    @id, @title, @text =
      attributes.values_at(:id, :title, :text)
  end
end
{{< / highlight >}}

It can be **_optionally_** expressed as:

{{< highlight ruby >}}
require 'lotus/model'

class Article
  include Lotus::Entity
  self.attributes = :title, :text
end
{{< / highlight >}}

Yes, **optionally**.
Lotus::Model can work with **pure objects**, as long they implement that small interface above.

But how the framework knows how to handle these objects?

## Data Mapper

We use a data mapper for the job.
It's a persistence mapper that keeps entities unaware of schema details.
Good news are that it's **database independent**, it can work with SQL, document, and even with key/value stores.

The role of a data mapper is to translate database columns into the corresponding attribute of an entity.

{{< highlight ruby >}}
require 'lotus/model'

mapper = Lotus::Model::Mapper.new do
  collection :articles do
    entity Article

    attribute :id,    Integer
    attribute :title, String
    attribute :text,  String
  end
end
{{< / highlight >}}

For simplicity sake, imagine that the mapper above is used with a SQL database.
We use `#collection` to indicate the table that we want to map, `#entity` to indicate the kind of object to persist.
In the end, each `#attribute` call specifies which Ruby type we want to associate for given column.

## Repositories

Once we have in place all the entities and a mapping for them, we can use a repository to talk with a database.

A repository is an object that mediates between entites and the persistence layer.
It offers a standardized API to query and execute commands on a database.

A repository is **storage idenpendent**, all the queries and commands are delegated to the current adapter.

This architecture has several advantages:

  * An application depends on an standard API, instead of low level details ([Dependency Inversion principle](http://en.wikipedia.org/wiki/Dependency_inversion_principle))

  * An application depends on a stable API, that doesn't change if the storage changes

  * You can postpone storage decisions

  * It confines persistence logic at a low level

  * Multiple data sources can easily coexist in an application

{{< highlight ruby >}}
require 'lotus/model'

class ArticleRepository
  include Lotus::Repository
end
{{< / highlight >}}

When a class includes `Lotus::Repository` it will expose [CRUD](http://en.wikipedia.org/wiki/Create,_read,_update_and_delete) methods such as `.create`, `.update`, `.find`.
Aside from that, it offers a powerful **private** query API.
This decision forces developers to define **intention revealing APIs**, instead leak storage details outside of a repository.

Look at the following code:

{{< highlight ruby >}}
ArticleRepository.
  where(author_id: 23).
  order(:published_at).
  limit(8)
{{< / highlight >}}

This is an example of _implicit API_, it means nothing in terms of the behavior of the domain model.
It's just a chain of method calls. From the caller perspective, it should be aware of the internal query mechanisms.

There is a better way to write it:

{{< highlight ruby >}}
require 'lotus/model'

class ArticleRepository
  include Lotus::Repository

  def self.most_recent_by_author(author, limit = 8)
    query do
      where(author_id: author.id).
        order(:published_at)
    end.limit(limit)
  end
end
{{< / highlight >}}

Look at how revealing is the name of that method.
It _encapsulates_ the implementation details, in favor of a clear and testable API.

If we change the type of database, the callers of that method will be unaffected.

## Adapters

As mentioned above, Lotus::Model is database agnostic.
A repository forwards method calls to its current adapter.
An adapter is a concrete implementation of persistence logic for a specific database.
The framework is shipped with two adapters:

  * `SqlAdapter`
  * `MemoryAdapter`

An adapter can be associated to one or multiple repositories and different repositories can have different data sources.
For instance an application can have `ArticleRepository` that uses a SQL database and `TweetRepository` that talks to a third part JSON service.

## Roadmap

For the next two months, I will focus on [Lotus](http://lotusrb.org) (the gem).
The main goal is to make all the frameworks to work together in a full stack app.
This will require improve the existing libraries and empower them with the missing features.

On **June 23rd** I will release **Lotus**.

{% include _lotusml.html %}
