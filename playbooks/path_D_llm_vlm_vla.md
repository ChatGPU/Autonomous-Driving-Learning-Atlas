# Path D · LLM · VLM · VLA 范式 / The LLM-VLM-VLA Wave

> **适合读者**：从 NLP / LLM / Agent 转切自动驾驶；或想理解为什么 2024–2026 年 *LLM-as-driver* 会成为论文流行。
> **预计时长**：~18 小时。
> **完成后你能**：解释 *VLM → VLA → reasoning VLA* 的演进路径；判断 [DiLu](../docs/data/cards/paper_2309.16292_dilu.md) / [Agent-Driver](../docs/data/cards/paper_2311.10813_agent_driver.md) / [DriveVLM](../docs/data/cards/paper_2402.12289_drivevlm.md) / [CF-VLA](../docs/data/cards/paper_2512.24426_cfvla.md) 各自属于哪个子范式；用 [`lab07`](../labs/lab07_dilu_llm_decision_loop.ipynb)–[`lab10`](../labs/lab10_cfvla_counterfactual_replanner.ipynb) 在自家电脑跑通最小 LLM-driver。

如果你从 LLM / Agent 背景进入自动驾驶，最容易低估的是“动作”这件事。会看图、会解释，还不等于能安全开车。这条路线会把你从 Transformer 和 GPT 的语言直觉，一步步带到 VLM 看图、VLA 输出 meta-action、再到 CF-VLA 在执行前做反事实自检。

## 推荐顺序

| # | 节点 | 重点 | 估时 |
|---|---|---|---|
| 1 | [3Blue1Brown · Attention/Transformers](../docs/data/cards/channel_3blue1brown.md) | 先用动画建立 attention 的空间直觉，再去读 VLM / VLA 会轻很多。 | 1 h |
| 2 | [Mu Li · GPT 1/2/3 精读](../docs/data/cards/channel_mu_li_bilibili.md) | 把 LLM 的"几个跨代跃迁"压成 1.5 小时。 | 1.5 h |
| 3 | [Transformer (Vaswani)](../docs/data/cards/paper_vaswani2017.md) + [GPT-3](../docs/data/cards/paper_gpt3.md) | 必读经典。 | 2 h |
| 4 | [LLaVA / Qwen-VL](../docs/data/cards/paper_llava.md) | 你将要"扛上车"的 backbone 候选。 | 30 min |
| 5 | [RLHF / DPO](../docs/data/cards/paper_rlhf_dpo.md) | 后训练范式；理解 CF-VLA 训练 pipeline 的前提。 | 1.5 h |
| 6 | [DiLu](../docs/data/cards/paper_2309.16292_dilu.md) → [Agent-Driver](../docs/data/cards/paper_2311.10813_agent_driver.md) → [DriveVLM](../docs/data/cards/paper_2402.12289_drivevlm.md) → [CF-VLA](../docs/data/cards/paper_2512.24426_cfvla.md) | **范式演进的四级跳**。 | 4 h |
| 7 | [GAIA-1](../docs/data/cards/paper_gaia1.md) + [DriveDreamer](../docs/data/cards/paper_drivedreamer.md) + [World Models](../docs/data/cards/paper_world_models.md) + [LINGO-2](../docs/data/cards/paper_lingo2.md) | 与 reasoning VLA 同期但走 world-model 这条路的对照组。 | 2 h |
| 8 | **配套实验** | [`lab07`](../labs/lab07_dilu_llm_decision_loop.ipynb) → [`lab08`](../labs/lab08_agent_driver_tool_calling.ipynb) → [`lab09`](../labs/lab09_drivevlm_dual_pipeline.ipynb) → [`lab10`](../labs/lab10_cfvla_counterfactual_replanner.ipynb) | 4 h |

## 读完后的自检问题

1. 用一张 4-列表格把 DiLu / Agent-Driver / DriveVLM / CF-VLA 的核心结构两两对比：*感知接口（图 vs JSON）/ 推理形式 / 训练 pipeline / 部署形态*。
2. 反事实推理（CF-VLA）和 world-model rollout（GAIA-1）在数学上各自是什么 *expectation over imagined futures*？
3. 当车端只有 Orin（≈ 254 TOPS INT8）能跑 7B 参数 Qwen-VL 量化版本，你会把哪些功能交给 VLA、哪些交给传统 IDM？参考 DriveVLM-Dual 的 split。
4. RLHF / DPO 与 CF-VLA 的 rollout-filter-label 在数据生成上有何相似？关键差异？

## 三篇延伸阅读

- [Toolformer (Schick 2023)](https://arxiv.org/abs/2302.04761)：tool use 的奠基论文。
- [InstructGPT (Ouyang 2022)](https://arxiv.org/abs/2203.02155)：RLHF 的工程化奠基。
- [OmniDrive-R1 (2025 H2)](https://developer.horizon.auto/blog/13247)：纯 RL 的 reasoning VLA 后续。
