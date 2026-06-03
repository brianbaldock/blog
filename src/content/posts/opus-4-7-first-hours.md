---
title: "Opus 4.7 First Hours"
description: "A hands-on first-hours review of Claude Opus 4.7. What moved, what broke, the token-cost gotchas, and why Anthropic is still holding Mythos back."
pubDate: "2026-04-17T01:37:26.477Z"
cover: "/images/opus-4-7-first-hours/79cfeea0-38cd-4c6d-8bd8-159085f652b4.png"
coverAlt: "Cover image for Opus 4.7 First Hours"
tags:
  - "claude"
  - "anthropic"
  - "opus-4-7"
  - "claude-opus-4-7"
  - "claude-opus-4-7-features"
slug: "opus-4-7-first-hours"
---

> Claude Mythos Preview, is still behind the glass, quarantined behind Project Glasswing

Anthropic dropped Claude Opus 4.7 this morning, and I spent the first couple of hours living inside it. Not benchmarking it; working with it. Writing, reviewing, poking at it with the kind of work that actually fills my day.

Short version: it is measurably better than 4.6 at the things I care about, it is noticeably stricter about instructions, and Anthropic is doing something **unusual** with the **positioning**. They released it alongside a reminder that the real powerhouse, Claude Mythos Preview, is still behind the glass, quarantined behind [Project Glasswing](https://www.anthropic.com/glasswing) and a Cyber Verification Program. That framing alone is worth unpacking.

Let me walk through what moved, what broke, and what I'm watching.

## The Bridge Model Nobody Asked For, but Everyone Kind of Wanted

> The last few months have felt like quiet nerfing

Before I get into the wins, the context matters.

The story the community has been telling, on Reddit and X and in every power-user backchannel I'm in, is that the last few months have felt like quiet nerfing. Reasoning depth shrinking, SWE-bench scores drifting backward, Gemini getting weirdly cautious. Whether the metrics fully support that narrative is a separate post. The vibe is real. The [r/claude Opus 4.7 Ultrareview / Mythos Theory](https://www.reddit.com/r/claude/comments/1sn8uzj/opus47_ultrareview_mythos_theory/) thread captures the flavor of it pretty well; people want the model Anthropic is clearly holding back.

4.7 reads like Anthropic's answer to that. Not the big release; **the stabilizing one.** The message between the lines of the launch page: here is the strongest public model, and by the way, we still have a better one we are deliberately not shipping yet. That's a confident and maybe marketing stance. It also tells you exactly where they think the risk floor is right now.

## What Actually Changed

Stripping out the marketing, the real deltas that hit my workflow in the first few hours.

### Vision Went From Useful to Load-Bearing

4.6 could read a screenshot. 4.7 can read a dense screenshot. The model now accepts images up to 2,576 pixels on the long edge, roughly 3.75 megapixels, which is more than triple what prior Claude models handled. XBOW reported their visual-acuity benchmark went from 54.5% on 4.6 to 98.5% on 4.7. Even accounting for benchmark theatrics, that is not a nudge; that is a ceiling breaking!

For anyone doing computer-use agents, document extraction, or diagram-heavy work, this is the quiet headline.

### Instruction Following Tightened, and It Will Break Your Old Prompts

> "Delete your instructions and start fresh."

This one bit me in the first hour.

4.7 takes instructions **literally**. Prompts I had tuned for 4.6, which worked fine because the model was generously *interpreting* my intent, started producing different output. Not worse output. Different. More faithful to exactly what I wrote, which exposed the sloppiness in what I wrote.

Anthropic flagged this in the launch notes, and they are right: retune your prompts. If you have a harness, a system prompt, a playbook template, go read it with fresh eyes before you assume 4.7 is acting up. To quote Boris Cherny himself, "Delete your instructions and start fresh."

### xhigh, and Why the Default Change Matters

There is a new effort level between `high` and `max`, called `xhigh`. Claude Code defaulted to `xhigh` for all plans at launch. That is the part worth pausing on.

**Higher default effort means more tokens, which means higher spend for anyone not paying close attention, particularly on longer agentic runs.** Combined with the new tokenizer (same input can map to 1.0 to 1.35x more tokens depending on content type), your bill will shift even if your workload did not. **Measure before you assume.** I set a task budget on my first long-running test, watched where the tokens actually went, and adjusted from there.

### Memory Across Sessions Got Real

> Stop craming everything into the system prompt!

4.7 is meaningfully better at using file-system based memory, the kind agents write to scratchpad files and come back to. I threw a long-running writing project at it across two separate Claude Code sessions, and it actually referenced the notes file cleanly instead of pretending the first session never happened.

This is the quiet unlock for anyone building agent workflows. You stop having to cram everything into the system prompt.

## What I'm Watching Carefully

### The Doom Loop

> If you are running 4.7 autonomously on long-horizon tasks, you **may** need a watchdog.

Anthropic's own model card documented 4.7 occasionally spiraling into what Sherwood News accurately called a doom loop; in one case, a 25,000-word bout of second-guessing on a biology question, complete with all-caps and profanity. The rate is about 0.1%, comparable to 4.6 and Mythos Preview, so it is not new. It is just more visible now because 4.7 is getting handed harder work with less supervision, which is exactly the setup where low-probability failures stop being theoretical.

Translation for production use: if you are running 4.7 autonomously on long-horizon tasks, you need a watchdog. Max token caps, wall-clock limits, and an escalation path that pulls a human in when the output shape goes weird. Same advice I would give for any agent, just with more urgency.

Revamping your prompts, tuning to a more human flow that will trigger the models inherent understanding of the human experience. Example, "Bet present and conscious of potential scenarios where you will loop." Can sometimes help.

### Cyber Safeguards, From the Attacker's Point of View

This piece I find extraordinarily fascinating.

> If the safeguards are soft, we get a speed bump; the kind that frustrates legitimate researchers while barely slowing down anyone who knows how to chunk a request and keep a straight face.

4.7 ships with the first real-world test of the new cybersecurity safeguards that came out of Project Glasswing. The safeguards automatically detect and block requests that look like prohibited or high-risk cyber use. Red teamers and security researchers can apply to a Cyber Verification Program to get around this for legitimate work.

Read that from the **attacker's** angle first. If the safeguards are good, we get a model that is genuinely harder to weaponize for offensive security without authorization. If the safeguards are soft, we get a speed bump; the kind that frustrates legitimate researchers while barely slowing down anyone who knows how to chunk a request and keep a straight face. History with every previous content filter suggests the truth sits closer to the speed-bump end, at least at launch.

This is also explicitly a test run. Anthropic said, on the record, that they are holding Mythos back specifically to learn how 4.7's safeguards hold up in the wild. If a Mythos-class model ever reaches broad release, the playbook for keeping it inside the rails starts here. **I will be watching the bypass chatter closely, and so should every security team with an AI policy.**

### BrowseComp Slipped

Coding went up. Vision went up. Tool use went up. Agentic search went down; BrowseComp dropped from 83.7% on 4.6 to 79.3% on 4.7, trailing Gemini 3.1 Pro and GPT-5.4 Pro. If your agents lean on open-web research as the primary data source, 4.7 is a sidegrade at best there. Worth benchmarking on your own traffic before switching the default.

## What I'm Actually Doing With It

Here is where 4.7 lands in my stack, pragmatically, after a few hours.

> Sloppy prompts produce sloppy output, and 4.7 is just less willing to paper over mine.

For one-shot coding where I want the model to read a real codebase and ship a real fix, 4.7 is the daily driver. Vercel called it "more honest about its own limits" in their early testing, and that matches what I saw; it hedges less on the easy stuff and hedges more on the genuinely hard stuff, which is the right direction.

My prompts need tightening, which is a feature. Sloppy prompts produce sloppy output, and 4.7 is just less willing to paper over mine.

For anything touching security content or research, I am going to be deliberate about how I phrase requests, at least until the safeguard behavior stabilizes. If a legit workflow starts bouncing off the filter, the Cyber Verification Program exists for a reason; use it.

## The Honest Take

> Bring your hardest task, not your easiest one. That is where the difference lives.

4.7 is a real upgrade. It is not a Mythos-class jump. Anthropic is not pretending it is; they are basically telling you, in the launch post, that the bigger model exists and is not ready for the world yet.

That is unusually honest positioning for an AI launch. It is also a useful signal. If you are building on the Claude platform, plan for the migration now; the tokenizer change and the stricter instruction following will affect you even if you were not planning on upgrading. If you are building cybersecurity tooling on top of Claude, read the Glasswing writeup and get your Cyber Verification paperwork started.

And if you are just using Claude to do your job better, which is most people, try it for a day. **Bring your hardest task, not your easiest one. That is where the difference lives.**

More in a week, once the novelty wears off and we can see what 4.7 actually costs in tokens and trust at scale.

## References

*   Anthropic. *Introducing Claude Opus 4.7*. [https://www.anthropic.com/news/claude-opus-4-7](https://www.anthropic.com/news/claude-opus-4-7)
    
*   Anthropic. *Project Glasswing*. [https://www.anthropic.com/glasswing](https://www.anthropic.com/glasswing)
    
*   Anthropic Platform. *Migration guide: Opus 4.6 to Opus 4.7*. [https://platform.claude.com/docs/en/about-claude/models/migration-guide](https://platform.claude.com/docs/en/about-claude/models/migration-guide)
    
*   Vellum AI. *Claude Opus 4.7 Benchmarks Explained*. [https://www.vellum.ai/blog/claude-opus-4-7-benchmarks-explained](https://www.vellum.ai/blog/claude-opus-4-7-benchmarks-explained)
    
*   Sherwood News. *Anthropic releases Claude Opus 4.7, with better coding, better vision, and occasional doom loops*. [https://sherwood.news/tech/anthropic-releases-claude-opus-4-7-with-better-coding-better-vision-and-occasional-doom-loops/](https://sherwood.news/tech/anthropic-releases-claude-opus-4-7-with-better-coding-better-vision-and-occasional-doom-loops/)
    
*   VentureBeat. *Anthropic releases Claude Opus 4.7, narrowly retaking lead for most powerful generally available LLM*. [https://venturebeat.com/technology/anthropic-releases-claude-opus-4-7-narrowly-retaking-lead-for-most-powerful-generally-available-llm](https://venturebeat.com/technology/anthropic-releases-claude-opus-4-7-narrowly-retaking-lead-for-most-powerful-generally-available-llm)
    
*   Reddit, r/claude. *Opus 4.7 Ultrareview / Mythos Theory*. [https://www.reddit.com/r/claude/comments/1sn8uzj/opus47\_ultrareview\_mythos\_theory/](https://www.reddit.com/r/claude/comments/1sn8uzj/opus47_ultrareview_mythos_theory/)
