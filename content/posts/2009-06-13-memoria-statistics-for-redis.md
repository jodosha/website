---
author:
  bio: Developer, music connisseur and avid tea lover.
  image: lg.png
  name: Luca Guidi
  twitter: jodosha
cover_image: cover.jpg
date: 2009-06-13T00:00:00Z
excerpt: ""
tags:
- memoria
- sinatra
- ruby
- nosql
- redis
- redis-store
title: 'Memoria: Statistics for Redis'
url: /2009/06/13/memoria-statistics-for-redis/
---

<p>A couple of days ago <a href="http://twitter.com/jodosha/status/2117046130">I setup this blog</a> with <a href="http://code.google.com/p/redis/">Redis</a> as cache container, thanks to my Ruby gem: <a href="http://github.com/jodosha/redis-store">redis-store</a>.</p>

<p>Now, following the old <em>itch-your-own-scratches</em> rule, I created a little <a href="http://www.sinatrarb.com">Sinatra</a> web application for Redis statistics: <a href="http://github.com/jodosha/memoria">Memoria</a>.</p>

<p><img src="http://img.skitch.com/20090613-nqmj7guc6n8ptwt3bgsbuipuw7.jpg" width="446px" heigth="330px" alt="Memoria screenshot"/></p>

<p># Getting Started<br/><code class="bash"><br/>
(sudo) gem install sinatra dm-core do_sqlite3 rspec<br/>
(sudo) gem install ezmobius-redis-rb jodosha-memoria -s <a href="http://gems.github.com">http://gems.github.com</a><br/>
memoria /path/to/installation<br/>
cd /path/to/installation<br/>
cp memoria.yml.example memoria.yml<br/>
rackup config.ru --port 9292 mongrel<br/></code></p>

<p>Memoria is still in an <em>embryonic stage</em>, feel free to suggest features.</p>
