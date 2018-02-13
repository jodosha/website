---
image: /covers/we-are-all-wrong-about-software-design.jpg
thumbnail: /thumbnails/we-are-all-wrong-about-software-design.jpg
date: 2014-04-28
description: |
  All these discussions about software design are missing one detail: we are all wrong. Everyone has a vision that can be found great by some people, and deprecable by others. When it comes to talk about opinions this is the way that things work. If nobody's right, we're all wrong.
tags:
  - software
title: We Are All Wrong About Software Design
---

We are all wrong. When it comes to talk about opinions this is the way that things work.
Everyone has her or his own beliefs shaped by years of experience in the field, frustrating code, books, successes, etc.
How can all these backgrounds fall into a one unified theory? **They just can't.**

You've always been told to pick the right tool for the job.
But what's the _right tool_?
**You decide it**, according to your practical knowledge.

I love Ruby because I feel it natural, but other developers hate this language.
I prefer clean code, other people don't care.
I'm for RSpec and Capybara, other for Test::Unit.
CoffeeScript vs plain JavaScript, ERb vs HAML, Postgres vs MySQL.
Vim or Emacs? Mac or Linux? TDD or not, anyone?

**With all these partitions, we're not freeing people from dogmas, but just creating fans of an opposite opinion.**

Relativity can be applied to software design as well.
How many levels of [indirection](http://en.wikipedia.org/wiki/Indirection) do I need to get a certain job done?
Well, it depends. It depends on a myriad of _good reasons_, but mainly on your judgement.
Which can be superior for you, and fallacious for somebody else.

We can discuss about tradeoffs, but please stop using your successful product as the certification that you're right about code.

I work at [Litmus](https://litmus.com), a profitable company.
If I'd put the following code in a template, do you will find it reasonable just because of my employer?

{{< highlight erb >}}
<%
  require 'mysql2'

  client = Mysql2::Client.new({
    host: 'host',
    username: 'username',
    database: 'database'})

  rows = client.query(%{SELECT * FROM previews
    ORDER BY created_at DESC
    LIMIT 5})
%>

<ul>
<% rows.each do |row| %>
  <li><%= row.fetch(:title) %></li>
<% end %>
</ul>
{{< / highlight >}}

Hey, it works!
Who needs all those fancy abstractions like controllers and ORMs. Who needs frameworks at all!
That constructs are for [architecture astronauts](http://www.joelonsoftware.com/articles/fog0000000018.html). Get off my lawn!
Look at me, I'm a pragmatist.
I proved this by ruining the multi-millionaire software I work on.

This isn't an argument, just nonsense.

<hr />

**UPDATE 1:** That last paragraph is **sarcasm**.

**UPDATE 2:** No, I won't use that code for real.
