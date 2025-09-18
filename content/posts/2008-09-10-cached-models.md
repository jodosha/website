---
author:
  bio: Developer, music connisseur and avid tea lover.
  image: lg.png
  name: Luca Guidi
  twitter: jodosha
cover_image: cover.jpg
date: 2008-09-10T00:00:00Z
excerpt: ""
tags:
- rails
- ruby on rails
- activerecord
- plugins
- performances
- scalability
- plugins
- nosql
- memcached
title: Cached Models
url: /2008/09/10/cached-models/
---

<p><a href="http://lucaguidi.com/pages/cached_models"><strong>cached_models</strong></a> provides to your models a transparent approach to use <a href="http://www.rubyonrails.org" title="Ruby on Rails">Rails</a> internal <a href="http://as.rubyonrails.org/classes/ActiveSupport/Cache.html" title="ActiveSupport::Cache API">cache mechanism</a>.</p>
<p>
  Usually, when you decide to use cache for your ActiveRecord results, you have to manually implement complex expiring policies.
  <strong>cached_models</strong> simplifies your code:<br/><code class="ruby">
class Author  true
end

class Post  true
end
  </code>
  
  <strong>That&#8217;s all!!</strong>.
</p>
<p>
  A more complex example..<br/><code class="ruby">
class Project  true

  has_many :tickets, :cached =&gt; true
  has_many :recent_tickets, :limit =&gt; 5,
    :order =&gt; 'id DESC', :cached =&gt; true
end

class Developer  true
end
  </code>
</p>
<h4>Example 1</h4>
<p>
  <code class="ruby">
project.developers # Database fetch and automatic cache storing

developer = project.developers.last
developer.update_attributes :first_name =&gt; 'Luca' # Database update and cache expiration for project cache
  </code>
</p>

<h4>Example 2</h4>
<p>
  <code class="ruby">
# Fetch associated collection for both the projects
project.developers
project2.developers

developer = project.developers.last
project2.developers 
</code></p>

<h4>Example 3</h4>
<p>
  <code class="ruby">
project.tickets # Database fetch and automatic cache storing
ticket = project.recent_tickets.first
ticket.update_attributes :state =&gt; 'solved' # Database update and cache expiration for both tickets and recent_tickets entries
  </code>
</p>

<p>The current version works only with the <code>has_many</code> macro.</p>

<h2>How to install</h2>
<p>
  <code class="shell">
$ ./script/plugin install git://github.com/jodosha/cached_models.git
  </code>  
</p>

<h3>Official page</h3>
<p><a href="http://lucaguidi.com/pages/cached_models"><a href="http://lucaguidi.com/pages/cached_models">http://lucaguidi.com/pages/cached_models</a></a></p>
