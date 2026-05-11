#!/usr/bin/env python3
"""Print the last text output of each labs/*.ipynb (used by CI as smoke evidence)."""
from __future__ import annotations
import glob
import json


def last_text(nb):
    last = ""
    for c in reversed(nb.get("cells", [])):
        if c.get("cell_type") != "code":
            continue
        for o in reversed(c.get("outputs", [])):
            if "text" in o:
                last = "".join(o["text"])
                if last.strip():
                    return last
    return last


for path in sorted(glob.glob("labs/lab*.ipynb")):
    with open(path) as f:
        nb = json.load(f)
    print(f"--- {path} ---")
    print(last_text(nb)[-1000:].rstrip())
    print()
