(() => {
  "use strict";

  const root = document.documentElement;
  const menuButton = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".nav-links");
  const languageButtons = document.querySelectorAll("[data-language-option]");
  const backToTop = document.querySelector(".back-to-top");
  const footer = document.querySelector(".site-footer");

  const readLanguage = () => {
    try { return localStorage.getItem("hoby-site-language") || "fr"; }
    catch (_) { return "fr"; }
  };

  const saveLanguage = (language) => {
    try { localStorage.setItem("hoby-site-language", language); }
    catch (_) { /* The site still works when storage is unavailable. */ }
  };

  const setLanguage = (language) => {
    const selected = language === "en" ? "en" : "fr";
    root.lang = selected;
    root.dataset.language = selected;
    saveLanguage(selected);
    languageButtons.forEach((button) => {
      const active = button.dataset.languageOption === selected;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    document.title = selected === "fr"
      ? (document.body.dataset.titleFr || document.title)
      : (document.body.dataset.titleEn || document.title);
  };

  languageButtons.forEach((button) => {
    button.addEventListener("click", () => setLanguage(button.dataset.languageOption));
  });
  setLanguage(readLanguage());

  const closeMenu = () => {
    if (!menuButton || !menu) return;
    menuButton.setAttribute("aria-expanded", "false");
    menu.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  };

  menuButton?.addEventListener("click", () => {
    const willOpen = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(willOpen));
    menu?.classList.toggle("is-open", willOpen);
    document.body.classList.toggle("menu-open", willOpen);
  });
  menu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMenu(); });
  window.addEventListener("resize", () => { if (window.innerWidth > 820) closeMenu(); });

  const updateHeader = () => document.querySelector(".site-header")?.classList.toggle("is-scrolled", scrollY > 16);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  if (footer && backToTop && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(([entry]) => {
      backToTop.classList.toggle("is-visible", entry.isIntersecting);
    }, { threshold: 0.05 });
    observer.observe(footer);
  } else if (backToTop) {
    window.addEventListener("scroll", () => backToTop.classList.toggle("is-visible", scrollY > 700), { passive: true });
  }
  backToTop?.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));

  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    reveals.forEach((item) => observer.observe(item));
  } else {
    reveals.forEach((item) => item.classList.add("is-visible"));
  }
})();
