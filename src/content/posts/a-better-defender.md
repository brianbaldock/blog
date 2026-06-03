---
title: "How breaking in made me a better defender"
description: "Learn how offensive security techniques can enhance your defensive skills by shifting your perspective and understanding attacker strategies"
pubDate: "2025-07-07T21:37:39.233Z"
cover: "/images/a-better-defender/527e2932-9ed8-4b60-9a91-7e23e6fc9102.png"
coverAlt: "Cover image for How breaking in made me a better defender"
tags:
  - "hacking"
  - "pentesting"
  - "cybersecurity-1"
slug: "a-better-defender"
---

## Why I started pen testing

<div data-node-type="callout">
<div data-node-type="callout-emoji">📖</div>
<div data-node-type="callout-text"><strong>TL;DR:</strong> After years as a defender, switching to offensive security taught me crucial lessons: attackers set the tempo, simplicity often trumps complexity, and thinking sideways reveals hidden gaps. Every defender benefits from thinking (and safely acting) like an attacker.</div>
</div>

I’ve spent over a decade helping customers harden environments, deploy secure solutions, and chase down alerts. But it wasn’t until I started trying to break into systems myself that I really began to understand how attackers think, and honestly, it gave me a headache.

I’m not trying to be some elite super hacker. At best, I’m a proud script kiddie still learning the ropes. The real pros out there see the world sideways; they think in crooked lines and find gaps I wouldn’t have considered. It’s like that classic Abraham Wald story: the places without bullet holes are what really bring the plane down. That analogy fits security a little too well.

I’ve been using my homelab as a safe playground to simulate attacks and sharpen my thinking. There’s something humbling about exploiting your own environment and realizing how many assumptions you’ve made as a defender. I’m also a huge fan of the [Hack The Box](https://hackthebox.com) platform. Shoutout to those folks for keeping it real and **challenging**.

So, while I’m still early in my offensive journey, I’ve already picked up a few lessons that completely changed how I think about defense. Here are some of the biggest ones so far.

## Lesson 1: That moment I got my first reverse shell

The first time I landed a reverse shell honestly blew my mind. Before that moment, I'd spent my entire career locking down systems, hardening environments, and chasing security alerts. Flipping roles and becoming the attacker (even ethically in a controlled setting) completely changed my perspective.

I still remember it clearly. I set up my listener, launched a PowerShell payload on the target, and almost instantly saw a new prompt appear. Just like that, I was inside the Windows machine.

Seeing the command prompt switch and reveal the target’s hostname was eye-opening. It felt like discovering a hidden world beneath a familiar surface, similar to the first time you realize there's an entire community dedicated to geocaching right under your nose. I'd spent years strengthening barriers without fully appreciating the creativity attackers use to bypass them.

Two big insights came from that experience:

1. Attackers always have the initiative. Defenders usually react, plugging gaps as threats appear. Tools like [Microsoft Security Exposure Management](https://learn.microsoft.com/en-us/security-exposure-management/microsoft-security-exposure-management) help shift defenders to a more proactive stance, but attackers still control the tempo. Recognizing this fundamentally changed my approach to security.
    
2. Simple techniques remain highly effective. Before getting hands-on with ethical hacking, I thought attackers mainly relied on sophisticated exploits that grab headlines. While advanced threats exist, basic attacks (like phishing emails that deliver reverse shell payload) are incredibly common. Solid foundational security measures are as crucial as ever in 2025.
    

Breaking into my first system, even ethically, taught me more in a few hours than months of defensive and sysadmin work ever did. To defend effectively, you have to deeply understand how attackers think, operate, and exploit vulnerabilities.

## Lesson 2: Overlooking the obvious

Early on in my offensive journey, one moment stands out clearly. I was deep into a Hack The Box challenge, convinced there had to be some complex exploit hidden beneath the surface. Hours later, I realized I'd completely overlooked checking basic file permissions.

When I finally looped back, the vulnerability was painfully obvious—misconfigured permissions on a sensitive directory handed me immediate access. Oops.

Trust your process, cover the basics thoroughly, and **don’t** **assume** complexity. Skipping the obvious steps only **costs you time**.

## Lesson 3: Thinking sideways (Attackers don’t play by your rules)

One of my favorite "aha" moments came from a box that initially seemed impossible. I was convinced the vulnerability had to be web-based because everything pointed in that direction. After exhausting every possible web exploit, I took a break, frustrated. It turned out the entry point wasn't web at all; it was an outdated, seemingly harmless print service that I'd dismissed early on.

That pivot taught me something critical: attackers don’t care how things “should” work. They exploit how they “actually” work. If defenders only look at what's typical or documented, we leave blind spots wide open.

So, forget your assumptions. Security is about expecting the unexpected. To be effective, defenders must learn to look at their environments with fresh eyes (and think sideways) just like the attackers do.

## Bonus: What I changed in my own environment

After spending time trying to break into my own systems, I quickly saw where my blind spots were, and immediately got to work plugging them. Here are some practical changes I've made to strengthen my own security posture:

* **Firmware Updates**: Let's be honest, keeping firmware up to date isn't fun or flashy, but outdated firmware can be a goldmine for attackers. Now, I make it a routine to regularly check and update firmware on everything from routers and switches to IP cameras and printers.
    
* **Isolating IoT Devices**: IoT devices are notoriously sketchy when it comes to security. My smart home gear is now isolated on its own VLAN, keeping these potentially vulnerable devices separated from my main network.
    
* **VLAN Segmentation**: Beyond IoT, I’ve segmented my network into different VLANs, creating clear boundaries between sensitive data, regular browsing, and guest access. It might feel a little paranoid at first, but compartmentalizing access drastically reduces lateral movement opportunities for attackers.
    
* **Zero Trust Mindset**: Probably the biggest mindset shift has been embracing Zero Trust principles. Instead of assuming internal traffic is safe, I now operate as if every device and user is potentially compromised. It takes discipline, but it's worth it.
    

Taking these steps not only improved my security but gave me greater peace of mind. Nothing sharpens your defensive instincts quite like actively testing your own limits.

## Final Thoughts: Why every defender should break in (safely)

If you've spent your career on the defensive side like I did, switching perspectives can feel intimidating, but it's essential. Understanding attackers requires thinking like one. And there's no substitute for hands-on experience.

By safely and ethically exploring offensive security techniques, you will:

* Gain practical insights that theory alone can't teach.
    
* Recognize weak spots in your environment that you might have overlooked.
    
* Develop empathy and respect for the creativity and persistence attackers bring to their craft.
    

Even basic, controlled exercises (like those available on platforms such as [Hack The Box](https://www.hackthebox.com/) or [TryHackMe](https://tryhackme.com/)) can profoundly change your approach. You don’t need to become a world-class pen tester but spending some time on the other side can sharpen your defensive instincts and make your security efforts more effective.

**Every defender benefits from knowing how to break in safely. So give it a try, your environment (and your skills) will thank you.**
