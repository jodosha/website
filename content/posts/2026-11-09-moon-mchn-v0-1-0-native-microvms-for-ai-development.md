---
title: "Moon MCHN v0.1.0: native microVMs for AI development"
date: 2026-11-09
description: |
  Moon MCHN runs AI agents and third-party code in native microVMs on macOS and Linux, with no Docker.
  Each machine has its own Linux kernel and pinned image, and can be rebuilt from scratch when things go wrong.
tags:
  - moonmchn
  - microvm
  - virtualization
  - security
  - ai
  - rust
  - nix
  - open source
keywords:
  - "Moon MCHN"
  - "MicroVM"
  - "Virtual Machine"
  - "AI Agents"
  - "AI Development"
  - "Sandbox"
  - "Developer Security"
  - "Supply Chain Attack"
  - "macOS"
  - "Linux"
  - "KVM"
  - "Rust"
  - "Nix"
  - "Open Source"
---

![Moon MCHN banner](/images/moonmchn-banner.png)

As developers, we are constantly looking for ways to keep our computers safe and clean. But our job requires us to experiment, install new things, and try them out. The downside can be a broken development environment, or worse, a compromised one.

Things got worse with LLMs. AI personal assistants can go rogue, and a never-before-seen wave of software vulnerabilities makes the news almost every week.

As I write this, we have just been through one of the biggest digital heists in history: in October 2026, attackers took about $6.3 billion from Binance. [By Binance's own account](https://www.bleepingcomputer.com/news/security/binance-says-fake-job-interview-led-to-63-billion-crypto-heist/), it began months earlier on engineers' laptops: a tampered Homebrew install, which an engineer found while searching for an AI coding tool, and a coding assignment from a fake job interview. That same month, [a release of LiteLLM](https://www.securityweek.com/litellm-compromised-in-fresh-supply-chain-attack/), a Python library for calling AI models, carried malware for under two hours and was downloaded an estimated 49,000 times. [Tampered versions of the Claude Code extension](https://www.securityweek.com/malicious-claude-code-extension-served-in-cursor-supply-chain-attack/) may have reached about 5,000 developer machines through Cursor's marketplace. I'm sure there will be something new this week.

Mitigations are necessary, but they add a lot of friction to day-to-day coding.

So I asked myself: instead of becoming paranoid, **what if we lower the stakes**? **What if malicious software or a rogue agent could destroy only an environment that can easily be rebuilt from scratch**?

I looked for somewhere else to run agents and third-party software, and nothing I tried fit:

- **Containers.** On my Mac, Docker keeps every container in one shared VM, and dev containers always felt overwhelming. Either way, the code runs in a container, which doesn't isolate it the way a VM does. Nor is there a machine per project that could grow into a development tool.
- **Desktop VM apps** are built around a desktop in a window. I need a machine one shell command away.
- **The agent's own sandbox.** I use it, but the agent is free to step around it, and it often does.
- **Process sandboxes** confine the agent on my own machine, with no VM to throw away and rebuild.
- **Nix environments on the host** broke on me from time to time, and they still run on my machine, as my user.

MicroVM tools came closest, but none of them confines the process that runs the VM with the host's own sandbox.

What I wanted was a safe space to experiment: a machine where an agent, a third-party tool or a half-finished project can do whatever it does. When it turns into a mess, I rebuild it and start over, and my computer stays out of it.

That's **Moon MCHN** (_pronounced "Moon Machine"_): native microVMs for development, on macOS and Linux, with no Docker in between. Today I'm releasing **v0.1.0**.

![Terminal demo of Moon MCHN: mchn setup, mchn start dev, mchn shell dev, mchn stop dev](/images/2026-11-09-moon-mchn-v0-1-0.gif)

## How I got here

In the last three years, I've been experimenting with Nix and containers. After many proofs of concept, I wrote a private CLI tool based on Go, Docker and Nix. It built images on the spot, so every start was slow, and its containers never isolated code the way a VM would. Moon MCHN boots prebuilt images in microVMs, and it's written in Rust, which is faster and better equipped for this kind of low-level work.

**I'm writing it by hand, with AI agents reviewing my code**. It's how I'm solidifying my Rust, and in a tool built to contain agents, **I want to reason about every line**.

## What v0.1.0 does

You need an Apple Silicon Mac, or Linux with KVM, and Rust 1.99 or later.

```sh
cargo install moonmchn-cli --locked
mchn setup          # once, sized to this machine
mchn daemon start
mchn start dev      # boots a machine named dev
mchn shell dev
mchn stop dev
```

Each machine comes with:

1. **Its own Linux kernel.** Code inside sees the machine, and your files stay out of its reach.
2. **Rules on the host.** Resources, mounts and network rules live in the configuration on your machine, where an agent inside can't switch them off.
3. **Pinned images.** The same spec boots the same image, every time.

## What it doesn't do yet

v0.1.0 is an early release, and I'd rather you know its **temporary limitations** before you trust it:

- **The machines are ephemeral.** `mchn stop` would delete the disk.
- **The network is open by default.** `setup` allows every host, for you to narrow, and DNS queries pass unchecked.
- **The VM process runs as you.** The process that runs the VM has your user's permissions, so code that escaped the VM would get them too.

[Known limitations](https://github.com/galaxyloop-labs/moonmchn/blob/main/docs/SPEC.md#known-limitations) in the spec lists every edge I know of.

## On the roadmap

The last of those edges is the one I care about most. The plan is for the host's own kernel to confine the process that runs each VM: Seatbelt on macOS, Landlock on Linux. Code that broke out of the VM would still be stuck inside the operating system's sandbox. Firecracker's jailer does something close to this for Linux servers. I want it on a laptop, and on a Mac.

The rest of the security work tightens what a machine can reach: an egress firewall that checks every connection and DNS query and denies by default, secrets kept out of the agent's reach, and permissions a machine asks for when it first needs something.

On the development side, machines would keep their disk by default, with `--ephemeral` for one-offs. **Packs** would bring prebuilt Nix packages and environment variables for the setups people reach for most, such as a programming language, an agent harness or ZeroClaw. `mchn start dev --packs=go,pi` would give you a machine with both, pinned in its spec, so the same spec rebuilds the same machine.

[ROADMAP.md](https://github.com/galaxyloop-labs/moonmchn/blob/main/docs/ROADMAP.md) on GitHub has the full list, in no particular order.

## Try it

The code is open source under the Apache 2.0 license, at [github.com/galaxyloop-labs/moonmchn](https://github.com/galaxyloop-labs/moonmchn). Try it on a side project, and open an issue when something breaks or feels wrong. Report security issues privately, as [SECURITY.md](https://github.com/galaxyloop-labs/moonmchn/blob/main/docs/SECURITY.md) explains. To hear what ships, watch the repository's releases.
