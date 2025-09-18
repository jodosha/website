---
author:
  bio: Developer, music connisseur and avid tea lover.
  image: lg.png
  name: Luca Guidi
  twitter: jodosha
cover_image: cover.jpg
date: 2009-06-17T00:00:00Z
excerpt: ""
tags:
- rails
- ruby on rails
- snippets
- i18n
- javascript
- jquery
- unobtrusive
- html5
title: 'Rails: Unobtrusive and i18n Javascript confirm'
url: /2009/06/17/rails-unobtrusive-and-i18n-javascript-confirm/
---

<p>How many times do you heard you should <strong>separate content from behavior</strong>? Never? Hmmm don&#8217;t try to cheat me.. So, why do you still use <code>:confirm</code> option for <code>link_to</code> helper?</p>

<p>Here a little snippet to archive our goal, and as extra bonus, you get it i18n:</p>

<p><code class="html"><br/>
&lt;script type="text/javascript"&gt;<br/>
window._authenticity_token = "";<br/>
&lt;/script&gt;</code></p>

<p>     t(:&#8217;asset.destroy&#8217;),<br/>
      :class          =&gt; &#8220;delete&#8221;,<br/>
      :&#8217;data-confirm&#8217; =&gt; t(:&#8217;asset.destroy_confirm&#8217;) %&gt;<br/></p>

<p><code class="javascript"><br/>
    $(document).ready(function(){<br/>
      $(".delete").bind("click", function() {<br/>
        if(window.confirm($(this).attr("data-confirm"))) {<br/>
          $.ajax({<br/>
            url: $(element).attr("href"),<br/>
            data: {<br/>
              _method: "delete",<br/>
              authenticity_token: window._authenticity_token<br/>
            },<br/>
            type: 'post',<br/>
            dataType: 'script'<br/>
          });<br/>
        }<br/>
        return false;<br/>
      });<br/>
    });<br/></code></p>

<p>Ok, first of all, I&#8217;m using <strong>jQuery</strong>. When the DOM is ready I&#8217;m going to bind all the elements with the <code>delete</code> class to the <code>click</code> event. When a user clicks on the link, it will use the <strong>HTML5</strong> <a href="http://ejohn.org/blog/html-5-data-attributes/">custom attribute</a> <code>data-confirm</code> as window confirmation content.</p>
