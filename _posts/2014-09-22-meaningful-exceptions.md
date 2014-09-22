---
layout: post

title: "Meaningful Exceptions"
cover_image: meaningful-exceptions.jpg
cover_copyright: 'Photo Credit: <a href="https://www.flickr.com/photos/16377475@N00/42391997/">simpologist</a> via <a href="http://compfight.com">Compfight</a> <a href="https://creativecommons.org/licenses/by-nc/2.0/">cc</a>'
tags: software

excerpt: >
  Writing detailed documentation helps to improve software design.

  Explaining the intent mitigates inconsistencies and helps other people to understand our initial idea.

  We'll discover why the semantic of the raised exceptions is important to write solid API interfaces.

author:
  name: Luca Guidi
  twitter: jodosha
  bio: Developer, music connisseur and avid tea lover.
  image: lg.png
---

Writing detailed API documentation helps to improve software design.

We already know that explaining a concept to someone leads us to a better grasp. **This is true for our code too.**
This _translation_ process to a natural language forces us to think about a method from the outside perspective.
We describe the intent, the input, the output and how it reacts under unexpected conditions.
Put it in black and white and you will find something to refine.

It happened to me recently.

I was reviewing some changes in [lotus-utils](http://rubygems.org/gems/lotus-utils), while I asked myself: _"What if we accidentally pass `nil` as argument here"?_
The answer was easy: `NoMethodError`, because `nil` doesn't respond to a specific method that the implementation invokes.

A minute later, there was already an unit test to cover that case and a new documentation detail to explain it. Solved.

Well, not really. Let's take a step back before.

## First solution

**When we design public API, we are deciding the way that client code should use our method** and what to expect from it.
Client code doesn't know nothing about our implementation, and it shouldn't be affected if we change it.

The technical reason why the code raises that exception  is:

{% highlight ruby %}
arg * 2

'/' * 2 # => "//"
nil * 2 # => NoMethodError
{% endhighlight %}

The first solution was to catch that error and to re-raise `ArgumentError`.

## Improved solution

During the process of writing this article, I've recognized two problems with this proposal.

The first issue is about the implementation.
What if we refactor the code in a way that `NoMethodError` is no longer raised?

{% highlight ruby %}
2.times.map { arg }.join

2.times.map { '/' }.join # => "//"
2.times.map { nil }.join # => ""
{% endhighlight %}

Our new implementation has changed the behavior visible from the outside world.
**We have broken the software contract between our library and the client code.**

It expected `ArgumentError` in case of `nil`, but after that modification, this isn't true anymore.

The other concern is about the semantic of the exception.
According to [RubyDoc](http://www.ruby-doc.org/core/ArgumentError.html):

_"ArgumentError: Raised when the arguments are wrong and there isn't a more specific Exception class."_

We have a more specific situation here, we expect a string, but we've got `nil`.
Probably, `TypeError` fits better our case.

### Conclusion

Our test suite can be useful to check the correctness of a procedure under a deterministic scenario, but sometimes we write assertions under a narrowed point of view.

Explaining the intent with API docs mitigates this problem and helps other people to understand our initial idea.

Check if the semantic of the raised exceptions is coherent with that conceptualization.

{% include _lotusml.html %}
