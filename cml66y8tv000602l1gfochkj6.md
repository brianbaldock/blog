---
title: "Learning Fine-Tuning on Nvidia DGX Spark - Part 2"
seoTitle: "Fine-Tuning with Nvidia DGX Spark"
seoDescription: "Troubleshoot Nvidia DGX Spark setup issues and improve your AI Workbench custom container with these step-by-step solutions for a usable environment"
datePublished: Tue Feb 03 2026 06:01:51 GMT+0000 (Coordinated Universal Time)
cuid: cml66y8tv000602l1gfochkj6
slug: learning-fine-tuning-on-nvidia-dgx-spark-part-2
cover: https://cdn.hashnode.com/res/hashnode/image/upload/v1770096843023/f9236764-26c5-400b-bc92-23f43b38e2a4.png
tags: pytorch, inference, fine-tuning-models, dgxspark

---

In Part 1 of this series, I got NVIDIA AI Workbench to accept a custom PyTorch base image on DGX Spark. Got the container validated, the GPU was visible, and CUDA worked.

<div data-node-type="callout">
<div data-node-type="callout-emoji">🔗</div>
<div data-node-type="callout-text"><a target="_self" rel="noopener noreferrer nofollow" href="https://blog.brianbaldock.net/learning-fine-tuning-on-nvidia-dgx-spark-part-1" style="pointer-events: none">Click here</a> to read part 1 of this series</div>
</div>

By most checklists, the environment was “working”, except it wasn’t.

This article documents what happened next. No new directions, no future training steps. Just the troubleshooting journey required to turn a technically valid Workbench project into something I could actually experiment in.

## Starting From a “Working” Container That Wasn’t

After creating the Workbench project:

* The custom base container validated and pulled successfully <sup>✅</sup>
    
* The GPU was visible ✅
    
* CUDA was available inside the container ✅
    

And yet:

* No JupyterLab
    
* No VS Code
    
* No obvious interactive entry point
    
* The Packages UI was completely empty
    

At the infrastructure level, everything looked correct. At the usability level, the project was effectively dead on arrival.

## The First Wrong Assumption: Packages and Applications

The obvious next step was to add JupyterLab through the Workbench UI.

I clicked **Add JupyterLab**.

The UI accepted the click.

**Nothing** happened.

No error. No feedback. No application created.

That’s when I realized:

> In AI Workbench, “Packages” and “Applications” are **not** the same thing.

Applications require two things:

* The runtime dependencies must already exist in the container
    
* Metadata must be present to tell Workbench how to manage them
    

Without both, the UI quietly does nothing. Great.

## Why JupyterLab Could Not Be Added

So why couldn’t it be added, well, it’s pretty simple. The custom GHCR-based base image did not include JupyterLab. AI Workbench does **<mark>not install applications into custom containers</mark>**.

If the binary does not exist, the **Add JupyterLab** action fails silently.

At this point, I had a choice:

* Install JupyterLab manually inside the running container (not the best choice)
    
* Or fix the base image properly (went with this one)
    

Ad-hoc installs would work temporarily, but they would not be reproducible and they would fight the way Workbench is designed to operate. It’s better to have a correct base image to build on.

## Fix the Base Image, Not the Project

A pattern was already emerging through my testing. The base image had required wrapping to satisfy Workbench metadata in Part 1. Tooling needed the same treatment. Rather than layering fixes inside a single project, I decided to rebuild the GHCR base image, saves time in the long wrong and makes this reproducible (fewer moving parts) and reusable (scales for future projects too).

## How Does AI Workbench Actually Discover Capabilities?

NVIDIA’s documentation confirmed something important: **AI Workbench does not infer or scan container contents.** It discovers capabilities entirely through labels.

For package management, **two** labels are required:

* `com.nvidia.workbench.package-manager.apt.binary`
    
* `com.nvidia.workbench.package-manager.pip.binary`
    

This explained everything:

* Why the Packages UI was empty
    
* Why dependency management was unavailable
    

Workbench had no declared way to manage packages!

## Verifying Package Manager Paths

We can’t go guessing the paths, not good enough. I verified the actual binary locations inside the NGC PyTorch base image:

* `apt` at `/usr/bin/apt`
    
* `pip` at `/usr/local/bin/pip`
    

The nuance here matters:

> <mark>If the label path does not match the real binary exactly, Workbench fails silently.</mark>

## Baking JupyterLab Into the Base Image

With the model clear, JupyterLab belonged in the base image.

During the build:

* Installed JupyterLab
    
* Installed `ipykernel`
    

No runtime installs. No state drift. JupyterLab now exists as a first-class capability of the environment.

## Rebuilding the Wrapper Image Correctly

The updated Dockerfile now included:

* Required Workbench OS labels
    
* CUDA metadata
    
* Package manager labels
    
* JupyterLab installation
    

The image was rebuilt using `--no-cache` to avoid stale layers.

## Tagging, Pushing, and Relearning the Same Lesson

A new pinned tag was used. The image was pushed to GHCR. Labels were verified on the pulled image, not just the local build. Once again, the lesson held:

> AI Workbench validates remote metadata, and `latest` should **never** be used for base environments.

## Repointing the Workbench Project

The Workbench project was updated to reference the new pinned image tag.

This time:

* OS metadata validated
    
* Package managers were recognized
    
* The Packages UI appeared
    
* JupyterLab functioned correctly
    

The project finally functioned like a true development environment, similar to the default one included with NVIDIA Workbench.

## Final Sanity Check

A dedicated GPU validation script was run.

Confirmed:

* CUDA availability
    
* GPU detected
    
* BF16 support
    
* Tensor operations executed on GPU successfully
    

This was the first point where the environment wasn’t just “working”. It was actually usable.

## Core Lessons From This Phase

* AI Workbench is metadata-driven, not convenience-driven
    
* Custom containers must **explicitly** declare capabilities
    
* Silent failures usually indicate **missing** **metadata**, not runtime errors
    
* Fixing the base image once is cheaper than fixing every project
    
* `latest` is actively harmful in Workbench workflows
    

## Closing the Loop

This article intentionally closes the loop on environment readiness.

From here on, the platform is stable. Training, fine-tuning, and experimentation can finally begin.

Stay tuned for Part 3 where that work begins actively.