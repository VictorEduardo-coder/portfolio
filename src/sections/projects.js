import { renderProjectCard } from "../components/project-card.js";
import { renderStatusBadge, escapeHtml } from "../components/status-badge.js";

const FLAGSHIP_LAYERS = {
  "pt-BR": [
    {
      id: "L0",
      pill: "L0: Persistência SQL & Nuvem",
      title: "CAMADA 00 // PERSISTÊNCIA RELACIONAL & NUVEM (AIVEN / SQLITE)",
      desc: "Modelagem relacional normalizada com chaves estrangeiras e isolamento de credenciais. Utilizada no SystemRPG / ZERO RPG (banco remoto na Aiven) e no Gestão de Frotas (persistência embarcada SQLite).",
      tags: ["MySQL / PostgreSQL", "SQLite", "Aiven Cloud", "JDBC / JPA"]
    },
    {
      id: "L1",
      pill: "L1: Domínio & Regras Java",
      title: "CAMADA 01 // REGRAS DE NEGÓCIO & MOTOR ECONÔMICO",
      desc: "Isolamento da lógica de domínio em serviços dedicados: validação do fluxo de moedas (R$, G, TR), Status do Hardware e Corrupção no SystemRPG; priorização com Problema da Mochila no Bot Acadêmico; e entidades de veículos/sensores no Gestão de Frotas.",
      tags: ["Java", "Spring Boot", "POO", "Programação Dinâmica"]
    },
    {
      id: "L2",
      pill: "L2: Integração REST, JDA & IMAP",
      title: "CAMADA 02 // CONTRATOS DE API, WORKERS ASSÍNCRONOS & IA",
      desc: "Exposição de rotas REST estruturadas em JSON, workers assíncronos para leitura de e-mails acadêmicos por IMAP no Discord (JDA) e leitura paralela de múltiplos anexos no assistente desktop BIA4vs.",
      tags: ["REST JSON", "Discord JDA", "Protocolo IMAP", "Python BIA4vs"]
    },
    {
      id: "L3",
      pill: "L3: Clientes Nativos & Segurança",
      title: "CAMADA 03 // INTERFACES REATIVAS (COMPOSE / JAVAFX) & SEGURANÇA",
      desc: "Interfaces nativas em Kotlin/Jetpack Compose no Guardião Mobile (monitoramento de RAM, downloads automáticos e Firewall VPN) e painéis de Operador/Motorista em JavaFX no Gestão de Frotas.",
      tags: ["Kotlin & Compose", "JavaFX", "VPN Local Android", "Auditoria & Segurança"]
    }
  ],
  "en": [
    {
      id: "L0",
      pill: "L0: SQL & Cloud Persistence",
      title: "LAYER 00 // RELATIONAL PERSISTENCE & CLOUD (AIVEN / SQLITE)",
      desc: "Normalized relational schemas with foreign keys and credential isolation. Applied in SystemRPG / ZERO RPG (managed cloud database on Aiven) and Fleet Management (embedded SQLite).",
      tags: ["MySQL / PostgreSQL", "SQLite", "Aiven Cloud", "JDBC / JPA"]
    },
    {
      id: "L1",
      pill: "L1: Java Domain & Rules",
      title: "LAYER 01 // DOMAIN LOGIC & ECONOMY ENGINE",
      desc: "Domain rules isolated inside dedicated service layers: currency validation (R$, G, TR), Hardware Reality and Corruption in SystemRPG; 0/1 Knapsack study prioritization in Academic Bot; and vehicle/sensor entities in Fleet Management.",
      tags: ["Java", "Spring Boot", "OOP", "Dynamic Programming"]
    },
    {
      id: "L2",
      pill: "L2: REST, JDA & IMAP Integration",
      title: "LAYER 02 // API CONTRACTS, ASYNC WORKERS & AI",
      desc: "Structured JSON REST endpoints, asynchronous background workers polling IMAP academic emails for Discord (JDA), and parallel multi-attachment reading in the BIA4vs Python desktop assistant.",
      tags: ["REST JSON", "Discord JDA", "IMAP Protocol", "Python BIA4vs"]
    },
    {
      id: "L3",
      pill: "L3: Native Clients & Security",
      title: "LAYER 03 // REACTIVE INTERFACES (COMPOSE / JAVAFX) & SECURITY",
      desc: "Native interfaces built with Kotlin/Jetpack Compose in Guardião Mobile (RAM monitoring, automatic folder downloads, local VPN) and Operator/Driver JavaFX panels in Fleet Management.",
      tags: ["Kotlin & Compose", "JavaFX", "Android Local VPN", "Security Auditing"]
    }
  ]
};

