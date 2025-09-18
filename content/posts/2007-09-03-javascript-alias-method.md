---
author:
  bio: Developer, music connisseur and avid tea lover.
  image: lg.png
  name: Luca Guidi
  twitter: jodosha
cover_image: cover.jpg
date: 2007-09-03T00:00:00Z
excerpt: ""
tags: null
title: Javascript Alias Method
url: /2007/09/03/javascript-alias-method/
---

<p>Working with a dynamic and complete language like <strong>Ruby</strong>, I feel the lack of many native methods. Lately, I&#8217;m <em>working-by-plugin</em>  implementing new code, and injecting it into the old one from Rails or Prototype, and so on..
It&#8217;s a very nice and grateful way of add and remove features on the fly, and change the aspect of the code.
In fact this kind of tecniques and programming paradigms are also called <acronym title="Aspect Oriented Programming">AOP</acronym>, due to the capability to change the <em>aspect</em> of an object, and, of course, its behaviors.
For this purpose, I feel very useful the Ruby <code>alias_method</code>. Of course, it&#8217;s a way to create an alias, and eventually override that method, and reuse the brand new name into the old one!!
So playing around a bit with Javascript, I have add this feature to the Object class:<br/><code class="javascript">
    Object.aliasMethod = function(object, newMethodName, oldMethodName) { 
      object[newMethodName] = object[oldMethodName]; 
    };
</code>

Here a little example:
<code class="javascript">
    String.prototype = Object.extend(String.prototype, {
      capitalize: function() {
        return 'The capitalized version of '+this+' is: '+this.aliasedCapitalizeMethod()+'.';
      }
    });

    alert('fOO'.capitalize());
    // -&gt; The capitalized version of fOO is; Foo.
</code>

<strong>UPDATE</strong>
I submitted a patch to the <strong>Prototype</strong> community and I noticed that the improve to the AOP, was already added into the 1.6.0-rc, by the method <em>wrap</em>. For a complete reference, visit the <strong>Sam Stephenson</strong> <a href="http://prototypejs.org/2007/8/15/prototype-1-6-0-release-candidate" title="Prototype 1.6.0 release candidate">post</a>.</p>
