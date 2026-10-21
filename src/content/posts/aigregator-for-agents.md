---
title: "Making AIgregator readable by agents (and why it's two static files)"
description: "AIgregator now ships llms.txt and a per-story JSON Feed so agents can build custom AI news briefs. Why static files beat an MCP server here, and how we licensed it."
pubDate: "2026-10-21T15:00:00.000Z"
cover: "/images/aigregator-for-agents/cover.png"
coverAlt: "Black terminal-style card reading 'Your agent. Your AI news.' in green and amber, with the command 'curl aigregator.news/llms.txt' below"
tags:
  - "ai"
  - "agents"
  - "aigregator"
  - "llms-txt"
  - "open-content"
draft: true
---

AIgregator has been writing a daily AI news digest since May. Every morning it pulls from wires, lab blogs, arXiv, GitHub, Hugging Face and social sources, clusters the duplicate coverage, scores what's left, and writes short summaries that link back to the original reporting.

It was built for people. For an agent, it was a bad experience.

If you asked an agent to "check AIgregator for AI security news," it had two options. It could scrape the digest HTML and hope the markup held still, or it could read the RSS feed, where each item is an entire day's edition as one blob of HTML at around 700 KB uncompressed. Neither one gave it the thing it actually wanted: a list of stories, each with a summary and a link to the source.

So this week I fixed that. The whole fix is two static files and a license.

## What shipped

