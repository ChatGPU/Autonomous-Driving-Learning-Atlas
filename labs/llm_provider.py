"""Unified LLM provider abstraction for the Autonomous-Driving Learning Atlas labs.

Supports four backends, selected by environment variable ``LLM_BACKEND``:

* ``mock``    (default; deterministic; offline; CI-friendly)
* ``openai``  (uses ``OPENAI_API_KEY`` and ``OPENAI_MODEL``)
* ``ollama``  (assumes ``ollama serve`` is running locally; ``OLLAMA_MODEL``)
* ``hf``      (HuggingFace inference API; ``HF_TOKEN``, ``HF_MODEL``)

All four return a single string. The mock backend is *intentionally smart enough*
that the LLM-driver labs (07/08/09/10) produce sensible decisions without an API
call — the lab narrative still lands, and CI runs offline.

Public API
----------
    LLM().chat([{"role": "system", "content": "..."},
                {"role": "user",   "content": "..."}], temperature=0.0)
        -> str

    LLM().json_chat(messages, schema_hint="...", temperature=0.0)
        -> dict   # parsed JSON; mock guarantees valid JSON
"""
from __future__ import annotations

import json
import os
import re
from dataclasses import dataclass
from typing import Any


# ----------------------------------------------------------------- mock brain

# A small "rule-based driver" that the mock backend uses to answer driving
# prompts. It looks at the observation JSON encoded in the user message and
# returns a sensible meta-action. This is what lets all LLM labs run offline.

def _mock_driver(prompt: str) -> str:
    obs = _extract_obs(prompt)
    msg = []

    # Highway-env-like obs: leading vehicle distance + ego speed
    lead_d = obs.get("lead_distance", 80.0)
    speed = obs.get("ego_speed", 25.0)
    cars  = obs.get("nearby_cars", [])
    decision_lane = obs.get("ego_lane", 1)

    if lead_d < 15:
        meta = "decelerate"
        reason = f"前车距离 {lead_d:.1f}m 过近，先减速保持安全距离"
        new_lane = decision_lane
    elif lead_d < 30 and speed > 18:
        # try lane change if safe
        left_safe = all(abs(c.get("lat", 4) + 4) > 2 and c.get("lon", 50) > 20 for c in cars)
        if left_safe and decision_lane > 0:
            meta = "lane_change_left"
            reason = f"前方 {lead_d:.1f}m，左道安全，超车"
            new_lane = decision_lane - 1
        else:
            meta = "follow"
            reason = "前车有距离但未到换道阈值，保持跟随"
            new_lane = decision_lane
    elif speed < 22:
        meta = "accelerate"
        reason = "前方畅通，提速到目标巡航"
        new_lane = decision_lane
    else:
        meta = "maintain"
        reason = "前方畅通且巡航，保持"
        new_lane = decision_lane

    out = {
        "meta_action": meta,
        "rationale": reason,
        "target_speed": min(30.0, max(5.0, speed + (2.0 if meta == "accelerate" else
                                                    -3.0 if meta == "decelerate" else 0.0))),
        "target_lane": new_lane,
    }
    return json.dumps(out, ensure_ascii=False)


def _extract_obs(prompt: str) -> dict:
    """Find the LARGEST balanced top-level JSON object in the prompt."""
    candidates: list[str] = []
    starts = [i for i, c in enumerate(prompt) if c == "{"]
    for s in starts:
        depth = 0
        for i in range(s, len(prompt)):
            if prompt[i] == "{":
                depth += 1
            elif prompt[i] == "}":
                depth -= 1
                if depth == 0:
                    candidates.append(prompt[s:i + 1])
                    break
    # Try the longest first (likely the wrapping observation)
    for c in sorted(candidates, key=len, reverse=True):
        try:
            obj = json.loads(c)
            if isinstance(obj, dict):
                return obj
        except json.JSONDecodeError:
            continue
    return {}


def _mock_counterfactual(prompt: str) -> str:
    """Used by lab10 — predicts whether a candidate plan is unsafe and proposes a fix."""
    obs = _extract_obs(prompt)
    plan = str(obs.get("plan", obs.get("meta_action", "maintain")))
    lead_d = float(obs.get("lead_distance", 80.0))
    weather = str(obs.get("weather", "clear"))
    rain = weather != "clear"

    # rule 1 — keeping current speed when very close to lead is unsafe
    if plan in ("maintain", "follow", "accelerate") and lead_d < 12:
        return json.dumps({
            "unsafe": True,
            "reason": f"距前车 {lead_d:.1f}m，{plan} 会迅速逼近，建议减速",
            "corrected_meta_action": "decelerate",
        }, ensure_ascii=False)
    # rule 2 — lane change with insufficient buffer or rain
    if "lane_change" in plan and (lead_d < 14 or rain):
        return json.dumps({
            "unsafe": True,
            "reason": f"距前车 {lead_d:.1f}m{'、雨天' if rain else ''}，变道存在剐蹭风险",
            "corrected_meta_action": "decelerate",
        }, ensure_ascii=False)
    # rule 3 — accelerate in rain with mid distance
    if plan == "accelerate" and (lead_d < 20 or rain):
        return json.dumps({
            "unsafe": True,
            "reason": "雨天 / 距离不足，不宜提速",
            "corrected_meta_action": "follow",
        }, ensure_ascii=False)
    return json.dumps({"unsafe": False, "reason": "评估安全，可执行原计划",
                       "corrected_meta_action": plan}, ensure_ascii=False)


