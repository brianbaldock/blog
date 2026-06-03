---
title: "Recipe: Designing Identity for Agentic AI"
description: "Learn best practices for secure identity management in agentic AI systems, ensuring accountability and zero trust in dynamic, scalable environments"
pubDate: "2025-07-22T03:56:22.296Z"
cover: "/images/recipe-designing-identity-for-agentic-ai/4727f395-2a39-43f2-98c9-67b20492b3cb.png"
coverAlt: "Cover image for Recipe: Designing Identity for Agentic AI"
tags:
  - "entra-id"
  - "mcp-server"
  - "agentic-ai-development"
  - "identity-for-agentic-ai"
  - "agentic-ai-identity"
  - "sql-mcp"
slug: "recipe-designing-identity-for-agentic-ai"
---

The first time I watched an AI agent chain multiple tool calls and hit customer data faster than I could finish a coffee, I realized something: these aren’t apps anymore. They’re users. They do real work, they touch real data, and if we don't manage their identity properly, we’re in for a mess of ghost accounts, hardcoded secrets, and zero accountability.

This blog is for security architects and identity engineers trying to build scalable agentic systems that don’t compromise your entire environment. If your agents need to talk to APIs, legacy databases, and each other.

## Why agent identity is a different beast

Agentic workloads don’t follow the old patterns. They:

* Spin up and disappear, or maybe not.
    
* Call services in parallel.
    
* Act on behalf of users (or other agents).
    
* Break assumptions about static infrastructure.
    

We can’t just treat them like apps or users. We need first-class identity that’s dynamic, scoped, and trackable. Microsoft Entra Agent ID helps, but architecture matters more than tooling.

![Diagram comparing "Human Identity" and "Agent Identity." Human Identity features include logins and passwords, long-lived accounts, independent actions, and static nature. Agent Identity features include token-based authentication, short-lived instances, autonomous actions, and dynamic nature. There are simple icons of a person and a robot for each category.](/images/recipe-designing-identity-for-agentic-ai/23532119-5bbf-42a9-bb25-7faa8ceef04e.png)

## The core protocols (and what they expect from identity)

| **Protocol** | **Description** |
| --- | --- |
| MCP (Model Context Protocol) | For calling tools and fetching data. Assumes OAuth2. |
| A2A (Agent-to-Agent) | Agents delegate scoped authority to each other using signed Agent Cards. |
| ACP (Agent Communication Protocol) | Structured messaging with optional DID support. Trust and authorization must be verified |

All of them assume identity is solved, our job is to make that true.

# The Agent Identity Architecture Recipe

Here’s a simple truth: you can’t bolt on identity after you’ve built an agentic system. It needs to be part of the **foundation**. I threw together a recipe you can use to secure agents in real-world environments.

1. **Give every agent an identity**
    
    * Agents shouldn’t be invisible, they should show up in your Entra ID tenant like any other principal.
        
    * Entra Agent ID or app registrations, no shared accounts. No mystery agents.
        
2. **Use modern auth only**
    
    * Use OAuth2 client credentials flow or managed identity for agents calling APIs.
        
    * Prefer federated identity for agents outside Azure (GitHub, K8s, etc.).
        
    * Support on-behalf of flows when an agent acts on behalf of a user.
        
3. **Wrap legacy systems with identity-aware proxies**
    

* Put an **API layer** or **proxy** in front of legacy tools.
    
* Let the agent call the API with a token; the API handles legacy auth using credentials from a vault.
    

<div data-node-type="callout">
<div data-node-type="callout-emoji">📢</div>
<div data-node-type="callout-text"><strong><em>Bonus:</em></strong><em> this also gives you a place to enforce RBAC and log activity.</em></div>
</div>

4. **Vaut every secret**
    
    * Use **Azure Key Vault** (or HashiCorp Vault) to store DB passwords, tokens, and certs.
        
    * Grant agents minimal read access scoped to what they need.
        
    * Rotate secrets on a schedule. Better: make them ephemeral where possible.
        
