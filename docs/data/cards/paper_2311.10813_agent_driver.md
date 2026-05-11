---
id: paper:2311.10813
title: "Agent-Driver — A Language Agent for Autonomous Driving"
title_zh: "Agent-Driver：把 LLM 当成自动驾驶的认知 Agent"
kind: paper
tier: spine
authors: [Mao, J., Ye, J., Qian, Y., Pavone, M., Wang, Y.]
venue: "COLM 2024 / arXiv 2023"
year: 2023
topic: vlm_vla
phase: frontier
prereqs: [paper:gpt3, concept:cot, concept:tool_use, concept:imitation_learning]
extends: [paper:2309.16292]
contrasts: [paper:2212.10156]
parallel: [paper:2402.12289]
contested_by: [essay:bitter_lesson]
labs: [lab08]
deep_links:
  - {label: "PDF p.1（摘要）", url: "https://arxiv.org/pdf/2311.10813#page=1"}
  - {label: "PDF p.3 Fig.2（Agent-Driver 架构总图）", url: "https://arxiv.org/pdf/2311.10813#page=3"}
  - {label: "PDF p.4 §3.2（Tool Library）", url: "https://arxiv.org/pdf/2311.10813#page=4"}
  - {label: "PDF p.5 §3.3（Cognitive Memory）", url: "https://arxiv.org/pdf/2311.10813#page=5"}
  - {label: "PDF p.5 §3.4（Reasoning Engine）", url: "https://arxiv.org/pdf/2311.10813#page=5"}
  - {label: "项目主页 + 代码", url: "https://usc-gvl.github.io/Agent-Driver/"}
bibtex: |
  @inproceedings{mao2024agentdriver,
    title     = {A Language Agent for Autonomous Driving},
    author    = {Mao, Jiageng and Ye, Junjie and Qian, Yuxi and Pavone, Marco and Wang, Yue},
    booktitle = {Conference on Language Modeling (COLM)},
    year      = {2024}
  }
---

## TL;DR
Agent-Driver 把"自动驾驶系统"重新定义为一个 **LLM-driven cognitive agent**：LLM 不直接预测轨迹，而是通过 *function call* 调用一个 **tool library**（检测、跟踪、地图查询等），从一个 *cognitive memory*（常识 + 经验）里查证据，做 chain-of-thought 推理 + self-reflection，最后规划。在 nuScenes 上**显著超越** UniAD 等专业 driver-only 模型。

## 位置 / Why it matters
和 [DiLu](paper_2309.16292_dilu.md) 是孪生工作（同年、同思路、不同实现），但 Agent-Driver 的 *tool library + memory + reflection* 三件套结构更清晰，被后续 [DriveVLM](paper_2402.12289_drivevlm.md)、[CF-VLA](paper_2512.24426_cfvla.md) 大量复用。

它直接挑战 [UniAD](paper_2212.10156_uniad.md) 路线：
- UniAD：所有任务挤进**同一张 NN**；
- Agent-Driver：所有任务化为**LLM 可调的 API 工具**。

后者的优势：**少样本学习能力 + 解释性 + 错误归因清晰**；劣势：**LLM 时延、tool 调用稳定性、安全性证明难**。

## 数学锚点 / Math anchor
Agent-Driver 的范式可写成一个 *agent loop*（每个时刻 $t$）：
$$
\text{obs}_t \;\longrightarrow\; \text{LLM-Reason}\big(\text{prompt} \,\Vert\, \text{Memory}.\text{retrieve}(\text{obs}_t)\big)
$$
$$
\quad \longrightarrow\; \text{ToolCalls}=\{\tau_i(\text{obs}_t)\}\;\longrightarrow\; \text{LLM-Plan}(\dots)\;\longrightarrow\; \hat{a}_t
$$
$$
\quad \longrightarrow\; \text{Self-Reflect}\big(\hat{a}_t,\,\text{outcome}_t\big)\;\longrightarrow\; \text{Memory}.\text{update}
$$

直觉：把 RL 里的"value 函数 + policy"两件事，分别托管给 *Memory*（值的分布式记忆）和 *LLM-Reason*（策略的 in-context 推理），用自然语言把它们串起来。这本质是把 RL 的优化压力**部分转嫁给 LLM 在预训练里学到的世界知识**。

