import { renderStatusBadge, escapeHtml } from "./status-badge.js";

export function renderProjectCard(project, statusLabels, lang, index = 0) {
  const isEn = lang === "en";
  const localized = isEn ? project.en : project.pt;
  const title = isEn ? project.name_en : project.name;
  const detailsText = isEn ? "Screens & Architecture" : "Telas & Arquitetura";
  const repoText = isEn ? "Repository ↗" : "Repositório ↗";
  const repoPendingText = isEn ? "Private / In Prep" : "Privado / Em Preparo";
  const demoLiveText = isEn ? "Live Demo ↗" : "Demonstração ↗";
  const sysCode = `SYS_0${index + 1}`;
  const galleryCount = Array.isArray(project.gallery) ? project.gallery.length : 1;
  const galleryBadgeText = isEn
    ? `${galleryCount} ${galleryCount === 1 ? "screen" : "screens"}`
    : `${galleryCount} ${galleryCount === 1 ? "tela" : "telas"}`;

  const tagsHtml = project.technologies
    .map((tech) => `<li class="tag">${escapeHtml(tech)}</li>`)
    .join("");

  const implementedPreview = (localized.implemented || [])
    .slice(0, 2)
    .map((item) => `<li>+ ${escapeHtml(item)}</li>`)
    .join("");

  const repoAction = project.repository
    ? `<a class="btn btn-secondary" href="${escapeHtml(project.repository)}" target="_blank" rel="noopener noreferrer">${repoText}</a>`
    : `<span class="btn btn-ghost" aria-disabled="true">${repoPendingText}</span>`;

  const demoAction = project.demoUrl
    ? `<a class="btn btn-ghost" href="${escapeHtml(project.demoUrl)}" target="_blank" rel="noopener noreferrer">${demoLiveText}</a>`
    : "";

  return `
    <article class="card project-card" data-project-id="${escapeHtml(project.id)}" data-swarm-target="card-${escapeHtml(project.id)}">
      <div>
        <div class="card-header" style="margin-bottom:8px;">
          <span class="section-eyebrow" style="margin:0;">${escapeHtml(project.category.toUpperCase())}</span>
          <div style="display:flex;align-items:center;gap:6px;">
            <span class="gallery-count-pill">📷 ${escapeHtml(galleryBadgeText)}</span>
            <span class="sys-code">${escapeHtml(sysCode)}</span>
          </div>
        </div>
        <img
          class="project-thumb"
          src="${escapeHtml(project.image)}"
          alt="${escapeHtml(title)}"
          width="640"
          height="360"
          loading="lazy"
          decoding="async"
          style="cursor:pointer;"
          data-open-modal="${escapeHtml(project.id)}"
        />
        <h3 style="margin-bottom:8px;">${escapeHtml(title)}</h3>
        <div style="margin-bottom: 10px;">
          ${renderStatusBadge(project.status, statusLabels, lang)}
        </div>
        <p style="font-size:0.9rem;">${escapeHtml(localized.summary)}</p>
        <ul class="timeline-list" style="margin-top:10px;margin-bottom:10px;">
          ${implementedPreview}
        </ul>
        <ul class="tag-list" aria-label="${isEn ? "Technologies" : "Tecnologias"}">
          ${tagsHtml}
        </ul>
      </div>
      <div class="project-actions">
        <button type="button" class="btn btn-primary" data-open-modal="${escapeHtml(project.id)}">
          ${detailsText}
        </button>
        ${repoAction}
        ${demoAction}
      </div>
    </article>
  `;
}
