---
id: paper:tesla_ai_day
title: "Tesla AI Day (2021/2022) — Industrial-scale E2E AD"
title_zh: "Tesla AI Day：工业规模端到端自动驾驶"
kind: paper
tier: B
authors: [Tesla AI team]
venue: "Tesla AI Day 2021/2022"
year: 2022
topic: e2e_ad
phase: prereq
prereqs: []
extends: []
contrasts: []
parallel: [paper:2212.10156]
contested_by: []
labs: []
deep_links:
  - {label: "Tesla AI Day 2022 (YouTube)", url: "https://www.youtube.com/watch?v=ODSJsviD_SU"}
  - {label: "技术细节速览（Andrej Karpathy 演讲）", url: "https://www.youtube.com/watch?v=j0z4FweCy4M"}
---

## 先抓住这件事
Tesla AI Day 的价值，不在于它是一篇可复现实验论文，而在于它把工业界的自动驾驶系统第一次相对完整地摊开：多摄像头感知、BEV 表示、occupancy、planner、数据引擎、训练基础设施，全部作为同一个产品闭环的一部分出现。

## 它在图谱里的位置
时间线上，它早于 [UniAD](paper_2212.10156_uniad.md) / [BEVFormer](paper_li2022bevformer.md) 的学术爆发，却已经展示了非常相近的问题意识：把图像变成 BEV，把短时世界状态变成可规划空间，再让数据闭环不断挖掘长尾。读它时不要用“论文贡献点”标准去苛责，而要把它当成工业系统的透视图。

## 为什么值得看
对研究者来说，AI Day 至少提供三点提醒：

1. **产品系统先于论文语言**：很多后来在论文里被命名的模块，工业界可能已经以工程形态存在；
2. **数据引擎和模型同等重要**：长尾不是靠单个 architecture trick 解决的，而靠持续发现、标注、训练、回归；
3. **端到端不是一句口号**：真正的端到端系统必须穿过感知、预测、规划、部署、反馈闭环。

## Bitter-Lesson 视角 / lens
Tesla AI Day 几乎是自动驾驶版 Bitter Lesson 的工业注脚：把更多真实数据、更大训练系统、更自动化的数据闭环放在核心位置，而不是依赖小规模手写规则。但它也保留了大量工程先验，例如 BEV、occupancy、planner 分层和安全约束。这里的教训更务实：规模化学习是主发动机，结构化工程接口是让它能上车的传动系统。

## 接下来读什么
- → [BEVFormer](paper_li2022bevformer.md)：看学术界如何形式化 BEV query。
- → [UniAD](paper_2212.10156_uniad.md)：看规划导向的统一端到端网络。
- → [DriveVLM](paper_2402.12289_drivevlm.md)：看工业系统如何继续吸收 VLM。
