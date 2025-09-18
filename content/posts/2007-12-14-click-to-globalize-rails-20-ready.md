---
author:
  bio: Developer, music connisseur and avid tea lover.
  image: lg.png
  name: Luca Guidi
  twitter: jodosha
cover_image: cover.jpg
date: 2007-12-14T00:00:00Z
excerpt: ""
tags:
- ruby on rails
- rails
- plugins
- i18n
- click to globalize
title: 'Click To Globalize: Rails 2.0 Ready'
url: /2007/12/14/click-to-globalize-rails-20-ready/
---

<p>I have finished to work on <a href="http://www.lucaguidi.com/pages/click-to-globalize" title="Click To Globalize">Click To Globalize</a>, to made it Rails 2.0 compatible.</p>

<h3>What&#8217;s Changed?</h3>
<p>All and nothing: from the user point of view, the plugin has the same behaviors of the previous version. My recent activity was a refactoring, now it:
  </p><ul><li>Works with <a href="http://activereload.net/2007/3/6/your-requests-are-safe-with-us" title="Your requests are safe with us">CSRF Killer</a></li>
    <li>Works with <a href="http://prototype.js" title="Prototype">Prototype 1.6.0.1</a> and <a href="http://script.aculo.us" title="Scriptaculous">Scriptaculous 1.8.0.1</a></li>
    <li>Works with rewritten version of Scriptaculous <code>Ajax.InPlaceEditor</code></li>
    <li>Works with new Prototype events handling</li>
    <li>Uses new Prototype&#8217;s <code>Element#addMethods</code> and <code>Function#wrap</code> to add methods and <acronym title="Aspect Orient Programming">AOP</acronym></li>
    <li>Uses Protoype <code>Hash#get</code>, instead of square brackets</li>
    <li>Uses <code>.html.erb</code> as helper, instead of <code>.rhtml</code></li>
    <li>Has a more clean installation/disinstallation process</li>
    <li>Has DRYed up tests</li>
    <li>Hasn&#8217;t prototype.js into the packaging</li>
  </ul><h3>How To Use It?</h3>
<p>
  <strong>Rails 2.0</strong><br/><code lang="shell">
    $ ./script/plugin install <a href="http://dev.23labs.net/svn/rails/plugins/click_to_globalize/trunk">http://dev.23labs.net/svn/rails/plugins/click_to_globalize/trunk</a>
  </code><br/><strong>Rails 1.2.x</strong><br/><code lang="shell">
    $ ./script/plugin install <a href="http://dev.23labs.net/svn/rails/plugins/click_to_globalize/branches/for-1.2.x">http://dev.23labs.net/svn/rails/plugins/click_to_globalize/branches/for-1.2.x</a>
  </code>

  For a detailed guide, howtos, snippets, video-tutorials and other infos, please visit the <a href="http://www.lucaguidi.com/pages/click-to-globalize" title="Click To Globalize">Click To Globalize</a> page.
</p>
