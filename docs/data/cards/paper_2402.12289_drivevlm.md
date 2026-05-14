---
id: paper:2402.12289
title: "DriveVLM — Convergence of Autonomous Driving and Large Vision-Language Models"
title_zh: "DriveVLM：自动驾驶与大型视觉-语言模型的收敛"
kind: paper
tier: spine
authors: [Tian, X., Gu, J., Li, B., Liu, Y., Wang, Y., Zhao, Z., Zhan, K., Jia, P., Lang, X., Zhao, H.]
venue: "CoRL 2024 / arXiv 2024"
year: 2024
topic: vlm_vla
phase: frontier
prereqs: [paper:llava, paper:carion2020, paper:vaswani2017, paper:2212.10156, concept:vlm, concept:cot]
extends: [paper:2311.10813]
contrasts: [paper:2212.10156]
parallel: [paper:gaia1]
contested_by: [essay:bitter_lesson]
labs: [lab09]
deep_links:
  - {label: "PDF p.1（摘要 + 部署一段）", url: "https://arxiv.org/pdf/2402.12289#page=1"}
  - {label: "PDF p.3 Fig.2（DriveVLM-Dual 双系统）", url: "https://arxiv.org/pdf/2402.12289#page=3"}
  - {label: "PDF p.4 §3（场景描述/分析/分层规划三步）", url: "https://arxiv.org/pdf/2402.12289#page=4"}
  - {label: "PDF p.7 §4.3（SUP-AD 长尾数据集）", url: "https://arxiv.org/pdf/2402.12289#page=7"}
  - {label: "项目主页（含视频 demo）", url: "https://tsinghua-mars-lab.github.io/DriveVLM/"}
bibtex: |
  @inproceedings{tian2024drivevlm,
    title     = {DriveVLM: The Convergence of Autonomous Driving and Large Vision-Language Models},
    author    = {Tian, Xiaoyu and Gu, Junru and Li, Bailin and Liu, Yicheng and Wang, Yang and Zhao, Zhiyong and Zhan, Kun and Jia, Peng and Lang, Xianpeng and Zhao, Hang},
    booktitle = {Conference on Robot Learning (CoRL)},
    year      = {2024}
  }
---

## TL;DR
DriveVLM 把一个**通用视觉-语言模型（VLM）** 接到自动驾驶上，让 VLM 用自然语言完成 *场景描述 → 场景分析 → 分层规划* 三步推理；并提出 **DriveVLM-Dual**：用慢的 VLM 处理"长尾"，用快的传统流水线（UniAD-like）处理"日常"，**已部署到理想 / Li Auto 的量产车**。

## 位置 / Why it matters
DriveVLM 是 *VLM-as-driver* 路线**第一次量产落地**的标志性工作。它和 [DiLu](paper_2309.16292_dilu.md)、[Agent-Driver](paper_2311.10813_agent_driver.md) 的最大不同：

- DiLu / Agent-Driver：LLM **从 JSON 读场景**；
- DriveVLM：VLM **直接看图**，不依赖完美的对象检测。

它和 [CF-VLA](paper_2512.24426_cfvla.md) 的关系：CF-VLA 把 DriveVLM 那种"VLM 输出 plan"再叠一层"自我反事实校验"。

DriveVLM-Dual 的"慢系统 + 快系统"框架，源自 Kahneman *Thinking, Fast and Slow*，是工程界第一次在自动驾驶上严肃实现这一经典心理学双系统假说。

## 数学锚点 / Math anchor
DriveVLM 没有引入新的数学新意，但其**信息流**值得形式化：

$$
\underbrace{\text{Scene Caption}}_{c}\;=\;f_{\text{VLM}}(I_{1:K})
$$
$$
\underbrace{\text{Critical Objects + Behavior}}_{a}\;=\;g_{\text{VLM}}(I_{1:K},c)
$$
$$
\underbrace{\text{Hierarchical Plan}}_{(\text{Meta-action},\,\text{Decision},\,\text{Trajectory})}\;=\;h_{\text{VLM}}(I_{1:K},c,a)
$$

DriveVLM-Dual 的双系统：
$$
\hat{\tau} \;=\; \begin{cases}
\pi_{\text{fast}}(I) & \text{if scene is "easy"}\\
\Phi\big(\pi_{\text{fast}}(I),\, h_{\text{VLM}}(I)\big) & \text{otherwise}
\end{cases}
$$
其中 $\Phi$ 是把 VLM 的语言级 plan 与 fast planner 的轨迹**做后融合**的算子。

