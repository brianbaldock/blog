---
title: "Mastering Edge Profiles for Microsoft 365 Management"
description: "Explore how to use Edge profiles for efficient Microsoft 365 tenant management in this easy-to-follow guide."
pubDate: "2023-12-06T22:04:51.546Z"
cover: "/images/edge-profile-pro-tips/740eeb0e-1fe3-43ee-9ff6-cb7b682e2e62.png"
coverAlt: "Cover image for Mastering Edge Profiles for Microsoft 365 Management"
tags:
  - "microsoft-edge"
  - "microsoft-edge-profiles"
  - "microsoft-365-tenant-administration"
  - "m365-admin"
slug: "edge-profile-pro-tips"
---

<div data-node-type="callout">
<div data-node-type="callout-emoji">ℹ</div>
<div data-node-type="callout-text">This article was recently updated and republished on the official <strong>setup.cloud.microsoft </strong>website! You can find the updated article here: <a target="_self" rel="noopener noreferrer nofollow" href="https://setup.cloud.microsoft/blog/mastering-microsoft-edge-for-business-profiles" style="pointer-events: none">https://setup.cloud.microsoft/blog/mastering-microsoft-edge-for-business-profiles</a></div>
</div>

## Edge profiles, yeah, I heard of ‘em

If you've ever found yourself swimming in a sea of tabs and different browser windows while managing multiple Microsoft 365 tenants, you're not alone. Edge profiles are here to be your lifesaver. They're independent browser environments within Microsoft Edge, and when you set them up just right, they're a powerhouse for managing multiple tenants without any mix-ups. This is super handy for us administrators juggling various Microsoft 365 tenants. In this article, I'm going to show you the ropes on setting up Edge profiles for each tenant. This way, your work stays neat, organized, and most importantly, separate. So, let's dive in and get your Edge profiles configured to amp up your admin game and hopefully make your day-to-day tasks a breeze.

## Setting Up Your First Profile

Surprisingly, it’s quite simple to get these profiles setup and you may have already come across them. Let’s walkthrough the basic configuration of a profile with the out of box settings:

* **Initial Login:**
    
    * Fire up Edge and log in with the account you're using on your computer. If you're already using a Microsoft or Work account on Windows (like for a Microsoft 365 Tenant), SSO (Single Sign-On) might just swoop in and do the job for you.
        
    * ![A screen shot of a sign in to Edge](/images/edge-profile-pro-tips/1fe2b535-63ee-4012-a25d-671f5c117949.png)
        
* **Your Appearance Settings:**
    
    * Here's where you can jazz things up a bit. Head over to the Overall appearance settings and make it your own. I’m a big fan of Vertical tabs (trust me, once you go Vertical, you never go back) and ditching the title bar. Here’s how:
        
        * Click on “*Vertical Tabs*.”
            
        * Right click the title bar and select “*Hide title bar*.”
            
        * Give that tab sidebar a little shrink. This setup gives you the most screen real estate, but hey, tweak it to your liking.
            
        * ![Instructions previously mentioned on how to enable Brian's custom Edge experience.](/images/edge-profile-pro-tips/feeb1858-b402-49ff-8e5c-4997a7c324fe.png)
            
* **Signing Into Microsoft 365:**
    
    * With your default user profile all set, you can breeze right into Microsoft 365 sites. And if you're an admin, head over to \[https://admin.microsoft.com\](file:///C:/Users/brbaldoc/AppData/Local/Temp/msohtmlclip1/01/clip\_filelist.xml).
        
    * ![A screenshot of the Microsoft 365 admin portal demonstrating successful login of the user profile after signing into Edge.](/images/edge-profile-pro-tips/f3369a6c-ca5a-48df-8dd6-7ab9f21ff7f4.png)
        

## Adding a Profile for Another Tenant

* **Create a new Profile:**
    
    * Click your profile pic in the top left corner of Edge.
        
    * Hit “*Other Profiles*,” then “*Set up new work profile*.”
        
    * ![A screenshot example highlighting the options listed previously. ](/images/edge-profile-pro-tips/0f742bc8-e6eb-4ed3-a68d-28c3c3daa0cb.png)
        
* **Login to Edge with the new profile:**
    
    * Sign into Edge again, but this time with your other profile details.
        
    * ![A screenshot demonstrating the addition of a profile to the Edge browser.](/images/edge-profile-pro-tips/b7a00cea-0c43-4755-af6f-f559f3223b0b.png)
        
* **Managing Sign-In Preferences**
    
    * You’ll get a prompt about Windows remembering your account for apps and sites. Go with “*No, sign in to this app only*” for tighter security.
        
    * ![A screenshot of the prompt: 6) You’ll see a prompt asking if you want “Windows to remember your account and automatically sign you in to your apps and websites on this device.”  a. Select “No, sign in to this app only.”](/images/edge-profile-pro-tips/3c4897c8-032e-4598-aff1-4307fe4f3fef.png)
        
* **Setting Up Your Profile Look:**
    
    * Get into the profile appearance settings. I like picking a different theme for each profile – it makes it easier to tell them apart at a glance.
        
    * ![A screenshot of the new profile with a yellow theme in the Edge browser.](/images/edge-profile-pro-tips/8bcdbd30-8a08-44be-a5a9-da249046f93a.png)
        

