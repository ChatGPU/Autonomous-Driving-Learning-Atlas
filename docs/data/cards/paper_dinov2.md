---
id: paper:dinov2
title: "DINOv2 — Learning Robust Visual Features without Supervision"
title_zh: "DINOv2：无监督学到强鲁棒视觉特征"
kind: paper
tier: A
authors: [Oquab, M., Darcet, T., Moutakanni, T., et al.]
venue: "TMLR 2024"
year: 2023
topic: ssl_vision
phase: prereq
prereqs: [paper:vit]
extends: [paper:vit]
contrasts: []
parallel: []
contested_by: []
labs: []
deep_links:
  - {label: "PDF", url: "https://arxiv.org/pdf/2304.07193"}
  - {label: "facebookresearch/dinov2", url: "https://github.com/facebookresearch/dinov2"}
bibtex: |
  @article{oquab2024dinov2,
    title  = {DINOv2: Learning Robust Visual Features without Supervision},
    author = {Oquab, Maxime and Darcet, Timoth{\'e}e and Moutakanni, Th{\'e}o and others},
    journal= {TMLR},
    year   = {2024}
  }
---

## TL;DR
DINOv2 = DINO（自蒸馏）+ iBOT（masked image modelling）+ 142M 精筛图像 + ViT-g/14。**冻结 backbone 直接 linear probe** 已超过许多 supervised 模型。

## 与 spine 的交集
- 是 [DINOv3](paper_2508.10104_dinov3.md) 的**直接前身**；理解 DINOv3 的 Gram anchoring 改进，必先看 DINOv2 的 dense feature 退化问题。

## 后续
- → [DINOv3](paper_2508.10104_dinov3.md) · [ViT](paper_vit.md)
