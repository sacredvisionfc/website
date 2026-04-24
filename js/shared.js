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

// ── SITE SEARCH ──────────────────────────────────────
(function () {
  const INDEX = [
    { t: "Register for Summer Camp 2026", p: "Pricing", u: "pricing.html?register=1", s: "Submit your registration with player details, dates, and deposit.", k: "register signup enroll apply join application form deposit" },
    { t: "Daily Rate & Pricing", p: "Pricing", u: "pricing.html#pricing", s: "Local and international daily rates. USD, GBP, EUR, GHS accepted.", k: "price cost rate fees how much usd gbp eur ghs cedis" },
    { t: "How to Pay", p: "Pricing", u: "pricing.html#how-to-pay", s: "Mobile Money, card, or bank transfer. MTN MoMo, Visa, Mastercard.", k: "pay payment momo mobile money card bank transfer paystack visa mastercard" },
    { t: "Programme Overview", p: "Programme", u: "programme.html", s: "Six days a week of training, tactical sessions, and competitive matches.", k: "programme program training schedule sessions coaching tactics" },
    { t: "Daily Schedule", p: "Programme", u: "programme.html#schedule", s: "Hour-by-hour training, meals, recovery, and rest days.", k: "schedule timetable daily routine hours timing morning afternoon" },
    { t: "Safeguarding & Safety", p: "Programme", u: "programme.html#safety", s: "24/7 supervision, safeguarding lead, on-site first aid.", k: "safety safeguarding protection welfare security first aid medical" },
    { t: "Programme FAQs", p: "Programme", u: "programme.html#faq", s: "Common questions about training, matches, and expectations.", k: "faq questions answers help common" },
    { t: "Accommodation & Board", p: "Pricing", u: "pricing.html", s: "Gated on-campus rooms, meals, and Wi-Fi included in overseas package.", k: "accommodation lodging housing rooms stay sleep meals food board" },
    { t: "Weekend Adventures in Ghana", p: "Experience", u: "experience.html", s: "Cape Coast Castle, Kakum Canopy, Elmina, cultural excursions.", k: "weekend adventure excursion tourism cape coast kakum elmina culture" },
    { t: "Getting to Camp", p: "Home", u: "index.html#travel", s: "Fly into Accra International Airport. Airport pickup included.", k: "airport accra acc flight transport travel pickup getting there" },
    { t: "Coaching Staff", p: "Coaches", u: "coaches.html", s: "Vincent Amoah, Simon Kojo Antwi, George Taylor, and more.", k: "coaches staff trainers team vincent simon george alfred physio" },
    { t: "Mr. Vincent Amoah – Technical Director", p: "Coaches", u: "coaches.html#vincent", s: "Founder and Technical Director with 9+ years player development.", k: "vincent amoah technical director founder head" },
    { t: "Coaching Vacancies", p: "Coaches", u: "coaches.html#vacancies", s: "Open roles for youth and senior coaches. Apply with CV.", k: "vacancies jobs careers apply hiring open roles coach position" },
    { t: "About SVFA", p: "Home", u: "index.html#about", s: "GFA-registered academy in Winneba, Central Region, Ghana.", k: "about who what sacred vision winneba ghana gfa crfa" },
    { t: "Player Pathway", p: "Home", u: "index.html#pathway", s: "How players move from grassroots talent to professional contracts.", k: "pathway progression career professional pro signed trial" },
    { t: "Testimonials", p: "Home", u: "index.html#testimonials", s: "Hear from players, parents, and graduates of the academy.", k: "testimonial reviews quotes players parents stories experience" },
    { t: "Contact Us", p: "Home", u: "index.html#contact", s: "WhatsApp, phone, email. Based in Winneba, Central Region.", k: "contact reach call phone whatsapp email address location" },
    { t: "Frequently Asked Questions", p: "Home", u: "index.html#faq", s: "Eligibility, logistics, safety, refunds, visa, insurance.", k: "faq question answer help refund visa insurance eligibility" },
    { t: "Instagram Gallery", p: "Gallery", u: "gallery.html", s: "Match photos, training moments, and behind-the-scenes.", k: "gallery photos pictures instagram media social visual" },
    { t: "Success Stories", p: "Gallery", u: "gallery.html#success", s: "Players signed to professional clubs.", k: "success signed pro professional story career" },
    { t: "Latest News & Blog", p: "Blog", u: "blog.html", s: "Match reports, partnership announcements, academy updates.", k: "blog news articles posts stories updates announcements" },
    { t: "Partners & Affiliations", p: "Home", u: "index.html#partners", s: "GFA, CRFA, Alicante, Nastic, Cordoba, and more.", k: "partners affiliations sponsors gfa crfa alicante nastic cordoba" },
  ];

  function ensureModal() {
    let modal = document.getElementById("searchModal");
    if (modal) return modal;
    modal = document.createElement("div");
    modal.id = "searchModal";
    modal.className = "search-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", "Search site");
    modal.innerHTML =
      '<div class="search-box">' +
        '<div class="search-input-wrap">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>' +
          '<input class="search-input" id="searchInput" type="search" placeholder="Search the academy…" autocomplete="off" aria-label="Search input" />' +
          '<span class="search-kbd">ESC</span>' +
        '</div>' +
        '<div class="search-results" id="searchResults" role="listbox"></div>' +
        '<div class="search-footer"><span>↑↓ navigate · ↵ open</span><span>' + INDEX.length + ' entries</span></div>' +
      '</div>';
    document.body.appendChild(modal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeSearch();
    });
    return modal;
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function highlight(text, query) {
    if (!query) return escapeHtml(text);
    const safe = escapeHtml(text);
    const q = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return safe.replace(new RegExp("(" + q + ")", "ig"), "<mark>$1</mark>");
  }

  function scoreEntry(entry, q) {
    const hay = (entry.t + " " + entry.s + " " + entry.k + " " + entry.p).toLowerCase();
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    let score = 0;
    for (const term of terms) {
      if (!hay.includes(term)) return 0;
      if (entry.t.toLowerCase().includes(term)) score += 3;
      if (entry.k.toLowerCase().includes(term)) score += 2;
      if (entry.s.toLowerCase().includes(term)) score += 1;
    }
    return score;
  }

  function renderResults(q) {
    const results = document.getElementById("searchResults");
    if (!q.trim()) {
      const top = INDEX.slice(0, 6);
      results.innerHTML = top.map((e, i) => resultHtml(e, "", i === 0)).join("");
      return top;
    }
    const scored = INDEX.map((e) => ({ e, s: scoreEntry(e, q) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 10);
    if (!scored.length) {
      results.innerHTML = '<div class="search-empty">No matches for "' + escapeHtml(q) + '". Try another term.</div>';
      return [];
    }
    results.innerHTML = scored.map((x, i) => resultHtml(x.e, q, i === 0)).join("");
    return scored.map((x) => x.e);
  }

  function resultHtml(e, q, active) {
    return (
      '<a class="search-result' + (active ? " active" : "") + '" href="' + e.u + '" role="option">' +
        '<div class="search-result-meta">' + escapeHtml(e.p) + '</div>' +
        '<div class="search-result-title">' + highlight(e.t, q) + '</div>' +
        '<div class="search-result-snippet">' + highlight(e.s, q) + '</div>' +
      '</a>'
    );
  }

  function openSearch() {
    const m = ensureModal();
    m.classList.add("active");
    const input = document.getElementById("searchInput");
    input.value = "";
    renderResults("");
    setTimeout(() => input.focus(), 20);
  }

  function closeSearch() {
    const m = document.getElementById("searchModal");
    if (m) m.classList.remove("active");
  }

  function moveActive(dir) {
    const items = document.querySelectorAll(".search-result");
    if (!items.length) return;
    let idx = -1;
    items.forEach((n, i) => { if (n.classList.contains("active")) idx = i; });
    items.forEach((n) => n.classList.remove("active"));
    idx = (idx + dir + items.length) % items.length;
    items[idx].classList.add("active");
    items[idx].scrollIntoView({ block: "nearest" });
  }

  document.addEventListener("keydown", (e) => {
    const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
    const meta = isMac ? e.metaKey : e.ctrlKey;
    if (meta && e.key.toLowerCase() === "k") {
      e.preventDefault();
      openSearch();
      return;
    }
    if (e.key === "/" && !/input|textarea/i.test(document.activeElement?.tagName || "")) {
      e.preventDefault();
      openSearch();
      return;
    }
    const modal = document.getElementById("searchModal");
    if (!modal || !modal.classList.contains("active")) return;
    if (e.key === "Escape") { closeSearch(); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); moveActive(1); return; }
    if (e.key === "ArrowUp") { e.preventDefault(); moveActive(-1); return; }
    if (e.key === "Enter") {
      const active = document.querySelector(".search-result.active");
      if (active) { e.preventDefault(); window.location.href = active.getAttribute("href"); }
    }
  });

  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("#searchBtn, [data-search-trigger]");
    if (trigger) { e.preventDefault(); openSearch(); }
  });

  document.addEventListener("input", (e) => {
    if (e.target.id === "searchInput") renderResults(e.target.value);
  });
})();
