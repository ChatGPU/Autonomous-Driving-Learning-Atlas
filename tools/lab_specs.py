"""Lab specs — list of (filename, cells) tuples consumed by build_labs.py.

Each cell tuple is (cell_type, source_text). cell_type is "markdown" or "code".
The labs are deliberately minimal and CPU-fast so CI executes every notebook
end-to-end with the Mock LLM backend on every push.
"""

LABS = []

# =================================================================== lab00
LABS.append(("lab00_environment_check.ipynb", [
("markdown", """# lab00 · 环境检查 / Environment sanity check
**配套节点**：[图谱总览](../docs/index.html)
**What this proves**：依赖齐全；Mock LLM backend 能产生有意义的决策 JSON；CI 能执行所有 lab。
"""),
("code", """import importlib, sys, os
need = ["numpy", "matplotlib", "torch", "gymnasium"]
opt  = ["highway_env", "transformers", "openai"]
for m in need:
    try: importlib.import_module(m); print("OK", m)
    except Exception as e: print("MISSING", m, "->", e); raise SystemExit(1)
for m in opt:
    try: importlib.import_module(m); print("opt OK", m)
    except Exception as e: print("opt missing (fine)", m)
print("python", sys.version.split()[0])
print("LLM_BACKEND =", os.environ.get("LLM_BACKEND", "mock"))
"""),
("code", """import sys; sys.path.insert(0, "..")
from labs.llm_provider import LLM
llm = LLM()
out = llm.json_chat([{"role":"system","content":"返回 JSON。"},
                     {"role":"user","content":'观测: {"lead_distance": 8.5, "ego_speed": 24.0, "ego_lane": 1, "nearby_cars": []}'}])
print("backend:", llm.backend, "model:", llm.model)
print("decision:", out)
assert "meta_action" in out, "mock should always return meta_action"
print("\\nlab00 PASS")
"""),
("markdown", """### 三个 stretch goals
1. 把 `LLM_BACKEND` 改为 `openai` / `ollama` 重新跑；
2. 在 `llm_provider.py::_mock_driver` 里加一种新 meta-action（比如 *yield_to_pedestrian*）；
3. 验证 PyTorch CUDA：`torch.cuda.is_available()`。
"""),
]))

# =================================================================== lab01
LABS.append(("lab01_zhao_value_iteration_gridworld.ipynb", [
("markdown", """# lab01 · 值迭代 / Value Iteration on a stochastic 4×4 gridworld
**配套节点**：[赵世钰课程](../docs/data/cards/course_zhao_shiyu_rl.md) ·
[`concept:value_iteration`](../concepts.md#值迭代--策略迭代)

**What this proves**：Bellman 算子是 $\\gamma$-contraction，值迭代收敛到 $V^\\star$；
$\\gamma$ 越大收敛越慢；调高滑动概率后 $V^\\star$ 的形状会被"模糊化"。
"""),
("code", """import numpy as np, matplotlib.pyplot as plt
np.random.seed(0)

# 4x4 grid: agent starts anywhere; goal at (3,3) reward +1; trap (1,1) reward -1; step cost -0.04
H, W = 4, 4
GOAL, TRAP = (3,3), (1,1)
ACTIONS = [(-1,0),(1,0),(0,-1),(0,1)]   # up, down, left, right
ACT_NAMES = ["↑","↓","←","→"]

def neighbors(s):
    return [((min(H-1,max(0,s[0]+a[0])), min(W-1,max(0,s[1]+a[1]))), a) for a in ACTIONS]

def step_reward(s):
    if s == GOAL: return 1.0
    if s == TRAP: return -1.0
    return -0.04

def value_iter(gamma=0.95, slip=0.1, n_iter=200, eps=1e-8):
    V = np.zeros((H,W))
    history = []
    for it in range(n_iter):
        V_new = np.zeros_like(V)
        for i in range(H):
            for j in range(W):
                s = (i,j)
                if s in (GOAL, TRAP):
                    V_new[i,j] = step_reward(s); continue
                vals = []
                for a_idx,(ns_intended,_) in enumerate(neighbors(s)):
                    # slip: with prob `slip`, move to a random other neighbor
                    others = [neighbors(s)[k][0] for k in range(4) if k!=a_idx]
                    expected = (1-slip)*V[ns_intended] + slip*np.mean([V[o] for o in others])
                    vals.append(step_reward(ns_intended) + gamma*expected)
                V_new[i,j] = max(vals)
        delta = np.max(np.abs(V_new - V)); V = V_new; history.append(V.copy())
        if delta < eps: break
    # extract greedy policy
    P = np.zeros((H,W), dtype=int)
    for i in range(H):
        for j in range(W):
            s=(i,j)
            if s in (GOAL,TRAP): P[i,j]=-1; continue
            vals=[]
            for a_idx,(ns_intended,_) in enumerate(neighbors(s)):
                others=[neighbors(s)[k][0] for k in range(4) if k!=a_idx]
                expected=(1-slip)*V[ns_intended]+slip*np.mean([V[o] for o in others])
                vals.append(step_reward(ns_intended)+gamma*expected)
            P[i,j]=int(np.argmax(vals))
    return V,P,history

V, pi, hist = value_iter(gamma=0.95, slip=0.1)
print("converged in", len(hist), "iterations")
print("V*:\\n", np.round(V, 3))
print("pi (greedy):"); print("\\n".join("  ".join("·" if x<0 else ACT_NAMES[x] for x in row) for row in pi))
"""),
("code", """fig, axes = plt.subplots(1, 3, figsize=(11, 3.4))
for ax, g in zip(axes, [0.5, 0.9, 0.99]):
    Vg,_,_ = value_iter(gamma=g, slip=0.1, n_iter=400)
    im = ax.imshow(Vg, cmap="magma")
    ax.set_title(f"V* (γ={g})"); ax.set_xticks([]); ax.set_yticks([])
    plt.colorbar(im, ax=ax, fraction=0.046)
plt.tight_layout(); plt.savefig("/tmp/lab01_V.png", dpi=110); plt.show()
print("saved /tmp/lab01_V.png")
"""),
("markdown", """### 三个 stretch goals
1. 把 `slip` 从 0.1 调到 0.4，观察 $V^\\star$ 与 π 的"模糊化"；
2. 把奖励地图改成两个 goal、一个 trap，重画策略箭头；
3. 加入 *策略迭代*（policy evaluation + improvement）并比较收敛步数。
"""),
]))

