---
id: paper:gpt3
title: "GPT-3 — Language Models are Few-Shot Learners"
title_zh: "GPT-3：语言模型是 few-shot 学习者"
kind: paper
tier: S
authors: [Brown, T., Mann, B., Ryder, N., Subbiah, M., et al.]
venue: "NeurIPS 2020"
year: 2020
topic: vlm_vla
phase: prereq
prereqs: [paper:vaswani2017]
extends: [paper:vaswani2017]
contrasts: []
parallel: []
contested_by: []
labs: []
deep_links:
  - {label: "PDF", url: "https://arxiv.org/pdf/2005.14165"}
  - {label: "PDF p.7 §3 训练数据 + 模型规模", url: "https://arxiv.org/pdf/2005.14165#page=7"}
  - {label: "PDF p.10 §3.1 in-context learning 现象", url: "https://arxiv.org/pdf/2005.14165#page=10"}
  - {label: "Mu Li GPT 1/2/3 精读", url: "https://www.bilibili.com/video/BV1AF411b7xQ/"}
bibtex: |
  @inproceedings{brown2020gpt3,
    title     = {Language Models are Few-Shot Learners},
    author    = {Brown, Tom B. and Mann, Benjamin and Ryder, Nick and Subbiah, Melanie and others},
    booktitle = {NeurIPS},
    year      = {2020}
  }
---

## TL;DR
175B 参数 decoder-only transformer，在大规模文本上 next-token 预训练；**无需 fine-tune，仅靠 prompt（few-shot in-context examples）即可在大量任务上 SOTA**。这是后来一切 LLM agent / VLA 的物理前提。

## 位置 / Why it matters
- 没有 GPT-3 的"few-shot in-context"现象，[DiLu](paper_2309.16292_dilu.md) / [Agent-Driver](paper_2311.10813_agent_driver.md) 的"用 LLM 做 driver"思路根本不成立；
- 它是 [Bitter Lesson](essay_bitter_lesson.md) 在 NLP 的最高级实证：所有曾经"必须靠 hand-crafted 规则"的任务，被 *规模 + prompt* 一并解决。

## 数学锚点 / Math anchor
预训练目标：next-token 极大似然
$$
\mathcal{L}=-\sum_{i}\log p_\theta(x_i \mid x_{<i})
$$
模型族尺寸：125M（small）→ 175B（GPT-3）。**Scaling laws**：loss 与 (data, params, compute) 呈 power-law 衰减。

## 架构 / Architectural intuition
- 标准 decoder-only transformer；
- causal mask；
- 训练时所有数据混合（CommonCrawl + Books + Wikipedia + ...）。

## 工程 / Engineering notes
- 模型权重未公开；社区用 LLaMA / Falcon / Qwen / Mistral 替换。
- License：API 形态分发。

## Bitter-Lesson 视角 / lens
*GPT-3 是 Bitter Lesson 当代版"教科书例 #1"。规模本身就是能力——这一论点在它之前是猜想，在它之后成为社区共识。*

## 后续节点 / Suggested next nodes
- → [DiLu](paper_2309.16292_dilu.md) · [Agent-Driver](paper_2311.10813_agent_driver.md) · [DriveVLM](paper_2402.12289_drivevlm.md) · [CF-VLA](paper_2512.24426_cfvla.md)
- → [LLaVA](paper_llava.md) · [RLHF/DPO](paper_rlhf_dpo.md)