5. **Enforce Zero Trust**
    
    * Assign **scoped roles** and use **Conditional Access** for workload identities.
        
    * Leverage **Agent Cards** or scoped JWTs for delegation (especially with A2A).
        
    * Never assume an agent is “safe” just because it’s internal. Validate everything.
        
6. **Monitor and decomission**
    
    * Use **access reviews** and **audit logs** to track usage.
        
    * Deprovision stale agents. Revoke access. Rotate keys.
        
    * Feed everything into Sentinel or your SIEM so you can catch weird behavior early.
        

## Quick-scan checklist

* **◻️ Every agent has a unique identity in Entra ID** (Agent ID / service principal)
    
* **◻️ No raw secrets in code or memory**—everything is pulled from Key Vault
    
* **◻️ Service-to-service auth** uses OAuth 2.0, mTLS, or federated identity
    
* **◻️ Scoped permissions only**—never more than what’s needed
    
* **◻️ Legacy systems** are abstracted behind modern identity-aware proxies
    
* **◻️ Conditional Access & role policies** apply to agents like any other principal
    
* **◻️ Secrets are rotated regularly** (or eliminated via managed identity)
    
* **◻️ Full audit trail** from user → agent → resource
    
* **◻️ Monitoring** for abnormal behaviour or usage patterns
    
* **◻️ Lifecycle automation**—agents are created, monitored, and decommissioned cleanly
    

## Example: End-to-end Identity Flow from user to SQL via MCP

Let’s try and make this real. Using the previous recipe, let’s outline what it would look like for a user to trigger an action via an agent, which then queries SQL Server via an MCP server. The MCP server could just be used as a wrapper for another API in this case.

![](/images/recipe-designing-identity-for-agentic-ai/dff0c1c7-3f46-4baf-8d79-2fdebf4aa268.png)

Here’s a matrix view of the different flows:

<table><tbody><tr><td colspan="1" rowspan="1"><p></p></td><td colspan="1" rowspan="1" colwidth="324"><p><strong>On-Behalf-Of (user-impersonation)</strong></p></td><td colspan="1" rowspan="1"><p><strong>Service-credential (app-identity)</strong></p></td></tr><tr><td colspan="1" rowspan="1"><p><strong>Purpose</strong></p></td><td colspan="1" rowspan="1" colwidth="324"><p>Preserve the human’s identity end-to-end for fine-grained auditing</p></td><td colspan="1" rowspan="1"><p>Let the MCP act as a trusted service when user context isn’t required (or the back-end can’t handle it)</p></td></tr><tr><td colspan="1" rowspan="1"><p><strong>Credentials MCP receives from the agent</strong></p></td><td colspan="1" rowspan="1" colwidth="324"><p>Delegated Entra ID access token containing scopes like sql.read, sql.write</p></td><td colspan="1" rowspan="1"><p>Same delegated token (used only for authorization)</p></td></tr><tr><td colspan="1" rowspan="1"><p><strong>What MCP does first</strong></p></td><td colspan="1" rowspan="1" colwidth="324"><p>Validates JWT, checks the required scope</p></td><td colspan="1" rowspan="1"><p>Same validation and scope check</p></td></tr><tr><td colspan="1" rowspan="1"><p><strong>How MCP logs into SQL</strong></p></td><td colspan="1" rowspan="1" colwidth="324"><p>Backend API called by MCP uses Windows / gMSA account to do Kerberos S4U2Self and gets a TGT for the user - Trades it via S4U2Proxy for a service ticket to MSSQLSvc…</p></td><td colspan="1" rowspan="1"><p>Opens key vault with managed identity - Pulls either a DB password or requests and Entra token scoped to Azure SQL</p></td></tr><tr><td colspan="1" rowspan="1"><p><strong>Identity SQL sees</strong></p></td><td colspan="1" rowspan="1" colwidth="324"><p>The users UPN/SID - looks exactly like they logged into the db directly</p></td><td colspan="1" rowspan="1"><p>MCP or API Service Principal (Windows login, managed identity or Entra ID App)</p></td></tr><tr><td colspan="1" rowspan="1"><p><strong>Secret material traces</strong></p></td><td colspan="1" rowspan="1" colwidth="324"><p>Only a short lived local kerberos ticket</p></td><td colspan="1" rowspan="1"><p>Either a short lived DB access token or a vault fetched password that you can auto-rotate.</p></td></tr><tr><td colspan="1" rowspan="1"><p><strong>Audit Trail</strong></p></td><td colspan="1" rowspan="1" colwidth="324"><p>Entra Sign-in - MCP Logs (User OID + request ID) - DC Kerberos Events - SQL audit rows for user, row level security</p></td><td colspan="1" rowspan="1"><p>Entra ID sign-in - MCP Logs - Key Vault “Get Secret” audit - SQL audit rows for the service</p></td></tr><tr><td colspan="1" rowspan="1"><p><strong>Typical Uses</strong></p></td><td colspan="1" rowspan="1" colwidth="324"><p>Reporting tools, data explorers, anything where row level security or per-user quotas matter</p></td><td colspan="1" rowspan="1"><p>ETL jobs, schema migrations, bulk admins, legacy DBs that can’t accept Kerberos delegation</p></td></tr></tbody></table>

