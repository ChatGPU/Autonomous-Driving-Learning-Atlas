---
id: paper:2212.10156
title: "UniAD — Planning-oriented Autonomous Driving"
title_zh: "UniAD：以规划为导向的统一端到端自动驾驶"
kind: paper
tier: spine
authors: [Hu, Y., Yang, J., Chen, L., Li, K., Sima, C., Zhu, X., Chai, S., Du, S., Lin, T., Wang, W., Lu, L., Jia, X., Liu, Q., Dai, J., Qiao, Y., Li, H.]
venue: "CVPR 2023 (Best Paper Award)"
year: 2022
topic: e2e_ad
phase: core
prereqs: [paper:vaswani2017, paper:carion2020, paper:li2022bevformer, concept:bev, concept:transformer]
extends: []
contrasts: [paper:2210.14222]
parallel: [paper:vadv2]
contested_by: [essay:bitter_lesson]
labs: [lab03]
deep_links:
  - {label: "PDF p.1（首页 / 摘要）", url: "https://arxiv.org/pdf/2212.10156#page=1"}
  - {label: "PDF p.3 Fig.2（整体架构）", url: "https://arxiv.org/pdf/2212.10156#page=3"}
  - {label: "PDF p.4 §3.2（5 个查询模块）", url: "https://arxiv.org/pdf/2212.10156#page=4"}
  - {label: "PDF p.6 §4（Planner & 规划损失）", url: "https://arxiv.org/pdf/2212.10156#page=6"}
  - {label: "OpenDriveLab/UniAD（官方代码 + 2.0 重构版）", url: "https://github.com/OpenDriveLab/UniAD"}
  - {label: "OpenDriveLab 主页（含权重 / 项目页）", url: "https://opendrivelab.com/"}
bibtex: |
  @inproceedings{hu2023planning,
    title     = {Planning-oriented Autonomous Driving},
    author    = {Hu, Yihan and Yang, Jiazhi and Chen, Li and Li, Keyu and Sima, Chonghao and Zhu, Xizhou and Chai, Siqi and Du, Senyao and Lin, Tianwei and Wang, Wenhai and Lu, Lewei and Jia, Xiaosong and Liu, Qiang and Dai, Jifeng and Qiao, Yu and Li, Hongyang},
    booktitle = {Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR)},
    year      = {2023},
    pages     = {17853--17862}
  }
---

## TL;DR
UniAD 把检测、跟踪、在线建图、运动预测、占用预测、规划**全装进同一张网络**，所有任务共用一组**可微的 BEV 查询（query）**，并把"规划是否变好"作为整网的优化方向。它不是"再多任务一点的多任务学习"，而是把所有上游任务**显式服务于下游规划**。CVPR 2023 Best Paper。

## 位置 / Why it matters
在 *modular ↔ end-to-end × data-driven ↔ knowledge-driven* 的二维地图上，UniAD 几乎是**端到端 × 数据驱动**象限的标志性坐标。和 [PlanT (2210.14222)](paper_2210.14222_plant.md) 形成天然对比：

- UniAD：**dense BEV + 全栈共享 query**，让所有模块一起调；
- PlanT：**只用对象级 token**，赌"人类司机本来就只看少数几个对象"，结构远更稀疏。

这两条路线之争是后续 [VADv2](paper_vadv2.md)、[DriveVLM](paper_2402.12289_drivevlm.md)、[CF-VLA](paper_2512.24426_cfvla.md) 都绕不开的命题。UniAD 之后，"规划导向（planning-oriented）"这个口号才真正在学界站住。

## 数学锚点 / Math anchor
端到端的核心想法可以浓缩为：把传统流水线
$$\hat{a} = \pi(\,p(\,d(\,m(\,p_{ercept}(I)\,)))\,)$$
（perception → mapping → prediction → planning）改成一套共享 latent 上的可微优化：
$$\hat{a} = \pi(Q),\quad Q = \mathrm{Aggregator}\big(Q_{\text{det}}, Q_{\text{track}}, Q_{\text{map}}, Q_{\text{motion}}, Q_{\text{occ}}\big)$$
所有 $Q_{*}$ 都是 DETR-style **object queries / BEV queries**，统一从相机+时序 BEV 特征 cross-attend 出来。最终损失：
$$\mathcal{L} = \sum_{k\in\{\text{det,track,map,motion,occ}\}}\!\!\!\!\lambda_k \mathcal{L}_k \;+\; \lambda_{\text{plan}}\,\mathcal{L}_{\text{plan}}$$
直觉：上游任务并不是"为了完成自己"而存在的，它们的梯度被允许、并被鼓励**为了让 $\mathcal{L}_{\text{plan}}$ 下降**而调整。

