/* Compare mode — Shift-click two nodes to see their cards side-by-side. */
(function () {
  "use strict";
  const $ = sel => document.querySelector(sel);

  const M = {
    enabled: false,
    slots: [null, null],
  };

  async function fetchAndShow(node, slotEl) {
    if (!node) { slotEl.innerHTML = "<em>等待选择…</em>"; return; }
    const data = node.data();
    const card = data.card;
    const path = card.startsWith("../../../") ? card.replace("../../../", "../") : `data/cards/${card}`;
    const r = await fetch(path, { cache: "no-cache" });
    const md = await r.text();
    const fmEnd = md.indexOf("\n---\n", 4);
    const body = fmEnd > 0 ? md.slice(fmEnd + 5) : md;
    slotEl.innerHTML =
      `<h3>${data.label_zh || data.label}</h3>
       <div class="meta">
         <span class="badge">${data.kind}</span>
         <span class="badge">${data.tier}</span>
         <span class="badge">${data.topic}</span>
         ${data.year ? `<span class="badge">${data.year}</span>` : ""}
       </div>` +
      DOMPurify.sanitize(marked.parse(body, { breaks: false }));
    if (window.renderMathInElement) {
      window.renderMathInElement(slotEl, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false },
        ],
        throwOnError: false,
      });
    }
  }

  function refresh() {
    fetchAndShow(M.slots[0], $("#cmpA"));
    fetchAndShow(M.slots[1], $("#cmpB"));
  }

  function open() {
    $("#comparepane").classList.add("open");
    $("#comparepane").setAttribute("aria-hidden", "false");
  }
  function close() {
    $("#comparepane").classList.remove("open");
    $("#comparepane").setAttribute("aria-hidden", "true");
  }

  window.AtlasCompare = {
    toggle() {
      M.enabled = !M.enabled;
      if (M.enabled) {
        M.slots = [null, null];
        refresh();
        open();
      } else {
        close();
      }
    },
    disable() { M.enabled = false; close(); },
    handleSelect(domEvent, node) {
      if (!M.enabled) return false;
      const shift = domEvent && domEvent.shiftKey;
      // In compare mode, every click goes into a slot (not opening rightbar)
      const slot = M.slots[0] ? 1 : 0;
      M.slots[slot] = node;
      if (slot === 1 || shift) {
        // both filled (or shift forced second slot): refresh and stay
        refresh();
      } else {
        refresh();
      }
      return true;
    }
  };
})();
