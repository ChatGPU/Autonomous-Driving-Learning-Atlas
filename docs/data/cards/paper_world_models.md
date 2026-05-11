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

## 后续
- → [GAIA-1](paper_gaia1.md) · [DriveDreamer](paper_drivedreamer.md) · [CF-VLA](paper_2512.24426_cfvla.md)
