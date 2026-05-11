---
id: paper:mamba
title: "Mamba — Selective State Space Models"
title_zh: "Mamba：选择性状态空间模型"
kind: paper
tier: B
authors: [Gu, A., Dao, T.]
venue: "COLM 2024"
year: 2023
topic: math_foundations
phase: frontier
prereqs: [paper:vaswani2017]
extends: []
contrasts: [paper:vaswani2017]
parallel: []
contested_by: []
labs: []
deep_links:
  - {label: "PDF", url: "https://arxiv.org/pdf/2312.00752"}
  - {label: "state-spaces/mamba 代码", url: "https://github.com/state-spaces/mamba"}
---

## TL;DR（3 行）
Mamba 是一种**线性复杂度、可并行**的序列模型，性能在长上下文上对标 transformer，被广泛视为 transformer 的潜在替代。**与本图谱关系**：未来若 spine 论文（DriveVLM、CF-VLA）切换 backbone，Mamba 是头号候选。