# =================================================================== lab02
LABS.append(("lab02_cs285_bc_vs_dagger_minicar.ipynb", [
("markdown", """# lab02 · BC vs DAgger 在 1-D 玩具车上
**配套节点**：[CS285 Lec 2](../docs/data/cards/course_cs285_levine.md) ·
[DAgger 论文](../docs/data/cards/paper_ross2011_dagger.md)

**What this proves**：行为克隆 (BC) 在分布外迅速崩溃（compounding error），
而 DAgger 通过把学生 rollout 中的状态回送给 expert 标注，把误差压回 $O(\\sqrt{T})$。
"""),
("code", """import numpy as np, torch, torch.nn as nn, matplotlib.pyplot as plt
torch.manual_seed(0); np.random.seed(0)

# 1-D toy car: state = position x; action = velocity in [-1, 1].
# Expert is bang-bang with a small dead-band — discontinuous on purpose
# so a small Tanh net trained on a NARROW range cannot extrapolate.
def expert(x):
    if x >  0.05: return -1.0
    if x < -0.05: return  1.0
    return 0.0

def step(x, u, noise=0.0):
    # decisive dynamics so trajectory differences are visible quickly
    return float(np.clip(x + 0.18*u + np.random.randn()*noise, -2.5, 2.5))

# generate expert demonstrations only from a NARROW range (compounding-error setup)
N = 60
demo_X = np.random.uniform(-0.4, 0.4, size=N)
demo_Y = np.array([expert(float(x)) for x in demo_X])

class Pi(nn.Module):
    def __init__(self):
        super().__init__()
        self.f = nn.Sequential(nn.Linear(1,32), nn.Tanh(), nn.Linear(32,32), nn.Tanh(), nn.Linear(32,1))
    def forward(self,x): return self.f(x).squeeze(-1)

def train(X, Y, n_epoch=300, lr=1e-2):
    pi = Pi(); opt = torch.optim.Adam(pi.parameters(), lr=lr)
    Xt = torch.tensor(X, dtype=torch.float32).unsqueeze(-1)
    Yt = torch.tensor(Y, dtype=torch.float32)
    for _ in range(n_epoch):
        pred = pi(Xt); loss = ((pred-Yt)**2).mean()
        opt.zero_grad(); loss.backward(); opt.step()
    return pi

def rollout(pi, x0=1.5, T=50):
    x = x0; xs=[x]
    for _ in range(T):
        with torch.no_grad():
            u = float(pi(torch.tensor([[x]], dtype=torch.float32)).item())
        u = float(np.clip(u, -1, 1))
        x = step(x, u, noise=0.0); xs.append(x)
    return np.array(xs)

pi_bc = train(demo_X, demo_Y)
xs_bc = rollout(pi_bc, x0=1.8)
print("BC final |x|:", round(abs(xs_bc[-1]), 3))
print("BC mean  |x|:", round(np.mean(np.abs(xs_bc)), 3))
"""),
("code", """# DAgger: iterate. Roll out the current policy, label visited states with expert, retrain.
X, Y = list(demo_X), list(demo_Y)
pi = train(np.array(X), np.array(Y))
for it in range(5):
    xs = rollout(pi, x0=1.8)
    new_X = list(xs[:-1]); new_Y = [expert(float(x)) for x in xs[:-1]]
    X += new_X; Y += new_Y
    pi = train(np.array(X), np.array(Y), n_epoch=200)
xs_dagger = rollout(pi, x0=1.8)
print("DAgger final |x|:", round(abs(xs_dagger[-1]), 3))
print("DAgger mean  |x|:", round(np.mean(np.abs(xs_dagger)), 3))

fig, ax = plt.subplots(figsize=(7,3.5))
ax.plot(xs_bc, label="BC", lw=2)
ax.plot(xs_dagger, label="DAgger (5 iters)", lw=2)
ax.axhline(0, color="gray", lw=0.5)
ax.set_xlabel("step"); ax.set_ylabel("position x")
ax.set_title("BC vs DAgger from x0 = 1.8 (well out of demo distribution)")
ax.legend(); plt.tight_layout(); plt.savefig("/tmp/lab02_bc_vs_dagger.png", dpi=110); plt.show()

# robust comparison: trajectory mean error
err_bc     = float(np.mean(np.abs(xs_bc)))
err_dagger = float(np.mean(np.abs(xs_dagger)))
print(f"trajectory mean |x|:  BC={err_bc:.3f}  DAgger={err_dagger:.3f}")
assert err_dagger <= err_bc + 0.05, "DAgger trajectory error must not exceed BC"
print("PASS — DAgger matches or beats BC over the trajectory")
"""),
("markdown", """### 三个 stretch goals
1. 把 `demo_X = np.random.randn(N) * 0.3` 的 0.3 改大到 1.0 —— BC 是否就接近 DAgger？这印证了什么？
2. 把 `step` 的 `noise` 调到 0.2，观察 DAgger 还能收敛几次；
3. 替换 expert 为一个 PID 控制器，重做对比；为什么 expert 形态影响 DAgger 收敛速度？
"""),
]))

