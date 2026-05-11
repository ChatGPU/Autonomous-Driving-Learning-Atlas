---
id: paper:XXXX.YYYYY
title: "Short English title"
title_zh: "中文标题"
kind: paper            # paper | channel | course | essay | concept | lab
tier: spine            # spine | S | A | B
authors: [Author A, Author B]
venue: "Venue Year"
year: 2024
topic: e2e_ad          # math_foundations | rl_foundations | deep_rl | ssl_vision | e2e_ad | vlm_vla | brain_inspired | meta_philosophy | companion_media
phase: core            # prereq | core | frontier
prereqs: []
extends: []
contrasts: []
parallel: []
contested_by: []
labs: []
deep_links:
  - {label: "PDF p.N", url: "https://arxiv.org/pdf/XXXX.YYYYY#page=N"}
bibtex: |
  @article{author2024slug, ... }
---

## TL;DR
（2–3 行核心论点，无废话）

## 位置 / Why it matters
（一段：在 2×2 modular↔E2E × data↔knowledge 地图中的位置；和 spine 上其他节点是什么关系）

## 数学锚点 / Math anchor
$$ \text{核心方程} $$

直觉：……

## 架构 / Architectural intuition
（盒子的物理含义；为什么这种设计选择对应了什么具体问题）

## 工程 / Engineering notes
- Repo: `org/repo`
- Dataset: …
- Hardware: …
- Gotchas: …
- License: …

## 深度阅读路径 / Deep-anchored reading order
1. PDF p.N，公式 (k)
2. PDF p.M，图 j
3. ……

## Bitter-Lesson 视角 / lens
*该工作 (注入/避免) 引入人工先验 X. Sutton 会论证 Y. 目前的实证证据是 Z.*

## 后续节点 / Suggested next nodes
- → `paper:...`
- → `concept:...`

## 配套实验 / Lab
- `labs/labXX_*.ipynb`
