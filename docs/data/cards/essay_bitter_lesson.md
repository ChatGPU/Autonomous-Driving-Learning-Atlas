---
id: essay:bitter_lesson
title: "The Bitter Lesson"
title_zh: "苦涩的教训"
kind: essay
tier: spine
authors: [Sutton, R.]
venue: "Personal blog, March 2019"
year: 2019
topic: meta_philosophy
phase: prereq
prereqs: []
extends: []
contrasts: [paper:2309.16292, paper:2311.10813, paper:2210.14222, paper:2307.01694]
parallel: []
contested_by: []
labs: []
deep_links:
  - {label: "原文（PDF 镜像 by UT Austin）", url: "https://www.cs.utexas.edu/~eunsol/courses/data/bitter_lesson.pdf"}
  - {label: "原始 blog 站点（incompleteideas.net）", url: "http://www.incompleteideas.net/IncIdeas/BitterLesson.html"}
  - {label: "Wikipedia 词条", url: "https://en.wikipedia.org/wiki/Bitter_lesson"}
  - {label: "Sutton 2025 后续访谈：True Continual Learning", url: "https://www.nextbigfuture.com/2025/09/ai-legend-sutton-wrote-the-bitter-lesson-gives-his-suggestions-for-true-continual-learning.html"}
bibtex: |
  @misc{sutton2019bitter,
    title  = {The Bitter Lesson},
    author = {Sutton, Richard S.},
    year   = {2019},
    howpublished = {\url{http://www.incompleteideas.net/IncIdeas/BitterLesson.html}}
  }
---

## TL;DR
两页 A4。Sutton 主张：70 年 AI 历史里，**靠通用算力 + 通用学习方法**（搜索 + 学习）的路线**反复打败**靠人类领域知识精雕细琢的路线。Moore's Law 让算力指数变便宜，**唯一长期重要的算法属性是"能 scale"**。这件事让研究者"苦涩"，因为它否认了人类领域洞察的长期价值。

## 位置 / Why it matters
本图谱选 Bitter Lesson 作为**贯穿性的反方视角**：

- 对 [DiLu](paper_2309.16292_dilu.md)、[Agent-Driver](paper_2311.10813_agent_driver.md)：质问 *"知识驱动"* 在 scale-up 后是否仍有优势；
- 对 [PlanT](paper_2210.14222_plant.md)：质问"对象级先验"是否会在感知 scale 起来后被淘汰；
- 对 [Spike-driven Transformer](paper_2307.01694_spike_driven_transformer.md)：质问 brain-inspired 的能效路线在端侧算力上行的现实下还能撑多久；
- 对 [DINOv3](paper_2508.10104_dinov3.md)：作为 Bitter Lesson 的**正面教科书**列证。

每张 spine 卡片都有 *Bitter-Lesson 视角* 一节回答这一问。

## 数学锚点 / Math anchor
没有数学。但 Sutton 的命题可以用一个**简化模型**写出来：定义在算力 $C$ 下能达到的性能 $P$。Sutton 主张
$$
\lim_{C\to\infty} \;P_{\text{general-learning}}(C) \;>\; \lim_{C\to\infty}\; P_{\text{knowledge-injected}}(C)
$$
即"**长跑**里通用学习赢"。**短跑**（小算力 / 小数据）里两者排序未必。理解 Bitter Lesson 的关键在于这个 limit。

## 架构 / Architectural intuition
Sutton 给出的两类长跑赢家是：
1. **Search**：Deep Blue（国际象棋 alpha-beta）、AlphaGo（MCTS）；
2. **Learning**：CNN（视觉）、HMM/transformer（语音）、scale 化的 LLM。

而长跑输家是把 *人对该领域如何工作的理解* 直接编进系统：电脑视觉的 hand-crafted 特征、人工词典语义、专家系统。

## 工程 / Engineering notes
- 文章本身是 blog post；可在 5 分钟内读完。Sutton 2025 年的后续访谈进一步把"continual learning"作为下一个 Bitter Lesson 等待被学习的命题。
- 不要把 Bitter Lesson 极端化成"人类 insight 一文不值"。Sutton 的精确陈述是：*hand-crafted knowledge 短期有用、长期会被超越*。研究者真正要警惕的是**把短期 insight 变成长期承担**。

## 深度阅读路径 / Deep-anchored reading order
1. **PDF p.1 第一段**——先抓住核心论点：长期来看，利用计算规模的通用方法更容易胜出。
2. **PDF p.1 第二段（chess）+ p.2（Go）**——两个最经典例子。
3. **PDF p.2 倒数第二段**——*"these methods build in our discoveries... they make it harder, not easier, for us to see how the simpler methods will succeed."* —— 全文最警醒的一句。
4. **2025 后续访谈**——Sutton 自己对 LLM scale 路径的最新看法（强调 *continual learning* 是 missing piece）。

## Bitter-Lesson 视角 / lens
*这一节对自己：Bitter Lesson 自己也是一个**对短期人类经验的概括**——它的"长期适用性"也只是一个经验主张，不是定理。把它当成**严格的方法论原则**会陷入循环：你拒绝注入人工先验时，本身就是在注入"不要注入"的人工先验。本图谱的态度：*把 Bitter Lesson 当镜子用，不当戒律。**

## 后续节点 / Suggested next nodes
- → [DINOv3](paper_2508.10104_dinov3.md) ：现代正面例证
- → [DiLu](paper_2309.16292_dilu.md) · [Agent-Driver](paper_2311.10813_agent_driver.md) · [PlanT](paper_2210.14222_plant.md) ：被本文质问的对象
- → [AlphaGo Zero (silver2017)](paper_silver2017_alphazero.md) ：Sutton 自己引的标准例子
- → [`concept:scaling_vs_knowledge`](../../concepts.md)
