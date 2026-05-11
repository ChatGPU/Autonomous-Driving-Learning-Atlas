---
id: paper:vadv2
title: "VADv2 — Vectorized End-to-End AD with Probabilistic Planning"
title_zh: "VADv2：向量化端到端自动驾驶 + 概率规划"
kind: paper
tier: A
authors: [Jiang, B., Chen, S., Liao, B., et al.]
venue: "arXiv 2024"
year: 2024
topic: e2e_ad
phase: frontier
prereqs: [paper:2212.10156, paper:carion2020]
extends: [paper:2212.10156]
contrasts: []
parallel: [paper:2212.10156]
contested_by: []
labs: []
deep_links:
  - {label: "PDF", url: "https://arxiv.org/pdf/2402.13243"}
  - {label: "项目页", url: "https://hgao-cv.github.io/VADv2/"}
bibtex: |
  @article{jiang2024vadv2,
    title  = {VADv2: End-to-End Vectorized Autonomous Driving via Probabilistic Planning},
    author = {Jiang, Bo and Chen, Shaoyu and Liao, Bencheng and others},
    journal= {arXiv:2402.13243},
    year   = {2024}
  }
---

## TL;DR
VADv2 把 [UniAD](paper_2212.10156_uniad.md) 的"标量轨迹回归"换成**对一个 plan 词典的概率分布**：模型在 ~4096 条预生成轨迹上输出 categorical，再加权融合。

## 与 spine 的交集
- **vs UniAD**：保留 BEV + query 思路，但把 planner head 换成离散概率，**显著降低 collision rate**；
- **被 [DriveVLM-Dual](paper_2402.12289_drivevlm.md) / [CF-VLA](paper_2512.24426_cfvla.md) 借鉴**：后两者也常先离散化 meta-action。

## 数学锚点
$$
p(\tau_k\mid o)\;=\;\mathrm{softmax}_k\big(f_\theta(o)\cdot e_{\tau_k}\big),\qquad \hat\tau=\sum_k p(\tau_k\mid o)\,\tau_k
$$

## Bitter-Lesson 视角
*把"轨迹空间离散化"是注入了 prior（"4096 个 mode 够用"），但相比 UniAD 的硬 head，把"该选哪条"完全交给 softmax 学习——属于温和折中。*

## 后续
- → [UniAD](paper_2212.10156_uniad.md) · [DriveVLM](paper_2402.12289_drivevlm.md)
