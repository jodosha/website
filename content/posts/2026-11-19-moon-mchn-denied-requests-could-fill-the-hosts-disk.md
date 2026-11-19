---
title: "Moon MCHN: denied requests could fill the host's disk"
date: 2026-11-19
description: |
  Moon MCHN logged every connection it denied a machine, with no limit. A guest that kept retrying could grow the log until the host ran out of disk.
  v0.2.1 caps each machine at 60 log lines a minute and rotates the log at 8 MiB, keeping 16 files.
tags:
  - moonmchn
  - microvm
  - security
  - ai
  - rust
  - open source
keywords:
  - "Moon MCHN"
  - "MicroVM"
  - "AI Agents"
  - "Sandbox"
  - "Zero Trust"
  - "Log Rotation"
  - "Rate Limiting"
  - "Denial of Service"
  - "Developer Security"
  - "Rust"
  - "Open Source"
---
Moon MCHN v0.2.1 fixes a bug where a machine (VM) could fill up your computer's disk (host) simply by repeatedly attempting to access a destination it wasn't allowed to.

v0.1.0 and v0.2.0 are affected. Upgrade with `cargo install moonmchn-cli --locked` and then restart the daemon to run the new code.

## The Bug

Each time Moon MCHN denies outbound network traffic from a machine, it writes a line to `~/.local/state/spacecraft/daemon.log` for every connection it refuses:

```
egress: denied my-machine to https://api.example.com (192.0.2.10:443): no list allows it
```

A process stuck in a retry loop, or an agent continually trying to reach a forbidden endpoint, would generate one line per attempt as long as it stayed in that state. Over time, it would keep growing until the host disk was full.

## Rotating the Log

Once `daemon.log` hits 8MiB, the Moon MCHN daemon will rotate it. The `daemon.log` file becomes `daemon.log.1`; each older file increments by one, and the oldest (`daemon.log.15`) is deleted. The host will always have at max 16 log files, taking no more than 8MiB x 16 = 128MiB.

If you follow the log, use `tail -F daemon.log`, because it reopens `daemon.log` after rotation, while `tail -f` stays on the file that became `daemon.log.1`.

## Machine Log Budget

Rotation limits disk space, but one noisy machine could still fill all 16 files with its denies and push out all the rest (including other machines' lines).

Now each machine has a limit of 60 log lines per 60 seconds. Lines above that limit are dropped and counted, and the count appears at the start of the machine's next window.

```
egress: my-machine: 89 lines dropped: more than 60 in 60 s
```

I decided to set the limit per machine because a limit per network destination (URL) wouldn't work; the guest can pick any destination and hostname, so you still end up with a noisy machine filling up all the log files.

At roughly 80 bytes per line, a machine using its entire limit nonstop would add less than 7MiB a day. It would take almost three weeks to fill every file.

## Zero Trust

Moon MCHN exists to give you safe defaults, and for that it trusts nothing that runs inside a machine. **Moon MCHN treats every action from within a machine as if it came from malicious code.**

The network filter stops the guest from reaching a destination over the network, but it had the side effect of potentially filling up the host disk. The per-machine rate limit caps that cost, so a machine (VM) can’t use the log to fill your disk. Whenever a machine is (in)directly using a host resource, **the host must cap it**, and **the machine must not be able to raise the cap**.

If you find any security problem, please report it privately, as [SECURITY.md](https://github.com/galaxyloop-labs/moonmchn/blob/main/docs/SECURITY.md) explains.

