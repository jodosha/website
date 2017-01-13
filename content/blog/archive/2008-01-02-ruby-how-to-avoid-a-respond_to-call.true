---
author:
  bio: Developer, music connisseur and avid tea lover.
  image: lg.png
  name: Luca Guidi
  twitter: jodosha
cover_image: cover.jpg
date: 2008-01-02T00:00:00Z
excerpt: ""
tags:
- ruby
- snippets
- anti-if
title: 'Ruby: How To Avoid A respond_to? Call'
url: /2008/01/02/ruby-how-to-avoid-a-respond_to-call/
---

<p>I&#8217;m writing this post as contribution to the <a href="http://www.metodiagili.it/campagna-anti-if.html" title="Campagna Anti-IF" lang="it">Campagna Anti-IF</a> (Anti-IF Campaign).</p>
<h3>Problem</h3>
<p>I&#8217;m developing an internal Rails plugin for widgets, it provides a class called <code>Widget</code> (really unconventional :-P), and each widget should inherit from it.
The actual implementation provides a callback called <code>before_render</code>, that allows to add some logic to a widget, if implemented it&#8217;s called before the widget rendering.</p>
<p>Ruby doesn&#8217;t have abstract methods, so I have to check if the subclass has the implementation of mentioned method:<br/><code class="ruby">
    # Rendering code..
    before_render if respond_to? :before_render
    # ...
</code>
</p>
<p>As you can see it&#8217;s an inefficient and inelegant way to render the widget, cause we <strong>always</strong> check if the method was implemented, and because I have introduced an <code>if</code> statement.</p>
<h3>Solution</h3>
<p>I added to <code>Widget</code> an empty <code>before_render</code> method: if the method it wasn&#8217;t implemented into the subclass the rendering code will be safely called.
Here the new code:<br/><code class="ruby">
    def before_render
    end

    # Rendering code..
    before_render
    # ...
</code>
</p>
