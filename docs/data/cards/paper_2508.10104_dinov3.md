---
id: paper:2508.10104
title: "DINOv3"
title_zh: "DINOv3：自监督视觉基础模型的新一代里程碑"
kind: paper
tier: spine
authors: [Siméoni, O., Vo, H. V., Seitzer, M., Baldassarre, F., Oquab, M., Jose, C., Khalidov, V., Szafraniec, M., Yi, S., et al.]
venue: "Meta AI Research, 2025 (technical report)"
year: 2025
topic: ssl_vision
phase: frontier
prereqs: [paper:vit, paper:dinov2, concept:ssl, concept:transformer]
extends: [paper:dinov2]
contrasts: [paper:2307.01694]
parallel: [paper:sam]
contested_by: []
labs: [lab05]
deep_links:
  - {label: "PDF p.1（摘要）", url: "https://arxiv.org/pdf/2508.10104#page=1"}
  - {label: "PDF p.5 §3（Gram anchoring 关键创新）", url: "https://arxiv.org/pdf/2508.10104#page=5"}
  - {label: "PDF p.8 §4（数据规模 + 模型规模）", url: "https://arxiv.org/pdf/2508.10104#page=8"}
  - {label: "PDF p.15 §6（dense feature 任务全面对比）", url: "https://arxiv.org/pdf/2508.10104#page=15"}
  - {label: "facebookresearch/dinov3", url: "https://github.com/facebookresearch/dinov3"}
  - {label: "HuggingFace 权重", url: "https://huggingface.co/facebook/dinov3-vitl16-pretrain-lvd1689m"}
