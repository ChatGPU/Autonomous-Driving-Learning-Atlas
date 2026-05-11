---
id: paper:carion2020
title: "DETR — End-to-End Object Detection with Transformers"
title_zh: "DETR：端到端 transformer 物体检测"
kind: paper
tier: S
authors: [Carion, N., Massa, F., Synnaeve, G., Usunier, N., Kirillov, A., Zagoruyko, S.]
venue: "ECCV 2020"
year: 2020
topic: ssl_vision
phase: prereq
prereqs: [paper:vaswani2017]
extends: [paper:vaswani2017]
contrasts: []
parallel: []
contested_by: []
labs: []
deep_links:
  - {label: "PDF", url: "https://arxiv.org/pdf/2005.12872"}
  - {label: "PDF p.4 §3 架构（object queries）", url: "https://arxiv.org/pdf/2005.12872#page=4"}
  - {label: "PDF p.5 §3.1 二分匹配损失", url: "https://arxiv.org/pdf/2005.12872#page=5"}
  - {label: "facebookresearch/detr", url: "https://github.com/facebookresearch/detr"}
bibtex: |
  @inproceedings{carion2020detr,
    title     = {End-to-End Object Detection with Transformers},
    author    = {Carion, Nicolas and Massa, Francisco and Synnaeve, Gabriel and Usunier, Nicolas and Kirillov, Alexander and Zagoruyko, Sergey},
    booktitle = {ECCV},
    year      = {2020}
  }
---

## TL;DR
DETR 把检测问题表达成 *set prediction*：用一组**可学习的 query** 与图像 feature 做 cross-attention，每个 query 输出一个 (class, box)；用 **匈牙利二分匹配**做唯一指派，**消灭 NMS / anchor**。

## 位置 / Why it matters
本图谱里 [UniAD](paper_2212.10156_uniad.md) 的 5 个 query 模块、[PlanT](paper_2210.14222_plant.md) 的 object token、[BEVFormer](paper_li2022bevformer.md) 的 BEV query —— 全部都是 DETR "object query" 概念的衍生。**没有 DETR 就没有 query-based AD**。

## 数学锚点 / Math anchor
**Set prediction loss**（Hungarian matching $\hat\sigma$）：
$$
\mathcal{L}_{\text{Hungarian}} \;=\; \sum_{i=1}^N\Big[-\log \hat p_{\hat\sigma(i)}(c_i)+\mathbb{1}_{\{c_i\neq\varnothing\}}\mathcal{L}_{\text{box}}(b_i,\hat b_{\hat\sigma(i)})\Big]
$$
Cross-attention：
$$
\mathrm{query}_i \;\leftarrow\;\mathrm{Attn}(\mathrm{query}_i,\,\mathrm{img\_feat})
$$

## 架构 / Architectural intuition
- N 个 query = "我手里 N 个空槽位，每个槽位填一个物体或 ∅"；
- transformer decoder 让 query 互相对话 + 与图像对话；
- 匈牙利匹配是把"输出顺序"也当作可优化的——这是对传统检测最大的范式转变。

## 工程 / Engineering notes
- 训练慢（需要 500 epochs）；后续 *Deformable DETR*、*DINO-DETR* 大幅改进。
- License：Apache-2.0。

## 深度阅读路径 / Deep-anchored reading order
1. PDF p.4 Fig.2 整体；2. p.5 §3.1 损失；3. p.7 §4 与 Faster R-CNN 比较。

## Bitter-Lesson 视角 / lens
*DETR 用通用 set-prediction 损失替代了 hand-crafted NMS / anchor 配置。Bitter Lesson 的另一现代胜利。*

## 后续节点 / Suggested next nodes
- → [UniAD](paper_2212.10156_uniad.md) · [PlanT](paper_2210.14222_plant.md) · [BEVFormer](paper_li2022bevformer.md)
- → [`concept:detr_query`](../../concepts.md)
