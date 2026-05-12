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

## 先用一幅图理解
原来的 LLM 像一个只读文字的驾驶教练；LLaVA / Qwen-VL 给它接上眼睛。视觉 encoder 先把图片变成一串 visual tokens，再通过投影层送进语言模型，于是模型可以在同一个上下文里同时处理“图里有什么”和“人问了什么”。

## 与 spine 的交集
- 是 [DriveVLM](paper_2402.12289_drivevlm.md) / [Agent-Driver](paper_2311.10813_agent_driver.md) / [CF-VLA](paper_2512.24426_cfvla.md) 的**实际基座 VLM 之一**；
- 是本图谱 [lab09](../../../labs/lab09_drivevlm_dual_pipeline.ipynb) 推荐的真实 LLM 后端选项。

## 工程上真正要注意什么
开源 VLM 的优势是便宜、可控、可微调；短板是它通常不是为驾驶场景训练的。把它搬到自动驾驶里，最容易出问题的地方不是“能不能描述图片”，而是：

- 对小目标、遮挡、远距离交通参与者的稳定性；
- 对时序信息的理解（单帧看图和连续驾驶不是一回事）；
- 输出是否能被下游 planner 可靠解析。

## Bitter-Lesson 视角 / lens
LLaVA / Qwen-VL 是 Bitter Lesson 的现代版本：不要为每个视觉问答任务手写规则，而是把视觉特征接入大语言模型，再用大规模 instruction data 训练通用能力。自动驾驶使用它们时又加入了新的任务先验：prompt 模板、meta-action 空间、planner 接口。真正的张力在这里——通用 VLM 提供能力底座，驾驶系统仍需要工程接口把能力变成可控动作。

## 后续
- → [DriveVLM](paper_2402.12289_drivevlm.md) · [GPT-3](paper_gpt3.md) · [ViT](paper_vit.md)
