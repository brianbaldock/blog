---
title: "How Small and Medium Businesses Can Boost Cybersecurity"
description: "Boost SMB cybersecurity with MFA, Microsoft Defender, Microsoft 365, Entra ID, reverse proxies, and SOC providers. Protect without breaking the bank"
pubDate: "2024-07-14T05:49:45.399Z"
cover: "/images/how-small-and-medium-businesses-can-boost-cybersecurity/3bd5b8ec-898e-45c8-bf8d-5d9560413108.webp"
coverAlt: "Cover image for How Small and Medium Businesses Can Boost Cybersecurity"
tags:
  - "cybersecurity-1"
  - "microsoft-defender"
  - "microsoft-entra-id"
  - "mdi"
  - "smbs"
  - "microsoft-defender-for-office-365"
  - "microsoft-defender-for-identity"
  - "mdo"
  - "entra-id-p2"
slug: "how-small-and-medium-businesses-can-boost-cybersecurity"
---

> **TLDR: A recipe for Success for SMB Security**
> 
> In today's complex threat landscape, small and medium-sized businesses (SMBs) can protect themselves effectively without breaking the bank. Here’s a quick recipe for success:
> 
> 1. **Enable Multi-Factor Authentication (MFA)**: Start with implementing MFA across all applications, with your crown jewels protected immediately to significantly reduce unauthorized access.
>     
> 2. **Utilize Microsoft Defender for Office 365 P1**: Enhance your email protection against phishing, malware, and ransomware attacks.
>     
> 3. **Upgrade to Microsoft 365 Business Premium**: Get comprehensive protection, including Microsoft Defender for Business and Intune for device management.
>     
> 4. **Deploy Microsoft Defender for Business Servers**: Extend protection to your on-premises servers.
>     
> 5. **Implement Microsoft Defender for Identity**: Detect and investigate advanced threats targeting your on-premises Active Directory.
>     
> 6. **Invest in Entra ID P2**: For advanced identity and access management, including Risk-Based Conditional Access and Privileged Identity Management (PIM).
>     
> 7. **Secure Public-Facing Servers with a Reverse Proxy**: Protect your public-facing services by hiding your internal network structure and blocking malicious traffic.
>     
> 8. **Consider Hiring a Security Operations Center (SOC) Provider**: Leverage professional expertise to manage your security infrastructure effectively.
>     
> 
> **Now on to the full article below:**

### Soapbox speech intro

Having spent years in the cybersecurity field, I've seen firsthand the challenges SMBs face. If you're a small or medium business, this article is written for you, in hopes that you find it useful to navigate these threats with practical, cost-effective solutions. I write this with the hope that these solutions will help you secure your business from ransomware and the increasingly persistent threat landscape. I've seen so many SMBs brought to their knees due to completely avoidable ransomware attacks.

There needs to be a shift in mindset. IT and cybersecurity should not be seen as necessary evils but as ways to drive your business forward. The persistent threat landscape is continuously expanding and, though this seems daunting, the products and best practices I discuss below should help you get started on securing your business and preventing the next eventual loss of productivity. Think of this as an investment in your business, not an expense.

# What's all this then?

You don't need me to tell you that today's threat landscape is more overwhelming than ever. Recent news clearly backs that up. While we often hear about large enterprise breaches, we can't forget that small and medium-sized businesses are increasingly in the crosshairs. As an SMB, you might feel overwhelmed by the sheer volume and complexity of threats, but fear not. With the right mix of practices, user education, and Microsoft technologies, you can bolster your defenses without breaking the bank. Let's dive into how you can strategically use these tools to secure your organization effectively.

### Analyzing User Needs and Smart Licensing

The first step in creating a robust security strategy is understanding the unique needs of each user type in your organization. This isn't about a one-size-fits-all solution but rather a tailored approach that ensures you're not overspending on unnecessary features. By carefully analyzing the roles and requirements of your users, you can mix and match licenses to fit their specific needs. For example, frontline workers (assembly line, front of house, etc.) may only need basic protection, while your IT and management staff require more advanced threat detection and identity management features.

