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

## 先用一幅图理解
给模型一段当前道路视频，再告诉它“前方有车、我准备向左变道”。DriveDreamer 要生成的是接下来几秒的驾驶画面：车道线怎样移动、旁车怎样靠近、ego 车可能怎样进入新车道。它不是为了生成好看的视频，而是为了让系统在执行前拥有一个可控的“未来预演器”。

## 与 spine 的交集
- 与 [GAIA-1](paper_gaia1.md) parallel：GAIA-1 更像 autoregressive video world model，DriveDreamer 则走 diffusion world model。
- 与 [CF-VLA](paper_2512.24426_cfvla.md) 形成对照：CF-VLA 在语言 / meta-action 空间里问“如果这样做会怎样”，DriveDreamer 在像素 / 视频空间里直接把未来画出来。

## Bitter-Lesson 视角 / lens
DriveDreamer 把自动驾驶里的世界知识尽量交给生成模型学习，而不是手写场景规则，这一点很 Bitter-Lesson。它的人工先验主要体现在条件输入：BEV layout、action、text prompt 都在告诉模型“应该沿哪些维度想象”。这是一种务实折中：完全无条件的视频生成太难，而带驾驶结构的条件生成更容易对规划有用。

## 后续
- → [GAIA-1](paper_gaia1.md) · [CF-VLA](paper_2512.24426_cfvla.md)
