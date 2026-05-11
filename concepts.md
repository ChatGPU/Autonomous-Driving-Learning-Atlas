# 概念地图 / Concept Atlas

> ~30 个原子概念，每条 1 行**最佳数学来源 / 最佳直觉来源 / 代表性论文 / 配套实验 / 深度链接**。
> 与 [`docs/data/graph.json`](docs/data/graph.json) 中的 `concept:*` 节点一一对应；点击任何 *concept* 节点会回链到此文件的对应锚。

## 强化学习基础 / RL foundations

### MDP
- **数学**：[Zhao Lec 1](docs/data/cards/course_zhao_shiyu_rl.md) · 严格定义 $(\mathcal{S},\mathcal{A},P,R,\gamma)$
- **直觉**：[3Blue1Brown](docs/data/cards/channel_3blue1brown.md) — *Calculus* + *Linear Algebra* 的几何视角
- **代表论文**：经典 Bellman 1957；现代综述见 [Sutton & Barto 教材](docs/data/cards/paper_sutton_barto.md)
- **实验**：[`labs/lab01_zhao_value_iteration_gridworld.ipynb`](labs/lab01_zhao_value_iteration_gridworld.ipynb)

### Bellman 方程
- **数学**：Zhao Lec 2 — 期望方程 + 矩阵形式 + Banach 不动点
- **直觉**：把 $V_\pi(s)$ 想成"现在站在 s，按 $\pi$ 走完后的期望累计奖励"
- **代表论文**：[赵世钰课程](docs/data/cards/course_zhao_shiyu_rl.md)
- **公式**：
$$v_\pi(s) = \mathbb{E}_\pi\big[R_{t+1}+\gamma v_\pi(S_{t+1}) \mid S_t=s\big]$$

### 值迭代 / 策略迭代
- **数学**：Zhao Lec 3-4 — 收敛性源自 Bellman 算子的 $\gamma$-contraction
- **代表论文**：Bellman 1957；[赵世钰课程](docs/data/cards/course_zhao_shiyu_rl.md)
- **实验**：[`labs/lab01`](labs/lab01_zhao_value_iteration_gridworld.ipynb)

