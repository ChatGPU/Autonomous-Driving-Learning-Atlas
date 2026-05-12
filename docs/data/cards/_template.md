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

## 先抓住这件事
先用一段自然语言把直觉讲清楚：如果把这项工作画成一幅图，读者第一眼应该看见什么？它解决的具体困难是什么？

## 它在图谱里的位置
说明它在 2×2 modular↔E2E × data↔knowledge 地图中的坐标，以及它和主线节点、先修节点、平行路线的关系。

## 一个最小公式 / Math anchor
$$ \text{核心方程} $$

用一句话解释公式里每个对象的物理含义，帮助读者把符号和图像连起来。

## 如果把架构画成图
按模块解释信息怎样流动：输入是什么，中间 token / query / memory / planner 扮演什么角色，输出如何影响下一步决策。

## 工程上真正要注意什么
- Repo: `org/repo`
- Dataset: …
- Hardware: …
- Gotchas: …
- License: …

## 建议这样读
1. PDF p.N：先看问题设定；
2. PDF p.M：再看核心图或核心公式；
3. PDF p.K：最后看实验与消融，判断证据是否支撑主张。

## Bitter-Lesson 视角
这项工作把哪些能力交给数据、算力和通用学习器？又在哪些地方保留了人类设计的结构或规则？请保持判断明确，但不要把工程折中简单写成优劣二分。

## 接下来读什么
- → `paper:...`
- → `concept:...`

## 配套实验 / Lab
- `labs/labXX_*.ipynb`
