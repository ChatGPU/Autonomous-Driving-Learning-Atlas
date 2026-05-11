---
id: paper:transfuser
title: "TransFuser — Imitation Learning with Camera+LiDAR Transformer Fusion"
title_zh: "TransFuser：相机 + LiDAR transformer 融合的模仿学习驾驶"
kind: paper
tier: A
authors: [Chitta, K., Prakash, A., Jaeger, B., Yu, Z., Renz, K., Geiger, A.]
venue: "TPAMI 2022 / CVPR 2021"
year: 2022
topic: e2e_ad
phase: core
prereqs: [paper:vaswani2017]
extends: []
contrasts: []
parallel: [paper:2210.14222]
contested_by: []
labs: []
deep_links:
  - {label: "PDF", url: "https://arxiv.org/pdf/2205.15997"}
  - {label: "autonomousvision/transfuser 代码", url: "https://github.com/autonomousvision/transfuser"}
bibtex: |
  @article{chitta2022transfuser,
    title  = {TransFuser: Imitation with Transformer-Based Sensor Fusion for Autonomous Driving},
    author = {Chitta, Kashyap and Prakash, Aditya and Jaeger, Bernhard and Yu, Zehao and Renz, Katrin and Geiger, Andreas},
    journal= {TPAMI},
    year   = {2022}
  }
---

## TL;DR
TransFuser 在 CARLA 上做 **相机 + LiDAR + transformer 融合**的 BC driver，**和 [PlanT](paper_2210.14222_plant.md) 同一作者团队**；常被作为 PlanT 的 perception 前端。

## 与 spine 的交集
- **vs PlanT**：PlanT 用对象级、TransFuser 用 dense 多模态 token；两者拼接成 *Perception + PlanT* 的"sensor-based 完整版"，是 CARLA 上的强 baseline 之一。

## Bitter-Lesson 视角
*纯模仿 + 传感器融合 + transformer，没有显式规则。Bitter Lesson 友好。*

## 后续
- → [PlanT](paper_2210.14222_plant.md) · [UniAD](paper_2212.10156_uniad.md)
