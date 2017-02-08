---
cover: /covers/the-penguin-that-cannot-fly.jpg
thumbnail: /thumbnails/the-penguin-that-cannot-fly.jpg
date: 2016-06-07
description: |
  A short story about OOP, interfaces and soft typing.
tags:
  - programming
  - design patterns
  - ruby
title: The Penguin That Can't Fly
---

#### A short story about OOP, interfaces and _soft typing_

---

Today is the day at the headquarters of Spectacular Foo Ltd. The rising firm of the indie gaming scene is going to release its next blockbuster title: _Banal Birds_.

The year is 2019, Ruby 3 is three times faster and has _soft typing_, what a crazy coincidence that solves everything! It was a nostalgic decision but, you, as the lead developer decided to use Ruby for this project.

You ask your supervisor Jane for a final code review.

{{< highlight ruby >}}
class Game
  def initialize(bird: Bird)
    @bird = bird
  end

  def play
    @bird.fly
  end
end
{{< / highlight >}}

The idea is simple, but revolutionary: a player can choose **any** bird and then watch it fly. This is gonna be kickass!

You reused a popular Ruby gem `acts_as_a_bird`, which has the perfect implementation of `Bird`:

{{< highlight ruby >}}
class Bird
end
{{< / highlight >}}

Among others, we can have owls and hummingbirds:

{{< highlight ruby >}}
class Owl < Bird
  def fly
    puts "I'm a flying owl"
  end
end

class Hummingbird < Bird
  def fly
    puts "I'm a flying hummingbird"
  end
end
{{< / highlight >}}

Isn’t this a marvelous piece of software engineering? Well, despite the huge investment in this game there is a problem: “What about penguins?” asks Jane. Oh right, penguins are birds but they can’t fly…

{{< highlight ruby >}}
class Penguin < Bird
  # LOL I'm a penguin
end
{{< / highlight >}}

Today is the launch day and you can’t afford to fix this bug. The show must go on, so you have to release the game and hope the players won’t choose a penguin.

You feel bad, and start questioning your choices: why did you use Ruby? Why _soft typing_?

“What you really wanted to use are interfaces, not types” says Jane. Your first reaction is “OMG, Java!”, but she takes the time to explain that the idea is borrowed from [Go](http://golangtutorials.blogspot.it/2011/06/interfaces-in-go.html).

“In a dynamically typed language like Ruby, what you really care about is _behavior_. You want to be able to _send messages_ to objects, which is the essence of OOP.”

She goes on: “Using types, you’re accepting objects that potentially do too much for what you need and this is a violation of the [Interface Segregation Principle](https://en.wikipedia.org/wiki/Interface_segregation_principle).”

“The difference is subtle: **you’re speculating that `Bird` responds to `#fly`**, but that isn’t always true. Instead, the language should provide a tool to check if a given object implements a method (or a set of methods)”.

At this point you’re shocked. You really wished that Ruby had introduced interfaces as special modules to define a set of behaviors.

{{< highlight ruby >}}
interface Flying
  def fly
    puts "I'm a flying #{ name }"
  end

  def name
    "bird"
  end
end

class Falcon
  include Flying

  def name
    "falcon"
  end
end

class Game
  def initialize(bird: Flying)
    @bird = bird
  end

  def play
    @bird.fly
  end
end
{{< / highlight >}}

You also wished that the VM would have stopped you from embarrassing errors like the penguin that can’t fly.

<hr>

Thanks to [@\_solnic\_](https://twitter.com/_solnic_) and [@timriley](https://twitter.com/timriley) for their feedback.
