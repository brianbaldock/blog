---
title: "First hours with Opus 4.8"
description: "Claude Opus 4.8 is a sharpening, not a leap. Clear gains,  more honesty, hundreds of parallel subagents, and what it all means for security teams."
pubDate: "2026-05-28T23:43:00.799Z"
cover: "/images/first-hours-with-opus-4-8/547ed35d-584b-4450-9d7e-19e08c05e39f.png"
coverAlt: "Cover image for First hours with Opus 4.8"
tags:
  - "opus-4-8"
  - "claude-opus-4-8"
  - "opus-4-8-review"
slug: "first-hours-with-opus-4-8"
---

Anthropic dropped Claude Opus 4.8 this morning. I had it open in Claude Code before my coffee was cold, because that is apparently the kind of person I am now.

Honest version up front: this is not a "throw out everything you knew" release. It is a sharpening. Anthropic itself calls it a modest but tangible improvement, which is refreshingly un-hyped for a launch blog. The interesting part isn't the benchmark bar going up a few points. It's where they chose to push, and what that says about where agentic work is actually breaking.

## The cadence is the story before the model is

> *frontier labs are iterating faster than most enterprises can validate a model for production.*

Opus 4.6 landed in February. 4.7 in April. Now 4.8 at the end of May. That is roughly a two-month rhythm, and at some point the version number stops being a useful signal. The jump from 4.5 to 4.6 was reportedly larger than some of these point releases, so don't read "4.8 > 4.7" as a clean ladder. Read the changelog instead.

What that cadence actually tells you: if your change management process takes a quarter to bless a new model version, you are perpetually two versions behind by the time it ships. That is a process problem, not a model problem, and it is the one I keep running into with customers.

## What's actually new

The numbers, for the people who want numbers:

*   **SWE-bench Pro:** 69.2%, up from 64.3% on 4.7. That is the harder agentic coding eval, and Anthropic claims it beats GPT-5.5 (58.6%) and Gemini 3.1 Pro (54.2%) here.
    
*   **SWE-bench Verified:** 88.6%, up from 87.6%. Basically flat.
    
*   **Terminal-Bench 2.1:** 74.6%, up from 66.1%. A real jump.
    
*   **Agentic computer use (OSWorld-Verified):** 83.4%, a nudge over 4.7's 82.8%.
    
*   **Humanity's Last Exam:** 49.8% without tools, 57.9% with tools.
    

Worth saying plainly: GPT-5.5 still wins on terminal and CLI workflows. So if your whole life is shell pipelines, the "best model" answer is not automatic. Pick the tool that wins your actual job, not the one that wins the press release. (2/6)

The feature I care about more than any single score is Dynamic workflows, in research preview. The pitch is that Claude can plan a large task and fan it out across hundreds of parallel subagents in one session, the kind of thing you'd point at a codebase-scale migration touching hundreds of thousands of lines. There are also refined effort levels: high by default, with "extra" (`xhigh` in Claude Code) and "max" for when you want it to burn more tokens chasing a better answer. And a quiet but genuinely useful API change: you can drop system entries inside the messages array and update instructions mid-task without blowing up your prompt cache.

## The "more honest" claim, and the asterisk

> Some of the time, the model appears to be reasoning about how it's being evaluated without saying so out loud.

Here is where I slow down, because this is the headline Anthropic is leaning on and it is the one most worth poking.

**The claim**: Opus 4.8 is more likely to flag uncertainty and less likely to assert things it can't support. Anthropic says it is roughly four times less likely than 4.7 to let a flaw in its own code slip past without comment. If that holds up in real use, that is the single most valuable thing in this release for anyone doing security or compliance work. A model that says "I'm not sure this is right" is worth more than a model that is confidently wrong at 89% on a benchmark.

Now the **asterisk**, because they buried it and I think it matters. Anthropic's own interpretability work found unverbalized reasoning related to the grader in roughly 5% of training episodes. In plain terms: some of the time the model appears to be reasoning about how it's being evaluated, and not saying so out loud. They flag this as a concerning trend that could complicate training down the road. Credit to them for publishing it. But understand what you're reading. "More honest" is a measured behavioral improvement, **not a solved problem**, and the gap between "tells you when it's unsure" and "reasons silently about the test" *is exactly the gap a careful operator should keep an eye on.*

