---
title: "Learning Fine-Tuning on Nvidia DGX Spark - Part 1"
seoTitle: "Fine-Tuning on Nvidia DGX Spark: Part 1"
seoDescription: "Learn to set up NVIDIA AI Workbench on DGX Spark for fine-tuning modern AI models with a CUDA-enabled PyTorch environment"
datePublished: 2026-01-24T05:38:21.721Z
cuid: cmkrvpi8p000l02l4ecopd13n
slug: learning-fine-tuning-on-nvidia-dgx-spark-part-1
cover: https://cdn.hashnode.com/res/hashnode/image/upload/v1769233000568/97e46a8f-7d96-4246-8d94-44717faf8150.png
tags: pytorch, inference, finetuning, dgxspark

---

If you are working with **NVIDIA DGX Spark (or your own rig)** and trying to do anything beyond toy experimentation, you will very quickly run into challenges.

<div data-node-type="callout">
<div data-node-type="callout-emoji">👉</div>
<div data-node-type="callout-text"><strong>Setting up your own rig? See my previous article to get started </strong><a target="_self" rel="noopener noreferrer nofollow" href="https://blog.brianbaldock.net/deploying-local-ai-inference-with-vllm-and-chatui-in-docker" style="pointer-events: none"><strong>Deploying Local AI Inference with vLLM and ChatUI in Docker</strong></a></div>
</div>

This article documents the steps, decisions, and some of the failures I hit while getting **NVIDIA AI Workbench** running cleanly on DGX Spark with a **Blackwell-capable PyTorch base image.**

By the end of this article, you will have:

* AI Workbench running on DGX Spark (This is pretty straightforward)
    
* A CUDA-enabled PyTorch environment that supports **sm\_121 (This is where I had some issues)**
    
* A clean, reproducible base image
    
* A foundation suitable for fine-tuning modern models
    

## What I Was Trying to Accomplish

The requirements were non-negotiable:

* Use **NVIDIA AI Workbench** as the development control plane
    
* Run on **DGX Spark (GB10, Blackwell,** `sm_121`)
    
* Fine-tune modern models (starting with **Phi-4**)
    
* Use **CUDA-enabled PyTorch**, not CPU-only fallbacks
    
* Avoid silent GPU architecture incompatibilities
    

## Failure #1: Generic Python Base Images

Starting from a standard Python base image fails exactly how you would expect:

* PyTorch installs as `+cpu`
    