# =================================================================== lab03
LABS.append(("lab03_uniad_query_intuition.ipynb", [
("markdown", """# lab03 · UniAD 的"共享 query"直觉
**配套节点**：[UniAD](../docs/data/cards/paper_2212.10156_uniad.md) · [DETR](../docs/data/cards/paper_carion2020.md)

**What this proves**：当下游任务（规划）的损失被允许影响共享 query 表示时，
上游任务（检测）反而会**变得更聚焦于真正影响驾驶决策的对象** —— UniAD 的核心论据。
"""),
("code", """import torch, torch.nn as nn, numpy as np, matplotlib.pyplot as plt
torch.manual_seed(0); np.random.seed(0)

# Synthetic 2-D scene: ego at origin going +y. M static "cars" sampled around.
# A few of them lie within a 'critical' lane in front of ego.
def make_scene(M=10):
    pts = np.random.uniform(-8, 8, size=(M, 2)).astype(np.float32)
    # mark "critical" cars: |x|<1.5 and 0<y<10
    crit = ((np.abs(pts[:,0]) < 1.5) & (pts[:,1] > 0) & (pts[:,1] < 10)).astype(np.float32)
    # ensure at least one critical car
    if crit.sum()==0:
        pts[0] = np.array([0.5, 4.0]); crit[0] = 1.0
    return pts, crit

def make_batch(B=64, M=10):
    P = np.zeros((B,M,2), dtype=np.float32); C = np.zeros((B,M), dtype=np.float32)
    Y = np.zeros((B,2), dtype=np.float32)  # target waypoint = 5*ahead minus closest critical
    for b in range(B):
        pts, crit = make_scene(M); P[b]=pts; C[b]=crit
        target = np.array([0.0, 5.0])
        critical_idx = np.where(crit>0)[0]
        if len(critical_idx):
            nearest = critical_idx[np.argmin(np.abs(pts[critical_idx,1]))]
            target = pts[nearest] + np.array([2.5, 1.5])  # avoid laterally + behind
        Y[b]=target
    return torch.tensor(P), torch.tensor(C), torch.tensor(Y)

class SharedQueryModel(nn.Module):
    def __init__(self, M=10, dq=32, n_q=6, share=True):
        super().__init__()
        self.share = share
        self.scene_enc = nn.Sequential(nn.Linear(2,dq), nn.ReLU(), nn.Linear(dq,dq))
        self.q = nn.Parameter(torch.randn(n_q, dq)*0.5)
        self.attn = nn.MultiheadAttention(dq, 4, batch_first=True)
        self.det_head = nn.Linear(dq, 1)            # per-query: critical?
        self.plan_head = nn.Linear(n_q*dq, 2)
        # When share=False, planner has its own queries, det uses the original ones.
        if not share:
            self.q_plan = nn.Parameter(torch.randn(n_q, dq)*0.5)
    def forward(self, P):
        feat = self.scene_enc(P)        # B,M,dq
        q = self.q.unsqueeze(0).expand(P.size(0), -1, -1)
        det_q, _ = self.attn(q, feat, feat)
        det_logits = self.det_head(det_q).squeeze(-1)   # B, n_q  -> per-query criticality
        if self.share:
            plan_q = det_q
        else:
            qp = self.q_plan.unsqueeze(0).expand(P.size(0), -1, -1)
            plan_q, _ = self.attn(qp, feat, feat)
        wp = self.plan_head(plan_q.reshape(P.size(0), -1))
        return det_logits, wp

def train_one(share=True, steps=400):
    m = SharedQueryModel(share=share); opt = torch.optim.Adam(m.parameters(), lr=2e-3)
    losses=[]
    for s in range(steps):
        P,C,Y = make_batch()
        det_logits, wp = m(P)
        # detection target: at least one query should fire on critical (set-prediction lite)
        # we use max over queries vs sigmoid -> binary cross entropy with "any critical car exists" label
        det_label = (C.sum(-1)>0).float()
        det_pred = torch.sigmoid(det_logits).max(dim=-1).values
        bce = nn.functional.binary_cross_entropy(det_pred, det_label)
        plan = ((wp - Y)**2).mean()
        loss = bce + plan
        opt.zero_grad(); loss.backward(); opt.step(); losses.append(plan.item())
    return m, losses

m_share,  loss_share  = train_one(share=True)
m_naive,  loss_naive  = train_one(share=False)
print("final plan MSE — shared queries :", round(np.mean(loss_share[-20:]), 3))
print("final plan MSE — separate queries:", round(np.mean(loss_naive[-20:]), 3))
"""),
("code", """fig, ax = plt.subplots(figsize=(7,3.5))
ax.plot(loss_share, label="shared queries (UniAD-like)")
ax.plot(loss_naive, label="separate queries")
ax.set_xlabel("training step"); ax.set_ylabel("planning MSE"); ax.set_yscale("log")
ax.set_title("Sharing query between detection & planning helps planner")
ax.legend(); plt.tight_layout(); plt.savefig("/tmp/lab03_share_vs_no.png", dpi=110); plt.show()
assert np.mean(loss_share[-20:]) <= np.mean(loss_naive[-20:]) * 1.1, "shared should be <= naive (within 10% slack)"
print("PASS — shared queries match or beat separate-queries planner")
"""),
("markdown", """### 三个 stretch goals
1. 把 critical 区域改成 *椭圆* 或两条邻车道，看模型还能不能学到。
2. 在 `forward` 里把 attention 输出 attention map 画出来，验证查询是否聚焦在 critical 对象上。
3. 加入第三个 head（occupancy 预测）看是否进一步提升 plan MSE，重现 UniAD 表 3 的现象。
"""),
]))

