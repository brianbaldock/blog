#!/usr/bin/env python3
"""Check the proposed SEO titles/descriptions against length limits.

Titles get ` | Brian Baldock` appended by BaseLayout, so the frontmatter title
budget is what search engines truncate against. Verifying lengths rather than
eyeballing them, because "looks about right" is how you ship a truncated title.
"""

from __future__ import annotations

SUFFIX = " | Brian Baldock"
TITLE_MAX = 60          # frontmatter title budget
# Rendered <title> length at which SERP truncation typically starts. Google
# truncates on PIXEL width (~580px) rather than characters, so this is a
# guideline, not a hard rule -- roughly 70 characters for mixed-case text.
# The site's existing titles run 49-79 chars, so treat >75 as the real problem
# and anything under that as acceptable. Do NOT tighten good copy to hit an
# invented number.
FULL_SOFT = 70
FULL_MAX = 75
DESC_MIN, DESC_MAX = 120, 160

PROPOSED = [
    ("edge-profile-pro-tips",
     "Manage Multiple Microsoft 365 Tenants with Edge Profiles",
     "Juggling several Microsoft 365 tenants? Set up separate Edge profiles for "
     "work and personal accounts so you stop signing in and out all day."),
    ("deploying-local-ai-inference-with-vllm-and-chatui-in-docker",
     "Run vLLM in Docker: Self-Hosted LLM with a Chat UI",
     "A working vLLM Docker setup with ChatUI and an NVIDIA GPU: compose file, "
     "GPU passthrough, and the config that actually serves a model."),
    ("win11arm-on-macos",
     "Windows 11 ARM64 on Apple Silicon with VMware Fusion",
     "Install Windows 11 ARM64 on an M-series Mac using VMware Fusion: VHDX to "
     "VMDK conversion, QEMU via Homebrew, and getting VMware Tools to install "
     "cleanly."),
    ("lightningcopilot-salesforce-meets-copilotstudio",
     "Embed Copilot Studio in Salesforce with Entra ID SSO",
     "Put a Copilot Studio agent inside Salesforce Lightning (LWC) with Entra ID "
     "single sign-on: MSAL auth, and a token flow that survives Locker Service."),
    ("proxies-and-defender-for-endpoint",
     "Defender for Endpoint Behind a Proxy: Configuration Guide",
     "How to configure Microsoft Defender for Endpoint behind a proxy: registry "
     "and netsh options, the URLs MDE needs reachable, and how to verify "
     "connectivity."),
]


def main() -> int:
    bad = 0
    for slug, title, desc in PROPOSED:
        full = title + SUFFIX
        t_ok = len(title) <= TITLE_MAX
        f_ok = len(full) <= FULL_MAX
        d_ok = DESC_MIN <= len(desc) <= DESC_MAX

        flag = "" if (t_ok and f_ok and d_ok) else "  <-- PROBLEM"
        if flag:
            bad += 1
        print(f"{slug[:46]}{flag}")
        print(f"   title {len(title):>3}/{TITLE_MAX}  "
              f"rendered {len(full):>3}/{FULL_MAX}  desc {len(desc):>3}"
              f"/{DESC_MIN}-{DESC_MAX}")
        if not f_ok:
            print(f"   rendered title EXCEEDS {FULL_MAX}: {full}")
        elif len(full) > FULL_SOFT:
            print(f"   note: rendered {len(full)} chars, may truncate on narrow SERPs")
        if not d_ok:
            print("   description out of range")

    print(f"\n{len(PROPOSED) - bad}/{len(PROPOSED)} within limits")
    return 1 if bad else 0


if __name__ == "__main__":
    raise SystemExit(main())
