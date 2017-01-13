---
cover: /covers/lotus-and-microservices.jpg
thumbnail: /thumbnails/lotus-and-microservices.jpg
date: 2015-05-05
description: |
  Lotus default architecture is designed for quick dev iterations and easy microservices extraction.
tags: software
title: Lotus And Microservices
alises:
  - /2015/05/05/lotus-and-microservices/
  - /2015/05/05/lotus-and-microservices.html
---

## The monolith is good (at the beginning)

The easiest and convenient way to build a complex system is to use [_message passing_](http://en.wikipedia.org/wiki/Message_passing).
When all the components live in the same process, engineer’s life is easier.

Development cycles are shorter, interfaces can change quickly.
When deploy time arrives, we will have only one deliverable to push.
This is just great.

{% twitter There is an analogy between “message passing” and in person communication. %}

They are both efficient during the early stages of a new project as they feel natural and provide high bandwidth communication.
That’s why many startups prefer in office developers at the beginning.

This is fine.
We should invest our initial effort to create value for customers, without worrying too much about the architecture of the code and the team structure.

When a product becomes successful, it usually increases the number of features, lines of code and complexity.
Subsystems which used to be small and manageable are now big and hard to maintain.

## Extracting microservices

At this point of our story, we may want to extract them into standalone services.
The main reason is to reduce the risks involved with a huge system.

This architecture requires more discipline.

When our company grows, we may want to split our (remote) developers into independent teams.
The same is true for our software.

Different groups can work on [different parts of our product](https://labs.spotify.com/2014/03/27/spotify-engineering-culture-part-1/) without the fear of create conflicts.
Components can be deployed in isolation.
Communication becomes async.
Production processes are lean, self contained and don’t carry the weight of unneeded dependencies (eg. Ruby gems that are required by other modules).

## A Monolith Use Case

This approach doesn’t work well for everyone.
There is a talk by [Akira Matsuda](https://twitter.com/a_matsuda) titled [The Recipe For The World’s Largest Rails Monolith](https://www.youtube.com/watch?v=naTRzjHaIhE).
The author explains how the team behind [cookpad.com](http://cookpad.com) scaled million of daily users by keeping the product to live in the same repository and Ruby process.

Real world examples are always valuable, but I’m genuinely wondering if to roll out your own provisioning and auto-scale system, deployer, SQL ORM adapter, distributed testing framework, database migrator and cleaner is worth the effort.
Probably it’s better to rethink the architecture and rely on standard tools.

## Lotus Architecture

When you create a new [Lotus](http://lotusrb.org) project, the **default architecture** is called **“Container”**.
With it, we can run multiple Lotus (and Rack based) applications in the same Ruby process.
They all live under the `apps/` directory and use _message passing_ to communicate between them.

If we need to introduce a new subsystem (eg. a HTTP API or an admin pane), we can add a new application under `apps/`.
This helps to prevent pathological coupling that will makes impossible to pull out a subsystem at the later stages of a project.

{% twitter Lotus Container will make our life easier if we want to extract a microservice. %}

It helps to plan the future without make we think.
If our code stays small, we’re already done.
If it’s big and we want to split, we can move one of the applications (`apps/`) out of it.

{% include _lotusml.html %}
