---
id: paper:vaswani2017
title: "Attention Is All You Need"
title_zh: "Attention Is All You Need：Transformer 原始论文"
kind: paper
tier: S
authors: [Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A.N., Kaiser, L., Polosukhin, I.]
venue: "NeurIPS 2017"
year: 2017
topic: math_foundations
phase: prereq
prereqs: []
extends: []
contrasts: []
parallel: []
contested_by: []
labs: []
deep_links:
  - {label: "PDF", url: "https://arxiv.org/pdf/1706.03762"}
  - {label: "PDF p.3 §3 架构图（Fig.1）", url: "https://arxiv.org/pdf/1706.03762#page=3"}
  - {label: "PDF p.4 §3.2 Scaled Dot-Product Attention", url: "https://arxiv.org/pdf/1706.03762#page=4"}
  - {label: "Mu Li 论文精读（B 站）", url: "https://www.bilibili.com/video/BV1pu411o7BE/"}
bibtex: |
  @inproceedings{vaswani2017attention,
    title     = {Attention Is All You Need},
    author    = {Vaswani, Ashish and Shazeer, Noam and Parmar, Niki and Uszkoreit, Jakob and Jones, Llion and Gomez, Aidan N. and Kaiser, Lukasz and Polosukhin, Illia},
    booktitle = {NeurIPS},
    year      = {2017}
  }
---

## TL;DR
Transformer 原始论文。**只用 attention，无 RNN/CNN**。Scaled-dot-product + multi-head + position encoding + 残差 + LayerNorm，一次性把 NMT SOTA 拉起，**奠定后来所有 LLM/ViT/VLA 的骨架**。

## 位置 / Why it matters
本图谱里**几乎每一篇 spine 论文**直接或间接基于 Transformer：[ViT](paper_vit.md) → [DINOv3](paper_2508.10104_dinov3.md)；[DETR](paper_carion2020.md) → [UniAD](paper_2212.10156_uniad.md) / [PlanT](paper_2210.14222_plant.md)；[GPT-3](paper_gpt3.md) → [DiLu](paper_2309.16292_dilu.md) / [Agent-Driver](paper_2311.10813_agent_driver.md) / [DriveVLM](paper_2402.12289_drivevlm.md) / [CF-VLA](paper_2512.24426_cfvla.md)；连 [Spike-driven Transformer](paper_2307.01694_spike_driven_transformer.md) 名字都直接挂着它。

## 数学锚点 / Math anchor
**Scaled Dot-Product Attention**：
$$
\mathrm{Attention}(Q,K,V) \;=\; \mathrm{softmax}\!\Big(\tfrac{QK^\top}{\sqrt{d_k}}\Big)V
$$
**Multi-head**：把 $Q,K,V$ 投影到 $h$ 个子空间，分别做 attention 再 concat。

直觉：每个 head 在向量空间里学一种"打分关系"——句法、语义、位置……scaled $\sqrt{d_k}$ 是**为了让 softmax 不饱和**的方差控制，常被忽略但对训练稳定至关重要。

## 架构 / Architectural intuition
Encoder-decoder 各 6 层，每层 = MHA + FFN + 残差 + LayerNorm。Position encoding 用 sinusoidal 让模型知道 token 顺序——后来被 *learnable position*、*RoPE*、*ALiBi* 替换。

## 工程 / Engineering notes
- 复刻：HF 的 `transformers` 库已是事实标准。
- 关键 trick：warmup + Noam scheduler（虽然现代多被 cosine 代替）。
- License：Open，论文+各大复刻全部 MIT/Apache。

## 深度阅读路径 / Deep-anchored reading order
1. PDF p.3 Fig.1 + §3.1 整体架构；
2. PDF p.4 §3.2 attention 公式；
3. PDF p.5 §3.3 multi-head；
4. PDF p.5 §3.4 position encoding；
5. *Mu Li 精读视频* —— 把每一段中文化讲一次。

## Bitter-Lesson 视角 / lens
*Transformer 是 Bitter Lesson 在 2017 年的胜利：用更通用的 attention 取代针对序列定制的 RNN gates（LSTM 的 forget gate 等）。这条胜利在之后的 8 年里反复重演。*

## 后续节点 / Suggested next nodes
- → [ViT](paper_vit.md) · [DETR](paper_carion2020.md) · [GPT-3](paper_gpt3.md)
- → [`concept:transformer`](../../concepts.md) · [`concept:self_attention`](../../concepts.md)
