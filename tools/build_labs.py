#!/usr/bin/env python3
"""Build labs/*.ipynb notebooks from compact cell specs in tools/lab_specs.py.

Each lab is `(filename, [(cell_type, source_text), ...])`. We import the spec
list and write minimal, valid nbformat-4 notebooks.

Run:  python tools/build_labs.py
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LABS = ROOT / "labs"
LABS.mkdir(exist_ok=True)
sys.path.insert(0, str(Path(__file__).resolve().parent))
import lab_specs  # noqa: E402


def make_nb(cells):
    nb_cells = []
    for i, (ctype, src) in enumerate(cells):
        if isinstance(src, str):
            src_lines = src.splitlines(keepends=True)
            if src and not src.endswith("\n"):
                src_lines = (src + "\n").splitlines(keepends=True)
        else:
            src_lines = list(src)
        cell = {"cell_type": ctype, "id": f"cell-{i:02d}", "metadata": {}, "source": src_lines}
        if ctype == "code":
            cell["execution_count"] = None
            cell["outputs"] = []
        nb_cells.append(cell)
    return {
        "cells": nb_cells,
        "metadata": {
            "kernelspec": {"display_name": "Python 3", "language": "python", "name": "python3"},
            "language_info": {"name": "python", "version": "3.11"},
        },
        "nbformat": 4,
        "nbformat_minor": 5,
    }


def main():
    for fname, cells in lab_specs.LABS:
        out = LABS / fname
        out.write_text(json.dumps(make_nb(cells), ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
        print(f"wrote {out.relative_to(ROOT)}  ({len(cells)} cells)")


if __name__ == "__main__":
    main()