## 架构 / Architectural intuition
Agent-Driver 由四个组件组成：

1. **Tool Library**：一组 Python 函数，每个函数是一个轻量级感知/查询服务（"取车前 30m 内所有车辆"、"查地图限速"……）。LLM 通过 OpenAI-style function-call 调它们。
2. **Cognitive Memory**：两类——*Common-sense*（驾驶规则、物理常识，预填）+ *Experience*（过去成功/失败的轨迹，向量索引）。
3. **Reasoning Engine**：CoT + Task planning + Motion planning + **Self-reflection**。Self-reflection 把"如果 plan 失败，应该改哪一步"显式写进 prompt。
4. **Planner head**：一个轻量 MLP，把 LLM 输出的离散 meta-action 翻成 6 个未来 waypoint。

> 物理直觉：把驾驶系统建成一支**有手册（memory）、有工具（tool library）、有项目经理（LLM）的施工队**。

## 工程 / Engineering notes
- Repo: [`USC-GVL/Agent-Driver`](https://github.com/USC-GVL/Agent-Driver)。
- 数据：nuScenes，标准 split。
- LLM：默认 GPT-3.5 / GPT-4；社区有用 Llama-2 / Qwen 替换的版本。
- 时延：LLM 调用 + 多轮 tool-call 让端到端时延来到 ~1–3 秒；论文承认这是工程缺陷，建议作"长尾兜底"模块用，类似 DriveVLM-Dual 的 slow path。
- License：MIT。

## 深度阅读路径 / Deep-anchored reading order
1. **PDF p.1 摘要**——三件套（tool / memory / reasoning）一定要先记住。
2. **PDF p.3 Fig.2** 整体图。
3. **PDF p.4 §3.2 Tool Library**——把 tool 列表抄下来；这是工业界做 LLM-AD 系统的最佳起点。
4. **PDF p.5 §3.3 Cognitive Memory**——*common-sense + experience* 的分离，是后续 [DiLu](paper_2309.16292_dilu.md) "reflection memory" 的标准化版本。
5. **PDF p.5 §3.4 Reasoning Engine**——CoT prompt 模板；和 [DriveVLM 的三步 CoT](paper_2402.12289_drivevlm.md) 比较。
6. **PDF p.7 表 2**——nuScenes 上 vs UniAD 的 L2 / collision 数字。
7. **PDF p.8 §4.2 few-shot 实验**——这是 LLM-agent 路线最有竞争力的论据。

## Bitter-Lesson 视角 / lens
*Agent-Driver 表面看是"重度注入人工先验"（tool 列表、memory 结构、prompt 模板），但 Sutton 真正反对的是 *"hand-craft what should be learned"*——这里被 hand-craft 的是 *接口*，而被学的是 *策略*（在 LLM 已学到的预训练知识里调度）。这是 Bitter Lesson 在 LLM 时代的微妙折中：**用工具把 LLM 接到驾驶世界里，让 LLM 拿出它已有的世界模型来"代偿"专门的驾驶训练**。证据 Z：在 nuScenes 上 few-shot 仍然能赢 UniAD，说明"通用 + 工具调度"的可迁移性已经超过"专用 + 海量数据"。*

## 后续节点 / Suggested next nodes
- → [DiLu (2309.16292)](paper_2309.16292_dilu.md) ：parallel work, 知识驱动 + reflection
- → [DriveVLM (2402.12289)](paper_2402.12289_drivevlm.md) ：把图像也接进去
- → [CF-VLA (2512.24426)](paper_2512.24426_cfvla.md) ：把 self-reflection 升级为反事实推理
- → [`concept:tool_use`](../../concepts.md) · [`concept:cot`](../../concepts.md)

## 配套实验 / Lab
[`labs/lab08_agent_driver_tool_calling.ipynb`](../../../labs/lab08_agent_driver_tool_calling.ipynb) — 用 mock 感知 JSON + LLM provider，把 tool-library + memory + reasoning 三件套搭一遍；不依赖 LLM API（默认 Mock 后端可全跑通）。
