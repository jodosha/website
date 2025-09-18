---
author:
  bio: Developer, music connisseur and avid tea lover.
  image: lg.png
  name: Luca Guidi
  twitter: jodosha
cover_image: cover.jpg
date: 2008-10-23T00:00:00Z
excerpt: ""
tags:
- ruby
- ruby on rails
- tdd
title: Skip Mocha
url: /2008/10/23/skip-mocha/
---

<p>Yesterday <a href="http://jodosha.tumblr.com/2008/10/22/cached-models-003.html">I confessed</a> how messed up was <a href="http://jodosha.tumblr.com/2008/10/10/cached-models-002.html" title="CachedModels 0.0.2">CachedModels 0.0.2</a>. The problem was pretty simple: I made some mistakes mocking up <a href="http://www.danga.com/memcached/">Memcached</a> behaviors.</p>

<h3>The Dilemma</h3>
<p>
  I massively use <a href="http://mocha.rubyforge.org/">Mocha</a> for track how many calls CachedModels performs against the cache, and (ideally) for run test suite without any server active.
  But, this approach led me to broken results. Should I keep out Mocha from my tests?
</p>

<h3>The Solution</h3>
<p>
  Why don&#8217;t mock the mock? We know, Ruby allows to add behaviors to classes at runtime, Mocha itself take this advantage.
  I added to my <code>test_helper.rb</code> the following code:<br/><code class="ruby">
if ENV['SKIP_MOCHA'] == 'true'
  class Object
    def expects(*args)
      self
    end

    def method_missing(method_name, *args, &amp;block)
    end
  end

  class NilClass
    def method_missing(method_name, *args, &amp;block)
    end
  end
end
</code>
</p>
<p>
  Now I can safely run tests without Mocha:<br/><code class="bash">
$ rake cached_models SKIP_MOCHA=true
</code>
</p>