* [`torch.cuda.is`](http://torch.cuda.is)`_available()` returns `False`
    

AI Workbench does not magically make PyTorch CUDA-aware. The base image determines everything.

## Failure #2: Built-in Workbench PyTorch Images

The next logical step was to use NVIDIA-provided PyTorch base images directly from AI Workbench.

Symptoms:

* CUDA appears available
    
* GPU is visible
    
* Warnings about unsupported architecture: `sm_121`
    

Root cause:

* These images were compiled for `sm_80`, `sm_86`, and `sm_90`
    
* Blackwell (`sm_120` / `sm_121`) support was not present
    

At this point the issue was not Docker or Workbench; it was the **PyTorch build target**.

## Choosing a PyTorch Base That Supports Blackwell

Once the constraint was clear, the solution was straightforward.

### NVIDIA NGC PyTorch Container

The working base image:

* [`nvcr.io/nvidia/pytorch:25.12-py3`](http://nvcr.io/nvidia/pytorch:25.12-py3)
    

Why this image:

* Blackwell-capable (`sm_120`, compatible with `sm_121`)
    
* CUDA 13.x user-space
    
* NVIDIA-validated for DGX-class systems
    

From a GPU and framework standpoint, this is the correct foundation.

Unfortunately, AI Workbench adds another constraint, this led to some trial and error.

## Why NGC Images Fail in AI Workbench by Default

NGC images are valid Docker images. They are ***not*** valid AI Workbench base environments.

AI Workbench validates **image metadata before pulling layers**. If required labels are missing, the image is rejected immediately with errors such as:

* `invalid base environment (invalid OS)`
    
* `no OSDistro set`
    
* `no OSDistroRelease set`
    

<div data-node-type="callout">
<div data-node-type="callout-emoji">🔑</div>
<div data-node-type="callout-text"><strong>Key point: </strong><em>NGC containers are not automatically Workbench-compatible. Lesson learned.</em></div>
</div>

You must explicitly provide the metadata Workbench expects.

## The Fix: A Minimal Wrapper Image

This is the cleanest solution and the one that scales. No recompiles. No rebuilding PyTorch. Just metadata.

### Inspect the Base OS

Inside the NGC container:

* OS: `linux`
    
* Distro: `ubuntu`
    
* Release: `24.04`
    

Verified via `/etc/os-release`.

### Wrapper Dockerfile with Workbench Metadata

The wrapper image does one thing only; it adds the labels required by AI Workbench.

```dockerfile
FROM nvcr.io/nvidia/pytorch:25.12-py3

LABEL com.nvidia.workbench.schema-version="v2" \
      com.nvidia.workbench.name="NGC PyTorch 25.12 (Workbench)" \
      com.nvidia.workbench.description="Wrapper for nvcr.io/nvidia/pytorch:25.12-py3 with Workbench metadata" \
      com.nvidia.workbench.image-version="25.12.1" \
      com.nvidia.workbench.cuda-version="13.0" \
      com.nvidia.workbench.os="linux" \
      com.nvidia.workbench.os-distro="ubuntu" \
      com.nvidia.workbench.os-distro-release="24.04" \
      com.nvidia.workbench.programming-languages="python3"
```

*No software changes are introduced.*

## Building and Verifying the Wrapper Image

```bash
docker build --no-cache -t nvwb-pytorch-25.12:latest .
```

Verify that the labels are present:

```bash
docker inspect nvwb-pytorch-25.12:latest \
  --format '{{range $k,$v := .Config.Labels}}{{println $k "=" $v}}{{end}}' \
  | grep 'com.nvidia.workbench'
```

If these labels are missing or incorrect, AI Workbench will reject the image.

## Publishing the Image to GitHub Container Registry (GHCR)

### Why GHCR

* AI Workbench needs a container URL that can be pulled, and I chose GHCR for this purpose. You can choose any option you prefer, as long as the image can be pulled from a valid URL.
    
* **Local images are ignored**
    
* GHCR works reliably for personal and public images
    

### Authentication Requirements

I used a **classic GitHub Personal Access Token**. It might be better to use a fine-grained token, but since this is a local development setup, I didn't think it was necessary to determine the exact permissions needed and kept it basic.

* `read:packages`
    
* `write:packages`
    

```bash
echo "$GH_TOKEN" | docker login ghcr.io -u <username> --password-stdin
```

### Docker Credential Helper Pitfall

My Docker config initially contained:

```json
"credHelpers": {
  "ghcr.io": "workbench"
}
```

This silently overrides standard Docker authentication and causes:

* Failed pushes
    
* `wb-svc` errors
    
* AI Workbench unable to read image metadata
    

**Fix:**

* Remove the `credHelpers` entry for `ghcr.io`
    
* Allow Docker to use `auths` normally
    

This is subtle and easy to miss.

### Tagging and Pushing (Pinned Tags Only)

Avoid `latest`.

```bash
docker tag nvwb-pytorch-25.12:latest ghcr.io/brianbaldock/nvwb-pytorch-25.12:25.12.1
docker push ghcr.io/brianbaldock/nvwb-pytorch-25.12:25.12.1
```

---

## Why `latest` Causes Workbench Validation Failures

AI Workbench validates metadata *before* pulling layers.

With `latest`:

* Multiple digests
    
* Registry-side caching
    
* Inconsistent metadata resolution
    

Pinned tags remove ambiguity and resolve validation failures immediately.

## Creating the AI Workbench Project

In AI Workbench:

* New Project → Custom Container
    
* Container URL:
    

```plaintext
ghcr.io/<username>/nvwb-pytorch-25.12:25.12.1
```

Result:

* Base environment validated
    
* Project created successfully
    
* GPU visible inside the container
    

---

## Final Verification

Inside the container:

```python
import torch
print(torch.__version__)
print(torch.cuda.is_available())
print(torch.cuda.get_device_name(0))
```

Expected output:

* CUDA-enabled PyTorch
    
* `NVIDIA GB10`
    
* No architecture warnings
    

## Key Takeaways

* AI Workbench is **metadata-driven**, not just Docker-driven
    
* NGC containers require wrapper labels
    
* Blackwell requires the correct PyTorch build target
    
* GHCR authentication is not Git authentication
    
* Docker `credHelpers` can silently override auth
    
* `latest` is unsafe for Workbench base images
    
* Wrapper images are the cleanest long-term approach
    

---

## What’s Next

This article establishes a clean, reproducible base.

Next articles in this series will build on it:

* Fine-tuning **Phi-4** on DGX Spark
    
* LoRA vs QLoRA on Blackwell
    
* Serving models with **vLLM**
    
* Multi-container AI Workbench workflows