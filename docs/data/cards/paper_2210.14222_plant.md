---
id: paper:2210.14222
title: "PlanT — Explainable Planning Transformers via Object-Level Representations"
title_zh: "PlanT：基于对象级表示的可解释规划 Transformer"
kind: paper
tier: spine
authors: [Renz, K., Chitta, K., Mercea, O.-B., Koepke, A.S., Akata, Z., Geiger, A.]
venue: "CoRL 2022"
year: 2022
topic: e2e_ad
phase: core
prereqs: [paper:vaswani2017, concept:imitation_learning, concept:transformer]
extends: []
contrasts: [paper:2212.10156]
parallel: [paper:transfuser]
contested_by: [essay:bitter_lesson]
labs: [lab04]
deep_links:
  - {label: "PDF p.1（摘要）", url: "https://arxiv.org/pdf/2210.14222#page=1"}
  - {label: "PDF p.3 Fig.2（对象级 token 化）", url: "https://arxiv.org/pdf/2210.14222#page=3"}
  - {label: "PDF p.4 §3（架构与 attention 监督）", url: "https://arxiv.org/pdf/2210.14222#page=4"}
  - {label: "PDF p.6 §4.2（CARLA Longest6 结果）", url: "https://arxiv.org/pdf/2210.14222#page=6"}
  - {label: "autonomousvision/plant 代码", url: "https://github.com/autonomousvision/plant"}
bibtex: |
  @inproceedings{renz2022plant,
    title     = {PlanT: Explainable Planning Transformers via Object-Level Representations},
    author    = {Renz, Katrin and Chitta, Kashyap and Mercea, Otniel-Bogdan and Koepke, A. Sophia and Akata, Zeynep and Geiger, Andreas},
    booktitle = {Conference on Robot Learning (CoRL)},
    year      = {2022}
  }
---

## TL;DR
PlanT 反对 UniAD 那种"密集 BEV 特征"的路线，主张**人类司机其实只关注少数几个相关对象**，于是把场景压成一串**对象级 token**（每个 token = 一辆车 / 一段车道的几个属性），喂给一个**最朴素的 transformer**做模仿学习；结果在 CARLA Longest6 上**追平专家、推理快 5.3×**，并能定量回答"模型现在在看哪辆车"。

## 位置 / Why it matters
PlanT 是 *modular ↔ E2E × data ↔ knowledge* 地图中**端到端 × 知识驱动**象限的代表：它不靠 raw pixels，而靠"人类规则提取出的对象列表"。这一刀**把规划问题从一个高维视觉问题降成一个 set-to-set 的语言问题**——这恰好是 transformer 的甜区。

它构成对 [UniAD](paper_2212.10156_uniad.md) 的**强对照**：
- UniAD：dense BEV，5 路共享 query；
- PlanT：sparse 对象 token，1 路 transformer。

后续 [Agent-Driver](paper_2311.10813_agent_driver.md) 的 "tool library + 对象 JSON" 思路、[DriveVLM](paper_2402.12289_drivevlm.md) 的 "VLM 读对象列表"思路，都和 PlanT 这一根"对象级先验"延伸到一起。

## 数学锚点 / Math anchor
设场景由 $N$ 个对象组成，每个对象有属性 $o_i = (x_i,y_i,\psi_i,v_i,\text{type}_i,\dots)$。PlanT 把它们 tokenise：
$$
T_i = \mathrm{MLP}(\text{embed}(o_i)),\quad i=1,\dots,N
$$
然后用一个 vanilla transformer 编码：
$$
H = \mathrm{Transformer}([T_1,\dots,T_N,\, T_{\text{ego}}])
$$
最终输出未来 $T$ 步的 waypoint：
$$
\hat{w}_{1:T} = \mathrm{MLP}(H_{\text{ego}})
$$
训练只是 imitation：$\mathcal{L} = \|\hat{w}_{1:T} - w_{1:T}^{\text{expert}}\|^2$。

直觉：所有"必须看哪辆车"的复杂归纳偏置，被**完全交给 self-attention 的 weight matrix 自动学**——这是 transformer 的拿手好戏，也是论文标题"Explainable"的来源（attention 权重直接可视化）。

## 架构 / Architectural intuition
- 输入端的"对象抽取"是**完全 hand-crafted** 的：CARLA 的 ground-truth 物体列表（在 sensor 版本里换成 perception 模块的输出）。
- 模型本体只是一个 6 层 transformer encoder——比一个 BERT-base 还小。
- 输出端是 **GRU + waypoint head**，预测未来 4 秒。
- *可解释性*的关键：作者构造了一个评测"模型注意力权重的最大值是否压在 *真正影响驾驶决策的对象* 上"，定量给出 attention precision；这套评测被后续 transformer-planner 工作大量复用。

> 物理直觉：把"开车决策"建模为"在一句对象短语里找出那个真正决定下一步的词"。

## 工程 / Engineering notes
- Repo: [`autonomousvision/plant`](https://github.com/autonomousvision/plant)。
- 仿真环境: **CARLA**（Longest6 benchmark）；非 nuScenes 路线。
- 训练时长: 单卡 V100 ≈ 半天即可完整训练。
- Gotchas: 在 sensor-only 模式下 perception 误差对结果影响巨大；论文给出了与 [TransFuser](paper_transfuser.md) 拼接的 hybrid 系统作为"现实可用版本"。
- License: MIT.

## 深度阅读路径 / Deep-anchored reading order
1. **PDF p.1–2 §1**——把 motivation 那段（"why object-level"）抄下来；这是和 UniAD 路线最直接的论据冲突点。
2. **PDF p.3 Fig.2 + §3.1**——tokenisation 的具体特征字段，是后续 Agent-Driver / DriveVLM "scene-as-text" 的祖型。
3. **PDF p.4 §3.2**——只看"attention supervision"那段。
4. **PDF p.6 表 2 + Fig.5**——驾驶分数 vs 推理速度的散点图，最有说服力的一张图。
5. **PDF p.8 §5**——可解释性评测协议。

## Bitter-Lesson 视角 / lens
*PlanT **大量注入人工先验**：把图像降维到"几个对象的几个属性"。Sutton 会说："你在用人对'什么是相关'的判断硬塞进数据。当感知模型足够好时，人类那一刀不再值得"。**反方观点**：在 CARLA 这种结构高度冗余的场景里，对象级先验把样本复杂度从 $\mathcal{O}(\text{pixels})$ 降到 $\mathcal{O}(\text{objects})$，让小模型也能 SOTA——这恰是工业部署最看重的属性。两条路线在 [CF-VLA](paper_2512.24426_cfvla.md) 这种 reasoning-augmented VLA 里部分汇合。*

## 后续节点 / Suggested next nodes
- → [UniAD (2212.10156)](paper_2212.10156_uniad.md) ：另一极端
- → [TransFuser](paper_transfuser.md) ：同一作者组，sensor-fusion 版本
- → [Agent-Driver (2311.10813)](paper_2311.10813_agent_driver.md) ：把对象列表换成 LLM 的 prompt
- → [`concept:imitation_learning`](../../concepts.md)

## 配套实验 / Lab
[`labs/lab04_plant_object_level_planner.ipynb`](../../../labs/lab04_plant_object_level_planner.ipynb) — 在合成场景上，用一个最小 transformer encoder + waypoint head 做对象级规划，并把 attention 权重画出来。
