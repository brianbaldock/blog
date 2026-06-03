---
title: "LightningCopilot - Integrating Microsoft Copilot Studio into Salesforce Lightning (LWC) with Entra ID SSO"
description: "Learn how to integrate Microsoft Copilot Studio into Salesforce Lightning (LWC) with Entra ID SSO for a seamless experience"
pubDate: "2025-10-29T10:00:47.837Z"
cover: "/images/lightningcopilot-salesforce-meets-copilotstudio/9b1550d5-e295-47a3-8bc0-32a8696f2d5e.png"
coverAlt: "Cover image for LightningCopilot - Integrating Microsoft Copilot Studio into Salesforce Lightning (LWC) with Entra ID SSO"
tags:
  - "salesforce"
  - "sso"
  - "lwc"
  - "copilotstudio"
  - "entra-id"
  - "agentic-ai"
  - "copilot-agents"
  - "entra-id-sso"
slug: "lightningcopilot-salesforce-meets-copilotstudio"
---

## Intro

If you’ve ever tried to embed a Microsoft Copilot Studio agent inside Salesforce, you’ve probably learned the hard way that it’s not as simple as dropping in an iframe. Between Salesforce Locker restrictions, Entra ID redirect rules, and Copilot Studio’s federated auth model, it takes some serious tinkering to get everything to line up.

That’s why I built **LightningCopilot**. It’s a Lightning Web Component that brings a Copilot Studio agent to life inside Salesforce with full Entra ID SSO, MSAL-based auth, and clean token flow from start to finish. The chat experience runs through a BotFramework WebChat based lightweight chat experience with adaptive cards, all without breaking Locker.

This post walks through the whole thing so you can wire it up yourself across Entra ID, Copilot Studio, and Salesforce.

<div data-node-type="callout">
<div data-node-type="callout-emoji">⚠</div>
<div data-node-type="callout-text">This guidance is provided as is with no garuantees and I highly recommend testing anything in a dev or sandbox environment before trying this in production.</div>
</div>

