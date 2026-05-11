---
id: paper:2307.01694
title: "Spike-driven Transformer"
title_zh: "Spike-driven Transformer：脉冲驱动 Transformer"
kind: paper
tier: spine
authors: [Yao, M., Hu, J., Zhou, Z., Yuan, L., Tian, Y., Xu, B., Li, G.]
venue: "NeurIPS 2023"
year: 2023
topic: brain_inspired
phase: frontier
prereqs: [paper:vit, paper:vaswani2017, concept:spiking_nn, concept:self_attention]
extends: []
contrasts: [paper:2508.10104]
parallel: []
contested_by: [essay:bitter_lesson]
labs: [lab06]
deep_links:
  - {label: "PDF p.1（摘要）", url: "https://arxiv.org/pdf/2307.01694#page=1"}
  - {label: "PDF p.4 §3（Spike-Driven Self-Attention）", url: "https://arxiv.org/pdf/2307.01694#page=4"}
  - {label: "PDF p.5 §3.2（mask-and-add 公式）", url: "https://arxiv.org/pdf/2307.01694#page=5"}
  - {label: "PDF p.7 §4（ImageNet-1K 77.1% top-1）", url: "https://arxiv.org/pdf/2307.01694#page=7"}
  - {label: "BICLab/Spike-Driven-Transformer 代码", url: "https://github.com/BICLab/Spike-Driven-Transformer"}
bibtex: |
  @inproceedings{yao2023spikedriven,
    title     = {Spike-driven Transformer},
    author    = {Yao, Man and Hu, Jiakui and Zhou, Zhaokun and Yuan, Li and Tian, Yonghong and Xu, Bo and Li, Guoqi},
    booktitle = {Advances in Neural Information Processing Systems (NeurIPS)},
    year      = {2023}
  }
---

## TL;DR
Spike-driven Transformer 把脉冲神经网络（**SNN**）的"事件驱动 + 二值脉冲 + 加法运算"四条特性灌进 transformer，提出 **Spike-Driven Self-Attention (SDSA)** —— *Q/K/V 之间只有 mask 和 addition，没有任何乘法*；理论计算能耗比 vanilla self-attention 低 **87.2×**，并在 ImageNet-1K 上达到 SNN 领域 SOTA 的 77.1% top-1。

## 位置 / Why it matters
在 *backbone 选择* 这条隐线上，[DINOv3](paper_2508.10104_dinov3.md) 代表"**scale up**"路线，Spike-driven Transformer 代表"**scale down**"路线——同一个问题（如何造一个能在车端跑的视觉骨干）的两个极端答案。

它和 [Bitter Lesson](essay_bitter_lesson.md) 形成强张力：**brain-inspired 强调能耗 + 物理可行性，bitter lesson 强调"不要管能耗，scale 就行"**——这是面向自动驾驶（车端约束）研究者最值得思考的工程哲学冲突。

## 数学锚点 / Math anchor
SNN 的核心元件是 **Leaky Integrate-and-Fire (LIF)** 神经元：
$$
u_t = \alpha\, u_{t-1} + W x_t,\qquad s_t = \mathbb{1}[u_t \geq u_{\text{th}}],\qquad u_t \leftarrow u_t \cdot (1-s_t)
$$
$s_t \in \{0,1\}$ 即"脉冲"。

**SDSA**：让 $Q, K, V$ 都是脉冲张量 $\in\{0,1\}^{N\times d}$。Spike-driven Self-Attention 把传统 $\mathrm{softmax}(QK^\top/\sqrt{d})V$ 替换为：
$$
\mathrm{SDSA}(Q,K,V) \;=\; \mathrm{LN}\Big(\, \mathrm{SUM}_c(Q \otimes K) \;\odot\; V \,\Big)
$$
- $Q\otimes K$ 是逐元素逻辑与（即 mask）；
- $\mathrm{SUM}_c$ 沿 channel 维做加法（注意：**没有乘法**，因为脉冲与脉冲的积只有 0/1）；
- $\odot$ 是另一次 mask。

直觉：传统 self-attention 在做"软 routing"（连续权重）；SDSA 做"硬 routing"（二值 gate）。这一刀让所有 multiplications 退化成 additions，自然得到能效优势。

## 架构 / Architectural intuition
- **Residual connection 重排**：vanilla transformer 的残差在激活后；SDSA 把残差移到激活**之前**，确保所有传输的信号仍是 0/1 脉冲。
- **Token-level + channel-level 都线性复杂度**：$\mathrm{SUM}_c$ 沿 channel 求和后，token 维只剩点乘，整体复杂度 $O(Nd)$。
- 网络 backbone 用 SEW-ResNet 或 Spikformer-style 的 patch-embedding。

> 物理直觉：把 transformer 在硅基上的 *FP16 乘加阵列* 换成神经形态芯片上的 *event-driven AND/ADD 阵列*。在**事件相机**（event camera）输入下尤其自然——天然就是事件流。

## 工程 / Engineering notes
- Repo: [`BICLab/Spike-Driven-Transformer`](https://github.com/BICLab/Spike-Driven-Transformer)。
- 框架: SpikingJelly / 自定义 PyTorch SNN 模块。
- 硬件可观察的能效优势需在**神经形态芯片**（Loihi / SpiNNaker / Tianjic）上才能落地；GPU 上能效几乎不差异（GPU 仍然乘加）。
- Gotchas：模型参数量与激活稀疏度需配合调；蒸馏 from ANN 是常见 trick。
- License：MIT.

## 深度阅读路径 / Deep-anchored reading order
1. **PDF p.1 摘要 + p.2 §1**——SNN 的"四特性"列表，是论文 motivation 的全部。
2. **PDF p.3 §2 SNN 简介**——LIF + surrogate gradient（如果你不熟 SNN，这一段不可跳）。
3. **PDF p.4–5 §3 SDSA**——核心公式；建议把 Fig.2 在纸上画一遍。
4. **PDF p.7 §4.2 表 2**——和其他 SNN 在 ImageNet 上的比较；与 ANN 的差距仍存在但已收窄。
5. **PDF p.8 §4.3**——能效估计；理解"理论 87.2× 节能"的具体口径。

## Bitter-Lesson 视角 / lens
*Bitter Lesson 的字面解读会**否定**这条 brain-inspired 路线："不要给硬件优化，扩大规模即可。"但 Sutton 真正的命题是 *general methods leveraging computation*，而**车端的可用 computation 有上限**。Spike-driven Transformer 的论据是：当算力天花板是物理（电池 / 散热）时，**bitter lesson 必须落到能效曲线上才能继续 scale**。这条线在自动驾驶（部署导向）比在云端推理（成本导向）更有意义；而后者由 [DINOv3](paper_2508.10104_dinov3.md) 等"scale-everything"工作牢牢占据。两条路线短期内不会汇合。*

## 后续节点 / Suggested next nodes
- → [DINOv3 (2508.10104)](paper_2508.10104_dinov3.md) ：相反极端
- → [ViT](paper_vit.md) ：母架构
- → [`concept:spiking_nn`](../../concepts.md) · [`concept:self_attention`](../../concepts.md)
- → [Bitter Lesson](essay_bitter_lesson.md) ：哲学对话

## 配套实验 / Lab
[`labs/lab06_spike_driven_attention_mnist.ipynb`](../../../labs/lab06_spike_driven_attention_mnist.ipynb) — 在 MNIST/CIFAR 上实现一个最小 SDSA 块，统计 mask-and-add 后被消除的乘法次数，并与 vanilla attention 对比能效估计。
