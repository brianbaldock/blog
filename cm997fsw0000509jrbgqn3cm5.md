---
title: "MFA Beyond Push Notifications"
seoTitle: "MFA Solutions Beyond Push Notifications"
seoDescription: "Explore MFA beyond push notifications to enhance security with phishing-resistant methods like FIDO2, Passkeys, and compliant device strategies"
datePublished: 2025-04-09T00:42:21.312Z
cuid: cm997fsw0000509jrbgqn3cm5
slug: mfa-beyond-push-notifications
cover: https://cdn.hashnode.com/res/hashnode/image/upload/v1744159129762/a47b3075-566f-4cf0-912a-e1d9e95298b5.png
tags: mfa, entra-id, microsoft-authenticator-app

---

Yes, yet another blog article by me about multifactor authentication. In this one I want to focus on the different MFA methods and call out their differences and give you some ammunition to argue moving beyond standard push notifications! I’m going to focus on the following topics:

* Where basic push-notification MFA falls short.
    
* Why improvements like number matching help, but don’t fully solve the problem.
    
* Which methods are actually “phishing-resistant”.
    
* How Microsoft Entra MFA ties into device ‘trust’, and why “hybrid join” doesn’t automatically mean “secure device”.
    

## The problem with push MFA

### **The Problem with Push MFA**

Push-based MFA is that nice, convenient *method* where you get a notification on your phone: “Was this you signing in?” You tap “Approve” or “Deny,” and you’re in. It uses services like **Firebase** (Android) and **APNS** (iOS) to pop up that request in your authenticator app.

People tend to like this method because it’s fast and easy. No fuss.

Attackers also tend to like this method because they’ll just keep spamming you at all hours of the night until you tap “Approve” and they’re in. Or, they’ll do a little social engineering, “Hey, I’m so-and-so from IT, can you accept the prompt you’re getting please?” Let’s face it, when you’re in a hurry, you might just tap **Approve** by mistake or pure annoyance.

**Real-World Breach Examples**

