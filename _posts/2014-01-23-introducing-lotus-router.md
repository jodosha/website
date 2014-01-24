---
layout: post

title: "Introducing Lotus::Router"
cover_image: introducing-lotus-router.jpg
cover_copyright: 'Photo Credit: <a href="http://www.flickr.com/photos/29242822@N00/205714765/">Giovanni88Ant</a> via <a href="http://compfight.com">Compfight</a> <a href="http://www.flickr.com/help/general/#147">cc</a>'
tags: lotus

excerpt: >
  Lotus::Router is a Rack compatible, lightweight and fast HTTP Router for Ruby.
  It is designed to work as a standalone framework or within a context of a Lotus application.
  It supports most of the HTTP verbs, fixed and partial string matching, redirect, namespaces, named routes and RESTful resource(s).


author:
  name: Luca Guidi
  twitter: jodosha
  bio: Developer, music connisseur and avid tea lover.
  image: lg.png
---

For me, the first step in the long path of [building a web framework](/2014/01/01/announcing-lotus.html) was an HTTP router.
By understanding requests coming from an user, it pays back with an immediate gratification: start it, open a browser and see a result.

My hope was to embark on a short journey, and reuse as much as possible existing libraries.
But I soon discovered that the biggest problem of Ruby web frameworks is reusability of components.
Rails uses [journey](https://github.com/rails/journey), which is coupled with ActionPack code base.
Sinatra has its own hardcoded routing system.
Plain Rack apps require the developer to fiddle with low level details of `env`.

All those solutions work great for the narrowed problem they are solving: HTTP routing for a given system.
What if I wanted to build an high-level router, not just for a specific framework, but __for all the Ruby web apps__?

That's where the idea of __Lotus::Router__ came in.

__Lotus::Router__ is an HTTP Router for Ruby, it's fast, lightweight and compatible with the Rack protocol.

It's designed to work as a standalone software or within a context of a [Lotus](http://lotusrb.org) application, and provides features such as: fixed and partial URL matching, redirect, namespaces, named routes and RESTful resource(s).

## Usage

During the design process of this software I had in mind two main goals: simplicity and employ well known ideas.
Ease of use is crucial to software adoption, but also meet a developer's acquaintance with what he (or her) already utilize is critical as well.
This is a pattern that you will notice often during the discover of Lotus: __on one hand, it leverages on well established concepts, on the other one, it adds value by bringing fresh ideas.__

{% highlight ruby %}
require 'rubygems'
require 'lotus-router'

router = Lotus::Router.new do
  get  '/hello', to: ->(env) { [200, {}, ['Hello, World!']] }
  get  '/dashboard',   to: 'dashboard#index'
  get  '/middleware',  to: RackMiddleware
  get  '/rack-app',    to: RackApp.new

  redirect '/legacy', to: '/'

  namespace 'admin' do
    get '/users', to: UsersController::Index
  end

  resource  'identity'
  resources 'users'
end
{% endhighlight %}

For those who are unfamiliar with this (I hope none of you), let me explain the basic usage.

We have an HTTP verb as method, `#get` in the example.
This method is invoked with a string which is the relative URL to match (`"/hello"`), and with an endpoint (`to: #...`) that is where a request will be routed to.
Thanks to the Ruby's weak typing nature, an endpoint can be a proc, a string, a class or an object. According to simple conventions, Lotus::Router is able resolve that option in a Rack endpoint, which must be provided by your application.

I would like you to notice that the DSL is implemented with a block accepted by the constructor, and it uses public methods of the object, there is no magic here.
I could write the previous example like this:

{% highlight ruby %}
router = Lotus::Router.new
router.get  '/', to: ->(env) { [200, {}, ['Hello, World!']] }
# ...
{% endhighlight %}

Another aspect that is important is that we obtain a `router` object.
Instead of being relegated to a secondary role and hidden behind the opaque mechanisms of other frameworks, this is the first time that a router it's promoted to a first class citizenship.
This is a pillar of the Lotus architecture: __let components to emerge__. In this way developers can be better understand, introspect and __test__.

{% highlight ruby %}
router = Lotus::Router.new(scheme: 'https', host: 'host.com')
router.get '/login', to: 'sessions#new', as: :login

router.path(:login) # => "/login"
router.url(:login)  # => "https://host.com/login"
{% endhighlight %}

Imagine how much it would be easy &dash; with a system like this &dash; to implement routing helpers.

This is only a taste of what __Lotus::Router__ can do: please have a look at the [README](https://github.com/lotus/router#lotusrouter) and the [API doc](http://rdoc.info/gems/lotus-router), for a detailed explanation.

## Roadmap

The experiment of releasing a [Lotus](http://lotusrb.org) component __on the 23rd of every month__ is going well. On February will be the turn of __Lotus::Controller__.

To stay updated with the latest releases, to receive code examples, implementation details and announcements, please consider to subscribe to the Lotus [mailing list](http://lotusrb.org/mailing-list):

{% include _lotusml.html %}
