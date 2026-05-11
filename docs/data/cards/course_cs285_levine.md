---
id: course:cs285
title: "CS285 — Deep Reinforcement Learning (Sergey Levine)"
title_zh: "UC Berkeley CS285 深度强化学习（Sergey Levine）"
kind: course
tier: spine
authors: [Levine, S.]
venue: "UC Berkeley"
year: 2023
topic: deep_rl
phase: core
prereqs: [course:zhao_rl]
extends: [course:zhao_rl]
contrasts: []
parallel: [course:zhao_rl]
contested_by: []
labs: [lab02]
deep_links:
  - {label: "课程主页（含 syllabus + slides + 录像）", url: "http://rail.eecs.berkeley.edu/deeprlcourse/"}
  - {label: "YouTube playlist（用户给出的 2020/21 版）", url: "https://www.youtube.com/playlist?list=PL_iWQOsE6TfVYGEGiAOMaOzzv41Jfm_Ps"}
  - {label: "YouTube 最新版 playlist（2023 起更新）", url: "https://www.youtube.com/playlist?list=PL_iWQOsE6TfXxKgI1GgyV1B_Xa0DxE5eH"}
  - {label: "DAgger 论文（Lec 2 主讨论）", url: "https://arxiv.org/abs/1011.0686"}
  - {label: "Bitter Lesson（课程开篇必读）", url: "http://www.incompleteideas.net/IncIdeas/BitterLesson.html"}
