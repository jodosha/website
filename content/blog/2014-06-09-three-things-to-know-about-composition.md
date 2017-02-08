---
cover: /covers/three-things-to-know-about-composition.jpg
thumbnail: /thumbnails/three-things-to-know-about-composition.jpg
date: 2014-06-09
description: |
  Inheriting from Ruby's classes can be harmful. Composition should be preferred over inheritance, but beware of the unexpected behaviors.
tags: software
title: Three Things To Know About Composition
---

A few days ago [Aaron Patterson](https://twitter.com/tenderlove) wrote a in [interesting article](http://tenderlovemaking.com/2014/06/04/yagni-methods-slow-us-down.html) about composition vs inheritance with Ruby.

He says that when inheriting our classes directly from Ruby's core objects such as `Array`, our public API for that object will become too large and difficult to maintain.

Consider a powerful object like `String` which has 164 public methods, once our library will be released, we should maintain all that amount of code.
It doesn't worth the trouble, probably because we just wanted to pick a few methods from it.
It's better to compose an object that hides all that complexity derived from `String`, and to expose only the wanted behaviors.

I was already aware of these issues, but that article was a reminder for fixing my OSS projects.
For this reason I [refactored](https://github.com/lotus/utils/blob/master/lib/lotus/utils/load_paths.rb) `Lotus::Utils::LoadPaths`.
It used to inherit from `Array` (169 methods), but after breaking the inheritance structure, I discovered that I only needed 2 methods.

However, there are some hidden corners that are worthing to share.

## Information escape

A characteristic that I want for `LoadPaths` is the ability to add paths to it.
After the refactoring, for the sake of consistency, I decided to name this method after `Array`'s [`#push`](http://ruby-doc.org/core-2.1.2/Array.html#method-i-push), and to mimic its behavior.

The initial implementation of this method was:

{{< highlight ruby >}}
it 'returns self so multiple operations can be performed' do
  paths = Lotus::Utils::LoadPaths.new

  paths.push('..').
        push('../..')

  paths.must_include '..'
  paths.must_include '../..'
end

class Lotus::Utils::LoadPaths
  # ...

  def push(*paths)
    @paths.push(*paths)
  end
end
{{< / highlight >}}

When we use this Ruby's method, the returning value is the array itself, because language's designers wanted to make chainable calls possible.
If we look at the implementation of our method, the implicit returning value was `@paths` (instead of `self`), so the subsequent invocations were directly manipulating `@paths`.

The test above was passing because arrays are referenced by their memory address, so that the changes that happened on the outside (after the accidental escape) were also visible by the wrapping object (`LoadPaths`).
Because our main goal is to encapsulate that object, we want to prevent situations like this.

{{< highlight ruby >}}
it 'returns self so multiple operations can be performed' do
  paths = Lotus::Utils::LoadPaths.new

  returning = paths.push('.')
  returning.must_be_same_as(paths)

  paths.push('..').
        push('../..')

  paths.must_include '.'
  paths.must_include '..'
  paths.must_include '../..'
end

class Lotus::Utils::LoadPaths
  # ...

  def push(*paths)
    @paths.push(*paths)
    self
  end
end
{{< / highlight >}}

## Dup and Clone

`LoadPaths` is used by other [Lotus](http://lotusrb.org) libraries, such as [`Lotus::View`](https://github.com/lotus/view).
This framework can be _"duplicated"_ with the goal of ease a [microservices architecture](http://martinfowler.com/articles/microservices.html), where a developer can define `MyApp::Web::View` and `MyApp::Api::View` as _"copies"_ of `Lotus::View`, that can independently coexist in the same Ruby process.
In other, words the configurations of one _"copy"_ shouldn't be propagated to the others.

Until `LoadPaths` was inheriting from `Array`, a simple call to `#dup` was enough to get a fresh, decoupled copy of the same data.
Now the object is duplicated but not the variables that it encapsulates (`@paths`).

{{< highlight ruby >}}
paths1 = Lotus::Utils::LoadPaths.new
paths2 = paths1.dup

paths2.push '..'
paths1.include?('..') # => true, which is an unwanted result
{{< / highlight >}}

The reason of this failure is the same of the information escaping problem: **we're referencing the same array**.
Ruby has a special method callback that is designed for cases like this.

{{< highlight ruby >}}
class Lotus::Utils::LoadPaths
  # ...

  def initialize_copy(original)
    @paths = original.instance_variable_get(:@paths).dup
  end
end
{{< / highlight >}}

Now, when `paths1.dup` is called, also the `@paths` instance variable will be duplicated and we can safely change `paths2` without affecting it.

## Freeze

A similar problem arises for `#freeze`.
I want `Lotus::View` to freeze its configurations after the application is loaded.
This immutability will prevent accidental changes that may lead to software defects.

When we try to alter the state of a frozen object, Ruby raises a `RuntimeError`, but this wasn't the case of `LoadPaths`.

{{< highlight ruby >}}
paths = Lotus::Utils::LoadPaths.new
paths.freeze
paths.frozen? # => true

paths.push '.' # => It wasn't raising RuntimeError
{{< / highlight >}}

This had an easy fix:

{{< highlight ruby >}}
class Lotus::Utils::LoadPaths
  # ...

  def freeze
    super
    @paths.freeze
  end
end
{{< / highlight >}}

## Conclusion

**Composition should be preferred over inheritance, but beware of the unexpected behaviors.**

I discovered these problems in a matter of a minutes, because the client code of this object (`Lotus::View`) has some integration tests that are asserting all these features, **without assuming anything of the underlying objects**.
For instance, it checks one by one all the attributes of a configuration after its duplication, without trusting the fact they can safely duplicate themselves.
This double layered testing strategy is fundamental for me while building Lotus.
