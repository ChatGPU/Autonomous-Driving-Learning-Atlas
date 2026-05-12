---
id: paper:lingo2
title: "Wayve LINGO-2 — Talking Driver"
title_zh: "Wayve LINGO-2：会说话的驾驶员"
kind: paper
tier: B
authors: [Wayve]
venue: "Wayve technical report 2024"
year: 2024
topic: vlm_vla
phase: frontier
prereqs: []
extends: []
contrasts: []
parallel: [paper:2402.12289]
contested_by: []
labs: []
deep_links:
  - {label: "Wayve 博客", url: "https://wayve.ai/thinking/lingo-2-driving-with-language/"}
---

## 先抓住这件事
LINGO-2 试图让自动驾驶系统不只是“输出轨迹”，还要能解释自己：它看到了什么、为什么减速、为什么等待、下一步准备怎样开。对访问者来说，它的价值不在某个可复现 benchmark 数字，而在展示了工业界正在把 VLA 做成可沟通、可调试的驾驶员。

## 它在图谱里的位置
它和 [DriveVLM](paper_2402.12289_drivevlm.md) 是商业路线上的近邻：二者都把视觉、语言、动作放在同一系统里，只是公开材料的侧重点不同。DriveVLM 更像论文式系统拆解，LINGO-2 更像产品化展示：一辆车如何边开边说出自己的理由。

## 为什么值得看
自动驾驶里“会解释”不只是展示效果。它会影响三件事：

1. **调试**：工程师能更快看出模型到底误解了什么；
2. **信任**：乘客和安全员能知道系统为什么采取某个动作；
3. **数据闭环**：自然语言解释可以变成更高层的错误标签，反过来指导后训练。

## Bitter-Lesson 视角 / lens
LINGO-2 看似加入了“解释”这种人类友好的接口，但底层方向仍然是规模化学习：让一个通用模型同时吸收视频、动作和语言监督。Sutton 可能会提醒我们，不要把解释文本误当成真实因果机制；但在工程上，可读解释能帮助人类发现数据和模型的问题，是走向更大规模闭环训练的辅助工具。

## 接下来读什么
- → [DriveVLM](paper_2402.12289_drivevlm.md)：看更论文式的 VLM-on-vehicle 结构。
- → [GAIA-1](paper_gaia1.md)：理解 Wayve world model 背后的想象路线。
