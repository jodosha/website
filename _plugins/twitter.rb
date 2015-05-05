require 'rack/utils'

module Jekyll
  class Twitter < Liquid::Tag
    BASE_URL    = 'https://twitter.com/intent/tweet'.freeze
    SCREEN_NAME = 'jodosha'.freeze

    def initialize(tag_name, text, tokens)
      super
      @text = text
    end

    def render(context)
      %(<p class="twitter-share"><span class="text">#{ @text }</span><a title="Click to tweet" target="_blank" href="#{ twitter_url(context) }"><img width="16" height="16" src="/images/twitter.png"></a></p>)
    end

    private
    def twitter_url(context)
      BASE_URL +
        "?text=" + ::Rack::Utils.escape(@text) +
        "&url="  + article_url(context) +
        "&via="  + SCREEN_NAME
    end

    def article_url(context)
      domain(context) +
        path(context)
    end

    def domain(context)
      context.environments.first['site']['url']
    end

    def path(context)
      context['page']['url']
    end
  end
end

Liquid::Template.register_tag('twitter', Jekyll::Twitter)
