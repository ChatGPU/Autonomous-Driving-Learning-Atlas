---
id: paper:mamba
title: "Mamba — Selective State Space Models"
title_zh: "Mamba：选择性状态空间模型"
kind: paper
tier: B
authors: [Gu, A., Dao, T.]
venue: "COLM 2024"
year: 2023
topic: math_foundations
phase: frontier
prereqs: [paper:vaswani2017]
extends: []
contrasts: [paper:vaswani2017]
parallel: []
contested_by: []
labs: []
deep_links:
  - {label: "PDF", url: "https://arxiv.org/pdf/2312.00752"}
  - {label: "state-spaces/mamba 代码", url: "https://github.com/state-spaces/mamba"}
---

## 先抓住这件事
如果把 Transformer 的 self-attention 想成“每个 token 都去和所有 token 对话”，Mamba 则更像一条会选择性记忆的河流：信息沿时间向前流动，模型在每一步决定哪些状态留下、哪些状态忘掉。这样做的直接好处是序列长度变长时，计算量不再按 $L^2$ 爆炸。

## 它在图谱里的位置
Mamba 不是自动驾驶论文，但它回答了一个所有 VLM / VLA 系统迟早会遇到的问题：当视频帧、地图 token、语言 prompt 和历史记忆越来越长，Transformer 还能一直承担 backbone 吗？如果 [DriveVLM](paper_2402.12289_drivevlm.md) 或 [CF-VLA](paper_2512.24426_cfvla.md) 未来需要更长上下文、更低延迟的序列模型，Mamba 代表的 selective state space model 就是最自然的候选路线之一。

## 一个最小公式 / Math anchor
可以把它看成带输入选择的状态空间模型：
$$
x_t = A(u_t)x_{t-1}+B(u_t)u_t,\quad y_t=C(u_t)x_t
$$
关键不在“有状态”，而在 $A,B,C$ 会随输入 $u_t$ 改变：模型不是被动保存全部历史，而是在每个 token 上决定“这段信息值不值得写进状态”。

## Bitter-Lesson 视角 / lens
Mamba 与 Bitter Lesson 的关系很微妙。它没有回到人工规则，而是在保留通用学习器的前提下，把计算结构改成更适合长序列的形式。Sutton 会赞同“让模型自己学选择性记忆”，但也会追问：这种结构优势能否在足够大规模的数据和算力下长期超过 attention？目前更稳妥的判断是：Mamba 不是 Transformer 的终结者，而是当上下文长度和延迟成为瓶颈时，值得放进工具箱的替代骨架。

## 接下来读什么
- → [Attention Is All You Need](paper_vaswani2017.md)：先理解 Mamba 要挑战的对象。
- → [DriveVLM](paper_2402.12289_drivevlm.md)：观察长上下文 VLM-on-vehicle 为什么需要更高效的 backbone。
