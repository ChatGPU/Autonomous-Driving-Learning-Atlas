---
id: paper:drivedreamer
title: "DriveDreamer — Diffusion-based World Model for Driving"
title_zh: "DriveDreamer：基于视频扩散的驾驶世界模型"
kind: paper
tier: A
authors: [Wang, X., Zhu, Z., Huang, G., et al.]
venue: "ECCV 2024"
year: 2024
topic: vlm_vla
phase: frontier
prereqs: []
extends: []
contrasts: []
parallel: [paper:gaia1]
contested_by: []
labs: []
deep_links:
  - {label: "PDF", url: "https://arxiv.org/pdf/2309.09777"}
  - {label: "项目页", url: "https://drivedreamer.github.io/"}
bibtex: |
  @inproceedings{wang2024drivedreamer,
    title     = {DriveDreamer: Towards Real-World-Driven World Models for Autonomous Driving},
    author    = {Wang, Xiaofeng and Zhu, Zheng and Huang, Guan and others},
    booktitle = {ECCV},
    year      = {2024}
  }
---

## TL;DR
DriveDreamer 用**视频扩散**条件在 BEV layout / action / text 上，生成可控的未来驾驶视频，并把它当成强化学习/规划的 *imagination engine*。

## 与 spine 的交集
- 与 [GAIA-1](paper_gaia1.md) parallel，扩散 vs autoregressive；
- 在 *world-model RL* 这条线上是 [CF-VLA](paper_2512.24426_cfvla.md) 之外的另一条路。

## 后续
- → [GAIA-1](paper_gaia1.md) · [CF-VLA](paper_2512.24426_cfvla.md)
