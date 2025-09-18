---
author:
  bio: Developer, music connisseur and avid tea lover.
  image: lg.png
  name: Luca Guidi
  twitter: jodosha
cover_image: cover.jpg
date: 2008-03-19T00:00:00Z
excerpt: ""
tags:
- javascript
- effects
- prototype
- resizeable.js
title: Make your elements draggable and resizeable with Resizeable.js
url: /2008/03/19/make-your-elements-draggable-and-resizeable-with-resizeablejs/
---

<p>Hello, I&#8217;m still alive and I want to share a useful <strong>JavaScript</strong> class: <strong>Resizeable.js</strong>. It allows to make <strong>draggable and resizeable</strong> your DOM elements!</p>

<h3>How it works?</h3>
<p>
<code class="javascript">
new Resizeable('element');
</code>
</p>

<p>Your element has now <strong>two sensible areas</strong>: the border area and the central area. If you click on the central area and move the mouse around, keeping the left button pressed, your element will be <strong>dragged</strong>. If you are on the border area, and perform the same gesture, your element will be <strong>resized</strong>.</p>
<p>
  The default size of the border area is <strong>6px</strong>, but you can customize it via the options passed to the constructor:<br/><code class="javascript">
new Resizeable('element', {top:12, right:12, bottom:12, left:12});
</code>
</p>

<h3>Try it now!</h3>
<p>Try it now on the <a href="http://lucaguidi.com/assets/2008/3/19/resizeable.html">demo page</a>.</p>

<h3>Credits and License</h3>
<p><strong>Resizeable.js</strong> is based on <strong><a href="http://craz8.com">Thomas Fakes</a></strong> homonym class and on <strong><a href="http://mir.aculo.us">Thomas Fuchs</a></strong> <a href="http://script.aculo.us">Scriptaculous</a>, this means it depends on <a href="http://prototypejs.org">Prototype</a>(<em>1.6.0+</em>) and Scriptaculous (<em>1.8.0+</em>) itself.</p>
<p><strong>Resizeable.js</strong> is <strong>Free-Software</strong>, distributed under the <a href="http://www.opensource.org/licenses/mit-license.php">MIT License</a>.</p>

<h3>Download</h3>
<p><a href="http://lucaguidi.com/assets/2008/3/19/resizeable.js"><strong>Resizeable.js</strong></a> (md5: <em>aae8256ab0eff3972a03ed67e238e623</em>).</p>
