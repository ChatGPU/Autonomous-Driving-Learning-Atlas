---
id: paper:ross2011_dagger
title: "DAgger — Dataset Aggregation for Imitation Learning"
title_zh: "DAgger：通过数据集聚合解决模仿学习的协变量偏移"
kind: paper
tier: S
authors: [Ross, S., Gordon, G.J., Bagnell, J.A.]
venue: "AISTATS 2011"
year: 2011
topic: deep_rl
phase: core
prereqs: [course:cs285]
extends: []
contrasts: []
parallel: []
contested_by: []
labs: [lab02]
deep_links:
  - {label: "PDF", url: "https://arxiv.org/pdf/1011.0686"}
  - {label: "CS285 Lec 2 视频（在 BC vs DAgger 一节）", url: "https://www.youtube.com/playlist?list=PL_iWQOsE6TfXxKgI1GgyV1B_Xa0DxE5eH"}
bibtex: |
  @inproceedings{ross2011dagger,
    title     = {A Reduction of Imitation Learning and Structured Prediction to No-Regret Online Learning},
    author    = {Ross, St{\'e}phane and Gordon, Geoffrey J. and Bagnell, J. Andrew},
    booktitle = {AISTATS},
    year      = {2011}
  }
---

## TL;DR
模仿学习（BC）的核心病：**学生策略一旦偏出 expert 分布就崩溃**（compounding error）。DAgger 让学生**自己在线 rollout**，把进入的新状态**回送给 expert** 标注，迭代聚合数据训练；**把 supervised loss 收敛到与在线 RL 同阶的 regret 界**。

## 位置 / Why it matters
- 是 [CS285 Lec 2](course_cs285_levine.md) 整节课的主角；
- 是理解 [PlanT](paper_2210.14222_plant.md) / [UniAD](paper_2212.10156_uniad.md) 这类**纯 BC 的端到端 driver** 为何在长尾场景上脆弱的关键；
- [CF-VLA](paper_2512.24426_cfvla.md) 的 *rollout-filter-label* pipeline 在精神上是 DAgger 的 LLM 时代版本。

## 数学锚点 / Math anchor
循环 $i=1,\dots,N$：
$$
\pi_i = \mathrm{train}(\mathcal{D}),\quad \mathcal{D} \leftarrow \mathcal{D}\cup\{(s,\pi^*(s)) : s \sim d^{\pi_i}\}
$$
其中 $d^{\pi_i}$ 是 $\pi_i$ rollout 出的状态分布。用 $\beta_i$ 控制 $\pi_i$ 与 $\pi^*$ 的混合比，逐渐降到 0。**No-regret** 保证：在凸损失下平均策略的 regret 是 $O(\sqrt{T})$。

## 架构 / Architectural intuition
- 让学生**踏进自己会犯的错**，用 expert 修；
- 几个 iteration 后，学生策略所诱导的状态分布与 expert 分布几乎重合。

## Bitter-Lesson 视角 / lens
*DAgger 用一个非常通用的"on-policy 数据收集"trick 修了 BC 的根本性缺陷。它本身没有引入领域知识，因此与 Bitter Lesson 完全相容。*

## 后续节点 / Suggested next nodes
- → [CS285 Lec 2](course_cs285_levine.md) · [PlanT](paper_2210.14222_plant.md) · [UniAD](paper_2212.10156_uniad.md)
- → [`concept:imitation_learning`](../../concepts.md) · [`concept:covariate_shift`](../../concepts.md)

## 配套实验 / Lab
[`labs/lab02_cs285_bc_vs_dagger_minicar.ipynb`](../../../labs/lab02_cs285_bc_vs_dagger_minicar.ipynb) 直接复刻 DAgger vs BC 的失败-修复对比。
