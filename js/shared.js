// ── THEME TOGGLE ─────────────────────────────────────
(function () {
  const toggle = document.getElementById("themeToggle");
  if (!toggle) return;
  const root = document.documentElement;
  const saved = localStorage.getItem("svfa-theme") || "dark";
  if (saved === "light") {
    root.setAttribute("data-theme", "light");
    toggle.textContent = "\u2600\uFE0F";
  }
  toggle.addEventListener("click", () => {
    const isLight = root.getAttribute("data-theme") === "light";
    if (isLight) {
      root.removeAttribute("data-theme");
      toggle.textContent = "\uD83C\uDF19";
      localStorage.setItem("svfa-theme", "dark");
    } else {
      root.setAttribute("data-theme", "light");
      toggle.textContent = "\u2600\uFE0F";
      localStorage.setItem("svfa-theme", "light");
    }
  });
})();

// ── SCROLL REVEAL ─────────────────────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        revealObserver.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 },
);
document
  .querySelectorAll(".reveal")
  .forEach((el) => revealObserver.observe(el));

// ── LAZY IFRAME LOADER ──────────────────────────────────
const iframeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        if (e.target.dataset.src) {
          e.target.src = e.target.dataset.src;
        }
        iframeObserver.unobserve(e.target);
      }
    });
  },
  { rootMargin: "200px" },
);
document.querySelectorAll(".lazy-iframe").forEach((f) => iframeObserver.observe(f));

// ── MOBILE HAMBURGER ──────────────────────────────────
const hamburger = document.getElementById("hamburger");
const navLinks = document.querySelector(".nav-links");
if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    navLinks.classList.toggle("open");
  });
  navLinks.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      hamburger.classList.remove("open");
      navLinks.classList.remove("open");
    });
  });
}

// ── SCROLL SPY (only for same-page hash links) ────────
const spySections = document.querySelectorAll("section[id], div[id]");
const spyLinks = document.querySelectorAll('.nav-links a[href^="#"]');
if (spyLinks.length > 0) {
  window.addEventListener(
    "scroll",
    () => {
      let current = "";
      spySections.forEach((s) => {
        if (window.scrollY >= s.offsetTop - 80) current = s.id;
      });
      spyLinks.forEach((a) => {
        a.classList.remove("active");
        if (a.getAttribute("href") === "#" + current)
          a.classList.add("active");
      });
    },
    { passive: true },
  );
}

// ── LEGAL MODAL CLOSE (Terms & Privacy) ───────────────
document.querySelectorAll(".legal-overlay").forEach((overlay) => {
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.classList.remove("active");
  });
});
document.querySelectorAll(".legal-close").forEach((btn) => {
  btn.addEventListener("click", () =>
    btn.closest(".legal-overlay").classList.remove("active"),
  );
});

// ── ESCAPE KEY closes any open modal ──────────────────
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.querySelectorAll(".legal-overlay.active, .vacancy-overlay.active").forEach((m) => {
      m.classList.remove("active");
    });
  }
});

// ── FAQ ACCORDION (if present on page) ────────────────
document.querySelectorAll(".faq-q").forEach((q) => {
  function toggle() {
    const item = q.closest(".faq-item");
    const isOpen = item.classList.contains("open");
    document
      .querySelectorAll(".faq-item")
      .forEach((i) => i.classList.remove("open"));
    if (!isOpen) item.classList.add("open");
  }
  q.addEventListener("click", toggle);
  q.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  });
});

// ── STATS COUNTER ANIMATION (if present) ─────────────
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        const el = e.target;
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || "";
        let current = 0;
        const step = Math.max(1, Math.floor(target / 60));
        const interval = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(interval);
          }
          el.textContent = current + suffix;
        }, 25);
        statsObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.5 },
);
document
  .querySelectorAll(".sb-num")
  .forEach((el) => statsObserver.observe(el));
