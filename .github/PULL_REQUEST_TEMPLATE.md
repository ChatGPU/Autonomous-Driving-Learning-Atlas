# Pull Request

## 变更摘要 / Summary
（一两句话讲清这个 PR 的意图）

## 类型 / Type
- [ ] 新增 / 修改 spine 卡片
- [ ] 新增 / 修改 Tier-S/A/B 卡片
- [ ] 修改 `docs/data/graph.json`
- [ ] 修改 / 新增 lab notebook
- [ ] 修改交互站点（HTML/JS/CSS）
- [ ] 修文档 / Playbook / Concept Atlas
- [ ] CI / tooling

## 检查清单 / Checklist
- [ ] `python tools/validate_graph.py` 通过
- [ ] `python tools/check_links.py` 没有新出现的 404
- [ ] 所有改动到的 lab 在本地用 `LLM_BACKEND=mock` 跑过 `nbconvert --execute`
- [ ] 卡片新增 / 修改时同步更新了 `concepts.md` / playbook（如相关）
- [ ] 对外链接尽量是**深度锚**（PDF `#page=N`、YouTube `&t=Xs` 等）

## 备注 / Notes
（截图、性能数字、与 [`AGENTS.md`](../AGENTS.md) 的对照说明等）
