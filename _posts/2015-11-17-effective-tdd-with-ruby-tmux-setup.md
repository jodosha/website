---
layout: post

title: "Effective TDD With Ruby: Tmux Setup"
cover_image: effective-tdd-with-ruby-tmux-setup.jpg
tags: programming

excerpt: >
  Do you find TDD good in theory but hard to practice? Do you think it requires too much discipline and you don’t have time?
  You can improve a lot, by borrowing well tested tricks from me.
  They are simple, effective and easy to learn.

author:
  name: Luca Guidi
  twitter: jodosha
  bio: Developer, music connisseur and avid tea lover.
  image: lg.png
---

Do you find [Test Driven Development](https://en.wikipedia.org/wiki/Test-driven_development) (TDD) good in theory but hard to practice? Do you think it requires too much discipline and you don’t have time? Or, are you just struggling to get your workflow streamlined? Fighting to glue your tools together?

Well, you can improve a **lot**, by borrowing some tricks from me. I’ve practiced TDD with Ruby for many years now, and built an entire [web framework](http://lotusrb.org) only with these techniques.

They are simple, effective and easy to learn.

In the past, we talked about [time management](/2015/10/20/effective-tdd-with-ruby-time-and-flow.html) and [Vim setup](/2015/10/27/effective-tdd-with-ruby-vim-setup.html) Today we’ll focus on **Tmux setup** to easily switch between projects.

## What is Tmux for?

[Tmux](https://tmux.github.io) is a terminal multiplexer. With a single session you can attach and detach several background processes.

While I use just Vim for projects that don’t need any specific setup. For instance, most of the [Lotus](http://lotusrb.org) gems are just Ruby and don’t need running services to work on them.

A different case are freelancing projects (usually web apps), that need one or more datastore (Postgres + Redis), a running server, console, logs, etc.. In this case I use Tmux to simulate an UNIX based [IDE](https://en.wikipedia.org/wiki/Integrated_development_environment). With just **one command** I can start to work on a project.

## One Command To Rule Them All

Tmux is scriptable, so we can configure the instructions that it has to follow at the startup. I [crafted](https://github.com/jodosha/dotfiles/blob/master/bin/code) a BASH script named `code` for that.

That finds the project directory, starts a Tmux session, by loading **general configuration** and **project specific settings**.

{% highlight bash %}
#!/bin/bash

name=$1
dir="$HOME/Code/$name"
cd $dir

if !(tmux has-session -t "$name" 2> /dev/null); then
  tmux start                     \;\
    set -g set-remain-on-exit on \;\
    new-session -d -s $name
fi

tmux source-file "$HOME/.tmux.conf"
tmux source-file "$HOME/.tmux/profiles/$name.tmuxrc"
tmux attach -t $name
{% endhighlight %}

In the morning, if I have to work on a project named `bookshelf`, with just `code bookshelf`, I have my development environment up and running in a second.

![](/images/tmux-start.png)

At the bottom of the screen, there are numbered windows. For each window you can have one or more split screens (panes). Usually, Vim is at `1` and Lotus server and console are at `2`. If I have to edit, I can switch to the first window with `Ctrl+f 1` or jump to the console with `Ctrl+f 2`.

This helps to quickly move back and forth between several tools that I need.

## General Configuration

I borrowed my [general configuration](https://github.com/jodosha/dotfiles/blob/master/.tmux.conf) from [@vjt](https://twitter.com/vjt) a few years ago, and it still works like a charm.

There are a few amazing features in that script:

  * Get back to previous window and pane (`Ctrl+f f`)
  * Navigate between panes (`Ctrl+f up/down`)
  * Pane zoom in/out (`Ctrl+f z`)
  * Respawn dead pane for crashed processes (`Ctrl+f l`)
  * Kill current window (`Ctrl+f k`)
  * Kill Tmux session (`Ctrl+f \`)

You can add several customisations to that script, Tmux is really powerful!

## Project Specific Configuration

We can specify for each project, some specific layout for our windows.

{% highlight bash %}
# vim: syn=tmux

neww -n vim   'vim .'
neww -n shell 'exec $SHELL -l'

neww -n server  'bundle exec lotus server'
splitw -v -p 30 'bundle exec lotus console'
setw -t server monitor-activity off

neww -n db      'postgres -D /usr/local/var/postgres'
splitw -v -p 80 'redis-server'
setw -t db monitor-activity off

neww -n sql 'bundle exec lotus db console'

selectw -t vim
{% endhighlight %}

Let’s see what that means. I have the first two windows with full screen Vim and shell. The third one has a split between the server (70%) and the console (30%, see `-p 30` option). The remaining are for database shell, Postgres and Redis servers.

The last command tells Tmux to select the window named `vim` at the boot time. Please note that window names are arbitrary.

## Fast TDD Feedback

With a combination of two great Vim plugins by [Joshua Davey](https://github.com/jgdavey) ([slime.vim](https://github.com/jgdavey/tslime.vim) and [vim-turbux](https://github.com/jgdavey/vim-turbux)), we can send commands to a Tmux pane.

This technique is used to run RSpec examples, and let the pane to be invisible if specs are successful, and to remain open in the opposite case.

I use it, alongside with [vim-greenbar](https://github.com/jodosha/vim-greenbar), which is able to report the current TDD status (green/red) by colouring the Vim status bar.

![](/images/tmux-tdd.gif)

<hr>

{% include _mailinglist.html %}
