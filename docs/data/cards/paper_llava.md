---
id: paper:llava
title: "LLaVA / Qwen-VL — Open-source Vision-Language Models"
title_zh: "LLaVA / Qwen-VL：开源视觉-语言模型代表"
kind: paper
tier: A
authors: [Liu, H., Li, C., Wu, Q., Lee, Y.J. (LLaVA); Bai, J., et al. (Qwen-VL)]
venue: "NeurIPS 2023 / arXiv 2023"
year: 2023
topic: vlm_vla
phase: prereq
prereqs: [paper:gpt3, paper:vit]
extends: [paper:gpt3]
contrasts: []
parallel: []
contested_by: []
labs: []
deep_links:
  - {label: "LLaVA PDF", url: "https://arxiv.org/pdf/2304.08485"}
  - {label: "LLaVA 项目页", url: "https://llava-vl.github.io/"}
  - {label: "Qwen-VL PDF", url: "https://arxiv.org/pdf/2308.12966"}
  - {label: "QwenLM/Qwen-VL", url: "https://github.com/QwenLM/Qwen-VL"}
bibtex: |
  @inproceedings{liu2023llava,
    title     = {Visual Instruction Tuning},
    author    = {Liu, Haotian and Li, Chunyuan and Wu, Qingyang and Lee, Yong Jae},
    booktitle = {NeurIPS},
    year      = {2023}
  }
---

## TL;DR
LLaVA / Qwen-VL 把一个 *vision encoder*（CLIP / ViT）的输出投射到 LLM 的 token 空间，做 visual instruction tuning，得到一个**能读图的 LLM**。开源、便宜、人人能微调。

## 与 spine 的交集
- 是 [DriveVLM](paper_2402.12289_drivevlm.md) / [Agent-Driver](paper_2311.10813_agent_driver.md) / [CF-VLA](paper_2512.24426_cfvla.md) 的**实际基座 VLM 之一**；
- 是本图谱 [lab09](../../../labs/lab09_drivevlm_dual_pipeline.ipynb) 推荐的真实 LLM 后端选项。

## 后续
- → [DriveVLM](paper_2402.12289_drivevlm.md) · [GPT-3](paper_gpt3.md) · [ViT](paper_vit.md)
