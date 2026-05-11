---
id: paper:li2022bevformer
title: "BEVFormer — Spatiotemporal BEV Transformer"
title_zh: "BEVFormer：时空 BEV transformer"
kind: paper
tier: S
authors: [Li, Z., Wang, W., Li, H., Xie, E., Sima, C., Lu, T., Qiao, Y., Dai, J.]
venue: "ECCV 2022"
year: 2022
topic: e2e_ad
phase: prereq
prereqs: [paper:vit, paper:carion2020]
extends: [paper:carion2020]
contrasts: []
parallel: []
contested_by: []
labs: []
deep_links:
  - {label: "PDF", url: "https://arxiv.org/pdf/2203.17270"}
  - {label: "PDF p.4 §3 BEV query + 时空 attention", url: "https://arxiv.org/pdf/2203.17270#page=4"}
  - {label: "fundamentalvision/BEVFormer 代码", url: "https://github.com/fundamentalvision/BEVFormer"}
bibtex: |
  @inproceedings{li2022bevformer,
    title     = {BEVFormer: Learning Bird's-Eye-View Representation from Multi-Camera Images via Spatiotemporal Transformers},
    author    = {Li, Zhiqi and Wang, Wenhai and Li, Hongyang and Xie, Enze and Sima, Chonghao and Lu, Tong and Qiao, Yu and Dai, Jifeng},
    booktitle = {ECCV},
    year      = {2022}
  }
---

## TL;DR
BEVFormer 用一组**可学习的 BEV grid query**，通过 *spatial cross-attention* 从多路相机投影出 BEV 特征，*temporal self-attention* 引入历史帧的时间信息。它是 [UniAD](paper_2212.10156_uniad.md) 的**视觉 backbone 的事实标准**。

## 位置 / Why it matters
- BEV 是自动驾驶感知的"通用语"：检测、跟踪、地图、占用、规划全在 BEV 上做；
- BEVFormer 把这个 BEV 表示**用 transformer query 显式生成出来**，可微、可拼接；
- [UniAD](paper_2212.10156_uniad.md) 的 5 路共享 query 全部 cross-attend 到 BEVFormer 的 BEV 特征图。

## 数学锚点 / Math anchor
- **Spatial cross-attention**：每个 BEV query $q_{(x,y)}$ 取若干 reference points → 投影到各相机 → 在图像 feature 上做 deformable attention。
- **Temporal self-attention**：当前 BEV query 与上一帧 BEV 特征 cross-attend。

## 架构 / Architectural intuition
- BEV grid 通常 200×200，每格 1 个 query；
- 投影几何由相机内外参提供（这是 hand-crafted prior 的少量入口）；
- 时序部分使 BEV 表示具备短期记忆。

## Bitter-Lesson 视角 / lens
*BEVFormer 注入了几何先验（相机投影），但保留了"如何聚合特征 / 如何对齐时序"全部交给 attention 学。它是工程上"该用人类先验的地方用、其他全交给学习器"的合理折中——这种折中在自动驾驶部署里比纯 Bitter-Lesson 风格更现实。*

## 后续节点 / Suggested next nodes
- → [UniAD](paper_2212.10156_uniad.md) · [DETR](paper_carion2020.md)
- → [`concept:bev`](../../concepts.md)
