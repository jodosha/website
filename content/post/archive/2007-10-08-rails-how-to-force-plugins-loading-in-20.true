---
author:
  bio: Developer, music connisseur and avid tea lover.
  image: lg.png
  name: Luca Guidi
  twitter: jodosha
cover_image: cover.jpg
date: 2007-10-08T00:00:00Z
excerpt: ""
tags:
- ruby
- ruby on rails
- rails
- plugins
- snippets
title: 'Rails: How to force plugins loading in 2.0'
url: /2007/10/08/rails-how-to-force-plugins-loading-in-20/
---

<p>Sometimes a <a href="http://www.rubyonrails.org">Rails</a> plugin can be dependant from another one. Since plugins are loaded in alphabetic order, probably you need to load the third part plugin first.</p>
<p>The release <strong><del>1.2.4</del> 2.0PR</strong> introduces breaking changes for this mechanism.</p>
<p>I&#8217;m developing a plugin called <strong>ClickToGlobalize</strong>, that&#8217;s dependant on <a href="http://www.globalize-rails.org/">Globalize</a>, here the code for plugin initialization:</p>
<code class="ruby">
    # Force Globalize loading.
    if Rails::VERSION::STRING.match /^1\.2+/
      load_plugin(File.join(RAILS_ROOT, 'vendor', 'plugins', 'globalize'))
    else
      Rails::Initializer.run { |config| config.plugins = [ :globalize ] }
    end

    require 'click_to_globalize'
</code>

<h3>Explanation</h3>
<p>Use the old mechanism if the current release is minor than the last release with it (<del>1.2.3</del> 1.2.4), else use the <a href="http://railsmanual.com/class/Rails::Initializer" title="Rails::Initializer API Doc">Rails::Initializer</a> class.</p>
<p>This code also works if you use the Rails edge into <code>app/vendor/rails</code>.</p>
<p><strong>UPDATE:</strong> Ooops, wrong version reporting, the breaking changes are in 2.0PR. The release 1.2.4 still uses <code>#load_plugin</code>.</p>