### TD学习 / Q-learning / SARSA
- **数学**：Zhao Lec 5-6
- **直觉**：bootstrap = 用估计值更新估计值
- **代表论文**：Watkins 1989 (Q-learning)；[CS285 Lec 6-8](docs/data/cards/course_cs285_levine.md)
- **公式**（Q-learning）：
$$Q(s,a) \leftarrow Q(s,a) + \alpha\big[r+\gamma\max_{a'}Q(s',a')-Q(s,a)\big]$$

## 深度强化学习 / Deep RL

### Policy Gradient / REINFORCE
- **数学**：Zhao Lec 8 + [CS285 Lec 5](docs/data/cards/course_cs285_levine.md)
- **代表论文**：Williams 1992；[CS285](docs/data/cards/course_cs285_levine.md)
- **公式**：
$$\nabla_\theta J = \mathbb{E}_{\tau}\Big[\sum_t \nabla_\theta\log\pi_\theta(a_t|s_t)\,R(\tau)\Big]$$

### Actor-Critic
- **代表论文**：A3C (Mnih 2016)；[CS285 Lec 6](docs/data/cards/course_cs285_levine.md)
- **核心**：critic $V^\pi$ 给出 advantage $\hat A_t = Q-V$，降低 PG 方差

### PPO
- **代表论文**：[Schulman 2017 PPO 卡片](docs/data/cards/paper_schulman2017_ppo.md)
- **公式**：CLIP 替代目标 — 见 PPO 卡片

### DQN
- **代表论文**：[Mnih 2015 DQN 卡片](docs/data/cards/paper_mnih2015_dqn.md)
- **关键**：replay buffer + target network 让 Q 学习在神经网络上稳定

### Replay buffer
- **代表论文**：[DQN](docs/data/cards/paper_mnih2015_dqn.md)；[Lin 1992](https://link.springer.com/article/10.1007/BF00992699) 原始提案
- **直觉**：把 transitions 缓存随机采样，打破时序相关性

### 模仿学习 / BC
- **代表论文**：[CS285 Lec 2](docs/data/cards/course_cs285_levine.md)；ALVINN (Pomerleau 1989) 是历史起点
- **AD 应用**：[PlanT](docs/data/cards/paper_2210.14222_plant.md)、[UniAD](docs/data/cards/paper_2212.10156_uniad.md)、[TransFuser](docs/data/cards/paper_transfuser.md)
- **实验**：[`labs/lab02`](labs/lab02_cs285_bc_vs_dagger_minicar.ipynb)

### 协变量偏移
- **代表论文**：[DAgger (Ross 2011) 卡片](docs/data/cards/paper_ross2011_dagger.md)
- **直觉**：训练 distribution ≠ 部署 distribution，BC 误差累积
- **修法**：DAgger / on-policy 数据收集

### RLHF
- **代表论文**：[RLHF/DPO 卡片](docs/data/cards/paper_rlhf_dpo.md)
- **AD 应用**：[CF-VLA](docs/data/cards/paper_2512.24426_cfvla.md) 的微调阶段

## 数学 + 视觉骨干 / Math + Vision Foundation

### Transformer
- **代表论文**：[Attention Is All You Need 卡片](docs/data/cards/paper_vaswani2017.md)
- **直觉**：[3Blue1Brown *Attention in transformers*](https://www.youtube.com/watch?v=eMlx5fFNoYc)
- **精读**：[Mu Li B 站 Transformer 精读](https://www.bilibili.com/video/BV1pu411o7BE/)

### Self-Attention
- **公式**：
$$\mathrm{Attn}(Q,K,V) = \mathrm{softmax}\!\big(QK^\top/\sqrt{d_k}\big)V$$
- **直觉**：每个 token "投票"决定它从其他 token 借多少信息

### DETR query
- **代表论文**：[DETR (Carion 2020) 卡片](docs/data/cards/paper_carion2020.md)
- **AD 衍生**：[BEVFormer](docs/data/cards/paper_li2022bevformer.md) → [UniAD](docs/data/cards/paper_2212.10156_uniad.md) 全部基于"object query"思想

### BEV感知
- **代表论文**：[BEVFormer](docs/data/cards/paper_li2022bevformer.md)
- **AD 应用**：[UniAD](docs/data/cards/paper_2212.10156_uniad.md)、[VADv2](docs/data/cards/paper_vadv2.md)

### SSL（自监督学习）
- **代表论文**：[DINOv2](docs/data/cards/paper_dinov2.md) → [DINOv3](docs/data/cards/paper_2508.10104_dinov3.md)
- **关键**：自蒸馏 + Gram anchoring（DINOv3 新意）

## VLM / VLA / Agent

### VLM
- **代表**：[LLaVA / Qwen-VL](docs/data/cards/paper_llava.md)
- **AD 应用**：[DriveVLM](docs/data/cards/paper_2402.12289_drivevlm.md)、[CF-VLA](docs/data/cards/paper_2512.24426_cfvla.md)

### VLA
- **代表**：[DriveVLM](docs/data/cards/paper_2402.12289_drivevlm.md)、[CF-VLA](docs/data/cards/paper_2512.24426_cfvla.md)
- **核心**：从 vision + language **直接输出 action**（轨迹 / meta-action）

### Chain-of-Thought
- **代表论文**：Wei 2022 CoT；[DriveVLM](docs/data/cards/paper_2402.12289_drivevlm.md) 三步 prompt
- **直觉**：让模型把"想"显式写出来，比"直接答"更可靠

### Tool use
- **代表论文**：Toolformer (2023)；[Agent-Driver](docs/data/cards/paper_2311.10813_agent_driver.md) 的 tool library
- **AD 应用**：感知/地图/查询封装为 LLM 可调函数

### 反事实推理
- **代表论文**：[CF-VLA](docs/data/cards/paper_2512.24426_cfvla.md)
- **直觉**：在执行前问 *"如果我这样做会怎样？"*

### Meta-action
- **代表论文**：[CF-VLA](docs/data/cards/paper_2512.24426_cfvla.md)、[DriveVLM](docs/data/cards/paper_2402.12289_drivevlm.md)
- **直觉**：一段轨迹被压缩成"减速/变道/超车"等可解释 token

## 类脑 + 哲学

### 脉冲神经网络
- **代表论文**：[Spike-driven Transformer](docs/data/cards/paper_2307.01694_spike_driven_transformer.md)
- **AD 应用**：低功耗车端推理；事件相机天然适配
- **实验**：[`labs/lab06`](labs/lab06_spike_driven_attention_mnist.ipynb)

### Scaling vs 人工知识
- **代表论文**：[The Bitter Lesson](docs/data/cards/essay_bitter_lesson.md)
- **AD 视角**：[DiLu](docs/data/cards/paper_2309.16292_dilu.md) 与 [DriveVLM](docs/data/cards/paper_2402.12289_drivevlm.md) 是这一争论的现代试金石
