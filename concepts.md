# 概念地图 / Concept Atlas

> ~30 个原子概念，每条 1 行**最佳数学来源 / 最佳直觉来源 / 代表性论文 / 配套实验 / 深度链接**。
> 与 [`docs/data/graph.json`](docs/data/graph.json) 中的 `concept:*` 节点一一对应；点击任何 *concept* 节点会回链到此文件的对应锚。

## 强化学习基础 / RL foundations

### MDP
MDP 是把“一个智能体在环境中连续做决定”写成数学语言的最小舞台。你可以把它想成一张带概率的地图：站在哪个状态、选择哪个动作、会以多大概率到哪里、拿到多少回报。

- **数学**：[Zhao Lec 1](docs/data/cards/course_zhao_shiyu_rl.md) · 严格定义 $(\mathcal{S},\mathcal{A},P,R,\gamma)$
- **直觉**：[3Blue1Brown](docs/data/cards/channel_3blue1brown.md) — *Calculus* + *Linear Algebra* 的几何视角
- **代表论文**：经典 Bellman 1957；现代综述见 [Sutton & Barto 教材](docs/data/cards/paper_sutton_barto.md)
- **实验**：[`labs/lab01_zhao_value_iteration_gridworld.ipynb`](labs/lab01_zhao_value_iteration_gridworld.ipynb)

### Bellman 方程
Bellman 方程的直觉是“今天的价值 = 眼前收益 + 明天价值的折现”。它把一个长时间决策问题拆成一步一步的递推，因此是后面 value iteration、Q-learning、actor-critic 的共同语法。

- **数学**：Zhao Lec 2 — 期望方程 + 矩阵形式 + Banach 不动点
- **直觉**：把 $V_\pi(s)$ 想成"现在站在 s，按 $\pi$ 走完后的期望累计奖励"
- **代表论文**：[赵世钰课程](docs/data/cards/course_zhao_shiyu_rl.md)
- **公式**：
$$v_\pi(s) = \mathbb{E}_\pi\big[R_{t+1}+\gamma v_\pi(S_{t+1}) \mid S_t=s\big]$$

### 值迭代 / 策略迭代
值迭代和策略迭代是在 MDP 里寻找好策略的两种经典路线：前者不断改进“每个状态值多少钱”，后者在“评估当前策略”和“改进策略”之间来回切换。

- **数学**：Zhao Lec 3-4 — 收敛性源自 Bellman 算子的 $\gamma$-contraction
- **代表论文**：Bellman 1957；[赵世钰课程](docs/data/cards/course_zhao_shiyu_rl.md)
- **实验**：[`labs/lab01`](labs/lab01_zhao_value_iteration_gridworld.ipynb)

### TD学习 / Q-learning / SARSA
TD learning 的关键是 bootstrap：不用等整局结束，就用下一步的估计来更新当前估计。Q-learning 与 SARSA 的差别，可以先理解成“我用最贪心的未来更新”还是“我用实际会执行的未来更新”。