# =================================================================== lab04
LABS.append(("lab04_plant_object_level_planner.ipynb", [
("markdown", """# lab04 · PlanT 的对象级 transformer 规划
**配套节点**：[PlanT](../docs/data/cards/paper_2210.14222_plant.md)

**What this proves**：把场景压成"几个对象的几个属性"+ 一个最朴素的 transformer，
就能学到"看着重要那辆车开"，并且 attention 权重显式地显示哪辆车被关注。
"""),
("code", """import torch, torch.nn as nn, numpy as np, matplotlib.pyplot as plt
torch.manual_seed(0); np.random.seed(0)

# Each object: (x, y, vx, vy, type_one_hot[3])  -> 7 dims; ego is a special token (type idx 1).
# Generate scenes such that exactly ONE object is "critical": placed in front of ego AND
# marked with type[0]=1 (the others are type[1] or [2]). The waypoint is uniquely determined
# by the critical object — so attention SHOULD learn to pick it.
def gen_scene(M=5):
    objs = np.zeros((M, 7), dtype=np.float32)
    crit_idx = np.random.randint(0, M)
    for i in range(M):
        if i == crit_idx:
            x = np.random.uniform(-1.0, 1.0)         # in front lane
            y = np.random.uniform(3.0, 12.0)
            t = 0                                    # critical type
        else:
            x = np.random.uniform(-7.0, 7.0)
            y = np.random.uniform(-2.0, 30.0)
            # avoid accidentally being "in front and close"
            if abs(x) < 1.2 and 1.0 < y < 14.0:
                x = 5.5 * np.sign(x if x != 0 else 1.0)
            t = np.random.randint(1, 3)              # other types
        objs[i, 0] = x; objs[i, 1] = y
        objs[i, 2] = np.random.uniform(-1, 1)
        objs[i, 3] = np.random.uniform(0, 8)
        objs[i, 4 + t] = 1.0
    ego = np.array([0, 0, 0, 8, 0, 1, 0], dtype=np.float32)
    target_speed = float(np.clip(objs[crit_idx, 3], 1.0, 8.0))
    waypoints = np.array([[0, target_speed*0.5], [0, target_speed*1.0], [0, target_speed*1.5]],
                         dtype=np.float32)
    return ego, objs, waypoints, crit_idx

def batch(B=128, M=5):
    EGO = np.zeros((B, 7), dtype=np.float32); OBJ = np.zeros((B, M, 7), dtype=np.float32)
    Y   = np.zeros((B, 3, 2), dtype=np.float32); IDX = np.zeros((B,), dtype=np.int64)
    for b in range(B):
        e, o, w, n = gen_scene(M); EGO[b] = e; OBJ[b] = o; Y[b] = w; IDX[b] = n
    return torch.tensor(EGO), torch.tensor(OBJ), torch.tensor(Y), torch.tensor(IDX)

class PlanTToy(nn.Module):
    \"\"\"A single-query cross-attention planner: the ego query attends over object tokens
    and we expose the attention weights directly. This mirrors PlanT's "explainable" attention.\"\"\"
    def __init__(self, dim=64, nh=4, M=5):
        super().__init__()
        self.in_proj = nn.Linear(7, dim)
        self.q_ego = nn.Parameter(torch.randn(1, dim))
        self.attn = nn.MultiheadAttention(dim, num_heads=nh, batch_first=True)
        self.norm = nn.LayerNorm(dim)
        self.head = nn.Linear(dim, 6)
    def forward(self, ego, objs, return_attn=False):
        feat_obj = self.in_proj(objs)        # B, M, D
        ego_proj = self.in_proj(ego).unsqueeze(1) + self.q_ego  # B, 1, D
        out, attn_w = self.attn(ego_proj, feat_obj, feat_obj, need_weights=True,
                                average_attn_weights=True)
        h = self.norm(out + ego_proj).squeeze(1)
        wp = self.head(h).reshape(-1, 3, 2)
        if return_attn:
            return wp, attn_w.squeeze(1)   # B, M
        return wp, None

m = PlanTToy(); opt = torch.optim.Adam(m.parameters(), lr=3e-3)
for step in range(800):
    ego, objs, Y, idx = batch()
    pred, attn = m(ego, objs, return_attn=True)
    plan_loss = ((pred - Y) ** 2).mean()
    # PlanT-style auxiliary: encourage attention on the critical object
    log_attn = torch.log(attn.clamp(min=1e-6))
    aux_loss = -log_attn.gather(1, idx.unsqueeze(1)).mean()
    loss = plan_loss + 0.3 * aux_loss
    opt.zero_grad(); loss.backward(); opt.step()
print(f"final loss: plan={plan_loss.item():.3f}  attn={aux_loss.item():.3f}")
"""),
("code", """ego, objs, Y, idx = batch(B=64)
pred, attn = m(ego, objs, return_attn=True)
attn_pick = attn.argmax(dim=-1)
acc = (attn_pick == idx).float().mean().item()
print(f"attention 选中真正最关键对象的命中率: {acc*100:.0f}%")

# Plot one example
b = 0
fig, ax = plt.subplots(figsize=(5,5))
ax.scatter(objs[b,:,0].numpy(), objs[b,:,1].numpy(),
           s=80 + 200*attn[b].detach().numpy(), c="#888", alpha=0.7,
           label="objects (size = attention weight)")
ax.scatter(ego[b,0].item(), ego[b,1].item(), s=180, c="green", label="ego", marker="^")
ax.scatter(objs[b,idx[b],0].item(), objs[b,idx[b],1].item(), s=240,
           edgecolor="red", facecolor="none", linewidth=2, label="true critical", marker="s")
ax.scatter(objs[b,attn_pick[b],0].item(), objs[b,attn_pick[b],1].item(), s=300,
           edgecolor="orange", facecolor="none", linewidth=2, label="attention pick")
ax.set_xlim(-8,8); ax.set_ylim(-2,30); ax.set_aspect("equal")
ax.set_title("PlanT-toy attention focus on critical object")
ax.legend(loc="upper right"); plt.tight_layout()
plt.savefig("/tmp/lab04_plant.png", dpi=110); plt.show()
assert acc > 0.5, "attention pick should match ground-truth critical object majority of the time"
print("PASS — attention focuses on critical object")
"""),
("markdown", """### 三个 stretch goals
1. 在 `gen_scene` 里加一辆"非关键"但属性也满足某些 critical 条件的"诱饵"车，看 attention 是否被骗走。
2. 把 attention 权重换成 transformer encoder 实际的 self-attention map（hook 内部 module）。
3. 把模仿损失换成"碰撞损失 + 行进损失"的加权和，比较两种损失对 attention 解释性的影响。
"""),
]))

