---
id: channel:3blue1brown
title: "3Blue1Brown (Grant Sanderson)"
title_zh: "3Blue1Brown：可视化数学频道"
kind: channel
tier: spine
authors: [Sanderson, G.]
venue: "YouTube"
year: 2015
topic: math_foundations
phase: prereq
prereqs: []
extends: []
contrasts: []
parallel: [channel:mu_li_bilibili, channel:ez_encoder_academy]
contested_by: []
labs: []
deep_links:
  - {label: "频道主页", url: "https://www.youtube.com/@3blue1brown"}
  - {label: "Essence of Linear Algebra", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab"}
  - {label: "Essence of Calculus", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr"}
  - {label: "Neural networks 系列", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi"}
  - {label: "Backpropagation calculus（最贴 ML 的一集）", url: "https://www.youtube.com/watch?v=tIeHLnjs5U8"}
  - {label: "But what is a GPT? / Transformers visualised（必看）", url: "https://www.youtube.com/watch?v=wjZofJX0v4M"}
  - {label: "Attention in transformers", url: "https://www.youtube.com/watch?v=eMlx5fFNoYc"}
bibtex: |
  @misc{sanderson3blue1brown,
    author = {Sanderson, Grant},
    title  = {3Blue1Brown},
    year   = {2015--present},
    howpublished = {YouTube channel \url{https://www.youtube.com/@3blue1brown}}
  }
---

## TL;DR
本图谱**唯一**推荐的"零数学背景也能看懂矩阵 / 求导 / 神经网 / 注意力"的可视化频道。三组 playlist + 两条 GPT/transformer 长视频，覆盖你读 [ViT](paper_vit.md)、[Transformer](paper_vaswani2017.md)、[UniAD](paper_2212.10156_uniad.md) 之前应该有的全部 *intuition*。

## 位置 / Why it matters
对一个**已具备 ML 基础的 AD 研究者**，3Blue1Brown 的角色不是"补漏"——是 *换一种眼睛*。它的 *vector → matrix → eigenvector → SVD* 可视化、*derivative → chain rule → backprop* 几何解释、*attention 是 query 与 key 在向量空间打分* 的动画，能让你**对自己已经写过几百次的代码重新有感觉**——这件事在面对 [DriveVLM](paper_2402.12289_drivevlm.md)、[DINOv3](paper_2508.10104_dinov3.md) 这种结构密度高的工作时尤其有用。

## 数学锚点 / Math anchor
最贴 ML 的一段——**反向传播的链式法则可视化**：把损失 $L$ 对每一层权重的偏导数解释成"沿着计算图把 $\partial L/\partial \cdot$ 一层层乘回去"。

$$
\frac{\partial L}{\partial w^{(\ell)}_{ij}} \;=\; \frac{\partial L}{\partial a^{(\ell+1)}_i}\cdot \frac{\partial a^{(\ell+1)}_i}{\partial z^{(\ell+1)}_i}\cdot \frac{\partial z^{(\ell+1)}_i}{\partial w^{(\ell)}_{ij}}
$$

3b1b 把这串符号画成一张计算图上反向流动的雨水。看完一次，所有 deep RL 和 transformer 推导都更"轻"。

## 架构 / Architectural intuition
推荐顺序：

1. **Essence of Linear Algebra**（1–15 集）——把"矩阵就是线性变换"这件事当成本能；
2. **Essence of Calculus**（1–12 集）——derivative 的几何观，对深入读 SAC / PPO 的 advantage 非常有帮助；
3. **Neural Networks 系列**（4 集 + backprop calc）——把"权重是一个超高维空间里的向量"建立直觉；
4. **GPT / Transformers / Attention**（2024–2025 单集）——这是 3b1b 在 LLM 时代的代表作；任何 VLA 论文（DiLu / Agent-Driver / DriveVLM / CF-VLA）的"VLM 背后到底是什么"都被讲清楚了。

## 工程 / Engineering notes
- 全部免费、英文、有自动字幕（且常被中文社区翻译），无任何商业课程绑定。
- Manim（3b1b 自创的可视化框架）开源：[`3b1b/manim`](https://github.com/3b1b/manim)。如果你做研究汇报，强烈建议学一点。
- 读 [Mu Li 的 Bilibili 论文精读](channel_mu_li_bilibili.md) 时，3b1b 的可视化是最佳"先验"。

## 深度阅读路径 / Deep-anchored reading order
> 对本图谱读者的最小观看顺序（约 5–6 小时）：

1. *Linear Algebra* Ep.3（matrix as transformation）+ Ep.7（dot product）+ Ep.10（eigenvectors）。
2. *Calculus* Ep.2（derivative as slope）+ Ep.4（chain rule）。
3. *Neural Networks* Ep.1–4 + *Backpropagation calculus*。
4. *Attention in transformers*（2024）。
5. *But what is a GPT?*（2024）。

## Bitter-Lesson 视角 / lens
*与本质数学相关的内容是与时间无关的；Bitter Lesson 是在 *算法选择* 上谈论 scale，不是在 *数学语言* 上。学好可视化数学不会让你被 Bitter Lesson 淘汰；继续手写 hand-crafted feature 才会。*

## 后续节点 / Suggested next nodes
- → [Mu Li 跟李沐学AI（B 站）](channel_mu_li_bilibili.md) ：把 3b1b 数学直觉带去精读论文
- → [Transformer (Vaswani 2017)](paper_vaswani2017.md) · [ViT](paper_vit.md)
- → [`concept:transformer`](../../concepts.md) · [`concept:self_attention`](../../concepts.md)
