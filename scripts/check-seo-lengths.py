#!/usr/bin/env python3
"""Check SHIPPED post titles/descriptions against SERP length limits.

Reads the actual content files under src/content/posts/, not a hardcoded list.
The earlier version of this script carried its own copy of the proposed strings,
which meant it happily reported "5/5 within limits" while describing text that
was no longer what the site shipped -- a verifier measuring its own homework.
Read the artifact, not the plan.

Titles get ` | Brian Baldock` appended by BaseLayout, so the rendered <title>
is what search engines truncate against.

Usage:
    python3 scripts/check-seo-lengths.py            # the five Bing-tracked posts
    python3 scripts/check-seo-lengths.py --all      # every post
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

SUFFIX = " | Brian Baldock"
TITLE_MAX = 60
# SERP truncation is by PIXEL width (~580px), not characters, so these are
# guidelines. Existing site titles run 49-79 chars. >75 is the real problem;
# do NOT tighten good copy to hit an invented number.
FULL_SOFT = 70
FULL_MAX = 75
DESC_MIN, DESC_MAX = 120, 160

# The posts with measurable Bing impression volume, per bing_blog_pages.py.
TRACKED = [
    "edge-profile-pro-tips",
    "deploying-local-ai-inference-with-vllm-and-chatui-in-docker",
    "win11arm-on-macos",
    "lightningcopilot-salesforce-meets-copilotstudio",
    "proxies-and-defender-for-endpoint",
]

POSTS = Path(__file__).resolve().parent.parent / "src" / "content" / "posts"


def field(text: str, name: str) -> str | None:
    m = re.search(rf'^{name}:\s*"(.*)"\s*$', text, re.M)
    return m.group(1) if m else None


def main() -> int:
    slugs = (
        sorted(p.stem for p in POSTS.glob("*.md"))
        if "--all" in sys.argv
        else TRACKED
    )

    problems = 0
    for slug in slugs:
        path = POSTS / f"{slug}.md"
        if not path.exists():
            print(f"{slug}\n   MISSING: {path}")
            problems += 1
            continue

        text = path.read_text()
        title = field(text, "title")
        desc = field(text, "description")

        if title is None or desc is None:
            print(f"{slug}\n   UNPARSED title/description (unquoted YAML?)")
            problems += 1
            continue

        full = len(title) + len(SUFFIX)
        bad = []
        if len(title) > TITLE_MAX:
            bad.append(f"title {len(title)}>{TITLE_MAX}")
        if full > FULL_MAX:
            bad.append(f"rendered {full}>{FULL_MAX}")
        if not (DESC_MIN <= len(desc) <= DESC_MAX):
            bad.append(f"desc {len(desc)} outside {DESC_MIN}-{DESC_MAX}")

        mark = "FAIL" if bad else "ok  "
        print(f"{mark} {slug}")
        print(f"       title {len(title):>3}/{TITLE_MAX}  rendered {full:>3}/{FULL_MAX}  desc {len(desc):>3}/{DESC_MIN}-{DESC_MAX}")
        if bad:
            print(f"       -> {', '.join(bad)}")
            problems += 1
        elif full > FULL_SOFT:
            print(f"       note: rendered {full} chars, may truncate on narrow SERPs")

    total = len(slugs)
    print(f"\n{total - problems}/{total} within limits")
    return 1 if problems else 0


if __name__ == "__main__":
    raise SystemExit(main())
