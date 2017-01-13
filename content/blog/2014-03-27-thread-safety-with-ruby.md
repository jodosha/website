---
cover: /covers/thread-safety-with-ruby.jpg
thumbnail: /thumbnails/thread-safety-with-ruby.jpg
date: 2014-03-27
description: |
  Moore's law is over. Modern computation is exploited by running processes on multiple cores. Ruby has always ignored this trend, and the community didn't put enough attention on this topic.
  The VM allocates a memory heap, which is shared and writable by threads. If incorrectly coordinated, those threads can lead to unexpected behaviors.
tags: software
title: Thread Safety With Ruby
categories:
  - featured
aliases:
  - /2014/03/27/thread-safety-with-ruby/
  - /2014/03/27/thread-safety-with-ruby.html
---

**Moore's law is over**.
Modern computation is exploited by running processes on multiple cores.
Ruby has always ignored this trend, and the community didn't put enough attention on this topic.

Ruby's model for concurrency is based on threads.
It was typical approach for object oriented languages, designed in the 90s.
A thread is sequence of instructions that can be scheduled and executed in the context of a process.
Several threads can be running at the same time.

Ruby's VM process allocates a memory heap, which is shared and writable by threads.
If incorrectly coordinated, those threads can lead to unexpected behaviors.

## Thread Safety

We define as _thread safe_ a code that behaves correctly when accessed by many threads at the time.
Most of the time, the correctness of execution is determined by **the state of the memory that is visible by a routine in a given moment**.
For instance, a variable appears with a certain value, but in the meantime another thread may have changed it.

{{< highlight ruby >}}
x = 0

10.times.map do |i|
  Thread.new do
    puts "before (#{ i }): #{ x }"
    x += 1
    puts "after (#{ i }): #{ x }"
  end
end.each(&:join)

puts "\ntotal: #{ x }"
{{< / highlight >}}

What happens here? When the threads are starting they see the initial value of `x`.
But when each of them, try to add `+1`, the value became different as result of the parallel computation.
Without a proper synchronization, the partial state of `x` is unpredictable.

{{< highlight bash >}}
% ruby count.rb
before (2): 0
before (0): 0
before (1): 0
after (1): 3
before (5): 1
before (7): 1
after (2): 1
after (0): 2
before (4): 1
after (5): 4
after (7): 5
before (9): 1before (3): 1
before (8): 1
before (6): 1
after (4): 6

after (9): 10after (3): 7
after (6): 9

after (8): 8

total: 10
{{< / highlight >}}

When the thread `(3)` started, `x` was equal to `1`, but after adding `+1` its value was `7`.

## Visibility

We met an important issue here: **visibility**.
If the changes caused by a thread are observable by other threads, they can read the correct value, and then partial state is consistent.

Until now, we omitted an important aspect: which kind of variables are we referring to?
We are talking about of all that represent a **state of the system** in a given moment.
Global, class and instance variables require attention, when used in a concurrent context.

Local variables are exempt from these problems, because they don't hold a state.

From this picture, we can infer that **stateless programs are always thread safe**.

## Atomicity

Yet, stateful systems can be thread-safe.
What's important isn't only **what** changes (_visibility_) but **how** it changes (_atomicity_).
If we design write operations in a way that while they're running, other threads can't read nor alter the state we're modifying, that change is thread safe.

We call these operations _atomic_, because their execution appear as indivisible to the rest of the system.

{{< highlight ruby >}}
x, mutex = 0, Mutex.new

10.times.map do |i|
  Thread.new do
    mutex.synchronize do
      puts "before (#{ i }): #{ x }"
      x += 1
      puts "after (#{ i }): #{ x }"
    end
  end
end.each(&:join)

puts "\ntotal: #{ x }"
{{< / highlight >}}

{{< highlight bash >}}
% ruby count.rb
before (2): 0
after (2): 1
before (1): 1
after (1): 2
before (0): 2
after (0): 3
before (5): 3
after (5): 4
before (6): 4
after (6): 5
before (8): 5
after (8): 6
before (9): 6
after (9): 7
before (3): 7
after (3): 8
before (4): 8
after (4): 9
before (7): 9
after (7): 10

total: 10
{{< / highlight >}}

By using [Mutex](http://www.ruby-doc.org/core-2.1.1/Mutex.html), we ensure the atomicity of the _add_ operation.

The following example shows **the weakness of a common pattern** in Ruby applications: lazy loading via `||=`.

{{< highlight ruby >}}
##
# Counter is thread safe, we use a Mutex to guarantee the atomicity of #increment!
#
class Counter
  attr_reader :total

  def initialize
    puts 'initialized'
    @total = 0
    @mutex = Mutex.new
  end

  def increment!
    @mutex.synchronize { @total += 1 }
  end
end

##
# Application isn't thread safe, because the initialization of Counter
# happens with a non-atomic operation (`||=`).
#
class Application
  def increment!
    counter.increment!
  end

  def counter
    @counter ||= Counter.new
  end

  def total
    counter.total
  end
end

app = Application.new

10.times.map do |i|
  Thread.new do
    app.increment!
  end
end.each(&:join)

puts app.total
{{< / highlight >}}

{{< highlight bash >}}
% ruby application.rb
initialized
initialized
1 # wrong
{{< / highlight >}}

**Please note that `Counter` is thread safe, but the final application isn't**.
We have used `||=`, which isn't atomic. This caused a [_race condition_](http://en.wikipedia.org/wiki/Race_condition): two threads have seen `@counter` as `nil`, and then they have initialized a new instance of it.
**The result of the computation is wrong**.

The right way to write that class is:

{{< highlight ruby >}}
class Application
  attr_reader :counter

  def initialize
    @counter = Counter.new
  end

  def increment!
    counter.increment!
  end

  def total
    counter.total
  end
end
{{< / highlight >}}

As rule of thumb, **avoid mutations after an object is being initialized**.

## Conclusion

**In a nutshell, the limitations of Ruby concurrency model are: data mutability and difficult synchronization.** 

In an upcoming article, I'll cover how [Lotus](http://lotusrb.org) achieves thread safety.
