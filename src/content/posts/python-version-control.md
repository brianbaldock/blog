---
title: "My Simple Setup for Sanity in Python Development on Windows"
description: "Learn how to manage Python versions seamlessly on Windows using PyEnv and PowerShell for a hassle-free development environment"
pubDate: "2025-12-02T06:23:30.468Z"
cover: "/images/python-version-control/f2704d0f-711f-4f69-a4f3-a70adbf4832b.png"
coverAlt: "Cover image for My Simple Setup for Sanity in Python Development on Windows"
tags:
  - "python"
  - "windows"
  - "pyenv"
  - "pyenv-win"
slug: "python-version-control"
---

Dropping a quick post about how I keep my Python versions under control on Windows. Nothing fancy, just something that has saved me enough headaches that it feels worth sharing.

Python environments have burned me more times than I want to admit. Different projects, different versions, weird PATH collisions. The usual mess. PyEnv cleaned that up for me on MacOS and Linux, so when I found the Windows version, I was all in.

PyEnv for MacOS and Linux: [https://github.com/pyenv/pyenv](https://github.com/pyenv/pyenv)  
PyEnv for Windows: [https://github.com/pyenv-win/pyenv-win](https://github.com/pyenv-win/pyenv-win)

My workflow lives in VS Code, and I want things to just work. If I open a repo that needs a specific Python version, I want that version active immediately. No guessing. No scrolling through interpreter lists. So I wired up a small PowerShell trick to keep everything in sync.

Here is the flow.

I open a repo. I know it needs Python 3.10. I run:

```bash
pyenv local 3.10
```

PyEnv drops a .python version file into the folder. The only job left is making sure my shell respects it.

This line in my PowerShell profile does exactly that. It puts the PyEnv shims at the front of PATH:

```powershell
$env:Path = "$($env:USERPROFILE)\.pyenv\pyenv-win\shims;$($env:USERPROFILE)\.pyenv\pyenv-win\bin;" + $env:Path
```

I keep this line in two places so everything behaves the same way:

```bash
%userprofile%\Documents\PowerShell\Microsoft.PowerShell_profile.ps1
%userprofile%\Documents\PowerShell\Microsoft.VSCode_profile.ps1
```

Why put it in the profile instead of editing the global Windows PATH.

For me, it is safer and more predictable. The change applies only to the current shell session, and PyEnv’s shims always load first. Nothing else on the system silently overrides them.

In the end, it is one small line that keeps my Python setup clean and my VS Code projects consistent on Windows. No more surprises.

Like this post if you find it useful!
