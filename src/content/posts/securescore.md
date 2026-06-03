---
title: "Wipe the line, raise the score"
description: "Enhance security with Microsoft Secure Score: a prioritized checklist for continuous improvements in identity, devices, apps, and data"
pubDate: "2025-08-11T21:17:36.662Z"
cover: "/images/securescore/5980c958-fc4f-4d08-bd6e-6131a250ae2f.png"
coverAlt: "Cover image for Wipe the line, raise the score"
tags:
  - "zero-trust"
  - "zero-trust-security"
  - "microsoft-secure-score"
  - "security-kitchen"
slug: "securescore"
---

I used to work in restaurants and we had a saying, “**there is always something to clean.**” If you had a spare minute, you were cleaning the line, sweeping, mopping etc. Not glamorous work; absolutely essential. Security is the same. There is always something to improve; otherwise entropy wins. Microsoft Secure Score gives you the list. Your job is building a habit of using it.

<div data-node-type="callout">
<div data-node-type="callout-emoji">💬</div>
<div data-node-type="callout-text"><em>There is </em><strong><em>always</em></strong><em> something to clean.</em></div>
</div>

## What Secure Score actually is

Secure Score pulls together recommended security improvements across Microsoft 365 into one place with a point-based system. Each recommendation tells you what to do, why it matters, and how many points you’ll earn by completing it. Think of it as a prioritized sanitation checklist for identity, devices, apps, and data.

The number of points isn’t the goal. The real value is in the visible breadcrumb trail that proves you’re making continuous improvements. It’s your “*cleaning the line.*”

Check it out here (*you will need the right role to view it)*: [Microsoft Secure Score](https://security.microsoft.com/exposure-secure-score?viewid=overview)

## Turn Secure Score into a living backlog

Treat every Secure Score recommendation like a task in your security backlog.

* Pull items weekly into your work queue.
    
* Filter them by category: Identity, Devices, Apps, Data
    
* Label them as Quick Clean, Hot Clean, Deep Clean:
    
    * **Quick Clean:** low-risk configuration fixes; like wiping down a station on the line during a lull.
        
    * **Hot Clean:** high impact controls that attackers target first; like sanitizing the cutting boards, washing the hoods.
        
    * **Deep Clean:** structural changes that require planning; like pulling out appliances to clean behind them.
        
* Use your existing work management tool. If you are Microsoft-heavy, a Planner or Azure Boards view works well so Product, Infra, and SecOps can see the same queue.
    

## Prioritize like a pro

Do not chase easy points first. Use a simple triage that fits enterprise reality.

* **Impact:** How much real risk it cuts given how attackers operate today. Use exposure management and define critical devices to map attack paths. ([Microsoft Security Exposure Management (MSEM) Attack Paths](https://security.microsoft.com/attack-paths))
    
* **Effort:** People hours, complexity, approvals.
    
* **Dependencies:** Does something else need to happen first?
    
* **Blast radius:** Who could be affected if it goes wrong.
    
* **Regulatory tie-in:** Does it map to controls that auditors will ask about.
    

Score each on a 1 to 3 scale. Hot Clean items with high impact and low to medium effort go to the top.

Examples that usually pay off early:

* Require phishing-resistant MFA for admins; enforce conditional access for high risk sign-ins.
    
* Disable legacy auth where feasible.
    
* Safe Links and Safe Attachments policies.
    
* Attack surface reduction rules in audit, then enforce.
    
* Device compliance policies with a minimum OS and encryption.
    

## Assign owners; set a cadence; show progress

This is where teams succeed or stall.

* **Owner per control:** Security writes the “why”, the platform owner runs the change, and the helpdesk knows the support path.
    
* **Weekly working sessions:** 30 to 45 minutes. Review last week’s moves, pull two to five new items, unblock dependencies.
    
* **Monthly showcase:** One slide that tells a story. Current score, what changed, what risk you removed, and what is next.
    

Tie it to culture, if we use Microsoft Cultural Attributes as an example ([Microsoft cultural attributes](https://careers.microsoft.com/v2/global/en/culture)): Growth Mindset means you’re iterating; Customer Obsession means you protect users while uplifting controls; One Microsoft means SecOps, Identity, Endpoint and Applications ship together.

## Automate the easy wins

Use policy and configuration at scale so hygiene stays done.

* Where possible use baseline policies. Conditional access templates in Entra ID. Security Baselines in Intune.
    
* Configuration as code for repeatability where possible; even simple scripts tracked in a repo beat one-off portal clicks.
    
* Alerting for drift. If a control falls out of compliance, it reopens in your backlog automatically.
    
* Document exceptions with an owner and an expiry date. Exceptions without an end date become permanent debt.
    

## Report upwards with context, not just a number

Executives want to know if the business is safer this month than last.

* Show trend: last quarter, last month, today.
    
* Translate actions to attack friction. Use wording like: *“Blocking legacy auth removed password spray success paths for X% of accounts.”*
    
* Map to frameworks and programs: [What is Zero Trust?](https://learn.microsoft.com/en-us/security/zero-trust/zero-trust-overview) | [Zero Trust Assessment & Workshop](https://microsoft.github.io/zerotrustassessment/)
    
* Keep a small “narrative log” of notable changes and why you chose them.
    

## Common pitfalls

* **Point chasing:** Hitting a target score without reducing meaningful risk.
    
* **Big-bang changes:** Shipping ten identity policies at once and flooding the helpdesk.
    
* **No rollback plan:** Always know how to revert a control safely.
    
* **Unowned exceptions:** If everyone owns it, no one owns it.
    
* **Stale backlog:** If recommendations sit untouched for 90 days, re-evaluate or explicitly accept the risk (at this point you already have).
    

## A simple Microsoft Secure Score 30-60-90 starter plan

![](/images/securescore/58b1c956-cacf-4b62-95cf-bb85bd9c5f4e.png)

## Days 1-30 “Set the system”

* Stand up one visible backlog for Secure Score in Planner or Azure Boards; tag items as Quick Clean, Hot Clean, or Deep Clean.
    
* Define your triage rubric: Impact, Effort, Dependencies, Blast radius, Regulatory tie-in; simple scoring.
    
* Lock the cadence: a weekly 30 or 45 minute working session with clear entry and exit criteria; clear entry and exit criteria; one owner per item with a rollback checklist.
    
* Baseline metrics and rules: score by pillar, average days to close, exception policy with owner and expiry.
    

## Days 31-60 “Run the loop, make it boring”

* Work the cadence; move a steady batch from proposed to validated to done.
    
* Apply the rubric before pulling anything; no point chasing, document user impact and the helpdesk path.
    
* Add drift checks and auto-reopen on deviation; track rollbacks and lessons learned.
    
* Publish a monthly showcase with trend, risks reduced, and next moves; close or explicitly accept items that sit for 90 days.
    

## Days 61-90 “Scale it and age it”

* Break Deep Clean items into small, testable steps; add a simple RACI so accountability is clear.
    
* Map changes to Zero Trust pillars and Secure Future Initiative outcomes; include this view in the showcase.
    
* Formalize exception reviews; auto-notify owners 2 weeks before expiry, renew or remove with justification.
    
* Ship v1.0 of the playbook: intake, triage, change, validate, rollback, report; set quarterly objectives for the backlog.
    

## Closing

In the kitchen, you never stand still because there is always something to clean. In security, there is always something to **improve**. Secure Score is the list on the cooler door. Work it daily, celebrate small wins, and keep moving!
