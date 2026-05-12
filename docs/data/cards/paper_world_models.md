---
id: paper:world_models
title: "World Models (Ha & Schmidhuber 2018)"
title_zh: "World Models：在脑内世界里学习策略"
kind: paper
tier: A
authors: [Ha, D., Schmidhuber, J.]
venue: "NeurIPS 2018"
year: 2018
topic: deep_rl
phase: core
prereqs: [course:cs285]
extends: []
contrasts: []
parallel: [paper:gaia1, paper:drivedreamer]
contested_by: []
labs: []
deep_links:
  - {label: "PDF", url: "https://arxiv.org/pdf/1803.10122"}
  - {label: "项目页（含可玩 demo）", url: "https://worldmodels.github.io/"}
bibtex: |
  @inproceedings{ha2018worldmodels,
    title     = {Recurrent World Models Facilitate Policy Evolution},
    author    = {Ha, David and Schmidhuber, J{\"u}rgen},
    booktitle = {NeurIPS},
    year      = {2018}
  }
---

## TL;DR
**先训一个生成式世界模型**（VAE + RNN）模拟环境动力学，**然后只在世界模型中训练策略**——智能体"在梦里学开车"，再迁回真实环境。

## 与 spine 的交集
- 是 [GAIA-1](paper_gaia1.md) / [DriveDreamer](paper_drivedreamer.md) 的**精神祖师**；
- 是 [CF-VLA](paper_2512.24426_cfvla.md) "在 LLM 头脑里 rollout" 的更早版本（rollout 在显式生成模型而非 LLM 内）；
- 与 [AlphaGo Zero](paper_silver2017_alphazero.md) 的 self-play "在搜索树里 rollout" 同源。

## 先用一幅图理解
把真实环境想成昂贵的赛车场。World Models 的想法是：先学一个足够像赛车场的模拟器，然后让策略在这个“梦境赛车场”里跑很多圈。即使梦境不完美，只要它保留了和决策相关的动力学，策略就能在便宜得多的想象空间里积累经验。

## 一个最小结构
论文里的经典三件套是：

1. **VAE**：把高维图像压成 latent state；
2. **RNN / MDN-RNN**：在 latent space 里预测未来；
3. **Controller**：只看 latent state，学习输出动作。

这套结构后来在自动驾驶里不断变形：视频生成模型、occupancy world model、语言反事实推理，本质上都在问“我能不能先在脑中试开一下？”

## Bitter-Lesson 视角 / lens
World Models 很符合 Bitter Lesson：与其手写环境规则，不如从交互数据里学一个可 rollout 的模型。但它也暴露了一个长期难题：世界模型如果学错了，策略会利用模型漏洞，在梦里很强、醒来很差。自动驾驶中的 GAIA-1、DriveDreamer、CF-VLA 都是在继续处理这个张力——想象越强，越需要真实世界反馈来校准。

## 后续
- → [GAIA-1](paper_gaia1.md) · [DriveDreamer](paper_drivedreamer.md) · [CF-VLA](paper_2512.24426_cfvla.md)
