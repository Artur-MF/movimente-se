(() => {
  try {
    const savedTheme = localStorage.getItem("movimente-se-theme");
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    document.documentElement.dataset.theme = savedTheme || systemTheme;
  } catch {
    document.documentElement.dataset.theme = "light";
  }
})();

document.addEventListener("DOMContentLoaded", () => {
  window.addEventListener("pageshow", () => document.documentElement.classList.remove("page-leaving"));
  const themeButtons = [...document.querySelectorAll(".theme-toggle")];
  const themeColor = document.querySelector('meta[name="theme-color"]');

  function updateThemeControls() {
    const isDark = document.documentElement.dataset.theme === "dark";
    const action = isDark ? "Ativar tema claro" : "Ativar tema escuro";
    themeButtons.forEach((button) => {
      button.setAttribute("aria-label", action);
      button.setAttribute("title", action);
      button.setAttribute("aria-pressed", String(isDark));
    });
    themeColor?.setAttribute("content", isDark ? "#0B1512" : "#176B4A");
  }

  function setTheme(theme, persist = true) {
    document.documentElement.dataset.theme = theme;
    if (persist) {
      try { localStorage.setItem("movimente-se-theme", theme); } catch { /* Preferência apenas nesta página. */ }
    }
    updateThemeControls();
  }

  themeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      setTheme(nextTheme);
    });
  });
  updateThemeControls();

  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");
  const backdrop = document.querySelector(".menu-backdrop");
  const siteHeader = document.querySelector(".site-header");
  const menuBackground = [...document.querySelectorAll("main, .site-footer, .site-header .brand, .site-header .theme-toggle, .site-header .header-cta")];
  let previouslyFocused = null;

  let headerFrameRequested = false;
  function updateHeaderState() {
    siteHeader?.classList.toggle("is-scrolled", window.scrollY > 12);
    headerFrameRequested = false;
  }
  updateHeaderState();
  window.addEventListener("scroll", () => {
    if (headerFrameRequested) return;
    headerFrameRequested = true;
    window.requestAnimationFrame(updateHeaderState);
  }, { passive: true });

  const focusableMenuItems = () => nav && menuButton
    ? [...nav.querySelectorAll('a[href], button:not([disabled])'), menuButton]
    : [];

  function setMenuBackgroundInert(inert) {
    menuBackground.forEach((element) => { element.inert = inert; });
  }

  function openMenu() {
    if (!menuButton || !nav || !backdrop) return;
    previouslyFocused = document.activeElement;
    menuButton.setAttribute("aria-expanded", "true");
    menuButton.setAttribute("aria-label", "Fechar menu");
    nav.classList.add("is-open");
    backdrop.classList.add("is-open");
    document.body.classList.add("menu-open");
    setMenuBackgroundInert(true);
    focusableMenuItems()[0]?.focus();
  }

  function closeMenu({ restoreFocus = true } = {}) {
    if (!menuButton || !nav || !backdrop) return;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Abrir menu");
    nav.classList.remove("is-open");
    backdrop.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    setMenuBackgroundInert(false);
    if (restoreFocus) previouslyFocused?.focus();
  }

  menuButton?.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    isOpen ? closeMenu() : openMenu();
  });

  backdrop?.addEventListener("click", () => closeMenu());
  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => closeMenu({ restoreFocus: false }));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav?.classList.contains("is-open")) {
      closeMenu();
      return;
    }

    if (event.key !== "Tab" || !nav?.classList.contains("is-open")) return;
    const items = focusableMenuItems();
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 960 && nav?.classList.contains("is-open")) {
      closeMenu({ restoreFocus: false });
    }
  });

  const pageTransitionLinks = [...document.querySelectorAll("a[href]")].filter((link) => {
    if (link.target === "_blank" || link.hasAttribute("download")) return false;
    const destination = new URL(link.href, window.location.href);
    return destination.origin === window.location.origin
      && destination.pathname.endsWith(".html")
      && destination.pathname !== window.location.pathname;
  });

  pageTransitionLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      document.documentElement.classList.add("page-leaving");
      window.setTimeout(() => window.location.assign(link.href), 180);
    });
  });

  const tabs = [...document.querySelectorAll("[role='tab'][data-team-tab]")];
  const panels = [...document.querySelectorAll("[role='tabpanel'][data-team-panel]")];

  function selectTeamTab(tab, moveFocus = false) {
    const panelId = tab.getAttribute("aria-controls");
    let selectedPanel = null;
    tabs.forEach((item) => {
      const selected = item === tab;
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    panels.forEach((panel) => {
      panel.hidden = panel.id !== panelId;
      if (!panel.hidden) selectedPanel = panel;
    });
    window.requestAnimationFrame(() => {
      selectedPanel?.querySelectorAll(".reveal-ready").forEach((card) => card.classList.add("is-visible"));
    });
    if (moveFocus) tab.focus();
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectTeamTab(tab));
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      let nextIndex = index;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = tabs.length - 1;
      selectTeamTab(tabs[nextIndex], true);
    });
  });

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion && "IntersectionObserver" in window) {
    const revealTargets = [...document.querySelectorAll([
      ".section-heading",
      ".activity-card",
      ".activity-group__header",
      ".impact-item",
      ".step",
      ".info-card",
      ".split__media",
      ".institutional-banner",
      ".timeline article",
      ".team-directory__top",
      ".team-tabs",
      ".person-card",
      ".cta-band__inner"
    ].join(","))];

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    revealTargets.forEach((element) => {
      const localIndex = [...element.parentElement.children].indexOf(element);
      element.classList.add("reveal-ready", `reveal-delay-${Math.max(0, localIndex) % 4}`);
      const bounds = element.getBoundingClientRect();
      if (element.offsetParent !== null && bounds.top < window.innerHeight * 0.92) {
        element.classList.add("is-visible");
      } else {
        revealObserver.observe(element);
      }
    });
  }

  document.querySelectorAll("[data-current-year]").forEach((item) => {
    item.textContent = new Date().getFullYear();
  });
});
