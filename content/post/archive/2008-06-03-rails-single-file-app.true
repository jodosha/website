---
author:
  bio: Developer, music connisseur and avid tea lover.
  image: lg.png
  name: Luca Guidi
  twitter: jodosha
cover_image: cover.jpg
date: 2008-06-03T00:00:00Z
excerpt: ""
tags:
- rails
- ruby on rails
- snippets
title: 'Rails: Single File App'
url: /2008/06/03/rails-single-file-app/
---

<p>I took inspiration from the <a href="http://m.onkey.org/2008/2/16/single-file-rails-application" title="Single File Rails Application">Pratik Naik post</a>, and realized a more simplistic version of its <a href="http://rubyonrails.org">Rails</a> single file app. My implementation has only <strong>Rails</strong> as unique dependency.<br/><code class="ruby">
require 'rubygems'
require 'action_controller'
require 'webrick'
require 'webrick_server'

class HelloWorldController  'Hello World!' end
end

ActionController::Routing::Routes.draw do |map|
  map.root :controller =&gt; "hello_world"
end

DispatchServlet.dispatch :port =&gt; 3000,
    :server_root  =&gt; File.dirname(__FILE__)
</code></p>

<p>
<strong>Update 2008-06-04</strong>: I just wrote another version which also uses <strong>ActiveRecord</strong> and a <strong>template</strong>.<br/><code class="ruby">
require 'rubygems'
require 'activerecord'
require 'action_controller'
require 'webrick'
require 'webrick_server'

ActiveRecord::Base.establish_connection(
  :adapter  =&gt; 'sqlite3',
  :database =&gt; 'tiny_rails.sqlite3',
  :timeout  =&gt; 5000)

ActiveRecord::Schema.define do
  create_table :people, :force =&gt; true do |t|
    t.string :first_name
  end
end
class Person  'Luca'

File.open('index.html.erb', 'w') do |f|
  f !\n"
end

class HelloWorldController  'index.html.erb'
  end
end

ActionController::Routing::Routes.draw do |map|
  map.root :controller =&gt; "hello_world"
end

DispatchServlet.dispatch :port =&gt; 3000,
    :server_root  =&gt; File.dirname(__FILE__)
</code>
</p>

<p>Just start the script and point your browser at <strong>http://localhost:3000</strong>!</p>
