---
id: paper:diffuser
title: "Diffuser / Decision Diffuser — Planning via Diffusion Models"
title_zh: "Diffuser / Decision Diffuser：基于扩散模型的规划"
kind: paper
tier: B
authors: [Janner, M., Du, Y., Tenenbaum, J., Levine, S.]
venue: "ICML 2022 / 2023"
year: 2022
topic: deep_rl
phase: frontier
prereqs: [course:cs285]
extends: []
contrasts: []
parallel: [paper:gaia1]
contested_by: []
labs: []
deep_links:
  - {label: "Diffuser PDF", url: "https://arxiv.org/pdf/2205.09991"}
  - {label: "Decision Diffuser PDF", url: "https://arxiv.org/pdf/2211.15657"}
---

## TL;DR（3 行）
把"规划"建模为**对未来轨迹的扩散去噪**：模型输入起点 + 目标，扩散反推一条满足约束的连续轨迹。**与本图谱关系**：与 [VADv2](paper_vadv2.md) "概率轨迹分布"思路同源；扩散 planner 在 AD 文献里是 [PlanT](paper_2210.14222_plant.md) / VAD 系列之外的第三条路。
