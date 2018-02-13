---
author:
  bio: Developer, music connisseur and avid tea lover.
  image: lg.png
  name: Luca Guidi
  twitter: jodosha
cover_image: cover.jpg
date: 2009-02-04T00:00:00Z
excerpt: ""
tags:
- ruby
- hash
- snippets
title: Hash deep search
url: /2009/02/04/hash-deep-search/
---

<p>I&#8217;m back and I wanna share those simple snippets with you:</p>~
<p>
<code class="ruby">
class Hash
  def deep_has_key?(key)
    self.has_key?(key) || any? {|k, v| v.deep_has_key?(key) if v.is_a? Hash}
  end
  alias :deep_include? :deep_has_key?
  alias :deep_key? :deep_has_key?
  alias :deep_member? :deep_has_key?
  
  def deep_has_value?(value)
    self.has_value?(value) || any? {|k,v| v.deep_has_value?(value) if v.is_a? Hash}
  end
  alias :deep_value? :deep_has_value?
end
</code>
</p>
<p>
Example:<br/><code class="ruby">
{:a =&gt; {:c =&gt; 'c'}, :b =&gt;{:d =&gt; {:e =&gt; 'e'}}}.deep_has_key?(:e) # =&gt; true
{:a =&gt; {:c =&gt; 'c'}, :b =&gt;{:d =&gt; {:e =&gt; 'e'}}}.deep_has_key?(:z) # =&gt; false

{:a =&gt; {:c =&gt; 'c'}, :b =&gt;{:d =&gt; {:e =&gt; 'e'}}}.deep_has_value?('e') # =&gt; true
{:a =&gt; {:c =&gt; 'c'}, :b =&gt;{:d =&gt; {:e =&gt; 'e'}}}.deep_has_value?('z') # =&gt; false
</code>
</p>
<p>For a complete test suite, please check <a href="http://gist.github.com/58257" title="Ruby's Hash deep search">related gist</a>.</p>
