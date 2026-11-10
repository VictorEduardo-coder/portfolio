import { escapeHtml } from "../components/status-badge.js";

export function renderAboutSection(profile) {
  const isEn = profile.lang === "en";

  const narrativeHtml = isEn
    ? `I am <strong>${escapeHtml(profile.fullName)}</strong> — a software developer and undergraduate pursuing a <span class="inline-highlight">B.Sc. in Computer Engineering at UFG</span> (3rd semester, Aug/2025 – Dec/2030), based in <span class="inline-highlight">${escapeHtml(profile.location)}</span>. My professional foundation includes working as an <span class="inline-highlight">IT &amp; Administrative Apprentice</span> at Santa Casa de Misericórdia de Goiânia (via CESAM, Mar/2024 – Aug/2025), solving daily operational and technical challenges across multiple departments.`
    : `Sou <strong>${escapeHtml(profile.fullName)}</strong> — desenvolvedor e estudante do <span class="inline-highlight">Bacharelado em Engenharia da Computação na UFG</span> (cursando o 3º período, ago/2025 – dez/2030), localizado em <span class="inline-highlight">${escapeHtml(profile.location)}</span>. Atuei como <span class="inline-highlight">Jovem Aprendiz — Administrativo e TI</span> na Santa Casa de Misericórdia de Goiânia (via CESAM, mar/2024 – ago/2025), realizando suporte técnico, resolução de problemas cotidianos e integração entre diferentes setores.`;

  const narrativeSecondHtml = isEn
    ? `My technical work centers on building <span class="inline-highlight">Spring Boot REST APIs</span>, <span class="inline-highlight">relational database schemas</span>, <span class="inline-highlight">Kotlin/Jetpack Compose Android apps</span>, and <span class="inline-highlight">Python automation tools</span>. I am seeking a Software Engineering internship (available up to 6 hours/day) to contribute with disciplined engineering and evolve alongside an experienced team.`
    : `Meus projetos concentram-se na construção de <span class="inline-highlight">APIs REST com Spring Boot</span>, <span class="inline-highlight">modelagem relacional SQL</span>, <span class="inline-highlight">aplicações Android em Kotlin/Compose</span> e <span class="inline-highlight">automação em Python</span>. Busco uma oportunidade de estágio em Engenharia de Software (disponibilidade de até 6h/dia) para aplicar meus conhecimentos e evoluir tecnicamente em equipe.`;

  const renderSkillGroup = (group, idx) => `
    <div class="card" data-swarm-target="skill-group-${idx}">
      <h3>${escapeHtml(group.title)}</h3>
      <ul class="tag-list">
        ${group.items.map((item) => `<li class="tag">${escapeHtml(item)}</li>`).join("")}
      </ul>
    </div>
  `;

  const languagesHtml = profile.skills.languages.items
    .map(
      (langItem) =>
        `<li class="tag">${escapeHtml(langItem.name)}: <strong>${escapeHtml(langItem.level)}</strong></li>`
    )
    .join("");

  return `
    <section class="section" id="about" aria-labelledby="about-heading">
      <div class="container">
        <div class="section-index-bar">
          <span>// [ 01.00 ] SEC_ABOUT.INDEX [ 01 / 06 ]</span>
          <span>UFG · ENG_COMP · 2025–2030</span>
        </div>

        <div class="section-header" data-swarm-target="about-header">
          <span class="section-eyebrow">${isEn ? "ENGINEER PROFILE" : "PERFIL DO DESENVOLVEDOR"}</span>
          <h2 id="about-heading">${isEn ? "Background & Engineering Philosophy" : "Formação, Experiência & Filosofia"}</h2>
        </div>

        <div class="grid-2" style="margin-bottom:28px;">
          <div data-swarm-target="about-narrative">
            <p style="color:var(--text-primary);margin-bottom:14px;">${narrativeHtml}</p>
            <p>${narrativeSecondHtml}</p>
            <blockquote class="quote-callout">
              "${escapeHtml(profile.transparencyPrinciple)}"
            </blockquote>
          </div>

          <div class="card" data-swarm-target="about-pillars">
            <div class="numbered-pillar-row" style="padding-top:0;">
              <div>
                <h4>${isEn ? " Academic Foundation (UFG)" : "Formação Acadêmica (UFG)"}</h4>
                <p style="font-size:0.86rem;margin-top:4px;">${escapeHtml(profile.degree)} — ${escapeHtml(profile.period)}</p>
              </div>
              <span class="numbered-pillar-idx">01</span>
            </div>
            <div class="numbered-pillar-row">
              <div>
                <h4>${isEn ? "Practical IT Experience (CESAM)" : "Experiência Prática em TI (CESAM)"}</h4>
                <p style="font-size:0.86rem;margin-top:4px;">Santa Casa de Misericórdia de Goiânia (Mar/2024 – Ago/2025)</p>
              </div>
              <span class="numbered-pillar-idx">02</span>
            </div>
            <div class="numbered-pillar-row" style="border-bottom:none;padding-bottom:0;">
              <div>
                <h4>${escapeHtml(profile.aiUsage.title)}</h4>
                <p style="font-size:0.86rem;margin-top:4px;">${escapeHtml(profile.aiUsage.text)}</p>
              </div>
              <span class="numbered-pillar-idx">03</span>
            </div>
          </div>
        </div>

        <div class="grid-3" style="margin-bottom:24px;">
          ${renderSkillGroup(profile.skills.backendCloud, 1)}
          ${renderSkillGroup(profile.skills.mobileDesktopTools, 2)}
          ${renderSkillGroup(profile.skills.fundamentals, 3)}
        </div>

        <div class="card" data-swarm-target="about-languages">
          <h3>${escapeHtml(profile.skills.languages.title)}</h3>
          <ul class="tag-list">
            ${languagesHtml}
          </ul>
        </div>
      </div>
    </section>
  `;
}
