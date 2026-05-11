# Autonomous-Driving Learning Atlas
> 自动驾驶学习地图 — 一个以**交互知识图谱**为核心、面向博士级研究者的、中英双语的机器学习 / 强化学习 / 自动驾驶**入门-进阶-前沿**学习地图。

[![Pages](https://github.com/ChatGPU/Autonomous-Driving-Learning-Atlas/actions/workflows/pages.yml/badge.svg)](https://github.com/ChatGPU/Autonomous-Driving-Learning-Atlas/actions/workflows/pages.yml)
[![Validate](https://github.com/ChatGPU/Autonomous-Driving-Learning-Atlas/actions/workflows/validate.yml/badge.svg)](https://github.com/ChatGPU/Autonomous-Driving-Learning-Atlas/actions/workflows/validate.yml)
[![Labs smoke](https://github.com/ChatGPU/Autonomous-Driving-Learning-Atlas/actions/workflows/labs_smoke.yml/badge.svg)](https://github.com/ChatGPU/Autonomous-Driving-Learning-Atlas/actions/workflows/labs_smoke.yml)
[![License: MIT (code)](https://img.shields.io/badge/code-MIT-blue.svg)](LICENSE)
[![License: CC BY 4.0 (prose)](https://img.shields.io/badge/prose-CC%20BY%204.0-lightgrey.svg)](LICENSE-CC)

🌐 **Live atlas**：<https://chatgpu.github.io/Autonomous-Driving-Learning-Atlas/>

<p align="center">
  <img src="docs/assets/2x2_map.svg" width="640" alt="2x2 map of AD research paradigms"/>
</p>
<p align="center"><em>研究范式 2×2 地图：所有 spine 论文按 (modular ↔ E2E) × (data ↔ knowledge-driven) 摆位。</em></p>

---

## 这是什么 / What is this

一个针对**已具备 ML/CV 基础的自动驾驶研究者 / 博士生**整理的、可交互的**学习地图**。它不是论文列表、不是综述、不是教程合集；它做三件事：

1. **画出研究范式的全景图。** 把 8 篇论文 + 3 个视频频道 + 2 门课 + 1 篇 Sutton 的短文（共 14 个 spine 节点），加上 ≈ 28 个**祖师爷 / 平行 / 压缩级**节点，在一张可交互的知识图谱里按 *拓扑 / 时间轴 / playbook* 三种视图组织起来。
2. **每个节点配一张深度阅读卡片。** 每张卡片包含 *TL;DR · 数学锚点 · 架构直觉 · 工程实现 · 深度链接（PDF 页内锚 + 视频时间戳）· Bitter-Lesson 视角*，最大程度减少"再去 Google 一遍"的成本。
3. **每篇主线论文配一份可跑通的 lab。** 11 个 Jupyter 笔记本，CI 每次推送都会用 `Mock` 后端跑一遍，全绿才算"全部跑通"。涉及 LLM/VLM 的 lab 通过统一 `llm_provider.py` 抽象支持 OpenAI / Ollama / HF / Mock 四种后端。

> **风格定位**：客观中立、专业但克制、有明确启发。每张卡片只在 *Bitter-Lesson 视角* 一节明确表态。

---

## 90 秒上手 / Quickstart

1. **打开交互地图** → <https://chatgpu.github.io/Autonomous-Driving-Learning-Atlas/>
2. **挑一条 playbook**（按你已有背景）：

   | 你的背景 | 推荐路径 |
   |---|---|
   | 数学好但没碰过 RL | [Path A — 强化学习从零](playbooks/path_A_rl_from_scratch.md) |
   | CV / 感知出身，要转 E2E AD | [Path B — 感知到端到端](playbooks/path_B_perception_to_e2e.md) |
   | 关心能效 / 类脑 / 部署 | [Path C — 类脑 & 高效 AD](playbooks/path_C_brain_inspired_efficient.md) |
   | LLM / VLM / Agent 切入 AD | [Path D — LLM·VLM·VLA 范式](playbooks/path_D_llm_vlm_vla.md) |

3. **跑配套 lab**：`pip install -r labs/requirements.txt` 后打开对应 notebook。所有 lab 默认用 **Mock LLM 后端**离线可跑；想用真实 LLM 时把环境变量 `LLM_BACKEND` 切成 `openai` / `ollama` / `hf` 即可。

> 一键云端：本仓库带 `.devcontainer`，[在 GitHub Codespaces 打开](https://codespaces.new/ChatGPU/Autonomous-Driving-Learning-Atlas) 即得到预装环境的 JupyterLab。每个 lab 顶部都有 *Open in Colab* 链接。

---

## 为什么要做成图，而不是列表 / Why a graph

研究范式的真正难点不在"哪些论文要读"，而在"**它们彼此什么关系**"。本图谱把关系做成一等公民：

- **prereq**（先修） · **covers**（讲解） · **extends**（扩展） · **parallel**（平行） · **contrasts**（争锋） · **feeds**（喂入） · **implements**（lab 实现）

这样你能：

- 用 *playbook 预设* 一键看清"我这条路要走过的最短子图"；
- 用 *年份滑条* 把 2017→2026 的研究范式变迁播成一段 6 秒的"小电影"；
- 用 *compare 模式*（Shift-click 任意两节点）把两个方法的卡片并排对照；
- 用 *永久链接* `?node=...&tab=math&playbook=B` 把任意一刻的状态分享给同事。

<p align="center">
  <img src="docs/assets/timeline_2017_2026.svg" width="720" alt="paradigm timeline 2017-2026"/>
</p>

---

## 资源分级 / Resource tiers

| Tier | 角色 | 视觉权重 | 卡片深度 |
|---|---|---|---|
| **Spine** | 用户提供的 14 项核心资料 | 厚边框、满色 | 完整模板（9 节） |
| **Tier-S** | 祖师爷级 / 行业必看（Transformer、ViT、DETR、ResNet、GPT-3、PPO、DQN、DAgger、AlphaZero、BEVFormer 等） | 中厚边框 | 完整模板 |
| **Tier-A** | 平行创新 / 关键启发（VADv2、TransFuser、LLaVA、GAIA-1、DriveDreamer、DINOv2、SAM、Sutton-Barto、RLHF/DPO 等） | 中等边框 | 精简模板（4 节，聚焦交集） |
| **Tier-B** | 联系较弱但提供宏观坐标（Mamba、Diffuser、CARLA/nuScenes/NAVSIM/Bench2Drive、LINGO-2、Tesla AI Day 等） | 细边框 | 3 行 stub |

完整节点目录详见 [`concepts.md`](concepts.md) 与 `docs/data/graph.json`。

---

## 仓库结构 / Repo layout

```
Autonomous-Driving-Learning-Atlas/
├── README.md / AGENTS.md / LICENSE / LICENSE-CC / CITATION.cff
├── docs/                   # GitHub-Pages 根目录（交互站点）
│   ├── index.html · app.js · style.css
│   ├── compare.js · timeline.js
│   └── data/
│       ├── graph.json · schema.json
│       └── cards/          # 60+ 张研究卡片
├── concepts.md             # ~30 个原子概念表
├── playbooks/              # Path A / B / C / D
├── labs/                   # 11 个完全可跑的 Jupyter lab
│   ├── llm_provider.py     # OpenAI / Ollama / HF / Mock 四后端
│   └── lab00 ... lab10
├── tools/                  # graph 校验、deep-link 检查、SVG 生成
└── .github/workflows/      # Pages 部署 · graph 校验 · lab 冒烟
```

---

## 贡献 / Contributing

- 修补深度链接、补充新概念、加 lab 都欢迎，请走 PR；CI 会校验图谱完整性 & lab 可跑性。
- 在 [Discussions](https://github.com/ChatGPU/Autonomous-Driving-Learning-Atlas/discussions) 里提议要新增的论文或 playbook。

## 引用 / Citation

学术使用请参考 [`CITATION.cff`](CITATION.cff)；代码 MIT、文字 CC BY 4.0。

---

> *本图谱建立在 14 项一手资源之上，并以"祖师爷 / 平行 / 压缩"三档扩展周围节点。每条边都试图回答一个问题：*这两件事到底什么关系？
