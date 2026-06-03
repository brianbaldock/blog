---
title: "Defender for Endpoint & "The Internet""
seoTitle: "Why MDE doesn't use "the internet""
seoDescription: "Explore the nuances of Defender for Endpoint's connectivity needs, encryption history, and the evolution of modern security protocols"
datePublished: 2025-02-14T05:57:47.337Z
cuid: cm74cxgax000709l4gbq3ah2h
slug: defender-for-endpoint-and-the-internet
cover: https://cdn.hashnode.com/res/hashnode/image/upload/v1739512453321/0c0c31f2-15b0-499b-9460-bad7d5cf329b.png
tags: https, encryption, tls, vpn, defender-for-endpoint, airgap, mde, the-internet, air-gapped-networks, disconnected-networks

---

"Defender for Endpoint only works when you're connected to the internet." If I had a dollar for every time I heard that, I'd be set for life. This statement makes security pros wince because it fundamentally misunderstands how modern cloud security operates.

Here's the reality: just because something requires an internet connection doesn't mean it's exposed to the "open internet." When you set up a tightly controlled, encrypted tunnel between your endpoint and a specific service, you're not throwing data into the wild. You're essentially creating a “VPN”, whether you call it that or not.

With HTTPS/TLS, your data is encrypted, directed to a **single**, **defined endpoint**, and **protected** from interception; just like a VPN tunnel. The difference? One is **application-specific**, and the other typically routes all traffic. This distinction is at the heart of why the "Defender needs the internet" argument is flawed. It uses an HTTPS/TLS connection to send telemetry and signals to the Defender service. But before we dive too deep, let's talk about why encryption became the backbone of modern security in the first place.

# **The Internet "Goes Dark"**

Before 2013, encryption was primarily used for sensitive data like banking transactions and login credentials, while most internet traffic remained unencrypted. The Snowden leaks in 2013 exposed extensive global surveillance and the exploitation of unencrypted data, triggering a shift to an "encrypt everything" mentality.

In 2016, Let's Encrypt revolutionized the scene by offering free, automated SSL/TLS certificates, making HTTPS the norm overnight. Today, encryption is standard for almost all online activities; but it also poses challenges for law enforcement, as robust encryption can hinder traditional surveillance methods and complicate data access during investigations.

# **The Cultural Shift**

The industry transitioned from "only encrypt sensitive data" to "encrypt everything by default." Today, whether you're checking email, using a SaaS app, or running a cloud-based AV/EDR like Defender for Endpoint, encryption is the norm. This means that when an endpoint communicates with the cloud, it's through a controlled, encrypted tunnel; not just general web surfing.

### **Key Takeaways from the Encryption Revolution:**

* **Pre-2013:** Encryption was limited to specific use cases.
    
* **Post-Snowden (2013+):** "Encrypt everything" became the standard (it was a slow process).
    
* **Google’s HTTPS Push (2014-2018):** Encouraged **HTTPS** adoption by ranking HTTPS sites higher in search results and marking HTTP sites as insecure in Chrome.
    
* **2016 and beyond:** Let's Encrypt removed cost barriers, making HTTPS ubiquitous.
    
* **Regulatory Changes (e.g., GDPR, PCI DSS v3.2):** Strengthened encryption requirements for compliance.
    

# **The Basics of Secure Tunnels**

Now, let's break down what a VPN does versus what HTTPS/TLS does.

| **What a VPN Typically Does:** | **What HTTPS/TLS Typically Does:** |
| --- | --- |
| Encrypts all device traffic and routes it through a secure tunnel. | Encrypts traffic at the application layer (specific services, not all device traffic). |
| Often changes the IP/location of your traffic. | Does not change the user's IP but still prevents interception. |
| Requires a VPN client for setup. | Ensures end-to-end security between an application and a specific endpoint. |

At their core, both VPNs and HTTPS/TLS tunnel encrypted traffic to a specific destination. The main difference is that a VPN typically works at the network level, whereas HTTPS secures individual services.

### **How HTTPS/TLS ‘Mimics’ a VPN**

| **HTTPS/TLS (Targeted)** | **VPNs (Broad)** |
| --- | --- |
| Secures specific traffic (e.g., Defender services communicating with Microsoft's Defender cloud endpoints, not your entire network session). | Route all traffic through a secure tunnel. |

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1739512064750/a4b249d1-d08b-48ec-bc7a-ba83bef372c6.png align="center")

