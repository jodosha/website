---
author:
  bio: Developer, music connisseur and avid tea lover.
  image: lg.png
  name: Luca Guidi
  twitter: jodosha
cover_image: cover.jpg
date: 2007-12-21T00:00:00Z
excerpt: ""
tags:
- ruby on rails
- rails
- activerecord
- validations
- snippets
title: 'Rails: How To Create Custom Validations'
url: /2007/12/21/rails-how-to-create-custom-validations/
---

<p>Often our model objects leaning toward to be confused or noisy, due to validations DSLs. Imagine a class <code>Answer</code>, with an attribute, that should be exactly a string representation of a boolean. Ok, I know it&#8217;s an odd example, but: it&#8217;s trivial enough to make this example clear, and.. It happened to me to deal with this situation. :-P</p>
<p>
<code class="ruby">
    class Answer  %w( true false ),
                             :message =&gt; "Should be exactly true or false."
    end
</code>
</p>
<p>Now, we try to clean-up a bit this code.
First, create a file named <code>validations.rb</code> into <code>lib</code>, then copy and paste this code:<br/><code class="ruby">
    module ActiveRecord
      module Validations
        module ClassMethods
          @@boolean_values = %w( true false )
          @@validates_boolean_msg = "Should be exactly #{@@boolean_values.join(' or ')}."

          # Check if the value is a boolean: <tt>true</tt> or <tt>false</tt>.
          def validates_boolean(*attr_names)
            configuration = { :message   =&gt; @@validates_boolean_msg,
                              :in        =&gt; @@boolean_values }

           configuration.update(attr_names.pop) if attr_names.last.is_a?(Hash)
           validates_inclusion_of attr_names, configuration
          end
        end
      end
    end
</code><br/>

Then we are going to add the following line at the end of <code>environment.rb</code><br/><code class="ruby">
  require 'validations'
</code>
</p>

<p>Let&#8217;s clean the code:<br/><code class="ruby">
    class Answer 
</code></p>

<p>Is it better? Maybe.. ;-)</p>