- **数学**：Zhao Lec 5-6
- **直觉**：bootstrap = 用估计值更新估计值
- **代表论文**：Watkins 1989 (Q-learning)；[CS285 Lec 6-8](docs/data/cards/course_cs285_levine.md)
- **公式**（Q-learning）：
$$Q(s,a) \leftarrow Q(s,a) + \alpha\big[r+\gamma\max_{a'}Q(s',a')-Q(s,a)\big]$$

## 深度强化学习 / Deep RL

### Policy Gradient / REINFORCE
Policy Gradient 直接调整策略参数，让“更可能带来高回报的动作”在下次更容易被采样到。它不像 value-based 方法先学一个价值表，而是把优化目标直接压到 $\pi_\theta(a|s)$ 上。

- **数学**：Zhao Lec 8 + [CS285 Lec 5](docs/data/cards/course_cs285_levine.md)
- **代表论文**：Williams 1992；[CS285](docs/data/cards/course_cs285_levine.md)
- **公式**：
$$\nabla_\theta J = \mathbb{E}_{\tau}\Big[\sum_t \nabla_\theta\log\pi_\theta(a_t|s_t)\,R(\tau)\Big]$$

### Actor-Critic
Actor-Critic 把“做决定的人”和“评估决定的人”分开：actor 负责选动作，critic 负责估计这个动作比平均水平好多少。这个分工让 policy gradient 的方差下降，也让深度 RL 更容易训练。

- **代表论文**：A3C (Mnih 2016)；[CS285 Lec 6](docs/data/cards/course_cs285_levine.md)
- **核心**：critic $V^\pi$ 给出 advantage $\hat A_t = Q-V$，降低 PG 方差

### PPO
PPO 的核心是“策略可以更新，但别一步迈太大”。它用 clipped objective 限制新旧策略的概率比，既保留 policy gradient 的灵活性，又避免训练突然崩掉。

- **代表论文**：[Schulman 2017 PPO 卡片](docs/data/cards/paper_schulman2017_ppo.md)
- **公式**：CLIP 替代目标 — 见 PPO 卡片

### DQN
DQN 是把 Q-learning 放进神经网络后的里程碑。它证明了一个卷积网络加上 replay buffer 和 target network，就能从像素中学 Atari 控制策略。

- **代表论文**：[Mnih 2015 DQN 卡片](docs/data/cards/paper_mnih2015_dqn.md)
- **关键**：replay buffer + target network 让 Q 学习在神经网络上稳定

### Replay buffer
Replay buffer 像一本经验相册：智能体把过去见过的 transition 存起来，训练时随机抽样。这样做能打散时间相关性，也能让稀有但重要的经验被重复利用。

- **代表论文**：[DQN](docs/data/cards/paper_mnih2015_dqn.md)；[Lin 1992](https://link.springer.com/article/10.1007/BF00992699) 原始提案
- **直觉**：把 transitions 缓存随机采样，打破时序相关性

### 模仿学习 / BC
模仿学习先不问“怎样探索最优策略”，而问“能不能先学会像专家一样开”。Behavior cloning（BC）最简单：把专家状态-动作对当监督学习数据，但它会在分布偏移时暴露弱点。

- **代表论文**：[CS285 Lec 2](docs/data/cards/course_cs285_levine.md)；ALVINN (Pomerleau 1989) 是历史起点
- **AD 应用**：[PlanT](docs/data/cards/paper_2210.14222_plant.md)、[UniAD](docs/data/cards/paper_2212.10156_uniad.md)、[TransFuser](docs/data/cards/paper_transfuser.md)
- **实验**：[`labs/lab02`](labs/lab02_cs285_bc_vs_dagger_minicar.ipynb)

### 协变量偏移
协变量偏移是 BC 在驾驶中最容易摔倒的地方：训练时模型看到的是专家带来的状态，部署时看到的是自己犯小错后滚出来的新状态。小偏差会被连续决策放大成大事故。

- **代表论文**：[DAgger (Ross 2011) 卡片](docs/data/cards/paper_ross2011_dagger.md)
- **直觉**：训练 distribution ≠ 部署 distribution，BC 误差累积
- **修法**：DAgger / on-policy 数据收集

### RLHF
RLHF 把“人觉得哪个输出更好”变成模型可以优化的信号。它对 VLA 的意义在于：安全、礼让、可解释这类目标很难手写成奖励函数，却可以通过偏好比较逐步学习。

- **代表论文**：[RLHF/DPO 卡片](docs/data/cards/paper_rlhf_dpo.md)
- **AD 应用**：[CF-VLA](docs/data/cards/paper_2512.24426_cfvla.md) 的微调阶段

## 数学 + 视觉骨干 / Math + Vision Foundation

### Transformer
Transformer 把序列建模的中心从 recurrent state 转向 attention：每个 token 都可以直接读取其他 token 的信息。自动驾驶里的 query、BEV token、VLM prompt，本质上都在借这套通信机制。

- **代表论文**：[Attention Is All You Need 卡片](docs/data/cards/paper_vaswani2017.md)
- **直觉**：[3Blue1Brown *Attention in transformers*](https://www.youtube.com/watch?v=eMlx5fFNoYc)
- **精读**：[Mu Li B 站 Transformer 精读](https://www.bilibili.com/video/BV1pu411o7BE/)

### Self-Attention
Self-Attention 可以理解成“每个 token 向其他 token 借信息”。Query 问“我需要什么”，Key 回答“我有什么”，Value 才是真正被汇入的新信息。

- **公式**：
$$\mathrm{Attn}(Q,K,V) = \mathrm{softmax}\!\big(QK^\top/\sqrt{d_k}\big)V$$
- **直觉**：每个 token "投票"决定它从其他 token 借多少信息

### DETR query
DETR query 是一组会主动去图像特征里“找对象”的 learnable slots。它让检测从密集 anchor 设计转向集合预测，也启发了 BEVFormer、UniAD、PlanT 里的各种 query。

- **代表论文**：[DETR (Carion 2020) 卡片](docs/data/cards/paper_carion2020.md)
- **AD 衍生**：[BEVFormer](docs/data/cards/paper_li2022bevformer.md) → [UniAD](docs/data/cards/paper_2212.10156_uniad.md) 全部基于"object query"思想

### BEV感知
BEV（bird's-eye view）把多摄像头图像翻译成俯视坐标系。对驾驶来说，这是把“相机看到的透视世界”变成“车真正要规划的地面世界”的关键桥梁。

- **代表论文**：[BEVFormer](docs/data/cards/paper_li2022bevformer.md)
- **AD 应用**：[UniAD](docs/data/cards/paper_2212.10156_uniad.md)、[VADv2](docs/data/cards/paper_vadv2.md)

### SSL（自监督学习）
自监督学习试图从数据本身产生训练信号：同一张图的不同视角应该相近，被遮住的内容应该能推回去。它减少了对人工标签的依赖，也让视觉 backbone 更像通用地基。

- **代表论文**：[DINOv2](docs/data/cards/paper_dinov2.md) → [DINOv3](docs/data/cards/paper_2508.10104_dinov3.md)
- **关键**：自蒸馏 + Gram anchoring（DINOv3 新意）

## VLM / VLA / Agent

### VLM
VLM（Vision-Language Model）把图像和文字放进同一个语义空间。自动驾驶用它，不只是为了描述画面，而是为了让模型把视觉长尾、交通语义和自然语言推理连起来。

- **代表**：[LLaVA / Qwen-VL](docs/data/cards/paper_llava.md)
- **AD 应用**：[DriveVLM](docs/data/cards/paper_2402.12289_drivevlm.md)、[CF-VLA](docs/data/cards/paper_2512.24426_cfvla.md)

### VLA
VLA（Vision-Language-Action）在 VLM 之后再多走一步：不仅看图和说话，还要输出可执行动作。对驾驶来说，关键问题是如何把语言级判断稳定落到轨迹或 meta-action 上。

- **代表**：[DriveVLM](docs/data/cards/paper_2402.12289_drivevlm.md)、[CF-VLA](docs/data/cards/paper_2512.24426_cfvla.md)
- **核心**：从 vision + language **直接输出 action**（轨迹 / meta-action）

### Chain-of-Thought
Chain-of-Thought 让模型把中间推理写出来。它不保证推理一定真实，但在复杂决策里，显式步骤能提供更多可检查、可调试、可蒸馏的结构。

- **代表论文**：Wei 2022 CoT；[DriveVLM](docs/data/cards/paper_2402.12289_drivevlm.md) 三步 prompt
- **直觉**：让模型把"想"显式写出来，比"直接答"更可靠

### Tool use
Tool use 是让 LLM 不只靠参数记忆，而能调用外部函数、地图、检索器或规划模块。Agent-Driver 的关键启发就是：把驾驶环境整理成 LLM 可以询问的一组工具。

- **代表论文**：Toolformer (2023)；[Agent-Driver](docs/data/cards/paper_2311.10813_agent_driver.md) 的 tool library
- **AD 应用**：感知/地图/查询封装为 LLM 可调函数

### 反事实推理
反事实推理是在执行前问一句：“如果我真的这样做，会发生什么？”它把驾驶决策从“给出一个 plan”推进到“先质疑这个 plan，再修正它”。

- **代表论文**：[CF-VLA](docs/data/cards/paper_2512.24426_cfvla.md)
- **直觉**：在执行前问 *"如果我这样做会怎样？"*

### Meta-action
Meta-action 是把连续轨迹压成更高层的动作词，例如减速、变道、等待。它牺牲了一些低层细节，但换来可解释性，也更容易和语言模型对接。

- **代表论文**：[CF-VLA](docs/data/cards/paper_2512.24426_cfvla.md)、[DriveVLM](docs/data/cards/paper_2402.12289_drivevlm.md)
- **直觉**：一段轨迹被压缩成"减速/变道/超车"等可解释 token

## 类脑 + 哲学

### 脉冲神经网络
脉冲神经网络（spiking neural network, SNN）用离散 spike 传递信息，更接近事件驱动硬件。它在自动驾驶中的吸引力来自能耗：车端电池、散热和实时性会把“算得起”变成核心约束。

- **代表论文**：[Spike-driven Transformer](docs/data/cards/paper_2307.01694_spike_driven_transformer.md)
- **AD 应用**：低功耗车端推理；事件相机天然适配
- **实验**：[`labs/lab06`](labs/lab06_spike_driven_attention_mnist.ipynb)

### Scaling vs 人工知识
这组概念不是要在“规模化学习”和“人工知识”之间二选一，而是提醒你：一个系统的长期能力，究竟来自通用学习器吃进更多数据，还是来自人类把领域结构写进模型？

- **代表论文**：[The Bitter Lesson](docs/data/cards/essay_bitter_lesson.md)
- **AD 视角**：[DiLu](docs/data/cards/paper_2309.16292_dilu.md) 与 [DriveVLM](docs/data/cards/paper_2402.12289_drivevlm.md) 是这一争论的现代试金石
