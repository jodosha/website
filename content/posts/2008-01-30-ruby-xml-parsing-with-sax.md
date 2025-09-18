---
author:
  bio: Developer, music connisseur and avid tea lover.
  image: lg.png
  name: Luca Guidi
  twitter: jodosha
cover_image: cover.jpg
date: 2008-01-30T00:00:00Z
excerpt: ""
tags:
- ruby
- snippets
- xml
- sax
title: 'Ruby: XML Parsing With SAX'
url: /2008/01/30/ruby-xml-parsing-with-sax/
---

<p><strong><acronym title="Simple API for XML">SAX</acronym></strong> is an <a href="http://en.wikipedia.org/wiki/Event-driven"><strong>event-driven</strong></a> parser for <acronym title="eXtensible Markup Language">XML</acronym>.</p>
It <strong>sequentially</strong> reads the xml and generates special events. So, if you want to use SAX, you should implement the code to handle them. It&#8217;s quite different from the <strong><acronym title="Document Object Model">DOM</acronym></strong> model, where the whole xml is parsed and loaded in an <a href="http://en.wikipedia.org/wiki/Tree_(data_structure)" title="Tree (data structure)">tree</a>.
As you can see, the first approach is more difficult than the DOM one. Why we should use it? Depends.
If you want to extract certain informations from a big file, probably you should choose a SAX implementation, in this way you can avoid the initial DOM loading overhead.

<h3>The Ruby XML Library</h3>
<p>The Ruby core library has a built-in XML parser (both DOM and SAX) called <strong>REXML</strong>, but it&#8217;s terribly slow, it&#8217;s highly advisable to use <a href="http://libxml.rubyforge.org/"><strong>libxml</strong></a>. It&#8217;s a binding to the popular library from <strong>Gnome</strong> and it was released as gem.</p>

<h3>The Ruby Implementation</h3>
<p>In first instance we need an <strong>handler</strong>, to deal with the SAX events.<br/><code class="ruby">
class Handler
  def method_missing(method_name, *attributes, &amp;block)
  end
end
  </code>
</p>
<p>Libxml generates several events and it expects to find certain methods into the class assigned ad handler. With <code>method_missing</code> we simply avoid any exception.</p>

<h3>A More Useful Example</h3>
<p>We try to extract the most recent headlines of a blog.</p>
<p>Download the feed:<br/><code class="bash">
curl <a href="http://feeds.feedburner.com/LucaGuidi">http://feeds.feedburner.com/LucaGuidi</a> &gt;&gt; luca.xml
</code>
</p>

<p>Now we need our custom SAX parser:<br/><code class="ruby">
require 'rubygems'
require 'xml/libxml'
require 'handler'

class SaxParser
  def initialize(xml)
    @parser = XML::SaxParser.new
    @parser.string = xml
    @parser.callbacks = Handler.new
  end

  def parse
    @parser.parse
    @parser.callbacks.elements
  end
end
</code>
</p>
<p>We have just wrapped the SAX parser from <strong>libxml</strong> and we have registered our first class as callback handler.</p>

<p>Now we are going to improve the handler to recognize and save the post titles:<br/><code class="ruby">
class Handler
  attr_accessor :elements

  def initialize
    @elements = []
  end

  def on_start_element(element, attributes)
    @print = true if element == 'title'
  end

  def on_characters(characters = '')
    @elements 
</code></p>
<p>When the handler is instantiated we create an internal array to store our results, then when we find and <code>title</code> element we set on <code>true</code> the <code>print</code> flag. When it&#8217;s <code>true</code> we can store the data into <code>elements</code>, then we set on <code>false</code> on the ending handler of the element.</p>

<h3>Usage</h3>
<p>We create a trivial script:<br/><code class="ruby">
#!/usr/bin/env ruby
require 'sax_parser'

xml = open(ARGV[0], 'r').collect { |l| l }.join
puts SaxParser.new(xml).parse
</code>
</p>
<p>From the shell:<br/><code lang="shell">
./parse luca.xml
</code>
</p>

<h3>Conclusion</h3>
<p>SAX is less elegant and easy than DOM, but could be very useful in certain cases.</p>
