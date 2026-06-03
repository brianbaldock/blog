---
title: "When \"Ethical AI\" cites ghosts"
description: "Report shows fake sources in ethical AI study; highlights AI hallucinations and the need to verify AI-generated content"
pubDate: "2025-09-19T04:44:32.976Z"
cover: "/images/when-ethical-ai-cites-ghosts/55a87850-3625-4118-917f-4b46dd324278.png"
coverAlt: "Cover image for When \"Ethical AI\" cites ghosts"
tags:
  - "ai"
  - "ethical-ai"
slug: "when-ethical-ai-cites-ghosts"
---

If you want a real-world example of why AI hallucinations and human overreliance matter, check out the story about an education “ethical AI” report with more than 15 fake sources. Ouch. That is exactly what recent research has been warning us about: when people co-create with AI, plausible nonsense can slip in, and our brains are a little too happy to let it slide.

<div data-node-type="callout">
<div data-node-type="callout-emoji">🔗</div>
<div data-node-type="callout-text"><a target="_self" rel="noopener noreferrer nofollow" href="https://arstechnica.com/ai/2025/09/education-report-calling-for-ethical-ai-use-contains-over-15-fake-sources/" style="pointer-events: none">Ars Technica - Education report calling for ethical AI use contains over 15 fake sources</a></div>
</div>

## The research, minus the lab coat

An IBM team studied how people use large language models to write content that is supposed to be tied to real documents. Picture a simple setup; folks are asked to answer questions using a source doc, and an AI offers “helpful” suggestions along the way. Sometimes the AI’s answer is faithful to the source, sometimes it quietly makes stuff up. They also tried a few speed bumps to slow people down and make them think first:

* **Answer first**; write your own response before seeing the AI.
    
* **Read first**; skim the source doc before you start.
    
* **Highlight**; show which parts of the AI’s answer actually line up with the source.
    

What shook out matches what most of us have seen in the wild:

* **When the AI invents facts, quality drops.** No surprise; if the suggestion is off, the end result gets worse.
    
* **People still lean on bad AI, often by “topping up” their own answer with AI text.** I’ve done this, you’ve done this: you write something correct, then paste in a smart-sounding line that quietly disagrees with you. Now you have a confident, wrong paragraph.
    
* **Those speed bumps help mindset, but they are not magic.** They nudge people to think, they do not erase bad inputs.
    
* **Three simple checks matter most: faithfulness to the source, factual accuracy, and completeness.** If your response fails any one of those, it should not ship.
    

**Bottom line**; when the model makes things up, humans can make it worse by trusting or blending the output. The Ars Technica piece is the public version of that lab result.

## The public face‑plant

That education report called for “ethical AI”, yet the bibliography had ghosts; over a dozen citations that do not exist. Eighteen months of work, still shipped with phantom sources. That is the “paste the smart sentence and keep moving” problem, just at report scale. Nobody stopped to ask the only question that matters: “where did this claim come from, and can I **open** it?”

## Why we fall for it

A few human things get in the way:

* **Anchoring, and saving brain cycles.** If you see the AI answer first, it *frames your thinking*. Even if you write first, you may paste in a clever line to save time.
    
* **Plausibility beats provenance.** Smooth, on-topic text feels accurate at a glance. Without a hard source check, fluent hallucinations slide through. And, **“I used less AI on this one”** is not the same as, **“I verified the facts.”**
    

## A practical playbook so “ethical AI” stops citing ghosts

Given that report, everything around it, and the research, it’s time for a playbook. Here are some ideas:

1. **No source, no ship.** If a claim has no link or citation you can actually open and verify, it does not publish. Use three dials to review: faithfulness, accuracy, completeness. Fail one, it fails all.
    
2. **Answer first, compare second, justify third.** Capture a human draft before **any** AI suggestion, then show the AI response side-by-side **with** citation checks. Add one required sentence: “what changed after seeing AI, and why.” Not every org can build this workflow today, but even a lightweight version in Word or Copilot helps (maybe an Agent?).
    
3. **Automate the boring stuff.**
    
    * Resolve every reference; flag dead links and junky journals.
        
    * Run a basic overlap check between claims and sources; even a highlight-style view helps reviewers see what is actually grounded.
        
4. **Block on grounding when confidence is low.** If the system cannot point to real evidence, kick it to a human. Do not allow publish.
    
5. **Catch the “append the AI” bug.** Lint for contradictions between the human draft and pasted AI text. If they disagree, stop and reconcile.
    
6. **Person-in-the-Loop for real.** Make escalation a main path, not a side door. If a source cannot be verified, a human decides: fix it or cut it. Log that decision.
    
7. **Spot-check after publish.** Sample a few items weekly against the same rubric. Celebrate “caught in review” saves, not just volume shipped.
    

## Bring it home

The IBM study shows how easily hallucinations and overreliance can drag quality down in AI-assisted writing. The “ethical AI” report shows the reputational blast radius when that slips into production. If we want AI to help us move faster without burning trust, we need hard gates for provenance, simple checks humans can actually use, and workflows that make the right thing the easy thing. Otherwise we will keep shipping polished documents that cite ghosts 👻.

### References

* Ashktorab, Desmond, Pan, Johnson, Brachman, Dugan, Danilevsky, Geyer. *Emerging Reliance Behaviors in Human‑AI Content Grounded Data Generation: The Role of Cognitive Forcing Functions and Hallucinations*. CHIWORK ’25. Key findings summarized above; see *Figure 5*, *Table 1*, *Table 4*, and *Table 5* for the results I reference. [https://arxiv.org/pdf/2409.08937v2](https://arxiv.org/pdf/2409.08937v2)
    
* Edwards, Ars Technica. *Education report calling for ethical AI use contains over 15 fake sources*. Summary and context for the Newfoundland and Labrador report. [https://arstechnica.com/ai/2025/09/education-report-calling-for-ethical-ai-use-contains-over-15-fake-sources/](https://arstechnica.com/ai/2025/09/education-report-calling-for-ethical-ai-use-contains-over-15-fake-sources/)
