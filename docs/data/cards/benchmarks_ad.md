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

## 先抓住这件事
自动驾驶论文里的数字，只有放回 benchmark 语境里才有意义。CARLA、nuScenes、NAVSIM、Bench2Drive 看起来都在评“会不会开车”，实际上它们问的是不同问题：仿真能不能闭环避险？真实日志上能不能预测轨迹？planner 的输出能不能经受规则化测试？

## 四个常见坐标
- **CARLA**：开源驾驶仿真器（Unreal Engine）。[PlanT](paper_2210.14222_plant.md) / [TransFuser](paper_transfuser.md) 常在这里做闭环驾驶，因为它允许模型真的“开出去”并承担后果。
- **nuScenes**：1000 段真实驾驶视频 + 3D 标注。[UniAD](paper_2212.10156_uniad.md)、[DriveVLM](paper_2402.12289_drivevlm.md)、[Agent-Driver](paper_2311.10813_agent_driver.md) 都借它来评估感知、预测和规划。
- **NAVSIM**：更强调规划闭环的新基准，2024 起逐渐成为端到端规划论文的共同语言。
- **Bench2Drive**：基于 CARLA 的端到端规划评测，把路线完成率、安全性、交通规则等因素放进同一套测试。

## 读论文时怎么用
先问三个问题：

1. 这篇论文是在**开环日志**上预测，还是在**闭环仿真**里真的执行？
2. 指标衡量的是 perception、prediction、planning，还是整车任务完成？
3. 作者有没有把不同 benchmark 的数字直接横向比较？如果有，要非常小心。

## Bitter-Lesson 视角 / lens
Benchmark 也是一种人工先验：它决定了什么叫“进步”。Bitter Lesson 提醒我们，长期胜出的往往是能从更大、更真实、更多样的数据中学习的系统；但在自动驾驶里，没有 benchmark，研究就会失去可复现坐标。更健康的做法不是迷信某一个榜单，而是把 CARLA、nuScenes、NAVSIM、Bench2Drive 看成几束不同角度的灯：每束灯只能照出系统的一部分。

## 接下来读什么
- → [UniAD](paper_2212.10156_uniad.md)：看 nuScenes 上的端到端统一建模。
- → [PlanT](paper_2210.14222_plant.md)：看 CARLA 闭环里对象级 planner 的优势。
- → [DriveVLM](paper_2402.12289_drivevlm.md)：看 VLM 路线如何处理长尾场景。