### Flexible Licensing Options

One significant advantage of Microsoft's licensing is its flexibility. According to Microsoft's licensing documentation, you can purchase licenses as needed and cancel them mid-year, receiving refunds for the remaining months. This flexibility allows you to adjust your license sizing dynamically as your organization's needs change, ensuring you only pay for what you use. This can be particularly useful for SMBs with rapidly shifting staffing levels or the need to scale operations up or down throughout the year.

## Key Microsoft Security Products for SMBs

### Microsoft Defender for Office 365 P1:

Let's start with the basics—email protection beyond the default Exchange Online Protection. Email, for better or worse, remains the primary attack vector for many threats, mainly due to the human factor. While nothing beats a solid cybersecurity training program for employees, the right solution can significantly bolster your defenses. Phishing, malware, ransomware—all common threats that heavily rely on email. Microsoft Defender for Office 365 P1 offers comprehensive protection against these threats, augmenting the already capable Exchange Online Protection included with any Exchange Online product SKU. Think of Microsoft Defender for Office 365 P1 as Exchange Online Protection on steroids.

You might read this as a Microsoft promotion, but here's the thing: this stuff works, and I've seen it time and time again. Let me explain how and why it works so well. Safe Links and Safe Attachments are part of this license, providing time-of-arrival detonation of attachments, detecting malicious links, and preventing users from clicking on them. Enhancing EOP with advanced phishing detection and machine learning, it effectively detects and prevents phishing or spoofing attempts. Pairing this technology with a robust cybersecurity training program can significantly reduce the risk of email-based attacks.

### Microsoft 365 Business Premium

This is the pricier license SKU for SMB customers, but for good reason. It includes Microsoft Defender for Business, essentially a trimmed-down version of Microsoft Defender for Endpoint P1 with added features like Attack Surface Reduction (a must, I might add) and streamlined automations that enhance time to value. If you're already using Microsoft 365 Business Standard with additional licenses for other product features, this is a step into a consolidated cost. Plus, this product includes the entire business and collaboration suite, as well as Intune for device management and modernization (which we'll dive into later), making it a definite must-have.

Defender for Business is especially effective against ransomware attacks. It detects and blocks suspicious activities on endpoints and, using attack surface reduction, prevents ransomware from executing. No solution is a be-all-end-all, and anyone claiming otherwise is lying. You still need a robust backup solution to bolster your defenses and implement best practices. A backup isn't a good backup until it's been tested. Additionally, ensure your software is up-to-date and educate employees on recognizing ransomware attempts.

### Microsoft Defender for Business Servers

Building on Microsoft 365 Business Premium, which covers workstations and users, what about the servers? If your business has been around for a while, you likely have a server somewhere in your building providing basic directory services or maybe a SQL server for some ERP. These servers need protection just as much as the users and their workstations. That's where Defender for Business Servers comes into play. This tool extends the workstation protection of Defender for Business to your servers, adding attack surface reduction and advanced AV and ransomware protection.

