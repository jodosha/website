---
author:
  bio: Developer, music connisseur and avid tea lover.
  image: lg.png
  name: Luca Guidi
  twitter: jodosha
cover_image: cover.jpg
date: 2008-09-29T00:00:00Z
excerpt: ""
tags:
- ruby
- ruby on rails
- rails
- gem
- sashimi
- plugins
title: Released Sashimi 0.2.1
url: /2008/09/29/released-sashimi-021/
---

<p>I&#8217;ve just released a new version of <a href="http://lucaguidi.com/pages/sashimi">Sashimi</a> (<strong>0.2.1</strong>), it fixes a bug for Ubuntu.</p>

<h2>The Problem</h2>
<p>
  When the script starts tries to load repository concerned classes: <code>GitRepository</code> and <code>SvnRepository</code>, which are subclasses of <code>AbstractRepository</code>. In <code>repositories.rb</code> I use <code>Dir#[]</code> to load all the <code>.rb</code> files in a certain directory, but the order of the resulting array is unpredictable, so if the first class was <strong>not</strong> <code>AbstractRepository</code> <strong>Sashimi</strong> was crashing.
</p>

<h2>The Solution</h2>
<p>
  I&#8217;ve fixed it, so, if you have experienced this problem, please update <strong>Sashimi</strong> with:<br/><code class="bash">
$ (sudo) gem update sashimi
  </code>
</p>
