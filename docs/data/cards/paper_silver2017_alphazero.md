---
id: paper:silver2017_alphazero
title: "AlphaGo Zero / AlphaZero"
title_zh: "AlphaGo Zero：自我博弈 + MCTS 通用对弈引擎"
kind: paper
tier: S
authors: [Silver, D., Schrittwieser, J., et al.]
venue: "Nature 2017 / Science 2018"
year: 2017
topic: deep_rl
phase: prereq
prereqs: []
extends: []
contrasts: []
parallel: []
contested_by: []
labs: []
deep_links:
  - {label: "Nature 论文（AlphaGo Zero）", url: "https://www.nature.com/articles/nature24270"}
  - {label: "Science 论文（AlphaZero）", url: "https://www.science.org/doi/10.1126/science.aar6404"}
  - {label: "Bitter Lesson 引用此例", url: "http://www.incompleteideas.net/IncIdeas/BitterLesson.html"}
bibtex: |
  @article{silver2017alphagozero,
    title  = {Mastering the game of Go without human knowledge},
    author = {Silver, David and Schrittwieser, Julian and others},
    journal= {Nature}, year={2017}
  }
---

## TL;DR
**完全无人类棋谱**，仅用 self-play + MCTS + 单个深度网络（policy + value 双头），AlphaGo Zero 在 3 天内超越 AlphaGo Lee。AlphaZero 把同一框架推广到国际象棋、将棋、围棋——**一种算法、三种游戏、人类水平之上**。

## 位置 / Why it matters
- 是 [Bitter Lesson](essay_bitter_lesson.md) 文中第二个被点名的核心例证；
- 是 *search + learning* 两条 Sutton 的"长跑赢家"被合一最干净的工程现实；
- 在自动驾驶里间接启发：所有 *world-model + planning* 路线（[GAIA-1](paper_gaia1.md)、[CF-VLA](paper_2512.24426_cfvla.md)）都借了"在脑中 rollout 后再执行"的思想。

## 数学锚点 / Math anchor
单网络两头：
$$
(p,v)=f_\theta(s)
$$
- $p$：每个动作的先验概率；$v$：当前状态价值。
- MCTS 用 $p,v$ 引导搜索；搜出的 $\pi^{\text{MCTS}}$ 与游戏胜负 $z$ 反过来训练 $f_\theta$。

## Bitter-Lesson 视角 / lens
*Sutton 引用 AlphaZero：当人类棋谱被完全删掉、用 self-play 训练时，模型反而**更强**。这是"人类知识在足够长的训练后是负担"的最响亮证据。*

## 后续节点 / Suggested next nodes
- → [Bitter Lesson](essay_bitter_lesson.md)
- → [CF-VLA](paper_2512.24426_cfvla.md) · [GAIA-1](paper_gaia1.md)（在脑中 rollout 的现代版）
- → [DQN](paper_mnih2015_dqn.md) · [PPO](paper_schulman2017_ppo.md)