**[/llms.txt](https://aigregator.news/llms.txt)** is the instruction sheet. Plain text, written for a model to read: what the site is, which feed to use for what, when new editions land, how to cite, and what the numbers mean.

**[/feed.json](https://aigregator.news/feed.json)** is the data. It follows [JSON Feed 1.1](https://www.jsonfeed.org/version/1.1/), with one item per story instead of one per day, covering the last seven editions. Today that's 255 stories, about 42 KB gzipped. Each item looks like this:

```json
{
  "id": "https://aigregator.news/digests/2026-10-20.html#item-1",
  "url": "https://aigregator.news/digests/2026-10-20.html#models-amp-releases",
  "external_url": "https://stratechery.com/2026/muse-spark-open-meta-apple-thin-and-thick/",
  "title": "...",
  "summary": "...",
  "date_published": "2026-10-20T14:00:00Z",
  "tags": ["models", "opensource"],
  "_aigregator": {
    "section": "models",
    "score": 11,
    "source_count": 2,
    "sources": [{ "name": "...", "url": "..." }],
    "edition": "2026-10-20"
  }
}
```

`external_url` is the original article. That's the point: we're a discovery layer, and the feed is built to hand the agent off to the publisher, not to keep it on our site.

The About page got an Agents & feeds section, and every page now advertises the feed with a `<link rel="alternate" type="application/feed+json">` tag so feed-aware tools find it without being told.

## Why not an MCP server

This was the first thing I asked myself, and it's the fashionable answer. I didn't build one.

AIgregator is a static site on GitHub Pages. No server, no database, no runtime to patch. An MCP server would mean standing up and securing a process, handling auth or abuse, and paying for it, all to serve data that changes exactly once a day.

Every agent with web access can already fetch a URL. A JSON file on a CDN is the most compatible API there is. It caches, it costs nothing, and it can't be taken down by a bad deploy of a server I don't run. If someone wants MCP, wrapping a JSON Feed in an MCP tool is a thin job, and that's their call, not a dependency I have to babysit.

Simple and cheap first. If the static version ever stops being enough, that's a nice problem to have.

## The parser reads markdown, not HTML

Every digest starts as markdown, and the HTML is generated from it. The feed builder parses the markdown, so a redesign of the site can't quietly break the feed.

Two things in the test suite earned their keep before anything shipped.

The first was about anchors. I'd assumed the section anchors in the digest HTML would be the section names slugified, so "Models & Releases" becomes `#models-releases`. The test checked every story link in the last seven editions against the built pages and failed on 164 of them. The site's heading IDs are generated from the *rendered* HTML, where `&` has already become `&amp;`, so the real anchor is `#models-amp-releases`. Every "jump to this section" link in the feed would have been a dead anchor. It's ugly, but it's what the site actually does, so the feed now mirrors it and the test keeps them in lockstep.

The second was about Hacker News and Bluesky items. Their link text is "HN" or an @handle, and the real headline is the prose after the link. The first version of the parser happily produced items titled "HN." Now it uses the prose.

There's also a check that every bullet in the last fourteen digests produces exactly one feed item, so nothing gets silently dropped.

## Licensing a discovery layer

This was the part I thought hardest about, because AIgregator is mostly pointers to other people's work.

What's actually ours: the rewritten headlines, the one- or two-sentence summaries, the scores, the theme tags, how stories get grouped and counted, and the selection itself. What's not ours: the articles, the facts in them, and the prediction-market data we show from Polymarket.

So the license says exactly that.

> AIgregator's headlines, summaries, scores and editorial organization are licensed under CC BY 4.0. Credit "AIgregator (aigregator.news)" and link to the edition or story.
>
> Linked articles belong to their publishers and are not covered by this license; read and cite them at the source. Prediction-market data is from Polymarket and remains subject to its terms.
>
> Summaries are machine-assisted and curated, and may contain errors. The linked source is authoritative.
>
> Site code is MIT-licensed.

A few choices in there were deliberate.

**CC BY, not CC BY-NC.** NonCommercial sounds protective, but "commercial" is vague enough that cautious pipelines skip NC content entirely. I'd rather an agent use the summaries and credit them than avoid the site out of legal caution.

**Say what's excluded, don't describe it.** My first instinct was something like "original sources are licensed by their creators." That reads as if I'm characterizing someone else's rights, which I can't do. "Not covered by this license" is a clean boundary that makes no claims about the publisher.

**Attribution only covers the words.** Facts aren't copyrightable. If an agent reads our summary and writes its own sentence about the same news, CC BY probably doesn't require it to credit us. That's why `llms.txt` asks for citation as guidance, separately from the license: cite the source for facts, cite AIgregator for the synthesis.

**Code and content are separate.** The repo stays MIT. Mixing a software license with an editorial one creates confusion nobody needs.

## Try it

Paste this into any agent with web access:

```text
Read https://aigregator.news/llms.txt, then fetch https://aigregator.news/feed.json.

Build me a short AI news brief from the last 2 days of stories:
- Only include items about: open-source models, AI security, and agent tooling.
- Skip funding rounds and product marketing.
- For each item: one sentence in plain English on why it matters to a software engineer, then the original source link (not the AIgregator link).
- Rank by the feed's score, max 8 items.
- End with one line crediting AIgregator.
```

I ran exactly that against the live feed with a fresh agent and no setup. It came back with five stories, each linked to the original publisher, and I checked that every link was a real item in the feed. Swap in your own topics and audience.

## Honest limits

**Story links land on the section, not the story.** Inside a section, stories don't have their own anchors yet. The link drops you on "Models & Releases" and you scroll.

**Timestamps are the edition time.** Every item says 14:00 UTC, because the digest doesn't record when each story was originally published.

**Scores are ours.** `source_count` counts how many outlets covered a story. That's a signal of attention, not independent verification.

## Same week: the archive got a folder tree

While I was in there, I fixed the other thing that had been bugging me. The archive was one flat table that grew by a row every day, 162 rows deep. It's now a Year > Month folder tree, like browsing an old FTP mirror. The current and previous year live on the archive page, and older years split out to their own pages so the page stays bounded no matter how long this runs.

Full-text search moved too. The Pagefind index was 81 MB across about 3,000 files, and it was getting committed to the repo on almost every publish. It's now built by GitHub Actions at deploy time and never touches git.

If you build something on the feed, I'd like to see it.