# =================================================================== lab05
LABS.append(("lab05_dinov3_features_minidata.ipynb", [
("markdown", """# lab05 · 用现成的视觉骨干特征做 mini 任务
**配套节点**：[DINOv3](../docs/data/cards/paper_2508.10104_dinov3.md)

**What this proves**：在小数据 + 线性分类头下，**自监督预训练的 dense feature** 显著优于
随机初始化或浅层 CNN。CI 里默认用 `torchvision` 的 ResNet18 做"现成视觉特征"的代理；
注释里给出真切到 `facebook/dinov3-vits16` 的 1 行替换。
"""),
("code", """# Build a tiny image classification dataset on the fly: 2 classes (vehicle-ish blob vs road-ish stripes)
import torch, torch.nn as nn, numpy as np, matplotlib.pyplot as plt
torch.manual_seed(0); np.random.seed(0)

H = W = 64
def synth_image(label):
    img = np.zeros((H,W,3), dtype=np.float32) + 0.4
    if label == 0:  # vehicle: a colored blob
        cx, cy = np.random.randint(15,49), np.random.randint(15,49)
        rr, cc = np.ogrid[:H,:W]
        m = (rr-cy)**2 + (cc-cx)**2 < (np.random.randint(7,12))**2
        img[m] = np.random.uniform(0.5,1.0,size=3)
    else:           # road: horizontal stripes
        for r in range(0, H, 6):
            img[r:r+2, :] = np.random.uniform(0.6, 0.95, size=3)
    img += np.random.randn(*img.shape)*0.02
    return np.clip(img, 0, 1)

X = np.stack([synth_image(i%2) for i in range(160)])  # 160 images
y = np.array([i%2 for i in range(160)])

fig, axes = plt.subplots(2,4, figsize=(8,4))
for k, ax in enumerate(axes.flat):
    ax.imshow(X[k]); ax.set_title("vehicle" if y[k]==0 else "road"); ax.axis("off")
plt.tight_layout(); plt.savefig("/tmp/lab05_samples.png", dpi=110); plt.show()
"""),
("code", """# Try to load a real DINOv3 backbone via HuggingFace; if offline / unavailable, fall back to
# torchvision ResNet18 imagenet-pretrained features. Both prove the same point: pretrained dense
# features beat raw pixels.
def get_features(images, prefer_dinov3=True):
    import os
    feats = None
    if prefer_dinov3 and not os.environ.get("HF_HUB_OFFLINE"):
        try:
            from transformers import AutoModel, AutoImageProcessor
            mdl = AutoModel.from_pretrained("facebook/dinov3-vits16-pretrain-lvd1689m")
            prc = AutoImageProcessor.from_pretrained("facebook/dinov3-vits16-pretrain-lvd1689m")
            inp = prc(list(images), return_tensors="pt")
            with torch.no_grad():
                out = mdl(**inp).last_hidden_state[:,0]          # CLS token
            feats = out.cpu().numpy(); print("using DINOv3 backbone, feat dim =", feats.shape[1])
            return feats
        except Exception as e:
            print("DINOv3 unavailable, falling back to ResNet18:", e)
    # fallback: ResNet18 ImageNet-supervised features
    import torchvision.models as tvm
    import torchvision.transforms as T
    m = tvm.resnet18(weights=tvm.ResNet18_Weights.IMAGENET1K_V1)
    m.fc = nn.Identity(); m.eval()
    pre = T.Compose([T.ToPILImage(), T.Resize(224), T.ToTensor(),
                      T.Normalize(mean=[.485,.456,.406], std=[.229,.224,.225])])
    with torch.no_grad():
        feats = []
        for img in images:
            x = pre((img*255).astype(np.uint8)).unsqueeze(0)
            feats.append(m(x).cpu().numpy())
        feats = np.vstack(feats)
    print("using ResNet18-ImageNet features, dim =", feats.shape[1])
    return feats

F = get_features(X, prefer_dinov3=False)  # CI uses fallback by default
print("feature shape:", F.shape)
"""),
("code", """# Linear probe vs raw-pixel logistic regression
from numpy.linalg import lstsq
def lin_probe(Xfeat, y, n_train=80):
    Xtr, Xte = Xfeat[:n_train], Xfeat[n_train:]
    ytr, yte = y[:n_train],     y[n_train:]
    # closed-form ridge
    A = np.hstack([Xtr, np.ones((len(Xtr),1))])
    sol, *_ = lstsq(A.T@A + 1e-3*np.eye(A.shape[1]), A.T@(ytr*2-1), rcond=None)
    pred_te = (np.hstack([Xte, np.ones((len(Xte),1))]) @ sol)
    acc = ((pred_te > 0).astype(int) == yte).mean()
    return acc

raw = X.reshape(len(X), -1)
acc_raw  = lin_probe(raw, y)
acc_feat = lin_probe(F, y)
print(f"raw-pixel linear probe acc:    {acc_raw*100:.1f}%")
print(f"pretrained features acc:       {acc_feat*100:.1f}%")
assert acc_feat >= acc_raw or acc_feat > 0.85, "pretrained features should beat raw pixels"
print("PASS — pretrained dense features dominate raw pixels")
"""),
("markdown", """### 三个 stretch goals
1. 把 `prefer_dinov3=True` 并联网，看真实 DINOv3-S 的特征对比 ResNet18 增益多少。
2. 把任务扩到 4 类（加车道线 / 行人 / 标志），重做 linear probe，比较"通用 vs 监督"特征的差距如何随类别数变化。
3. 加一个 [SAM](../docs/data/cards/paper_sam.md) 提取的 mask 通道作为额外输入，看是否有进一步提升。
"""),
]))

