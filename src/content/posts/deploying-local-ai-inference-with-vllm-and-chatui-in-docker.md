---
title: "Deploying Local AI Inference with vLLM and ChatUI in Docker"
description: "Learn how to deploy a self-hosted AI chatbot using vLLM and ChatUI in Docker with an NVIDIA GPU for local AI inference"
pubDate: "2025-02-01T03:57:50.920Z"
cover: "/images/deploying-local-ai-inference-with-vllm-and-chatui-in-docker/c3421c66-a6cd-4f07-a410-3877c2a21da0.png"
coverAlt: "Cover image for Deploying Local AI Inference with vLLM and ChatUI in Docker"
tags:
  - "ai"
  - "docker"
  - "debian"
  - "docker-compose"
  - "homelab"
  - "local-llm"
  - "vllm"
  - "chatui"
slug: "deploying-local-ai-inference-with-vllm-and-chatui-in-docker"
---

# Why I Built This

I’ve always been fascinated by AI and self-hosted solutions, so with my home lab setup, I figured - why not experiment with AI and containers?

Since I already had the hardware, building a local inference server seemed like a natural next step.

I started researching different options and, as a longtime Hugging Face lurker, decided to try out some of their tools. That’s when I came across **vLLM**, a fast, OpenAI-compatible model server, and **ChatUI**, a clean, customizable frontend. It looked like a straightforward setup.

Yeah, it wasn’t.

Between networking issues, container misconfigurations, and a handful of other headaches, getting everything running was far more involved than I expected. But after plenty of troubleshooting, rebuilding, and debugging, I got it working.

This article walks through that process - what I learned, the challenges I ran into, and the resources that helped along the way. I’ve also included the final working configuration for anyone looking to set up a **local AI inference server** using Docker, NVIDIA GPUs, and open-source tools.

## The Goal

I wanted to deploy a **self-hosted AI chatbot** with the following components:

* **vLLM** serving as the AI model (replacing cloud APIs like Hugging Face or OpenAI)
    
* **ChatUI** providing the frontend (so I wouldn’t have to build a UI from scratch)
    
* **MongoDB** storing chat history for persistence
    
* **NGINX** handling reverse proxying and TLS (SSL) termination
    
* **Docker** managing deployment for a consistent and reproducible setup
    
* **GPU acceleration** ensuring snappy responses
    

## The Final Architecture

Here’s what I ended building/using