bibtex: |
  @misc{levine2023cs285,
    title  = {CS285 Deep Reinforcement Learning},
    author = {Levine, Sergey},
    year   = {2023},
    howpublished = {UC Berkeley course \url{http://rail.eecs.berkeley.edu/deeprlcourse/}}
  }
---

## TL;DR
全球公认的**深度 RL** 黄金标准课程；授课人 Sergey Levine 是 deep RL 与机器人学的奠基者之一。开篇先讲 *imitation / behavioral cloning 与协变量偏移*，然后把 *PG / Actor-Critic / DQN / SAC / Model-based RL / IRL / Offline RL* 一网打尽。读完它+赵世钰课，你具备读 [DiLu](paper_2309.16292_dilu.md)、[Agent-Driver](paper_2311.10813_agent_driver.md)、[CF-VLA](paper_2512.24426_cfvla.md) 的全部 RL 背景。

## 位置 / Why it matters
- 它把 [Zhao](course_zhao_shiyu_rl.md) 的纯公式 RL **嵌进神经网络**：参数化策略、参数化 Q、replay buffer、target network、$\epsilon$-greedy 实现细节、稳定性 trick……
- 它是 [Bitter Lesson](essay_bitter_lesson.md) 在 RL 教学里**唯一被讲师直接朗读**的开篇短文（Lec 1）；
- 它的 Lec 2 *imitation learning* 直接对应自动驾驶 BC / E2E 范式的"奠基性失败模式"——*compounding error*——而这正是 [PlanT](paper_2210.14222_plant.md)、[UniAD](paper_2212.10156_uniad.md) 类工作必须面对的问题。

## 数学锚点 / Math anchor
- **策略梯度定理**（REINFORCE）：
$$
\nabla_\theta J(\theta) \;=\; \mathbb{E}_{\tau\sim p_\theta(\tau)} \Big[\sum_{t=0}^{T} \nabla_\theta \log\pi_\theta(a_t|s_t)\, R(\tau)\Big]
$$
- **Actor-Critic**：用 $A^\pi(s,a) = Q^\pi(s,a) - V^\pi(s)$ 替代 $R(\tau)$ 降方差；
- **PPO 替代目标**：
$$
J^{\text{CLIP}}(\theta) = \mathbb{E}_t\Big[\min\big(r_t(\theta) \hat{A}_t,\;\mathrm{clip}(r_t(\theta),1-\epsilon,1+\epsilon)\hat{A}_t\big)\Big]
$$
- **SAC 软最优**：在 reward 上加 entropy bonus，$\max\mathbb{E}\big[\sum_t r_t + \alpha\mathcal{H}(\pi(\cdot|s_t))\big]$；
- **DAgger**：迭代地把 expert 在学生策略访问到的 state 上的动作加入训练集，缓解 BC 的 covariate shift。

## 架构 / Architectural intuition
课程主线（按重要性排序）：

| 模块 | 内容 | 与本图谱关联 |
|---|---|---|
| Lec 1 + Bitter Lesson | 课程哲学 | [Bitter Lesson](essay_bitter_lesson.md) |
| Lec 2 Imitation | BC / DAgger / 协变量偏移 | [PlanT](paper_2210.14222_plant.md), [UniAD](paper_2212.10156_uniad.md) |
| Lec 4–5 Policy Gradient / AC | REINFORCE → A2C → PPO | [Agent-Driver 训练](paper_2311.10813_agent_driver.md) |
| Lec 6–8 Value-based | DQN, double-Q, Q-targets | [DQN](paper_mnih2015_dqn.md) |
| Lec 9–11 Model-based | World model, MPC | [GAIA-1](paper_gaia1.md), [CF-VLA](paper_2512.24426_cfvla.md) |
| Lec 14 IRL | reward learning from demos | [RLHF/DPO](paper_rlhf_dpo.md), 现代 VLA 微调 |
| Lec 15+ Offline RL | learn from logs only | 自动驾驶 production data 复用 |

> 物理直觉：把 deep RL 想成"经典 RL 的每个组件，被一个神经网络替换；同时被 *replay / target network / clipping* 等 stabiliser 缝起来"。

## 工程 / Engineering notes
- 课程作业（公开）：从 BC + DAgger 一路写到 SAC，是入门 deep RL 实现的最佳练习。
- 框架：作业用 PyTorch；社区有完整 jax 版本。
- 时长：完整 ~25 节，每节 1.5h；建议先精看 Lec 1–11，其他按需。

## 深度阅读路径 / Deep-anchored reading order
1. **Lec 1**——必看；用来与 [Bitter Lesson](essay_bitter_lesson.md) 对照。
2. **Lec 2 Imitation**——核心；本图谱 [lab02](../../../labs/lab02_cs285_bc_vs_dagger_minicar.ipynb) 直接复刻"BC 失败 / DAgger 修好"。
3. **Lec 4–5 PG / AC**——配赵世钰 Lec 8/10 一起读。
4. **Lec 6–8 Q-learning**——配 [DQN 论文](paper_mnih2015_dqn.md)。
5. **Lec 14 IRL**——理解 [RLHF / DPO](paper_rlhf_dpo.md) 的早期思想根源。

## Bitter-Lesson 视角 / lens
*Levine 在课程开篇明确放出 Bitter Lesson 作为 deep RL 哲学根；他自己后续工作（offline RL、foundation policy）也基本贯彻"general method + scale"。这门课就是 Bitter Lesson 在 deep RL 子领域的**操作化指南**。*

## 后续节点 / Suggested next nodes
- → [Zhao Mathematical Foundations of RL](course_zhao_shiyu_rl.md)
- → [Bitter Lesson](essay_bitter_lesson.md)
- → [DAgger](paper_ross2011_dagger.md) · [DQN](paper_mnih2015_dqn.md) · [PPO](paper_schulman2017_ppo.md) · [RLHF/DPO](paper_rlhf_dpo.md)
- → [DiLu (2309.16292)](paper_2309.16292_dilu.md) · [Agent-Driver](paper_2311.10813_agent_driver.md)

## 配套实验 / Lab
[`labs/lab02_cs285_bc_vs_dagger_minicar.ipynb`](../../../labs/lab02_cs285_bc_vs_dagger_minicar.ipynb) — 在 1-D 玩具 car 控制环境上：BC 在分布内表现完美但**离分布**就崩；DAgger 通过迭代 expert 标注修复；可视化 trajectory 与误差累积。
