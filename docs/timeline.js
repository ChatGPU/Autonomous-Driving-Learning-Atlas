/* Timeline auto-play: press ▶ to animate yearMax from min to max. */
(function () {
  "use strict";
  const T = { handle: null };
  window.AtlasTimeline = {
    bindPlay(playBtn, slider, labelGetter) {
      playBtn.onclick = () => {
        if (T.handle) {
          clearInterval(T.handle); T.handle = null;
          playBtn.textContent = "▶ 播放";
          return;
        }
        const min = Number(slider.min || 2010);
        const max = Number(slider.max || 2026);
        slider.value = min;
        slider.dispatchEvent(new Event("input"));
        playBtn.textContent = "⏸ 暂停";
        T.handle = setInterval(() => {
          let v = Number(slider.value);
          v = v >= max ? min : v + 1;
          slider.value = v;
          if (labelGetter) labelGetter().textContent = v;
          slider.dispatchEvent(new Event("input"));
          if (v === max) {
            // pause briefly, then loop
          }
        }, 450);
      };
    },
  };
})();