export function filterProjectsList(projects, categoryFilter, techFilter, statusFilter) {
  return projects.filter((p) => {
    const matchCat = !categoryFilter || categoryFilter === "all" || p.category === categoryFilter;
    const matchTech = !techFilter || techFilter === "all" || p.technologies.includes(techFilter);
    const matchStatus = !statusFilter || statusFilter === "all" || p.status === statusFilter;
    return matchCat && matchTech && matchStatus;
  });
}

export function renderProjectsSection(projectsData, lang) {
  const isEn = lang === "en";
  const statusLabels = projectsData.statusLabels;
  const categories = projectsData.categories[lang] || projectsData.categories["pt-BR"];
  const layers = FLAGSHIP_LAYERS[lang] || FLAGSHIP_LAYERS["pt-BR"];
  const firstLayer = layers[0];

  const allTechs = Array.from(
    new Set(projectsData.projects.flatMap((p) => p.technologies))
  ).sort();

  const categoryOptions = Object.entries(categories)
    .map(([key, label]) => `<option value="${escapeHtml(key)}">${escapeHtml(label)}</option>`)
    .join("");

  const techOptions = [
    `<option value="all">${isEn ? "All technologies" : "Todas as tecnologias"}</option>`,
    ...allTechs.map((t) => `<option value="${escapeHtml(t)}">${escapeHtml(t)}</option>`)
  ].join("");

  const statusOptions = [
    `<option value="all">${isEn ? "All statuses" : "Todos os status"}</option>`,
    ...Object.entries(statusLabels[lang] || statusLabels["pt-BR"]).map(
      ([k, v]) => `<option value="${escapeHtml(k)}">${escapeHtml(v)}</option>`
    )
  ].join("");

  const cardsHtml = projectsData.projects
    .map((project, idx) => renderProjectCard(project, statusLabels, lang, idx))
    .join("");

  const layerPillsHtml = layers
    .map(
      (l, idx) => `
      <button type="button" class="layer-pill" data-layer-id="${escapeHtml(l.id)}" aria-selected="${idx === 0 ? "true" : "false"}">
        ${escapeHtml(l.pill)}
      </button>`
    )
    .join("");

  return `
    <section class="section" id="projects" aria-labelledby="projects-heading">
      <div class="container">
        <div class="section-index-bar">
          <span>// [ 02.00 ] SEC_PROJECTS.MATRIX [ 02 / 06 ]</span>
          <span>REAL_SCREENSHOTS_VERIFIED</span>
        </div>

        <div class="section-header" data-swarm-target="projects-header">
          <span class="section-eyebrow">${isEn ? "ARCHITECTURAL OVERVIEW & REPOSITORIES" : "ARQUITETURA EM CAMADAS & REPOSITÓRIOS"}</span>
          <h2 id="projects-heading">${isEn ? "Flagship Architecture & Systems Matrix" : "Arquitetura em Camadas & Matriz de Projetos"}</h2>
          <p class="section-subtitle">
            ${
              isEn
                ? "Interactive breakdown of architectural layers across Victor's projects, followed by the verified repository catalog with real application screenshots."
                : "Inspeção interativa das camadas arquiteturais utilizadas nos projetos, seguida pelo catálogo completo com capturas de tela reais e status transparente."
            }
          </p>
        </div>

        <div class="flagship-box" data-swarm-target="flagship-box">
          <div class="card-header">
            <div>
              <span class="section-eyebrow">● ${isEn ? "LAYERED ARCHITECTURE INSPECTOR" : "INSPETOR DE ARQUITETURA EM CAMADAS"}</span>
              <h3>${isEn ? "4-Layer Engineering Stack Across Projects" : "Arquitetura de 4 Camadas Aplicada nos Projetos"}</h3>
            </div>
            <span class="status-badge status-optimization">${isEn ? "ACTIVE EVOLUTION" : "EM EVOLUÇÃO ATIVA"}</span>
          </div>

          <div class="flagship-metrics">
            <div class="flagship-metric-cell">
              <div class="flagship-metric-val">5</div>
              <div class="flagship-metric-lbl">${isEn ? "PUBLIC GITHUB REPOS" : "REPOSITÓRIOS PÚBLICOS"}</div>
            </div>
            <div class="flagship-metric-cell">
              <div class="flagship-metric-val">1</div>
              <div class="flagship-metric-lbl">${isEn ? "NATIVE ANDROID APP" : "APP ANDROID NATIVO"}</div>
            </div>
            <div class="flagship-metric-cell">
              <div class="flagship-metric-val">17</div>
              <div class="flagship-metric-lbl">${isEn ? "VERIFIED SCREENS" : "TELAS & DIAGRAMAS"}</div>
            </div>
            <div class="flagship-metric-cell">
              <div class="flagship-metric-val">100%</div>
              <div class="flagship-metric-lbl">${isEn ? "STATUS TRANSPARENCY" : "TRANSPARÊNCIA DE ESCOPO"}</div>
            </div>
          </div>

          <div class="layer-pills" role="tablist" aria-label="Architectural Layers">
            ${layerPillsHtml}
          </div>

          <div class="layer-detail-box" id="flagship-layer-detail" aria-live="polite">
            <h4 class="mono" style="color:var(--accent-red);font-size:0.86rem;" id="fl-layer-title">${escapeHtml(firstLayer.title)}</h4>
            <p style="margin-top:8px;color:var(--text-primary);" id="fl-layer-desc">${escapeHtml(firstLayer.desc)}</p>
            <ul class="tag-list" id="fl-layer-tags">
              ${firstLayer.tags.map((t) => `<li class="tag">${escapeHtml(t)}</li>`).join("")}
            </ul>
          </div>
        </div>

        <div class="section-header" style="margin-bottom:20px;" data-swarm-target="matrix-subheader">
          <span class="section-eyebrow">${isEn ? "ENGINEERING INDEX" : "ÍNDICE DE ENGENHARIA"}</span>
          <h3>The Systems Matrix</h3>
        </div>

        <div class="filter-bar" role="region" aria-label="${isEn ? "Project filters" : "Filtros de projetos"}">
          <div class="field-group">
            <label for="filter-category">${isEn ? "Area" : "Área"}</label>
            <select id="filter-category" class="filter-select">${categoryOptions}</select>
          </div>
          <div class="field-group">
            <label for="filter-tech">${isEn ? "Technology" : "Tecnologia"}</label>
            <select id="filter-tech" class="filter-select">${techOptions}</select>
          </div>
          <div class="field-group">
            <label for="filter-status">${isEn ? "Status" : "Status"}</label>
            <select id="filter-status" class="filter-select">${statusOptions}</select>
          </div>
          <button type="button" class="btn btn-ghost" id="filter-reset-btn" style="align-self:flex-end;">
            ${isEn ? "Reset Filters" : "Limpar Filtros"}
          </button>
        </div>

        <div class="projects-grid" id="projects-grid-container" aria-live="polite">
          ${cardsHtml}
        </div>
      </div>

      <div class="modal-backdrop" id="project-modal-backdrop" hidden role="dialog" aria-modal="true" aria-labelledby="modal-project-title">
        <div class="modal-content" id="project-modal-body"></div>
      </div>
    </section>
  `;
}

