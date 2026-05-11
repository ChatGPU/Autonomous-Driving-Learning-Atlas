---
id: paper:2309.16292
title: "DiLu — A Knowledge-Driven Approach to Autonomous Driving with Large Language Models"
title_zh: "DiLu：以 LLM 实现知识驱动的自动驾驶"
kind: paper
tier: spine
authors: [Wen, L., Fu, D., Li, X., Cai, X., Ma, T., Cai, P., Dou, M., Shi, B., He, L., Qiao, Y.]
venue: "ICLR 2024"
year: 2023
topic: vlm_vla
phase: frontier
prereqs: [paper:gpt3, concept:cot, concept:imitation_learning, concept:rlhf]
extends: []
contrasts: [paper:2212.10156]
parallel: [paper:2311.10813]
contested_by: [essay:bitter_lesson]
labs: [lab07]
deep_links:
  - {label: "PDF p.1（摘要）", url: "https://arxiv.org/pdf/2309.16292#page=1"}
  - {label: "PDF p.3 Fig.2（DiLu 框架：Reasoning + Reflection + Memory）", url: "https://arxiv.org/pdf/2309.16292#page=3"}
  - {label: "PDF p.4 §3.2（Reasoning module）", url: "https://arxiv.org/pdf/2309.16292#page=4"}
  - {label: "PDF p.5 §3.3（Reflection module）", url: "https://arxiv.org/pdf/2309.16292#page=5"}
  - {label: "项目主页", url: "https://pjlab-adg.github.io/DiLu/"}
bibtex: |
  @inproceedings{wen2024dilu,
    title     = {DiLu: A Knowledge-Driven Approach to Autonomous Driving with Large Language Models},
    author    = {Wen, Licheng and Fu, Daocheng and Li, Xin and Cai, Xinyu and Ma, Tao and Cai, Pinlong and Dou, Min and Shi, Botian and He, Liang and Qiao, Yu},
    booktitle = {International Conference on Learning Representations (ICLR)},
    year      = {2024}
  }
---

## TL;DR
DiLu 是**第一个**明确提出"**知识驱动**自动驾驶"作为完整范式的工作：在 HighwayEnv 仿真里用 LLM 做决策，配合 *Reasoning + Reflection + Memory* 三件套**从经验中持续进化**；论证它的**泛化能力显著优于 RL（DQN/PPO）**，并能直接从真实数据中累积经验。

## 位置 / Why it matters
DiLu 与 [Agent-Driver](paper_2311.10813_agent_driver.md) 是同期的孪生工作，但**侧重点不同**：

| | DiLu | Agent-Driver |
|---|---|---|
| 关注点 | 范式宣言（vs RL） | 工程系统（tool library 接 LLM 到 nuScenes） |
| 仿真 | HighwayEnv | nuScenes |
| 反思机制 | Reflection module + memory bank | Self-reflection in prompt |
| 模型 | GPT-3.5/4 + memory | GPT-3.5/4 + tools |

DiLu 提出的"**知识驱动 vs 数据驱动**"这条二分法被后续社区广泛沿用——本图谱的 *2×2 地图*（modular ↔ E2E × data ↔ knowledge）就是直接受 DiLu 思路启发。

## 数学锚点 / Math anchor
DiLu 没有新损失函数，但其学习目标可以形式化为**"经验记忆中的策略改进"**：

$$
\pi_{t+1}(s) = \mathrm{LLM}\Big(s\;\Big\|\;\mathrm{TopK}_{\text{sim}(s,\,m_i)} \,\mathcal{M}\Big)
$$

其中 $\mathcal{M}=\{m_i\}$ 是经验记忆（每个 $m_i$ 由 *state, decision, reflection* 三元组构成）。每次决策完后，*Reflection module* 把成功 / 失败回写到 $\mathcal{M}$：

$$
\mathcal{M} \leftarrow \mathcal{M} \cup \{(s_t,\,a_t,\,r_t,\,\text{reflection}_t)\}
$$

