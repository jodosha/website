---
author:
  bio: Developer, music connisseur and avid tea lover.
  image: lg.png
  name: Luca Guidi
  twitter: jodosha
cover_image: cover.jpg
date: 2008-05-19T00:00:00Z
excerpt: ""
tags:
- sashimi
- gem
- ruby
- ruby on rails
- rails
- plugins
title: 'Sashimi: A Rails Plugins Manager Gem'
url: /2008/05/19/sashimi-a-rails-plugins-manager-gem/
---

<p>I have a really, really bad memory: each time I need to install a <a href="http://rubyonrails.org" title="Ruby on Rails home page">Rails</a> plugin, I Google to find the repository, then try to download the code. Often, I remember the url, but the server is down. Damn!</p>
<p>All this annoying issues kill the Rails rapidity on application prototyping. But, what if all the plugins which I need are available <strong>offline</strong> on my notebook? I can forget about all that urls, and I should stop to worry about the server status.</p>
<p>To solve this problems, I wrote <a href="http://lucaguidi.com/pages/sashimi" title="Sashimi page">Sashimi</a>, it&#8217;s a gem that manages you favourite Rails plugins in a local repository.</p>

<h3>How It Works?</h3>
<p>First you need to install it with:<br/><code class="bash">
$ (sudo) gem install jodosha-sashimi --source=http://gems.github.com
</code><br/>
Now you can install a plugin on your local repository:<br/><code class="bash">
$ sashimi install git://github.com/jodosha/click-to-globalize.git
</code><br/>
Ta-daaaa!! Now <a href="http://lucaguidi.com/pages/click-to-globalize">Click to Globalize</a> is available offline:<br/><code lang="shell">
$ sashimi list

click-to-globalize
</code>
If you need to add it to your Rails app, just move to your app root, then type:<br/><code class="bash">
$ sashimi add click-to-globalize
</code>
</p>

<h3>Conclusion</h3>
<p>I found <strong>Sashimi</strong> really useful, I hope you too.</p>
<p>For the complete reference, please check out at the <a href="http://lucaguidi.com/pages/sashimi" title="Sashimi page">official gem page</a>.</p>