export function renderProjectModalContent(project, statusLabels, lang) {
  const isEn = lang === "en";
  const localized = isEn ? project.en : project.pt;
  const title = isEn ? project.name_en : project.name;
  const closeText = isEn ? "Close (Esc)" : "Fechar (Esc)";

  const gallery = Array.isArray(project.gallery) && project.gallery.length > 0
    ? project.gallery
    : [{ src: project.image, captionPt: title, captionEn: title }];

  const firstSlide = gallery[0];
  const firstCaption = isEn ? firstSlide.captionEn : firstSlide.captionPt;

  const thumbsHtml = gallery.length > 1
    ? `<div class="gallery-thumbs" role="tablist" aria-label="${isEn ? "Project screenshots" : "Capturas de tela do projeto"}">
        ${gallery
          .map(
            (item, idx) => `
            <button
              type="button"
              class="gallery-thumb-btn"
              role="tab"
              aria-selected="${idx === 0 ? "true" : "false"}"
              data-gallery-src="${escapeHtml(item.src)}"
              data-gallery-caption="${escapeHtml(isEn ? item.captionEn : item.captionPt)}"
              aria-label="${escapeHtml(isEn ? item.captionEn : item.captionPt)}"
            >
              <img src="${escapeHtml(item.src)}" alt="" loading="lazy" />
            </button>`
          )
          .join("")}
      </div>`
    : "";

  const listItems = (arr) =>
    arr.map((item) => `<li>${escapeHtml(item)}</li>`).join("");

  const repoHtml = project.repository
    ? `<a class="btn btn-primary" href="${escapeHtml(project.repository)}" target="_blank" rel="noopener noreferrer">${
        isEn ? "Open GitHub Repository ↗" : "Abrir Repositório no GitHub ↗"
      }</a>`
    : `<span class="btn btn-ghost" aria-disabled="true">${
        isEn ? "Public Repository In Preparation" : "Repositório Público em Preparação"
      }</span>`;

  return `
    <div class="card-header">
      <div>
        <h3 id="modal-project-title">${escapeHtml(title)}</h3>
        <div style="margin-top:8px;">
          ${renderStatusBadge(project.status, statusLabels, lang)}
        </div>
      </div>
      <button type="button" class="btn btn-ghost" id="modal-close-btn">${closeText}</button>
    </div>

    <div class="gallery-viewer">
      <div class="gallery-main-stage">
        <img id="modal-gallery-main-img" class="gallery-main-img" src="${escapeHtml(firstSlide.src)}" alt="${escapeHtml(firstCaption)}" />
      </div>
      <p id="modal-gallery-caption" class="gallery-caption">${escapeHtml(firstCaption)}</p>
      ${thumbsHtml}
    </div>

    <p style="margin-bottom:14px;">${escapeHtml(localized.summary)}</p>

    <div class="grid-2" style="margin-bottom:16px;">
      <div class="card" style="padding:16px;">
        <h4>${isEn ? "Problem Addressed" : "Problema que Procura Resolver"}</h4>
        <p style="margin-top:6px;font-size:0.92rem;">${escapeHtml(localized.problem)}</p>
      </div>
      <div class="card" style="padding:16px;">
        <h4>${isEn ? "Developer Role & Contribution" : "Papel e Contribuição"}</h4>
        <p style="margin-top:6px;font-size:0.92rem;">${escapeHtml(localized.role)}</p>
      </div>
    </div>

    <h4>✔ ${isEn ? "Implemented Features" : "Funcionalidades Implementadas"}</h4>
    <ul class="timeline-list">${listItems(localized.implemented)}</ul>

    <h4>⚙ ${isEn ? "In Development / Active Work" : "Em Desenvolvimento / Trabalho Atual"}</h4>
    <ul class="timeline-list">${listItems(localized.inProgress)}</ul>

    <h4>➔ ${isEn ? "Next Objectives" : "Próximos Objetivos"}</h4>
    <ul class="timeline-list">${listItems(localized.nextSteps)}</ul>

    <div class="notice-banner">
      <strong>${isEn ? "Scope & Technical Limitations:" : "Escopo e Limitações Técnicas:"}</strong>
      ${escapeHtml(localized.limitations)}
    </div>

    <div class="project-actions">
      ${repoHtml}
    </div>
  `;
}

