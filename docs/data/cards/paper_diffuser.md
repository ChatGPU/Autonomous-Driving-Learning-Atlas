---
id: paper:diffuser
title: "Diffuser / Decision Diffuser — Planning via Diffusion Models"
title_zh: "Diffuser / Decision Diffuser：基于扩散模型的规划"
kind: paper
tier: B
authors: [Janner, M., Du, Y., Tenenbaum, J., Levine, S.]
venue: "ICML 2022 / 2023"
year: 2022
topic: deep_rl
phase: frontier
prereqs: [course:cs285]
extends: []
contrasts: []
parallel: [paper:gaia1]
contested_by: []
labs: []
deep_links:
  - {label: "Diffuser PDF", url: "https://arxiv.org/pdf/2205.09991"}
  - {label: "Decision Diffuser PDF", url: "https://arxiv.org/pdf/2211.15657"}
---

## 先抓住这件事
Diffuser 把 planning 看成一件很有画面感的事：先从一条“满是噪声的未来轨迹”开始，然后一步步去噪，直到它变成一条既能到达目标、又符合动力学约束的行动序列。换句话说，模型不是直接输出一个动作，而是在生成“未来几秒可能怎样展开”。

## 它在图谱里的位置
在本图谱里，Diffuser 是理解概率式 planner 的一块拼图。它和 [VADv2](paper_vadv2.md) 的“轨迹分布”思路相邻，也和 [World Models](paper_world_models.md)、[GAIA-1](paper_gaia1.md) 共享同一个问题意识：如果智能体能在执行前生成许多可能未来，它就有机会在“想象”里先筛掉坏选择。

## 一个最小公式 / Math anchor
扩散规划可以写成从噪声轨迹 $x_T$ 逐步反推干净轨迹 $x_0$：
$$
p_\theta(x_{t-1}\mid x_t, c)
$$
其中 $c$ 是条件：起点、目标、奖励、约束或观测。直觉上，$c$ 像一块磁铁，把原本随机的未来慢慢拉向“可行且高价值”的轨迹。

## Bitter-Lesson 视角 / lens
Diffuser 很符合 Bitter Lesson 的精神：它没有手写一套 planner 规则，而是让生成模型从数据里学习“什么样的未来轨迹像好决策”。但扩散采样也带来代价：多步去噪通常比一次前向规划更慢。自动驾驶落地时，这条路线需要回答一个工程问题：它生成的多样未来，是否足以抵消实时性成本？

## 接下来读什么
- → [World Models](paper_world_models.md)：更早的“在想象中学习”。
- → [VADv2](paper_vadv2.md)：看概率规划怎样进入端到端 AD。
- → [CF-VLA](paper_2512.24426_cfvla.md)：比较语言空间的反事实推理与轨迹空间的生成规划。
