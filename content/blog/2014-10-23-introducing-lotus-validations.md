---
cover: /covers/introducing-lotus-validations.jpg
thumbnail: /thumbnails/introducing-lotus-validations.jpg
date: 2014-10-23
description: |
  Data validation is an important piece in software architecture. Adding this responsibility to models increase the cost of maintenance. Lotus offers a different and powerful approach to the problem.
tags:
  - software
title: Introducing Lotus::Validations
---

Data validation is an important piece in software architecture.
It guarantees that the successive layers will operate on correct input.
In the existing Ruby frameworks we're used to see this responsibility flatten down into models.

The problem with this approach is that we end to mix a lot of validations for **different use cases** in a **single place**.
When the application grows in complexity, we add new validations.
If often happens that some rules are incompatible with others, then we introduce nasty conditionals to trigger only a subset of them.

Have you ever seen something like this?

{{< highlight ruby >}}
class User
  validates_presence_of :password, if: :password_required?

  private
  def password_required?
     !invited_user? && !admin_password_reset?
  end
end
{{< / highlight >}}

I did, and it makes maintenance a nightmare.

If we think better at the role of the validations we notice a few interesting things.

## Use Cases

First, they are the expressions of the rules that we need for a specific use case.

In the example above, we want to force an user who self register for our service to choose a password.
We'll call this the _"Signup"_ use case.

But then we introduce a second feature: _"Invitations"_.
An existing user can ask someone to join.
Because the invitee will decide a password later on, we want to persist that `User` record without that value.
That's why we had to put that conditional in place.

It turns out that **validations aren't absolute rules for data integrity of a model**.
An `User` can be persisted with or without a password, **depending on the workflow** that the it was routed into.

In other words, we're assigning too much responsibilities to `User`.
We should move integrity check into the use case code.

## Boundaries

The second important aspect is that we use validations to prevent invalid inputs to propagate in our system.
In an MVC architecture, the model layer is the **farthest** from the input.
It isn't expensive to check the data right before we create a record in the database?

If we consider correct data as a precondition **before** to start our workflow, we should stop unacceptable inputs as soon as possible.

Think of the following method.
We don't want to continue if the data is invalid for us.

{{< highlight ruby >}}
def expensive_computation(argument)
  return if argument.nil?
  # ...
end
{{< / highlight >}}

## Lotus

For those reasons, Lotus doesn't have validations in [entities](https://github.com/lotus/model/blob/master/lib/lotus/entity.rb).
I recently introduced [params validations](https://github.com/lotus/controller/blob/master/README.md#validations--coercions) to Lotus::Controller.

Actions are closer to the user input, they have the role to check if it's valid and eventually pass the control to the other layers.
Otherwise, we can decide to stop the execution and return a failing response.

{{< highlight ruby >}}
require 'lotus/controller'

module Controllers::Signup
  class Create
    include Lotus::Action

    params do
      # ...
      param :password, presence: true
    end

    def call(params)
      halt 400 unless params.valid?
      # ...
    end
  end
end
{{< / highlight >}}

At that point, I recognized that other developers probably still want validations in their models, or they want to use service objects (interactors) for this goal.

In the spirit of Lotus philosophy, I'm introducing today a single purpose library: `Lotus::Validations`.

## Lotus::Validations

It's a small, but yet powerful library.
In just `~140` lines of code, it offers validations like acceptance, presence, size, inclusion, confirmation..

The API is really intuitive.

{{< highlight ruby >}}
require 'lotus/validations'

class Signup
  include Lotus::Validations

  attribute :name, presence: true
  attribute :age, inclusion: 18..99
end
{{< / highlight >}}

It leverages on Ruby's [Duck Typing](http://rubylearning.com/satishtalim/duck_typing.html) to make the existing rules adaptable to a vast variety of objects.

{{< highlight ruby >}}
require 'lotus/validations'

class Signup
  MEGABYTE = 1024 ** 2
  include Lotus::Validations

  attribute :ssn,    size: 11
  attribute :avatar, size: 1..(5 * MEGABYTE)
end
{{< / highlight >}}

In the case above, we want to make sure that the SSN number, to be exactly of size `11`.
It works because internally it uses `String#size`.
Now, because Rack frameworks use `Tempfile` to represent uploaded data, and it responds to `#size`.
We are able to refuse avatars larger than 5 megabytes with the same kind of validation.

The framework offers coercion facilities both for Ruby and custom types.


{{< highlight ruby >}}
require 'date'
require 'lotus/validations'

class BirthDate
  def initialize(date)
    @date = Date.parse(date)
  end
end

class Person
  include Lotus::Validations

  attribute :code,     type: Integer
  attribute :birthday, type: BirthDate
end

person = Person.new(code: '1', birthday: 'Jun 23')
person.code # => 1
person.birthday # =>#<BirthDate:0x007f947f8d91c0 @date=#<Date: 2014-06-23 ((2456832j,0s,0n),+0s,2299161j)>>
{{< / highlight >}}

## Other features

This library offers other validations, they are explained in detail in the [README](https://github.com/lotus/validations#lotusvalidations) and the [API documentation](http://rdoc.info/gems/lotus-validations).

{% include _lotusml.html %}
