---
cover: /covers/effective-tdd-with-ruby-vim-setup.jpg
thumbnail: /thumbnails/effective-tdd-with-ruby-vim-setup.jpg
date: 2015-10-27
description: |
  Do you find TDD good in theory but hard to practice? Do you think it requires too much discipline and you don’t have time? You can improve a lot, by borrowing well tested tricks from me. They are simple, effective and easy to learn.
tags:
  - programming
title: 'Effective TDD With Ruby: Vim Setup'
categories:
  - featured
---

Do you find [Test Driven Development](https://en.wikipedia.org/wiki/Test-driven_development) (TDD) good in theory but hard to practice? Do you think it requires too much discipline and you don’t have time? Or, are you just struggling to get your workflow streamlined? Fighting to glue your tools together?

Well, you can improve a **lot**, by borrowing some tricks from me. I’ve practiced TDD with Ruby for many years now, and built an entire [web framework](http://lotusrb.org) only with these techniques.

They are simple, effective and easy to learn.

Last time we talked about [time management](/2015/10/20/effective-tdd-with-ruby-time-and-flow.html). Today we’ll focus on **Vim setup** and how this is important to follow the [_“not break the flow”_](/2015/10/20/effective-tdd-with-ruby-time-and-flow.html) rule.

## Env Vars

Use `export EDITOR=vim` in your shell startup file (e.g. `.zshrc`). This is a convention that’s followed by a lot of softwares like [Bundler](http://bundler.io).

## Vim vs MacVim

I prefer to use Vim over MacVim because the shell is always a `Ctrl+z` away from the editor.

That shortcut works on all the UNIX systems, it sends a [`SIGTSTP`](https://en.wikipedia.org/wiki/Job_control_(Unix)#Implementation) signal to the current process and puts it in background. You can resume it with `fg`.

![](/images/vim-ctrl-z-fg.gif)

I often use it for Git commands or to open another gem source code via `bundle open foo`. This will starts another Vim process in the same shell. To switch between all instances of the editor, you can use `Ctrl+z` to put the current on sleep and then `%1` or `%2` or `%3`, etc… That number corresponds to the opening order of your processes.

For instance, if you have started `vim .` first, that will be resumable with `%1`. Then you have opened `foo` gem, that will match to `%2`.

## Build Your Own Setup

Let’s admit it, vanilla Vim, isn’t that useful. When I re-learned it years ago, I decided to use [Janus](https://github.com/carlhuda/janus) as a standard setup. It’s a good starting point, but then you realise that you just use 20%/30% of what’s provided there.

My suggestion is to start from scratch and **build your own setup**. Then slowly add plugins when you need a feature in your day by day development.

It’s **funny** and you’ll learn a lot about Vim.

For inspiration, have a look at [Tim Pope](https://github.com/tpope/tpope/blob/master/.vimrc), [Mislav Marohnić](https://github.com/mislav/vimfiles/blob/master/vimrc), [Gary Bernhardt](https://github.com/garybernhardt/dotfiles/blob/master/.vimrc), [Paul Irish](https://github.com/paulirish/dotfiles/blob/master/.vimrc), [Drew Neil](https://github.com/nelstrom/dotfiles/blob/master/vimrc), [Thoughtbot](https://github.com/thoughtbot/dotfiles/blob/master/vimrc), [Steve Losh](https://bitbucket.org/sjl/dotfiles/src/1da770d23a2168f0e0c2e50d0d3e84e5c6d38d27/vim/vimrc?at=default&fileviewer=file-view-default) and [my](https://github.com/jodosha/dotfiles/blob/master/.vimrc) `.vimrc` configuration. As future reference, remember to document each setting. By reading the examples above, if you run into something unknown like `expandtab`, just use Vim `:help expandtab` and you’ll get a detailed explanation.

## Plugins

With the minimalist approach described above, start to add only the plugins that you need. I strongly suggest to use a plugin manager such as [Pathogen](https://github.com/tpope/vim-pathogen) or [Vundle](https://github.com/VundleVim/Vundle.vim). As of today, plugin authors assume that one of these two systems are present in your Vim setup.

Let’s examine some useful stuff to enhance your Vim experience.

### Theme

The visual aspect of our beloved editor is important to prevent [eye strain](http://www.allaboutvision.com/cvs/irritated.htm). The rule is to set the background color to match the luminosity of the room. In general, a dark theme makes screen easier to look at for long period of times. Consider big and bold fonts, high contrast. If your eyes are irritated, don’t hesitate to see your doctor.

There are several themes for Vim. If you don’t know which one to choose, here’s what to do:

  1. Install [vim-colorschemes](https://github.com/flazz/vim-colorschemes).
  2. Borrow [this function](https://github.com/jodosha/dotfiles/blob/master/.vimrc#L143-L157) from my `.vimrc`
  3. Type `<leader>tc` and watch your Vim to change theme each four seconds. Once you’ll see the one that you like, type `Ctrl+c`.

![](/images/vim-carousel.gif)

### Vim-Ruby

This [plugin](https://github.com/vim-ruby/vim-ruby) offers everything you are looking for Ruby dev with Vim. It supports syntax highlighting, syntax errors, unused variables, auto-closing `do/end`, code auto-indentation, auto-complete facilities, etc…

### Find In Project

One can easily get lost with large codebases. A fast and reliable search tool is crucial to stay focused. I use [The Silver Searcher](https://github.com/ggreer/the_silver_searcher) as Vim backend.

I mapped `<leader>,` to search in project or `shift+k` to find the word under the cursor. Both open a “Quickfix List” pane with a set of results, each of them can take you to the correspoding file, by hitting `enter` on the line. Here’s the relevant `.vimrc` [configuration](https://github.com/jodosha/dotfiles/blob/master/.vimrc#L165-L182).

### Quick File Open

The Silver Searcher can be used as a backend for [ctrlp](https://github.com/kien/ctrlp.vim), a plugin that let’s you to quickly open a file by name. For instance `Ctrl+p` and start to type. It filters instantly the results. Use arrows to navigate results and `enter` to open the file or `Ctrl+v` for a vertical split pane.

### Code Navigation

Unfortunately these two techniques return results only from your application codebase. Sometimes it’s useful to have a quick look at the source code of a dependency.

For instance, your cursor is on `Foo` constant and you want open the corresponding gem to place a debugger. 

For this purpose install [Exuberant Ctags](http://ctags.sourceforge.net/) and run [this script](https://github.com/jodosha/dotfiles/blob/master/bin/retag). The output is a file named `tags` which contains the class/module/methods references for Ruby core, standard library, your application and for **all the gems that you use**. Don’t forget to add it to `.gitignore`. I [mapped](https://github.com/jodosha/dotfiles/blob/master/.vimrc#L75) it to `<leader>rt`.

Once done, when the cursor is on `Foo`, just use `Ctrl+]` and Vim will open the file where `Foo` is defined. Then use `Ctrl+[` to get back.

If `Foo` isn’t under your cursor, use `:tag Foo`. If the result isn’t what you expected (try with `String`;), use `:ts Foo` for a list of all the matches.

### Autocomplete

There are a couple of options for code autocomplete. The first is [“Any word completion”](http://vim.wikia.com/wiki/Any_word_completion). It suggests all the words found in the project. It’s activated via `Ctrl+n` and it’s useful for recurring tokens.

If you want to leverage the tags that we’ve just created, install [Supertab](https://github.com/ervandew/supertab). When in insert mode, you can type `Str` and hit `tab`, and a list with all the possible tokens will appear in the contextual window.

### auto_mkdir

Let’s say you’re writing a test for a non-existing class: `test/foo/bar/baz_test.rb`. The test is _”red”_ and you want to define that class. Instead of return to the shell (`Ctrl+z`), create the directories (`mkdir -p lib/foo/bar`), then get back to Vim (`fg`) and create the file (`:e lib/foo/bar/baz.rb`). This is just annoying.

If you use [auto_mkdir](https://github.com/DataWraith/auto_mkdir) and just edit the file (`:e lib/foo/bar/baz.rb`), it will auto-create all the intermediate missing directory. This is a huge time saving.