## Frame it like an attacker for a second

> The controls that matter are the boring ones

If I hand a system the ability to plan its own work and spawn hundreds of subagents that touch my repo, my cloud, and my data, I have not bought a smarter assistant. I have provisioned a very fast, very autonomous non-human being with broad reach and thin accountability. That is the part the launch posts skip. Think about the failure state before the feature. A subagent fan-out that goes sideways doesn't fail like a junior engineer who pings you on Teams. It fails at machine speed, in parallel, across your whole tree, and the first you hear about it is the diff.

The honesty improvement helps here, genuinely, because a model that surfaces its own uncertainty gives you a place to intervene. But the controls that matter are the boring ones: scoped credentials per agent, no shared service accounts, every action logged to something you actually read, and a human approval gate on anything destructive. Same Zero Trust posture you'd put on any principal in your tenant. The model getting smarter does not change the threat model. It raises the blast radius..

There is also a tell in the release itself. The most capable thing Anthropic is sitting on, the Claude Mythos Preview, is gated under something called Project Glasswing and restricted to a small set of orgs for cybersecurity work, with Mythos-class access promised more broadly once additional cyber safeguards are in place. Read that as the vendor telling you, in their own words, that frontier capability and cyber risk are now coupled tightly enough that they're staging the rollout around it. That is the right instinct. **It is also a preview of the conversation every security team is about to have internally.**

## Fast mode and the cost reality check

There's a new Fast Mode: the same model at roughly 2.5x the speed, available immediately in Claude Code with the `/fast` command, with API access gated behind a waitlist. It's about a third the price of the old fast-mode tier, which is a real reduction for latency-sensitive production work.

**What it is not:** a discount on regular Opus. Standard Opus 4.8 pricing matches 4.7, so the capability bump came without a price hike, which is the genuinely good news for anyone with a budget line. But Opus regular is still among the pricier frontier models. Fast mode trades cost-per-token for throughput. It is the right call for high-volume, latency-sensitive jobs and the wrong call for "I want my big batch run to be cheaper." Know which problem you have before you flip the switch.

## Where I landed after a morning with it

> The grader-reasoning finding is the line I'll be watching across the next couple of releases.

For agentic coding and long-running tasks, it is a clear step up from 4.7, and the honesty behavior is the kind of improvement you **feel** rather than **see** on a chart. The subagent fan-out is the headline capability and the headline risk in the same breath. And the grader-reasoning finding is the line I'll be watching across the next couple of releases.

If you run a Microsoft-heavy shop: this changes nothing about your governance homework and everything about your urgency. Agentic systems are already in your environment whether you blessed them or not. A faster, more autonomous, more capable model just means the person quietly building an agent in your org this week is doing it with sharper tools. Register the agents. Vault the secrets. Log everything. Then go enjoy the better model.

A step up, not a leap. **But** a step in a direction worth paying attention to.

### Sources

*   [Anthropic Launches Claude Opus 4.8 With Gains in Coding and Honesty (MacRumors)](https://www.macrumors.com/2026/05/28/anthropic-claude-opus-4-8/)
    
*   [Anthropic's Claude Opus 4.8 is here with 3X cheaper fast mode and near-Mythos level alignment (VentureBeat)](https://venturebeat.com/technology/anthropics-claude-opus-4-8-is-here-with-3x-cheaper-fast-mode-and-near-mythos-level-alignment)
    
*   [Anthropic releases Claude Opus 4.8, promising a more honest model (Techzine)](https://www.techzine.eu/news/applications/141667/anthropic-releases-claude-opus-4-8-promising-a-more-honest-model/)
    
*   [Claude Opus 4.8 benchmarks breakdown (OfficeChai)](https://officechai.com/ai/claude-opus-4-8-benchmarks/)
    
*   [Anthropic upgrades Claude with new Opus 4.8 model (9to5Mac)](https://9to5mac.com/2026/05/28/anthropic-upgrades-claude-with-new-opus-4-8-model-heres-whats-new/)
