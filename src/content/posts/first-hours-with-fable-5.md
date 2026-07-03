---
title: "First hours with Fable 5"
description: "Claude Fable 5 is the most capable model Anthropic has shipped. It also blocks legit security work and drops the zero-retention floor businesses chose it for."
pubDate: "2026-06-10T16:00:00.000Z"
cover: "/images/first-hours-with-fable-5/cover.png"
coverAlt: "Cover image for First hours with Fable 5"
tags:
  - "fable-5"
  - "claude-fable-5"
  - "mythos-5"
  - "ai-safety"
  - "fable-5-review"
slug: "first-hours-with-fable-5"
draft: false
---

> ~~Mythos~~ Fable.

Anthropic shipped its most capable model yesterday and I had it open once I had the chance. Claude Fable 5, the first generally available "Mythos-class" model. The benchmarks are real. The demos are real. A 50-million-line Ruby migration in a day is the kind of number that makes you sit up.

And then I pointed it at my own code, asked it to do the thing I do with every model on day one, a security pass over a project I wrote and own, and it quietly handed me off to a weaker model with a safety notice.

Same code. Same me. Same audit I ran last week on Opus 4.8 without a blink. The difference is a classifier that watched the word "cybersecurity" go by and decided I might be a bad guy.

>Cybersecurity is a no-no word.

So this is a "first hours" post with a split personality, because the model has one. Fable 5 is the best thing Anthropic has built. It is also wearing a guardrail that cannot tell a locksmith from a burglar, and it shipped alongside a privacy change nobody is leading with. Let me take all three in turn.

## What actually shipped

The honest version up front: State of the art on the coding evals Anthropic cares about, strong vision, strong long-context, senior-grade knowledge work. And it is cheaper than what came before, $10 per million input tokens and $50 per million output. A more capable model at a lower price is the genuinely good news, and I want to say that plainly before I spend the rest of the post on the asterisks.

>The asterisks are big.

Fable 5 ships with a new class of safety classifiers watching the conversation in real time across three domains: cybersecurity, biology and chemistry, and "distillation" (attempts to extract its capabilities to train another model). Trip one of those classifiers and Fable 5 either refuses or silently falls back to Opus 4.8 before it answers (optional fail-close is available). Anthropic's framing is that this happens in fewer than **5% of sessions** though what I'm seeing in social media may not be the case. Their spokesperson told Business Insider it was "necessary to be overly conservative." Hold onto that phrase. It is the whole story in four words.

## The guardrail that cannot tell a locksmith from a burglar

Here is what "overly conservative" looks like in practice. Business Insider tested the model by asking it about cancer. The safety system flagged it and bumped the session down to Opus 4.8. A question about cancer.

Over on r/ClaudeAI the threads are full of the same shape of complaint from people doing normal work: routine auditing workflows that ran fine on Opus 4.8 and earlier, now blocked on personal projects. Not exploit development. Not malware. Audits. The exact defensive work the security industry spends its days on.

This is the part that should bother anyone who does this for a living. A keyword-shaped classifier sitting in front of a capable model does not distinguish intent. It distinguishes vocabulary. "Audit my authentication flow for vulnerabilities" and "find me an authentication bypass" share most of their words and almost none of their purpose, and a real-time content classifier optimized to be "overly conservative" is going to treat them the same. The defender asking a legitimate question and the attacker probing for a foothold look identical to a system that reads tokens instead of context.

Credit where due: Anthropic published this honestly. Their own news post says they are "working to reduce false positives as quickly as we can." The system card cops to over-refusal. That is more transparency than most labs offer. But understand what you are reading. The vendor is telling you, in writing, that the safety control fires on innocent users, and shipping it anyway, with a promise to fix it later. That is a decision, not an accident, and it is worth naming as one.

David Kasten, head of policy at Palisade Research, put a finger on the second-order problem in the Business Insider piece: when a frontier model keeps visibly downgrading itself to a weaker one, the public and the policymakers watching can walk away with a warped sense of what these systems can actually do. The capability is real. The thing most users get to see is the capability with the parking brake on.

## Safe for whom

Now the part nobody else is writing, and the part that turns this from an annoyance into an argument.

The uncapped model exists. It is called Mythos 5, it is the same Mythos-class capability with the cyber guardrails lifted, and it is available right now to a hand-picked list of organizations through something Anthropic calls Project Glasswing. They are onboarding roughly 150 orgs into it. If you are one of them, you get the real thing for security work. If you are not, you get the classifier.

I flagged this exact dynamic when Opus 4.8 shipped a couple of weeks ago, back when Glasswing was just a preview gated to a small set of orgs. I wrote then that the vendor was telling you, in their own words, that frontier capability and cyber risk are now coupled tightly enough that they are staging the rollout around it. Fable 5 is that staging made concrete. The capability is no longer the scarce thing. Access to use it for defense is the scarce thing, and access is an invite list.

