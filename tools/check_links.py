#!/usr/bin/env python3
"""Best-effort HTTP HEAD check on every deep link in every card.

Usage:  python tools/check_links.py [--max-failures N]

Failures are printed but do not crash CI by default. Use --strict to make
exit code non-zero when *any* link is broken (avoid this on CI for arXiv
which sometimes returns 503).
"""
from __future__ import annotations

import argparse
import re
import sys
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CARDS = sorted((ROOT / "docs" / "data" / "cards").glob("*.md"))

URL_RE = re.compile(r"https?://[^\s\)\]\"<>]+")

UA = "Mozilla/5.0 (compatible; ad-atlas-link-checker/1.0)"


def head(url: str, timeout: float = 8.0) -> tuple[str, int | None, str | None]:
    """Returns (url, status, error)."""
    try:
        req = urllib.request.Request(url, method="HEAD", headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return url, r.status, None
    except urllib.error.HTTPError as e:
        # arXiv returns 405 to HEAD; treat 4xx that aren't 404 as ok
        return url, e.code, None if e.code != 404 else "HTTP 404"
    except Exception as e:
        return url, None, str(e)[:200]


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--max-failures", type=int, default=10)
    p.add_argument("--strict", action="store_true")
    args = p.parse_args()

    urls: dict[str, list[str]] = {}
    for card in CARDS:
        text = card.read_text(encoding="utf-8")
        for u in URL_RE.findall(text):
            urls.setdefault(u, []).append(card.name)

    print(f"checking {len(urls)} unique URLs across {len(CARDS)} cards…")

    failures: list[tuple[str, str, list[str]]] = []
    with ThreadPoolExecutor(max_workers=12) as ex:
        futs = {ex.submit(head, u): u for u in urls}
        for f in as_completed(futs):
            u, status, err = f.result()
            if err:
                failures.append((u, err, urls[u]))

    print(f"done. failures: {len(failures)}")
    for u, err, where in failures[: args.max_failures]:
        print(f"  ✗ {u}\n      err: {err}\n      in:  {', '.join(where)}")

    if args.strict and failures:
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