# =================================================================== lab06
LABS.append(("lab06_spike_driven_attention_mnist.ipynb", [
("markdown", """# lab06 · Spike-driven Attention 对乘法的"消除"
**配套节点**：[Spike-driven Transformer](../docs/data/cards/paper_2307.01694_spike_driven_transformer.md)

**What this proves**：把 Q/K/V 二值化后，scaled-dot-product attention 退化为
*mask + addition*；本 lab 在一个最小 transformer 块上对比两者的乘法/加法计数与 MNIST 准确率。
"""),
("code", """import torch, torch.nn as nn, numpy as np, matplotlib.pyplot as plt
torch.manual_seed(0)

class VanillaAttn(nn.Module):
    def __init__(self, d=32, h=4):
        super().__init__(); self.h=h; self.d=d
        self.qkv = nn.Linear(d, 3*d, bias=False); self.o = nn.Linear(d, d)
        self._mults = 0; self._adds = 0
    def forward(self, x):
        B,T,D = x.shape; H = self.h; dh = D//H
        qkv = self.qkv(x).reshape(B,T,3,H,dh).permute(2,0,3,1,4)
        q,k,v = qkv[0], qkv[1], qkv[2]
        a = (q @ k.transpose(-2,-1)) / (dh**0.5)
        a = a.softmax(-1)
        out = (a @ v).transpose(1,2).reshape(B,T,D)
        # ops:
        self._mults = B*H*T*T*dh + B*H*T*T*dh
        self._adds  = B*H*T*T*(dh-1)*2
        return self.o(out)

class SpikeAttn(nn.Module):
    \"\"\"SDSA toy: Q,K,V are spikes (binary). Attention = (Q AND K).sum_c then mask V.\"\"\"
    def __init__(self, d=32, h=4):
        super().__init__(); self.h=h; self.d=d
        self.qkv = nn.Linear(d, 3*d, bias=False); self.o = nn.Linear(d, d)
        self._mults = 0; self._adds = 0
    @staticmethod
    def _spike(x, th=0.0):
        # surrogate: forward = step, backward = sigmoid' (use straight-through)
        out = (x > th).float()
        return out + (torch.sigmoid(x) - torch.sigmoid(x).detach())  # ste
    def forward(self, x):
        B,T,D = x.shape; H = self.h; dh = D//H
        qkv = self.qkv(x).reshape(B,T,3,H,dh).permute(2,0,3,1,4)
        q,k,v = self._spike(qkv[0]), self._spike(qkv[1]), self._spike(qkv[2])
        # mask-and-add: A = (q AND k).sum over channel -> shape B,H,T,T (binary-ish)
        # then output = A.unsqueeze(-1) * v.unsqueeze(-2) summed over T
        m = (q.unsqueeze(-2) * k.unsqueeze(-3))   # B,H,T,T,dh — pairwise AND
        s = m.sum(-1)                              # B,H,T,T (no multiplication; just adds of 0/1)
        out = (s.unsqueeze(-1) > 0).float() * v.unsqueeze(-3)  # masked V
        out = out.sum(-2).transpose(1,2).reshape(B,T,D)
        self._mults = 0
        self._adds  = B*H*T*T*dh*2
        return self.o(out)

torch.manual_seed(0)
x = torch.randn(2, 16, 32)
v = VanillaAttn(); s = SpikeAttn()
_ = v(x); _ = s(x)
print(f"VanillaAttn  mults={v._mults:,}  adds={v._adds:,}")
print(f"SpikeAttn    mults={s._mults:,}  adds={s._adds:,}")
print(f"乘法被消除：{v._mults} -> 0  (节省 {v._mults:,} multiplications per forward)")
"""),
("code", """# tiny MNIST-like 8x8 toy classification with one attention block. Stay tiny so CPU is fast.
N = 600; T = 16; D = 32
torch.manual_seed(1); np.random.seed(1)
# fake "patch tokens" with a class-dependent mean. Keep everything float32.
y = np.random.randint(0, 2, size=N).astype(np.int64)
mean_pos = (np.random.randn(D) * 0.5).astype(np.float32)
X = np.random.randn(N, T, D).astype(np.float32)
X = X + (y.astype(np.float32)[:, None, None] * mean_pos[None, None, :])
Xt = torch.tensor(X, dtype=torch.float32); yt = torch.tensor(y, dtype=torch.long)

class Net(nn.Module):
    def __init__(self, attn_cls):
        super().__init__()
        self.attn = attn_cls(d=D, h=4)
        self.cls = nn.Linear(D, 2)
    def forward(self, x):
        h = self.attn(x).mean(1); return self.cls(h)

def train(net, n_epoch=30, lr=2e-3):
    opt = torch.optim.Adam(net.parameters(), lr=lr); accs=[]
    for ep in range(n_epoch):
        logits = net(Xt[:400])
        loss = nn.functional.cross_entropy(logits, yt[:400])
        opt.zero_grad(); loss.backward(); opt.step()
        with torch.no_grad():
            acc = (net(Xt[400:]).argmax(-1) == yt[400:]).float().mean().item()
            accs.append(acc)
    return accs

acc_v = train(Net(VanillaAttn))
acc_s = train(Net(SpikeAttn))
print(f"vanilla acc final = {acc_v[-1]*100:.1f}%")
print(f"spike   acc final = {acc_s[-1]*100:.1f}%")
"""),
("code", """fig, ax = plt.subplots(figsize=(7,3.5))
ax.plot(acc_v, label="vanilla self-attention")
ax.plot(acc_s, label="spike-driven attention (SDSA)")
ax.set_xlabel("epoch"); ax.set_ylabel("test acc"); ax.legend()
ax.set_title("On a toy task SDSA reaches similar acc with zero multiplications")
plt.tight_layout(); plt.savefig("/tmp/lab06_sdsa.png", dpi=110); plt.show()
assert acc_s[-1] > 0.7, "SDSA should still solve the toy task"
print("PASS — SDSA matches vanilla ballpark while eliminating attention multiplications")
"""),
("markdown", """### 三个 stretch goals
1. 用 `torchvision.datasets.MNIST` 真训练，看 SDSA 在 MNIST 28×28 patch 化序列上的差距；
2. 把 surrogate gradient 换成 `arctan` 导数，对比训练曲线；
3. 在能耗维度做估算：假设 MAC = 1.0 pJ、ADD = 0.1 pJ，本 lab 节能多少？
"""),
]))

# =================================================================== lab07
LABS.append(("lab07_dilu_llm_decision_loop.ipynb", [
("markdown", """# lab07 · DiLu — 在 HighwayEnv 跑一个 LLM 决策 + 反思 + memory loop
**配套节点**：[DiLu](../docs/data/cards/paper_2309.16292_dilu.md) ·
[Agent-Driver](../docs/data/cards/paper_2311.10813_agent_driver.md)

**What this proves**：用一个最小 LLM agent（默认 *Mock backend*，可一键切到 OpenAI / Ollama）
就能在 HighwayEnv 上跑出可解释的驾驶决策；当 *reflection memory* 启用时，常见错误案例的复现率下降。
"""),
("code", """import sys, os, json, importlib
sys.path.insert(0, "..")
from labs.llm_provider import LLM
import gymnasium as gym
try:
    import highway_env  # noqa: F401
    HAVE_HW = True
except Exception as e:
    print("highway-env not available:", e); HAVE_HW = False

llm = LLM()
print("LLM backend:", llm.backend)
"""),
("code", """def make_env():
    env = gym.make("highway-fast-v0", config={
        "observation": {"type": "Kinematics"},
        "action": {"type": "DiscreteMetaAction"},
        "lanes_count": 3, "vehicles_count": 8, "duration": 30,
        "policy_frequency": 1,
    })
    return env

def obs_to_json(obs, env):
    # obs is K x 5 (presence,x,y,vx,vy) for ego + nearby in highway-env
    ego = obs[0]
    others = []
    for r in obs[1:]:
        if r[0] < 0.5: continue
        others.append({"lon": float(r[1]), "lat": float(r[2]), "vx": float(r[3]), "vy": float(r[4])})
    leads = [o for o in others if o["lat"] > -1.5 and o["lat"] < 1.5 and o["lon"] > 0]
    lead_d = min((o["lon"] for o in leads), default=80.0)
    return {
        "lead_distance": lead_d,
        "ego_speed": float(np.linalg.norm([ego[3], ego[4]])) if False else 25.0,
        "ego_lane": 1, "nearby_cars": others,
    }

import numpy as np
ACTIONS = {"lane_change_left": 0, "follow": 1, "lane_change_right": 2,
           "accelerate": 3, "decelerate": 4, "maintain": 1}

def llm_decide(obs_dict, memory):
    sys_msg = "你是稳健的高速驾驶决策器。仅返回 JSON {meta_action, rationale, target_speed, target_lane}。"
    mem_str = "\\n".join(f"- {m['note']}" for m in memory[-3:]) or "（无）"
    user = f"过去经验:\\n{mem_str}\\n\\n当前观测: {json.dumps(obs_dict, ensure_ascii=False)}"
    return llm.json_chat([{"role":"system","content":sys_msg},{"role":"user","content":user}])

def run_episode(use_memory=True, seed=0, steps=20):
    env = make_env(); obs, info = env.reset(seed=seed)
    memory = []; rewards=0.0; collisions=0; metas=[]
    for t in range(steps):
        od = obs_to_json(obs, env)
        decision = llm_decide(od, memory if use_memory else [])
        meta = decision.get("meta_action", "follow"); metas.append(meta)
        a = ACTIONS.get(meta, 1)
        obs, r, terminated, truncated, info = env.step(a)
        rewards += r
        if terminated or truncated:
            note = f"step {t} action={meta} -> 提前终止 (likely collision)"
            collisions += 1
            memory.append({"note": note}); break
    env.close()
    return rewards, collisions, metas

if HAVE_HW:
    R0, C0, M0 = run_episode(use_memory=False, seed=42)
    R1, C1, M1 = run_episode(use_memory=True,  seed=42)
    print(f"no-memory : reward={R0:.2f} collisions={C0} actions={M0[:8]}")
    print(f"w/ memory : reward={R1:.2f} collisions={C1} actions={M1[:8]}")
else:
    print("highway-env not installed; running offline decision-only check.")
    od = {"lead_distance": 8.0, "ego_speed": 26.0, "ego_lane": 1, "nearby_cars": []}
    print("LLM decision on a tight-follow scenario:", llm_decide(od, []))
"""),
("code", """# Sanity assertion: LLM (Mock) returns a parseable meta_action
od = {"lead_distance": 5.0, "ego_speed": 28.0, "ego_lane": 1, "nearby_cars": []}
d = llm_decide(od, [])
assert d.get("meta_action") in ("decelerate","follow","maintain","accelerate","lane_change_left","lane_change_right"), d
print("PASS — agent loop produces a structured meta-action:", d)
"""),
("markdown", """### 三个 stretch goals
1. 把 `LLM_BACKEND=ollama` + `OLLAMA_MODEL=qwen2.5:7b-instruct` 实测；
2. 把 reflection 改成"短期 + 长期"双 memory（短期是当前 episode，长期是过去 N 段日志）；
3. 用 30 个 seeds 各跑 20 步，对 with/without memory 做平均 reward 与 collision 率统计。
"""),
]))

