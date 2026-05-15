/* Debug fixes: resilient math rendering/copy, persistent node-neighborhood highlight, and theme toggle. */
(function () {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const STORAGE_KEY = "atlas-theme";
  const IGNORE_MATH_SELECTOR = "script,style,textarea,input,select,button,pre,code,kbd,samp,.katex,.math-copyable-inline,.math-source-box";
  const SELECTION_CLASSES = "selection-dim selection-focus selection-edge selection-root";

  let enhancingMath = false;
  let mathTimer = null;
  let selectedId = null;

  function copyText(text, feedbackEl) {
    const value = String(text || "");
    const done = () => showCopied(feedbackEl);
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(value).then(done).catch(() => fallbackCopy(value, done));
    } else {
      fallbackCopy(value, done);
    }
  }

  function fallbackCopy(value, done) {
    const ta = document.createElement("textarea");
    ta.value = value;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (_err) { /* best effort */ }
    ta.remove();
    done();
  }

  function showCopied(el) {
    if (!el) return;
    const button = el.matches && el.matches("button") ? el : el.querySelector && el.querySelector(".math-copy-btn");
    if (button) {
      const old = button.textContent;
      button.textContent = "已复制";
      window.setTimeout(() => { button.textContent = old || "复制公式"; }, 900);
      return;
    }
    el.classList.add("copied");
    window.setTimeout(() => el.classList.remove("copied"), 900);
  }

  function shouldSkipTextNode(node) {
    const parent = node.parentElement;
    if (!parent) return true;
    return Boolean(parent.closest(IGNORE_MATH_SELECTOR));
  }

  function makeFormulaElement(tex, display, raw) {
    const wrap = document.createElement(display ? "div" : "span");
    const holder = document.createElement(display ? "div" : "span");
    wrap.className = display ? "math-source-box math-copyable-display" : "math-source-box math-copyable-inline";
    wrap.dataset.tex = tex;
    wrap.title = "点击复制 LaTeX 源码";
    try {
      if (!window.katex) throw new Error("KaTeX is not loaded");
      window.katex.render(tex, holder, {
        displayMode: display,
        throwOnError: false,
        strict: "ignore",
        trust: false,
      });
    } catch (_err) {
      wrap.classList.add("math-render-error");
      holder.textContent = raw || tex;
    }
    wrap.appendChild(holder);
    if (display) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "math-copy-btn";
      btn.textContent = "复制公式";
      btn.setAttribute("aria-label", "复制 LaTeX 公式源码");
      btn.onclick = e => { e.stopPropagation(); copyText(tex, btn); };
      wrap.appendChild(btn);
    }
    return wrap;
  }

  function splitMathText(text) {
    const parts = [];
    const re = /(\\\[([\s\S]+?)\\\]|\\\(([\s\S]+?)\\\)|\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$)/g;
    let last = 0;
    let m;
    while ((m = re.exec(text)) !== null) {
      const raw = m[0];
      const before = text[m.index - 1];
      if (before === "\\") continue;
      const tex = (m[2] || m[3] || m[4] || m[5] || "").trim();
      const display = raw.startsWith("$$") || raw.startsWith("\\[");
      if (!tex) continue;
      if (m.index > last) parts.push({ type: "text", value: text.slice(last, m.index) });
      parts.push({ type: "math", tex, display, raw });
      last = m.index + raw.length;
    }
    if (last < text.length) parts.push({ type: "text", value: text.slice(last) });
    return parts.length > 1 ? parts : null;
  }

  function renderPlainTextMath(root) {
    if (!window.katex) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (shouldSkipTextNode(node)) return NodeFilter.FILTER_REJECT;
        return /\$|\\\(|\\\[/.test(node.nodeValue || "") ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      const parts = splitMathText(node.nodeValue || "");
      if (!parts) return;
      const frag = document.createDocumentFragment();
      parts.forEach(part => {
        if (part.type === "text") frag.appendChild(document.createTextNode(part.value));
        else frag.appendChild(makeFormulaElement(part.tex, part.display, part.raw));
      });
      node.parentNode.replaceChild(frag, node);
    });
  }

  function autoRenderMath(root) {
    if (!window.renderMathInElement) return;
    try {
      window.renderMathInElement(root, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "\\[", right: "\\]", display: true },
          { left: "\\(", right: "\\)", display: false },
          { left: "$", right: "$", display: false },
        ],
        ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code", "option"],
        throwOnError: false,
        strict: "ignore",
        trust: false,
      });
    } catch (_err) {
      // Fall back to the custom text-node renderer below.
    }
  }

  function extractTex(katexEl) {
    const annotation = katexEl.querySelector("annotation[encoding='application/x-tex']");
    return annotation ? annotation.textContent.trim() : "";
  }

  function attachCopyControls(root) {
    root.querySelectorAll(".katex").forEach(katexEl => {
      if (katexEl.dataset.copyReady === "1") return;
      const tex = extractTex(katexEl);
      if (!tex) return;
      katexEl.dataset.copyReady = "1";
      const display = katexEl.closest(".katex-display");
      if (display) {
        display.classList.add("math-copyable-display");
        display.dataset.tex = tex;
        display.title = "点击复制 LaTeX 源码";
        if (!display.querySelector(":scope > .math-copy-btn")) {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "math-copy-btn";
          btn.textContent = "复制公式";
          btn.setAttribute("aria-label", "复制 LaTeX 公式源码");
          btn.onclick = e => { e.stopPropagation(); copyText(tex, btn); };
          display.appendChild(btn);
        }
      } else {
        katexEl.classList.add("math-copyable-inline");
        katexEl.dataset.tex = tex;
        katexEl.title = "点击复制 LaTeX 源码";
      }
    });
  }

  function enhanceMathRoot(root) {
    if (!root || enhancingMath) return;
    enhancingMath = true;
    autoRenderMath(root);
    renderPlainTextMath(root);
    attachCopyControls(root);
    enhancingMath = false;
  }

  function scheduleMathEnhance() {
    clearTimeout(mathTimer);
    mathTimer = window.setTimeout(() => {
      ["#cardBody", "#cmpA", "#cmpB"].forEach(sel => enhanceMathRoot($(sel)));
    }, 40);
  }

  function bindMathObserver() {
    scheduleMathEnhance();
    ["#cardBody", "#cmpA", "#cmpB"].forEach(sel => {
      const el = $(sel);
      if (!el) return;
      const observer = new MutationObserver(() => {
        if (!enhancingMath) scheduleMathEnhance();
      });
      observer.observe(el, { childList: true, subtree: true, characterData: true });
    });
    document.addEventListener("click", e => {
      const target = e.target.closest && e.target.closest(".math-copyable-inline,.math-copyable-display,.math-source-box");
      if (!target || e.target.closest("button")) return;
      const tex = target.dataset.tex || extractTex(target.querySelector(".katex") || target);
      if (tex) {
        e.stopPropagation();
        copyText(tex, target);
      }
    });
  }

  function setButtonLabel(btn, theme) {
    if (!btn) return;
    btn.textContent = theme === "light" ? "☾ 深色" : "☀ 浅色";
    btn.setAttribute("aria-pressed", String(theme === "light"));
    btn.title = theme === "light" ? "切换到深色模式" : "切换到浅色模式";
  }

  function installThemeToggle() {
    let btn = $("#themeToggle");
    if (!btn) {
      btn = document.createElement("button");
      btn.id = "themeToggle";
      btn.className = "theme-toggle";
      btn.type = "button";
      btn.setAttribute("aria-label", "切换深色或浅色模式");
      const reset = $("#resetBtn");
      if (reset) reset.insertAdjacentElement("afterend", btn);
      else $(".topbar-actions")?.appendChild(btn);
    }
    const preferred = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    const saved = localStorage.getItem(STORAGE_KEY);
    applyTheme(saved || preferred, false);
    btn.onclick = () => applyTheme(document.documentElement.dataset.theme === "light" ? "dark" : "light", true);
  }

  function applyTheme(theme, persist) {
    const normalized = theme === "light" ? "light" : "dark";
    document.documentElement.dataset.theme = normalized;
    if (persist) localStorage.setItem(STORAGE_KEY, normalized);
    setButtonLabel($("#themeToggle"), normalized);
    updateCyTheme(normalized);
  }

  function updateCyTheme(theme) {
    const cy = window.STATE && window.STATE.cy;
    if (!cy || !cy.style) return;
    const light = theme === "light";
    try {
      cy.style()
        .selector("node")
        .style({
          "color": light ? "#1e293b" : "#e6ecff",
          "text-outline-color": light ? "#f8fafc" : "#0b1020",
        })
        .update();
    } catch (_err) { /* Cytoscape may not be initialized yet. */ }
  }

  function installSelectionStyles(cy) {
    if (!cy || cy.scratch("selectionStylesInstalled")) return;
    cy.scratch("selectionStylesInstalled", true);
    cy.style()
      .selector("node.selection-dim")
      .style({ "opacity": 0.12, "text-opacity": 0.15, "background-blacken": 0.45 })
      .selector("edge.selection-dim")
      .style({ "opacity": 0.04 })
      .selector("node.selection-focus")
      .style({ "opacity": 1, "text-opacity": 1, "background-blacken": -0.08 })
      .selector("node.selection-root")
      .style({ "border-color": "#ff8a3d", "border-width": 7, "background-blacken": -0.18 })
      .selector("edge.selection-edge")
      .style({ "opacity": 1, "width": 3.4, "z-index": 999 })
      .update();
  }

  function clearSelectionHighlight() {
    const cy = window.STATE && window.STATE.cy;
    if (!cy) return;
    selectedId = null;
    cy.batch(() => cy.elements().removeClass(SELECTION_CLASSES));
  }

  function highlightSelection(node) {
    const cy = window.STATE && window.STATE.cy;
    if (!cy || !node || node.empty()) {
      clearSelectionHighlight();
      return;
    }
    installSelectionStyles(cy);
    selectedId = node.id();
    cy.batch(() => {
      cy.elements().removeClass(SELECTION_CLASSES);
      cy.elements().addClass("selection-dim");
      node.closedNeighborhood().removeClass("selection-dim").addClass("selection-focus");
      node.connectedEdges().removeClass("selection-dim").addClass("selection-edge");
      node.addClass("selection-root");
    });
  }

  function syncSelectionFromState() {
    const cy = window.STATE && window.STATE.cy;
    if (!cy) return;
    const nextId = window.STATE && window.STATE.selected;
    if (!nextId) {
      if (selectedId) clearSelectionHighlight();
      return;
    }
    if (nextId !== selectedId) {
      const node = cy.$id(nextId);
      if (node && !node.empty()) highlightSelection(node);
    }
  }

  function bindSelectionHighlight() {
    const cy = window.STATE && window.STATE.cy;
    if (!cy || cy.scratch("selectionHighlightBound")) return;
    cy.scratch("selectionHighlightBound", true);
    installSelectionStyles(cy);
    updateCyTheme(document.documentElement.dataset.theme || "dark");
    cy.on("tap", "node", evt => highlightSelection(evt.target));
    cy.on("tap", evt => { if (evt.target === cy) clearSelectionHighlight(); });
    document.addEventListener("keydown", e => { if (e.key === "Escape") clearSelectionHighlight(); });
    $("#closeRight")?.addEventListener("click", clearSelectionHighlight);
    $("#resetBtn")?.addEventListener("click", clearSelectionHighlight);
    window.setInterval(syncSelectionFromState, 250);
  }

  function whenAtlasReady(fn) {
    const timer = window.setInterval(() => {
      if (window.STATE && window.STATE.cy) {
        window.clearInterval(timer);
        fn();
      }
    }, 50);
  }

  document.addEventListener("DOMContentLoaded", () => {
    installThemeToggle();
    bindMathObserver();
    whenAtlasReady(() => {
      bindSelectionHighlight();
      updateCyTheme(document.documentElement.dataset.theme || "dark");
      scheduleMathEnhance();
    });
  });
})();
