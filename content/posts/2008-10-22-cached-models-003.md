---
author:
  bio: Developer, music connisseur and avid tea lover.
  image: lg.png
  name: Luca Guidi
  twitter: jodosha
cover_image: cover.jpg
date: 2008-10-22T00:00:00Z
excerpt: ""
tags:
- ruby on rails
- rails
- plugins
- cached models
- nosql
- memcached
title: Cached Models 0.0.3
url: /2008/10/22/cached-models-003/
---

<p>Since I began to work as professional developer I learned a lot of stuff, but, first of all I learned to be honest with customers and with the Community.
I have to admit: <a href="http://lucaguidi.com/2008/10/10/cached-models-0-0-2">CachedModels 0.0.2</a> was a huge mess.</p>

<p>
  It was a broken version, due to wrong mocks in test. I apologize for all the problems you could encountered using it. Since I discovered all the errors, I worked hard to restore all the lost functionalities.
  But it wasn&#8217;t enough for me, so I focused my attention on performances, reducing cache accesses: now <a href="http://gist.github.com/10203" title="Benchmarks for CachedModels">benchmark</a> test tooks <strong>36.015132</strong> fewer seconds than plain ActiveRecord!
</p>

<p>I hope you would appreciate my honesty and newest version of my plugin. Enjoy!</p>