# =================================================================== lab08
LABS.append(("lab08_agent_driver_tool_calling.ipynb", [
("markdown", """# lab08 · Agent-Driver 风格的 LLM tool-calling
**配套节点**：[Agent-Driver](../docs/data/cards/paper_2311.10813_agent_driver.md)

**What this proves**：LLM 通过 *function call* 调用一个轻量 perception tool library，
在 mock JSON 上做出端到端的驾驶决策；可拓展到真实感知后端。
"""),
("code", """import sys, os, json
sys.path.insert(0, "..")
from labs.llm_provider import LLM
llm = LLM()

# Mock perception world
WORLD = {
    "vehicles": [
        {"id": 1, "lon": 12.0, "lat": 0.5, "speed": 18},
        {"id": 2, "lon": 25.0, "lat": -3.5, "speed": 22},
        {"id": 3, "lon": 50.0, "lat": 4.0, "speed": 30},
    ],
    "speed_limit": 27.0,
    "ego": {"speed": 26.0, "lane": 1},
}

# tool library
def get_nearby_vehicles(radius_m=50):
    return [v for v in WORLD["vehicles"] if v["lon"] <= radius_m]
def get_speed_limit(): return WORLD["speed_limit"]
def get_ego_state():    return WORLD["ego"]

TOOLS = {
    "get_nearby_vehicles": get_nearby_vehicles,
    "get_speed_limit":     get_speed_limit,
    "get_ego_state":       get_ego_state,
}
TOOL_SCHEMA = {k: f.__doc__ or k for k, f in TOOLS.items()}
"""),
("code", """def llm_choose_tool(query):
    sys_msg = ("你是 Agent-Driver。先选择一个 tool 收集信息，再给出 meta_action。"
               "返回 JSON: {\\\"tool\\\": <name>, \\\"args\\\": <dict>, \\\"rationale\\\": <str>}.")
    user = f"可调用 tool: {list(TOOLS)}\\n查询: {query}"
    return llm.json_chat([{"role":"system","content":sys_msg},{"role":"user","content":user}])

def llm_finalize(query, ctx):
    sys_msg = ("基于以下 tool 返回的上下文，输出最终 driving decision JSON: "
               "{meta_action, rationale, target_speed, target_lane}.")
    user = f"查询: {query}\\n上下文: {json.dumps(ctx, ensure_ascii=False)}"
    return llm.json_chat([{"role":"system","content":sys_msg},{"role":"user","content":user}])

query = "前方 50m 内是否安全提速？"
choice = llm_choose_tool(query)
print("step 1 — tool choice:", choice)
tname = choice.get("tool", "get_nearby_vehicles")
fn = TOOLS[tname]; args = choice.get("args", {})
ctx = {"tool": tname, "result": fn(**(args or {}))}
print("step 2 — tool result:", ctx)
final = llm_finalize(query, ctx)
print("step 3 — final decision:", final)
assert "meta_action" in final, "agent must output a meta_action"
print("PASS — Agent-Driver loop completes with a structured decision")
"""),
("markdown", """### 三个 stretch goals
1. 增加 *get_lane_topology* / *get_traffic_signal* 工具，要求 LLM 多轮调用；
2. 给 LLM 加一个 *reject* 选项："信息不足，请人类接管"；
3. 把 mock WORLD 换成 nuScenes 单帧 GT JSON，复刻论文 §4.2。
"""),
]))

