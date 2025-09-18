---
author:
  bio: Developer, music connisseur and avid tea lover.
  image: lg.png
  name: Luca Guidi
  twitter: jodosha
cover_image: cover.jpg
date: 2008-05-20T00:00:00Z
excerpt: ""
tags:
- ruby
- gem
- plugins
- ruby on rails
- rails
- sashimi
title: 'Sashimi: Just Received A Tasteful Update'
url: /2008/05/20/sashimi-just-received-a-tasteful-update/
---

<p>On yesterday <a href="http://jodosha.tumblr.com/2008/05/19/sashimi-a-rails-plugins-manager-gem.html" title="Sashimi: A Rails Plugins Manager Gem">I announced</a> <a href="http://lucaguidi.com/pages/sashimi">Sashimi</a> and now it&#8217;s already time of tasteful updates.</p>

<h3>Changes</h3>
<p>First, thanks to all the people that appreciated my work. Second, new commands and options are avaliable for Sashimi.</p>

<p>Update all plugins in your repository:<br/><code class="bash">
$ sashimi update --all
</code>
</p>

<p>Install a plugin to your Rails app:<br/><code class="bash">
$ sashimi install --rails click-to-globalize
</code><br/><strong>NOTE</strong> this is an alias for the <code>add</code> command.
</p>

<p>Update a plugin of a Rails app:<br/><code class="bash">
$ sashimi update --rails click-to-globalize
</code><br/><strong>NOTE</strong> If your application is versioned with Svn or Git, Sashimi will automatically schedules for add/remove the added/removed files.
</p>

<h3>How To Update</h3>
<code class="bash">
$ (sudo) gem update jodosha-sashimi --source=http://gems.github.com
</code>

<p>I hope you enjoy those addictional options.</p>