The repository is published here: [github.com/brianbaldock/LightningCopilot](https://github.com/brianbaldock/LightningCopilot)

<div data-node-type="callout">
<div data-node-type="callout-emoji">🗒</div>
<div data-node-type="callout-text">Be aware that utilizing Copilot Studio Agents outside of the Microsoft 365 Copilot UI incurs Copilot Credit consumption. <a target="_self" rel="noopener noreferrer nofollow" href="https://learn.microsoft.com/en-us/microsoft-copilot-studio/billing-licensing" style="pointer-events: none">Copilot Studio licensing | Microsoft Learn</a></div>
</div>

## What you’ll build

* A Salesforce Lightning Web Component that securely hosts a Copilot Studio Agent
    
* Seamless Entra ID SSO with MSAL.js
    
* Properly scoped Salesforce Static Resources, Custom Labels and CSP Trusted URLs
    

## Architecture Overview

Everything starts in the Lightning Web Component. It loads the required libraries from Salesforce Static Resources, signs in users through Entra ID using MSAL, and passes authentication to the Copilot Studio agent.

At runtime, the component connects to Microsoft’s Power Platform APIs and Bot Framework endpoints to enable real-time conversations.

Using **Static Resources** was intentional. In Salesforce, scripts loaded directly from CDNs can break under Locker restrictions or CSP rules. Packaging them as Static Resources, you get to control versioning, avoid runtime issues, and keep the entire bundle self-contained, no external script calls needed. I chose this method for simplicity but feel free to test with script loading from CDN if you prefer.

**Custom Labels** follow the same logic. Instead of hardcoding client IDs, region URLs, or agent endpoints in your JavaScript, labels let you manage those values from Salesforce Setup. It’s cleaner, secure, and easier to update between environments without touching the code.

![Flowchart depicting the integration of Salesforce Lightning Copilot with Microsoft services. It shows two main flows: one for loading scripts with static resources and another for acquiring tokens using MSAL. It includes Microsoft Entra ID, Copilot Studio Agent, and API connections to Power Platform and DirectLine.](/images/lightningcopilot-salesforce-meets-copilotstudio/260e8f72-9d36-462a-9ea3-8b942b17fc7e.png)

Let’s get started!

## Prerequisites (I’m assuming you have this already)

* A Salesforce org (and know how to create a utility bar component)
    
* A **published** Copilot Studio Agent
    
* Access to Microsoft Entra ID (Application Administrator is sufficient RBAC on the app registration itself)
    
* Access to Azure Cloud Shell to enable the Copilot SPN.
    
* Notepad - for copy pasting information from this guide as well as the different platforms outlined below.
    

## Prepare the Agent

Chances are you have a Copilot Studio Agent already. If not, create one.

<div data-node-type="callout">
<div data-node-type="callout-emoji">ℹ</div>
<div data-node-type="callout-text">Creating agents is outside of the scope of this article, just search for a guide and you’ll find one.</div>
</div>

Assuming you already have a published agent, open it in [https://copilotstudio.microsoft.com](https://copilotstudio.microsoft.com). Depending on your Power Platform environment type, some authentication or configuration options might not appear. I’d recommend checking that these settings are available; if they’re missing, you’ll likely need your IT team to spin up a new Power Platform environment for Copilot Studio, ideally using a **Dev** or **Sandbox** environment type. See the screenshot below:

![](/images/lightningcopilot-salesforce-meets-copilotstudio/7f0508aa-4057-42f3-959c-dbf4ab13af50.png)

1. Once able, select “**Authenticate manually**” and click “**Save**”.
    
    ***Note:*** *Much of this form is filled out by default and you need only note down the values.*
    
2. Add the “**Redirect URL**” to your notes.
    
3. Select “**Microsoft Entra ID V2 with federated credentials**” from the drop down.
    
4. Add the “**Federated credential issuer**” to your notes.
    
5. Add the “**Federated credential value**” to your notes.
    
6. Add the “**Client ID**” to your notes.
    
7. ***Note***\*:\* ***The “Scopes” will likely only contain “profile” and “openapi”, this is okay for now. We’ll come back to this later.***
    

![](/images/lightningcopilot-salesforce-meets-copilotstudio/6eca53f8-0c57-44ee-8081-359f8db829f2.png)

## Prepare the Entra ID App Registration

* Access the [Entra Admin Center](https://entra.microsoft.com).
    
* Click “App Registrations”.
    

![](/images/lightningcopilot-salesforce-meets-copilotstudio/8b98c35e-caa5-4bdb-b9f6-9aae492f57ed.png)

* Select your agent from the list. You should see your agent name with the (Microsoft Copilot Studio) suffix.
    
* Note down your Application (Client) ID, Directory (Tenant) ID.
    

![](/images/lightningcopilot-salesforce-meets-copilotstudio/2d34bfb6-2b3b-4eb4-b117-1f62eac3be6b.png)

### 1) Authentication settings

* Click “**Authentication**”, and click “**Add platform**”
    
* Select “**Web**”
    
    * Enter the following value: **https://token.botframework.com/.auth/web/redirect**
        
* Click “Add platform” again, this time selecting “**Single-page application**” (**SPA**)
    
* Add the following SPAs:
    
    * **https://api.powerplatform.com/CopilotStudio.Copilots.Invoke**
        
    * **https://&lt;YOUR-ORG&gt;.&lt;develop,sandbox, etc&gt;.lightning.force.com**
        
    * **https://&lt;YOUR-ORG&gt;.&lt;develop,sandbox, etc&gt;.lightning.force.com/ <mark>← note the trailing slash</mark>**
        
    * **https://&lt;YOUR-ORG&gt;.&lt;develop,sandbox, etc&gt;.lightning.force.com/lightning/page/home**
        
* Select “**ID tokens (used for implicit and hybrid flows)**”
    
* Should look something like this when you’re done:
    

![](/images/lightningcopilot-salesforce-meets-copilotstudio/55e77876-f464-46d6-bac8-fe38c2900666.png)

### 2) Certificates & Secrets

1. Click “**Federated credentials**”, there are likely already 2 credentials here.
    
2. Click “**Add credential”.**
    

![](/images/lightningcopilot-salesforce-meets-copilotstudio/87ff8cbd-ae45-44d9-a98e-007d9f60f0eb.png)

1. From the “**Federated credential scenario**” dropdown select “**Other issuer**”.
    
2. The “**Issuer**” in this context is the following with your tenant ID: **https://login.microsoftonline.com/&lt;TENANT ID&gt;/v2.0**
    
    Leave the “**Type**” as is: “**Explicit subject identifier**”.
    
3. In “**Value**” drop in the “**/eid1**” generated when you created the manual authentication settings in your agent. This field should be populated in your agent’s “**Federated credential value**” field.
    
4. Name this credential something clear and easily identifiable like, “**FED\_ID\_AGENTNAME**”.
    
5. Provide a description, example: “**Federated credential for &lt;AGENTNAME&gt; for Salesforce SSO flow**“
    
6. Click “**Add**” to save the settings
    

![](/images/lightningcopilot-salesforce-meets-copilotstudio/577df253-7e7d-46da-a44b-612a2e16a4f1.png)

### 3) API Permissions

For this section we need to create the Power Platform API service principal for the tenant. The easiest and quickest way to do this is via the Azure Cloud Shell. Open a new tab in your browser and access the Cloud Shell at the following link: [https://shell.azure.com](https://shell.azure.com)

<div data-node-type="callout">
<div data-node-type="callout-emoji">ℹ</div>
<div data-node-type="callout-text">Requirements for accessing the Azure Cloud Shell are not outlined in this blog post. Check out the following link for more information: <a target="_self" rel="noopener noreferrer nofollow" href="https://learn.microsoft.com/en-us/azure/cloud-shell/get-started/classic?tabs=azurecli" style="pointer-events: none">https://learn.microsoft.com/en-us/azure/cloud-shell/get-started/classic?tabs=azurecli</a></div>
</div>

Later we’ll be adding the **CopilotStudio.Copilots.Invoke** delegated permission in Entra ID, it shows up as part of the **Power Platform API**. That’s expected, Copilot Studio is built on top of the Power Platform service layer. The documentation under [Power Platform Admin API](https://learn.microsoft.com/en-us/power-platform/admin/) covers this same backend service.

<div data-node-type="callout">
<div data-node-type="callout-emoji">💡</div>
<div data-node-type="callout-text">You will need at least the “<strong>Application Administrator</strong>” role to run this command. Don’t worry, it will tell you if you don’t have the correct role.</div>
</div>

```bash
az ad sp create --id 8578e004-a5c6-46e7-913e-12f58912df43
```

With the SPN enabled we can now go back to Entra ID and add additional API Permissions. Open up your Agent’s App Registration again and click on the “**API Permissions**” pane.

1. Under API Permissions select “**Add Permission**”.
    

![](/images/lightningcopilot-salesforce-meets-copilotstudio/8f30f820-6ee3-453b-8702-96942f43080b.png)

1. Select "**APIs my organization uses**”.
    
2. Search for “**Power Platform API**” and select it.
    

![](/images/lightningcopilot-salesforce-meets-copilotstudio/1b43b913-a1b8-471e-9f5b-a8044f8d2e44.png)

<div data-node-type="callout">
<div data-node-type="callout-emoji">⚠</div>
<div data-node-type="callout-text">If you do not see “Power Platform API” in this list then go back to the start of this section and add the Power Platform API SPN to your Tenant.</div>
</div>

1. Search for “**CopilotStudio.Copilots.Invoke**”.
    
2. Check the “**CopilotStudio.Copilots.Invoke**” option.
    
3. Click “**Add permissions**”.
    

![](/images/lightningcopilot-salesforce-meets-copilotstudio/cd3995ea-72fd-4151-8f6c-f8a6bbe6ab13.png)

1. Click “**Grant admin consent for &lt;Your Org Name&gt;**”.
    

![](/images/lightningcopilot-salesforce-meets-copilotstudio/da19c989-da34-4e0d-bab1-2b90d44a0992.png)

### 4) Expose an API

1. Select “**Expose and API**”.
    
2. Click “**Add**" next to “**Application ID URI**”
    

![](/images/lightningcopilot-salesforce-meets-copilotstudio/1dc18b72-190a-410a-9c59-a17e39a6f739.png)

1. Click “**Save**” (the generated URI is sufficient for our purposes)
    

![](/images/lightningcopilot-salesforce-meets-copilotstudio/2de72b8a-baac-40be-ae46-02605e2553b3.png)

1. Next, click “**Add a Scope**”.
    
2. For "Scope name” enter: "**Chat.Invoke**”.
    
3. Who can consent?: “**Admins and users**”.
    
4. Admin consent display name: “**Copilot Invocation**”.
    
5. Admin consent description: “**Invoke Copilot Agent**”.
    
6. User consent display name: “**Copilot Invocation**”.
    
7. User consent description: “**Invoke Copilot Agent**”.
    
8. State: “**Enabled**”.
    
9. Click “Add scope”.
    

![](/images/lightningcopilot-salesforce-meets-copilotstudio/ce539d59-6465-4f71-823d-37c1de35c130.png)

When you’re done it should look something like this:

![](/images/lightningcopilot-salesforce-meets-copilotstudio/40831e61-f119-42f6-9be8-eb5a8d74c4d5.png)

**Update the Scopes in your Copilot Agent**

* Now copy the full scope URI from under “Scopes” see the Clipboard button next to the api:// address.
    
* Go back to Copilot Studio and select you Agent, click Settings, Security, Authentication and paste the full **api://&lt;GUID&gt;/Chat.Invoke** at the end of the “Scopes” text field, leave a space after the existing scopes there.
    
* ![](/images/lightningcopilot-salesforce-meets-copilotstudio/9d598a92-1db9-4f33-bade-a8581858713d.png)
    

## Building the LWC

1. Clone the GitHub repository here: [https://github.com/brianbaldock/LightningCopilot](https://github.com/brianbaldock/LightningCopilot)
    
2. At the root of the project, type the following commands in order
    

```bash
# Install node modules:
npm install
```

I’ve added a build-static-resources.mjs which pulls the latest components required for Adaptive Cards, MSAL, and Copilot Studio Client from various modules and SDKs. The script is here: **scripts/build-static-resources.mjs**

You should see a result like this.

![](/images/lightningcopilot-salesforce-meets-copilotstudio/8c91048c-7342-4411-a9a7-36aaa7ba68cc.png)

### Rebranding

This is a good time to rename your agent project because chances are you’re not calling it **LightningCopilot** (though it is a pretty cool name huh 😉)

**To publish under a different brand:**

* Rename this folder: lightningCopilot/main/default/lwc/**lightningCopilotAuth**
    
* Rename classes/export: Update exported class **LightningCopilotAuth** to new name.
    
* Event names: Replace: **lightningcopilotauthsignin**, **lightningcopilotauthsignout**, **lightningcopilotautherror**.
    
* HTML labels: Change “**Sign in to Lightning Copilot**” to the new branding text.
    
* CSS namespace: Root class **.lightning-copilot-shell** → new scoped class.
    
* Logging prefix: Update **\[LightningCopilotAuth\]** occurrences.
    
* **sfdx-project.json**: Adjust package directory path if source folder renamed.
    
* README: Replace occurrences of LightningCopilot with new brand. Keep naming internally consistent to avoid broken imports.
    

### Pushing the project to SalesForce

At the root of the project folder do the run the following commands.

```bash
sf org login web --alias MyOrg --instance-url https://login.salesforce.com
sf config set target-org MyOrg --global
sf project deploy start
```

### Creating the Static Resources

**Static Resources** in Salesforce are essentially packaged files (JavaScript, CSS, images, or libraries) that you upload once and reference securely inside Lightning Web Components or Aura apps. Instead of linking to external CDNs or hardcoding paths, Static Resources let you bundle everything you need (like msalBrowser, copilotStudioClient, and adaptiveCards) directly into your org. This keeps your component self-contained, avoids Locker and CSP violations, and gives you full control over versioning and deployment between environments.

Let’s create the static resources:

1. In SalesForce select the “**Setup**” gear.
    
2. Search for “**Static Resources**” and enter the Static Resource screen.
    
3. Create three new Static Resources with the following details:
    

| **Name** | **File** |
| --- | --- |
| msalBrowser | static-resources-build/msalbrowser/dist/msal-browser.min.js |
| adaptiveCard | static-resources-build/adaptiveCards/dist/adaptivecards.js |
| copilotStudioClient | static-resources-build/copilotStudioClient/dist/copilotStudioClient.js |

<div data-node-type="callout">
<div data-node-type="callout-emoji">💡</div>
<div data-node-type="callout-text">The naming convention is static and case sensitive, do not modify these names or you’ll have to update the LWC code as well.</div>
</div>

When you’re done, it should look something like this:

![](/images/lightningcopilot-salesforce-meets-copilotstudio/96f08684-d83b-44fb-854b-d3f943485396.png)

### Creating the TrustedURLs

Trusted URLs in Salesforce define which external domains your org is allowed to load resources or make network calls to. Because of Salesforce’s strict Content Security Policy (CSP), anything not explicitly trusted will be blocked, including scripts, iframes, or API requests from your Lightning Web Component. By adding these Microsoft endpoints as **Trusted URLs**, you’re telling Salesforce that communication with Copilot Studio, Power Platform, and Entra ID is safe and intentional. This step ensures that token exchanges, Adaptive Card rendering, and chat functionality all work correctly within Locker’s sandboxed environment.

1. In SalesForce select the “**Setup**” gear.
    
2. Search for “**CSP**” and select “**Trusted URLs**”
    
3. Click “**New Trusted URL**”
    
4. All of the Trusted URLs listed below follow the same recipe, the only difference is the URL and the API Name.
    
    * **Trusted URL Recipe:**
        

![](/images/lightningcopilot-salesforce-meets-copilotstudio/13069aa2-f1f8-46cd-95cc-ba825566294d.png)

Here is the list of URLs:

| **API Name** | **URL** | **About** |
| --- | --- | --- |
| **API\_BAP\_MSFT** | https://api.bap.microsoft.com | Power Platform backend used by Copilot Studio for configuration and policy management. |
| **BOTFRAMEWORK** | https://cdn.botframework.com | Hosts core Bot Framework scripts and assets used for chat functionality. |
| **COPILOTSTUDIO** | https://copilotstudio.microsoft.com | Main Copilot Studio web interface and runtime services for agents. |
| **DIRECTLINE** | https://directline.botframework.com | Handles authenticated chat sessions and message transport between Salesforce and Copilot. |
| **HTTPS\_POWER PLATFORM\_API** | https://&lt;GUID&gt;.f1.environment.api.powerplatform.com | Environment-specific Power Platform API endpoint that Copilot uses for execution and data exchange. |
| **M365** | https://login.microsoftonline.com | Microsoft Entra ID endpoint for authentication and token issuance. |
| **MDCA** | https://abtcyber-net.access.mcas.ms | Defender for Cloud Apps endpoint providing conditional access and session control. **<mark>NOTE: You may not need this if you don’t use Microsoft Defender for Cloud Apps.</mark>** |
| **WSS\_POWER\_PLATFORM\_API** | wss://&lt;GUID&gt;.f1.environment.api.powerplatform.com | WebSocket endpoint for real-time Copilot Studio and Power Platform communications. Environment specific. |

<div data-node-type="callout">
<div data-node-type="callout-emoji">ℹ</div>
<div data-node-type="callout-text"><strong>Note:</strong> The wss:// (WebSocket) endpoint enables real-time chat and Adaptive Card updates. Without it, you might see delays or dropped connections inside Salesforce.</div>
</div>

When you’re done, it should looks something like this:

![](/images/lightningcopilot-salesforce-meets-copilotstudio/613cce7d-d43e-4f3e-89e3-8aa5ffca440e.png)

### Creating the Custom Labels

**Custom Labels** in Salesforce let you store configurable values, like URLs, client IDs, and scopes, that your Lightning Web Component can reference at runtime. Instead of hardcoding these details into your code, labels make it easier to manage environments (Dev, Test, Prod) without redeploying the component. It’s also more secure and keeps sensitive identifiers out of your source files. Think of them like environment variables.

1. In SalesForce select the “**Setup**” gear.
    
2. Search for “**Custom Labels**” and select “**Custom Labels**”
    
3. Click “**New Custom Label**”
    
4. You’ll need custom labels for all of the values listed below. This activity will require you to lookup values in Entra ID, Copilot Studio, and do a bit of discovery using Azure App Insights.
    

List of Custom Labels:

| **Label Name** | **Value** | **About** |
| --- | --- | --- |
| **COPILOT\_AgentUrl** | https://copilotstudio.microsoft.com/environments/&lt;guid&gt;/bots/&lt;name&gt;/webchat?\_\_version\_\_=2 | Direct URL to the Copilot Studio agent (used to embed or call your agent from Salesforce). |
| **COPILOT\_EmbedUrl** | https://api.bap.microsoft.com/providers/Microsoft.BusinessAppPlatform/environments/&lt;Environment GUID&gt;/copilotAgents?api-version=2023-10-01-preview | Base API endpoint for invoking the Copilot Agent through Power Platform. |
| **MSAL\_ClientId** | **aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa** | The Entra ID app registration’s client ID used by MSAL for authentication. |
| **MSAL\_RedirectUri** | https://&lt;orgname&gt;.&lt;sandbox etc.&gt;.lightning.force.com/lightning/page/home | The redirect URI registered in Entra ID, pointing back to Salesforce for token return after login. |
| **MSAL\_Scopes** | api://&lt;GUID&gt;/Chat.Invoke https://api.powerplatform.com/CopilotStudio.Copilots.Invoke openid profile email | Defines the OAuth scopes that the MSAL client requests when authenticating with Entra ID. Separated by spaces. |
| **MSAL\_TenantId** | **aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa** | Your Microsoft Entra ID (Azure AD) tenant ID, used to authenticate against the correct directory. |

Great list right? Where do we find all the things? Let’s start with the easy ones:

* **MSAL\_ClientId -** Your Copilot Agent’s App Registration Application (Client) ID - Find this in Entra ID.
    
* **MSAL\_RedirectUri -** Your SalesForce page where the component will be running.
    
* **MSAL\_Scopes -** These are what we defined (with some additions) to the App Registration earlier in this article. List these out in the custom label with spaces separating each one. - Find this in Entra ID.
    
* **MSAL\_TenantId -** Your Entra ID Tenant ID - Find this in Entra ID.
    
* **COPILOT\_AgentURL**
    
    1. Go to [https://copilotstudio.microsoft.com.](https://copilotstudio.microsoft.com)
        
    2. Open your agent.
        
    3. Click Channels, select Demo Website
        
    4. Copy the URL listed in “Share the URL” to your browsers address bar:
        
    5. When the page opens notice how the URL changed. Copy this new URL to your notes.
        
    6. Update the URL the following way:
        
        * Remove the highlighted parts in the example below:
            
            * https://copilotstudio.microsoft.com/environments/&lt;ENVIRONMENTGUID&gt;/bots/&lt;NAME&gt;/<mark>canvas?version=2&amp;enableFileAttachment=true</mark>
                
        * Replace with the following (ensure to remove any trailing or doubled slashes)
            
            * **/webchat?\_\_version\_\_=2**
                
        * It should looks like this now:
            
            * https://copilotstudio.microsoft.com/environments/&lt;ENVIRONMENTGUID&gt;/bots/&lt;NAME&gt;**<mark>/webchat?version=2</mark>**
                
* **COPILOT\_EmbedURL**
    
    1. This one is really tricky to find but luckily you don’t have to do the network tracing, CSP monitoring, trials and errors that I went through to lock this one in. Just take the Environment GUID from the COPILOT\_AgentURL above and drop it into this preconstructed link:
        
        * https://api.bap.microsoft.com/providers/Microsoft.BusinessAppPlatform/environments/&lt;ENVIRONMENTGUID&gt;/copilotAgents?api-version=2023-10-01-preview
            

When you’re finished, it should look something like this:

![](/images/lightningcopilot-salesforce-meets-copilotstudio/1c3c9cfc-4e31-4d81-b085-f45da576c321.png)

## Troubleshooting

**Agent keeps asking to sign in**

* Verify every Salesforce SPA redirect URI exists in Entra ID. Include the trailing slash and /lightning/page/home.
    
* Confirm [https://token.botframework.com/.auth/web/redirect](https://token.botframework.com/.auth/web/redirect) is listed under **Web**.
    
* Check the federated credential issuer and value. Issuer must be [https://login.microsoftonline.com/&lt;tenant-id&gt;/v2.0](https://login.microsoftonline.com/%3Ctenant-id%3E/v2.0). Value should match the /eid1/... from Copilot Studio.
    
* If MSAL silent auth fails inside Salesforce, set cacheLocation: "localStorage" and storeAuthStateInCookie: true in your MSAL config.
    

**Power Platform API not found in Entra ID**

* Create the service principal first (see the section earlier in the article)
    
* Reopen API permissions and search for Power Platform API. Add CopilotStudio.Copilots.Invoke and grant admin consent.
    

**Adaptive Cards show \[object Object\]**

* Use the non-minified Adaptive Cards build (this should be the case if you followed the article so far) This is mainly noted for posterity.
    
* Confirm the Static Resource name matches exactly what the LWC imports expect.
    

**MSAL redirect loop or stale cache**

* Clear browser storage for your Salesforce domain.
    
* Verify the SPA redirect URIs exactly match the domain you are testing on.
    
* In sandboxes, double-check you are not mixing lightning.force.com and my.salesforce.com origins.
    

### **Known gotchas by environment**

* **Locker**: avoid dynamic eval or libraries that assume window globals.
    
* **Static Resources**: names are case sensitive. Change a name and your LWC fails to load.
    
* **Multiple Salesforce domains**: Entra SPAs must exist for each domain you use to test.
    
* **Region drift**: moving the agent to another Power Platform environment without updating labels breaks calls silently.
    

### **Security notes**

* Minimum role to create the Power Platform API SPN is **Application Administrator**. Cloud App Admin, Privileged Role Admin, or Global Admin also work.
    
* Keep client IDs, tenant IDs, and environment GUIDs in **Custom Labels**. Do not hardcode in JS.
    
* Pin your Static Resource versions with your build script to avoid unplanned upgrades.
    

### **Quick validation checklist**

* Copilot Studio agent is published in the expected environment.
    
* Entra ID app has Web and SPA redirects configured.
    
* Power Platform API with CopilotStudio.Copilots.Invoke is granted and consented.
    
* Chat.Invoke scope exposed and referenced in **MSAL\_Scopes** custom label.
    
* Static Resources uploaded and named exactly: msalBrowser, adaptiveCard, copilotStudioClient.
    
* Trusted URLs added for login.microsoftonline.com, api.bap.microsoft.com, copilotstudio.microsoft.com, directline.botframework.com, your environment-specific HTTPS and WSS endpoints.
    
* Custom Labels populated and referenced by the LWC.
    

## **Wrap up**

You should now have a Copilot Studio agent running inside Salesforce with Entra ID SSO, MSAL handling the token flow, and a lightweight Bot Framework chat that behaves under Locker. The setup is opinionated for reliability in Salesforce: Static Resources for scripts, Custom Labels for environment config, and a short list of Trusted URLs to satisfy CSP. From here you can extend the component with richer telemetry, swap the hosted chat for a custom Direct Line client, or light it up inside other Salesforce workspaces.

Repo is here if you want to clone or open a PR: [**github.com/brianbaldock/LightningCopilot**](http://github.com/brianbaldock/LightningCopilot)

<div data-node-type="callout">
<div data-node-type="callout-emoji">🧡</div>
<div data-node-type="callout-text">If you found this post helpful, please like it below and share it out!</div>
</div>
