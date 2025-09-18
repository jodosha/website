---
author:
  bio: Developer, music connisseur and avid tea lover.
  image: lg.png
  name: Luca Guidi
  twitter: jodosha
cover_image: cover.jpg
date: 2007-11-27T00:00:00Z
excerpt: ""
tags:
- ruby
- snippets
title: 'Ruby: Read A File With One Line Of Code'
url: /2007/11/27/ruby-read-a-file-with-one-line-of-code/
---

<p>This snippet shows how to read a file and puts all the lines into an array.</p>

<code lang="ruby">
    f = *open('file.txt').map {|l| l.rstrip}
    # =&gt; ["Hi, from the", "txt file."]
</code>

<h3>Explanation</h3>
<p>The <strong>open</strong> method returns an <a href="http://www.ruby-doc.org/core/classes/IO.html" title="IO class on Ruby API DOC">IO</a> object, that include the <strong>Enumerable</strong> module, now we can just use <strong>#map</strong> (or <strong>#collect</strong>).</p>
<p>The <strong>splat</strong> operator is only a sugar syntactical shortcut for <strong>map</strong>.</p>
