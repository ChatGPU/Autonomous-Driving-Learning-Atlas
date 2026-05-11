---
id: paper:schulman2017_ppo
title: "PPO — Proximal Policy Optimization"
title_zh: "PPO：近端策略优化"
kind: paper
tier: S
authors: [Schulman, J., Wolski, F., Dhariwal, P., Radford, A., Klimov, O.]
venue: "arXiv 2017"
year: 2017
topic: deep_rl
phase: core
prereqs: [course:zhao_rl]
extends: []
contrasts: []
parallel: []
contested_by: []
labs: []
deep_links:
  - {label: "PDF", url: "https://arxiv.org/pdf/1707.06347"}
  - {label: "PDF p.3 §3 CLIP 目标", url: "https://arxiv.org/pdf/1707.06347#page=3"}
  - {label: "OpenAI Spinning Up PPO 解析", url: "https://spinningup.openai.com/en/latest/algorithms/ppo.html"}
bibtex: |
  @article{schulman2017ppo,
    title  = {Proximal Policy Optimization Algorithms},
    author = {Schulman, John and Wolski, Filip and Dhariwal, Prafulla and Radford, Alec and Klimov, Oleg},
    journal= {arXiv preprint arXiv:1707.06347},
    year   = {2017}
  }
---

## TL;DR
PPO = TRPO 的工程化简化版：把策略更新约束从二阶 KL 约束改为**对概率比 $r_t(\theta)$ 的 clipped 替代目标**，**实现简单 + 稳定 + 性能强**，自此成为 deep RL（尤其 RLHF）的事实默认算法。

## 位置 / Why it matters
- [RLHF / DPO](paper_rlhf_dpo.md) 与 [GPT-3](paper_gpt3.md) 之后的 InstructGPT 都用 PPO 微调；
- [CS285](course_cs285_levine.md) Lec 5 必讲；
- [CF-VLA](paper_2512.24426_cfvla.md) 这种 reasoning-augmented VLA 的 reward-tuning 阶段经常以 PPO/DPO 为底层。

## 数学锚点 / Math anchor
设概率比 $r_t(\theta)=\pi_\theta(a_t|s_t)/\pi_{\theta_{\text{old}}}(a_t|s_t)$，**CLIP 目标**：
$$
J^{\text{CLIP}}(\theta) = \mathbb{E}_t\Big[\min\!\big(r_t(\theta)\hat A_t,\;\mathrm{clip}(r_t(\theta),1-\epsilon,1+\epsilon)\hat A_t\big)\Big]
$$
直觉：**当 $r_t$ 偏离 1 太远时，目标被夹住**——避免一次更新跑得太远导致策略崩溃。

## 架构 / Architectural intuition
- Actor + Critic 双网络；
- 每次采集多条 trajectory 做多 epoch mini-batch 优化；
- 常配 GAE（Generalized Advantage Estimation）做 advantage 估计。

## 工程 / Engineering notes
- $\epsilon \in [0.1, 0.3]$ 是常见超参；
- 实现：`stable-baselines3`、`cleanrl` 都有干净版本。
- License：开源。

## Bitter-Lesson 视角 / lens
*PPO 的设计哲学完全符合 Bitter Lesson：用更通用、更易 scale 的损失替代复杂的二阶约束。后续在 LLM 后训练上跑了一万亿 token 仍然稳定，证明了它的可扩展性。*

## 后续节点 / Suggested next nodes
- → [DQN](paper_mnih2015_dqn.md) · [RLHF/DPO](paper_rlhf_dpo.md) · [CS285](course_cs285_levine.md)
- → [`concept:ppo`](../../concepts.md)
