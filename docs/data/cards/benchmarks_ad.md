---
id: paper:ad_benchmarks
title: "CARLA · nuScenes · NAVSIM · Bench2Drive — AD benchmarks"
title_zh: "自动驾驶常用基准合集"
kind: paper
tier: B
authors: [various]
venue: "various"
year: 2017
topic: e2e_ad
phase: prereq
prereqs: []
extends: []
contrasts: []
parallel: []
contested_by: []
labs: []
deep_links:
  - {label: "CARLA", url: "https://carla.org/"}
  - {label: "nuScenes", url: "https://www.nuscenes.org/"}
  - {label: "NAVSIM", url: "https://github.com/autonomousvision/navsim"}
  - {label: "Bench2Drive", url: "https://github.com/Thinklab-SJTU/Bench2Drive"}
---

## TL;DR（3 行）
- **CARLA**：开源驾驶仿真器（Unreal Engine），[PlanT](paper_2210.14222_plant.md) / [TransFuser](paper_transfuser.md) 主战场。
- **nuScenes**：1000 段真实驾驶视频 + 标注，[UniAD](paper_2212.10156_uniad.md) / [DriveVLM](paper_2402.12289_drivevlm.md) / [Agent-Driver](paper_2311.10813_agent_driver.md) 都用它。
- **NAVSIM**：闭环 AD 评测新基准，2024 起渐成主流。
- **Bench2Drive**：基于 CARLA 的端到端规划评测；OmniDrive-R1 / MindDrive 等 2025 工作的依据。

读 spine 论文时，**先记住每篇用的是哪个 benchmark**，对比性能数字时不要跨基准比较。