## Configuring Profile Settings to Avoid Crossover

* **Adjust Profile-Specific Settings:**
    
    * In your new profile, click your profile image, then the gear icon for settings.
        
    * ![Demonstrating where to click in the Edge profile to select the gear icon to edit profile settings](/images/edge-profile-pro-tips/4700b1af-95c6-4994-b2c5-924ea0c6f83d.png)
        
    * Pro tip: Rename your profile to something more intuitive than “*Work 2*” – maybe use the user’s email address?
        
    * ![Demonstrating the renaming of an Edge profile.](/images/edge-profile-pro-tips/ad38c07d-8446-4a6e-804c-5372c34219cb.png)
        
    * Dive into “Profile Preferences,” or shortcut it with edge://settings/profiles/multiProfileSettings
        
* **Fine-Tune Sign-In Settings:**
    
    * Switch “*Automatically sign in to sites with your current work or school account?*” to “*On.*” This means you'll auto-sign into Microsoft 365 sites with the active profile.
        
    * ![A screenshot of the profile preferences page that demonstrates the two preferences to be set.](/images/edge-profile-pro-tips/70e03b63-dea1-44bc-a54d-ec9b5d2d3473.png)
        
    * Set your default profile (ideally the one matching your Windows profile) under “*Default profile for external links*.” This makes life simpler when opening links from Outlook or Teams.
        
* **Final Steps for Each Profile:**
    
    * Head over to \[https://admin.microsoft.com\](file:///C:/Users/brbaldoc/AppData/Local/Temp/msohtmlclip1/01/clip\_filelist.xml) or another Microsoft 365 site and complete the sign-in with your alternate profile credentials.
        
    * ![A screenshot of the Microsoft 365 sign-in screen](/images/edge-profile-pro-tips/f110165f-7f46-45b1-b2a7-1102bfd4f04e.png)
        
    * Test it out! Open both profiles and log into \[https://admin.microsoft.com\](file:///C:/Users/brbaldoc/AppData/Local/Temp/msohtmlclip1/01/clip\_filelist.xml) in each. Voilà, you're managing both tenants simultaneously.
        
    * ![A screenshot of two edge browser windows in different profiles side by side logged into two different Microsoft 365 tenants.](/images/edge-profile-pro-tips/b2402e40-b82f-48b4-832c-45031901bdb5.png)
        

## Troubleshooting Common Issues

Sometimes, even with the best setup, things can get a little wonky. Here are some common hiccups you might encounter with Edge profiles and how to straighten them out:

* **Profile Confusion:**
    
    * **The Issue:** You open a link, and it pops up in the wrong profile. Annoying, right?
        
    * **The Fix:** Double-check your default profile settings. Ensure that "Default profile for external links" is set to your main profile. This should guide those stray links back home.
        
* **Automatic Sign-In Snags:**
    
    * **The Issue:** Edge isn't signing you into sites automatically, even when it should.
        
    * **The Fix:** Navigate to edge://settings/profiles/multiProfileSettings. Make sure the "Automatically sign in" option is toggled on for each profile. If it's still acting up, try logging out and then back into your profile.
        
* **Syncing Surprises:**
    
    * **The Issue**: Your bookmarks or passwords aren't syncing across profiles.
        
    * **The Fix:** Syncing is profile specific. Hop into the sync settings (edge://settings/profiles/sync) and make sure you've chosen what to sync. If it's still not syncing, a sign-out and sign-in usually kickstarts it.
        
* **Extension Conflicts:**
    
    * **The Issue:** An extension works in one profile but goes on strike in another.
        
    * **The Fix:** Not all extensions love to play nice with multiple profiles. Check if the extension is enabled in the troubled profile. If it's still causing drama, try removing and reinstalling it in that specific profile.
        
* **Profile Corruption:**
    
    * **The Issue:** Your profile just won't open or keeps crashing.
        
    * **The Fix:** This can be a bit tricky. First, try to remove the profile from Edge and add it again. If that doesn't fix it, you might need to create a new profile and manually transfer your data.
        

Remember, most of these issues are just little speed bumps. With a bit of tweaking, you'll have your Edge profiles running smoothly again. And hey, if you hit a snag I haven't covered, Microsoft’s support forums are a treasure trove of solutions and advice.

## Wrapping Up

And there you have it – your very own guide to navigating the world of Edge profiles like a pro. By now, you should be a wizard at setting up and managing multiple Microsoft 365 tenants without breaking a sweat. It's all about keeping things tidy, organized, and efficient. Remember, a well-set-up Edge profile is like a superpower for admins – it makes your work smoother, your tabs less cluttered, and your life just a bit easier.

But hey, I’m always up for learning new tricks. Got a cool tip or a nifty workaround? Maybe you’ve run into a quirky issue or just want to share how this guide worked out for you? Drop your thoughts, experiences, or questions in the comments below. Let’s make this a two-way street and learn from each other. Who knows, your insights might just be the beacon of light for another admin in the depths of tenant management!

Keep experimenting, keep organizing, and most importantly, keep sharing. Can't wait to hear all about your adventures with Edge profiles!
