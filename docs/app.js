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
    cardCache: new Map(),
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
            "border-color": "#ff8a3d", "border-width": 6, "shadow-blur": 16, "shadow-color": "#ff8a3d",
        }},
        { selector: "node.dim", style: { "opacity": 0.18 } },
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
      ],
      layout: layoutFor("fcose"),
    });
    cy.on("tap", "node", evt => onNodeTap(evt));
    cy.on("tap", evt => { if (evt.target === cy) closeRight(); });
    return cy;
  }

  function layoutFor(kind) {
    switch (kind) {
      case "fcose":
        return { name: "fcose", quality: "default", nodeRepulsion: 7500, idealEdgeLength: 95,
                 randomize: true, animate: false, packComponents: true };
      case "topic": {
        const topics = Object.keys(STATE.graph.topic_palette);
        return {
          name: "preset",
          positions: () => null, // we'll position manually below
          stop: () => {}
        };
      }
      case "phase":
        return { name: "preset" };
      case "timeline":
        return { name: "preset" };
      default:
        return { name: "fcose", animate: false };
    }
  }

  function applyLayout(kind) {
    const cy = STATE.cy;
    if (!cy) return;
    if (kind === "fcose") {
      cy.layout({ name: "fcose", animate: false, nodeRepulsion: 7500, idealEdgeLength: 95 }).run();
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

  async function fetchCard(card) {
    if (STATE.cardCache.has(card)) return STATE.cardCache.get(card);
    const path = card.startsWith("../../../") ? card.replace("../../../", "../") : `data/cards/${card}`;
    const r = await fetch(path, { cache: "no-cache" });
    if (!r.ok) return `# 卡片缺失\n\n找不到：\`${path}\``;
    const txt = await r.text();
    STATE.cardCache.set(card, txt);
    return txt;
  }

  function parseFrontmatter(md) {
    const m = md.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!m) return { fm: {}, body: md };
    const fm = {};
    m[1].split("\n").forEach(line => {
      const mm = line.match(/^([a-zA-Z_]+):\s*(.*)$/);
      if (mm) fm[mm[1]] = mm[2].trim();
    });
    return { fm, body: m[2] };
  }

  async function renderCard(node) {
    const data = node.data();
    const md = await fetchCard(data.card);
    const { fm, body } = parseFrontmatter(md);
    const tier = (data.tier || fm.tier || "").replace(/['"]/g, "");
    const meta = `
      <div class="meta">
        <span class="badge ${tier}">${tier}</span>
        <span class="badge">${data.kind}</span>
        <span class="badge">${data.topic}</span>
        <span class="badge">${data.phase}</span>
        ${data.year ? `<span class="badge">${data.year}</span>` : ""}
      </div>`;
    const html = DOMPurify.sanitize(marked.parse(body, { breaks: false }));
    $("#cardTitle").textContent = data._label;
    $("#cardBody").innerHTML = meta + html;
    // re-route in-card markdown links into the SPA
    rewriteCardLinks($("#cardBody"));
    renderMathInElement($("#cardBody"), {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$",  right: "$",  display: false },
      ],
      throwOnError: false,
    });
    showTab("full");
    $("#rightbar").classList.add("open");
    $("#rightbar").setAttribute("aria-hidden", "false");
    STATE.selected = node.id();
    syncPermalink();
  }

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
            renderCard(node);
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
    $$(".rightbar .tab").forEach(t => t.classList.toggle("active", t.dataset.tab === name));
    if (!STATE.selected) return;
    const node = STATE.cy.$id(STATE.selected);
    if (!node || node.empty()) return;

    if (name === "full") {
      // re-render full body
      renderCard(node);
      return;
    }
    if (name === "links") {
      fetchCard(node.data("card")).then(md => {
        const { body } = parseFrontmatter(md);
        // crude extraction: lines containing http(s)://
        const links = [...body.matchAll(/\[([^\]]+)\]\((https?:[^\)]+)\)/g)]
          .map(m => `<li><a href="${m[2]}" target="_blank" rel="noopener">${m[1]}</a></li>`).join("");
        const fm = parseFrontmatter(md).fm;
        $("#cardBody").innerHTML = `<h2>深度链接 / Deep links</h2><ul>${links || "<li><em>本卡片暂无外链</em></li>"}</ul>`;
      });
      return;
    }
    if (name === "bibtex") {
      fetchCard(node.data("card")).then(md => {
        const m = md.match(/bibtex:\s*\|\s*([\s\S]*?)(?=\n[a-z_]+:|\n---)/);
        const bib = m ? m[1].trim() : "(no bibtex provided)";
        $("#cardBody").innerHTML = `
          <h2>BibTeX <button class="copybtn" id="copyBib">复制</button></h2>
          <pre><code>${bib.replace(/[<>&]/g, c => ({ '<':'&lt;','>':'&gt;','&':'&amp;' }[c]))}</code></pre>`;
        $("#copyBib").onclick = () => navigator.clipboard.writeText(bib);
      });
    }
  }

  function closeRight() {
    $("#rightbar").classList.remove("open");
    $("#rightbar").setAttribute("aria-hidden", "true");
    STATE.selected = null;
    syncPermalink();
  }

  function syncPermalink() {
    const p = {};
    if (STATE.selected) p.node = STATE.selected;
    if (STATE.playbook && STATE.playbook !== "ALL") p.playbook = STATE.playbook;
    setUrlParams(p);
  }

  // ---------------------------------------------------------------- node interactions

  function onNodeTap(evt) {
    const n = evt.target;
    if (window.AtlasCompare && window.AtlasCompare.handleSelect(evt.originalEvent, n)) return;
    renderCard(n);
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
    cy.batch(() => {
      cy.nodes().forEach(n => {
        const y = n.data("year") || 2000;
        const okYear = y <= yearMax;
        const okPhase = !phasesActive || STATE.activePhases.has(n.data("phase"));
        const okTopic = !topicsActive || STATE.activeTopics.has(n.data("topic"));
        const okTier = !tiersActive || STATE.activeTiers.has(n.data("tier"));
        const okPb = !pbSet || pbSet.has(n.id());
        const visible = okYear && okPhase && okTopic && okTier && okPb;
        n.toggleClass("dim", !visible);
      });
      cy.edges().forEach(e => {
        const dim = e.source().hasClass("dim") || e.target().hasClass("dim");
        e.toggleClass("dim", dim);
      });
    });
  }

  function buildTopicChips() {
    const wrap = $("#topicChips");
    Object.entries(STATE.graph.topic_palette).forEach(([t, color]) => {
      const b = document.createElement("button");
      b.className = "chip"; b.textContent = t;
      b.dataset.topic = t;
      b.style.setProperty("--chip-color", color);
      b.onclick = () => {
        if (STATE.activeTopics.has(t)) STATE.activeTopics.delete(t);
        else STATE.activeTopics.add(t);
        b.classList.toggle("active");
        applyFilters();
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
      };
    });
    $$("#tierChips .chip").forEach(b => {
      b.onclick = () => {
        const t = b.dataset.tier;
        if (STATE.activeTiers.has(t)) STATE.activeTiers.delete(t);
        else STATE.activeTiers.add(t);
        b.classList.toggle("active");
        applyFilters();
      };
    });
  }

  function bindPlaybooks() {
    $$(".pb").forEach(b => {
      b.onclick = () => {
        $$(".pb").forEach(x => x.classList.remove("active"));
        b.classList.add("active");
        STATE.playbook = b.dataset.pb;
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
      const q = search.value.trim().toLowerCase();
      const cy = STATE.cy;
      cy.batch(() => {
        cy.nodes().forEach(n => {
          const lab = (n.data("_label") || "").toLowerCase();
          const lab2 = (n.data("label") || "").toLowerCase();
          const id = (n.id() || "").toLowerCase();
          const hit = !q || lab.includes(q) || lab2.includes(q) || id.includes(q);
          n.toggleClass("dim", !hit);
        });
        cy.edges().forEach(e => {
          const dim = e.source().hasClass("dim") || e.target().hasClass("dim");
          e.toggleClass("dim", dim);
        });
      });
    }, 150));

    document.addEventListener("keydown", e => {
      if (e.key === "/" && document.activeElement !== search) {
        e.preventDefault(); search.focus();
      } else if (e.key === "Escape") {
        closeRight();
        if (window.AtlasCompare) window.AtlasCompare.disable();
      }
    });

    $("#layout").onchange = e => applyLayout(e.target.value);
    $("#resetBtn").onclick = () => {
      STATE.activeTopics.clear(); STATE.activePhases.clear(); STATE.activeTiers.clear();
      $$(".chip").forEach(c => c.classList.remove("active"));
      STATE.playbook = null;
      $$(".pb").forEach(c => c.classList.remove("active"));
      search.value = "";
      STATE.yearMax = 2026; $("#yearSlider").value = 2026; $("#yearLabel").textContent = "2026";
      applyFilters();
      STATE.cy.fit(undefined, 40);
      syncPermalink();
    };
    $("#closeRight").onclick = closeRight;
    $$(".rightbar .tab").forEach(t => t.onclick = () => showTab(t.dataset.tab));
    $("#compareBtn").onclick = () => window.AtlasCompare && window.AtlasCompare.toggle();
    $("#closeCompare").onclick = () => window.AtlasCompare && window.AtlasCompare.disable();
  }

  function bindTimeline() {
    const slider = $("#yearSlider");
    slider.oninput = () => {
      STATE.yearMax = Number(slider.value);
      $("#yearLabel").textContent = STATE.yearMax;
      applyFilters();
    };
    if (window.AtlasTimeline) window.AtlasTimeline.bindPlay($("#playYears"), slider, () => $("#yearLabel"));
  }

  function applyPermalink() {
    const p = urlParams();
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
        renderCard(n);
      }
    }
  }

  // ---------------------------------------------------------------- bootstrap

  document.addEventListener("DOMContentLoaded", async () => {
    const g = await loadGraph();
    STATE.cy = buildCy(buildElements(g));
    buildTopicChips();
    bindChips();
    bindPlaybooks();
    bindTopbar();
    bindTimeline();
    applyLayout("fcose");
    setTimeout(applyPermalink, 100); // wait for layout settle
    window.STATE = STATE; // expose for compare.js
  });
})();
