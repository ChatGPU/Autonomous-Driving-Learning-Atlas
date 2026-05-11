---
id: paper:gaia1
title: "GAIA-1 — Generative World Model for Autonomous Driving"
title_zh: "GAIA-1：自动驾驶的生成式世界模型"
kind: paper
tier: A
authors: [Hu, A., Russell, L., Yeo, H., Murez, Z., et al. (Wayve)]
venue: "arXiv 2023"
year: 2023
topic: vlm_vla
phase: frontier
prereqs: [paper:vaswani2017]
extends: []
contrasts: []
parallel: [paper:2512.24426, paper:drivedreamer]
contested_by: []
labs: []
deep_links:
  - {label: "PDF", url: "https://arxiv.org/pdf/2309.17080"}
  - {label: "Wayve 博客", url: "https://wayve.ai/thinking/scaling-gaia-1/"}
bibtex: |
  @article{hu2023gaia1,
    title  = {GAIA-1: A Generative World Model for Autonomous Driving},
    author = {Hu, Anthony and Russell, Lloyd and Yeo, Hudson and Murez, Zak and others},
    journal= {arXiv:2309.17080},
    year   = {2023}
  }
---

## TL;DR
GAIA-1 是 Wayve 训练的 9B 参数 *视频 + 文本 + action* 联合生成式世界模型——**给定视频前缀和驾驶指令，生成未来视频**，可作为驾驶策略的"想象空间"。

## 与 spine 的交集
- 与 [CF-VLA](paper_2512.24426_cfvla.md) 的"反事实推理"互为镜像：CF-VLA 用 LLM 在语言空间想未来，GAIA-1 在视频空间想未来；
- 是 [Bitter Lesson](essay_bitter_lesson.md) 现代版的另一个正面例证：纯 sequence model + scale。

## 后续
- → [CF-VLA](paper_2512.24426_cfvla.md) · [DriveDreamer](paper_drivedreamer.md)