## Wrap up

Agentic AI isn’t the future, it’s already live in your environment. I guarantee someone in your org is trying to build an agent right now. The question is: do you know what it’s doing?

The good news is you don’t need to start over. You just need to start being deliberate.

Treat your agents like non-human teammates. Secure them with the same Zero Trust mindset, enforce guardrails like you would for any user, and apply governance from day one. If you’re already using Microsoft Entra ID, you’re not far off. You’ve got the foundation, now it’s just about wiring it up the right way.

Start small. Register your agents. Vault your secrets. Lock down what they can do.

Because when that next agent spins up and hits your data layer, you want to know exactly who kicked it off, what it accessed, and why.

## References

* **Microsoft Tech Community** – [Announcing Microsoft Entra Agent ID](https://techcommunity.microsoft.com/t5/microsoft-entra-azure-ad-blog/announcing-microsoft-entra-agent-id-secure-and-manage-your-ai/ba-p/4157518)
    
* **Model Context Protocol** – [Anthropic MCP Overview](https://modelcontextprotocol.io/introduction)
    
* **Agent Card & A2A Protocol** – [Agent-to-Agent](https://a2a-protocol.org/latest/specification/)
    
* **Azure Identity Platform Docs** – [Workload identity federation](https://learn.microsoft.com/en-us/entra/workload-id/workload-identity-federation)
    
* **Azure Key Vault** – [Best practices for secrets management](https://learn.microsoft.com/en-us/azure/key-vault/general/best-practices)
    
* **Britive Blog** – [Agentic AI Is Redefining Identity Security in the Cloud](https://www.britive.com/resource/blog/agentic-ai-redefining-identity-security-cloud)
    
* **Techolution Report** – [How Legacy Systems Sabotage Agentic AI](https://www.techolution.com/blog/how-legacy-systems-are-quietly-sabotaging-agentic-ai-across-enterprises/)
    
* [**How Strata Identity and Microsoft Entra ID solve identity challenges in mergers and acquisitions**](https://www.microsoft.com/en-us/security/blog/2023/12/19/how-strata-identity-and-microsoft-entra-id-solve-identity-challenges-in-mergers-and-acquisitions/?msockid=05efbb07d8d16f5a36a1ad2bd9076e99)
    
* [**The Identity Problem at AI Scale: Why Agentic AI Demands More From OAuth**](https://www.strata.io/blog/agentic-identity/why-agentic-ai-demands-more-from-oauth-6a/)
