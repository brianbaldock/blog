---
title: "Proxies and Defender for Endpoint"
description: "For my inaugural blog article on my official blog, I wanted to share my previous three blog articles (published on Microsoft official blogs) covering an..."
pubDate: "2023-07-09T16:58:24.895Z"
cover: "/images/proxies-and-defender-for-endpoint/735bda22-21eb-4745-8c9b-1ed4e6f04518.jpeg"
coverAlt: "Cover image for Proxies and Defender for Endpoint"
tags:
  - "mde-defender-for-endpoint-microsoft-defender-xdr-microsoft-defender-for-endpoint-proxies-disconnected-environments"
slug: "proxies-and-defender-for-endpoint"
---

For my inaugural blog article on my official blog, I wanted to share my previous three blog articles (published on Microsoft official blogs) covering an exploration of Microsoft Defender for Endpoint and how it works behind proxies as well as some mental shifts required in adopting a cloud-based XDR.

[Disconnected environments, proxies and Microsoft Defender for Endpoint](https://aka.ms/mde-proxies)

* This article talks about:
    
    * **Defender for Endpoint in disconnected environments**: It discusses the challenges and requirements of deploying and configuring Defender for Endpoint, a cloud-based endpoint protection product, in disconnected and air-gapped environments that use proxies.
        
    * **Recipe for successful deployment**: It provides a list of items to consider and steps to follow to ensure a smooth and functional deployment of Defender for Endpoint in a disconnected environment, such as involving the correct parties, configuring the proxy settings, allowing unauthenticated traffic, updating the certificates and using the client analyzer.
        
    * **Scenarios to consider**: It describes some common scenarios that may affect the behavior and functionality of Defender for Endpoint depending on the proxy configuration and user authentication context, such as user log-in state, TLS inspection, WinINET proxy configuration and network complexity.
        

[Defender for Endpoint and disconnected environments. Which proxy configuration wins?](https://aka.ms/mde-proxies-winner)

* This article talks about:
    
    * How Microsoft Defender for Endpoint behaves in situations with conflicting proxy configurations and recommends using the Client Analyzer script to understand the path that Defender for Endpoint is taking.
        
    * The author set up three different proxy servers and a Windows 11 workstation in a lab environment to test the different configurations and found that when both a WinHTTP and WinINET configuration is present, the WinHTTP proxy takes precedence for Defender for Endpoint connections.
        
    * For a good user experience on a workstation in a disconnected environment and to provide full feature availability to your Security Operations Center (SOC) team, using a combination of WinINET and Static Proxy will offer the most feature-rich experience without impacting existing configurations in your environment.
        

[Defender for Endpoint and disconnected environments. Cloud-centric networking decisions](https://aka.ms/mde-proxies-networking)

* This article talks about:
    
    * **Defender for Endpoint and disconnected environments**: It explains the challenges and considerations of deploying Defender for Endpoint, a cloud-based security product, in semi-disconnected or fully disconnected environments.
        
    * **Networking requirements and proxy configurations**: It offers guidance on how to configure proxy settings for Defender for Endpoint and related products, such as Intune, Azure AD, and Windows Update. It also shows the results of testing different proxy configurations in a lab environment.
        
    * **Planning and deployment recommendations**: It suggests reviewing the documentation, involving the right stakeholders, understanding the current network configuration, and using the Test Device Registration Connectivity script to validate the device access to Microsoft resources.
