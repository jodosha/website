---
author:
  bio: Developer, music connisseur and avid tea lover.
  image: lg.png
  name: Luca Guidi
  twitter: jodosha
cover_image: cover.jpg
date: 2007-11-15T00:00:00Z
excerpt: ""
tags:
- ruby on rails
- rails
- snippets
title: 'Rails: How To Modify Template Contents Before Rendering'
url: /2007/11/15/rails-how-to-modify-template-contents-before-rendering/
---

<p>Just a quick snippet to modify template contents before <strong>ActionView</strong> render them via <strong>ERB</strong>.</p>

<code lang="ruby">
    ActionView::Base.class_eval do
      alias_method :action_view_render_template, :render_template
      def render_template(template_extension, template, file_path = nil, local_assigns = {})
        template ||= read_template_file(file_path, template_extension)
        template = "<div>#{template}</div>" # add your contents here.
        action_view_render_template(template_extension, template, file_path, local_assigns)
      end
    end
</code>
<p>You can add this code to <strong>environment.rb</strong>, but is preferible a <strong>plugin</strong>.</p>
