---
cover: /covers/effective-tdd-with-ruby-time-and-flow.jpg
thumbnail: /thumbnails/effective-tdd-with-ruby-time-and-flow.jpg
date: 2015-10-20
description: |
  Do you find TDD good in theory but hard to practice? Do you think it requires too much discipline and you don’t have time? You can improve a lot, by borrowing well tested tricks from me. They are simple, effective and easy to learn.
tags:
  - programming
title: 'Effective TDD With Ruby: Time & Flow'
---

Do you find [Test Driven Development](https://en.wikipedia.org/wiki/Test-driven_development) (TDD) good in theory but hard to practice? Do you think it requires too much discipline and you don’t have time? Or, are you just struggling to get your workflow streamlined? Fighting to glue your tools together?

Well, you can improve a **lot**, by borrowing some tricks from me. I’ve practiced TDD with Ruby for many years now, and built an entire [web framework](http://lotusrb.org) only with these techniques.

They are simple, effective and easy to learn.

This is a **series of a few articles** about TDD, Ruby and Vim. Today we'll focus on time management and flow.

## Time

Programming is a time consuming activity. While working, it’s easy to follow the rabbit down to the hole and focusing on the small details. To don’t to loose the big picture, it’s really important be in control of time and priorities.

There is an article of mine, about time management, healthy habits, and Pomodoro Technique that I truly recommend to [read](/2015/10/13/effective-remote-working.html).
It will help you to prioritize tasks, have a consistent routine and ship code as soon is _“good enough”™_.

## Commit Often

Always use Git, even for code spikes. It’s free and you don’t need to necessary use GitHub, just consider it as a local _”time machine”_ for your code.

Let’s say you’re working for 20 minutes and did a lot of changes. Then you take a path that breaks everything. At this point it’s hard to revert the mistake by hand without to compromise the good job that you did until now.

As rule of thumb: commit once you do some progress. That puts code in a safe place. I have a couple of ZSH aliases to the rescue. For the first commit: `gaa && gc -m “WIP”`, and then `gaa && gca`.

They are:

{{< highlight bash >}}
➜ which gaa
gaa: aliased to git add --all
➜ which gc
gc: aliased to git commit
➜ which gca
gca: aliased to git commit --amend --date="$(date)"
{{< / highlight >}}

To don’t break the flow, I don’t care about the commit message at the beginning, as I can always finalise it at the end of the feature.

## Fast Feedback Loop

TDD is a technique that guides you to do incremental changes both in testing and production code. Once a modification is in place, it’s really important to run tests as soon as possible.

To streamline the process, it’s really important to get the result of your tests in a matter of a few seconds. Ideally, in less than a second. Now, this is hard to achieve if you run the entire test suite of an application. You can narrow the scope to the current Vim buffer instead.

If you use Minitest:

{{< highlight bash >}}
:map <leader>r :!greenbar bundle exec ruby<cr>
:map <leader>re :!greenbar bundle exec ruby -Itest %<cr>
{{< / highlight >}}

Or if you use RSpec:

{{< highlight bash >}}
:map <leader>r :!greenbar bundle exec ruby<cr>
:map <leader>re :!greenbar bundle exec rspec %<cr>
{{< / highlight >}}

Use `<leader>r` for the suite and `<leader>re` for the current test file.

## Visual Feedback

Another TDD hallmark is the [_“red-green-refactor”_ cycle](http://blog.cleancoder.com/uncle-bob/2014/12/17/TheCyclesOfTDD.html). Start with a failing test (_”red”_ state), write the simplest production code to make it pass (_”green”_), and then refactor.

A corollary of this principle is that we are never allowed to refactor when the status is _”red”_.

I’ve created Vim plugin, that colors the status bar with the current state in the cycle: [vim-greenbar](https://github.com/jodosha/vim-greenbar).

![](https://raw.githubusercontent.com/jodosha/vim-greenbar/master/vim-greenbar.gif)

## Don’t Break The Flow

True focus is really hard to achieve, there isn’t anything else that makes us so productive. You should do everything to keep that state. Sometimes an idea for a refactoring suddenly sparks, or your mind is carrying on a lot of informations about the things to fix and make better.

Sure, `TODO` and `FIXME` convention in code it’s really useful, but it’s bound to the module/class/method that needs to be improved. We need to open it, locate the right line, write.. while you’re struggling to not break the flow.

What if taking notes is just a couple of keystrokes away?

Here’s another small tool to the rescue: [vim-devnotes](https://github.com/jodosha/vim-devnotes). It opens a split window where you can quickly write a note. When closed, it reports in the status bar, the number of remaining issues to address.

I have a keyboard mapping for this: `<leader>dn`.

![](https://raw.githubusercontent.com/jodosha/vim-devnotes/master/screenshot.png)

## Leave The Field With A Red Test

When you are going to wrap your work in the evening, make sure you have committed and pushed all the changes. Then write the next test, but leave it _”red”_. You don’t have to commit, it’s just a hint to start tomorrow.

<hr>

If you don't want to miss the next post about **[Vim setup](/2015/10/27/effective-tdd-with-ruby-vim-setup.html)**, please consider to subscribe to my mailing list.
