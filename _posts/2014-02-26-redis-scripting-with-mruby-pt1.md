---
layout: post

title: "Redis Scripting with MRuby"
cover_image: redis-scripting-with-mruby-pt1.jpg
tags: programming

excerpt: >
  MRuby is a lightweight Ruby.
  It was created by Matz with the purpose of having an embeddable version of the language.
  This article covers how to enable Redis scripting with Ruby.

author:
  name: Luca Guidi
  twitter: jodosha
  bio: Developer, music connisseur and avid tea lover.
  image: lg.png
---

[MRuby](http://www.mruby.org) is a lightweight Ruby.
It was created by Matz with the purpose of having an embeddable version of the language.
Even if it just reached the version 1.0, the hype around MRuby wasn't high.
However, there are already projects that are targeting [Nginx](https://github.com/matsumoto-r/ngx_mruby), [Go](https://github.com/mattn/go-mruby), [iOS](http://mobiruby.org), [V8](https://github.com/mattn/mruby-v8), and even [Arduino](https://github.com/kyab/mruby-arduino).

The direct competitor in this huge market is [Lua](http://www.lua.org): a lightweight scripting language.
Since the version 2.6.0 Redis introduced [scripting](http://redis.io/commands#scripting) capabilities with Lua.

{% highlight bash %}
# redis-cli
> eval "return 5" 0
(integer) 5
{% endhighlight %}

**Today is the 5th Redis birthday**, and I'd like celebrate this event by embedding my favorite language.

## Hello, MRuby

MRuby is shipped with an interpreter (`mruby`) to execute the code via a VM.
This usage is equivalent to the well known Ruby interpreter `ruby`.
MRuby can also generate a bytecode from a script, via the `mrbc` bin.

What's important for our purpose are the C bindings. Let's write an *Hello World* program.

We need a \*NIX OS, gcc and bison.
I've extracted the MRuby code into `~/Code/mruby` and built it with `make`.

{% highlight c %}
#include <mruby.h>
#include <mruby/compile.h>

int main(void) {
  mrb_state *mrb = mrb_open();
  char code[] = "p 'hello world!'";

  mrb_load_string(mrb, code);
  return 0;
}
{% endhighlight %}

The compiler needs to know where are the headers and the libs:

{% highlight bash %}
gcc -I/Users/luca/Code/mruby/include hello_world.c \
  /Users/luca/Code/mruby/build/host/lib/libmruby.a \
  -lm -o hello_world
{% endhighlight %}

This is a really basic example, we don't have any control on the context where this code is executed.
We can parse it and wrap into a [Proc](http://www.ruby-doc.org/core-2.1.1/Proc.html).

{% highlight c %}
#include <mruby.h>
#include <mruby/proc.h>

int main(int argc, const char * argv[]) {
  mrb_state *mrb = mrb_open();
  mrbc_context *cxt;
  mrb_value val;
  struct mrb_parser_state *ps;
  struct RProc *proc;

  char code[] = "1 + 1";

  cxt = mrbc_context_new(mrb);
  ps = mrb_parse_string(mrb, code, cxt);
  proc = mrb_generate_code(mrb, ps);
  mrb_pool_close(ps->pool);

  val = mrb_run(mrb, proc, mrb_top_self(mrb));
  mrb_p(mrb, val);

  mrbc_context_free(mrb, cxt);
  return 0;
}
{% endhighlight %}

## Hello, Redis

As first thing we need to make Redis dependend on MRuby libraries.
We extract the language source code under `deps/mruby` and then we hook inside the `deps/Makefile` mechanisms:

{% highlight bash %}
mruby: .make-prerequisites
       @printf '%b %b\n' $(MAKECOLOR)MAKE$(ENDCOLOR) $(BINCOLOR)$@$(ENDCOLOR)
       cd mruby && $(MAKE)
{% endhighlight %}

<p class="muted code-caption">see the <a href="https://github.com/jodosha/redis/commit/c94263ee9bf129c3fce5d753554e170a94e0e7c0">commit</a></p>

During the startup, Redis initializes its features.
We add our own `mrScriptingInit()`, where we initialize the interpreter and assign to `server.mrb`.

{% highlight c %}
# src/mruby-scripting.c
void mrScriptingInit(void) {
  mrb_state *mrb = mrb_open();
  server.mrb = mrb;
}
{% endhighlight %}

<p class="muted code-caption">see the <a href="https://github.com/jodosha/redis/commit/61a8f4472e16edbfc0d53999e3ee3193a569d51c">commit</a></p>

Then we can add another command `REVAL` with the same syntax of `EVAL`, but in our case MRuby will be in charge of execute it.

{% highlight c %}
# src/redis.c
{"reval",mrEvalCommand,-3,"s",0,zunionInterGetKeys,0,0,0,0,0},
{% endhighlight %}

That `mrEvalCommand` function will be responsible to handle that command.
It's similar to the *Hello World* above, the only difference is that the code is passed as argument to the redis client (`c->argv[1]->ptr`).

{% highlight c %}
# src/mruby-scripting.c
void mrEvalCommand(redisClient *c) {
  mrb_state *mrb = server.mrb;

  struct mrb_parser_state *ps;
  struct RProc *proc;
  mrbc_context *cxt;
  mrb_value val;

  cxt = mrbc_context_new(mrb);
  ps = mrb_parse_string(mrb, c->argv[1]->ptr, cxt);
  proc = mrb_generate_code(mrb, ps);
  mrb_pool_close(ps->pool);

  val = mrb_run(mrb, proc, mrb_top_self(mrb));
  mrAddReply(c, mrb, val);

  mrbc_context_free(mrb, cxt);
}
{% endhighlight %}

<p class="muted code-caption">see the <a href="https://github.com/jodosha/redis/commit/82d67f1d83b42f3b276ebe17443a82496df05803">commit</a></p>

Now we can compile the server and start it.

{% highlight bash %}
make && src/redis-server
{% endhighlight %}

From another shell, start the CLI.
{% highlight bash %}
src/redis-cli
> reval "2 + 3" 0
"5"
{% endhighlight %}

This was the first part of this implementation.
In a future article, I'll cover how to access Redis data within the MRuby context.

For the time being, feel free to play with my [fork](https://github.com/jodosha/redis/tree/mruby-scripting).