## 架构 / Architectural intuition
- **BEVFormer encoder**（参见 [BEVFormer 卡片](paper_li2022bevformer.md)）把 6 路相机投射到一张 *bird-eye-view* 特征图——这一步把"图像几何"翻译成"地图几何"。
- 在这个 BEV 特征上，5 个 transformer 头**各自维护一组 query**，每组 query 即"我关心的实体"——agent、车道、占用栅格、未来轨迹候选……
- Query 之间通过 cross-attention 互相"对话"：跟踪 query 把 ID 信息送给运动 query，运动 query 把"未来 5 秒在哪里"送给占用 query 和规划 query。
- 最终 planner head 做的是一件事：**在所有候选轨迹上挑一条与高占用、高碰撞风险尽量错开的轨迹**。

> 物理直觉：UniAD 把"司机在脑中维护的多个抽象层（哪些是物体？它们要去哪儿？我能去哪儿？）"建模成了一组**可彼此引用的可微 token**。

## 工程 / Engineering notes
- Repo: [`OpenDriveLab/UniAD`](https://github.com/OpenDriveLab/UniAD)，2025-10 发布的 **UniAD 2.0** 已迁移到 `mmdet3d 1.x` + PyTorch 2.x。
- Dataset: **nuScenes**（约 1000 段 20 秒 driving log）。所有数字都基于这一个 benchmark；跨数据集泛化是后续工作（VADv2、DriveDreamer 等）的主战场。
- Hardware: 全模型训练需要 8×A100；推理 ~1.8 FPS（论文报告），是它最被诟病的工程短板之一——也是 PlanT/DriveVLM-Dual 路线的反击点。
- Gotchas: `motion_anchor` 的预聚类需要先用训练集生成；切换到自有数据时要重跑这一步。规划阶段的 *ego-status leakage* 在后续工作中被详细讨论（ego 速度作为输入会让指标虚高）。
- License: Apache-2.0。

## 深度阅读路径 / Deep-anchored reading order
1. **PDF p.1 摘要 + p.2 §1 第二段**——为什么"全栈一网"比"多任务一头"更值钱（误差累积 vs 任务协调）。
2. **PDF p.3 Fig.2**——整体架构。把 5 个 query 的颜色记住，后面所有公式都基于这个图。
3. **PDF p.4 §3.2**——5 个模块各自的查询设计；只精读 *TrackFormer* 与 *MotionFormer*，其他可略读。
4. **PDF p.6 §4 Planner**——规划头与碰撞惩罚的具体写法。
5. **PDF p.7 §5.1 表 2 / 3 / 4**——逐模块消融，理解"为什么共用 query 真的重要"。

## Bitter-Lesson 视角 / lens
*UniAD 注入了不少人工先验：BEV 显式投影、5 个分头的任务划分、规划损失的 hand-crafted 权重 $\lambda_*$。Sutton 会说："你们仍然在用人对'感知 / 预测 / 规划'的分工去切结构，最终会被一个完全数据驱动的端到端模型取代"。目前的实证证据**部分支持** Sutton：[VADv2](paper_vadv2.md)、[DriveVLM-Dual](paper_2402.12289_drivevlm.md)、[CF-VLA](paper_2512.24426_cfvla.md) 已开始用更少的人工先验取得相当或更好的结果，但 **UniAD 提供的"BEV + query"接口至今仍是这条线索的事实标准**——人工先验在过渡期带来了巨大可解释性收益。*

## 后续节点 / Suggested next nodes
- → [PlanT (2210.14222)](paper_2210.14222_plant.md) ：另一种极端，对象级稀疏表示
- → [DriveVLM (2402.12289)](paper_2402.12289_drivevlm.md) ：把 VLM 接到 UniAD-like 流水线之上
- → [BEVFormer](paper_li2022bevformer.md) ：UniAD 的视觉 backbone
- → [DETR](paper_carion2020.md) ：query 思想的源头
- → [`concept:bev`](../../concepts.md#bev感知) · [`concept:detr_query`](../../concepts.md#detr-query)

## 配套实验 / Lab
[`labs/lab03_uniad_query_intuition.ipynb`](../../../labs/lab03_uniad_query_intuition.ipynb) — 在二维合成场景上，用 6 个共享 query 同时做检测 + 轨迹规划，并通过消融"是否共用 query"量化端到端协同收益。
