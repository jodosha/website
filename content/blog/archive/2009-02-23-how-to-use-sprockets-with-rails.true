---
author:
  bio: Developer, music connisseur and avid tea lover.
  image: lg.png
  name: Luca Guidi
  twitter: jodosha
cover_image: cover.jpg
date: 2009-02-23T00:00:00Z
excerpt: ""
tags:
- rails
- ruby on rails
- sprockets
- javascript
- prototype
- jquery
title: How to use Sprockets with Rails
url: /2009/02/23/how-to-use-sprockets-with-rails/
---

<p><a href="http://conio.net/" title="Sam Stephenson">Sam Stephenson</a> has recently released a Javascript preprocessor called <a href="http://getsprockets.org" title="Sprockets">Sprockets</a>.
It&#8217;s distributed as Ruby gem, and it helps to declare scripts dependencies through special comments, and safely build them one script. It&#8217;s very useful for maintain your Javascript projects, extract reusable code and share across applications.</p>

<h2>Installation</h2>
<p>
  <code class="bash">
$ (sudo) gem install sprockets
  </code>
  It will also install <code>sprocketize</code> executable.
</p>

<h2>How it works?</h2>
<p>
  To declare a dependency use <code>require</code> directive:<br/><code class="javascript">
//= require <prototype>
//= require "cookies"
  </prototype></code>
  When you use angular brackets the script will be searched in all the Sprockets load path, if you use quotes instead, you are forcing to load the file from the current directory. Usually you should use the first way to require frameworks or libraries and the second one for your scripts.
</p>

<h2>How it works with Rails?</h2>
<p>
  Sam has wrote a <a href="http://github.com/sstephenson/sprockets-rails" title="sprockets-rails">plugin</a> to use Sprockets with Rails, let&#8217;s install it:<br/><code class="bash">
$ ./script/install plugin git://github.com/sstephenson/sprockets-rails.git
  </code>
  It automatically creates two folders: <code>app/javascripts</code> and <code>vendor/sprockets</code>.
</p>

<p>Move all the files from <code>public/javascripts</code> to the first folder.</p>

<p>
  Now let&#8217;s sprocketize our files:
  <code class="javascript">
/* controls.js */
//= require <prototype>
//= require <effects>

/* dragdrop.js */
//= require <prototype>
//= require <effects>

/* effects.js */
//= require <prototype>

/* lowpro.js */
//= require <prototype>

/* prototype.js */
// nothing to do

/* application.js */
//= require <prototype>
//= require <lowpro>
//= require <effects>
//= require <dragdrop>
//= require <controls>

/* comments.js */
//= require <prototype>
//= require "application"
  </prototype></controls></dragdrop></effects></lowpro></prototype></prototype></prototype></effects></prototype></effects></prototype></code>
  Of course <code>application.js</code> and <code>comments.js</code> configurations depends on which libraries you need for your scripts.
</p>

<p>
  One last step, we have to configure our routes with:<br/><code class="ruby">
# config/routes.rb
SprocketsApplication.routes(map)
  </code>
</p>

<p>
  Now forget about <code>javascript_include_tag</code> helper and place <strong>one time</strong> at the bottom of your template:<br/><code class="html">

  </code>
  sprockets-rails will provide all the scripts needed by your application.
</p>

<h2>Advanced sprocketing</h2>
<p>
  Sprockets help you to bundle all kind of assets (HTML, CSS, images) your Javascript project needs. Imagine to have a plugin with <code>assets</code> and <code>javascripts</code> folders, in your script you can declare:<br/><code class="javascript">
//= provide "../assets"
  </code>
  Just running <code>sprockets:install_assets</code> rake task, sprockets-rails will copy all the assets and scripts to the public folder.
</p>

<p>If you want to use the edge of favorite javascript frameworks like <strong>jQuery</strong> Sprockets will bundle for you. For example if you want to add Prototype&#8217;s edge, just copy <code>src</code> folder under vendored folder of Sprockets:<br/><code class="bash">
vendor/sprockets/prototype/src
</code>
</p>

<h2>Deployment</h2>
<p>Add <code>sprockets:install_script</code> as <a href="http://www.capify.org/" title="Capistrano">Capistrano</a> post-deploy hook to generate the all-in-bundle script.</p>

<h2>One more thing</h2>
<p>If you use <a href="http://lucaguidi.com/pages/assets_packager" title="assets_packager">assets_packager</a>, I just <a href="http://github.com/jodosha/assets_packager/commit/1b90e1fdbd070819e8ece42875f18f3238851081">committed</a> a sprocketized version of rake tasks.</p>
