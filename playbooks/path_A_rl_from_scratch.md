# Path A · 强化学习从零 / RL from Scratch

> **适合读者**：数学基础扎实，但没有正式学过 RL；目标是能读懂 [DiLu](../docs/data/cards/paper_2309.16292_dilu.md)、[Agent-Driver](../docs/data/cards/paper_2311.10813_agent_driver.md)、[CF-VLA](../docs/data/cards/paper_2512.24426_cfvla.md) 这三篇论文背后的 RL 范式之争。
> **预计时长**：~25 小时（视频 + 阅读 + lab）。
> **完成后你能**：从公式上推导 Bellman / 策略梯度；从工程上搭起 Q-learning、PPO；理解为什么"知识驱动 vs 数据驱动"在 LLM 时代会变成核心议题。

## 推荐顺序

| # | 节点 | 内容 / 重点 | 估时 |
|---|---|---|---|
| 1 | [赵世钰课程 · Lec 1–6](../docs/data/cards/course_zhao_shiyu_rl.md) | MDP → Bellman → VI/PI → MC/TD。**全程必看**，是后面一切的"语法"。 | 12 h |
| 2 | [The Bitter Lesson](../docs/data/cards/essay_bitter_lesson.md) | 两页 A4 必读。看完去想：本文怎样质疑"我接下来要学的算法"？ | 15 min |
| 3 | [CS285 · Lec 1–2](../docs/data/cards/course_cs285_levine.md) | 课程哲学 + 模仿学习的 *covariate shift*。 | 3 h |
| 4 | [DAgger 论文](../docs/data/cards/paper_ross2011_dagger.md) | Lec 2 的核心论文；理论与算法都要掌握。 | 1 h |
| 5 | [DQN](../docs/data/cards/paper_mnih2015_dqn.md) + [PPO](../docs/data/cards/paper_schulman2017_ppo.md) | Deep RL 的两大默认算法。 | 2 h |
| 6 | [RLHF / DPO](../docs/data/cards/paper_rlhf_dpo.md) | LLM 后训练范式的钥匙；CF-VLA 的训练阶段以此为基。 | 1.5 h |
| 7 | **配套实验** | [`lab01`](../labs/lab01_zhao_value_iteration_gridworld.ipynb) 值迭代 → [`lab02`](../labs/lab02_cs285_bc_vs_dagger_minicar.ipynb) BC vs DAgger → [`lab07`](../labs/lab07_dilu_llm_decision_loop.ipynb) DiLu LLM 决策循环 | 2.5 h |
| 8 | [DiLu](../docs/data/cards/paper_2309.16292_dilu.md) + [Agent-Driver](../docs/data/cards/paper_2311.10813_agent_driver.md) | 把 RL 的"经验改进"换成 LLM 的"自然语言记忆 + 反思"。 | 2 h |
| 9 | （选读）[Sutton & Barto 教材](../docs/data/cards/paper_sutton_barto.md) | 同主题英文圣经；可作 Zhao 课程的延伸/参考。 | 按需 |

## 完成时的检查问题

1. 写出 Bellman 期望与最优方程，并解释 $\gamma$-contraction 性质。
2. 解释 BC 为何在长尾场景上崩，DAgger 如何修。
3. 给出 PPO 的 CLIP 替代目标，说明 $\epsilon$ 取值影响。
4. 用一句话评价：DiLu 究竟"违背"还是"延伸"了 Bitter Lesson？
5. 跑通 [lab07](../labs/lab07_dilu_llm_decision_loop.ipynb)，并修改 prompt 让 reflection 多说一条 *"对侧车视角"* 的反思。

## 三篇延伸阅读（来自 Tier-A，便于继续上手）

- [World Models (Ha & Schmidhuber)](../docs/data/cards/paper_world_models.md)：让 RL 去"梦里"训练。
- [GAIA-1](../docs/data/cards/paper_gaia1.md)：world-model 在驾驶上的现代版。
- [Diffuser / Decision Diffuser](../docs/data/cards/paper_diffuser.md)：扩散模型也可以做 planner。
