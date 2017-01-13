---
author:
  bio: Developer, music connisseur and avid tea lover.
  image: lg.png
  name: Luca Guidi
  twitter: jodosha
cover_image: cover.jpg
date: 2007-11-28T00:00:00Z
excerpt: ""
tags:
- ruby on rails
- rails
- plugins
- activerecord
- activeresource
- acts as resource
title: 'Acts As Resource: Combining ActiveRecord and ActiveResource'
url: /2007/11/28/acts-as-resource-combining-activerecord-and-activeresource/
---

<p>Would you use both <strong>ActiveRecord</strong> and <strong>ActiveResource</strong> in <strong>one</strong> class?
  Now with <strong>Acts As Resource</strong> you can!!</p>

<h3>Example</h3>
<code class="ruby">
  class Carrot
    acts_as_resource
    self.site = 'http://localhost:3000'

    belongs_to :bunny

    validates_presence_of :color
    validates_uniqueness_of :color
    validates_length_of :color, :within =&gt; 2..23,
                        :if =&gt; lambda { |c| c.color &amp;&amp; !c.color.empty? }
    validates_format_of :color,
                        :with =&gt; /[\w\s]+$/,
                        :if =&gt; lambda { |c| c.color &amp;&amp; !c.color.empty? }

    before_create :please_call_me_before_create
    def self.validate
      logger.debug("VALIDATE #{color}")
    end

    def please_call_me_before_create
      logger.debug("Ohhh, so you called me..")
    end
  end
</code>

<h3>About</h3>
<p>You can find many informations about <strong>Acts As Resource</strong> on <a href="http://www.lucaguidi.com/pages/acts-as-resource" title="Acts As Resource">related page</a> on my blog.</p>

<h3>Vote</h3>
<p>If you find it useful feel free to <a href="http://agilewebdevelopment.com/favorites/new/1002" title="Add Acts As Resource to favs">add to your favs</a> on <a href="http://agilewebdevelopment.com">agilewebdevelopment.com</a></p>
