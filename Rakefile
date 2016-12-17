require "rubygems"
require "tmpdir"

require "bundler/setup"
require "jekyll"


GITHUB_REPONAME = "jodosha/jodosha.github.io"


namespace :site do
  desc "Generate blog files"
  task :generate do
    Jekyll::Site.new(Jekyll.configuration({
      "source"      => ".",
      "destination" => "_site"
    })).process
  end


  desc "Generate and publish blog to master"
  task :publish => [:generate] do
    Dir.mktmpdir do |tmp|
      cp_r "_site/.", tmp
      Dir.chdir tmp
      system "git init"
      system "git add ."
      message = "Site updated at #{Time.now.utc}"
      system "git commit -m #{message.inspect}"
      system "git remote add origin git@github.com:#{GITHUB_REPONAME}.git"
      system "git push origin master:refs/heads/master --force"
    end
  end
end

desc 'write a blog post. (Use title="An Awesome Article")'
task :write do
  require 'fileutils'

  date      = Time.now.strftime "%Y-%m-%d"
  title     = ENV['title']
  permalink = title.scan(/[[:alnum:][:space:]]/i).flatten.join.downcase.gsub(' ', '-')

  metadata = <<-YAML
---
layout: post

title: "#{ title }"
cover_image: #{ permalink }.jpg
tags: programming

excerpt: ""

author:
  name: Luca Guidi
  twitter: jodosha
  bio: Developer, music connisseur and avid tea lover.
  image: lg.png
---

Text

YAML

  FileUtils.mkdir_p '_posts'
  File.open("_posts/#{date}-#{ permalink }.md", 'w+') do |file|
    file.write metadata
  end
end

class MlCompiler
  def initialize(template, title, article)
    require 'erb'
    require 'maruku'
    require 'nokogiri'

    @template = ERB.new(template)
    @title    = title
    @content  = content(article)
  end

  def compile
    @template.result(binding)
  end

  private

  def content(article)
    html = Maruku.new(article, on_error: :raise).to_html
    doc  = Nokogiri::HTML(html)

    doc.search('p').each_with_object([]) do |paragraph, result|
      result << <<-LINE
<tr>
  <td align="left" style="padding: 20px 0 0 0; font-size: 16px; line-height: 25px; font-family: Helvetica, Arial, sans-serif; color: #666666;" class="padding-copy">#{paragraph.text}</td>
</tr>
LINE
    end.join("\n")
  end
end

desc 'write a ml issue. (Use title="An Awesome Article" article=article.md num=00001)'
task :ml do
  require 'fileutils'

  template = File.read("ml/template.erb")
  title    = ENV['title'] or raise ArgumentError.new("title is required")
  article  = ENV['article'] or raise ArgumentError.new("article is required")
  number   = ENV['num'] or raise ArgumentError.new("num is required")
  article  = File.read(article)

  compiler = MlCompiler.new(template, title, article)
  FileUtils.mkdir_p("ml/#{number}")
  File.write("ml/#{number}/index.html", compiler.compile)
end
