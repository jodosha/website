---
image: /covers/introducing-lotus-view.jpg
thumbnail: /thumbnails/introducing-lotus-view.jpg
date: 2014-03-23
description: |
  The missing part of all the Ruby web frameworks is the distinction between views and templates. Keeping things separated, helps to declutter templates and models from presentation logic. Also, since views are objects they are easily testable. If you ever used Mustache, you are already aware of the advantages.
  Lotus::View is based on these simple concepts.
tags:
  - programming
title: Introducing Lotus::View
---

The missing part of all the Ruby web frameworks is the **distinction between views and templates**.
A _view_ is an object that encapsulates the presentation logic of a page.
A _template_ is a file that defines the semantic and visual elements of a page.
In order to show a result to an user, a template must be _rendered_ by a view.

Keeping things separated, helps to declutter templates and models from presentation logic.
Also, since views are objects they are easily testable.
If you ever used [Mustache](http://mustache.github.io/), you are already aware of the advantages.

[Lotus::View](https://github.com/lotus/view) is based on these simple concepts.

## Views

Here how a view looks like:

{{< highlight ruby >}}
require 'lotus/view'

module Articles
  class Index
    include Lotus::View
  end
end
{{< / highlight >}}

This syntax follows the Lotus philosophy: include a module that injects a minimal interface.
Before to illustrate how to use a view, I'd like to talk about a few conventions:

  * Templates are searched under `Lotus::View.root`, set this value according to your app structure (eg. `"app/templates"`).
  * A view will look for a template with a file name that is composed by its full class name (eg. `"articles/index"`).
  * A template must have two concatenated extensions: one for the format one for the engine (eg. `".html.erb"`).
  * The framework must be loaded before to render for the first time: `Lotus::View.load!`.

## Usage

Suppose that we want to render a list of `articles`:

{{< highlight ruby >}}
require 'lotus/view'

module Articles
  class Index
    include Lotus::View
  end
end

Lotus::View.root = 'app/templates'
Lotus::View.load!

path     = Lotus::View.root.join('articles/index.html.erb')
template = Lotus::View::Template.new(path)
articles = ArticleRepository.all

Articles::Index.new(template, articles: articles).render
{{< / highlight >}}

While this code is working fine, it's inefficient and verbose, because we are loading a template from the filesystem for each rendering attempt.
Also, this is strictly related to the HTML format, what if we want to manage other formats?

{{< highlight ruby >}}
require 'lotus/view'

module Articles
  class Index
    include Lotus::View
  end

  class AtomIndex < Index
    format :atom
  end
end

Lotus::View.root = 'app/templates'
Lotus::View.load!

articles = ArticleRepository.all

Articles::Index.render(format: :html, articles: articles)
  # => This will use Articles::Index
  #    and "articles/index.html.erb"

Articles::Index.render(format: :atom, articles: articles)
  # => This will use Articles::AtomIndex
  #    and "articles/index.atom.erb"

Articles::Index.render(format: :xml, articles: articles)
  # => This will raise a Lotus::View::MissingTemplateError
{{< / highlight >}}

First of all, we are preloading templates according to the above conventions, they are **cached internally** for future use.
This is a huge performance improvement.

A view is able to understand the given context and decide if render by itself or delegate to a subclass.

All the objects passed in the context are called locals, they are available both in the view and in the template:

{{< highlight ruby >}}
require 'lotus/view'

module Articles
  class Show
    include Lotus::View

    def authors
      article.map(&:author).join ', '
    end
  end
end
{{< / highlight >}}

{{< highlight html >}}
<h1><%= article.title %></h1>
<article>
  <%= article.content %>
</article>
{{< / highlight >}}

All the methods defined in the view are accessible in the template:

{{< highlight html >}}
<h2><%= authors %></h2>
{{< / highlight >}}

## Custom rendering

Since a view is an object, you can override `#render` and provide your own rendering policy:

{{< highlight ruby >}}
require 'lotus/view'

module Articles
  class Show
    include Lotus::View
    format :json

    def render
      ArticleSerializer.new(article).to_json
    end
  end
end

Articles::Show.render({format: :json, article: article})
  # => This will render from ArticleSerializer,
  #    without the need of a template
{{< / highlight >}}

## Other features

Lotus::View supports countless rendering engines, layouts, partials and it has lightweight presenters.
They are explained in detail in the [README](https://github.com/lotus/view#lotusview) and the [API documentation](http://rdoc.info/gems/lotus-view).

## Roadmap

As part of the [Lotus](http://lotusrb.org) roadmap, I will open source a framework each month.
On **April 23rd** I will release **Lotus::Model**.

{% include _lotusml.html %}
