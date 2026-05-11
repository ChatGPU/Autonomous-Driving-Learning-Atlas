---
id: paper:he2015_resnet
title: "Deep Residual Learning (ResNet)"
title_zh: "ResNet：深度残差学习"
kind: paper
tier: S
authors: [He, K., Zhang, X., Ren, S., Sun, J.]
venue: "CVPR 2016"
year: 2015
topic: ssl_vision
phase: prereq
prereqs: []
extends: []
contrasts: []
parallel: []
contested_by: []
labs: []
deep_links:
  - {label: "PDF", url: "https://arxiv.org/pdf/1512.03385"}
  - {label: "PDF p.4 Fig.2（残差块）", url: "https://arxiv.org/pdf/1512.03385#page=4"}
  - {label: "Mu Li ResNet 精读", url: "https://www.bilibili.com/video/BV1Fb4y1h73E/"}
bibtex: |
  @inproceedings{he2016resnet,
    title     = {Deep Residual Learning for Image Recognition},
    author    = {He, Kaiming and Zhang, Xiangyu and Ren, Shaoqing and Sun, Jian},
    booktitle = {CVPR},
    year      = {2016}
  }
---

## TL;DR
**残差连接** $y=F(x)+x$ 让超深网络（>100 层）能稳定训练，结束了 plain CNN 的深度灾难，奠定了之后所有深网络的"加深 = 加好"路线。

## 位置 / Why it matters
- 本图谱里所有 transformer 块都默认带残差——*那是 ResNet 的遗产*；
- [UniAD](paper_2212.10156_uniad.md) / [PlanT](paper_2210.14222_plant.md) 的图像 encoder 早期常用 ResNet，被 [ViT](paper_vit.md) / [DINOv3](paper_2508.10104_dinov3.md) 替换；
- [Spike-driven Transformer](paper_2307.01694_spike_driven_transformer.md) 专门重排了残差位置，以维持脉冲二值性——这一招直接源自 ResNet。

## 数学锚点 / Math anchor
$$
y \;=\; F(x;\,W) + x
$$
为什么训练更稳？$\partial L/\partial x = (\partial F/\partial x + I)\cdot \partial L/\partial y$ —— 恒等映射保证了 *梯度有一条无衰减的高速公路*。

## 架构 / Architectural intuition
- bottleneck block：1×1 → 3×3 → 1×1；
- BatchNorm + ReLU 标配；
- 模型族：ResNet-18/34/50/101/152。

## 工程 / Engineering notes
- 训练简单、稳定，至今仍是许多检测/分割工作的强 baseline。
- License：MIT。

## Bitter-Lesson 视角 / lens
*ResNet 是"用算法 trick 让算力能继续 scale 下去"的典型——它不是反对 Bitter Lesson，而是**让 Bitter Lesson 在更深网络上仍然成立**。*

## 后续节点 / Suggested next nodes
- → [ViT](paper_vit.md) · [DINOv3](paper_2508.10104_dinov3.md)
- → [Spike-driven Transformer](paper_2307.01694_spike_driven_transformer.md)