| **Component** | **Tool Used** | **Documentation** |
| --- | --- | --- |
| **Model Server** | vLLM (OpenAI-compatible) | [vLLM Docs](https://docs.vllm.ai/en/latest/) |
| **Frontend** | ChatUI (Hugging Face’s clean UI) | [ChatUI Docs](https://huggingface.co/docs/chat-ui/installation/local) |
| **Database** | MongoDB | [MongoDB & Docker](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-community-with-docker/?msockid=14ef65ebd2d4698b35e470b1d3f3683a) |
| **Reverse Proxy** | NGINX | [NGINX & Docker](https://www.docker.com/blog/how-to-use-the-official-nginx-docker-image/) |
| **Deployment** | Docker & Docker Compose | [Docker & Docker Compose](https://docs.docker.com/compose/) |
| **GPU Acceleration** | NVIDIA RTX 3080 (10GB VRAM & 272 Tensor Cores) | [Nvidia & Docker](https://docs.nvidia.com/ai-enterprise/deployment/bare-metal/latest/docker.html) |

---

# Getting the prerequisites ready

With the physical setup complete, the next step was choosing an operating system. I wanted something lightweight with minimal overhead since I’d be managing everything remotely over SSH using Visual Studio Code. A streamlined OS also helps keep configuration and maintenance simple.

I went with **Debian**, a solid and reliable choice.

## **Setting Up the Environment**

Once Debian was installed, I ran the following commands to update the system, install essential packages, and set up Docker.

```bash
# Baseline updates and setup
sudo apt update
sudo apt upgrade -y
sudo apt install ca-certificates curl gcc git git-lfs wget

# Docker specific prerequisite setup
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

## **Installing NVIDIA Drivers & CUDA**

For GPU acceleration, I needed **CUDA** and the latest **NVIDIA drivers**. The best way to ensure compatibility is by downloading the appropriate CUDA version directly from [NVIDIA’s site. The site d](https://developer.nvidia.com/cuda-downloads?target_os=Linux&target_arch=x86_64&Distribution=Debian&target_version=12&target_type=deb_network)ynamically generates [the correct ins](https://developer.nvidia.com/cuda-downloads?target_os=Linux&target_arch=x86_64&Distribution=Debian&target_version=12&target_type=deb_network)tall commands based on your OS version - always check for updates before running these commands.

As of writing, CUDA **12.8** was the latest version. Here’s how I installed it:

```bash

# Installing Nvidia Drivers and Cuda
wget https://developer.download.nvidia.com/compute/cuda/repos/debian12/x86_64/cuda-keyring_1.1-1_all.deb
sudo dpkg -i cuda-keyring_1.1-1_all.deb
sudo apt-get update
sudo apt-get -y install cuda-toolkit-12-8
sudo apt-get install -y nvidia-open
```

## **Setting Up the NVIDIA Container Toolkit**

To enable GPU access inside Docker containers, I installed the **NVIDIA Container Toolkit** following [NVIDIA’s documentation.](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html#installing-the-nvidia-container-toolkit)

```bash
# Installing the Nvidia Container Toolkit
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg && curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list
sudo apt-get update
sudo apt-get install -y nvidia-container-toolkit
sudo nvidia-ctk runtime configure --runtime=docker
```

## **Verifying Everything Works**

After installation, I rebooted the system and verified that the **GPU** and **container toolkit** were working properly.

```bash
# Reboot (start fresh)
sudo reboot

# Now check prereqs
nvidia-smi # This should output driver information

# Test that the container toolkit is working properly with Docker and that containers can access the GPU
sudo docker run --rm --runtime=nvidia --gpus all ubuntu nvidia-smi
```

The **nvidia-smi** output should display your GPU details. Running the same command inside a Docker container should produce identical output. If anything looks off, retrace the setup steps to catch any missed configurations.

![nvidia-smi output showing GPU details from inside the Docker container](/images/deploying-local-ai-inference-with-vllm-and-chatui-in-docker/c99f89e7-157f-4fbe-bb42-d4bf0fb68585.png)

## **Setting Up the Working Directory**

This is where I stored all **Docker Compose files, models, and configuration files** for the various containers. Most directories will be generated later, but a few need to be created manually.

```bash
cd ~
mkdir working
mkdir working/chat-ui
mkdir working/nginx
```

---

## **Full Setup Commands (For Reference)**

If you want to set everything up in one go, here’s a consolidated version.

<div data-node-type="callout">
<div data-node-type="callout-emoji">❗</div>
<div data-node-type="callout-text"><strong><em>The following commands include a reboot.</em></strong></div>
</div>

```bash
# Baseline updates and setup
sudo apt update
sudo apt upgrade -y
sudo apt install ca-certificates curl gcc git git-lfs wget

# Docker specific prerequisite setup
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Installing Nvidia Drivers and Cuda
wget https://developer.download.nvidia.com/compute/cuda/repos/debian12/x86_64/cuda-keyring_1.1-1_all.deb
sudo dpkg -i cuda-keyring_1.1-1_all.deb
sudo apt-get update
sudo apt-get -y install cuda-toolkit-12-8
sudo apt-get install -y nvidia-open

# Installing the Nvidia Container Toolkit
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg && curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list
sudo apt-get update
sudo apt-get install -y nvidia-container-toolkit
sudo nvidia-ctk runtime configure --runtime=docker

# Reboot host
sudo reboot

# Now check prereqs
nvidia-smi # This should output driver information

# Test that the container toolkit is working properly with Docker and that containers can access the GPU
sudo docker run --rm --runtime=nvidia --gpus all ubuntu nvidia-smi

# Prep the working folder(s)
cd ~
mkdir working
mkdir working/chat-ui
mkdir working/nginx
```

---

# **Why vLLM?**

After setting up the environment, the next step was choosing an **inference engine** to serve the AI model. With so many options available - like Hugging Face’s **Text Generation Inference (TGI)** - I wanted something fast, **compatible with OpenAI’s API**, and optimized for **high-throughput inference**.

I came across an excellent blog post by [Malte Büttner at inovex.de](https://www.inovex.de/de/blog/author/mbuettner/). While the article focused on TGI rather than vLLM, it helped frame my approach to deploying this solution efficiently.

## **Why vLLM Over Other Solutions?**

Inference engines evolve rapidly, but I chose **vLLM** for its balance of **speed, efficiency, and support for modern models**. Here’s a quick comparison:

| **Feature** | **TGI (Hugging Face)** | **vLLM** |
| --- | --- | --- |
| **Developer** | Hugging Face | UC Berkeley |
| **Optimization** | Best for HF transformer models | High-throughput LLM inference |
| **Quantization Support** | ❌ Limited (4-bit/8-bit only) | ✅ GPTQ & AWQ (better for modern models) |
| **Memory Efficiency** | ⚠️ Statically allocated KV cache | ✅ PagedAttention (better memory usage) |
| **Batching** | ✅ Continuous batching | ✅ More optimized for multi-user workloads |
| **Long-Context Support** | ⚠️ Decent, but struggles with newer models | ✅ Better KV cache management |
| **Multi-GPU Support** | ✅ Yes (DeepSpeed-based) | ✅ Yes |
| **OpenAI API Compatibility** | ❌ No | ✅ Yes (drop-in replacement for OpenAI API) |

vLLM is OpenAI-compatible API made it easy to integrate **without modifying other components** like ChatUI. It also supports **efficient batching and memory handling**, which is crucial when running inference on consumer-grade GPUs.

---

# **Choosing the Right Model**

Selecting the right model wasn’t just about grabbing the biggest, most powerful LLM available. It had to fit within **hardware constraints** while still performing well in **chat-based interactions**.

The **RTX 3080 (10GB VRAM)** is a solid GPU, but large models like **LLaMA 3 8B** or **Mistral 7B** would have pushed its memory limits, making them impractical for real-time chat. I needed a model that was:

* **Compact enough** to run efficiently on my GPU
    
* **Strong in conversation**
    
* **Fully compatible with vLLM** for seamless inference
    

## Why Phi-3?

Phi-3 stood out because it **delivers strong chat performance** despite its smaller size. At just **3.8B parameters**, it competes with (and even outperforms) some **7B** **models** while maintaining **efficiency**.

**Key Factors in My Decision**

1. **✅ Performance vs. Hardware Constraints**
    
    * The RTX 3080 has limited VRAM (10GB), so full-precision LLMs were out.
        
    * Phi-3 runs efficiently without excessive slowdowns.
        
    * Larger models like **Mistral 7B** would have been **too memory-intensive** for real-time use.
        
2. **✅ Optimized for Chat**
    
    * Some models excel at **code generation**, but **fall short in conversation**.
        
    * Phi-3 is specifically **fine-tuned for instruction-following**, making it ideal for a chatbot.
        
    * Benchmarks show it **outperforms some larger models** in reasoning tasks.
        
3. **✅ Seamless vLLM Integration**
    
    * Since vLLM **supports OpenAI’s API**, I needed a model that played well with that framework.
        
    * Phi-3 works **out of the box** with vLLM, eliminating compatibility headaches.
        

## Alternative Models I Considered

| **Model** | **Size** | **Pros** | **Cons** |
| --- | --- | --- | --- |
| **LLaMA 3 8B** | 8B | ✅ Stronger performance | **❌ Too large for 10GB VRAM** |
| **Mistral 7B** | 7B | ✅ Great general reasoning | ❌ **Pushes memory limits** |
| **Gemma 2B** | 2B | ✅ Extremely lightweight | **❌ Inferior reasoning skills** |

## **Why Phi-3 Was the Best Fit**

Phi-3 struck the right balance between **size, performance, and efficiency**, making it the **best option for local inference on a 3080**.

<div data-node-type="callout">
<div data-node-type="callout-emoji">📌</div>
<div data-node-type="callout-text"><a target="_self" rel="noopener noreferrer nofollow" href="https://arxiv.org/abs/2404.14219" style="pointer-events: none">Phi-3 Technical Report</a></div>
</div>

* ✅ **Fast**
    
* ✅ **Lightweight**
    
* ✅ **Strong chat performance**
    
* ✅ **Easily deployable with vLLM**
    

Starting with **one solid model** made sense, but ChatUI supports **multiple models**, so I can expand later.

---

# **Preparing Phi-3 for vLLM**

Since this is a **self-hosted** setup, the model **must be stored locally**. There are several ways to download models, but I opted for **git** to keep things simple.

<div data-node-type="callout">
<div data-node-type="callout-emoji">📌</div>
<div data-node-type="callout-text"><strong><em>If storage is limited</em></strong><em>, using the Hugging Face Hub CLI is an alternative, it downloads models </em><strong><em>without full repository history</em></strong><em> to save space.</em></div>
</div>

## **Downloading Phi-3**

```bash
cd ~/working
git lfs install
git clone https://huggingface.co/microsoft/Phi-3-mini-4k-instruct
```

After running this, the folder structure should look like this:

```bash
/home/username
 |-- working
 │    |-- nginx
 │    |-- Phi-3-mini-4k-instruct
 │    |-- chat-ui
```

# Breaking Down the Container Configuration

Each container in this setup plays a specific role, and getting them to work together required **deliberate configuration choices**. Below, I’ll walk through:

* **Design Decisions** – Why I configured it this way and the trade-offs involved.
    
* **Configuration Details** – Key settings and how they impact functionality.
    
* **Troubleshooting Steps** – How I validated that each container was running correctly.
    

## **Understanding the Configuration**

This is **<mark>not</mark>** a plug-and-play setup. You **<mark>can’t</mark>** just copy and paste the full docker-compose.yml and expect it to work out of the box. Certain containers require additional configuration files and environment variables that I’ll cover in their respective sections.

If you’re following along, **make sure to review the highlighted sections**, those require extra setup.

### Container Overview

| **Component** | **Purpose** | **Requires Additional Configuration?** |
| --- | --- | --- |
| **vLLM** | Model inference server | No (defaults work) |
| **ChatUI** | Web frontend for chat | **➡️ Yes** (requires .env.local file) |
| **MongoDB** | Stores chat history | No (basic setup) |
| **NGINX** | Reverse proxy for secure access | **➡️ Yes** (requires custom nginx.conf) |
| **CertBot** | Automates SSL certificates | **➡️ Yes** (custom API-based setup for my domain provider) |

In the following sections, I’ll break down each container’s configuration, highlight potential pitfalls, and explain the reasoning behind key decisions.

---

# vLLM: The Model Inference Server

At the core of this self-hosted AI chatbot is **vLLM**, a highly optimized inference framework designed for efficient text generation. My goal was to maximize performance on an **RTX 3080** while ensuring **compatibility with ChatUI**, which integrates easily using an **OpenAI-compatible API**.

I previously covered why I chose vLLM over TGI, but to reiterate, vLLM offers **out-of-the-box compatibility with OpenAI’s API**, making it a drop-in replacement for services like OpenAI or Hugging Face APIs. This meant **seamless integration** with other components in my setup without needing to rewrite API interactions.

## vLLM Configuration

Here’s the docker-compose.yml configuration for vLLM:

```yaml
text-generation:
    image: vllm/vllm-openai:latest
    ports:
      - "8080:8000"
    volumes:
      - ./Phi-3-mini-4k-instruct:/data/model/Phi-3-mini-4k-instruct 
    command:
      - "--model"
      - "/data/model/Phi-3-mini-4k-instruct"
      - "--dtype"
      - "bfloat16" 
      - "--tensor-parallel-size"
      - "1"
      - "--gpu-memory-utilization"
      - "0.9"
      - "--max-model-len"
      - "3264"
      - "--max-num-batched-tokens"
      - "3264"
      - "--trust-remote-code"
    environment:
      NVIDIA_VISIBLE_DEVICES: all
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]
    runtime: nvidia
    container_name: text-generation
    restart: always
```

### vLLM - Key configuration choices

| **Parameter** | **Reasoning** |
| --- | --- |
| \--dtype bfloat16 | Reduces memory usage while maintaining precision. Best for RTX 3080. |
| \--tensor-parallel-size 1 | Since I only have one GPU in this setup, parallelism isn’t needed. |
| \--gpu-memory-utilization 0.9 | Maximizes VRAM usage while avoiding out-of-memory (OOM) errors. |
| \--max-model-len 3264 | Allows longer prompts while fitting within VRAM constraints. |
| \--trust-remote-code | Required for some Hugging Face models that need additional scripts. |

---

# Troubleshooting vLLM

vLLM **wasn’t plug-and-play**, and I hit a few roadblocks along the way. Here’s how I validated that it was working correctly and debugged common issues.

## 1️⃣ Ensuring vLLM is running properly

After deployment, I tested whether vLLM was active by running:

```bash
curl -X GET http://localhost:8080/v1/models
```

### **✅ Expected response (formatted for readability)**

```json
{
    "object": "list",
    "data": [
        {
            "id": "/data/model/Phi-3-mini-4k-instruct",
            "object": "model",
            "created": 1738295351,
            "owned_by": "vllm",
            "root": "/data/model/Phi-3-mini-4k-instruct",
            "parent": null,
            "max_model_len": 3264,
            "permission": [
                {
                    "id": "modelperm-18926d767c1346399251c729e0cd251a",
                    "object": "model_permission",
                    "created": 1738295351,
                    "allow_create_engine": false,
                    "allow_sampling": true,
                    "allow_logprobs": true,
                    "allow_search_indices": false,
                    "allow_view": true,
                    "allow_fine_tuning": false,
                    "organization": "*",
                    "group": null,
                    "is_blocking": false
                }
            ]
        }
    ]
}
```

If this request **fails**, check the logs for errors:

```bash
sudo docker logs text-generation
```

## **2️⃣ Common issues you may encounter**

### **Model Path Mismatch**

Ensure that the **volume mounts are correct**. The host directory ./Phi-3-mini-4k-instruct should be properly mapped to /data/model/Phi-3-mini-4k-instruct in the container.

### **GPU Visibility Issues**

If vLLM can’t access the GPU, check nvidia-smi:

```bash
sudo docker exec -it text-generation nvidia-smi
```

If the GPU **isn’t detected**, the issue is likely related to missing drivers, an incorrect runtime setting in Docker, or the NVIDIA Container Toolkit not being configured correctly.

## **3️⃣ Validating Inference Works via API**

To ensure text generation was functioning properly, I ran a test request directly from the Docker host:

```bash
curl -X POST http://localhost:8080/v1/chat/completions -H "Authorization: Bearer sk-fake-key" -H "Content-Type: application/json" -d '{
    "model": "/data/model/Phi-3-mini-4k-instruct",
    "messages": [{"role": "user", "content": "Hello, what is AI?"}]
  }'
```

### **✅ Expected response (formatted for readability)**

```json
{
    "id": "chatcmpl-9375af51aa3f479db7c3053e33eb753d",
    "object": "chat.completion",
    "created": 1738296405,
    "model": "/data/model/Phi-3-mini-4k-instruct",
    "choices": [
        {
            "index": 0,
            "message": {
                "role": "assistant",
                "content": " Artificial Intelligence (AI) .... blah blah blah",
                "tool_calls": []
            },
            "logprobs": null,
            "finish_reason": "stop",
            "stop_reason": 32007
        }
    ],
    "usage": {
        "prompt_tokens": 10,
        "total_tokens": 179,
        "completion_tokens": 169,
        "prompt_tokens_details": null
    },
    "prompt_logprobs": null
}
```

## Debugging networking issues

One of the trickiest parts of setting up vLLM was **getting the container networking right**. Since containers handle networking behind the scenes, misconfigurations can cause connection failures between ChatUI and vLLM.

## **4️⃣ Testing Connectivity from Another Container**

I confirmed that ChatUI could talk to vLLM by running a cURL test **inside the ChatUI container**:

```bash
sudo docker exec -it chatui bash
curl -X POST http://text-generation:8000/v1/chat/completions \
-H "Authorization: Bearer sk-fake-key" \
-H "Content-Type: application/json" \
-d '{
    "model": "/data/model/Phi-3-mini-4k-instruct",
    "messages": [{"role": "user", "content": "Hello, what is AI?"}]
}'
```

If this request **fails**, the issue is likely **container networking**. I resolved it by explicitly defining a **dedicated Docker network** for this deployment in my final configuration.

---

# Thoughts on the vLLM deployment

Deploying vLLM with Phi-3 Mini was an **exercise in balancing performance and efficiency**. The **RTX 3080 handles it well**, but it’s clear that **more powerful models** (LLaMA 3, Mistral, etc.) would need more VRAM.

### **Would I recommend vLLM for local inference?**

Absolutely. If you need solid performance and **compatibility with OpenAI-style APIs**, vLLM is a **great choice**.

### **Next Steps for My Setup**

* **Deploy multiple models** for **on-the-fly model switching** in ChatUI.
    
* **Optimize memory usage** for longer prompts.
    
* **Enhance functionality** with **web search** and **retrieval-augmented generation (RAG)**.
    

---

# Final Thoughts - vLLM

Setting up vLLM **wasn’t as easy as I expected**, but once everything was dialed in, it worked **flawlessly**. The biggest hurdles were **container networking** and **GPU resource management**, but **debugging logs and running manual API tests** made troubleshooting straightforward.

If you’re looking to self-host an AI chatbot, **vLLM is a powerful, flexible option** - and one that **scales well for local deployments**.

---

# ChatUI: The Frontend Interface

With **vLLM handling inference**, the next step was setting up **ChatUI** - a **web-based chat interface** that makes interacting with the model easy. ChatUI provides an OpenAI-style frontend, so I didn’t need to build my own UI from scratch.

### **Why ChatUI?**

I briefly mentioned ChatUI earlier, but let’s break down why I chose it:

* **OpenAI-compatible** – Works seamlessly with vLLM **without major modifications**.
    
* **Lightweight and simple** – Minimal dependencies, making deployment straightforward.
    
* **Multi-model support** – Allows loading multiple models and switching between them in the UI.
    
* **Customizable API endpoints** – Ensures all requests are routed to **my self-hosted AI** instead of external APIs.
    

### ChatUI Docker Configuration

Here’s how I set up ChatUI using **Docker Compose**, connecting it to **MongoDB** for chat history and **vLLM** for inference:

```yaml
  chat-ui:
    image: ghcr.io/huggingface/chat-ui:latest # Chat UI container
    ports:
      - "3000:3000" # Expose Chat UI on port 3000
    environment:
      MONGODB_URL: mongodb://mongo-chatui:27017 # MongoDB URL for frontend
    volumes:
      - ./chat-ui/.env.local:/app/.env.local
    container_name: chatui
    restart: always
```

This configuration ensures ChatUI:

* ✅ Connects to **MongoDB** for storing conversations.
    
* ✅ Runs on **port 3000** for easy web access.
    
* ✅ Reads settings from **.env.local**, making it easy to tweak configurations.
    

---

# **Creating the ChatUI Configuration File**

The .env.local file controls ChatUI’s settings, including which **AI models** are available and where to send requests.

### **1️⃣ Create the Configuration File**

```bash
cd ~/working/chat-ui
nano .env.local
```

### **2️⃣ Add Configuration Details**

```plaintext
### Models ###
MODELS=`[
    {
      "name": "/data/model/Phi-3-mini-4k-instruct",
      "description": "Microsoft's Phi-3 Model",
      "promptExamples": [
        {
          "title": "Write an email from bullet list",
          "prompt": "As a restaurant owner, write a professional email to the supplier to get these products every week: \n\n- Wine (x10)\n- Eggs (x24)\n- Bread (x12)"
        }, {
          "title": "Code a snake game",
          "prompt": "Code a basic snake game in python, give explanations for each step."
        }, {
          "title": "Assist in a task",
          "prompt": "How do I make a delicious grilled cheese sandwich?"
        }
      ],
      "endpoints": [
      {
        "type": "openai",
        "baseURL": "http://text-generation:8000/v1"
      }
      ]
    }
]`

### MongoDB ###
MONGODB_URL=mongodb://mongo-chatui:27017
USE_HF_API=false
USE_OPENAI_API=false

## Removed models, useful for migrating conversations
# { name: string, displayName?: string, id?: string, transferTo?: string }`
OLD_MODELS=`[]`

### Task model ###
# name of the model used for tasks such as summarizing title, creating query, etc.
# if not set, the first model in MODELS will be used
TASK_MODEL="/data/model/Phi-3-mini-4k-instruct"

### Authentication ###

# if it's defined, only these emails will be allowed to use login
ALLOWED_USER_EMAILS=`[]` 
# If it's defined, users with emails matching these domains will also be allowed to use login
ALLOWED_USER_DOMAINS=`[]`
# valid alternative redirect URLs for OAuth, used for HuggingChat apps
ALTERNATIVE_REDIRECT_URLS=`[]` 
### Cookies
# name of the cookie used to store the session
COOKIE_NAME=hf-chat

## Websearch configuration
PLAYWRIGHT_ADBLOCKER=true
WEBSEARCH_ALLOWLIST=`[]` # if it's defined, allow websites from only this list.
WEBSEARCH_BLOCKLIST=`[]` # if it's defined, block websites from this list.
WEBSEARCH_JAVASCRIPT=true # CPU usage reduces by 60% on average by disabling javascript. Enable to improve website compatibility
WEBSEARCH_TIMEOUT=3500 # in milliseconds, determines how long to wait to load a page before timing out
ENABLE_LOCAL_FETCH=false # set to true to allow fetches on the local network. /!\ Only enable this if you have the proper firewall rules to prevent SSRF attacks and understand the implications.

## Public app configuration ##
PUBLIC_APP_GUEST_MESSAGE= #a message to the guest user. If not set, no message will be shown. Only used if you have authentication enabled.
PUBLIC_APP_NAME="Bri-Chat" # name used as title throughout the app
PUBLIC_APP_ASSETS=chatui # used to find logos & favicons in static/$PUBLIC_APP_ASSETS
PUBLIC_ANNOUNCEMENT_BANNERS=`[
    {
    "title": "Welcome to ChatUI",
    "linkTitle": "Check out Brian's blog",
    "linkHref": "https://blog.brianbaldock.net"
  }
]`
PUBLIC_SMOOTH_UPDATES=false # set to true to enable smoothing of messages client-side, can be CPU intensive

### Feature Flags ###
LLM_SUMMARIZATION=false # generate conversation titles with LLMs
ENABLE_ASSISTANTS=false #set to true to enable assistants feature
ENABLE_ASSISTANTS_RAG=false # /!\ This will let users specify arbitrary URLs that the server will then request. Make sure you have the proper firewall rules in place. 
REQUIRE_FEATURED_ASSISTANTS=false # require featured assistants to show in the list
COMMUNITY_TOOLS=false # set to true to enable community tools
EXPOSE_API=true # make the /api routes available
ALLOW_IFRAME=true # Allow the app to be embedded in an iframe

### Tools ###
# Check out public config in `chart/env/prod.yaml` for more details
TOOLS=`[]` 

USAGE_LIMITS=`{}`

### HuggingFace specific ###
# Let user authenticate with their HF token in the /api routes. This is only useful if you have OAuth configured with huggingface.
USE_HF_TOKEN_IN_API=false

### Metrics ###
METRICS_ENABLED=false
METRICS_PORT=5565
LOG_LEVEL=info

# Remove or leave blank any unused API keys
OPENAI_API_KEY=
```

The file configures:

* ✅ **Model selection** (Phi-3 Mini)
    
* ✅ **MongoDB connection** for chat history
    
* ✅ **Frontend branding** (custom name, banners, etc.)
    
* ✅ **API exposure**
    

---

# Troubleshooting ChatUI

Like vLLM, ChatUI **wasn’t plug-and-play**. Here’s how I debugged the common issues.

## **1️⃣ Making sure ChatUI talks to vLLM**

One of the biggest problems I faced was **ChatUI trying to connect to OpenAI instead of my local vLLM server**. To check where requests were going, I used **browser dev tools**:

1. Open **ChatUI** in a browser ([http://&lt;docker host IP&gt;:3000](http://localhost:3000)).
    
2. Press **F12** (or right-click → Inspect) to open **Developer Tools**.
    
3. Go to the **Network** tab and send a test message.
    
4. Look for requests to /v1/chat/completions.
    

### ✅ **Expected request URL**

```bash
http://text-generation:8000/v1/chat/completions
```

❌ **If the request goes to api.openai.com, then:**

* The *.env.local* file is incorrect.
    
* The baseURL value might be missing or incorrectly set.
    

💡 **Fix: Update .env.local and restart ChatUI:**

```bash
sudo docker restart chatui
```

## **2️⃣ Running a Direct API Test from Inside the ChatUI Container**

If the frontend **isn’t returning responses**, I tested the API connection manually inside the **ChatUI container**:

```bash
sudo docker exec -it chatui bash

# Inside the ChatUI container now
curl -X POST http://text-generation:8000/v1/chat/completions -H "Authorization: Bearer sk-fake-key" -H "Content-Type: application/json" -d '{
    "model": "/data/model/Phi-3-mini-4k-instruct",
    "messages": [{"role": "user", "content": "Hello, what is AI?"}]
  }'
```

### **✅ Expected response (formatted for readability):**

```yaml
{
    "id": "chatcmpl-9375af51aa3f479db7c3053e33eb753d",
    "object": "chat.completion",
    "created": 1738296405,
    "model": "/data/model/Phi-3-mini-4k-instruct",
    "choices": [
        {
            "index": 0,
            "message": {
                "role": "assistant",
                "content": " Artificial Intelligence (AI) .... blah blah blah",
                "tool_calls": []
            },
            "logprobs": null,
            "finish_reason": "stop",
            "stop_reason": 32007
        }
    ],
    "usage": {
        "prompt_tokens": 10,
        "total_tokens": 179,
        "completion_tokens": 169,
        "prompt_tokens_details": null
    },
    "prompt_logprobs": null
}
```

❌ **If this request fails,** there’s likely a **networking issue** between ChatUI and vLLM.

## **3️⃣ Debugging Networking Issues**

One of the most frustrating parts of the setup was **container networking**.

To check whether ChatUI could reach vLLM, I ran a simple connectivity test inside the ChatUI container:

```bash
sudo docker exec -it chatui curl -I http://text-generation:8000/v1/models
```

### ✅ **Expected output:**

```bash
HTTP/1.1 200 OK
```

❌ **If the request fails:**

* The docker network isn’t configured properly.
    
* vLLM isn’t running (docker ps to check).
    

💡 **Fix:** Explicitly define a **Docker network** in docker-compose.yml:

```yaml
networks:
  chat-network:
    name: chat-network
    driver: bridge
```

Then **restart everything**:

```bash
sudo docker-compose down && sudo docker-compose up -d
```

---

# **Final Thoughts on ChatUI**

Once ChatUI was configured properly, it **worked exactly as expected**:

* **✅ Low-latency responses** even on an RTX 3080
    
* ✅ **Fully private** – no external API calls
    
* **✅ Scalable** – can support multiple models later
    

Next Steps:

* **Enable authentication** for secure access
    
* **Deploy more models** and allow switching in the UI
    
* **Improve caching & performance**
    

With ChatUI in place, I now had a **functional, self-hosted AI assistant** running entirely on my own hardware.

---

# MongoDB: Storing Chat History and Context

With **vLLM handling inference** and **ChatUI providing the frontend**, the next piece was **storing chat history**. MongoDB made the most sense here since **ChatUI requires it for storing past conversations**.

This setup ensures:

* ✅ Users can **continue conversations** even after closing ChatUI.
    
* ✅ The system maintains **chat history** for context-aware responses.
    
* ✅ Queries remain **fast and efficient** without unnecessary complexity.
    

## Why MongoDB?

MongoDB wasn’t a choice I actively made, it was **required by ChatUI**. That said, it fits well for this use case:

* **Native ChatUI Support** – ChatUI is **built to use MongoDB**, making setup seamless.
    
* **Flexible Schema** – Since chat logs **don’t have a fixed structure**, MongoDB handles this well.
    
* **Lightweight** – Minimal resource overhead, making it **ideal for containerized environments**.
    
* **Persistent Storage** – Conversations **aren’t lost** between restarts, improving usability.
    

## MongoDB Docker Configuration

Here’s the **Docker Compose** configuration for **MongoDB**, ensuring it integrates smoothly with ChatUI:

```yaml
  # MongoDB for storing history/context
  mongo-chatui:
    image: mongo:latest # MongoDB container
    ports:
      - "27017:27017" # Expose MongoDB on the default port
    volumes:
      - ./mongo-data:/data/db # Persist MongoDB data
    container_name: mongo-chatui
    restart: always
```

### Key Configuration Choices

| **Parameter** | **Reasoning** |
| --- | --- |
| 27017:27017 | Exposes the MongoDB service on its default port. |
| ./mongo-data:/data/db | Ensures chat history is persisted even if the container restarts. |
| restart: always | Ensures MongoDB automatically restarts if it crashes. |

# **Troubleshooting MongoDB**

This container worked as expected **right out of the box**, so I didn’t run into major issues. However, here are a few quick verification steps if something goes wrong:

## **1️⃣ Check if the container is running**

```bash
sudo docker ps | grep mongo-chatui
```

### ✅ Expected Output:

The container should be **running** with a **stable uptime**.

## **2️⃣ Verify MongoDB is accepting connections**

```bash
mongo --host localhost --port 27017 --eval "db.stats()"
```

### ✅ Expected Output:

A JSON response with **database statistics**, confirming the DB is accessible.

---

# Final Thoughts on MongoDB

With MongoDB properly configured, **ChatUI now maintains session history**, but there are areas to improve:

* **✅ Implement indexing** – To speed up query times.
    
* **✅ Optimize storage** – Automate **log cleanup** over time.
    
* **✅ Monitor performance** – As usage scales, keeping track of **resource consumption** will be important.
    

This setup provides a **simple, persistent chat history solution**, laying the groundwork for **future optimizations**.

---

# NGINX: Reverse Proxy for Secure Access

Once **vLLM**, **ChatUI**, and **MongoDB** were up and running, I needed a way to make the deployment secure and accessible via a domain. While I haven’t exposed this setup to the internet, I’m using a public domain for **SSL certificates**. This is where **NGINX** comes in, acting as a reverse proxy, handling **SSL termination**, routing, and ensuring everything is accessible from a single domain.

## Why use NGINX?

* **Reverse Proxy:** Routes traffic from a **single domain** to multiple internal services.
    
* **SSL Termination:** Handles **HTTPS encryption** via **Certbot and Let’s Encrypt**.
    
* **Performance Boost:** Enables **caching** and optimizes request handling for faster responses.
    
* **Security:** Hides internal containers from direct exposure, securing ports like **8080, 3000, and 27017**.
    

## NGINX Docker Configuration

Here’s the **Docker Compose** configuration for NGINX:

```yaml
# NGINX Reverse Proxy
  nginx:
    image: nginx:latest
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/certs:/etc/letsencrypt:ro
    container_name: nginx
    depends_on:
      - chat-ui
      - text-generation
    restart: always
```

## Key Configuration Choices

| **Parameter** | **Reasoning** |
| --- | --- |
| 80:80, 443:443 | Exposes NGINX on standard HTTP/HTTPS ports. |
| ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro | Mounts a custom NGINX config for routing requests. |
| ./nginx/certs:/etc/letsencrypt:ro | Ensures SSL certificates from Certbot are used. |
| depends\_on | Ensures ChatUI and vLLM start before NGINX. |

## The NGINX Configuration (nginx.conf)

Navigate to the NGINX folder to create the configuration file:

```bash
cd ~/working/nginx
nano nginx.conf
```

Paste the following configuration:

```bash
events {
    worker_connections 1024;
}

http {
    server_tokens off;
    charset utf-8;

    # General HTTP server for nginx status or redirects
    server {
        listen 80 default_server;
        listen [::]:80 default_server;

        location /nginx_status {
            stub_status on;
            allow 127.0.0.1; # Allow only localhost to access this
            deny all;
        }
    }

    # Frontend (Chat UI)
    server {
        listen 443 ssl http2;
        listen [::]:443 ssl http2;
        server_name chat.brianbaldock.net;

        ssl_certificate /etc/letsencrypt/live/<YOURDOMAINNAME>/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/<YOURDOMAINNAME>/privkey.pem;

        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_prefer_server_ciphers on;
        ssl_ciphers HIGH:!aNULL:!MD5;

        client_max_body_size 15G;

        location / {
            proxy_pass http://chat-ui:3000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            # WebSocket support (optional, depending on your frontend)
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }
    }

    # Backend (Text Generation API)
    server {
        listen 443 ssl http2;
        listen [::]:443 ssl http2;
        server_name api.chat.brianbaldock.net;

        ssl_certificate /etc/letsencrypt/live/<YOURDOMAINNAME>/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/<YOURDOMAINNAME>/privkey.pem;

        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_prefer_server_ciphers on;
        ssl_ciphers HIGH:!aNULL:!MD5;

        client_max_body_size 15G;

        location / {
            proxy_pass http://text-generation:8000/v1/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }

    # HTTP Redirect (Redirect HTTP to HTTPS)
    server {
        listen 80;
        listen [::]:80;
        server_name <YOURDOMAINNAME> api.<YOURDOMAINNAME>;

        return 301 https://$host$request_uri;
    }
}
```

## What this configuration does

* **Redirects HTTP to HTTPS** (forces encrypted connections).
    
* **Routes &lt;YOURDOMAINNAME&gt; to ChatUI**.
    
* **Proxies API calls to vLLM** (/v1/ endpoint).
    
* **Handles SSL Certificates** via Certbot.
    
* **Supports HTTP/2** for better performance.
    

## ⚠️ What You Need to Modify

| **Setting** | **Update This** |
| --- | --- |
| &lt;YOURDOMAIN&gt; | Replace with your actual domain name (e.g., chat.example.com) |
| SSL Certificate Paths | Ensure Certbot paths match your domain. |
| proxy\_pass http://chat-ui:3000; | Update if ChatUI uses a different container name or port. |
| proxy\_pass http://text-generation:8000/v1/; | Modify if vLLM’s container name or port changes.Troubleshooting NGINX |

---

# Troubleshooting NGINX

## 1️⃣ Check if NGINX is running

```bash
sudo docker ps | grep nginx
```

If NGINX isn’t running or keeps restarting:

```bash
sudo docker logs nginx
```

## 2️⃣ Test ChatUI access via NGINX

From the Docker host, verify that ChatUI is accessible through NGINX:

```bash
curl -I https://<YOURDOMAIN>
```

### **✅ Expected output**

```bash
HTTP/2 200 
server: nginx
date: ""
content-type: text/html; charset=utf-8
```

---

# Final Thoughts on the NGINX deployment

With NGINX properly configured

* **ChatUI** is now accessible via HTTPS.
    
* **All traffic** is proxied through a single, controlled entry point.
    
* **TLS encryption** keeps your data secure while improving performance with HTTP/2.
    

This setup adds a solid security layer while keeping everything manageable and scalable.

---

# Certbot: Automating SSL Certificates for Secure Connections

With **NGINX** acting as the reverse proxy, the next step was securing all connections with **TLS**. Instead of manually managing certificates, I used **Certbot**, an automated tool for obtaining **Let’s Encrypt SSL certificates** and handling renewals.

While many DNS registrars offer APIs to automate Let’s Encrypt certificate creation, the process often requires some tweaking. Fortunately, GitHub is packed with scripts, plugins, and Docker container builds for different registrars.

In my case, I customized a Certbot container to support **Porkbun** (who are awesome, by the way, [https://porkbun.com](https://porkbun.com)). It was a straightforward configuration but required some trial and error to get right.

## **Why Use DNS-Based Validation?**

I chose **DNS-based validation** over the traditional HTTP method because:

* **No Need to Expose Port 80:** I didn’t want to open HTTP ports on my Docker host just for certificate validation.
    
* **API Integration:** Let’s Encrypt can communicate directly with my registrar via API, making the process seamless.
    

If you’re using a different registrar, you’ll need to adjust the process accordingly.

---

# Certbot configuration and customizations

## 1️⃣ Pull the Latest Certbot Image

```bash
# Pull down the default image for Certbot
sudo docker pull certbot/certbot:latest
```

## 2️⃣ Set Up the Working Directory

```bash
mkdir ~/working/certbot-porkbun
mkdir ~/.secrets
```

The .secrets folder keeps sensitive API credentials out of your bash history.

## 3️⃣ Create the Custom Dockerfile

Navigate to the certbot-porkbun directory and create a **Dockerfile:**

```bash
cd ~/working/certbot-porkbun
nano Dockerfile
```

```bash
FROM certbot/certbot:latest

# Install pip if not already installed
RUN apk add --no-cache python3 py3-pip

# Install the certbot_dns_porkbun plugin
RUN pip3 install certbot-dns-porkbun
```

<div data-node-type="callout">
<div data-node-type="callout-emoji">💡</div>
<div data-node-type="callout-text"><strong><em>Don’t forget to create a new API key and enable your domain for API Access (in the case of Porkbun)</em></strong></div>
</div>

## 4️⃣ Add Your API Credentials

```bash
nano ~/.secrets/porkbun.ini
```

Insert your API key and secret:

```bash
dns_porkbun_key=<keyid>
dns_porkbun_secret=<secretid>
```

Ensure the file has secure permissions:

```bash
chmod 600 ~/.secrets/porkbun.ini
```

## 5️⃣ Build the Custom Certbot Image

```bash
docker build -t certbot-porkbun .
```

## 6️⃣ Request your SSL Certificate

Run the following command to spin up the new container image and generate your certificate:

```bash
sudo docker run --rm -it \
    -v ~/working/nginx/certs:/etc/letsencrypt \
    -v ~/.secrets/porkbun.ini:/etc/letsencrypt/porkbun.ini \
    certbot-porkbun certonly \
    --non-interactive \
    --agree-tos \
    --email your@email.com \
    --preferred-challenges dns \
    --authenticator dns-porkbun \
    --dns-porkbun-credentials /etc/letsencrypt/porkbun.ini \
    --dns-porkbun-propagation-seconds 600 \
    -d <YOURDOMAINNAME> \
    -d api.<YOURDOMAINNAME>
```

<div data-node-type="callout">
<div data-node-type="callout-emoji">💡</div>
<div data-node-type="callout-text">Porkbun’s default TTL is 600 seconds, which can slow down propagation. You <em>might</em> get away with 60 seconds, but Certbot will likely throw a warning.</div>
</div>

## 7️⃣ Automate Certificate Renewal with Docker Compose

Add this to your docker-compose.yml file:

```bash
  # Certbot for SSL Certificates
  certbot:
    image: certbot-porkbun
    volumes:
      - ./nginx/certs:/etc/letsencrypt
    entrypoint: /bin/sh -c "trap exit TERM; while :; do sleep 6h & wait $${!}; certbot renew; done"
    container_name: certbot-porkbun
    restart: unless-stopped
```

* The container checks for certificate renewals every **6 hours**.
    
* The certbot renew command ensures certificates stay up-to-date without manual intervention.
    

---

# Thoughts on the Certbot Deployment

With the Certbot container properly configured:

* **SSL/TLS certificates** are issued and renewed automatically.
    
* **ChatUI** and **vLLM** are securely accessible via HTTPS.
    
* All data in transit is **encrypted** for end-to-end security.
    

This setup makes SSL management effortless, don’t have to think about manual renewals.

---

# Full docker-compose.yml: Bringing Everything Together

After configuring **vLLM**, **ChatUI**, **MongoDB**, **NGINX**, and **Certbot**, it’s time to bring everything together into a unified docker-compose.yml file. This file defines the entire deployment, ensuring all services work seamlessly.

If you’ve followed the prerequisites and configuration instructions for **NGINX**, **ChatUI**, and **Certbot**, you should be able to copy this file into your working directory, run one command, and spin up your own chatbot. *(Notice the networks section at the end, this is important for container communication.)*

---

## Final docker-compose.yml configuration

```yaml
services:
  # vLLM Backend
  text-generation:
    image: vllm/vllm-openai:latest
    ports:
      - "8080:8000"  # vLLM API Server
    volumes:
      - ./Phi-3-mini-4k-instruct:/data/model/Phi-3-mini-4k-instruct 
    command:
      - "--model"
      - "/data/model/Phi-3-mini-4k-instruct"
      - "--dtype"
      - "bfloat16" 
      - "--tensor-parallel-size"
      - "1"
      - "--gpu-memory-utilization"
      - "0.9"
      - "--max-model-len"
      - "3264"
      - "--max-num-batched-tokens"
      - "3264"
      - "--trust-remote-code"
    environment:
      NVIDIA_VISIBLE_DEVICES: all
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]
    runtime: nvidia
    container_name: text-generation
    restart: always

  # The frontend
  chat-ui:
    image: ghcr.io/huggingface/chat-ui:latest # Chat UI container
    ports:
      - "3000:3000" # Expose Chat UI on port 3000
    environment:
      MONGODB_URL: mongodb://mongo-chatui:27017 # MongoDB URL for frontend
    volumes:
      - ./chat-ui/.env.local:/app/.env.local
    container_name: chatui
    restart: always

  # MongoDB for storing history/context
  mongo-chatui:
    image: mongo:latest # MongoDB container
    ports:
      - "27017:27017" # Expose MongoDB on the default port
    volumes:
      - ./mongo-data:/data/db # Persist MongoDB data
    container_name: mongo-chatui
    restart: always

  # NGINX Reverse Proxy
  nginx:
    image: nginx:latest
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/certs:/etc/letsencrypt:ro
    container_name: nginx
    depends_on:
      - chat-ui
      - text-generation
    restart: always

  # Certbot for SSL Certificates
  certbot:
    image: certbot-porkbun
    volumes:
      - ./nginx/certs:/etc/letsencrypt
    entrypoint: /bin/sh -c "trap exit TERM; while :; do sleep 6h & wait $${!}; certbot renew; done"
    container_name: certbot-porkbun
    restart: unless-stopped

networks:
  chat-network:
    name: chat-network
    driver: bridge
```

---

# How to deploy everything

Once the docker-compose.yml file is ready, deployment is as simple as:

```bash
sudo docker-compose up -d
```

## **✅ Verifying Deployment**

To check if everything’s running smoothly:

```bash
sudo docker ps
```

* All containers should show a similar uptime.
    
* If a container is restarting, check its logs:
    

```bash
sudo docker logs <container_name>
```

You should now be able to access ChatUI and start chatting with your model!

Example: I think Phi-3 is happy to be featured in this blog post.

![ChatUI web interface with the locally served Phi-3 model responding in a chat](/images/deploying-local-ai-inference-with-vllm-and-chatui-in-docker/3c3639a5-81fe-452b-a358-2cbca4c6f72b.png)

---

# Lessons learned

1. **Use a dedicated docker network**
    
    * Avoids conflicts between containers.
        
    * Prevents duplicate networks causing routing issues.
        
2. **Double-check environment variables**
    
    * Ensure the right endpoints are set.
        
3. **Verify connectivity between containers**
    
    * Running cURL inside the containers helped troubleshoot API connection issues.
        
4. **Monitor logs for debugging**
    
    * Don’t be afraid to get your hands dirty and check out the container logs.
        

---

# Final Thoughts

This self-hosted AI assistant should now be fully operational with

* ✅ A local LLM inference server
    
* ✅ A secure web interface
    
* ✅ Full HTTPS support
    
* ✅ Persistent chat history
    

The deployment is scalable, secure, and future-ready.

---

# Wrapping It Up: The Journey, The Lessons, and What’s Next!

What started as a simple curiosity project quickly turned into a deep dive into self-hosted AI, containerized deployments, and debugging Docker networking nightmares. Along the way, I learned a lot. Some of it the hard way.

At the end of the day, this setup works. It’s fast, secure, and completely under my control. No API costs, no privacy concerns, just a local AI assistant running on my own hardware.

## **Lessons That Stuck With Me**

* **Nothing is truly plug-and-play** – Even with solid documentation, real-world deployments always require tweaks, troubleshooting, and some extensive searching.
    
* **Container networking can be a pain** – Debugging why one container can’t talk to another inside Docker’s virtual network was probably the biggest headache. Using a dedicated network and running cURL tests from within containers made all the difference.
    
* **Self-hosting an LLM is totally doable** – Even on a consumer-grade GPU like the RTX 3080, inference speeds are surprisingly snappy with Phi-3 and vLLM.
    
* **Certbot with DNS validation is the way to go** – No need to expose port 80, no manual renewal, just hands-off, automated SSL certs.
    
* **Future-proofing matters** – I designed this setup to be scalable, allowing for multiple models, additional tools, and even more powerful hardware down the line.
    

## **What’s Next?**

This was only the beginning. Some of the things I’d love to explore next include:

* **Multi-Model Support** – Deploying multiple LLMs and being able to switch between them on the fly in ChatUI.
    
* **Integrating RAG (Retrieval-Augmented Generation)** – Adding a local document index so the model can search and reference private documents.
    
* **Expanding the Infrastructure** – Maybe a multi-GPU setup or upgrading to a 4090 to push inference speeds even further.
    
* **Web-Connected AI** – Implementing a secure web search tool to allow the model to fetch real-time information.
    

Self-hosting AI is a game-changer. The more control we have over our own tools, the better.

## **Want to Try This Yourself?**

Everything in this article is reproducible, and I’d love to hear how it works for you! If you have any questions, improvements, or want to share your own builds, let’s connect. Drop a comment, or hit me up on [LinkedIn](https://www.linkedin.com/in/brianbaldock)!

Here’s to building cool things, breaking them, fixing them again, and learning along the way!