直觉：VLM 不直接输出方向盘和油门——它输出**符号级**决策，由经典 planner 翻译成轨迹。这才让"几十亿参数模型在车上跑"变得可行。

## 架构 / Architectural intuition
- **VLM 主体**：作者用 Qwen-VL-7B 微调（在论文初版），后续工程版本可换 LLaVA / InternVL 等。
- **Chain-of-Thought 三步**：
  1. *Scene description*：天气、路况、道路类型；
  2. *Scene analysis*：抽出 critical objects + 它们的行为意图；
  3. *Hierarchical planning*：先给 *meta-action*（如"减速、靠右"），再给 *decision*（"以 30 km/h 跟随前车"），最后给 *trajectory*。
- **慢系统（VLM）跑在 ~10 Hz** 的策略级，**快系统（UniAD-like）跑在 ~50 Hz** 的轨迹级——这是 DriveVLM-Dual 解决"VLM 太慢"工程难题的关键。

> 物理直觉：把开车类比成"飞行员**+** 副驾"：副驾（fast）盯日常，飞行员（slow）只在判断异常时介入。

## 工程 / Engineering notes
- 数据：作者构造了 **SUP-AD** 长尾驾驶数据集（约 10 万段挑战性视频），不公开。论文公开部分在 nuScenes 上做。
- 部署：搭载于理想（Li Auto）量产车。这是 *VLM-on-vehicle* 的第一个公开案例。
- Hardware：车端 VLM 用 INT8/INT4 量化 + 蒸馏，跑在 Orin / Thor 平台。
- License：论文与项目页可访问；权重未公开（量产模型）。
- 复刻：社区有用 Qwen-VL / LLaVA 在 nuScenes-mini 上的复刻；本图谱配套的 [lab09](../../../labs/lab09_drivevlm_dual_pipeline.ipynb) 走通最小三步 pipeline。

## 深度阅读路径 / Deep-anchored reading order
1. **PDF p.1 摘要最后一句**——"deployed on a production vehicle"，记住这是 DriveVLM 区别于纯学术 VLM-AD 的杀手锏。
2. **PDF p.3 Fig.2**——双系统结构。理解箭头方向：VLM 的输出**只是 fast planner 的修正信号**，不直接控车。
3. **PDF p.4 §3.1–3.3**——三步 CoT 的具体 prompt 模板；适合作为自己搭原型时的参考脚手架。
4. **PDF p.7 §4.3 SUP-AD**——长尾场景定义；理解 VLM 路线为何在长尾上才有显著增益。
5. **PDF p.9 表 2 + 表 4**——*nuScenes 与 SUP-AD 上的对比*；SUP-AD 上 +30% 是这条路线立足的核心证据。

## Bitter-Lesson 视角 / lens
*DriveVLM 是 Bitter Lesson 的**正面例证之一**：当 VLM 这种通用学习系统的能力曲线足够陡时，它能直接把"长尾驾驶 = 通用视觉-语言理解"这一假设兑现，无需为每种长尾人工写规则。但 DriveVLM-**Dual** 仍然保留了一个 hand-crafted fast planner——这是工程上对 Sutton 思想的**务实让步**，承认"在车端算力 / 时延约束下，不能让通用模型独自承担一切"。*

## 后续节点 / Suggested next nodes
- → [Agent-Driver (2311.10813)](paper_2311.10813_agent_driver.md) ：对象级 + tool library 路线
- → [DiLu (2309.16292)](paper_2309.16292_dilu.md) ：知识 + 反思 + 记忆
- → [CF-VLA (2512.24426)](paper_2512.24426_cfvla.md) ：在 DriveVLM 之上加"反事实自检"
- → [LLaVA / Qwen-VL](paper_llava.md) ：VLM backbone 候选
- → [`concept:vlm`](../../concepts.md) · [`concept:cot`](../../concepts.md)

## 配套实验 / Lab
[`labs/lab09_drivevlm_dual_pipeline.ipynb`](../../../labs/lab09_drivevlm_dual_pipeline.ipynb) — 用一个开源 VLM（默认 Mock，可切 Qwen-VL）做三步 CoT 输出 meta-action，并用一个 IDM 的 fast planner 做轨迹翻译；演示 Dual 路由如何在"易/难"场景上切换。
