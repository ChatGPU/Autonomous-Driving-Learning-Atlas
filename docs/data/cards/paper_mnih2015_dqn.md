---
id: paper:mnih2015_dqn
title: "DQN — Human-level control through deep RL"
title_zh: "DQN：深度强化学习达到人类水平的 Atari 控制"
kind: paper
tier: S
authors: [Mnih, V., Kavukcuoglu, K., Silver, D., et al.]
venue: "Nature 2015"
year: 2015
topic: deep_rl
phase: prereq
prereqs: [course:zhao_rl]
extends: [course:zhao_rl]
contrasts: []
parallel: []
contested_by: []
labs: []
deep_links:
  - {label: "Nature 论文", url: "https://www.nature.com/articles/nature14236"}
  - {label: "arXiv 预印本", url: "https://arxiv.org/pdf/1312.5602"}
bibtex: |
  @article{mnih2015dqn,
    title  = {Human-level control through deep reinforcement learning},
    author = {Mnih, Volodymyr and Kavukcuoglu, Koray and Silver, David and others},
    journal= {Nature},
    volume = {518},
    number = {7540},
    pages  = {529--533},
    year   = {2015}
  }
---

## TL;DR
把 Q-learning 与卷积网络结合，端到端从原始像素学打 Atari，**首次以单一算法达到人类水平**。两个稳定性 trick：*经验回放 (replay buffer)* + *目标网络 (target Q)*。Deep RL 的开端。

## 位置 / Why it matters
- 是 [赵世钰课程](course_zhao_shiyu_rl.md) Lec 7 的"应用焦点"；
- 是 [CS285](course_cs285_levine.md) Lec 6–8 的核心算法；
- 也是 [DiLu](paper_2309.16292_dilu.md) 用来对比"知识驱动 vs 数据驱动"的 baseline。

## 数学锚点 / Math anchor
**Q-learning + DNN**：
$$
\mathcal{L}(\theta)=\mathbb{E}_{(s,a,r,s')\sim\mathcal{D}}\Big[\big(r+\gamma\max_{a'}Q_{\theta^-}(s',a')-Q_\theta(s,a)\big)^2\Big]
$$
- $\mathcal{D}$ 是 replay buffer；
- $\theta^-$ 是 target network 参数（每 N 步从 $\theta$ 拷贝一次）。

## 架构 / Architectural intuition
- 输入：4 帧灰度图像堆叠（捕捉运动）；
- 网络：3 conv + 2 fc → $|A|$ Q 值；
- $\epsilon$-greedy 探索。

## 工程 / Engineering notes
- 后续改进：Double DQN、Dueling、Rainbow、Distributional RL 等。
- License：DeepMind 论文 + 多种社区复刻。

## Bitter-Lesson 视角 / lens
*DQN 是把"游戏专用启发式"全部砍掉、让一个通用 RL agent 用一种算法横扫 Atari——Sutton 在 BitterLesson 文章里把它列为支持例证之一。*

## 后续节点 / Suggested next nodes
- → [PPO](paper_schulman2017_ppo.md) · [SAC（CS285 Lec 7）](course_cs285_levine.md)
- → [`concept:dqn`](../../concepts.md) · [`concept:replay_buffer`](../../concepts.md)
