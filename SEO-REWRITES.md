# Title + description rewrites, blog.brianbaldock.net

Drafted 2026-08-31 from Bing Webmaster query data (183 days). NOT yet applied —
these are Brian's voice, he reviews before they ship.

## Method

Rewrites target queries the post ALREADY ranks for (position 4-10) but earns no
clicks on. Ranking is not the problem; the snippet is. Each title leads with the
searcher's own words rather than a clever phrase.

Noise excluded: ~2,038 impressions come from garbled `edge://management` strings
(people typing browser-internal URLs into the search bar). They can never click.
Real CTR on genuine queries is **6.61%**, not the 2.5% headline.

Constraint: titles ≤60 chars so Bing/Google don't truncate (the ` | Brian
Baldock` suffix is appended by BaseLayout, so the frontmatter title is the
budget). Descriptions 140-158 chars.

---

## 1. /edge-profile-pro-tips
10,395 impr · 229 clicks · 2.2% CTR · pos 8.2 — the biggest single opportunity

Ranks for: "how to manage multiple tenant accounts in microsoft 365" (902 impr,
9.8%), "microsoft edge business profile" (388 impr, **1.0%**), "edge work
profile" (146 impr, **0%**), "edge browser profiles for personal vs work use"
(59 impr, 16.9%).

The top query is about MANAGING MULTIPLE TENANTS. The current title leads with
"Mastering Edge Profiles" — the mechanism, not the job. The two highest-CTR
queries both use the words "work" and "personal".

CURRENT
  title: Mastering Edge Profiles for Microsoft 365 Management
  desc:  Explore how to use Edge profiles for efficient Microsoft 365 tenant
         management in this easy-to-follow guide.

PROPOSED
  title: Manage Multiple Microsoft 365 Tenants with Edge Profiles
  desc:  Juggling several Microsoft 365 tenants? Set up separate Edge profiles
         for work and personal accounts so you stop signing in and out all day.

Why: leads with "manage multiple Microsoft 365 tenants", the exact 902-impression
query. "Work and personal" picks up the 16.9% CTR phrasing. The description names
the pain (signing in and out) instead of promising a guide.

---

## 2. /deploying-local-ai-inference-with-vllm-and-chatui-in-docker
4,023 impr · 62 clicks · 1.5% CTR · pos 7.3 — worst CTR of the top five

Ranks for: "vllm docker" (387 impr, pos 7.9, **ZERO clicks**), "vllm docker
compose" (78 impr, 1.3%), "docker vllm" (51 impr, 2.0%).

Page one for "vllm docker" and earns nothing. Searchers want a working setup,
and the title reads like a conference talk.

CURRENT
  title: Deploying Local AI Inference with vLLM and ChatUI in Docker
  desc:  Learn how to deploy a self-hosted AI chatbot using vLLM and ChatUI in
         Docker with an NVIDIA GPU for local AI inference

PROPOSED
  title: Run vLLM in Docker: Self-Hosted LLM with a Chat UI
  desc:  A working vLLM Docker setup with ChatUI and an NVIDIA GPU: compose
         file, GPU passthrough, and the config that actually serves a model.

Why: "Run vLLM in Docker" matches the query almost verbatim. "Working" and
"compose file" signal a copyable artifact, which is what someone typing "vllm
docker compose" wants. Drops "Local AI Inference", which nobody searches for.

---

## 3. /win11arm-on-macos
3,928 impr · 107 clicks · 2.7% CTR · pos 7.7

Ranks for: "silicon graphics for windows" (73 impr, 0%), "vmware fusion tools
windows 11 arm" (40 impr, 2.5%), "vmware arm64" (38 impr, 0%).

Queries are concrete and tool-named. The title is the opposite: "Next-Level
Virtualization" is a phrase no one has ever typed into a search box.

CURRENT
  title: Next-Level Virtualization: Windows 11 ARM64 Meets Apple Silicon
  desc:  Optimize Win11 ARM64 on Apple Silicon using VMware Fusion: Guide for
         setup, VHDX to VMDK conversion, Homebrew, QEMU, and VMware Tools
         installation

PROPOSED
  title: Windows 11 ARM64 on Apple Silicon with VMware Fusion
  desc:  Install Windows 11 ARM64 on an M-series Mac using VMware Fusion:
         VHDX to VMDK conversion, QEMU via Homebrew, and getting VMware Tools
         to install cleanly.

Why: every word is a term people search. "VMware Fusion" appears in the title
where it was previously buried. "M-series Mac" catches how people describe their
own hardware. Cuts the marketing opener entirely.

---

## 4. /lightningcopilot-salesforce-meets-copilotstudio
3,309 impr · 69 clicks · 2.1% CTR · pos 6.5

Ranks for: "salesforce copilot connector" (55 impr, **0%**), "copilot studio
salesforce connector" (55 impr, 1.8%), "copilot studio salesforce" (45 impr,
13.3%).

The 105-character title truncates badly in results, and the invented product
name "LightningCopilot" leads. Nobody searches for it.

CURRENT
  title: LightningCopilot - Integrating Microsoft Copilot Studio into
         Salesforce Lightning (LWC) with Entra ID SSO   [105 chars — truncated]
  desc:  Embedding a Microsoft Copilot Studio agent inside Salesforce Lightning
         (LWC) with full Entra ID SSO, MSAL auth, and a token flow that
         survives Locker.

PROPOSED
  title: Embed Copilot Studio in Salesforce with Entra ID SSO
  desc:  Put a Copilot Studio agent inside Salesforce Lightning (LWC) with
         Entra ID single sign-on: MSAL auth, and a token flow that survives
         Locker Service.

Why: 52 chars, no truncation. Leads with "Copilot Studio" + "Salesforce", the
two terms in every ranking query. The clever product name moves into the body
where it belongs. Description keeps the Locker detail, which is the genuinely
hard part and the reason to click.

---

## 5. /proxies-and-defender-for-endpoint
3,165 impr · 97 clicks · 3.1% CTR · pos 4.8 — best position of the five

Ranks for: "defender for endpoint proxy" (111 impr, 7.2%), "mde proxy" (108
impr, 0.9%), "defender proxy" (72 impr, 1.4%), "mde proxy configuration" (45
impr, 2.2%).

Title is fine. The DESCRIPTION is the defect: it opens "For my inaugural blog
article on my official blog, I wanted to share my previous three blog
articles..." — that is the search snippet on 3,165 impressions. It describes the
post's publishing history rather than what the reader gets.

CURRENT
  title: Proxies and Defender for Endpoint
  desc:  For my inaugural blog article on my official blog, I wanted to share
         my previous three blog articles (published on Microsoft official
         blogs) covering an...

PROPOSED
  title: Defender for Endpoint Behind a Proxy: Configuration Guide
  desc:  How to configure Microsoft Defender for Endpoint behind a proxy:
         registry and netsh options, the URLs MDE needs reachable, and how to
         verify connectivity.

Why: ranking at position 4.8 already, so this is purely a snippet fix and the
cheapest win of the five. "MDE" stays out of the title (Bing already maps it)
but the description earns the "mde proxy configuration" query.

---

## Expected effect

Honest version: CTR changes on already-ranking pages are the most reliable SEO
lever there is, but the size is unpredictable. Moving these five from ~2.4% to
~4% average would be roughly +400 clicks over a comparable 183-day window.

Measure it, do not assume it. Baseline captured 2026-08-31:
  total 27,304 impressions / 671 clicks / 2.46% CTR (all pages, incl. noise)
  real-query CTR 6.61%
Re-run ~/.hermes/scripts/bing_post_targets.py in 3-4 weeks and compare.

Caveat worth keeping: Bing rewrites snippets when it thinks it knows better, and
titles are a hint, not a contract. Some of these will not take.
