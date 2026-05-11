---
id: course:zhao_rl
title: "Mathematical Foundations of Reinforcement Learning (Zhao Shiyu)"
title_zh: "强化学习的数学原理（赵世钰，西湖大学）"
kind: course
tier: spine
authors: [Zhao, S.]
venue: "Westlake University · Springer 2025"
year: 2024
topic: rl_foundations
phase: prereq
prereqs: []
extends: []
contrasts: []
parallel: [course:cs285]
contested_by: []
labs: [lab01]
deep_links:
  - {label: "课程站点（学生整理 mirror，含本资料链接）", url: "https://zw510644628.github.io/reinforcement-learning/"}
  - {label: "作者主页 + 官方课程", url: "https://www.shiyuzhao.net/opencourse"}
  - {label: "GitHub: Book-Mathematical-Foundation-of-Reinforcement-Learning", url: "https://github.com/MathFoundationRL/Book-Mathematical-Foundation-of-Reinforcement-Learning"}
  - {label: "Springer 出版（2025）", url: "https://link.springer.com/book/10.1007/978-981-97-3944-8"}
  - {label: "B 站中文讲解 playlist", url: "https://www.bilibili.com/video/BV1sd4y167NS/"}
  - {label: "YouTube 英文 playlist", url: "https://www.youtube.com/playlist?list=PLEhdbSEZZbDaFWPhprhCwTOTMaRqA-1cW"}
bibtex: |
  @book{zhao2024mathfoundationrl,
    title  = {Mathematical Foundations of Reinforcement Learning},
    author = {Zhao, Shiyu},
    publisher = {Springer Nature},
    year   = {2025}
  }
---

## TL;DR
赵世钰《强化学习的数学原理》是面向**初次系统学 RL 的研究者**最严谨而友好的中文 + 英文教材：从 *MDP / Bellman / Bellman-optimality* 严格推到 *value iteration / policy iteration / MC / TD / 函数近似 / 策略梯度 / actor-critic*。**不**讲深度 RL 的工程细节，但把所有公式的来源与必要性都讲透——读完就能无障碍读 [CS285](course_cs285_levine.md) 的深度部分。

## 位置 / Why it matters
本图谱里**所有**涉及 RL 的论文（Agent-Driver / DiLu / CF-VLA / Bitter Lesson / DriveVLM）都默认读者懂 Bellman 方程、$\epsilon$-greedy、Q-learning。如果你跳过这门课直接读 deep RL，会在 *advantage / TD-error / actor-critic 推导* 上反复卡住。

它和 CS285 是天然分工：**Zhao 课程负责"为什么是这条公式"，CS285 负责"在深度网络下怎么把公式实现到 SOTA"**。

## 数学锚点 / Math anchor
本课程的"地标公式"——**Bellman 期望方程**：
$$
v_\pi(s) = \mathbb{E}_\pi\Big[R_{t+1} + \gamma v_\pi(S_{t+1}) \,\Big|\, S_t=s\Big]
$$
和 **Bellman 最优方程**：
$$
v^\star(s) = \max_{a\in\mathcal{A}(s)}\; \mathbb{E}\Big[R_{t+1} + \gamma v^\star(S_{t+1}) \,\Big|\, S_t=s,\,A_t=a\Big]
$$
两者的几何理解：*在 Banach 空间上，Bellman 算子是一个 $\gamma$-contraction*；这是值迭代收敛的核心原因。这个观点贯穿全书。

## 架构 / Architectural intuition
课程章节大致：

1. 基本概念（state / action / reward / return / policy）
2. **Bellman 方程**（推导 + 矩阵形式）
3. **Bellman 最优 + 值迭代 / 策略迭代**（contraction 收敛）
4. **MC 方法**（无模型，但需要完整 episode）
5. **TD 方法**（bootstrap，单步即可更新；Sarsa / Q-learning / TD($\lambda$)）
6. **值函数近似**（线性 + 神经网络；DQN 的根）
7. **策略梯度**（REINFORCE 推导）
8. **Actor-Critic**（把策略梯度的方差通过 critic 降下来）

> 物理直觉：把 RL 想成"在一张未知的地图上走路，每一步获得奖励"。Bellman 方程让你用"未来怎样"反推"现在该选哪条路"。

## 工程 / Engineering notes
- 时长：B 站完整 ~30+ 小时。建议至少看完 Lecture 1–6（MDP 到 TD），其他章节可作论文应用回查。
- 配套书有 GitHub 上的免费 PDF（>15K stars），并配代码 demo（部分章节）。
- 配套实验：本图谱 [lab01](../../../labs/lab01_zhao_value_iteration_gridworld.ipynb) 在 4×4 stochastic gridworld 上跑值迭代，画收敛曲线 + $V^\star$ 热图。

## 深度阅读路径 / Deep-anchored reading order
1. **Lecture 1（基本概念）+ Lecture 2（Bellman 方程）**——必看；
2. **Lecture 3（Bellman 最优）+ Lecture 4（值迭代/策略迭代）**——必看；
3. **Lecture 5–6（MC / TD）**——为深度 RL 打底；
4. **Lecture 7（值函数近似）**——通往 DQN 的直接桥梁；
5. **Lecture 8 + 10（策略梯度 + Actor-Critic）**——可与 CS285 Lec 5、Lec 6 并读。

## Bitter-Lesson 视角 / lens
*Zhao 课程是**纯数学 / 算法骨架**，不直接卷入 Bitter Lesson 之争。但它在哲学上**支持** Sutton：所有"经典 RL"算法都是 *general-purpose search + learning*，没有任何领域知识。理解了 Bellman 算子的不动点性质，就能直观理解为什么"靠 search + learning + scale" 是 AI 的长期赢家。*

## 后续节点 / Suggested next nodes
- → [CS285 (Sergey Levine)](course_cs285_levine.md) ：深度 RL 的延伸
- → [DQN (mnih2015)](paper_mnih2015_dqn.md) · [PPO (schulman2017)](paper_schulman2017_ppo.md) · [DAgger (ross2011)](paper_ross2011_dagger.md)
- → [DiLu (2309.16292)](paper_2309.16292_dilu.md) ：把 RL 与 LLM 之争作为应用背景
- → [`concept:bellman_eq`](../../concepts.md) · [`concept:value_iteration`](../../concepts.md) · [`concept:td_learning`](../../concepts.md)

## 配套实验 / Lab
[`labs/lab01_zhao_value_iteration_gridworld.ipynb`](../../../labs/lab01_zhao_value_iteration_gridworld.ipynb) — 在 4×4 stochastic gridworld 上跑 value iteration，可视化 $V^\star$ 热图与最优策略箭头；可调 $\gamma$ 观察 contraction 速率。