bibtex: |
  @article{simeoni2025dinov3,
    title  = {DINOv3},
    author = {Sim{\'e}oni, Oriane and Vo, Huy V. and Seitzer, Maximilian and Baldassarre, Federico and Oquab, Maxime and Jose, Cijo and Khalidov, Vasil and Szafraniec, Marc and Yi, Seungeun and others},
    journal= {arXiv preprint arXiv:2508.10104},
    year   = {2025}
  }
---

## TL;DR
DINOv3 是 Meta SSL 视觉基础模型 *DINO 家族*的第三代：扩大数据 + 模型规模、改进训练策略、并提出 **Gram anchoring** 解决长训练日程下 dense feature 退化的老问题。结果是**在不微调**的前提下，dense feature 在分类、分割、深度、对应、检索全面 SOTA，**直接成为下游 AD 感知的最佳现成 backbone**。

## 位置 / Why it matters
在自动驾驶里，[UniAD](paper_2212.10156_uniad.md)、[DriveVLM](paper_2402.12289_drivevlm.md)、[CF-VLA](paper_2512.24426_cfvla.md) 几乎都需要一个**强视觉编码器**喂入；过去多用 EVA / CLIP / DINOv2，现在 DINOv3 是默认替换品。它和 [Spike-driven Transformer](paper_2307.01694_spike_driven_transformer.md) 是"上 vs 下"两条路线（scale-up 通用 vs scale-down 高效）。

## 数学锚点 / Math anchor
DINO 的 SSL 核心是**自蒸馏**：
$$
\mathcal{L}_{\text{DINO}} = -\sum_{x_q,x_k \in \text{views}(I)}\; p_t(x_k)^\top \log p_s(x_q)
$$
- $p_s$ 学生网络（梯度更新）；
- $p_t$ 教师网络（学生的 EMA）；
- views 是不同 augmentation 后的同一张图，强迫学生在不同视角下输出一致 distribution。

**Gram anchoring**（DINOv3 的核心新意）：训练长程下 dense feature 出现"塌缩"，作者引入对每个 patch token 的 Gram-matrix 约束（与 backbone-frozen 的早期检查点相比），强制 dense feature 几何不退化：
$$
\mathcal{L}_{\text{Gram}} = \big\|\,G(F_{\text{cur}}) - G(F_{\text{anchor}})\,\big\|_F^2
$$
其中 $G(F) = F F^\top$ 是 patch features 的 Gram matrix。

直觉：*Gram matrix* 编码了 patch 之间的**两两关系几何**。锚定它就锚定了"学到的视觉空间结构"，避免在 self-distillation 长训中漂移。

## 架构 / Architectural intuition
- **数据**：作者花了大量篇幅描述 *LVD-1689M*（1.7B 图像），并强调 curation > raw scale；
- **模型**：ViT-S/16, ViT-B/16, ViT-L/16, ViT-H+/16 一整套；
- **训练**：双视图 + 多视图 + EMA teacher，加 Gram anchoring；
- **Post-hoc**：分辨率适配、对齐 text encoder、模型蒸馏到更小尺寸。

> 物理直觉：DINO 系列的想法是"我不告诉你这是猫还是狗，但同一张图的两个角度应当被你映射到附近的向量上"。Gram anchoring 是"附近"的几何形状不许走样。

## 工程 / Engineering notes
- Repo: [`facebookresearch/dinov3`](https://github.com/facebookresearch/dinov3)。HF 上有 `facebook/dinov3-*` 权重直接加载。
- 推理：dense feature shape `[B, num_patches, d]`；做检测时通常接 DPT-style decoder 或 DETR-style head。
- 在 nuScenes 等 AD 任务上：用 ViT-S/16 + linear probe 已经能在车辆 ROI 上取得不错性能；本图谱 [lab05](../../../labs/lab05_dinov3_features_minidata.ipynb) 在打包好的 200 帧 mini 数据上验证。
- License：CC BY-NC 4.0（学术可用，商用受限）。
- Gotchas：HF 加载需 `transformers>=4.43`；patch tokens 数量与图像分辨率耦合，若做 BEV 任务需注意对齐。

## 深度阅读路径 / Deep-anchored reading order
1. **PDF p.1 摘要 + p.2 §1**——为何要做 v3，与 v2 的核心差距是什么。
2. **PDF p.5 §3 Gram anchoring**——核心新意；公式简单，思想最值得学。
3. **PDF p.8 §4 数据 + 模型缩放**——*scale 真的有用*的证据；这是 [Bitter Lesson](essay_bitter_lesson.md) 的最佳现代例证。
4. **PDF p.15 §6**——下游 dense 任务大表，关注 "ADE-Eval" / "depth" / "correspondence"，AD 感知最关心这几个。
5. **PDF p.20 附录 A 训练配方**——若你打算自训。

## Bitter-Lesson 视角 / lens
*DINOv3 是 Bitter Lesson 在 2025 年的**教科书证据**：少量人工先验（augmentation、Gram anchoring 这一项几何约束），剩下全部交给数据 + 算力。它和 [Spike-driven Transformer](paper_2307.01694_spike_driven_transformer.md) 形成最尖锐的张力——后者在挑战"必须 scale 计算"的物理可行性。对自动驾驶研究者：DINOv3 是云端 / 训练时的最佳起点，Spike 系列是车端 / 推理时的最长期赌注。*

## 后续节点 / Suggested next nodes
- → [DINOv2](paper_dinov2.md) ：直接前身
- → [SAM](paper_sam.md) ：另一种视觉基础模型路线
- → [UniAD (2212.10156)](paper_2212.10156_uniad.md) ：可作为感知 backbone
- → [Spike-driven Transformer](paper_2307.01694_spike_driven_transformer.md) ：相反极端
- → [`concept:ssl`](../../concepts.md)

## 配套实验 / Lab
[`labs/lab05_dinov3_features_minidata.ipynb`](../../../labs/lab05_dinov3_features_minidata.ipynb) — 加载 HuggingFace `facebook/dinov3-vits16` 提取 dense feature；用 200 帧 mini 数据训练一个 linear probe 检测车辆 ROI；对比 ImageNet-supervised ViT 的特征。
