---
id: paper:vit
title: "ViT — An Image is Worth 16x16 Words"
title_zh: "ViT：将图像切 patch 后当 token 输入 Transformer"
kind: paper
tier: S
authors: [Dosovitskiy, A., Beyer, L., Kolesnikov, A., Weissenborn, D., Zhai, X., Unterthiner, T., et al.]
venue: "ICLR 2021"
year: 2020
topic: ssl_vision
phase: prereq
prereqs: [paper:vaswani2017]
extends: [paper:vaswani2017]
contrasts: []
parallel: [paper:he2015_resnet]
contested_by: []
labs: []
deep_links:
  - {label: "PDF", url: "https://arxiv.org/pdf/2010.11929"}
  - {label: "PDF p.3 Fig.1（patch embedding）", url: "https://arxiv.org/pdf/2010.11929#page=3"}
  - {label: "Mu Li ViT 精读", url: "https://www.bilibili.com/video/BV15P4y137jb/"}
bibtex: |
  @inproceedings{dosovitskiy2021vit,
    title     = {An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale},
    author    = {Dosovitskiy, Alexey and Beyer, Lucas and Kolesnikov, Alexander and Weissenborn, Dirk and Zhai, Xiaohua and Unterthiner, Thomas and others},
    booktitle = {ICLR},
    year      = {2021}
  }
---

## TL;DR
把图像切成 16×16 的 patch、拉直成 token、加 position embedding，扔给一个标准 transformer encoder。**当数据足够大**（JFT-300M）时，纯 transformer 就能在 ImageNet 上超 ResNet。把 CV 从"必须用卷积"的 dogma 中解放出来。

## 位置 / Why it matters
ViT 是本图谱"视觉骨干"的分水岭：之后的 [DINOv2](paper_dinov2.md) → [DINOv3](paper_2508.10104_dinov3.md) 全是 ViT 上做 SSL；[Spike-driven Transformer](paper_2307.01694_spike_driven_transformer.md) 是 ViT 的 SNN 化；[BEVFormer](paper_li2022bevformer.md) 把 ViT 的 attention 提到 BEV；[UniAD](paper_2212.10156_uniad.md) 的 image encoder 默认是 ViT。

## 数学锚点 / Math anchor
图像 $I\in\mathbb{R}^{H\times W\times C}$ 切成 $N=HW/P^2$ 个 patch，每个 patch 拉直 + 线性投影：
$$
z_0 = [x_{\text{cls}};\;\mathbf{x}_p^1 E;\;\mathbf{x}_p^2 E;\;\dots] + E_{\text{pos}}
$$
然后 $L$ 层 transformer encoder。最后 $z_L^{[\text{cls}]}$ 接分类头。

## 架构 / Architectural intuition
- patch = "视觉词"；
- self-attention 让每个 patch 关注全局其他 patch（与 CNN 的局部感受野相反）；
- 位置 embedding 是必不可少的（attention 本身置换不变）。

## 工程 / Engineering notes
- 大数据集预训练 + 小数据集 fine-tune 是 ViT 的"必胜公式"；
- 模型族 ViT-S/B/L/H/G + patch sizes 14/16/32；
- License：Apache-2.0（HF 实现）。

## 深度阅读路径 / Deep-anchored reading order
1. PDF p.3 Fig.1 + §3.1；2. PDF p.5 §4.1 与 ResNet 对比；3. *Mu Li 精读*。

## Bitter-Lesson 视角 / lens
*ViT 把"卷积是视觉的归纳偏置"这个 hand-crafted prior 砍掉，让数据和算力替它学。又一个 Bitter Lesson 现代正例。*

## 后续节点 / Suggested next nodes
- → [DINOv3 (2508.10104)](paper_2508.10104_dinov3.md) · [DINOv2](paper_dinov2.md) · [Spike-driven Transformer](paper_2307.01694_spike_driven_transformer.md)
- → [BEVFormer](paper_li2022bevformer.md) · [UniAD](paper_2212.10156_uniad.md)