### **Pinning and Allowlisting**

* Many security teams allowlist only the endpoints that services like Defender for Endpoint require.
    
* If a device can only communicate with Microsoft's secure Defender services, labeling it as "internet-exposed" is misleading.
    

### **Equivalent Security**

* A properly pinned HTTPS connection to a cloud service offers the same level of encryption as a VPN, but at the application level rather than the entire network.
    

# **Addressing the OT concerns**

### **Let’s talk about “air-gapped”**

* A true air-gapped system has zero external connectivity. These are rare and **not** foolproof.
    
* In reality, most environments have controlled exceptions, such as telemetry, updates, or security tools.
    

**Challenges with Air-Gapped Networks**

* **Human Factors:** Air-gapped systems may require data transfer via physical media like USB drives. This necessity introduces a vector for malware.
    
* **Insider Threats:** Employees or contractors with legitimate access can inadvertently or maliciously introduce malware into the system.
    
* **Advanced Persistent Threats (APTs):** Sophisticated adversaries develop methods to breach air-gapped systems, such as exploiting electromagnetic emissions or using compromised hardware.
    
* **Maintenance and Updates:** Keeping air-gapped systems updated is challenging, often leading to outdated software that is vulnerable to exploits.
    

While air-gapped networks add a layer of security, they should not be the sole defense mechanism. Implementing strict access controls, regular security audits, and comprehensive monitoring is essential. Isolation can lead to complacency. Just look at the damage Stuxnet caused.

# **HTTPS/TLS as a "Micro-VPN"**

By pinning HTTPS/TLS traffic to a specific set of endpoints, you create a tunnel just as restricted as a VPN.

### **Benefits of a Strict Allowlist**

If a network only allows outbound HTTPS traffic to a handful of approved domains, then that traffic is as "air-gapped" as possible while still allowing required security functions.

# **Final thoughts**

"Connecting to the internet" does not equate to exposing your network. HTTPS/TLS is a secure tunnel, just like a VPN; just scoped differently.

<div data-node-type="callout">
<div data-node-type="callout-emoji">💡</div>
<div data-node-type="callout-text">Review your own organization’s ‘air-gap assumptions’ and see if you’re missing out on the benefits of controlled cloud connectivity!</div>
</div>

### Sources

['Five Eyes' security alliance calls for access to encrypted material](https://www.reuters.com/article/world/five-eyes-security-alliance-calls-for-access-to-encrypted-material-idUSKCN1UP19C/)

[Canada's National Cyber Security Strategy](https://www.publicsafety.gc.ca/cnt/rsrcs/pblctns/ntnl-cbr-scrt-strtg-2025/index-en.aspx)

[Canada’s national police force admits use of spyware to hack phones](https://www.politico.com/news/2022/06/29/canada-national-police-spyware-phones-00043092)

[Microsoft Digital Defense Report 2024](https://www.microsoft.com/en-us/security/security-insider/intelligence-reports/microsoft-digital-defense-report-2024?msockid=0704d7dfc247627b2dd4c259c391636f)

[An Unprecedented Look at Stuxnet, the World's First Digital Weapon](https://www.wired.com/2014/11/countdown-to-zero-day-stuxnet/)

[What are the Biggest Challenges to Federal Cybersecurity? (High Risk Update)](https://www.gao.gov/blog/what-are-biggest-challenges-federal-cybersecurity-high-risk-update)

[High-Risk Series:Federal Government Needs to Urgently Pursue Critical Actions to Address Major Cybersecurity Challenges](https://www.gao.gov/products/gao-21-288)

[The Air Gap Is Dead. It’s Time for Industrial Organisations to Embrace the Cloud](https://www.paloaltonetworks.com/cybersecurity-perspectives/the-air-gap-is-dead)

[Securing OT Systems: The Limits of the Air Gap Approach](https://darktrace.com/blog/why-the-air-gap-is-not-enough)

[SCADA Security: Is the Air Gap Debate Over?](https://www.tofinosecurity.com/blog/scada-security-air-gap-debate-over)

[Scientist-developed malware prototype covertly jumps air gaps using inaudible sound](https://arstechnica.com/information-technology/2013/12/scientist-developed-malware-covertly-jumps-air-gaps-using-inaudible-sound/)