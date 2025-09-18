---
author:
  bio: Developer, music connisseur and avid tea lover.
  image: lg.png
  name: Luca Guidi
  twitter: jodosha
cover_image: cover.jpg
date: 2009-04-10T00:00:00Z
excerpt: ""
tags:
- ruby on rails
- rails
- click to globalize
- i18n
- plugins
title: Click To Globalize for Rails 2.3
url: /2009/04/10/click-to-globalize-for-rails-23/
---

<p>For all of you who don&#8217;t know what I&#8217;m talking about, **Click to Globalize** is a Rails plugin for in-place translations. Now it&#8217;s compatible with Rails 2.3 and It&#8217;s also the most clean and polish version of ever, let me explain what&#8217;s changed.

</p><h3>Engine</h3>
Yes, **Click to Globalize** is now an [engine](<a href="http://rails-engines.org/">http://rails-engines.org/</a>), this means all the controllers, the helpers, the routes and the other stuff, now lives in `vendor/plugins`. No more clutter with flying files, except for one javascript and one stylesheet.

<h3>I18n</h3>
The [i18n team](<a href="http://i18n-rails.org/">http://i18n-rails.org/</a>) (myself included) worked hard to build a **consistent API** for i18n. Starting from Rails 2.2 we have bundled a gem for this purpose, and now my plugin is totally compliant with this system, this **agnosticism** allow you to use whatever i18n backend you want. Click to Globalize is **no longer a Globalize extension!!**  

<h3>RESTful</h3>
The plugin now bundles two **full RESTful** controllers: `TranslationsController` and `LocalesController`, respectively `/translations` and `/locales`.

<h3>Lightweight</h3>
I replaced the annoying `around_filter` system, with a more lightweight one, based on the observation of `ActionView#render`.

<h3>Formatting</h3>
I removed the support for **Markdown** and **Textile**, personally I never used so much, and don&#8217;t think they are so related with i18n.

<h3>Deprecations</h3>
The old `globalize?` method is deprecated in favor of `in_place_translations?`.  

You can find all the new instructions to the [project page](<a href="http://lucaguidi.com/projects/click-to-globalize">http://lucaguidi.com/projects/click-to-globalize</a>) or on [GitHub](<a href="http://github.com/jodosha/click-to-globalize">http://github.com/jodosha/click-to-globalize</a>).  
Enjoy!