# ----------------------------------------------------------------- backends

@dataclass
class LLM:
    backend: str = ""
    model: str = ""

    def __post_init__(self):
        if not self.backend:
            self.backend = os.environ.get("LLM_BACKEND", "mock").lower()
        if not self.model:
            if self.backend == "openai":
                self.model = os.environ.get("OPENAI_MODEL", "gpt-4o-mini")
            elif self.backend == "ollama":
                self.model = os.environ.get("OLLAMA_MODEL", "qwen2.5:3b")
            elif self.backend == "hf":
                self.model = os.environ.get("HF_MODEL", "Qwen/Qwen2.5-7B-Instruct")
            else:
                self.model = "mock-driver-v1"

    # ----- main entry points -----

    def chat(self, messages: list[dict], temperature: float = 0.0, max_tokens: int = 512) -> str:
        if self.backend == "mock":
            return self._mock(messages)
        if self.backend == "openai":
            return self._openai(messages, temperature, max_tokens)
        if self.backend == "ollama":
            return self._ollama(messages, temperature, max_tokens)
        if self.backend == "hf":
            return self._hf(messages, temperature, max_tokens)
        raise ValueError(f"unknown LLM_BACKEND={self.backend!r}")

    def json_chat(self, messages: list[dict], schema_hint: str = "", temperature: float = 0.0) -> dict:
        text = self.chat(messages, temperature=temperature)
        # be tolerant of LLMs returning fenced code blocks
        text = re.sub(r"^```(?:json)?\s*|\s*```$", "", text.strip(), flags=re.MULTILINE)
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            # last-resort: extract first {...}
            m = re.search(r"\{[\s\S]*\}", text)
            if m:
                return json.loads(m.group(0))
            return {"_raw": text}

    # ----- backend impls -----

    def _mock(self, messages: list[dict]) -> str:
        prompt = "\n\n".join(m.get("content", "") for m in messages)
        if "counterfactual" in prompt.lower() or "反事实" in prompt:
            return _mock_counterfactual(prompt)
        if "tool" in prompt.lower() and "call" in prompt.lower():
            # lab08: pick a tool
            return json.dumps({
                "tool": "get_nearby_vehicles",
                "args": {"radius_m": 50},
                "rationale": "先看一下附近车辆再决策",
            }, ensure_ascii=False)
        return _mock_driver(prompt)

    def _openai(self, messages, temperature, max_tokens):
        from openai import OpenAI  # type: ignore
        client = OpenAI()
        r = client.chat.completions.create(model=self.model, messages=messages,
                                           temperature=temperature, max_tokens=max_tokens)
        return r.choices[0].message.content or ""

    def _ollama(self, messages, temperature, max_tokens):
        import urllib.request
        body = json.dumps({"model": self.model, "messages": messages,
                           "stream": False, "options": {"temperature": temperature, "num_predict": max_tokens}})
        req = urllib.request.Request("http://localhost:11434/api/chat",
                                     data=body.encode("utf-8"),
                                     headers={"Content-Type": "application/json"})
        with urllib.request.urlopen(req, timeout=120) as r:
            return json.loads(r.read())["message"]["content"]

    def _hf(self, messages, temperature, max_tokens):
        import urllib.request
        token = os.environ.get("HF_TOKEN", "")
        prompt = "\n\n".join(f"[{m.get('role','user')}] {m.get('content','')}" for m in messages)
        body = json.dumps({"inputs": prompt, "parameters":
                           {"temperature": temperature, "max_new_tokens": max_tokens}})
        req = urllib.request.Request(
            f"https://api-inference.huggingface.co/models/{self.model}",
            data=body.encode("utf-8"),
            headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"})
        with urllib.request.urlopen(req, timeout=120) as r:
            data = json.loads(r.read())
            if isinstance(data, list) and data and "generated_text" in data[0]:
                return data[0]["generated_text"]
            return json.dumps(data)


# ----------------------------------------------------------------- self-test

if __name__ == "__main__":
    import sys
    llm = LLM()
    msg = [
        {"role": "system", "content": "你是自动驾驶决策器。返回 JSON。"},
        {"role": "user", "content": '当前观测: {"lead_distance": 8.5, "ego_speed": 24.0, "ego_lane": 1, "nearby_cars": []}'},
    ]
    out = llm.json_chat(msg)
    print("backend:", llm.backend, "model:", llm.model)
    print("response:", json.dumps(out, ensure_ascii=False, indent=2))
    sys.exit(0)
