---
title: "Automating UPN Suffix Updates in Active Directory"
description: "New script to help automate the updating of UPN attributes for Active Directory when migrating to or enabling Microsoft 365/Entra ID."
pubDate: "2023-11-04T00:33:50.958Z"
cover: "/images/automating-upn-suffix-updates-in-active-directory/5d1c85eb-2b66-415a-a6a1-0c4a6e048f4d.png"
coverAlt: "Cover image for Automating UPN Suffix Updates in Active Directory"
tags:
  - "powershell"
  - "powershell-automation"
  - "powershell-scripting"
  - "upn-suffix"
  - "upn-updates"
slug: "automating-upn-suffix-updates-in-active-directory"
---

In a large-scale enterprise environment, managing User Principal Name (UPN) suffixes in Active Directory can become a herculean task, especially when there are domain transitions, mergers, or rebranding. Manually updating the UPN suffixes is not only time-consuming but also prone to human errors. To address this challenge, I have created a PowerShell script that automates the process of updating UPN suffixes based on predefined parameters and an existing "AlternateID" attribute. This script is to help organizations easily migrate to routable UPNs when enabling Microsoft 365 or Entra ID.

## **Objective**

The primary objective of this script is to streamline the process of updating UPN suffixes in Active Directory. The script operates in two modes: Update and Restore. The Update mode is the default state, which replaces the UPN value with a new domain suffix, while the Restore mode allows reverting the UPN to its previous state, providing a safety net in case of error.

## **Core Features**

### **Adaptive Handling**

The script smartly identifies and utilizes an alternate ID attribute to update the UPN suffixes, ensuring that the new UPN values are accurate and consistent.

### **Logging**

A comprehensive logging mechanism is built into the script, which records all changes made during the execution. This log can be invaluable for troubleshooting and auditing purposes.

### **Exclusion List**

An exclusion list feature allows specifying domain suffixes to be skipped during the processing, ensuring that only the targeted UPN suffixes are updated.

### **Restoration Capability**

The Restore mode is a life-saver in case of an unforeseen issue. It allows for a quick rollback to the previous UPN values, minimizing the impact of errors.

## **Usage**

The script is designed with user-friendliness in mind. Here are some examples demonstrating how to use the script:

```powershell
.\Update-UPNSuffix.ps1 -csvPath "C:\Users.csv" -logPath "C:\" -Subdomain "Subdomain" -AlternateIDAttribute "AlternateIDAttribute" -BackupAttribute "extensionAttribute6" -ExcludedSuffixes "domain.com,contoso.com"

.\Update-UPNSuffix.ps1 -csvPath "C:\Users.csv" -logPath "C:\" -AlternateIDAttribute "AlternateIDAttribute" -BackupAttribute "extensionAttribute6"

.\Update-UPNSuffix.ps1 -Restore -csvPath "C:\Users.csv" -logPath "C:\" -RestoreAttribute "extensionAttribute6"
```

## [**GitHub Repository**](https://github.com/brianbaldock/Update-UpnSuffix)

The script is hosted on GitHub, allowing easy access and the opportunity for the community to contribute to its improvement.

This PowerShell script significantly simplifies the management of UPN suffixes in Active Directory, making it a valuable tool for administrators during domain transitions or rebranding exercises. Your feedback and contributions are highly appreciated to make this tool even better.

## **Call to Action**

I invite you to test this script in your environment, share your experiences, and provide feedback. If you find it useful, please feel free to star, fork, or contribute to the project on [GitHub](https://github.com/brianbaldock/Update-UpnSuffix). Together, we can make UPN suffix management in Active Directory a breeze.
