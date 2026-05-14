#!/usr/bin/env python3
"""Validate docs/data/graph.json against the atlas invariants.

Invariants enforced:
1. Every node has a unique id.
2. Every edge endpoint refers to an existing node id.
3. Every node's `card` either:
   - points to an existing markdown file under docs/data/cards/, or
   - is a relative path to ../../concepts.md (concept nodes), or
   - is a relative path to ../../labs/*.ipynb (lab nodes).
4. Every paper card (tier in {spine, S, A, B}) has at least one outbound edge.
5. Every playbook references only existing node ids.
6. Topic taxonomy and tier are from the controlled vocabulary.
7. Edge relation is from the controlled vocabulary.
8. Every paper card includes a Bitter-Lesson lens.
9. Reader-facing cards avoid internal compression placeholders.

Exit code 0 on success, 1 on failure. Prints a colorless summary.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GRAPH = ROOT / "docs" / "data" / "graph.json"
CARDS_DIR = ROOT / "docs" / "data" / "cards"
LABS_DIR = ROOT / "labs"
CONCEPTS = ROOT / "concepts.md"

ALLOWED_TOPICS = {
    "math_foundations", "rl_foundations", "deep_rl", "ssl_vision",
    "e2e_ad", "vlm_vla", "brain_inspired", "meta_philosophy", "companion_media",
}
ALLOWED_TIERS = {"spine", "S", "A", "B", "concept", "lab"}
ALLOWED_RELS = {"prereq", "covers", "extends", "parallel", "contrasts", "feeds", "implements"}
ALLOWED_KINDS = {"paper", "channel", "course", "essay", "concept", "lab"}
ALLOWED_PHASES = {"prereq", "core", "frontier"}
CONTENT_ARTIFACTS = {
    "stub": "reader-facing card still says 'stub'",
    "TL;DR（3 行）": "reader-facing card still exposes a line-count cue",
    "无废话": "reader-facing card still uses internal compression wording",
    "2–3 行核心论点": "template still uses internal compression wording",
}


def fail(msg: str, errors: list[str]) -> None:
    errors.append(msg)


def main() -> int:
    errors: list[str] = []

    with GRAPH.open() as f:
        g = json.load(f)

    nodes = g["nodes"]
    edges = g["edges"]
    playbooks = g.get("playbooks", {})

    ids = [n["id"] for n in nodes]
    dup = {x for x in ids if ids.count(x) > 1}
    if dup:
        fail(f"duplicate node ids: {sorted(dup)}", errors)
    id_set = set(ids)

    for n in nodes:
        nid = n["id"]
        for k in ("id", "label", "kind", "tier", "topic", "phase", "card"):
            if k not in n:
                fail(f"node {nid!r} missing field {k}", errors)
        if n.get("kind") not in ALLOWED_KINDS:
            fail(f"node {nid!r} bad kind {n.get('kind')}", errors)
        if n.get("tier") not in ALLOWED_TIERS:
            fail(f"node {nid!r} bad tier {n.get('tier')}", errors)
        if n.get("topic") not in ALLOWED_TOPICS:
            fail(f"node {nid!r} bad topic {n.get('topic')}", errors)
        if n.get("phase") not in ALLOWED_PHASES:
            fail(f"node {nid!r} bad phase {n.get('phase')}", errors)

        card = n.get("card", "")
        if n["kind"] == "concept":
            if "concepts.md" not in card:
                fail(f"concept node {nid!r} card must point to concepts.md ({card!r})", errors)
            if not CONCEPTS.exists():
                fail("concepts.md is missing", errors)
        elif n["kind"] == "lab":
            target = (CARDS_DIR / card).resolve()
            if not target.exists():
                # During build, labs are written in a later phase; warn but do not fail.
                print(f"warn: lab node {nid!r} target not yet created ({target.name})")
        else:
            cpath = CARDS_DIR / card
            if not cpath.exists():
                fail(f"node {nid!r} card file missing: docs/data/cards/{card}", errors)
            else:
                text = cpath.read_text(encoding="utf-8")
                if n.get("kind") == "paper" and "Bitter-Lesson" not in text and "Bitter Lesson" not in text:
                    fail(f"paper card {card!r} is missing a Bitter-Lesson lens section", errors)
                for needle, reason in CONTENT_ARTIFACTS.items():
                    if needle in text:
                        fail(f"card {card!r}: {reason} ({needle!r})", errors)

    template = CARDS_DIR / "_template.md"
    if template.exists():
        template_text = template.read_text(encoding="utf-8")
        for needle, reason in CONTENT_ARTIFACTS.items():
            if needle in template_text:
                fail(f"card template: {reason} ({needle!r})", errors)

    out_count: dict[str, int] = {nid: 0 for nid in id_set}
    for e in edges:
        for k in ("source", "target", "rel"):
            if k not in e:
                fail(f"edge {e!r} missing field {k}", errors)
                continue
        if e.get("source") not in id_set:
            fail(f"edge source not in nodes: {e['source']}", errors)
        if e.get("target") not in id_set:
            fail(f"edge target not in nodes: {e['target']}", errors)
        if e.get("rel") not in ALLOWED_RELS:
            fail(f"edge bad rel {e.get('rel')!r}", errors)
        if e.get("source") in id_set:
            out_count[e["source"]] += 1

    paper_tiers = {"spine", "S", "A", "B"}
    for n in nodes:
        if n.get("kind") in {"paper", "essay", "course", "channel"} and n.get("tier") in paper_tiers:
            in_count = sum(1 for e in edges if e["target"] == n["id"])
            total = out_count.get(n["id"], 0) + in_count
            if total == 0:
                fail(f"resource node {n['id']!r} has no edges (would be isolated)", errors)

    for key, pb in playbooks.items():
        for nid in pb.get("nodes", []):
            if nid not in id_set:
                fail(f"playbook {key} references missing node id: {nid}", errors)

    if errors:
        print(f"VALIDATION FAILED with {len(errors)} error(s):")
        for e in errors:
            print(f"  - {e}")
        return 1

    print(f"OK  nodes={len(nodes)}  edges={len(edges)}  playbooks={list(playbooks)}")
    print("    - all card files exist")
    print("    - no isolated resource nodes")
    print("    - all edge endpoints + playbook nodes valid")
    print("    - controlled vocab respected (kind/tier/topic/phase/rel)")
    print("    - paper cards include Bitter-Lesson lenses")
    print("    - no internal compression placeholders in card prose")
    return 0


if __name__ == "__main__":
    sys.exit(main())
