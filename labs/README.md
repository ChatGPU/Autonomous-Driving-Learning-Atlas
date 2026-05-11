# Labs / 实验合集

> 本目录包含 11 个 Jupyter notebook，每一个都对应主仓库知识图谱里的一个节点。
> CI（`.github/workflows/labs_smoke.yml`）每次推送都会用 **`LLM_BACKEND=mock`** 端到端跑完所有 notebook，全绿才合并。所以"全部跑通"不是一句话，是一个事实。

## 环境

```bash
python -m pip install -r labs/requirements.txt
# 可选：要用真实 LLM
pip install openai transformers accelerate
```

CPU 即可跑完所有 lab；GPU 仅会让 lab02、lab03、lab04 略快。预计单 lab < 5 分钟。

## 索引

| Lab | 节点 | 核心论证 |
|---|---|---|
| [`lab00`](lab00_environment_check.ipynb) | env | 检查 numpy/torch/highway-env/llm_provider 是否就位 |
| [`lab01`](lab01_zhao_value_iteration_gridworld.ipynb) | [Zhao RL](../docs/data/cards/course_zhao_shiyu_rl.md) | 4×4 stochastic gridworld 上的值迭代收敛 |
| [`lab02`](lab02_cs285_bc_vs_dagger_minicar.ipynb) | [CS285 / DAgger](../docs/data/cards/course_cs285_levine.md) | BC 在分布外崩溃；DAgger 修复 |
| [`lab03`](lab03_uniad_query_intuition.ipynb) | [UniAD](../docs/data/cards/paper_2212.10156_uniad.md) | 6 个 query 共享 BEV → 联合检测 + 规划 |
| [`lab04`](lab04_plant_object_level_planner.ipynb) | [PlanT](../docs/data/cards/paper_2210.14222_plant.md) | 对象级 transformer 规划 + attention 可解释性 |
| [`lab05`](lab05_dinov3_features_minidata.ipynb) | [DINOv3](../docs/data/cards/paper_2508.10104_dinov3.md) | 用现成视觉特征做 mini 检测 (CI 用 ResNet18 兜底) |
| [`lab06`](lab06_spike_driven_attention_mnist.ipynb) | [Spike-driven Transformer](../docs/data/cards/paper_2307.01694_spike_driven_transformer.md) | SDSA 与 vanilla self-attention 的乘法计数对比 |
| [`lab07`](lab07_dilu_llm_decision_loop.ipynb) | [DiLu](../docs/data/cards/paper_2309.16292_dilu.md) | HighwayEnv + LLM (Mock) 决策 + 反思 + memory |
| [`lab08`](lab08_agent_driver_tool_calling.ipynb) | [Agent-Driver](../docs/data/cards/paper_2311.10813_agent_driver.md) | LLM tool calling on mock perception JSON |
| [`lab09`](lab09_drivevlm_dual_pipeline.ipynb) | [DriveVLM](../docs/data/cards/paper_2402.12289_drivevlm.md) | 慢 VLM (Mock) + 快 IDM planner 双系统 |
| [`lab10`](lab10_cfvla_counterfactual_replanner.ipynb) | [CF-VLA](../docs/data/cards/paper_2512.24426_cfvla.md) | meta-action → 反事实模拟 → 修正 |

## LLM 后端切换

所有需要 LLM 的 lab 走 `labs/llm_provider.py` 的统一接口。

```bash
# 离线（默认）
LLM_BACKEND=mock      python -m jupyter notebook

# 真实 LLM
LLM_BACKEND=openai    OPENAI_API_KEY=sk-...     OPENAI_MODEL=gpt-4o-mini   ...
LLM_BACKEND=ollama    OLLAMA_MODEL=qwen2.5:3b   ...    # 需 `ollama serve`
LLM_BACKEND=hf        HF_TOKEN=hf_...           HF_MODEL=Qwen/Qwen2.5-7B-Instruct ...
```

Mock 后端不是"乱说"——它内置一个轻量规则化驾驶员，所以 lab07–10 即使离线也会输出有意义的 meta-action / tool calls / counterfactuals。
