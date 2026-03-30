// ── COUNTDOWN TIMER ──────────────────────────────────
(function countdown() {
  const target = new Date("2026-06-15T08:00:00+00:00").getTime();
  function tick() {
    const now = Date.now();
    const diff = target - now;
    if (diff <= 0) {
      document.getElementById("cd-days").textContent = "0";
      document.getElementById("cd-hours").textContent = "0";
      document.getElementById("cd-mins").textContent = "0";
      document.getElementById("cd-secs").textContent = "0";
      return;
    }
    document.getElementById("cd-days").textContent = Math.floor(
      diff / 86400000,
    );
    document.getElementById("cd-hours").textContent = Math.floor(
      (diff % 86400000) / 3600000,
    );
    document.getElementById("cd-mins").textContent = Math.floor(
      (diff % 3600000) / 60000,
    );
    document.getElementById("cd-secs").textContent = Math.floor(
      (diff % 60000) / 1000,
    );
  }
  tick();
  setInterval(tick, 1000);
})();
