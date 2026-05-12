---
id: paper:rlhf_dpo
title: "RLHF & DPO — Aligning LLMs with Human Preferences"
title_zh: "RLHF / DPO：用人类偏好对齐 LLM"
kind: paper
tier: A
authors: [Christiano, P., et al. (RLHF 2017); Rafailov, R., Sharma, A., et al. (DPO 2023)]
venue: "NeurIPS 2017 / NeurIPS 2023"
year: 2023
topic: deep_rl
phase: core
prereqs: [paper:schulman2017_ppo]
extends: [paper:schulman2017_ppo]
contrasts: []
parallel: []
contested_by: []
labs: []
deep_links:
  - {label: "RLHF (Christiano 2017)", url: "https://arxiv.org/pdf/1706.03741"}
  - {label: "InstructGPT (Ouyang 2022)", url: "https://arxiv.org/pdf/2203.02155"}
  - {label: "DPO (Rafailov 2023)", url: "https://arxiv.org/pdf/2305.18290"}
bibtex: |
  @article{rafailov2023dpo,
    title  = {Direct Preference Optimization: Your Language Model is Secretly a Reward Model},
    author = {Rafailov, Rafael and Sharma, Archit and Mitchell, Eric and Manning, Christopher D. and Ermon, Stefano and Finn, Chelsea},
    journal= {NeurIPS},
    year   = {2023}
  }
---

## TL;DR
**RLHF**（Christiano '17）：用人类偏好对（"A 好于 B"）训一个 reward model，再用 PPO 微调 LLM。**DPO**（Rafailov '23）：把 reward modelling 和 PPO 合并成一个**封闭形式的对数似然目标**，去掉 PPO 训练循环，**显著简化** alignment pipeline。

## 与 spine 的交集
- 是 [GPT-3](paper_gpt3.md) 后续 InstructGPT / ChatGPT 的核心配方；
- 是 [CF-VLA](paper_2512.24426_cfvla.md) 等 VLA 后训练阶段的事实标准；
- 与 [PPO](paper_schulman2017_ppo.md) 共同构成 LLM 时代的 RL 主流栈。

## 数学锚点
DPO 损失（对每个偏好对 $y_w \succ y_l$）：
$$
\mathcal{L}_{\text{DPO}} = -\log\sigma\Big(\beta\log\frac{\pi_\theta(y_w|x)}{\pi_{\text{ref}}(y_w|x)} - \beta\log\frac{\pi_\theta(y_l|x)}{\pi_{\text{ref}}(y_l|x)}\Big)
$$

## 后续
- → [PPO](paper_schulman2017_ppo.md) · [GPT-3](paper_gpt3.md) · [CF-VLA](paper_2512.24426_cfvla.md)

## Bitter-Lesson 视角 / lens
RLHF / DPO 是 Bitter Lesson 与人类反馈之间的折中。它承认人很难手写完整奖励函数，于是只让人做更简单的比较，再把偏好交给模型学习。Sutton 会赞同“少写规则，多让系统从反馈中改进”；但也会提醒我们，人类偏好数据本身会带偏见，且奖励模型可能被策略钻空子。自动驾驶里的偏好学习尤其需要谨慎，因为“看起来合理”的语言解释不等于物理上安全的轨迹。
