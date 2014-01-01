---
layout: post

title: "Announcing Lotus"
cover_image: announcing-lotus.jpg
tags: lotus

excerpt: >
  Lotus is a full stack web framework for Ruby, built with lightness, performances and testability in mind.
  It aims to bring back Object Oriented Programming to web development, leveraging on stable APIs, a minimal DSL, and plain objects.

author:
  name: Luca Guidi
  twitter: jodosha
  bio: Developer, music connisseur and avid tea lover.
  image: lg.png
---

I'm pleased to announce Lotus: the Open Source project I've conceived, hacked and built during the last year.

__Lotus is a full stack web framework for Ruby__, built with lightness, performances and testability in mind.
It aims to bring back Object Oriented Programming to web development, leveraging on stable APIs, a minimal DSL, and plain objects.

## Standalone frameworks

It's composed by __standalone frameworks__ (controllers, views, etc..), each one is shipped as an independent gem, in order to remark the separation of concerns.
They can be used with any [Rack](http://rack.github.io) compatible application for a specific need: for instance, [Lotus::Router](http://lotusrb.org/router) can be used to dispatch HTTP requests for a pool of [Sinatra](http://www.sinatrarb.com) applications.

## Full stack application

The other way to use Lotus is to build a full stack application with it, like [Rails](http://rubyonrails.org) does.
The Lotus gem is designed to enhance those frameworks' features with a few specific conventions.

## Philosophy

Lotus is based on simplicity, less DSLs, few conventions, more objects, zero monkey-patching of the core language and standard lib, separation of concerns for MVC layers.
It suggests patterns, rather than imposing. It leaves all the freedom to developers to build their own architecture, choose the inheritance structure.
It simplifies testability, and encourages single, well defined responsibilities between classes.

## Roadmap

Lotus is a complex software, it needs to be completed, and to get feedback in order to became production ready.
Some of its frameworks already have reached a certain degree of maturity, other still needs to be crafted as a gem yet.
A single release day would be hard to meet as expectation, so I would like to suggest an experiment: to open source a component __on the 23rd of every month__, starting from January with [Lotus::Utils](http://lotusrb.org/utils) and [Lotus::Router](http://lotusrb.org/router).

Happy new year!
