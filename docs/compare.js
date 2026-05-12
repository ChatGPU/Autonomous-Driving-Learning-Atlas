/* Compare mode — click the compare button or Shift-click nodes to compare cards side-by-side. */
(function () {
  "use strict";
  const $ = sel => document.querySelector(sel);

  const M = {
    enabled: false,
    slots: [null, null],
    cursor: 0,
  };

  async function fetchAndShow(node, slotEl) {
    if (!node) { slotEl.innerHTML = "<em>等待选择…</em>"; return; }
    slotEl.innerHTML = "<em>正在整理这张卡片…</em>";
    try {
      if (window.AtlasCards && window.AtlasCards.renderNodePreview) {
        slotEl.innerHTML = await window.AtlasCards.renderNodePreview(node);
      } else {
        const data = node.data();
        slotEl.innerHTML = `<h3>${data.label_zh || data.label}</h3><p><em>卡片渲染器还在加载，请稍后再试。</em></p>`;
      }
    } catch (err) {
      slotEl.innerHTML = `<h3>${node.data("label_zh") || node.data("label")}</h3><p><em>这张卡片暂时没有加载出来：${err.message}</em></p>`;
    }
  }

  function refresh() {
    fetchAndShow(M.slots[0], $("#cmpA"));
    fetchAndShow(M.slots[1], $("#cmpB"));
  }

  function open() {
    M.enabled = true;
    $("#comparepane").classList.add("open");
    $("#comparepane").setAttribute("aria-hidden", "false");
  }
  function close() {
    M.enabled = false;
    $("#comparepane").classList.remove("open");
    $("#comparepane").setAttribute("aria-hidden", "true");
  }
  function selectNode(node) {
    if (!M.slots[0]) {
      M.slots[0] = node;
      M.cursor = 1;
    } else if (!M.slots[1]) {
      M.slots[1] = node;
      M.cursor = 0;
    } else {
      M.slots[M.cursor] = node;
      M.cursor = M.cursor ? 0 : 1;
    }
    refresh();
  }

  window.AtlasCompare = {
    toggle() {
      if (!M.enabled) {
        M.slots = [null, null];
        M.cursor = 0;
        refresh();
        open();
      } else {
        close();
      }
    },
    disable() { close(); },
    clear() { M.slots = [null, null]; M.cursor = 0; refresh(); },
    handleSelect(domEvent, node) {
      const shift = domEvent && domEvent.shiftKey;
      if (!M.enabled && !shift) return false;
      if (!M.enabled && shift) {
        M.slots = [null, null];
        M.cursor = 0;
        open();
      }
      selectNode(node);
      return true;
    }
  };
})();
