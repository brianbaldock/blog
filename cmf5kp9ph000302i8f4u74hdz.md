---
title: "Admin Guide: Controlling Copilot in Viva Engage"
seoTitle: "Manage Copilot in Viva Engage"
seoDescription: "Learn how to manage access policies for Copilot in Microsoft Viva Engage with this comprehensive admin guide and mini PowerShell module"
datePublished: 2025-09-04T15:40:47.333Z
cuid: cmf5kp9ph000302i8f4u74hdz
slug: admin-guide-controlling-copilot-in-viva-engage
cover: https://cdn.hashnode.com/res/hashnode/image/upload/v1757000277415/f6ff9ec8-e722-40bf-a526-ad24b2f36eae.png
tags: powershell, copilot, microsoft-viva, viva-engage, m365-copilot, microsoft-viva-engage

---

As a Senior Program Manager at Microsoft, one of the things I love about my job (and tinkering in my lab) is spotting gaps where automation can make life easier. This month’s gap is, **managing access policies for Copilot and AI-Powered Summarization in Viva Engage**.

## Why I built a mini-PowerShell Module

The [official documentation](https://learn.microsoft.com/en-us/viva/manage-access-policies) explains that you can have more than one access policy and the most **restrictive** one **always wins**. To clarify:

* **Direct user or group assignments take precedence over org-wide.**
    
* If a user lands in multiple policies, ***Disabled*** beats *Enabled*.
    

Given that there is no other way to create or manage these policies than the cmdlets called out in the documentation I wanted to create some light automation that handles this in an idempotent way (create or update if needed, no duplicates, safe re-runs) and silent by default (user -verbose to see the noise).

## The module

Repo is here: [Set-CopilotForEnga](https://github.com/brianbaldock/Set-CopilotForEngage)[ge](https://github.com/brianbaldock/Set-CopilotForEngage)

The core cmdlet is `Set-EngageFeatureAccess`. It does the heavy lifting:

* Ensures the Exchange Online module is installed/updated.
    
* Connects to Exchange Online if needed.
    
* Resolves the Viva Engage feature IDs.
    
* Creates or updates policies for Copilot and/or AI Summarization.
    
* Handles scope (-Everyone, -GroupIds, -UserIds).
    
* Supports user controls (-UserOptInByDefault).
    

## Recommended approach

### Keep it simple:

* Create an org-wide disabled policy for each feature (baseline).
    
* Create targeted enable policies scoped to security groups.
    
* Don’t bother with “disable groups” unless you want carve-outs from a permissive baseline.
    

### That way:

* Default is deny (no one gets access unless explicitly added).
    
* Membership in an Enable group grants access.
    
* Most restrictive still applies, but you’re not juggling extra disable layers.
    

## Quick start

> Requires: PowerShell 5.1+, `ExchangeOnlineManagement` 3.9.0+ (the module helper can auto‑install/update with switches) see step 2a

```powershell
# 1) Dot source the mini module
. .\Set-CopilotForEngage.ps1

# 2a) Baseline: Use this to disable both features org-wide and install/update the to the latest version of Exchange Online Managment PowerShell Module
Set-EngageFeatureAccess -Mode Disable -Copilot -AISummarization -Everyone -PolicyNamePrefix "All" -AutoInstallEXO -AutoUpdateEXO -Confirm:$false -Verbose

# 2b) Baseline: Disable both features org‑wide 
Set-EngageFeatureAccess -Mode Disable -Copilot -AISummarization `
  -Everyone -PolicyNamePrefix "All" -Confirm:$false -Verbose

# 2) Enable Copilot for one or more groups
Set-EngageFeatureAccess -Mode Enable -Copilot `
  -GroupIds "GROUP GUID HERE" `
  -PolicyNamePrefix "Enable" -Confirm:$false -Verbose

# 3) Enable AI Summarization for one or more groups
Set-EngageFeatureAccess -Mode Enable -AISummarization `
  -GroupIds "GROUP GUID HERE" `
  -PolicyNamePrefix "Enable" -Confirm:$false -Verbose

# 4) Verify policy layout
Get-VivaModuleFeaturePolicy -ModuleId VivaEngage
```

## **What “good” looks like**

The view below shows **two org‑wide block policies** (one per feature) and **two group‑targeted enable policies**. With this layout, anyone **not** in an enable group stays blocked; group members are enabled.

![Policy layout screenshot](https://github.com/brianbaldock/Set-CopilotForEngage/raw/main/Images/Policy%20Layout.png align="left")

So a short blog article for September where I created a tight little module which solves a real admin pain point, and makes policy management repeatable and predictable.

Code’s up on GitHub if you want to try it: [Set-CopilotForEngage](https://github.com/brianbaldock/Set-CopilotForEngage)