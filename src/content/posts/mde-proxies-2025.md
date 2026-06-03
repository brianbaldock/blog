---
title: "Disconnected Environments Revisited"
description: "In 2025, proxies remain essential for Microsoft Defender for Endpoint in restricted networks. Learn about MDE and proxies in 2025."
pubDate: "2025-03-10T21:32:07.131Z"
cover: "/images/mde-proxies-2025/bee62bcd-4da8-4ea2-af8b-b0dd14f462ec.png"
coverAlt: "Cover image for Disconnected Environments Revisited"
tags:
  - "proxies"
  - "defenderportal"
  - "xdr"
  - "defender-for-endpoint"
  - "mde"
  - "disconnected-networks"
slug: "mde-proxies-2025"
---

Back in 2023, I wrote about deploying Microsoft Defender for Endpoint (MDE) ([Link](https://aka.ms/mde-proxies)) in disconnected environments, covering why proxies were necessary and how to make them work. Fast forward to 2025, and the core message hasn't changed: **Defender for Endpoint is a cloud-powered security solution, and you need to give it a way to reach the cloud** if you want the best protection. The good news? Microsoft has made connectivity easier with [Streamlined Connectivity](https://learn.microsoft.com/en-us/defender-endpoint/configure-device-connectivity), but proxies are still a key tool in getting Defender working in restricted networks. Let’s break it down.

## What’s Changed?

Since 2023, Microsoft has dramatically **reduced the number of URLs** needed for allow-listing, consolidating Defender for Endpoint’s cloud endpoints into a much smaller set. Instead of dealing with a long list of domains, most organizations now only need to allow `*.endpoint.security.microsoft.com` and a few others. Microsoft also introduced **static IP ranges and Azure service tags**, making firewall configurations much more manageable.

For organizations with disconnected networks, these changes mean fewer headaches when setting up proxy rules. But even with these improvements, **you still need a path to the cloud**—and that’s where proxies remain essential.

## Why Proxies Still Matter

Many organizations don’t allow direct internet access from endpoints, especially in high-security environments. A proxy allows MDE to connect to Microsoft’s cloud while maintaining network control. This isn’t a security compromise; it’s a smart way to ensure MDE can leverage AI-driven protection and real-time threat intelligence without opening the floodgates.

To make it work, you need to:

* **Use a system-wide proxy configuration** (WinHTTP) so Defender can always communicate, even when no user is logged in.
    
* Allow required Microsoft endpoints **<mark>without SSL inspection</mark>**; Defender uses **certificate pinning**, and inspecting traffic will break its connection.
    
* **Ensure outbound connections don’t require user authentication**, since Defender’s telemetry is sent by the system, not a logged-in user.
    

With a properly configured proxy, **you get full cloud protection without sacrificing security**.

## Airgapped Environments Need a Different Approach

If your environment is fully **airgapped** (no internet at all), then cloud-based protection just isn’t an option. Defender for Endpoint isn’t designed for fully offline use, and while you can keep Defender Antivirus running with offline signature updates, **you lose out on AI-driven threat detection, EDR, and cloud analytics**.

For true airgap scenarios, your focus should be on **offline update mechanisms** (WSUS, Configuration Manager) and **strict network segmentation** to prevent lateral movement. But if there’s even a **tiny** opportunity to establish controlled, intermittent connectivity; say, syncing telemetry weekly; **<mark>it’s worth doing</mark>**.

## Let’s Talk About Trust

One of the biggest pushbacks I still hear is trust. Some organizations hesitate to open a proxy for Defender’s cloud security, despite **already trusting Microsoft with their emails (Exchange Online), files (SharePoint and OneDrive), and collaboration (Teams)**. If your business-critical data already lives in Microsoft’s cloud, why would you suddenly draw the line at security telemetry?

Defender for Endpoint sends **s**ecurity signals, not sensitive business data. It’s about identifying threats, improving detection, and keeping your environment safe. If your security model is still based on “we don’t trust cloud security,” it might be time to rethink that stance.

## Best Practices for 2025

If you’re operating in a disconnected or hybrid network, here’s what you should be doing:

* **Use the new streamlined allow-list** instead of managing dozens of URLs.
    
* **Disable SSL inspection for Defender traffic**; it’ll break functionality.
    
* **Use a dedicated proxy configuration** so Defender always has cloud access.
    
* **Regularly check connectivity** using the client analyzer tool.
    
* **Educate security teams**; this isn’t about opening everything, it’s about controlled access to a trusted security cloud.
    

## **References:**

[Announcing a streamlined device connectivity experience for Microsoft Defender for Endpoint](https://techcommunity.microsoft.com/blog/microsoftdefenderatpblog/announcing-a-streamlined-device-connectivity-experience-for-microsoft-defender-f/3956236)

[Disconnected environments, proxies and Microsoft Defender for Endpoint](https://aka.ms/mde-proxies)

[Defender for Endpoint and disconnected environments. Cloud-centric networking decisions](https://techcommunity.microsoft.com/blog/microsoftdefenderatpblog/defender-for-endpoint-and-disconnected-environments-cloud-centric-networking-dec/3786540)
