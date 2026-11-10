import { renderStatusBadge, escapeHtml } from "../components/status-badge.js";

export function renderGitHubAndContactSection(profile, projectsData) {
  const isEn = profile.lang === "en";
  const gh = profile.githubSection;
  const ct = profile.contactSection;

  const repoListHtml = projectsData.projects
    .filter((p) => Boolean(p.repository))
    .map(
      (p, i) => `
      <div class="card" style="display:flex;flex-direction:column;justify-content:space-between;" data-swarm-target="gh-repo-${i}">
        <div>
          <div class="card-header">
            <h3>${escapeHtml(isEn ? p.name_en : p.name)}</h3>
            <span class="sys-code">REPO_0${i + 1}</span>
          </div>
          <div style="margin-bottom:10px;">
            ${renderStatusBadge(p.status, projectsData.statusLabels, profile.lang)}
          </div>
          <p style="font-size:0.9rem;">${escapeHtml(isEn ? p.en.summary : p.pt.summary)}</p>
          <ul class="tag-list">
            ${p.technologies.map((t) => `<li class="tag">${escapeHtml(t)}</li>`).join("")}
          </ul>
        </div>
        <div class="project-actions">
          <a class="btn btn-secondary" href="${escapeHtml(p.repository)}" target="_blank" rel="noopener noreferrer">
            ${escapeHtml(p.repository.replace("https://github.com/", ""))} ↗
          </a>
        </div>
      </div>`
    )
    .join("");

  const resumeActionsHtml = profile.resume.available
    ? `
      <a class="btn btn-secondary" href="${escapeHtml(profile.resume.fileUrl)}" target="_blank" rel="noopener noreferrer">
        📄 ${escapeHtml(profile.resume.viewLabel)} ↗
      </a>
      <a class="btn btn-secondary" href="${escapeHtml(profile.resume.fileUrl)}" download="${escapeHtml(profile.resume.downloadName)}">
        ⬇ ${escapeHtml(profile.resume.downloadLabel)}
      </a>
    `
    : "";

  return `
    <section class="section" id="github" aria-labelledby="github-heading">
      <div class="container">
        <div class="section-index-bar">
          <span>// [ 05.00 ] SEC_GITHUB.REPOS [ 05 / 06 ]</span>
          <span>STATIC_FALLBACK_READY</span>
        </div>

        <div class="section-header" data-swarm-target="gh-header">
          <span class="section-eyebrow">GITHUB</span>
          <h2 id="github-heading">${escapeHtml(gh.title)}</h2>
          <p class="section-subtitle">${escapeHtml(gh.subtitle)}</p>
        </div>

        <div class="card" style="margin-bottom:24px;" data-swarm-target="gh-status-card">
          <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;">
            <div>
              <span class="mono">${escapeHtml(gh.profileLabel)}</span>
              <a href="${escapeHtml(profile.contacts.github)}" target="_blank" rel="noopener noreferrer" class="mono" style="color:var(--accent-red);font-weight:700;margin-left:6px;">
                github.com/VictorEduardo-coder ↗
              </a>
            </div>
            <button type="button" class="btn btn-ghost" id="gh-live-check-btn">
              ${escapeHtml(gh.loadLiveButton)}
            </button>
          </div>
          <p id="gh-api-status" class="notice-banner" role="status" aria-live="polite">
            ${escapeHtml(gh.fallbackNotice)}
          </p>
        </div>

        <div class="grid-2">
          ${repoListHtml}
        </div>
      </div>
    </section>

    <section class="section" id="contact" aria-labelledby="contact-heading">
      <div class="container">
        <div class="section-index-bar">
          <span>// [ 06.00 ] SEC_CONTACT.DIRECT [ 06 / 06 ]</span>
          <span>INTERNSHIP_CHANNEL</span>
        </div>

        <div class="card" style="text-align:center;padding:44px 28px;" data-swarm-target="contact-main-card">
          <span class="section-eyebrow">${isEn ? "DIRECT CHANNEL" : "CANAL DIRETO"}</span>
          <h2 id="contact-heading" style="margin-bottom:12px;">${escapeHtml(ct.title)}</h2>
          <p style="margin:0 auto 22px;max-width:60ch;color:var(--text-secondary);">
            ${escapeHtml(ct.subtitle)}
          </p>

          <p style="margin:0 auto 24px;color:var(--text-primary);" class="mono">
            <strong>${escapeHtml(profile.goal)}</strong> · ${escapeHtml(profile.availability)} · ${escapeHtml(profile.location)}
          </p>

          <div style="display:flex;justify-content:center;flex-wrap:wrap;gap:12px;">
            <a class="btn btn-primary" href="mailto:${escapeHtml(profile.contacts.email)}">
              ✉ ${escapeHtml(profile.contacts.email)}
            </a>
            <button type="button" class="btn btn-secondary" id="copy-email-btn" data-email="${escapeHtml(profile.contacts.email)}">
              ${escapeHtml(ct.copyEmail)}
            </button>
            ${resumeActionsHtml}
            <a class="btn btn-secondary" href="${escapeHtml(profile.contacts.github)}" target="_blank" rel="noopener noreferrer">
              GitHub ↗
            </a>
            <a class="btn btn-secondary" href="${escapeHtml(profile.contacts.linkedin)}" target="_blank" rel="noopener noreferrer">
              LinkedIn ↗
            </a>
          </div>

          <div style="margin-top:12px;min-height:22px;">
            <span id="copy-email-feedback" class="mono" style="font-size:0.85rem;color:var(--status-success);" role="status" aria-live="polite"></span>
          </div>

          <p class="notice-banner" style="margin:22px auto 0;max-width:62ch;text-align:left;">
            ${escapeHtml(profile.contacts.privacyNote)}
          </p>
        </div>
      </div>
    </section>
  `;
}

export function bindGitHubAndContactEvents(profile) {
  const copyBtn = document.getElementById("copy-email-btn");
  const feedbackEl = document.getElementById("copy-email-feedback");
  const ghBtn = document.getElementById("gh-live-check-btn");
  const ghStatus = document.getElementById("gh-api-status");

  if (copyBtn && feedbackEl) {
    copyBtn.addEventListener("click", async () => {
      const email = copyBtn.getAttribute("data-email");
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(email);
        }
        feedbackEl.textContent = profile.contactSection.copiedFeedback;
      } catch {
        feedbackEl.textContent = email;
      }
    });
  }

  if (ghBtn && ghStatus) {
    ghBtn.addEventListener("click", async () => {
      ghStatus.textContent =
        profile.lang === "en"
          ? "Querying https://api.github.com/users/VictorEduardo-coder ..."
          : "Consultando https://api.github.com/users/VictorEduardo-coder ...";
      try {
        const res = await fetch("https://api.github.com/users/VictorEduardo-coder", {
          headers: { Accept: "application/vnd.github.v3+json" }
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        ghStatus.textContent =
          profile.lang === "en"
            ? `GitHub API verified: @${data.login} | Public repositories: ${data.public_repos} | Updated: ${new Date(data.updated_at).toLocaleDateString("en-US")}`
            : `API do GitHub verificada: @${data.login} | Repositórios públicos: ${data.public_repos} | Atualizado em: ${new Date(data.updated_at).toLocaleDateString("pt-BR")}`;
      } catch {
        ghStatus.textContent =
          profile.lang === "en"
            ? "GitHub API unavailable or rate-limited right now. Static verified catalog remains active."
            : "API do GitHub indisponível ou com limite de requisições no momento. O catálogo estático verificado permanece ativo.";
      }
    });
  }
}
