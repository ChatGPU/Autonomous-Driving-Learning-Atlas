# Path C · 类脑 / 高效自动驾驶 / Brain-inspired & Efficient AD

> **适合读者**：关心**车端算力 / 能耗 / 实时性**的研究者；或者对 SNN、神经形态硬件感兴趣的人。
> **预计时长**：~10 小时。
> **完成后你能**：在 *能耗 vs 能力* 这条曲线上判断每篇 AD 工作的位置，并理解 Bitter Lesson 在端侧场景的修正版本。

## 推荐顺序

| # | 节点 | 重点 | 估时 |
|---|---|---|---|
| 1 | [ViT](../docs/data/cards/paper_vit.md) | 后续 SDSA 的母架构，必先复习。 | 30 min |
| 2 | [Spike-driven Transformer](../docs/data/cards/paper_2307.01694_spike_driven_transformer.md) | 本路径核心；把 multiplications 全消成 mask + add。 | 2 h |
| 3 | [DINOv3](../docs/data/cards/paper_2508.10104_dinov3.md) | 反方极端：scale-up 的胜利者。 | 1 h |
| 4 | [UniAD](../docs/data/cards/paper_2212.10156_uniad.md) | 给"能效优化"找一个真正落地的应用场景。 | 1 h |
| 5 | [The Bitter Lesson](../docs/data/cards/essay_bitter_lesson.md) | 关键质疑：Spike 路线是否会被 scale 直接淘汰？ | 15 min |
| 6 | [Mamba](../docs/data/cards/paper_mamba.md) | 另一种"线性复杂度 + 通用学习"的折中尝试。 | 30 min |
| 7 | **配套实验** | [`lab06`](../labs/lab06_spike_driven_attention_mnist.ipynb) — SDSA 与 vanilla attention 的乘法计数对比 | 1 h |

## 读完后的自检问题

1. 写出 SDSA 的 mask-and-add 公式，并和 scaled-dot-product attention 在每一步逐个对照。
2. 解释为何残差连接需要在脉冲驱动 transformer 中"移到激活之前"。
3. 画一张能耗 vs ImageNet top-1 的对比图：在同一坐标系里放 Spike-driven Transformer / DINOv3 ViT-S / DINOv3 ViT-L / vanilla ViT-B。
4. 用 200 字回答：在 Tesla / 理想 / NVIDIA Thor 这种"端侧算力暴涨"的趋势下，类脑路线的研究优先级是不是必然降低？

## 三篇延伸阅读

- [`Loihi 2 / Intel Neuromorphic`](https://www.intel.com/content/www/us/en/research/neuromorphic-computing.html)（神经形态硬件平台）
- [`Spikformer (Zhou 2022)`](https://arxiv.org/abs/2209.15425)（与 Spike-driven Transformer 同期）
- [`Direct Training of SNN`（综述）](https://arxiv.org/abs/2305.12387)