To enhance the overall security of your servers alongside Defender for Business Servers, follow best practices for server protection. Restrict access to servers to only those who need it, even if you have only one. Least-privileged access is a core tenet of Zero Trust, and no organization is too small to adopt this approach. Keep those servers up-to-date and continuously monitor server logs for unusual activities (I'll talk about a solution that helps with this shortly).

Network segmentation is crucial! Your workstations and servers should not be in the same network segment, just like your guest Wi-Fi should be segmented. Workstations accessing the server(s) should only be able to access the specific ports of the services they require and no more. This also applies to Wi-Fi, printers, IoT, etc. This layered approach ensures that your servers remain secure from both external and internal threats.

### Microsoft Defender for Identity

If your organization, like many others, has an on-premises footprint, Defender for Identity is crucial. This tool helps detect and investigate advanced threats, compromised identities, and malicious insider actions targeting your on-premises Active Directory. It's particularly useful against persistence attacks, where an attacker maintains long-term access to a system.

One common persistence attack is Pass-the-Hash, where an attacker steals hashed credentials and uses them to authenticate as the original user without needing to know the actual password. Another notorious attack is the Golden Ticket, where an attacker compromises the Kerberos Ticket Granting Ticket (TGT) and gains unrestricted access to your network for an indefinite period.

To enhance the effectiveness of Defender for Identity in mitigating these attacks, regularly review user access levels, and immediately revoke access for former employees (better yet, automate this process). Continuously monitor for unusual login patterns and behaviors that might indicate these types of attacks. Implementing these steps helps ensure that your network remains secure from persistent threats.

Additionally, enforce strong authentication mechanisms, like multi-factor authentication, to make it harder for attackers to leverage stolen credentials. Regularly update and patch your systems to close any vulnerabilities that attackers might exploit. This layered approach, combined with the robust capabilities of Defender for Identity, fortifies your defenses against sophisticated threats like Pass-the-Hash and Golden Ticket attacks.

### Microsoft Entra ID P2:

For those with a bit more budget, Entra ID P2 includes Defender for Identity and offers advanced identity protection features. When paired with Business Premium, it provides a comprehensive identity and access management solution, ideal for SMBs looking to significantly enhance their security posture. This tool is excellent against credential-based attacks, offering features like Risk-Based Conditional Access policies. These policies detect user risk (e.g., leaked credentials) or sign-in risk (e.g., machine learning algorithms analyzing sign-in attempts to determine if they are legitimate or suspicious). A common example is "impossible travel," where a user logs in from a familiar IP location and then, impossibly, from another country just five minutes later.

To make the most of Entra ID P2, implement best practices like enforcing strong password policies and using multi-factor authentication (MFA) wherever possible. Avoid prompt exhaustion by using logical Conditional Access policies to prevent overuse of MFA prompts. Conduct regular security audits to stay ahead of potential vulnerabilities. Entra ID P2 also includes Privileged Identity Management (PIM), allowing you to define which accounts can "step-up" into more secure roles within Entra ID for management purposes. This eliminates the need for IT staff to maintain multiple accounts.

This proactive approach, combined with the robust features of Entra ID P2, helps ensure that your systems are safeguarded against credential-based attacks. By leveraging advanced identity protection features and best practices, SMBs can significantly improve their overall security posture and protect against sophisticated threats.

### Securing Public-Facing Servers with a Reverse Proxy

Public-facing servers are exactly what they sound like—servers accessible to the public. This could be your public website hosted internally to cut down on costs, your Exchange on-premises, or any number of other local services offered to users. These servers are prime targets for attackers due to their accessibility. Implementing a reverse proxy can significantly enhance your security by hiding your internal network structure and providing an additional layer of defense. A reverse proxy acts as an intermediary for requests from clients seeking resources from your internal servers. It can filter and block malicious traffic, protecting your servers from direct attack.

A reverse proxy can thwart various types of attacks, including Distributed Denial of Service (DDoS) attacks, by distributing the load and blocking excessive requests. It also helps prevent SQL injection attacks by inspecting incoming queries and blocking malicious ones. Additionally, a reverse proxy can protect against Cross-Site Scripting (XSS) by sanitizing inputs and blocking harmful scripts.

For optimal security, place your reverse proxy in a DMZ VLAN or a separate network segment. This setup ensures that even if the reverse proxy is compromised, your internal network remains protected. Best practices for securing any public-facing server are regular updates, regular vulnerability assessments, strict access controls, and network segmentation.

### Implementing Multi-Factor Authentication

Multi-factor authentication (MFA) is the number one priority and a must-have for any modern security strategy. By requiring multiple forms of verification, MFA significantly reduces the risk of unauthorized access. Implementing MFA across all applications ensures that even if an attacker compromises a password, they won't easily gain access to your systems. If you're thinking about implementing MFA in your organization, which you should have done yesterday, check out my other article on the Microsoft Authenticator app.

MFA impacts users, who are humans, and humans aren't always fans of change. This effort requires careful change management and thorough user education. However, we're at a point where the prevalence of MFA will only increase, even across personal apps. It's essential to communicate the importance of MFA to your users, highlighting how it protects both their personal and professional information.

To make the implementation smoother, start with user education. Educate your users about the benefits of MFA and how it works. Provide training sessions and resources to help them understand the importance of this security measure. Implement a phased rollout of MFA, starting with a pilot group before expanding to the entire organization. Gather feedback and address concerns to ensure a smooth transition. Once MFA policies are in place, regularly review and update them to address new threats and vulnerabilities. Ensure that your MFA settings are aligned with the latest security best practices. Tailor your MFA implementation to fit the needs of your organization. For example, use conditional access policies to balance security and user convenience by requiring MFA only for high-risk activities.

By implementing MFA, you can significantly enhance your organization's security posture, making it much harder for attackers to gain unauthorized access to your systems. Remember, in today's security landscape, MFA is no longer an option—it's a necessity.

### Find a Security Operations Center (SOC) provider

While the tools above are powerful, deploying and managing them effectively requires expertise. Cybersecurity professionals are few and far between, making them expensive to hire. This is why hiring a Security Operations Center (SOC) provider might be the best way forward for some SMBs. Not all SOC providers will use Microsoft technologies, and that's fine. As a Microsoft technologist and employee, I'm definitely biased toward Microsoft solutions, but the key is finding a provider that fits your needs.

If the SOC provider is handling the day-to-day operations of your security infrastructure, let them use the tools they are comfortable with. The priority is having a solid provider who ensures your defenses are always up-to-date and effectively mitigates threats. This approach allows you to leverage professional expertise without the need for a full-time, in-house team, making it a cost-effective solution for maintaining robust security.

SOC providers bring specialized knowledge and experience in handling various security tools and threats. This ensures that your security infrastructure is managed by professionals who are up-to-date with the latest threats and mitigation techniques. Outsourcing to a SOC provider offers an affordable way to access top-tier security talent and resources, which can be prohibitively expensive for SMBs to hire full-time. By outsourcing your security needs, you can focus on your core business operations, allowing you to concentrate on growth and productivity while knowing that your security is in capable hands.

A good SOC provider will tailor their services to meet your specific needs, ensuring that your security infrastructure is robust and effective, whether they use Microsoft technologies or other tools. They provide continuous monitoring and regular updates to your security systems, protecting you against emerging threats. By partnering with a SOC provider, you can maintain a high level of security, ensuring that your defenses are always strong and up to date, providing peace of mind and allowing you to concentrate on what you do best.

### Great, what should I do first?

To enhance your SMB's security, start by enabling Multi-Factor Authentication (MFA), conducting budgetary research, expanding your security infrastructure, building a robust identity solution, and considering hiring a SOC provider. Now that you have a better understanding of the tools and strategies available, let's outline the steps you should take to enhance your SMB’s security:

1. **Enable MFA Wherever Possible**: Immediately implement Multi-Factor Authentication (MFA) across as many applications as you can. Educate your users about the importance of MFA and how to use it effectively.
    
2. **Conduct Budgetary Research**: Identify your current budget for security solutions. Prioritize by centralizing your identity management. Ensure all authentication passes through Entra ID and is protected by MFA. Implement Entra ID in front of all applications, including VPNs. Expand the solution with Conditional Access policy to avoid MFA prompt fatigue.
    
3. **Expand Your Security Infrastructure**: Once your identity management is centralized and protected, consider expanding into other products. Deploy Defender for Business and Business Servers for comprehensive endpoint and server protection. Use Defender for Office 365 to enhance email security and prevent phishing, malware, and ransomware attacks. Integrate Defender for Identity to protect your on-premises environment and detect advanced threats.
    
4. **Build a Robust Identity Solution**: Invest in Entra ID P2, which includes Defender for Identity (MDI) for advanced identity and access management. Regularly review and update your identity policies and practices. Conduct security audits to identify and mitigate potential vulnerabilities.
    
5. **Consider Hiring a SOC Provider**: Given the scarcity and cost of cybersecurity professionals, hiring a SOC provider can be a cost-effective solution. A SOC provider can manage your security infrastructure, ensuring continuous protection and compliance. Work with the SOC provider to secure your identities and maintain a robust security posture.
