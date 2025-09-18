---
image: /covers/lean-rails-app-setup.jpg
thumbnail: /thumbnails/lean-rails-app-setup.jpg
date: 2012-02-27
excerpt: When I joined the IFAD team last September, I had big problems to deal with
  all this amount of informations and to clone projects from GitHub then make them
  running on my dev machine. The most common issue is the missing and/or outdated
  documentation.
tags:
  - programming
title: Lean Rails App Setup
---

<p>I&#8217;m currently working as a consultant for an UN agency (<a href="http://www.ifad.org">IFAD</a>) and we have a portfolio of <strong>~15 Rails</strong> apps, developed in the last four years. The environment is heterogeneous and an half dozen of these projects are interfacing with legacy software and they are legacy themselves. As counterpart, the new apps we are developing are running on the latest bleeding edge technologies (Ruby 1.9.3, Rails 3.2, MongoDB, Redis, WebSockets etc..).</p>

<p>When I joined the team in last September, I had big problems to deal with all this amount of informations and to clone projects from <a href="https://github.com/ifad">GitHub</a> then make them running on my dev machine. The most common issue is the missing and/or outdated documentation. Developers are lazy people and, in general, they just want to code. Documentation, UI/UX reviews are just an example of what they tend to avoid.</p>

<p>The <em>post-git-clone</em> syndrome became really frustrating for each project I needed to work on, so now I aim to document and create a single Rake task for setup.</p>

<p>Since we have several persistence options, to run all these databases as <em>init.d</em> services would be overkilling for my MacBook. So I went for the <em>all-turned-off-by-default</em> strategy and run only the processes that I actually need for a code session. I&#8217;m a big fan of <a href="http://ddollar.github.com/foreman/">Foreman</a>, and it perfectly fits this need. Plus I don&#8217;t have to remind which is the database(s) needed for that specific project or if it needs a queue, everything is ready with just <strong>foreman start</strong>.</p>

<p>In our team we almost all use Mac (with <a href="http://mxcl.github.com/homebrew/">Homebrew</a>) as setup, but since a Foreman&#8217;s <em>Procfile</em> is too much coupled with the current machine is running on, I create a <strong>Procfile.example</strong> in each project and let my colleagues to customize their own configuration, according their machine, or completely skip it and use their own workflow. Remember, the goal isn&#8217;t about unify the development process, but to have the application running in less than 5 minutes, for people who never worked on that project before.</p>

<p>Here a complete and working example:</p>

{{< highlight ruby >}}
# lib/tasks/app.rake

namespace :app do
  desc 'Setup the application'
  task :setup do
    require 'fileutils'

    # ENVIRONMENT
    puts "\n** Configuring servers.\n"

    ## Foreman
    puts "*** Configuring Foreman."
    FileUtils.cp Rails.root.join('Procfile.example'),
      Rails.root.join('Procfile')

    ## Pow
    puts "*** Configuring Pow."
    FileUtils.ln_sf Rails.root, File.expand_path('~/.pow')
    FileUtils.touch Rails.root.join('tmp/always_restart.txt')

    # DATABASE

    ## Postgres
    puts "\n** Configuring database.\n"
    puts "*** Configuring Postgres: your current UNIX username is being used for connection."

    FileUtils.cp Rails.root.join('config', 'database.yml.example'),
      Rails.root.join('config', 'database.yml')

    ## Setup
    puts "*** Setting up the database."

    pids = %w( db ).map do |process|
      Kernel.spawn("foreman start #{process}")
    end
    sleep 4

    Thread.new do
      begin
        Rake::Task['db:setup'].invoke
      rescue Exception =&gt; e
        puts "*** [ ERROR ] failed to load the database: #{e.message}"
      end
    end.join

    pids.each do |pid|
      Process.kill('SIGTERM', pid)
    end
  end
end
{{< / highlight >}}
