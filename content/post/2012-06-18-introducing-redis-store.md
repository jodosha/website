---
image: /covers/introducing-redis-store.jpg
thumbnail: /thumbnails/introducing-redis-store.jpg
date: 2012-06-18
descirption: Redis Store aims to be a toolkit for your Ruby applications, it natively
  supports sharding, master/slave replication, marshalling, timeouts and namespaces.
  Plus, it's really easy to use with the most popular frameworks, such as Ruby on
  Rails.
tags:
  - programming
title: Introducing Redis Store
---

<p><strong>[ I wrote this post for Redis ToGo, you can find the original article <a href="http://blog.togo.io/introducing/redis-store/">here</a> and the related discussion on <a href="http://news.ycombinator.com/item?id=4124246">Hacker News</a>. ]</strong></p>

<p>Redis Store aims to be a toolkit for your Ruby applications, it natively supports sharding, master/slave replication, marshalling, timeouts and namespaces. Plus, it&#8217;s really easy to use with the most popular frameworks, such as Ruby on Rails.</p>

<p>If you love modularity, you will love Redis Store too: under the hood it just activates, at runtime, the best set of low level features requested by the above software layers. It&#8217;s delivered as a set of gems, one for each targeted framework, with a common background that&#8217;s the redis-store gem itself. This decision helped me a lot to deal with different versions of Ruby, several frameworks, and versions.</p>

<h2>How to use it</h2>

<p>Let&#8217;s say we want to use Redis Store in our Rails project. First of all we need to add an entry in our <code>Gemfile</code>:</p>

{{< highlight ruby >}}
gem 'redis-rails'
gem 'redis-rack-cache' # optional
{{< / highlight >}}

<p>Then we have many options:</p>

{{< highlight ruby >}}
## Cache Store
# config/environments/production.rb
config.cache_store = :redis_store

## Session Store
# config/initializers/session_store.rb
MyApplication::Application.config.session_store :redis_store,
  servers: ['redis://:secret@192.168.6.23:6379/0', 'redis://:secret@192.168.6.99:6379/1']

## HTTP Cache
# config.ru
require 'rack'
require 'rack/cache'
require 'redis-rack-cache'

use Rack::Cache,
  metastore:   'redis://localhost:6379/0/metastore',
  entitystore: 'redis://localhost:6380/0/entitystore'
{{< / highlight >}}

<p>As you can see, it&#8217;s pretty easy to plug in, but let&#8217;s investigate how to manage our configuration. The first case is self-explanatory, we&#8217;re telling <code>ActiveSupport</code> to load our Redis backed store. Remember that, <em>au contraire</em> of Redis, which only supports strings, we can dump full objects here.</p>

<p>The second example is a little bit more complicated. First of all, we are employing a cluster of servers. As mentioned before, Redis Store supports sharding, that means the HTTP sessions will be transparently split across the two hosts. For each node we are specififying, respectively: protocol, password, ip, port and the Redis database.</p>

<p>The last one, instead describes the setup for the Rails recently added <code>Rack::Cache</code>. This is a Ruby implementation of an HTTP cache proxy (like Squid or Varnish), which helps to drastically improve response times, by storing the full contents for a given url. It has two components: the metastore, used mainly to check the existence of an entry, and the entitystore, that&#8217;s the repository itself. You&#8217;ve probably noticed another parameter in the configuration: it&#8217;s the namespace, all the keys will be prefixed with something like <code>&lt;namespace&gt;:&lt;key&gt;</code>. One last note: since we are storing just plain text, the mashalling module isn&#8217;t activated.</p>

<p>This is just a small portion of what Redis Store can do, it also supports <code>Rack</code>, <code>Sinatra</code> and <code>I18n</code> out of the box.</p>

<h2>Conclusion</h2>

<p>I strongly believe that Redis is must-have in your environment, it&#8217;s fast, flexible enough to be used as database, cache, pub/sub. That being said, Redis Store can be a great tool for scale your applications, but everything has a cost: fine tuning. Again, it-just-works, but as Rails itself, to step up, you&#8217;ll probably find out to experiment a little bit with the Redis configuration, in order to find the right threshold between performances, scalability and memory consumption.</p>

<p>If you want to give Redis store a try, please check it out on <a href="https://github.com/jodosha/redis-store">GitHub</a>.</p>
