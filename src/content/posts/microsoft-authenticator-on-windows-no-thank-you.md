---
title: "Microsoft Authenticator on Windows? No thank you."
description: "Use Windows Hello for Business for secure, compliant authentication instead of Microsoft Authenticator on Windows devices"
pubDate: "2024-05-22T18:48:53.754Z"
cover: "/images/microsoft-authenticator-on-windows-no-thank-you/1b20707b-a276-4d92-bded-c0afdd977adb.webp"
coverAlt: "Cover image for Microsoft Authenticator on Windows? No thank you."
tags:
  - "windows"
  - "zerotrust"
  - "zero-trust-security"
  - "microsoft-authenticator-app"
slug: "microsoft-authenticator-on-windows-no-thank-you"
---

As we dive deeper into the world of cybersecurity, Microsoft's Zero Trust model stands out as a leading framework with its "never trust, always verify" mantra. This approach ensures that every access request is authenticated, authorized, and encrypted.

A common question I’ve heard is, "Why can't we install the Authenticator app on Windows?" Well, here’s the thing: allowing the Microsoft Authenticator app on Windows devices can actually undermine Zero Trust principles.

### Zero Trust 101

Zero Trust is all about **hardcore 🤘** verification for every user and device, whether they’re inside or outside your network. Microsoft lays it out pretty clearly [here](https://www.microsoft.com/en-us/security/business/zero-trust). The key points include:

* **Strict Identity Verification**: Always authenticate users and devices.
    
* **Least-Privileged Access**: Only grant the minimum necessary access.
    
* **Assume Breach**: Continuously monitor and verify to detect and respond to threats.
    

### Microsoft Authenticator’s Role

The Microsoft Authenticator app is a fantastic tool for multi-factor authentication (MFA). It adds an extra layer of security, requiring users to verify their identity with something they have (their phone) along with something they know (their password).

### The Problem with Authenticator on Windows Devices

Installing the Microsoft Authenticator app directly on Windows devices introduces significant security risks, which conflict with Zero Trust principles:

* **Risk of Device Compromise**: If a Windows device gets compromised, an attacker could potentially access both the authentication request and the approval mechanism, undermining the whole point of MFA.
    
* **Lack of Separation**: Zero Trust is big on separating authentication factors. Having both the password and the Authenticator app on the same device breaks this separation.
    

### Alternative to Authenticator on Windows

Windows Hello for Business (WHfB) is a Fido2 compliant way to authenticate using biometrics or PINs, which are securely stored on the device's Trusted Platform Module (TPM). This approach has several advantages that fit perfectly with Zero Trust principles:

* **Secure Biometrics and PINs**: Uses unique identifiers and device-specific PINs, reducing the risk of replication or interception. This aligns with Zero Trust’s need for strong authentication.
    
* **Trusted Platform Module (TPM)**: Credentials are stored securely in a tamper-resistant environment, ensuring robust protection even if the device is compromised. This meets Zero Trust's security requirements.
    
* **Fido2 Compliance**: Eliminates reliance on passwords by using stronger forms of authentication. This makes the process resistant to phishing and man-in-the-middle attacks, supporting Zero Trust’s emphasis on verifiable identities.
    
* **User-Friendly Experience**: Enhances security while boosting user productivity with a seamless authentication experience. This aligns with Zero Trust's goal of providing strong yet user-friendly security measures.
    
* **Seamless Multi-Factor Authentication (MFA)**: Combines something the user has (the device) with something the user is (biometrics) or knows (PIN), ensuring a robust authentication process crucial for Zero Trust.
    

Windows Hello for Business offers a more secure, Zero Trust-friendly approach to MFA on Windows. By leveraging biometric and PIN-based authentication, securely stored credentials in the TPM, and adhering to Fido2 standards, it’s an ideal solution for organizations looking to boost their security posture while maintaining a seamless user experience.

### Securing BYOD with Authenticator

I've heard some organizations express concerns that users might not choose the most secure method for the Authenticator app, worrying they might disable App Lock (which can be done within the app - it's a user setting). For those concerned about securing personal phones and the Authenticator app, it's important to note that when configured to use **Phone Sign-in** or **Passkeys**, the app requires a screen unlock prompt to be configured on the device. This means users **must** provide either **biometrics or a PIN** to approve the prompt, adding an extra layer of security.

However, this isn't the case for push notifications or OTPs (one-time passwords), as App Lock can be disabled within the Authenticator app. It's crucial to decide what MFA method is best for specific workloads or adopt a strong, phishing-resistant MFA option for all workloads.

### Best Practices for MFA on Windows Devices

To stay true to Zero Trust principles while ensuring robust MFA:

* **Use Windows Hello for Business**: This method leverages hardware-bound credentials, keeping authentication secure even if the device is compromised.
    
* **Separate Your Authentication Factors**: Keep the second factor (like the Microsoft Authenticator app) on a separate mobile device to maintain strong security.
    
* **Utilize Temporary Access Passes**: For initial setup or recovery, use Temporary Access Passes instead of relying solely on the Authenticator app.
    

By following these practices, we can better align with Microsoft's Zero Trust framework, boost our security posture, and minimize the risks associated with compromised authentication factors.

### The Gist of the Message

While the Microsoft Authenticator app is great for boosting security, using it directly on Windows devices contradicts Zero Trust principles and is not good practice. This is why Microsoft doesn’t provide a direct or supported way to run the app on Windows. By using Windows Hello for Business and keeping authentication factors separate, we can stick to Zero Trust guidelines and ensure a more secure authentication process. In cybersecurity, following best practices and principles like Zero Trust is crucial for protecting our systems and sensitive information.
