---
title: "Ruby Method Overloading"
image: /covers/ruby-method-overloading.jpg
thumbnail: /thumbnails/ruby-method-overloading.jpg
date: 2020-07-22
description: |
  A Ruby hack to implement method overloading
tags:
  - ruby
---

[Method Overloading](https://en.wikipedia.org/wiki/Function_overloading) is a programming language feature that allows you to define multiple signatures (and implementations) of the same method.

Ruby doesn't have such a feature. It was a shocking discovery when I switched from Java.. a very long time ago.

We can somehow trick the language using optional and keyword arguments.

But how can we have real isolated implementations of the same method? I wrote a hack to make this possible based on method arity.

```ruby
class Foo
  include MethodOverloading

  def call
    puts "foo"
  end

  def call(number)
    puts "foo #{number}"
  end
end

foo = Foo.new
foo.call # => "foo"
foo.call(23) # => "foo 23"
```

Before I forget, **don't try this in a real-world project**. 😉

## Method Definition in Ruby

When Ruby VM evaluates the body of a class, for each method definition, it invokes a special hook that allows you to interact with that method.

```ruby
class Foo
  def self.method_added(method_name)
    super
    puts method_name
  end

  def call
  end
end

# => :call
```

Within that hook, you can have the full reference of the method starting from its name:

```ruby
class Foo
  def self.method_added(method_name)
    super
    m = instance_method(method_name)
    puts m.arity
  end

  def call(number)
  end
end

# => 1
```

Method Registry

With the combination of method name and arity, you can build a registry of method definitions. These two pieces of information will act as a key, whereas the method itself will be the value.

```ruby
class Foo
  @__method_overloading = {}

  def self.method_added(method_name)
    super
    m = instance_method(method_name)
    method_id = [method_name, m.arity]
    
    @__method_overloading[method_id] = m
  end

  def foo
  end

  def foo(number)
  end
end
```

## Method undef

If you define multiple methods with the same name, Ruby will emit multiple warnings, and it will pick the last method definition.

You can take control of the method dispatching if you undefine the method in the `method_added` hook. By doing so, the class won't reference the method anymore:

```ruby
class Foo
  def self.method_added(method_name)
     super
     # store in the registry
     undef_method method_mame
  end

  def call
  end
end

Foo.new.call
# => NoMethodError
```

## Method dispatching

You can use the almighty `method_missing` to check the method is in the registry, and execute it:

```ruby
class Foo
  def self.respond_to_matching?(method_name, *args)
    @__method_overloading.key?([method_name, args.count])
  end

  def method_missing(method_name, *args, &blk)
    super unless self.class.respond_to_matching?(method_name, *args, &blk)

    self.class.matched_call(self, method_name, *args, &blk)
  end

  def respond_to_missing?(method_name, *)
    self.class.respond_to_method?(method_name)
  end
end
```

## Unbound methods

There is one important detail to know: when a method is undefined, it will become an instance of `UnboundMethod`. That means it doesn't have a context of execution anymore, because it has been removed from the class.

Using `#bind_call` and passing the context of execution (the instance of `Foo`), Ruby VM will be able to "rebound" the context and correctly execute the method.

```ruby
class Foo
  def self.matched_call(instance, method_name, *args, &blk)
    m = @__method_overloading.fetch([method_name, args.count]) { raise NoMethodError }
    m.bind_call(instance, *args)
  end
end
```

## Performance

Because of the meta-programming and hand-crafted method dispatching, the code is **~14x slower** than regular Ruby code. 🤷‍♂️

```
Warming up --------------------------------------
  method overloading    24.146k i/100ms
              method   305.480k i/100ms
Calculating -------------------------------------
  method overloading    225.254k (±13.5%) i/s -      1.111M in   5.053180s
              method      3.274M (± 3.5%) i/s -     16.496M in   5.045562s

Comparison:
              method:  3273590.9 i/s
  method overloading:   225253.9 i/s - 14.53x  (± 0.00) slower
```

## Conclusion

Ruby is such a fascinating and flexible language: **if you can dream it, you can code it**.

[[Complete implementation](https://gist.github.com/jodosha/e3097ed693e9b7c255b658ac39c2e403)]
