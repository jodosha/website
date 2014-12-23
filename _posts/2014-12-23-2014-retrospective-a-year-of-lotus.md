---
layout: post

title: "2014 Retrospective: A Year Of Lotus"
cover_image: 2014-retrospective-a-year-of-lotus.jpg
cover_copyright: 'Photo Credit: <a href="https://www.flickr.com/photos/gsshow/2601650165/">Li-Ji</a> (<a href="http://www.flickr.com/help/general/#147">CC license</a>)'
tags: software

excerpt: >
  This has been a great year for Lotus: it went from a tiny side project to one of the most appreciated and promising web frameworks for Ruby.
  Today we release a new version which brings new features, code generators and the first supported architecture named container.

author:
  name: Luca Guidi
  twitter: jodosha
  bio: Developer, music connisseur and avid tea lover.
  image: lg.png
---

This has been **a great year** for [Lotus](http://lotusrb.org).

At the beginning of 2014 I decided to open source this less invasive and simple framework for Rack.

Back in the day, it was just a software stored in my hard drive.
An experiment that turned to be a fresh take for web development with Ruby.
It had in it the seminal work of what is Lotus today, but it required **patience** for its blossoming.

We have the feeling that technology moves fast, but it's a false myth.
All the preparatory work, the countless hours spent to lay foundations and refine details needs a very long time.

**What it appears to be an overnight success, it took years instead.**

This first one in Lotus' life have traced the right direction for the project.
The Community is growing with nice, helpful and inclusive people.
I've personally mentored a few young programmers in their first Open Source contribution(s) and Lotus is sometimes used to [teach web development](http://bitboxer.de/2014/10/26/teaching-ruby/).

The software is slowly getting stable, feature after feature.

Lotus has also been included in the last issue of [ThoughtWorks' Radar](http://www.thoughtworks.com/radar/languages-and-frameworks/lotus) as emerging technology to assess in 2015.

## A new release

Lotus is a modular web framework.
It scales from single file HTTP endpoints to multiple applications in the same Ruby process.
Flexibility is at the core.
The smart combination of **conventions and configurations** gives the right balance between **convenience and control**.

However, we recognized that all this power required some guidance.
People would be otherwise lost to understand how to write their first application.

As of today, there is a new version out (`v0.2.0`) which introduces code generators.

### _Container_ architecture

The first architecture that we officially support is: _container_.

It's based on a few simple concepts: **use cases** and **applications**.
Use cases (features) should be implemented in `lib/` with a combination of pure objects and the needed Ruby gems.
One or more Lotus applications live in `apps/`. They are isolated each other, and depend only on the code in `lib/`.

Each of them should serve for only one purpose: user facing web application, administrative backend, JSON API, metrics dashboard, etc.

This architecture has important advantages:

  * **Code reusability.** You can consume a feature from the Web UI or from a HTTP API. Each one can be different Lotus application or simple Rack based endpoints.
  * **Decoupled components.** The core of your application depends only on a few gems and it doesn't need to worry about the Web/HTTP/Console/Background jobs.
  * **Applications are built like a gem**, this ease the process of package them and share between projects, without the need of carry a lot of dependencies.
  * **Avoid monoliths**. Each Lotus application under `apps/` is a candidate for later on extraction into a separated [_microservice_](http://martinfowler.com/articles/microservices.html).

The last point is crucial. In the early days of a new project is really convenient to build and deploy all the code together.
But as the time passes, it can become **nearly impossible** to extract sets of cohesive functionalities into separated deliverables.
Lotus helps to plan those things ahead of time, but **without the burden** that is required by those choices, because it support multiple applications natively.

Getting started with Lotus is really easy now:

{% highlight bash %}
% gem install lotusrb
% lotus new bookshelf
% cd bookshelf && bundle
% bundle exec lotus server # visit http://localhost:2300
{% endhighlight %}

### Other features

This new version brings useful changes:

  * Command line tools like console and server with code reloading
  * Control on Rack middleware, cookies, sessions, HTTP caching, Conditional GET, MIME types, etc.
  * Params whitelisting and validations
  * A simplified API for the model layer
  * File system database adapter for rapid, schemaless prototyping
  * Bug fixes and perf improvements

## The future

This 2014 went over my expectations. The plans for the next year will be announced soon.

Until then, I encourage to give it a try: it's already compatible with Ruby 2.2, which will be released in two days.

As last thing, I'm grateful for **all the people** who made this release possible. **Thank you!**

{% include _lotusml.html %}
