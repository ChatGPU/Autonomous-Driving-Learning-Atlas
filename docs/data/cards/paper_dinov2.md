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

## 先用一幅图理解
想象你拿到一张图，不给任何人工标签，只让模型反复看不同裁剪、不同遮挡、不同视角。DINOv2 要学到的是：同一只车、同一条路、同一个交通标志，在这些变化下仍然应该落到稳定的特征空间里。它的价值不在“又训练了一个分类器”，而在“得到一个可以冻结后迁移到很多视觉任务的 backbone”。

## 与 spine 的交集
- 是 [DINOv3](paper_2508.10104_dinov3.md) 的**直接前身**；理解 DINOv3 的 Gram anchoring 改进，先要知道 DINOv2 已经把自监督视觉特征推到了很强的可迁移水平。
- 对自动驾驶来说，DINOv2 提供的是“感知前端的通用视觉底座”：你可以不从 ImageNet supervised pretraining 出发，而从更大规模、更少人工标签的视觉表征出发。

## Bitter-Lesson 视角 / lens
DINOv2 是 Bitter Lesson 的典型正例：少写任务规则，多用数据规模、模型规模和自监督目标去逼出通用表征。它仍然有人工设计的 augmentation、teacher-student 结构和数据筛选流程，但最核心的能力来自“让模型看足够多、足够杂的图像”。这也是它能成为 DINOv3 起点的原因。

## 后续
- → [DINOv3](paper_2508.10104_dinov3.md) · [ViT](paper_vit.md)
