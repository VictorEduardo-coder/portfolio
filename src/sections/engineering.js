import { escapeHtml } from "../components/status-badge.js";

export function renderEngineeringSection(profile) {
  const isEn = profile.lang === "en";
  const eng = profile.engineering;

  const cardsHtml = eng.topics
    .map(
      (topic, i) => `
      <article class="card" data-swarm-target="eng-card-${i}">
        <div class="card-header">
          <h3>${escapeHtml(topic.title)}</h3>
          <span class="sys-code">ARCH_0${i + 1}</span>
        </div>
        <ul class="timeline-list" style="margin-top:12px;">
          <li><strong>${isEn ? "Concept:" : "Conceito:"}</strong> ${escapeHtml(topic.concept)}</li>
          <li><strong>${isEn ? "Where used:" : "Onde foi utilizado:"}</strong> ${escapeHtml(topic.whereUsed)}</li>
          <li><strong>${isEn ? "Problem solved:" : "Problema resolvido:"}</strong> ${escapeHtml(topic.problemSolved)}</li>
          <li><strong>${isEn ? "Technical decision:" : "Decisão técnica:"}</strong> ${escapeHtml(topic.decision)}</li>
          <li><strong>${isEn ? "Lessons & evolution:" : "Aprendizado e evolução:"}</strong> ${escapeHtml(topic.learning)}</li>
        </ul>
      </article>`
    )
    .join("");

  return `
    <section class="section" id="engineering" aria-labelledby="engineering-heading">
      <div class="container">
        <div class="section-index-bar">
          <span>// [ 04.00 ] SEC_ENGINEERING.DECISIONS [ 04 / 06 ]</span>
          <span>SOFTWARE_ARCHITECTURE</span>
        </div>

        <div class="section-header" data-swarm-target="eng-header">
          <span class="section-eyebrow">${isEn ? "ARCHITECTURE & DECISIONS" : "ARQUITETURA & DECISÕES"}</span>
          <h2 id="engineering-heading">${escapeHtml(eng.title)}</h2>
          <p class="section-subtitle">${escapeHtml(eng.subtitle)}</p>
        </div>

        <div class="grid-2">
          ${cardsHtml}
        </div>
      </div>
    </section>
  `;
}