* **Cisco (2022)**: Attackers hammered an employee’s phone with MFA prompts and impersonated IT on a phone call. Eventually, the user caved and hit *Approve*. *Boom!* Network compromised. \[Reference: [https://blog.talosintelligence.com/recent-cyber-attack/](https://blog.talosintelligence.com/recent-cyber-attack/)\]
    
* **Uber (2022)**: Same deal. An attacker texted the user, spammed them with prompts, eventually wearing them down. \[Reference: [https://www.wired.com/story/uber-hack-mfa-phishing/](https://www.wired.com/story/uber-hack-mfa-phishing/)\]
    

Push MFA is convenient, but way too reliant on *human judgment.* If someone can just pester or trick you into tapping *Approve*, they win.

## Number matching - A partial fix

A crafty phisher can call up the user, do a bit of social engineering and say something like, “Hey, please approve the following request, the confirmation code is 56,” or something along those lines. Basically, *number matching* reduces accidental approvals but still can’t stop a determined social engineer.

### **Phishing-Resistant MFA**: FIDO2, Passkeys, and Certificates

A truly phishing-resistant MFA method doesn’t rely on the user handing over a code or tapping a random approval prompt. Instead, it uses cryptographic tricks bound to the *real* site or service, so a fake site can’t fool it. Let’s check out the big kids in the neighborhood:

* **FIDO2 Security Keys**: USB or NFC “keys” that do public-key cryptography with each site. They’re awesome because they will *not* authenticate you with the wrong domain. So even if a user stumbles onto a phishing page, the key sees it’s not the real site and refuses to sign.
    
    * *SMB Reality Check:* Physical keys cost money and require some admin overhead. But many businesses find them worth it, especially for high-risk accounts. Employees can also use built-in authenticators on devices (like Windows Hello for Business) to skip buying physical keys.
        
* **Passkeys**: These wrap all the goodness of FIDO2 but sync across devices, so it’s more consumer-friendly. Microsoft, Google, Apple, and Amazon are jumping on the bandwagon. Adoption is climbing fast—people are tired of dealing with passwords. There *is* a bit of friction in setup, but once it’s running, people notice the convenience: no password, just a quick biometric or PIN.
    
* **Certificate-Based Authentication**: The user or device has a certificate that never leaves the system. The server checks it via a cryptographic challenge. This is phishing-resistant because you can’t phish someone into reading off a certificate. It’s all behind the scenes—no one-time codes to intercept. The downside? PKI can be complicated. Usually larger enterprises or government organizations go this route, but it’s an option for smaller businesses who need an ironclad approach (and can handle the overhead).
    

## But wait, you need more than just MFA

Security in depth is the best way to approach authentication. A layered approach will help you secure your environment hence why phishing-resistant MFA is so important but so is the compliant device tag. Let’s explore a scenario:

* An attacker using a proxy phishes a user and provides a link to what appears to the user as the M365 login page.
    
* The user performs the login and gets the MFA prompt, if they are using push MFA, TOTP or number matching, they get the same prompt on the login page and enter the details.
    
    * Meanwhile the attacker has grabbed a copy of the token.
        
* The user is redirected to the actual M365 login page or passed through to M365.
    
* Now the attacker takes the token and replays it on their device allowing them to login as the user.
    

How do we stop this? Simple: add the *Require Compliant Device* checkbox to the Conditional Access policy, or at least the *Require Hybrid Joined Device* checkbox. This doesn’t allow any access to your tenant resources if the device is not explicitly enrolled with your tenant. Maybe the attacker can capture the user’s token, but they can’t do anything with it unless they own *one of your devices*, which means they’re already in your network, which brings on a whole other set of problems you’d hopefully detect.

* **Hybrid Azure AD Joined**: Means a Windows device is both on-prem domain-joined *and* registered with Azure AD. Great for single sign-on and identity, but doesn’t guarantee the device is secure—it’s more of a static “corporate device” check.
    
* **Compliant Device (MDM)**: Means the device is enrolled in Intune (or another MDM) and meets your security rules (encryption, OS updates, no jailbreak, etc.). Intune continuously verifies compliance via a certificate-based attestation.
    

**Key Point**: *Hybrid join* alone won’t catch a laptop that’s loaded with malware or missing patches. *Compliance* via MDM is the stronger signal because it’s an active, policy-based check.

**Recommendation**: For sensitive access, don’t rely solely on *hybrid join.* Combine it with “require compliant device” so you know the machine is actually up to policy.

## Recommendations

1. **Don’t over-rely on Push MFA**
    
    It’s convenient but social engineering and phishing can break it. Number matching which is enabled by default for all Microsoft Authenticator users will reduce accidental approvals but realize that it’s not foolproof.
    
2. **Use phishing-resistant MFA where it matters most**
    
    Admins, executives, and anyone with access to critical data should have FIDO2 or passkeys. Even if you roll it out gradually, it’s worth the peace of mind.
    
3. **Consider going passwordless**
    
    Tools like Microsoft Authenticator phone sign-in or Windows Hello for Business are leaps ahead of memorized passwords. You’ll cut out password-based phishes entirely. Just remember that phone sign-in still relies on user caution; FIDO2 is more bulletproof.
    
4. **Embrace “Compliant Device”**
    
    Require that devices are enrolled and meet your security policies. That way, even if an attacker steals someone’s creds, they can’t just log in from any random device.
    
5. **Learn from the breaches**
    
    Set up user education to prevent “push fatigue” approvals, and get rid of weaker MFA factors (SMS, voice calls) as soon as you can.
    
6. **Keep watching the future**
    
    Passkeys are on a fast upward trend, and user acceptance is growing. It might feel daunting to jump on new tech right away, but these days it’s often less painful than you’d think. The payoff: better security *and* fewer password headaches.
    

Phishing resistant MFA isn’t just for Fortune 500s or government agencies anymore. If you’re running a business, these modern authentication methods could be the difference between a small incident and a massive breach. I hope this rundown helps you navigate the next steps in your MFA journey. Have questions or want to share your own experience? Let me know in the comments.