export function bindProjectsSectionEvents(projectsData, lang, onSelectLabTab) {
  const catEl = document.getElementById("filter-category");
  const techEl = document.getElementById("filter-tech");
  const statusEl = document.getElementById("filter-status");
  const resetBtn = document.getElementById("filter-reset-btn");
  const gridEl = document.getElementById("projects-grid-container");
  const modalBackdrop = document.getElementById("project-modal-backdrop");
  const modalBody = document.getElementById("project-modal-body");

  const layerBtns = document.querySelectorAll("[data-layer-id]");
  const flTitle = document.getElementById("fl-layer-title");
  const flDesc = document.getElementById("fl-layer-desc");
  const flTags = document.getElementById("fl-layer-tags");
  const layers = FLAGSHIP_LAYERS[lang] || FLAGSHIP_LAYERS["pt-BR"];

  let lastTriggerEl = null;

  layerBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-layer-id");
      const found = layers.find((l) => l.id === id) || layers[0];
      layerBtns.forEach((b) => b.setAttribute("aria-selected", String(b === btn)));
      if (flTitle && flDesc && flTags) {
        flTitle.textContent = found.title;
        flDesc.textContent = found.desc;
        flTags.innerHTML = found.tags.map((t) => `<li class="tag">${escapeHtml(t)}</li>`).join("");
      }
    });
  });

  if (!gridEl) return;

  const closeModal = () => {
    modalBackdrop.hidden = true;
    document.body.style.overflow = "";
    if (lastTriggerEl && typeof lastTriggerEl.focus === "function") {
      lastTriggerEl.focus();
    }
  };

  const openModalForProject = (projId, triggerEl) => {
    const proj = projectsData.projects.find((p) => p.id === projId);
    if (!proj) return;
    lastTriggerEl = triggerEl;
    modalBody.innerHTML = renderProjectModalContent(proj, projectsData.statusLabels, lang);
    modalBackdrop.hidden = false;
    document.body.style.overflow = "hidden";

    const mainImg = document.getElementById("modal-gallery-main-img");
    const captionEl = document.getElementById("modal-gallery-caption");
    modalBody.querySelectorAll("[data-gallery-src]").forEach((thumbBtn) => {
      thumbBtn.addEventListener("click", () => {
        const src = thumbBtn.getAttribute("data-gallery-src");
        const cap = thumbBtn.getAttribute("data-gallery-caption");
        modalBody.querySelectorAll("[data-gallery-src]").forEach((b) => {
          b.setAttribute("aria-selected", String(b === thumbBtn));
        });
        if (mainImg) {
          mainImg.src = src;
          mainImg.alt = cap;
        }
        if (captionEl) {
          captionEl.textContent = cap;
        }
      });
    });

    const closeBtn = document.getElementById("modal-close-btn");
    if (closeBtn) {
      closeBtn.focus();
      closeBtn.addEventListener("click", closeModal);
    }
  };

  const attachCardListeners = () => {
    gridEl.querySelectorAll("[data-open-modal]").forEach((el) => {
      el.addEventListener("click", () => {
        const projId = el.getAttribute("data-open-modal");
        openModalForProject(projId, el);
      });
    });

    gridEl.querySelectorAll("[data-open-lab]").forEach((link) => {
      link.addEventListener("click", () => {
        const tabId = link.getAttribute("data-open-lab");
        if (typeof onSelectLabTab === "function" && tabId) {
          onSelectLabTab(tabId);
        }
      });
    });
  };

  const applyFilters = () => {
    const filtered = filterProjectsList(
      projectsData.projects,
      catEl.value,
      techEl.value,
      statusEl.value
    );

    if (filtered.length === 0) {
      gridEl.innerHTML = `<p class="notice-banner">${
        lang === "en"
          ? "No projects match the selected filter combination."
          : "Nenhum projeto corresponde à combinação de filtros selecionada."
      }</p>`;
      return;
    }

    gridEl.innerHTML = filtered
      .map((project, idx) => renderProjectCard(project, projectsData.statusLabels, lang, idx))
      .join("");
    gridEl.querySelectorAll("[data-swarm-target]").forEach((el) => {
      el.classList.remove("swarm-pending", "swarm-building");
      el.classList.add("swarm-built");
    });
    attachCardListeners();
  };

  catEl.addEventListener("change", applyFilters);
  techEl.addEventListener("change", applyFilters);
  statusEl.addEventListener("change", applyFilters);

  resetBtn.addEventListener("click", () => {
    catEl.value = "all";
    techEl.value = "all";
    statusEl.value = "all";
    applyFilters();
  });

  modalBackdrop.addEventListener("click", (e) => {
    if (e.target === modalBackdrop) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (modalBackdrop.hidden) return;
    if (e.key === "Escape") {
      closeModal();
      return;
    }
    if (e.key === "Tab") {
      const focusables = Array.from(
        modalBody.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  attachCardListeners();
}
