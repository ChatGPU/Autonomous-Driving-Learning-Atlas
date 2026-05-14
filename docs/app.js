/* Autonomous-Driving Learning Atlas — main client logic
 *
 * Single static page. Loads docs/data/graph.json, draws a Cytoscape graph,
 * wires up search / playbook presets / topic-phase-tier filter chips,
 * timeline filter, compare mode, deep-link permalinks, and a side-panel
 * markdown card renderer with KaTeX, BibTeX copy, and tabs.
 */
(function () {
  "use strict";

  const STATE = {
    cy: null,
    graph: null,
    selected: null,           // for permalink
    playbook: null,           // 'A'|'B'|'C'|'D'|null
    activeTopics: new Set(),  // topic filter
    activePhases: new Set(),
    activeTiers: new Set(),
    yearMax: 2026,
    layout: "cose",
    activeTab: "full",
    searchQuery: "",
    cardCache: new Map(),
    resourceCache: new Map(),
    compare: { enabled: false, slots: [null, null] },
  };

  // ---------------------------------------------------------------- utils

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function debounce(fn, ms) {
    let h;
    return (...args) => { clearTimeout(h); h = setTimeout(() => fn(...args), ms); };
  }

  function urlParams() {
    return new URLSearchParams(window.location.search);
  }
  function setUrlParams(p) {
    const u = new URL(window.location.href);
    u.search = "";
    for (const [k, v] of Object.entries(p)) {
      if (v != null && v !== "") u.searchParams.set(k, v);
    }
    history.replaceState(null, "", u.toString());
  }

  function topicColor(topic) {
    return STATE.graph.topic_palette[topic] || "#888";
  }
  function tierWidth(tier) {
    return STATE.graph.tier_border_width[tier] || 1;
  }
  function escapeHtml(s) {
    return String(s ?? "").replace(/[<>&"]/g, c => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "\"": "&quot;" }[c]));
  }
  function stripQuotes(s) {
    return String(s ?? "").trim().replace(/^['"]|['"]$/g, "");
  }
  const LABELS = {
    topic: {
      math_foundations: "数学直觉",
      rl_foundations: "RL 基础",
      deep_rl: "深度 RL",
      ssl_vision: "自监督视觉",
      e2e_ad: "端到端 AD",
      vlm_vla: "VLM / VLA",
      brain_inspired: "类脑高效",
      meta_philosophy: "研究哲学",
      companion_media: "陪伴式视频",
    },
    phase: { prereq: "先修直觉", core: "核心方法", frontier: "前沿探索" },
    tier: { spine: "主线", S: "经典", A: "延伸", B: "定位", concept: "概念", lab: "实验" },
    kind: { paper: "论文", channel: "频道", course: "课程", essay: "短文", concept: "概念", lab: "实验" },
  };
  const PLAYBOOK_NOTES = {
    A: "这条路从 Bellman 方程和策略梯度出发，最后走到 DiLu / Agent-Driver 里的 LLM 决策循环。",
    B: "这条路适合 CV / 感知背景：先把 query、BEV、ViT 看清楚，再进入 UniAD、PlanT 与 DriveVLM。",
    C: "这条路关注车端算力与能耗：把 Transformer 的能力、DINO 的 scaling、Spike 路线的效率放在同一张坐标系里看。",
    D: "这条路把 LLM、VLM、VLA 串起来：从 Transformer/GPT 的基础直觉走到 DriveVLM 与 CF-VLA。",
    ALL: "全图已经展开。你可以搜索一个熟悉的节点，或用年份滑条看研究范式怎样演化。",
  };
  function label(kind, value) {
    return (LABELS[kind] && LABELS[kind][value]) || value || "";
  }

  // ---------------------------------------------------------------- graph load

  async function loadGraph() {
    const r = await fetch("data/graph.json", { cache: "no-cache" });
    const g = await r.json();
    STATE.graph = g;
    return g;
  }

  function buildElements(g) {
    const nodes = g.nodes.map(n => ({
      data: { ...n, _label: n.label_zh || n.label }
    }));
    const edges = g.edges.map((e, i) => ({
      data: { id: `e${i}`, source: e.source, target: e.target, rel: e.rel }
    }));
    return [...nodes, ...edges];
  }

  // ---------------------------------------------------------------- cytoscape

  function buildCy(elements) {
    const cy = cytoscape({
      container: $("#cy"),
      elements,
      wheelSensitivity: 0.25,
      minZoom: 0.15,
      maxZoom: 3,
      style: [
        {
          selector: "node",
          style: {
            "background-color": ele => topicColor(ele.data("topic")),
            "label": "data(_label)",
            "color": "#e6ecff",
            "font-size": 11,
            "text-valign": "bottom",
            "text-margin-y": 6,
            "text-outline-color": "#0b1020",
            "text-outline-width": 2,
            "border-color": "#cbd5e1",
            "border-width": ele => tierWidth(ele.data("tier")),
            "width":  ele => 22 + 4 * Math.sqrt(ele.degree()),
            "height": ele => 22 + 4 * Math.sqrt(ele.degree()),
            "text-wrap": "ellipsis",
            "text-max-width": 130,
          },
        },
        { selector: "node[kind = 'concept']", style: { "shape": "round-diamond", "background-opacity": 0.85 } },
        { selector: "node[kind = 'lab']", style: { "shape": "round-rectangle", "border-style": "dashed" } },
        { selector: "node[kind = 'essay']", style: { "shape": "round-pentagon" } },
        { selector: "node[kind = 'channel']", style: { "shape": "round-tag" } },
        { selector: "node[kind = 'course']", style: { "shape": "round-octagon" } },
        { selector: "node:selected", style: {
            "border-color": "#ff8a3d", "border-width": 6,
            "background-blacken": -0.15,
        }},
        { selector: "node.dim", style: { "opacity": 0.18 } },
        { selector: "node.neighbor", style: { "opacity": 1, "background-blacken": -0.08 } },
        { selector: "node.hi", style: { "border-color": "#ffd166", "border-width": 4 } },

        // edges
        {
          selector: "edge",
          style: {
            "width": 1.5,
            "line-color": "#9aa6c8",
            "target-arrow-color": "#9aa6c8",
            "curve-style": "bezier",
            "target-arrow-shape": "triangle",
            "arrow-scale": 0.9,
            "opacity": 0.7,
          },
        },
        { selector: "edge[rel = 'prereq']",     style: { "line-color": "#9aa6c8", "line-style": "solid",  "target-arrow-color": "#9aa6c8" }},
        { selector: "edge[rel = 'covers']",     style: { "line-color": "#9aa6c8", "line-style": "dotted", "target-arrow-color": "#9aa6c8" }},
        { selector: "edge[rel = 'extends']",    style: { "line-color": "#90caf9", "line-style": "solid",  "target-arrow-color": "#90caf9", "width": 2 }},
        { selector: "edge[rel = 'parallel']",   style: { "line-color": "#4ade80", "line-style": "solid",  "target-arrow-shape": "none", "width": 2 }},
        { selector: "edge[rel = 'contrasts']",  style: { "line-color": "#ff6363", "line-style": "dashed", "target-arrow-color": "#ff6363", "width": 2 }},
        { selector: "edge[rel = 'feeds']",      style: { "line-color": "#ffb74d", "line-style": "dashed", "target-arrow-color": "#ffb74d" }},
        { selector: "edge[rel = 'implements']", style: { "line-color": "#c084fc", "line-style": "dotted", "target-arrow-color": "#c084fc" }},
        { selector: "edge.dim", style: { "opacity": 0.05 } },
        { selector: "edge.hi", style: { "opacity": 1, "width": 3 } },
      ],
      layout: { name: "cose", animate: false, nodeRepulsion: () => 8000, idealEdgeLength: () => 95, gravity: 1.0 },
    });
    cy.on("tap", "node", evt => onNodeTap(evt));
    cy.on("tap", evt => { if (evt.target === cy) closeRight(); });
    cy.on("mouseover", "node", evt => {
      const n = evt.target;
      cy.batch(() => {
        cy.elements().removeClass("hi neighbor");
        n.addClass("hi");
        n.closedNeighborhood().addClass("neighbor");
        n.connectedEdges().addClass("hi");
      });
    });
    cy.on("mouseout", "node", () => {
      cy.batch(() => cy.elements().removeClass("hi neighbor"));
    });
    return cy;
  }

  function applyLayout(kind) {
    const cy = STATE.cy;
    if (!cy) return;
    STATE.layout = kind;
    if (kind === "cose" || kind === "fcose") {
      cy.layout({ name: "cose", animate: false, nodeRepulsion: () => 8000, idealEdgeLength: () => 95, gravity: 1.0 }).run();
      return;
    }
    if (kind === "topic") {
      const topics = Object.keys(STATE.graph.topic_palette);
      const W = cy.width(), H = cy.height();
      const cx = W / 2, cy0 = H / 2;
      const r0 = Math.min(W, H) * 0.35;
      const positions = {};
      topics.forEach((t, i) => {
        const angle = (i / topics.length) * Math.PI * 2;
        const tx = cx + r0 * Math.cos(angle), ty = cy0 + r0 * Math.sin(angle);
        const ns = cy.nodes(`[topic = "${t}"]`);
        ns.forEach((n, j) => {
          const a2 = (j / Math.max(1, ns.length - 1)) * Math.PI * 0.9 - Math.PI * 0.45 + angle;
          const r2 = 80 + Math.sqrt(j) * 18;
          positions[n.id()] = { x: tx + r2 * Math.cos(a2), y: ty + r2 * Math.sin(a2) };
        });
      });
      cy.layout({ name: "preset", positions: n => positions[n.id()], animate: true, animationDuration: 400 }).run();
      return;
    }
    if (kind === "phase") {
      const phases = ["prereq", "core", "frontier"];
      const W = cy.width(), H = cy.height();
      const positions = {};
      phases.forEach((p, i) => {
        const ns = cy.nodes(`[phase = "${p}"]`);
        const y = H * (0.18 + i * 0.32);
        ns.forEach((n, j) => {
          const x = (W * 0.06) + ((j + 0.5) / ns.length) * W * 0.88;
          positions[n.id()] = { x, y };
        });
      });
      cy.layout({ name: "preset", positions: n => positions[n.id()], animate: true, animationDuration: 400 }).run();
      return;
    }
    if (kind === "timeline") {
      const W = cy.width(), H = cy.height();
      const years = cy.nodes().map(n => n.data("year")).filter(y => y);
      const ymin = Math.min(...years), ymax = Math.max(...years);
      const positions = {};
      const groupedByY = {};
      cy.nodes().forEach(n => {
        const y = n.data("year") || ymin;
        groupedByY[y] = groupedByY[y] || [];
        groupedByY[y].push(n);
      });
      Object.entries(groupedByY).forEach(([y, ns]) => {
        const xfrac = (Number(y) - ymin) / Math.max(1, ymax - ymin);
        const x = W * 0.07 + xfrac * W * 0.86;
        ns.forEach((n, j) => {
          const yy = H * 0.14 + ((j + 0.5) / ns.length) * H * 0.78;
          positions[n.id()] = { x, y: yy };
        });
      });
      cy.layout({ name: "preset", positions: n => positions[n.id()], animate: true, animationDuration: 500 }).run();
      return;
    }
  }

  // ---------------------------------------------------------------- right panel

  function resolveCardPath(card) {
    const path = card.startsWith("../../../") ? card.replace("../../../", "../") : `data/cards/${card}`;
    const [cleanPath, fragment = ""] = path.split("#");
    return { path: cleanPath, fragment };
  }

  async function fetchText(path) {
    if (STATE.cardCache.has(path)) return STATE.cardCache.get(path);
    let r = await fetch(path, { cache: "no-cache" });
    if (!r.ok && path.startsWith("../")) {
      const rawPath = path.replace(/^\.\.\//, "");
      r = await fetch(`https://raw.githubusercontent.com/ChatGPU/Autonomous-Driving-Learning-Atlas/main/${rawPath}`, { cache: "no-cache" });
    }
    if (!r.ok) throw new Error(`HTTP ${r.status} while fetching ${path}`);
    const txt = await r.text();
    STATE.cardCache.set(path, txt);
    return txt;
  }

  async function fetchCard(card) {
    const { path } = resolveCardPath(card);
    try {
      return await fetchText(path);
    } catch (err) {
      return `# 这张卡片暂时没有加载出来\n\n页面试图读取：\`${path}\`\n\n如果你在本地预览，请确认这个文件存在；如果你在 GitHub Pages 上看到它，欢迎回到仓库提交一个 broken-link issue。`;
    }
  }

  function parseFrontmatter(md) {
    const m = md.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!m) return { fm: {}, body: md, rawFrontmatter: "" };
    const raw = m[1];
    const fm = { deep_links: [] };
    const lines = raw.split("\n");
    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];
      if (/^deep_links:\s*$/.test(line)) {
        i += 1;
        while (i < lines.length && /^\s+-\s+/.test(lines[i])) {
          const item = lines[i];
          const label = item.match(/label:\s*["']([^"']+)["']/);
          const url = item.match(/url:\s*["']([^"']+)["']/);
          if (label && url) fm.deep_links.push({ label: label[1], url: url[1] });
          i += 1;
        }
        i -= 1;
        continue;
      }
      if (/^bibtex:\s*\|/.test(line)) {
        const bib = [];
        i += 1;
        while (i < lines.length && (/^\s+/.test(lines[i]) || lines[i] === "")) {
          bib.push(lines[i].replace(/^  /, ""));
          i += 1;
        }
        fm.bibtex = bib.join("\n").trim();
        i -= 1;
        continue;
      }
      const mm = line.match(/^([a-zA-Z_]+):\s*(.*)$/);
      if (mm) fm[mm[1]] = stripQuotes(mm[2]);
    }
    return { fm, body: m[2], rawFrontmatter: raw };
  }

  function normalizeAnchor(s) {
    return decodeURIComponent(String(s || ""))
      .toLowerCase()
      .replace(/[`~!@#$%^&*()+=[\]{}|\\:;"'，。、《》？：；“”‘’！,.<>/?]/g, "")
      .replace(/[\s_-]+/g, "");
  }

  function extractMarkdownSection(md, fragment) {
    if (!fragment) return md;
    const target = normalizeAnchor(fragment);
    const lines = md.split("\n");
    let start = -1;
    let level = 99;
    for (let i = 0; i < lines.length; i += 1) {
      const m = lines[i].match(/^(#{1,6})\s+(.+?)\s*#*$/);
      if (!m) continue;
      const heading = normalizeAnchor(m[2]);
      if (heading === target || heading.includes(target) || target.includes(heading)) {
        start = i;
        level = m[1].length;
        break;
      }
    }
    if (start < 0) {
      return `## 没有找到这个概念的小节\n\n页面想打开锚点 \`${fragment}\`，但概念表里没有完全匹配的标题。你仍然可以打开完整的 [概念地图](https://github.com/ChatGPU/Autonomous-Driving-Learning-Atlas/blob/main/concepts.md)。`;
    }
    let end = lines.length;
    for (let i = start + 1; i < lines.length; i += 1) {
      const m = lines[i].match(/^(#{1,6})\s+/);
      if (m && m[1].length <= level) {
        end = i;
        break;
      }
    }
    return lines.slice(start, end).join("\n");
  }

  function sourceToText(src) {
    return Array.isArray(src) ? src.join("") : String(src || "");
  }

  function renderNotebookSummary(ipynbText, node, path) {
    let nb;
    try {
      nb = JSON.parse(ipynbText);
    } catch (_err) {
      return `## ${node.data("_label")}\n\n这个 lab notebook 暂时无法解析为 JSON。你可以直接在 GitHub 上打开它：\n\n- [查看 notebook](https://github.com/ChatGPU/Autonomous-Driving-Learning-Atlas/blob/main/${path.replace("../", "")})`;
    }
    const markdownCells = (nb.cells || []).filter(c => c.cell_type === "markdown").map(c => sourceToText(c.source));
    const first = markdownCells[0] || `# ${node.data("_label")}`;
    const title = (first.match(/^#\s+(.+)$/m) || [null, node.data("_label")])[1];
    const what = (first.match(/\*\*What this proves\*\*[:：]\s*([\s\S]*?)(?:\n\n|$)/) || [null, "这个实验把图谱里的抽象概念压成一个可以运行、可以改动、可以观察结果的最小系统。"])[1].trim();
    const stretch = markdownCells.find(c => /stretch goals|stretch goal|延伸目标/i.test(c)) || "";
    const rel = path.replace("../", "");
    return `## ${title}\n\n> **这个实验想证明什么？** ${what}\n\n### 怎么使用\n\n1. 先读上方对应论文卡片，抓住它想解决的问题；\n2. 再运行 notebook，看同一个想法在最小代码里怎样出现；\n3. 最后改一个参数或场景，让结果发生可解释的变化。\n\n- [在 GitHub 查看 notebook](https://github.com/ChatGPU/Autonomous-Driving-Learning-Atlas/blob/main/${rel})\n- [在 Colab 打开](https://colab.research.google.com/github/ChatGPU/Autonomous-Driving-Learning-Atlas/blob/main/${rel})\n\n${stretch ? `### 可以继续挑战\n\n${stretch.replace(/^###\s*/, "")}` : ""}`;
  }

  async function loadNodeResource(node) {
    const data = node.data();
    const cacheKey = `${node.id()}::${data.card}`;
    if (STATE.resourceCache.has(cacheKey)) return STATE.resourceCache.get(cacheKey);
    const { path, fragment } = resolveCardPath(data.card);
    let resource;
    try {
      const txt = await fetchText(path);
      if (data.kind === "concept") {
        resource = {
          type: "concept",
          path,
          body: extractMarkdownSection(txt, fragment),
          fm: { deep_links: [{ label: "完整概念地图", url: "https://github.com/ChatGPU/Autonomous-Driving-Learning-Atlas/blob/main/concepts.md" + (fragment ? `#${fragment}` : "") }] },
        };
      } else if (data.kind === "lab") {
        const body = renderNotebookSummary(txt, node, path);
        const rel = path.replace("../", "");
        resource = {
          type: "lab",
          path,
          body,
          fm: {
            deep_links: [
              { label: "GitHub notebook", url: `https://github.com/ChatGPU/Autonomous-Driving-Learning-Atlas/blob/main/${rel}` },
              { label: "Open in Colab", url: `https://colab.research.google.com/github/ChatGPU/Autonomous-Driving-Learning-Atlas/blob/main/${rel}` },
            ],
          },
        };
      } else {
        resource = { type: "markdown", path, ...parseFrontmatter(txt) };
      }
    } catch (err) {
      resource = {
        type: "error",
        path,
        fm: { deep_links: [] },
        body: `## 这张卡片暂时没有加载出来\n\n页面试图读取：\`${path}\`。\n\n错误信息：\`${escapeHtml(err.message)}\``,
      };
    }
    STATE.resourceCache.set(cacheKey, resource);
    return resource;
  }

  function renderMeta(data, fm = {}) {
    const tier = (data.tier || fm.tier || "").replace(/['"]/g, "");
    return `
      <div class="meta">
        <span class="badge ${tier}">${escapeHtml(label("tier", tier))}</span>
        <span class="badge">${escapeHtml(label("kind", data.kind))}</span>
        <span class="badge">${escapeHtml(label("topic", data.topic))}</span>
        <span class="badge">${escapeHtml(label("phase", data.phase))}</span>
        ${data.year ? `<span class="badge">${data.year}</span>` : ""}
      </div>`;
  }

  function renderMarkdown(root, md) {
    root.innerHTML = DOMPurify.sanitize(marked.parse(md, { breaks: false }));
    rewriteCardLinks(root);
    if (window.renderMathInElement) {
      renderMathInElement(root, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$",  right: "$",  display: false },
        ],
        throwOnError: false,
      });
    }
  }

  function collectMarkdownLinks(body) {
    return [...String(body || "").matchAll(/\[([^\]]+)\]\((https?:[^\)\s]+)\)/g)]
      .map(m => ({ label: m[1], url: m[2] }));
  }

  function uniqueLinks(links) {
    const seen = new Set();
    return links.filter(l => {
      if (!l.url || seen.has(l.url)) return false;
      seen.add(l.url);
      return true;
    });
  }

  function renderLinksTab(node, resource) {
    const links = uniqueLinks([...(resource.fm.deep_links || []), ...collectMarkdownLinks(resource.body)]);
    const items = links.map(l => `<li><a href="${escapeHtml(l.url)}" target="_blank" rel="noopener">${escapeHtml(l.label || l.url)}</a></li>`).join("");
    $("#cardBody").innerHTML = `<h2>深度链接 / Deep links</h2><p class="soft">这里收集的是这张卡最值得直接打开的位置：论文页码、视频时间戳、代码仓库或配套 notebook。</p><ul>${items || "<li><em>这张卡暂时没有外部深度链接。</em></li>"}</ul>`;
  }

  function renderBibtexTab(resource) {
    const bib = (resource.fm && resource.fm.bibtex) ? resource.fm.bibtex.trim() : "";
    if (!bib) {
      $("#cardBody").innerHTML = "<h2>BibTeX</h2><p class=\"soft\">这类节点通常不是论文，因此没有 BibTeX。需要引用时，可以直接引用页面中给出的原始资源链接。</p>";
      return;
    }
    $("#cardBody").innerHTML = `
      <h2>BibTeX <button class="copybtn" id="copyBib">复制</button></h2>
      <pre><code>${escapeHtml(bib)}</code></pre>`;
    $("#copyBib").onclick = () => navigator.clipboard.writeText(bib);
  }

  function renderResourceTab(node, resource, tab) {
    const data = node.data();
    $$(".rightbar .tab").forEach(t => t.classList.toggle("active", t.dataset.tab === tab));
    if (tab === "links") {
      renderLinksTab(node, resource);
      return;
    }
    if (tab === "bibtex") {
      renderBibtexTab(resource);
      return;
    }
    const root = $("#cardBody");
    root.innerHTML = renderMeta(data, resource.fm) + DOMPurify.sanitize(marked.parse(resource.body, { breaks: false }));
    rewriteCardLinks(root);
    if (window.renderMathInElement) {
      renderMathInElement(root, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$",  right: "$",  display: false },
        ],
        throwOnError: false,
      });
    }
  }

  async function renderSelectedCard(node, tab = STATE.activeTab || "full") {
    const safeTab = ["full", "links", "bibtex"].includes(tab) ? tab : "full";
    STATE.selected = node.id();
    STATE.activeTab = safeTab;
    $("#cardTitle").textContent = node.data("_label");
    $("#rightbar").classList.add("open");
    $("#rightbar").setAttribute("aria-hidden", "false");
    $("#cardBody").innerHTML = "<p class=\"soft loading\">正在整理这张卡片…</p>";
    $$(".rightbar .tab").forEach(t => t.classList.toggle("active", t.dataset.tab === safeTab));
    syncPermalink();
    const resource = await loadNodeResource(node);
    if (STATE.selected !== node.id()) return;
    renderResourceTab(node, resource, safeTab);
    syncPermalink();
  }

  async function renderCard(node) {
    return renderSelectedCard(node, "full");
  }

  async function renderNodePreview(node) {
    const resource = await loadNodeResource(node);
    const data = node.data();
    const wrap = document.createElement("div");
    wrap.innerHTML = `<h3>${escapeHtml(data.label_zh || data.label)}</h3>${renderMeta(data, resource.fm)}${DOMPurify.sanitize(marked.parse(resource.body, { breaks: false }))}`;
    rewriteCardLinks(wrap);
    if (window.renderMathInElement) {
      renderMathInElement(wrap, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$",  right: "$",  display: false },
        ],
        throwOnError: false,
      });
    }
    return wrap.innerHTML;
  }

  window.AtlasCards = {
    renderSelectedCard,
    renderNodePreview,
  };

  // ---------------------------------------------------------------- in-card link rewrite

  // Build a map: card filename -> node id, so when a card mentions
  // `paper_2212.10156_uniad.md` we can route the click into the SPA's renderCard.
  function buildCardToNode() {
    const m = new Map();
    if (!STATE.graph) return m;
    STATE.graph.nodes.forEach(n => {
      if (n.card && n.kind !== "concept" && n.kind !== "lab") {
        const fname = n.card.split("/").pop();
        m.set(fname, n.id);
      }
    });
    return m;
  }
  let _cardToNode = null;

  function rewriteCardLinks(root) {
    if (!_cardToNode) _cardToNode = buildCardToNode();
    root.querySelectorAll("a[href]").forEach(a => {
      const href = a.getAttribute("href") || "";
      // Same-page anchor: leave alone
      if (href.startsWith("#")) return;
      // Concepts file fragment: open the concepts.md page on GitHub (anchors preserved)
      if (href.includes("concepts.md")) {
        a.target = "_blank"; a.rel = "noopener";
        const anchor = href.split("#")[1] || "";
        a.href = "https://github.com/ChatGPU/Autonomous-Driving-Learning-Atlas/blob/main/concepts.md" + (anchor ? "#" + anchor : "");
        return;
      }
      // Lab notebook → GitHub blob view (renders the notebook)
      if (href.includes("/labs/") || href.endsWith(".ipynb")) {
        a.target = "_blank"; a.rel = "noopener";
        const m = href.match(/labs\/([^\)\s]+)/);
        if (m) a.href = "https://github.com/ChatGPU/Autonomous-Driving-Learning-Atlas/blob/main/labs/" + m[1];
        return;
      }
      // Card-to-card: route through SPA
      const fname = href.split("/").pop();
      if (_cardToNode.has(fname)) {
        const targetId = _cardToNode.get(fname);
        a.href = `?node=${encodeURIComponent(targetId)}`;
        a.onclick = (e) => {
          e.preventDefault();
          const node = STATE.cy.$id(targetId);
          if (node && !node.empty()) {
            STATE.cy.center(node);
            renderSelectedCard(node, "full");
          }
        };
        return;
      }
      // Otherwise external — open new tab
      if (href.startsWith("http")) {
        a.target = "_blank"; a.rel = "noopener";
      }
    });
  }

  function showTab(name) {
    const safeTab = ["full", "links", "bibtex"].includes(name) ? name : "full";
    STATE.activeTab = safeTab;
    $$(".rightbar .tab").forEach(t => t.classList.toggle("active", t.dataset.tab === safeTab));
    if (!STATE.selected) return;
    const node = STATE.cy.$id(STATE.selected);
    if (!node || node.empty()) return;
    renderSelectedCard(node, safeTab);
  }

  function closeRight() {
    $("#rightbar").classList.remove("open");
    $("#rightbar").setAttribute("aria-hidden", "true");
    STATE.selected = null;
    STATE.activeTab = "full";
    syncPermalink();
  }

  function syncPermalink() {
    const p = {};
    if (STATE.selected) p.node = STATE.selected;
    if (STATE.playbook && STATE.playbook !== "ALL") p.playbook = STATE.playbook;
    if (STATE.activeTab && STATE.activeTab !== "full") p.tab = STATE.activeTab;
    if (STATE.layout && STATE.layout !== "cose") p.layout = STATE.layout;
    if (STATE.yearMax && STATE.yearMax !== 2026) p.year = STATE.yearMax;
    setUrlParams(p);
  }

  // ---------------------------------------------------------------- node interactions

  function onNodeTap(evt) {
    const n = evt.target;
    if (window.AtlasCompare && window.AtlasCompare.handleSelect(evt.originalEvent, n)) return;
    renderSelectedCard(n, "full");
  }

  // ---------------------------------------------------------------- filters

  function applyFilters() {
    const cy = STATE.cy;
    if (!cy) return;
    const yearMax = STATE.yearMax;
    const phasesActive = STATE.activePhases.size > 0;
    const topicsActive = STATE.activeTopics.size > 0;
    const tiersActive = STATE.activeTiers.size > 0;
    let pbSet = null;
    if (STATE.playbook && STATE.playbook !== "ALL") {
      const pb = STATE.graph.playbooks[STATE.playbook];
      if (pb) pbSet = new Set(pb.nodes);
    }
    const q = STATE.searchQuery;
    let visibleCount = 0;
    cy.batch(() => {
      cy.nodes().forEach(n => {
        const y = n.data("year") || 2000;
        const okYear = y <= yearMax;
        const okPhase = !phasesActive || STATE.activePhases.has(n.data("phase"));
        const okTopic = !topicsActive || STATE.activeTopics.has(n.data("topic"));
        const okTier = !tiersActive || STATE.activeTiers.has(n.data("tier"));
        const okPb = !pbSet || pbSet.has(n.id());
        const searchable = [
          n.data("_label"),
          n.data("label"),
          n.id(),
          n.data("topic"),
          n.data("tier"),
          n.data("phase"),
        ].join(" ").toLowerCase();
        const okSearch = !q || searchable.includes(q);
        const visible = okYear && okPhase && okTopic && okTier && okPb && okSearch;
        if (visible) visibleCount += 1;
        n.toggleClass("dim", !visible);
      });
      cy.edges().forEach(e => {
        const dim = e.source().hasClass("dim") || e.target().hasClass("dim");
        e.toggleClass("dim", dim);
      });
    });
    const countEl = $("#resultCount");
    if (countEl) countEl.textContent = `${visibleCount} / ${cy.nodes().length} 个节点可见`;
  }

  function buildTopicChips() {
    const wrap = $("#topicChips");
    Object.entries(STATE.graph.topic_palette).forEach(([t, color]) => {
      const b = document.createElement("button");
      b.className = "chip"; b.textContent = label("topic", t);
      b.dataset.topic = t;
      b.style.setProperty("--chip-color", color);
      b.onclick = () => {
        if (STATE.activeTopics.has(t)) STATE.activeTopics.delete(t);
        else STATE.activeTopics.add(t);
        b.classList.toggle("active");
        applyFilters();
        syncPermalink();
      };
      wrap.appendChild(b);
    });
  }

  function bindChips() {
    $$("#phaseChips .chip").forEach(b => {
      b.onclick = () => {
        const p = b.dataset.phase;
        if (STATE.activePhases.has(p)) STATE.activePhases.delete(p);
        else STATE.activePhases.add(p);
        b.classList.toggle("active");
        applyFilters();
        syncPermalink();
      };
    });
    $$("#tierChips .chip").forEach(b => {
      b.onclick = () => {
        const t = b.dataset.tier;
        if (STATE.activeTiers.has(t)) STATE.activeTiers.delete(t);
        else STATE.activeTiers.add(t);
        b.classList.toggle("active");
        applyFilters();
        syncPermalink();
      };
    });
  }

  function bindPlaybooks() {
    $$(".pb").forEach(b => {
      b.onclick = () => {
        $$(".pb").forEach(x => x.classList.remove("active"));
        b.classList.add("active");
        STATE.playbook = b.dataset.pb;
        const note = $("#playbookNote");
        if (note) note.textContent = PLAYBOOK_NOTES[STATE.playbook] || "这条路径会把相关节点点亮，帮助你只看当前最需要的一小张子图。";
        applyFilters();
        if (STATE.playbook && STATE.playbook !== "ALL") {
          const pb = STATE.graph.playbooks[STATE.playbook];
          if (pb) {
            const sel = STATE.cy.$(pb.nodes.map(id => `#${CSS.escape(id)}`).join(","));
            STATE.cy.fit(sel, 50);
          }
        }
        syncPermalink();
      };
    });
  }

  function bindTopbar() {
    const search = $("#search");
    search.addEventListener("input", debounce(() => {
      STATE.searchQuery = search.value.trim().toLowerCase();
      applyFilters();
      syncPermalink();
    }, 150));

    document.addEventListener("keydown", e => {
      if (e.key === "/" && document.activeElement !== search) {
        e.preventDefault(); search.focus();
      } else if (e.key === "Escape") {
        closeRight();
        if (window.AtlasCompare) window.AtlasCompare.disable();
      }
    });

    $("#layout").onchange = e => { applyLayout(e.target.value); syncPermalink(); };
    const menuToggle = $("#menuToggle");
    if (menuToggle) {
      menuToggle.onclick = () => {
        const open = $("#leftbar").classList.toggle("open");
        menuToggle.setAttribute("aria-expanded", String(open));
      };
    }
    const welcome = $("#welcomeCard");
    const dismissWelcome = $("#dismissWelcome");
    if (welcome && localStorage.getItem("atlas-welcome-dismissed") === "1") {
      welcome.classList.add("hidden");
    }
    if (dismissWelcome) {
      dismissWelcome.onclick = () => {
        if (welcome) welcome.classList.add("hidden");
        localStorage.setItem("atlas-welcome-dismissed", "1");
      };
    }
    $("#resetBtn").onclick = () => {
      STATE.activeTopics.clear(); STATE.activePhases.clear(); STATE.activeTiers.clear();
      $$(".chip").forEach(c => c.classList.remove("active"));
      STATE.playbook = null;
      $$(".pb").forEach(c => c.classList.remove("active"));
      const note = $("#playbookNote");
      if (note) note.textContent = "不确定从哪里开始？先选一条最接近你背景的路径，图谱会自动把相关节点点亮。";
      search.value = "";
      STATE.searchQuery = "";
      STATE.yearMax = 2026; $("#yearSlider").value = 2026; $("#yearLabel").textContent = "2026";
      $("#layout").value = "cose"; applyLayout("cose");
      applyFilters();
      STATE.cy.fit(undefined, 40);
      syncPermalink();
    };
    $("#closeRight").onclick = closeRight;
    $$(".rightbar .tab").forEach(t => t.onclick = () => showTab(t.dataset.tab));
    $("#compareBtn").onclick = () => window.AtlasCompare && window.AtlasCompare.toggle();
    $("#closeCompare").onclick = () => window.AtlasCompare && window.AtlasCompare.disable();
    const clearCompare = $("#clearCompare");
    if (clearCompare) clearCompare.onclick = () => window.AtlasCompare && window.AtlasCompare.clear();
  }

  function bindTimeline() {
    const slider = $("#yearSlider");
    slider.oninput = () => {
      STATE.yearMax = Number(slider.value);
      $("#yearLabel").textContent = STATE.yearMax;
      applyFilters();
      syncPermalink();
    };
    if (window.AtlasTimeline) window.AtlasTimeline.bindPlay($("#playYears"), slider, () => $("#yearLabel"));
  }

  function applyPermalink() {
    const p = urlParams();
    const year = Number(p.get("year"));
    if (year) {
      STATE.yearMax = year;
      $("#yearSlider").value = year;
      $("#yearLabel").textContent = String(year);
      applyFilters();
    }
    const layout = p.get("layout");
    if (layout && $("#layout").querySelector(`option[value="${CSS.escape(layout)}"]`)) {
      $("#layout").value = layout;
      applyLayout(layout);
    }
    const pb = p.get("playbook");
    if (pb && STATE.graph.playbooks[pb]) {
      const btn = document.querySelector(`.pb[data-pb="${pb}"]`);
      if (btn) btn.click();
    }
    const node = p.get("node");
    if (node) {
      const n = STATE.cy.$id(node);
      if (n && !n.empty()) {
        STATE.cy.center(n); STATE.cy.zoom({ level: 1.3, position: n.position() });
        renderSelectedCard(n, p.get("tab") || "full");
      }
    }
  }

  // ---------------------------------------------------------------- bootstrap

  document.addEventListener("DOMContentLoaded", async () => {
    try {
      const g = await loadGraph();
      STATE.cy = buildCy(buildElements(g));
      buildTopicChips();
      bindChips();
      bindPlaybooks();
      bindTopbar();
      bindTimeline();
      applyLayout("cose");
      applyFilters();
      setTimeout(applyPermalink, 100); // wait for layout settle
      window.STATE = STATE; // expose for compare.js
    } catch (err) {
      $("#cy").innerHTML = `<div class="load-error"><h2>图谱暂时没有加载出来</h2><p>请检查 <code>docs/data/graph.json</code> 是否可访问。</p><pre>${escapeHtml(err.message)}</pre></div>`;
    }
  });
})();
