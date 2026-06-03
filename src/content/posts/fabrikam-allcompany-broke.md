---
title: "How a User Surge Broke Fabrikam's 'All Company' Group"
description: "Learn how a user influx overwhelmed Fabrikam's \"All Company\" group and the solution applied to handle cross-tenant sync effectively"
pubDate: "2024-10-08T04:00:00.000Z"
cover: "/images/fabrikam-allcompany-broke/03a8de9b-52b8-4366-a0ed-ac926b984d20.png"
coverAlt: "Cover image for How a User Surge Broke Fabrikam's 'All Company' Group"
tags:
  - "microsoft-entra-id"
  - "entra-id"
  - "m365-admin"
  - "all-company-group"
  - "microsoft-365-multi-tenant-organization"
  - "microsoft-cross-tenant-sync"
  - "m365-cross-tenant-sync"
  - "entra-id-cross-tenant-sync"
  - "cross-tenant-sync"
slug: "fabrikam-allcompany-broke"
---

When it comes to multi-tenant organizations, you think you’ve seen it all; until a new twist reminds you that there is always something complex beneath the surface. Recently, I encountered a fascinating issue that perfectly illustrates this point. Let’s dive into the adventure involving our two organizations: Contoso (The giant corp with 30,000 users) and Fabrikam (The nimble subsidiary with 3000 users)

## The grand setup

On July 31st, Contoso’s users were initially synced to Fabrikam via Microsoft’s Multi-Tenant Organization (MTO) and Cross-Tenant Sync (CTS). Everything was humming along nicely; users appeared where they should.

![](/images/fabrikam-allcompany-broke/f7ebee70-a5f2-47dd-ab7b-9d70a78ce0d1.png)

## The unexpected twist

The influx of over 10,000 users from Contoso into Fabrikam caused Fabikam’s org wide “All Company” team to hit its membership limit (All Company Teams are created by default if your tenant has less than 5000 users). Remember, org wide teams max out at a total of 10,000 users (as of 2024-10) [\[Reference\]](https://learn.microsoft.com/en-us/microsoftteams/create-an-org-wide-team#:~:text=Organization%2Dwide%20teams%20are%20limited%20to%20organizations%20with%20no%20more%20than%2010%2C000%20users.%20You%20can%20have%20up%20to%20five%20organization%2Dwide%20teams).

![](/images/fabrikam-allcompany-broke/f2b28f5a-f2f9-47b6-b62c-1b33693eaf83.png)

Fabrikam hadn’t anticipated the sheer volume of users syncing over, and the automatic group membership expansion threw a wrench into their communications and permissions setup. When an org wide team expands beyond 10,000 users it is automatically converted to a public group. Teams are front ends for the Microsoft 365 group.

## The quick fix - Or so they thought

Realizing the issue, the Fabrikam swiftly acted. On August 4th, 4 days following the initial sync, they applied a dynamic rule to remove the now converted org wide groups members that are from Contoso. Crisis averted, or so it seemed.

```plaintext
Dynamic Rule Example:
user.userPrincipalName -notContains "_contoso.com#EXT#@fabrikam.com" and user.UserType -eq "Member"
```

![](/images/fabrikam-allcompany-broke/74ebabb8-2786-4c4d-ab6b-b3d6048e382e.png)

## The hidden ripple effect

This is where things got interesting. Between the initial sync on July 31st and the cleanup on August 4th, Contoso had disabled some users (as they are a large organization, turnover is high - so not a rare scenario). When an external tenant disables (soft deletes) a user in their own tenant, the corresponding synced user in the partner tenant (in this case Fabrikam) gets put into a soft deleted state. After August 4th, some of these users were re-enabled on Contoso’s side (again, large org) Remember, before the group was cleaned up, these users were members of the org wide team/now converted to public group, *and soft deleted users* ***will not display as members of a team.*** So, due to the restore process in cross-tenant sync, the “removed” users were effectively resurrected in Fabrikam and, unexpected, but logically, re-enabled as members of the “All Company” group/team, even though Fabrikam had previously cleaned up the membership.

![](/images/fabrikam-allcompany-broke/952e3893-d9de-460e-b38e-439d244405b7.png)

This process meant that every time a user was disabled and then re-enabled on Contoso’s side, they could potentially pop-up into Fabrikam’s “All Company” team/group, adding to communication compliance concerns. After some investigative work we pinpointed a robust solution and it’s surprisingly easy. Just permanently delete any soft-deleted users in the partner tenant. In this example, the fix was having Fabrikam delete all soft-deleted users in their tenant that contain **\_contoso.com#EXT#@fabrikam.com** in their UPN. This ensures that if a deleted user in Contoso’s tenant gets re-enabled, the cross-tenant sync process will recreate the user with a new ObjectID ignoring any previous group memberships. This prevents the user from being “restored” to the “All Company” group/team.

![](/images/fabrikam-allcompany-broke/c4166405-da6f-4aa3-b3d7-7fcf9f4d6ded.png)

Hopefully you do not run into a similar situation in your organization(s), but, if you do, and you’re seeing similar oddities, double-check your soft-deleted users and do a cleanup. Complex systems can sometimes have unintended consequences.
