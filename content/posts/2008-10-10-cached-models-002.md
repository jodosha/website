---
author:
  bio: Developer, music connisseur and avid tea lover.
  image: lg.png
  name: Luca Guidi
  twitter: jodosha
cover_image: cover.jpg
date: 2008-10-10T00:00:00Z
excerpt: ""
tags:
- rails
- ruby on rails
- activerecord
- plugins
- cached models
- nosql
- memcached
title: Cached Models 0.0.2
url: /2008/10/10/cached-models-002/
---

<p><a href="http://lucaguidi.com/pages/cached_models" title="CachedModels">CachedModels</a> hit <a href="http://github.com/jodosha/cached-models/tree/v0.0.2" title="Cached Models v0.0.2">0.0.2</a>.</p>
<p>First of all, I transformed it to a Ruby gem, so you can use it <strong>outside Rails!</strong> Second, I dramatically <strong>enhanced performances</strong>, avoiding useless cache lookups and expirations. Take a look at the new <a href="http://gist.github.com/10203" title="Benchmarks for CachedModels">benchmark stats</a>: 1000 requests with a level of concurrency equal to 100, tooks 6 fewer seconds, if compared with standard ActiveRecord.</p>
<p>I strongly encourage you to upgrade to the newer version.</p>
