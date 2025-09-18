---
author:
  bio: Developer, music connisseur and avid tea lover.
  image: lg.png
  name: Luca Guidi
  twitter: jodosha
cover_image: cover.jpg
date: 2009-02-13T00:00:00Z
excerpt: ""
tags:
- ruby on rails
- rails
- caching
- javascript
- jquery
- caching
- page caching
title: Rails caching and Javascript pt. 2
url: /2009/02/13/rails-caching-and-javascript-pt-2/
---

<p>In the previous <a href="http://jodosha.tumblr.com/2009/02/09/rails-caching-and-javascript-pt-1.html" title="Rails caching and Javascript">article</a> I showed how to take the advantage of Javascript for page caching.</p>
<p>This cache strategy allows to generate static HTML and allow the web server to serve it, without waste a useless Rails request/response cycle. But, since the cached page is stateless we ask help to Javascript for make it a little bit dynamic.</p>

<h2>Flash</h2>
<p>
  All of you has probably noticed that <a>flash</a> object is an enemy of page caching. Let me show you why.<br/><code class="ruby">
class SessionController 
  Now suppose the application is in a blank state, when the user hits the <code>dashboard_url</code>, ActionPack will cache the page, including the flash status. This means it will be always rendered, even if the flash will be expired.
</code></p>
<p>
  The idea is to send the flash contents inside a cookie, when the page finish to load, Javascript will show the message.<br/><code class="ruby">
class SessionController <br/><code lang="javascript">
// cookies.js
var Document = {
  cookies: function(document){
    return $A(document.cookie.split("; ")).inject($H({}), function(memo, pair){
      pair = pair.split('=');
      memo.set(pair[0], pair[1]);
      return memo;
    });
  }
};
Object.extend(document, { cookies: Document.cookies.methodize() });
  </code><br/><code lang="javascript">
// application.js
function showFlash(){
  if(flash = document.cookies().get('flash')){
    $('flash').update(escape(flash));
    document.cookie = "flash="+escape(flash)+";expires=" + (new Date()).toGMTString();
  }
}

document.observe('dom:loaded', showFlash);
  </code>
</code></p>
<p>When the DOM is loaded <code>showFlash</code> looks for a cookie called <code>flash</code>, if it exist update the page with its contents, then <em>kill</em> it, setting the expiration date on the current time. This because we want to show flash contents only once.</p>
