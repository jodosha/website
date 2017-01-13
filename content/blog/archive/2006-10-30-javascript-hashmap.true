---
author:
  bio: Developer, music connisseur and avid tea lover.
  image: lg.png
  name: Luca Guidi
  twitter: jodosha
cover_image: cover.jpg
date: 2006-10-30T00:00:00Z
excerpt: ""
tags:
- javascript
- hashmap
- hash
- java
title: Javascript HashMap
url: /2006/10/30/javascript-hashmap/
---

<p><p lang="en">Reading around i&#8217;ve discovered that Javascript associative arrays returns unpredictable results, i.e. <strong>length</strong> param is not correctly handled.</p>
<p lang="en"><strong>Array</strong> object should be used only with a numeric index and best way to avoid this problem is to use <strong>Object</strong>.</p>
<p lang="en"><strong>But, if I wanna put more objects in my object?</strong></p>
<p lang="en">Of course i can do this with previous method, but i don&#8217;t like it :-P. So, i&#8217;ve written a 100% <acronym title="Object Oriented Programming">OOP</acronym> class, that use <a class="liexternal" href="http://prototypejs.org">Prototype</a> and it simulate a java <a class="liexternal" href="http://java.sun.com/j2se/1.4.2/docs/api/java/util/HashMap.html">HashMap</a>.</p>
<p lang="en">I&#8217;ve also implemented an <strong>exception handling</strong>.</p>
<p lang="en">A little example:</p>

<code class="javascript">
    var myHM = new HashMap();
    myHM.put('a', new String('This string contains A'));
    myHM.put(new String('b'), new String('This string contains B'));
    myHM.put('0', new String('And this string? Zero'));
    window.alert(myHM.size());  // returns 3

    // Replace
    // Notice that you can use both String object or scalar value.
    myHM.put('b', new Date());
    if( myHM.get('b') instanceof Date )
      window.alert('It\'s a Date');
    // Remove
    if( myHM.containsKey('a') &amp;&amp; myHM.containsValue('This string contains A') )
      window.alert('\'A\' object is present');
    myHM.remove('a');
    if( myHM.containsKey('a') || myHM.containsValue('This string contains A') )
      window.alert('Ooops \'A\' is still present');   // Don't display

    window.alert(myHM.size());  // returns 2

    // Clear
    myHM.clear();
    window.alert(myHM.size());  // returns 0
</code>

<p lang="en">I hope this is useful for you, of course I&#8217;ve attached source code.</p>

<div class="biblio">
<h4>Attachment</h4>
<ul><li><a href="/wp-content/uploads/2006/10/js_hashmap.tar.gz">Javascript HashMap source code</a></li>
</ul></div></p>
