---
author:
  bio: Developer, music connisseur and avid tea lover.
  image: lg.png
  name: Luca Guidi
  twitter: jodosha
cover_image: cover.jpg
date: 2007-10-05T00:00:00Z
excerpt: ""
tags:
- ruby
- snippets
title: 'Ruby: How to check the operating system'
url: /2007/10/05/ruby-how-to-check-the-operating-system/
---

<p>Today I&#8217;m finishing the code cleanup for my latest Rails plugin (will be soon released) and I want to execute some rake tasks, only if the <acronym title="Operating System">OS</acronym> supports certain system calls.</p>
<p>The following snippet helps to check the current platform.</p>
<code class="ruby">
    # (c) 2007 Luca Guidi (<a href="http://www.lucaguidi.com">www.lucaguidi.com</a>) - Released under MIT License.
    # This code was inspired by Prototype rake test tasks.
    require 'webrick'

    class OperatingSystem
      class  </code>
