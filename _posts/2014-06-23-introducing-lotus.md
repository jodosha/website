---
layout: post

title: "Introducing Lotus"
cover_image: introducing-lotus.jpg
tags: software

excerpt: >
  Lotus is a complete web framework for Ruby with a strong emphasis on object oriented design and testability.
  If you use it, you employ less DSLs and more objects, zero monkey-patching, separation of concerns between MVC layers.
  Each library is designed to be small, fast and testable.

author:
  name: Luca Guidi
  twitter: jodosha
  bio: Developer, music connisseur and avid tea lover.
  image: lg.png
---

A year and a half ago I felt frustrated by the state of the art of web development with Ruby.
Secretly, in my spare time, I started hacking with new ideas, taking nothing for grantend, destroying and starting from scratch several times, until the software was distilled in a beautiful API.

It took me a decade to get here, by following a process of **subtraction of what isn't essential**.
Countless refinements to achieve modularity, to balance elegance with performance, convenience with solid design.

Each alternative was ponderated according to real world scenarios.
Use cases that have been pain points or good choices in my and other developers' experience.

But this project was sitting on my computer for too long.

For this reason, at the beginning of the year, I've [announced](http://lucaguidi.com/2014/01/01/announcing-lotus.html) the project and a slow release schedule.
Each month I've released a library because I wanted to share with other developers the result of this effort, and create a discussion in the Ruby community.
Now, six monhts and six frameworks later, I'm proud to introduce the main element: **Lotus**.

It's [a complete web framework](http://lotusrb.org), with a strong emphasis on object oriented design and testability.
If you use Lotus, you employ less DSLs and more objects, zero monkey-patching, separation of concerns between MVC layers.
Each library is designed to be small (under 500LOCs), fast and testable.

There is [Lotus::Router](https://github.com/lotus/router) which is an HTTP router and [Lotus::Controller](https://github.com/lotus/controller) for controllers and actions.
They both speak the [Rack](http://rack.github.io) protocol, so they can be used in existing code base, or combined together for small API endpoint, or, again together, in a full stack Lotus app.

[Lotus::View](https://github.com/lotus/view) is the first library for Ruby that marks a separation between view objects and templates.
While [Lotus::Model](https://github.com/lotus/model), with repositories, data mapper and adapters helps to keep domain specific logic away from persistence.

We have infinite combinations. **Small components have enormous advantadges in terms of reusability**.

The power of these frameworks is combined together in Lotus applications.

Microservices are at the core. Several independent applications can live together in the same Ruby process.

Lotus has a smart mechanism of _framework duplication_, where all the libraries can be employed several times.
When the code base will grow up it can be easily split in smaller deliverables.

Lotus has an [extensive](http://rdoc.info/gems/lotusrb) [documentation](https://github.com/lotus/lotus/blob/master/README.md), that covers all the supported architectures.

## The future

Lotus is still a young framework, that needs to reach a certain degree of code maturity.
Alongside with the vision that I have for the future features, it will improved by collecting [feedbacks](https://gitter.im/lotus/chat) from real world applications.

Also, starting from today, I'll offer **free consultancy hours** to all the companies and individuals who are interested in Lotus.

{% include _lotusml.html %}
