import { escapeHtml } from "./status-badge.js";
import { isCursorSwarmEnabled } from "../lab/cursor-swarm.js";

export function renderNavigation(profile, activeSection = "home") {
  const nav = profile.nav;
  const isEn = profile.lang === "en";
  const items = [
    { id: "home", label: nav.home },
    { id: "about", label: nav.about },
    { id: "projects", label: nav.projects },
    { id: "tech-lab", label: nav.techLab },
    { id: "engineering", label: nav.engineering },
    { id: "github", label: nav.github },
    { id: "contact", label: nav.contact }
  ];

  const linksHtml = items
    .map(
      (item) => `
      <li>
        <a class="nav-link" href="#${item.id}" data-nav-section="${item.id}" ${
          activeSection === item.id ? 'aria-current="true"' : ""
        }>${escapeHtml(item.label)}</a>
      </li>`
    )
    .join("");

  const menuAria = isEn ? "Toggle navigation menu" : "Alternar menu de navegação";
  const langAria = isEn ? "Switch language to Portuguese" : "Alternar idioma para Inglês";
  const swarmActive = isCursorSwarmEnabled();
  const swarmLabel = swarmActive
    ? isEn ? "AGENTS: ON" : "AGENTES: ON"
    : isEn ? "AGENTS: OFF" : "AGENTES: OFF";

  return `
    <div class="container header-inner">
      <a href="#home" class="brand-logo" aria-label="${escapeHtml(profile.brand)}">
        <span class="brand-badge">V.EXE</span>
        <span>${escapeHtml(profile.name.toUpperCase())}</span>
      </a>
      <nav class="site-nav" id="site-nav" aria-label="${isEn ? "Main Navigation" : "Navegação Principal"}">
        <ul class="nav-list">
          ${linksHtml}
        </ul>
      </nav>
      <div class="header-actions">
        <button type="button" class="btn btn-ghost" id="swarm-toggle-btn" aria-pressed="${String(swarmActive)}">
          ${escapeHtml(swarmLabel)}
        </button>
        <button type="button" class="btn btn-ghost" id="lang-toggle" aria-label="${langAria}">
          ${escapeHtml(nav.langSwitch)}
        </button>
        <button type="button" class="menu-toggle" id="menu-toggle" aria-expanded="false" aria-controls="site-nav" aria-label="${menuAria}">
          <span class="mono">MENU</span>
        </button>
      </div>
    </div>
  `;
}

export function bindNavigationEvents(onLanguageToggle, onSwarmToggle) {
  const menuBtn = document.getElementById("menu-toggle");
  const siteNav = document.getElementById("site-nav");
  const langBtn = document.getElementById("lang-toggle");
  const swarmBtn = document.getElementById("swarm-toggle-btn");

  if (menuBtn && siteNav) {
    menuBtn.addEventListener("click", () => {
      const expanded = menuBtn.getAttribute("aria-expanded") === "true";
      menuBtn.setAttribute("aria-expanded", String(!expanded));
      siteNav.classList.toggle("is-open", !expanded);
    });

    siteNav.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        menuBtn.setAttribute("aria-expanded", "false");
        siteNav.classList.remove("is-open");
      });
    });
  }

  if (langBtn && typeof onLanguageToggle === "function") {
    langBtn.addEventListener("click", onLanguageToggle);
  }

  if (swarmBtn && typeof onSwarmToggle === "function") {
    swarmBtn.addEventListener("click", onSwarmToggle);
  }
}
