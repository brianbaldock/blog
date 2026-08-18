---
title: "Agentic graphs, facts, fiction and auditing the claim"
description: "A viral post said 90% of Anthropic engineers moved to agentic graphs and stopped prompting. The number has no source and the video was a Claude Code demo. The architecture underneath is still worth learning."
pubDate: 2026-08-18
cover: "/images/agentic-graphs-facts-fiction-auditing-the-claim/cover.png"
coverAlt: "Dark navy cover reading Agentic Graphs, Facts, Fiction and Auditing the Claim, with a node graph fading from dim dashed edges on the left into bright cyan verified edges passing through a checkmark node"
tags:
  - "ai"
  - "agents"
  - "knowledge-graphs"
draft: false
---

I saw a post on July 31st and keep seeing similar posts that said this:

> "Anthropic engineer: 90% of our engineers were using self-improving loops. Now everyone shifted to building agentic Graphs" "No more prompting."

I went digging for the engineer, and I found that there isn't one. No name, no talk, no citation. The percentage shows up as 70 in earlier retellings as you go back, then 80, then 85, then 90, drifting upward with each repost while nobody adds a source. The timeline slides between "3-6 months" and "4-6 months" depending on which version you read, so, is graph engineering real?

I checked the video attached to the most-shared post, it's Cat Wu's Claude Code demo from Anthropic's Code with Claude conference, 22 May 2025. It runs 10:56, probably why everyone keeps saying "learn graph engineering in just 10 minutes". The video, if you actually watch it, covers general availability, the Claude 4 models, GitHub Actions, and the IDE extensions. Graphs are not in it. The top reply on the original post said so and got buried under the reposts.

A number that arrives as 70, then 80, then 85, then 90 without anyone attaching a source is not a measurement. It's decoration and that decoration keeps spreading.

## The annoying part  

What makes this hard to deal with is that the architecture underneath is real, graph engineering is something that you can and probably should do. If the post were pure nonsense you could dismiss it and move on. But strip the fake percentage and the wrong video, and what's left is a **genuine shift in how agent systems get built**, one that a lot of people are now going to learn from a source that already got the easy facts wrong.

"No more prompting" is the clearest example. It's false as stated. The model-calling nodes in an agentic graph are still prompts, and they still decide whether the system works. What actually happens is that prompting gets *demoted*, from being the whole job to being one component sitting next to deterministic nodes that never call a model at all. In my lesson, linked below, you'll see that I say "Stop Prompting, start building Agentic Graphs instead." That's a real and useful approach. It is not the abolition of prompting, and someone believing that it will will just build something that breaks and they won't understand why.

Same with the term itself. "Agentic graph" gets used for two different things that travel under one name.

- **Knowledge graph memory:** your agent stores facts as entities and relationships with timestamps, instead of a pile of text chunks, so it can traverse from a thing to its related things and answer questions about how the world changed over time. 
- **Agentic workflow graphs:** your system is a directed graph of small single-purpose steps with explicit routing, instead of one giant prompt trying to do everything.

Neither half is agentic on its own. *A workflow graph with no memory is a pipeline that forgets.* And a knowledge graph with no workflow is a database nobody queries. What makes it agentic is the loop: the agent retrieves from the graph, acts, and writes back what it learned, so the next decision runs against a graph its own earlier decisions shaped.

That loop is also **why I care so much about validation**. In a system that reads its own writes, one bad edge isn't a bad row. It's a bad **belief** that gets retrieved and reinforced.

## So I built the course I wanted to read

It's twelve lessons, free, at [agenticgraphs.dev](https://agenticgraphs.dev/). Lesson 0 is the audit above, because starting a course on a false premise is a bad way to learn anything.

The rest keeps the architecture:

- A temporal knowledge graph on SQLite where edges carry `valid_from`, `valid_until`, and provenance, so "who was the CTO in March" is a query and not a guess.
- A validation gate with a closed relation vocabulary, normalization, grounding checks, and real calendar-date validation. Everything writes through one ingestion boundary, so temporal closes can't be skipped by a caller who forgot.
- The extraction/traversal split, which is the one idea the whole thing hangs on: extraction is very high volume and mechanically low judgment, so it gets a cheap model with a cached prefix and batching. Traversal and multi-hop reasoning are low volume and high judgment, so they get a frontier model and a small precise context. Spend intelligence exactly where intelligence is needed.
- An MCP server that exposes the graph to a real agent, so you can wire it into Hermes or Copilot CLI and watch the loop close.

Parts 1 through 3 run with no API key, no database server, and no cloud account:

```bash
git clone https://github.com/brianbaldock/graph-engineering-course

cd graph-engineering-course/labs

python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/python -m pytest tests/ -q # 28 passed
.venv/bin/python -m graphlab.pipeline # full pipeline, offline
```

Twenty-eight tests, covering the gate, the temporal queries, retrieval bounds, a regression on the MCP close path, and fail-closed policy loading. They run in CI on every push, along with a citation gate that re-checks every source the lessons link to.

## One more fix

The article circulating alongside the viral post told readers to run `uvx graphiti-mcp`. That package does not exist on PyPI. It 404s. The verified Graphiti MCP configuration is in Lesson 10, along with what I actually had to change to make it come up.  

I don't think that's malice, and I don't think the percentage was either. It's what happens when a plausible-sounding specific fits the rhythm of a sentence and then nobody checks. I do it too, probably more often than I would like to with AI. The difference is whether there's a step in your process where checking happens, and whether that step can fail loudly.

This is the same problem as the validation gate, and the same problem as the citation gate I run over the course's own sources before every deploy. It's turtles all the way down: the only reason to trust the course's audit of somebody else's claim is that the course applies the same standard to itself.

**If you can't audit the claim, you can't audit the system you build from it.**

[Start at Lesson 0.](https://agenticgraphs.dev/lessons/00-what-this-is/)