I understand the logic. The same uplift that helps a defender helps an attacker, and Anthropic would rather meter who gets the uncapped version than hand it to everyone. Fine. But sit with the shape of the outcome. The most capable defensive tool of the moment is being rationed by allowlist, and the people who fall outside the list, independent researchers, small security teams, the person auditing their own side project, get a model that treats their defensive work as suspicious by default. We have built a tool that is safe for the institutions and friction for everyone else, and "everyone else" is most of the people actually doing the work.

## The retention move nobody is leading with

While everyone argues about refusals, the quieter change is the one I would actually escalate to a customer.

Zero data retention is gone for Mythos-class models. Not softened. Gone. If your organization runs a ZDR agreement through the Claude Console, or Claude Code under a ZDR Enterprise plan, or Mythos-class access through AWS Bedrock, Google Cloud, or Microsoft Foundry with ZDR configured, your prompts and outputs are now retained for 30 days. Consumer plans were already retained, so this is not about them. This lands specifically on the business customers who went out of their way to negotiate zero retention, which means it lands hardest on exactly the people who cared most about it.

Anthropic's justification is that retaining the data lets them catch misuse patterns: best-of-N jailbreaking, state-sponsored espionage, data extortion campaigns. The data deletes after 30 days unless it gets pulled into a safety investigation or a legal hold, access is limited to flagged conversations, and the access is logged in a tamper-proof way. As retention regimes go, it is not careless.

But look at the trade you are being handed. The guardrails already exist to stop misuse. The retention now exists to stop misuse. You are paying twice toward one safety goal: your legitimate work gets over-blocked at the classifier, and the work that does go through no longer enjoys the privacy floor you chose Claude for in the first place. A customer who selected zero retention made a deliberate risk decision, often for regulatory or contractual reasons. That decision got overridden by a model upgrade. If you have a ZDR agreement and Mythos-class models in your future, this is a conversation for your privacy and legal people this week, not a footnote.

## About that bypass

I will say the thing every security person reading this is already thinking, because it is true and because saying it is the point. A real-time content classifier sitting in front of a capable model is bypassable. Dedicate time and effort and I'm sure you could get around it, and the 1,000-hour bug bounty Anthropic ran before launch is proof they know it too.

The point of this post is that legitimate users should not have to fight a safety system to do legitimate work. The moment a working bypass is available, the subject gets changed. The story stops being "this control is not calibrated against defenders" and becomes "here is a recipe," and that recipe helps the actual adversaries far more than it helps the auditor who just wants to scan their own repo. The defenders are still reading the article when the attackers have already copied the payload.

## Where I landed after a day with it

Fable 5 is a super capable model, and on a clean task with no sensitive vocabulary it is a real step up. I am not telling you to avoid it. I am telling you to understand the shape of what you're using.

It's a frontier model with a safety system its own maker calls **overly conservative**, that will treat a chunk of legitimate security and life-sciences work as guilty until a weaker model proves otherwise. You bought it alongside a retention change that erased zero-retention for Mythos-class, aimed squarely at the business customers who chose Claude for that floor. And the version without the parking brake is real, it exists today, and it is behind an invite list you are probably not on.

If you run a business or are in any regulated environment: the retention change is your action item, not the refusals. Check whether your ZDR posture survives a Mythos-class rollout before someone enables it for you. The refusals are loud and annoying and Anthropic says they will fix them. The retention change is quiet and structural and it is already live.

The capability is not the story. The capability is excellent. The story is who Anthropic decided gets to use it for defense, and what everyone else gives up to be told no. A locksmith and a burglar carry the same picks. The difference is whose door it is, and a classifier that cannot tell them apart will always, eventually, lock out the person who owns the lock.

### Sources

*   [Claude Fable 5 and Claude Mythos 5 (Anthropic)](https://www.anthropic.com/news/claude-fable-5-mythos-5)
*   [Data retention practices for Mythos-class models (Claude Help Center)](https://support.claude.com/en/articles/15425996-data-retention-practices-for-mythos-class-models)
*   [Anthropic's 'safe' Mythos-class model won't answer questions about cybersecurity or biology (Business Insider)](https://www.businessinsider.com/anthropic-claude-fable-5-safeguards-block-requests-cybersecurity-biology-2026-6)
*   [Anthropic Launches Claude Fable 5: Mythos-Class AI With Cybersecurity Guardrails (SecurityWeek)](https://www.securityweek.com/anthropic-launches-claude-fable-5-mythos-class-ai-with-cybersecurity-guardrails/)
*   [Claude Fable 5 & Claude Mythos 5 System Card (Anthropic, PDF)](https://www-cdn.anthropic.com/d00db56fa754a1b115b6dd7cb2e3c342ee809620.pdf)
