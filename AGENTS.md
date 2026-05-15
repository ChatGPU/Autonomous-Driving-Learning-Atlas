# Agent operating notes -- Autonomous-Driving Learning Atlas

This repo is a public, opinionated, bilingual learning atlas. Anyone (human or agent) extending it should preserve four invariants:

1. The graph is the source of truth. All nodes/edges live in docs/data/graph.json. Every node MUST have a card under docs/data/cards/. CI (tools/validate_graph.py) enforces this.
2. Every external link is a deep link when possible. Use arxiv.org/pdf/<id>#page=N for paper anchors, youtu.be/<id>?t=Xs for video timestamps, github.com/.../blob/<sha>/file#L<line> for code lines.
3. Bilingual policy. Body language is 中文; technical terms keep the English form on first occurrence; equations in standard LaTeX.
4. Every paper card includes a Bitter-Lesson lens callout. This is the only opinionated section; everywhere else, present tradeoffs neutrally.

## Workflow

- Create a short-lived task branch from main, commit the change there, and open a pull request.
- Treat the pull request as a traceable sync record, not as a request for manual user intervention.
- Merge the pull request automatically once checks allow it; if no checks are required and the change is straightforward, merge immediately.
- Do not commit routine changes directly to main.
- Do not use long-lived branches as topic folders.

## Adding a new paper / resource

1. Pick a tier: spine (user-supplied), S (founding canon), A (parallel innovation), B (compressed mention).
2. Create docs/data/cards/<kind>_<slug>.md using the template in docs/data/cards/_template.md.
3. Add the node + at least one edge to docs/data/graph.json.
4. Run python tools/validate_graph.py and python tools/check_links.py.
5. If the card has a matching lab, add labs/labXX_*.ipynb and ensure it passes nbconvert --execute with the Mock LLM backend.

## Lab conventions

- All labs run on a free Colab T4 (or CPU).
- LLM-dependent labs MUST use labs/llm_provider.py. The default backend is mock so notebooks complete deterministically in CI.
- Each notebook starts with a "What this proves" cell and ends with "Three stretch goals".

## CI workflows

- pages.yml -- deploys docs/ to GitHub Pages on push to main.
- validate.yml -- runs graph + link validators on pushes to main and pull requests.
- labs_smoke.yml -- runs every notebook end-to-end with the Mock backend on lab changes, pull requests, or manual dispatch.

## What this atlas is NOT

- Not an exhaustive AD survey.
- Not a tutorial repo for a single paper.
- Not a model zoo.
- Not a place to train large models.
