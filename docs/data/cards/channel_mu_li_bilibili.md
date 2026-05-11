---
id: channel:mu_li_bilibili
title: "跟李沐学AI (Mu Li, BosonAI co-founder)"
title_zh: "跟李沐学AI：Bilibili 论文精读 + 动手学深度学习"
kind: channel
tier: spine
authors: [Li, M.]
venue: "Bilibili (UID 1567748478)"
year: 2020
topic: companion_media
phase: prereq
prereqs: []
extends: []
contrasts: []
parallel: [channel:3blue1brown, channel:ez_encoder_academy]
contested_by: []
labs: []
deep_links:
  - {label: "B 站主页", url: "https://space.bilibili.com/1567748478"}
  - {label: "AI 论文精读 合集（60+ 视频）", url: "https://space.bilibili.com/1567748478/lists?sid=2156419"}
  - {label: "动手学深度学习 v2", url: "https://courses.d2l.ai/zh-v2/"}
  - {label: "ViT 论文逐段精读", url: "https://www.bilibili.com/video/BV15P4y137jb/"}
  - {label: "Transformer 论文精读", url: "https://www.bilibili.com/video/BV1pu411o7BE/"}
  - {label: "GPT 1/2/3 精读", url: "https://www.bilibili.com/video/BV1AF411b7xQ/"}
  - {label: "CLIP 精读", url: "https://www.bilibili.com/video/BV1SL4y1s7LQ/"}
bibtex: |
  @misc{li2020d2l,
    author = {Li, Mu},
    title  = {Dive into Deep Learning + AI Paper Reading Series},
    year   = {2020--present},
    howpublished = {Bilibili \url{https://space.bilibili.com/1567748478}}
  }
---

## TL;DR
李沐（BosonAI 联合创始人；前 AWS Principal Scientist；*动手学深度学习* 作者）的 B 站频道是中文 ML 社区的"事实标准"——*论文精读* 系列把 60+ 篇祖师爷级论文（ResNet、Transformer、ViT、BERT、GPT 1/2/3、CLIP、AlphaFold2、Diffusion、…）从摘要一路逐段念到结论。**强烈推荐作为读 spine 论文之前的"30 分钟暖身"**。

## 位置 / Why it matters
本图谱里很多 spine 论文的**直接前身**——Transformer / ViT / DETR / GPT / DINO / CLIP——都已经在李沐这里有 30–60 分钟的中文逐段精读视频；先看一遍精读再读原论文，时间成本能砍一半。同时 *动手学深度学习 v2* 是中文世界最系统的 PyTorch 入门教材（也有 MXNet / TF 版）。

它和 [3Blue1Brown](channel_3blue1brown.md) 形成完美互补：

- 3b1b：**直觉 / 可视化**（无代码）；
- Mu Li：**论文 + 代码**（PyTorch 全套）。

## 数学锚点 / Math anchor
没有专属公式——但每集精读视频里李沐会把论文公式逐条点过去，必要时手画推导。看完精读再读原文，能省掉"在论文里反复回到 Notation 表"的痛苦。

## 架构 / Architectural intuition
推荐"配读地图"——本图谱 spine 论文 ↔ Mu Li 精读：

| 本图谱节点 | 推荐先看的精读视频 |
|---|---|
| [UniAD](paper_2212.10156_uniad.md) | *Transformer 精读* + *ViT 精读* + *DETR 精读* |
| [PlanT](paper_2210.14222_plant.md) | *Transformer 精读*（核心架构同源） |
| [DriveVLM](paper_2402.12289_drivevlm.md) | *CLIP 精读* + *GPT 1/2/3 精读* |
| [DiLu / Agent-Driver](paper_2309.16292_dilu.md) | *GPT 精读* + *InstructGPT 精读* |
| [DINOv3](paper_2508.10104_dinov3.md) | *MAE 精读* + *DINO 精读* |
| [Spike-driven Transformer](paper_2307.01694_spike_driven_transformer.md) | *Transformer 精读* + *ViT 精读*（理解差分） |
| [CF-VLA](paper_2512.24426_cfvla.md) | *RLHF / InstructGPT 精读* + *GPT 精读* |

## 工程 / Engineering notes
- 全部免费 + 中文 + 通常 30–60 分钟一集。
- *动手学深度学习* 配套 [`d2l-ai/d2l-zh`](https://github.com/d2l-ai/d2l-zh) 仓库，所有代码 Jupyter 直接可跑。
- 适合**在通勤 / 健身时听**——李沐的语速和讲述风格很适合"半被动学习"。

## 深度阅读路径 / Deep-anchored reading order
> 对本图谱读者的最佳上手路径（≈ 6 小时）：
1. *Transformer 论文精读*
2. *ViT 论文精读*
3. *GPT 1/2/3 精读*
4. *DETR 精读*
5. *CLIP 精读*
6. *MAE / DINO 精读*

## Bitter-Lesson 视角 / lens
*Mu Li 的精读频道**事实上**就是 Bitter Lesson 的传播载体——它精选的 60+ 篇论文几乎全是 *general learning + scale* 的代表作。这条线索本身就是 Sutton 论点的现代实证清单。*

## 后续节点 / Suggested next nodes
- → [3Blue1Brown](channel_3blue1brown.md) ：补可视化直觉
- → [ez.encoder.academy](channel_ez_encoder_academy.md) ：补当代 LLM/agent 风评与职业化视角
- → spine 论文（直接进入本图谱主线）
