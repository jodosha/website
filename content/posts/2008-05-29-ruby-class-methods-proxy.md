---
author:
  bio: Developer, music connisseur and avid tea lover.
  image: lg.png
  name: Luca Guidi
  twitter: jodosha
cover_image: cover.jpg
date: 2008-05-29T00:00:00Z
excerpt: ""
tags:
- ruby
- snippets
title: 'Ruby: Class Methods Proxy'
url: /2008/05/29/ruby-class-methods-proxy/
---

<p>
  Did you ever used class methods inside your instance methods? If yes, you probably noticed how <strong>frustrating</strong> can be to use the <code>self.class.my_class_method</code> syntax. A solution could be to create a private method which encapsulates the class one.<br/><code class="ruby">
class Repository
  def self.path
    @@path
  end
  
  def print_path
    puts path
  end
  
  private
    def path
      self.class.path
    end
end
</code><br/>
In the above example, <code>#print_path</code> can print the <code>@@code</code> value, without worrying about it&#8217;s a class value, because we have wrapped it.
</p>

<p>
  When I developed <a href="http://lucaguidi.com/pages/sashimi">Sashimi</a> I&#8217;ve widely used this technique, with a bad impact on the code duplication, and in order to DRY-up my code I extended the Ruby&#8217;s <code>Class</code> class in this way:<br/><code class="ruby">
class Class
  def class_method_proxy(*method_names)
    method_names.each do |m|
      self.class_eval %{
        # Proxy method for <tt>#{self.class.name}##{m}</tt>
        def #{m}(*args, &amp;block)
          self.class.#{m}(*args, &amp;block)
        end
        private :#{m}
      }, __FILE__, __LINE__
    end
  end
end
</code>
</p>

<p>
  This approach allow us to annotate our classes, choosing which class methods should be available as private methods.
  Now, our example class should look like the following:<br/><code class="ruby">
class Repository
  def self.path
    @@path
  end
  class_method_proxy :path

  def print_path
    puts path
  end
end
</code>
</p>

<p>
  Of course you can pass multiple symbols to proxy many methods at the same time.<br/><code class="ruby">
class_method_proxy :path, :another_path, :a_third_one
</code>
</p>

<p><strong>UPDATE 2008-07-06:</strong> I added the <code>&amp;block</code> argument.</p>
