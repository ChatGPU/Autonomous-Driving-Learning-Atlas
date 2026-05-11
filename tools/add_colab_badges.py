#!/usr/bin/env python3
"""Idempotently inject an 'Open in Colab' badge into the first markdown cell of every lab notebook."""
from __future__ import annotations
import glob
import json
from pathlib import Path

REPO = "ChatGPU/Autonomous-Driving-Learning-Atlas"
BADGE_PREFIX = "[![Open In Colab]"

ROOT = Path(__file__).resolve().parents[1]
LABS = sorted((ROOT / "labs").glob("lab*.ipynb"))


def badge(nb_name: str) -> str:
    return (
        f"[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)]"
        f"(https://colab.research.google.com/github/{REPO}/blob/main/labs/{nb_name})\n\n"
    )


for path in LABS:
    nb = json.loads(path.read_text(encoding="utf-8"))
    cells = nb.get("cells", [])
    if not cells or cells[0].get("cell_type") != "markdown":
        print(f"skip (no leading markdown): {path.name}")
        continue
    src = "".join(cells[0]["source"]) if isinstance(cells[0]["source"], list) else cells[0]["source"]
    if BADGE_PREFIX in src:
        print(f"already badged: {path.name}")
        continue
    # insert badge just after the "# title" line
    lines = src.splitlines(keepends=True)
    insertion = badge(path.name)
    if lines and lines[0].lstrip().startswith("# "):
        new_src = lines[0] + insertion + "".join(lines[1:])
    else:
        new_src = insertion + src
    cells[0]["source"] = new_src.splitlines(keepends=True)
    path.write_text(json.dumps(nb, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"badged: {path.name}")