直觉：策略改进不是靠梯度下降，而是靠**经验检索 + LLM in-context 改写**——这相当于把 *Q-learning + experience replay* 整体外包给"自然语言 + 向量数据库"。

## 架构 / Architectural intuition
- **Reasoning module**：标准 CoT prompt：观测 → 候选动作 → 评估 → 选定动作。
- **Reflection module**：当一次决策导致碰撞 / 违规时，把"错在哪、应该怎么改"也写成自然语言。
- **Memory module**：sentence-embedding 索引；策略时检索 Top-K 相似过往经验作为 in-context examples。

> 物理直觉：让 LLM 像新手司机一样**记日记**——开错了，写下教训；下次开到类似场景，先翻日记。这是把"经验回放"做成可读、可改、可迁移的形态。

## 工程 / Engineering notes
- Repo: [`PJLab-ADG/DiLu`](https://github.com/PJLab-ADG/DiLu)。
- 仿真: **HighwayEnv** —— Python，CPU 即可，是 LLM-driver 实验的事实标准入门环境。
- 经验存储：FAISS / Chroma 等向量库；论文里用 OpenAI embedding。
- LLM：GPT-3.5 / GPT-4；本图谱配套的 [lab07](../../../labs/lab07_dilu_llm_decision_loop.ipynb) 给出 OpenAI / Ollama / Mock 三种后端。
- Gotchas：HighwayEnv 的车道结构很简化，DiLu 的"知识胜过 RL"结论**未必直接外推到 nuScenes/CARLA**——这条 Sutton 是会反击的（见下）。
- License：Apache-2.0。

## 深度阅读路径 / Deep-anchored reading order
1. **PDF p.1 摘要 + p.2 §1**——把 *knowledge-driven vs data-driven* 这段背景背下来；它定义了后续社区话术。
2. **PDF p.3 Fig.2**——三件套总图。
3. **PDF p.4 §3.2 Reasoning prompt**——可以直接抄做工程模板。
4. **PDF p.5 §3.3 Reflection**——理解"反思如何改写 memory"，对比 Sutton 在 *Continual Learning* 里讨论的 "in-context vs gradient-based"。
5. **PDF p.6 §4.2 表 1**——和 RL baseline 在 success rate 上的对比。
6. **PDF p.8 §4.4 真实驾驶数据**——这是论文最有"工业可信度"的证据。

## Bitter-Lesson 视角 / lens
*Sutton 会**反击 DiLu** 的核心论据是："你说的'知识胜过 RL'，是在 HighwayEnv 这种**任务复杂度封顶**的小场景里。Bitter Lesson 的真正命题是 *scale 起来时* 数据驱动 + 通用学习器最终赢。"DiLu **反过来主张**：当**测试分布完全不同于训练分布**（OOD 长尾）时，已经预训练在 *人类全部书写知识* 上的 LLM 比 *只在驾驶日志上训练* 的 RL 更稳健——这并不违背 Bitter Lesson，因为 LLM 本身就是"在尽可能多的数据上 scale 出来的通用学习器"，DiLu 只是把它**搬到**了驾驶领域。这个观点已成为 [CF-VLA](paper_2512.24426_cfvla.md) 类工作的默认前提。*

## 后续节点 / Suggested next nodes
- → [Agent-Driver (2311.10813)](paper_2311.10813_agent_driver.md) ：parallel
- → [DriveVLM (2402.12289)](paper_2402.12289_drivevlm.md) ：把图像放进去
- → [CF-VLA (2512.24426)](paper_2512.24426_cfvla.md) ：把 reflection 升级为 counterfactual
- → [`concept:rlhf`](../../concepts.md) · [`concept:cot`](../../concepts.md) · [`concept:tool_use`](../../concepts.md)

## 配套实验 / Lab
[`labs/lab07_dilu_llm_decision_loop.ipynb`](../../../labs/lab07_dilu_llm_decision_loop.ipynb) — 在 HighwayEnv 里跑 DiLu loop（默认 Mock LLM 后端）：观测 → 推理 → 决策 → 反思 → 写入 memory；可一键切到真实 LLM。