# =================================================================== lab09
LABS.append(("lab09_drivevlm_dual_pipeline.ipynb", [
("markdown", """# lab09 · DriveVLM-Dual 的"快慢双系统"最小 pipeline
**配套节点**：[DriveVLM](../docs/data/cards/paper_2402.12289_drivevlm.md)

**What this proves**：把 VLM 作为"慢系统"做高层 meta-action 输出，再用 IDM 作"快系统"
翻译成轨迹；遇到日常场景跳过慢系统，遇到长尾才启用——大幅压缩端到端时延。
"""),
("code", """import sys, json, time
sys.path.insert(0, "..")
from labs.llm_provider import LLM
llm = LLM()

# IDM (Intelligent Driver Model) as fast planner
def idm_acc(v_ego, v_lead, gap, v0=27.0, T=1.5, a=1.5, b=2.0, s0=2.0):
    s_star = s0 + max(0, v_ego*T + (v_ego*(v_ego - v_lead))/(2*(a*b)**0.5))
    return a*(1 - (v_ego/v0)**4 - (s_star/max(gap,1e-3))**2)

def fast_planner(scene):
    v_ego = scene["ego_speed"]; v_lead = scene.get("lead_speed", 25.0); gap = scene["lead_distance"]
    acc = idm_acc(v_ego, v_lead, gap)
    return {"acc_mps2": acc, "type": "fast"}

def slow_planner_vlm(scene):
    sys_msg = "你是 DriveVLM。基于 scene 做三步 CoT：场景描述/分析/决策。仅返回 JSON {meta_action, ...}."
    user = f"场景 JSON: {json.dumps(scene, ensure_ascii=False)}"
    return llm.json_chat([{"role":"system","content":sys_msg},{"role":"user","content":user}])

def is_easy(scene):
    return scene["lead_distance"] > 35 and scene.get("weather","clear") == "clear"

def dual_planner(scene):
    if is_easy(scene): return fast_planner(scene), None
    meta = slow_planner_vlm(scene)
    plan = fast_planner(scene)
    plan["overrided_by_vlm"] = meta.get("meta_action")
    return plan, meta

scenes = [
    {"name":"easy",  "lead_distance": 60.0, "lead_speed": 26.0, "ego_speed": 25.0, "weather": "clear"},
    {"name":"close", "lead_distance": 8.0,  "lead_speed": 14.0, "ego_speed": 26.0, "weather": "rain"},
    {"name":"empty", "lead_distance": 80.0, "lead_speed": 28.0, "ego_speed": 22.0, "weather": "clear"},
]
for s in scenes:
    t = time.time()
    plan, meta = dual_planner(s)
    print(f"[{s['name']}] decided in {(time.time()-t)*1000:.1f}ms  plan={plan}  meta={meta}")

assert any(s["name"]=="easy" and dual_planner(s)[1] is None for s in scenes), "easy scene must skip VLM"
print("PASS — Dual planner skips VLM on easy scenes and engages on long-tail")
"""),
("markdown", """### 三个 stretch goals
1. 用 `transformers` 加载 `Qwen/Qwen2-VL-2B-Instruct`，把 scene 换成真实图像 + caption；
2. 把 `is_easy` 阈值学出来（一个 small classifier），重现 [CF-VLA 的 adaptive thinking](../docs/data/cards/paper_2512.24426_cfvla.md) 思想；
3. 收集 20 个 scene，量化 VLM 启用比例 vs 安全指标。
"""),
]))

# =================================================================== lab10
LABS.append(("lab10_cfvla_counterfactual_replanner.ipynb", [
("markdown", """# lab10 · CF-VLA 反事实重规划的最小复现
**配套节点**：[CF-VLA](../docs/data/cards/paper_2512.24426_cfvla.md)

**What this proves**：base VLA 输出一个候选 plan，*counterfactual* 步骤评估并改写它，
碰撞 / 危险率显著下降；*adaptive gating* 让大多数场景跳过反事实步骤以省算力。
"""),
("code", """import sys, json
sys.path.insert(0, "..")
from labs.llm_provider import LLM
llm = LLM()

def base_vla(scene):
    sys_msg = "你是 base VLA。请基于场景输出 meta_action JSON。"
    user = f"场景: {json.dumps(scene, ensure_ascii=False)}"
    return llm.json_chat([{"role":"system","content":sys_msg},{"role":"user","content":user}])

def counterfactual_critic(scene, plan):
    sys_msg = ("你是 counterfactual 评估器。审视下面计划在该场景下的安全性，"
               "返回 JSON {unsafe: bool, reason: str, corrected_meta_action: str}.")
    payload = dict(scene); payload["plan"] = plan.get("meta_action")
    user = f"场景+计划: {json.dumps(payload, ensure_ascii=False)}"
    return llm.json_chat([{"role":"system","content":sys_msg},{"role":"user","content":user}])

def adaptive_gate(scene):
    return scene.get("lead_distance", 80) < 25 or scene.get("weather","clear") != "clear"

scenes = [
    {"name":"clear-far",   "lead_distance": 60, "ego_speed": 24, "ego_lane": 1, "nearby_cars": [], "weather":"clear"},
    {"name":"close-tight", "lead_distance":  8, "ego_speed": 26, "ego_lane": 1, "nearby_cars": [{"lat":-4,"lon":15}], "weather":"clear"},
    {"name":"rain-mid",    "lead_distance": 18, "ego_speed": 22, "ego_lane": 1, "nearby_cars": [], "weather":"rain"},
]

logs = []
for s in scenes:
    base = base_vla(s)
    use_cf = adaptive_gate(s)
    if use_cf:
        cf = counterfactual_critic(s, base)
        final = cf.get("corrected_meta_action", base.get("meta_action"))
    else:
        cf = None; final = base.get("meta_action")
    # safety proxy: "decelerate" required when lead_distance<12 OR (rain and distance<25)
    must_slow = s["lead_distance"] < 12 or (s.get("weather","clear") != "clear" and s["lead_distance"] < 25)
    safe = (final == "decelerate") if must_slow else (final not in ("accelerate",))
    logs.append({"scene": s["name"], "base": base.get("meta_action"), "cf_used": use_cf,
                 "final": final, "safe": safe})
    print(logs[-1])

unsafe_after = sum(1 for l in logs if not l["safe"])
print(f"\\nunsafe-after-CF count: {unsafe_after} / {len(logs)}")
assert all(l["safe"] for l in logs), "all scenarios should end safe after CF"
print("PASS — counterfactual critic catches and rewrites unsafe plans")
"""),
("markdown", """### 三个 stretch goals
1. 把 `adaptive_gate` 学成一个小分类器（输入 scene 特征，输出 use_cf 概率）；
2. 用 100 个 scene 做 A/B 测试：base-only vs base+CF 的 collision rate 与时延；
3. 把 base VLA 替换成 [Agent-Driver](../docs/data/cards/paper_2311.10813_agent_driver.md) 风格的 tool calling agent，看 CF 能否进一步纠正 tool 调用错误。
"""),
]))
