---
author:
  bio: Developer, music connisseur and avid tea lover.
  image: lg.png
  name: Luca Guidi
  twitter: jodosha
cover_image: cover.jpg
date: 2007-02-21T00:00:00Z
excerpt: ""
tags:
- ruby
- ruby on rails
- rails
- snippets
- activerecord
- validations
title: 'Ruby on Rails: Validate URL'
url: /2007/02/21/ruby-on-rails-validate-url/
---

<p>Hi, just a snippet to validate an url with <strong>Ruby on Rails</strong>.</p>

<code class="ruby">
    class WebSite  /^((http|https):\/\/)*[a-z0-9_-]{1,}\.*[a-z0-9_-]{1,}\.[a-z]{2,4}\/*$/i

      def validate
        errors.add(:url, "unexistent") unless WebSite.existent_url?(:url)
      end

      def self.existent_url?(url)
        uri = URI.parse(url)
        http_conn = Net::HTTP.new(uri.host, uri.port)
        resp, data = http_conn.head("/" , nil)
        resp.code == "200"
      end
    end
</code>
