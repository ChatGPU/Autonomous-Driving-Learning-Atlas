# Path B · 感知到端到端 AD / Perception → End-to-End

> **适合读者**：有 CV / 感知背景，要从"做检测分割"切换到"做整车规划"。
> **预计时长**：~22 小时。
> **完成后你能**：从 ViT/DETR 一路推到 UniAD/PlanT/DriveVLM/CF-VLA，并懂得在 *modular ↔ end-to-end × data-driven ↔ knowledge-driven* 二维地图上为新论文定位。

## 推荐顺序

| # | 节点 | 内容 / 重点 | 估时 |
|---|---|---|---|
| 1 | [3Blue1Brown · Attention 系列](../docs/data/cards/channel_3blue1brown.md) | Attention 的几何直觉。1 小时把"我懂 attention"升级到"我看见 attention"。 | 1 h |
| 2 | [Mu Li · Transformer / ViT 精读](../docs/data/cards/channel_mu_li_bilibili.md) | 把原文逐段在中文里再讲一遍，是后面一切论文的钥匙。 | 2 h |
| 3 | [Transformer (Vaswani 2017)](../docs/data/cards/paper_vaswani2017.md) + [ViT](../docs/data/cards/paper_vit.md) + [DETR](../docs/data/cards/paper_carion2020.md) | 三块基石。 | 3 h |
| 4 | [BEVFormer](../docs/data/cards/paper_li2022bevformer.md) | 把 ViT/DETR 的 query 提到 BEV，**UniAD 的实际感知前端**。 | 1.5 h |
| 5 | [DINOv2](../docs/data/cards/paper_dinov2.md) → [DINOv3](../docs/data/cards/paper_2508.10104_dinov3.md) | 现代视觉骨干，代替 ImageNet 监督的事实选项。 | 2 h |
| 6 | [UniAD](../docs/data/cards/paper_2212.10156_uniad.md) ←→ [PlanT](../docs/data/cards/paper_2210.14222_plant.md) | **本路径的第一个真正分歧点**：dense vs object-level。 | 3 h |
| 7 | [VADv2](../docs/data/cards/paper_vadv2.md) + [TransFuser](../docs/data/cards/paper_transfuser.md) | UniAD/PlanT 的两条延伸线。 | 1.5 h |
| 8 | [DriveVLM](../docs/data/cards/paper_2402.12289_drivevlm.md) → [CF-VLA](../docs/data/cards/paper_2512.24426_cfvla.md) | E2E 的 LLM/VLA 化与 self-reflection 化。 | 3 h |
| 9 | **配套实验** | [`lab03`](../labs/lab03_uniad_query_intuition.ipynb) UniAD query → [`lab04`](../labs/lab04_plant_object_level_planner.ipynb) PlanT → [`lab05`](../labs/lab05_dinov3_features_minidata.ipynb) DINOv3 → [`lab09`](../labs/lab09_drivevlm_dual_pipeline.ipynb) DriveVLM-Dual → [`lab10`](../labs/lab10_cfvla_counterfactual_replanner.ipynb) CF-VLA | 4 h |
| 10 | [AD benchmarks](../docs/data/cards/benchmarks_ad.md) | nuScenes / CARLA / NAVSIM / Bench2Drive 的差异 —— *指标不能跨基准比* | 30 min |

## 完成时的检查问题

1. 在 2×2 地图（modular↔E2E × data↔knowledge）上画出 UniAD、PlanT、DriveVLM、Agent-Driver、CF-VLA 的位置，并解释为什么。
2. UniAD 的 5 路 query 与 DETR 的 N 个 object query 是同一种东西吗？相同 / 不同各在哪里？
3. PlanT 的"对象级先验"在什么情境下会输给 dense BEV？什么情境下会赢？
4. CF-VLA 的 *meta-action → counterfactual → corrected meta-action* 与 RL 中的 *advantage estimation* 在结构上的相似性是什么？

## 三篇延伸阅读（Tier-A）

- [TransFuser](../docs/data/cards/paper_transfuser.md)：相机+LiDAR 多模态 BC。
- [GAIA-1](../docs/data/cards/paper_gaia1.md)：world-model 路线。
- [DriveDreamer](../docs/data/cards/paper_drivedreamer.md)：扩散世界模型。
