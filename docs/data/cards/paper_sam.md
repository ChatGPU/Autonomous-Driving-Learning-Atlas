---
id: paper:sam
title: "Segment Anything (SAM / SAM 2)"
title_zh: "SAM / SAM 2：分割万物的视觉基础模型"
kind: paper
tier: A
authors: [Kirillov, A., Mintun, E., Ravi, N., Mao, H., Rolland, C., Gustafson, L., et al. (Meta)]
venue: "ICCV 2023 / Meta 2024"
year: 2023
topic: ssl_vision
phase: prereq
prereqs: [paper:vit]
extends: [paper:vit]
contrasts: []
parallel: [paper:dinov2]
contested_by: []
labs: []
deep_links:
  - {label: "SAM PDF", url: "https://arxiv.org/pdf/2304.02643"}
  - {label: "SAM 2 PDF", url: "https://arxiv.org/pdf/2408.00714"}
  - {label: "facebookresearch/segment-anything", url: "https://github.com/facebookresearch/segment-anything"}
bibtex: |
  @inproceedings{kirillov2023sam,
    title     = {Segment Anything},
    author    = {Kirillov, Alexander and Mintun, Eric and Ravi, Nikhila and Mao, Hanzi and Rolland, Chloe and Gustafson, Laura and others},
    booktitle = {ICCV},
    year      = {2023}
  }
---

## TL;DR
SAM 用 1.1B mask、11M 图像训练一个**可被 prompt 的分割模型**（点 / 框 / 文本），在零样本上几乎覆盖任意物体。SAM 2 把它扩到视频，加入对象 memory。

## 与 spine 的交集
- 是 [DINOv3](paper_2508.10104_dinov3.md) 的"姐妹"——同为 Meta 的视觉基础模型；
- 在自动驾驶里常被用作 **mask label 自动化工具**；
- 与 [Bitter Lesson](essay_bitter_lesson.md) 强一致：海量 prompt-mask 数据 + 通用模型。

## 后续
- → [DINOv3](paper_2508.10104_dinov3.md) · [DINOv2](paper_dinov2.md)
