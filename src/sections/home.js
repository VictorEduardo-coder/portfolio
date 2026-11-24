import { escapeHtml } from "../components/status-badge.js";

export function renderHomeSection(profile) {
  const isEn = profile.lang === "en";
  const greetingSmall = isEn ? "Hello, I'm" : "Olá, sou";
  const marqueeTitle = isEn ? "PORTFOLIO" : "PORTFÓLIO";

  const resumeButtonsHtml = profile.resume.available
    ? `
      <a class="btn btn-secondary" href="${escapeHtml(profile.resume.fileUrl)}" target="_blank" rel="noopener noreferrer">
        ${escapeHtml(profile.hero.ctaResume)} ↗
      </a>
      <a class="btn btn-ghost" href="${escapeHtml(profile.resume.fileUrl)}" download="${escapeHtml(profile.resume.downloadName || "Curriculo-Victor-Eduardo.pdf")}">
        ⬇ ${escapeHtml(profile.hero.ctaResumeDownload || "PDF")}
      </a>
    `
    : "";

  const pillars = isEn
    ? [
        {
          num: "01 // BACKEND & SEC",
          title: "Backend, Security & CI",
          items: [
            "Java 21, Spring Boot & Spring Security (BCrypt, CSRF, anti-IDOR) in SystemRPG.",
            "REST APIs (Spring/Javalin), WebSockets, and SQL (MySQL/TiDB, PostgreSQL, SQLite, H2).",
            "Automated tests (JUnit 5, MockMvc, unittest) with GitHub Actions CI & Docker."
          ]
        },
        {
          num: "02 // AUTOMATION & AI",
          title: "Automation & AI Tooling",
          items: [
            "Discord bot (JDA), hardened Javalin API, IMAP polling & AES-256-GCM in Academic Bot.",
            "Python desktop AI assistant (BIA4vs) with Ollama/OpenAI APIs and outbound secret scanner.",
            "AI-assisted engineering workflow focused on rapid prototyping, audits, and verified tests."
          ]
        },
        {
          num: "03 // SYSTEMS & CORE",
          title: "Desktop & CS Foundations",
          items: [
            "JavaFX desktop interfaces, RBAC, and PostgreSQL JDBC in Fleet Management.",
            "Algorithms, data structures, linear algebra, and C (C11) fundamentals.",
            "Git, GitHub Actions, Linux environment, and Apache Maven."
          ]
        }
      ]
    : [
        {
          num: "01 // BACKEND & SEG",
          title: "Backend, Segurança & CI",
          items: [
            "Java 21, Spring Boot e Spring Security (BCrypt, CSRF, anti-IDOR) no SystemRPG.",
            "APIs REST (Spring/Javalin), WebSockets e SQL (MySQL/TiDB, PostgreSQL, SQLite, H2).",
            "Testes automatizados (JUnit 5, MockMvc, unittest) com GitHub Actions CI e Docker."
          ]
        },
        {
          num: "02 // AUTOMAÇÃO & IA",
          title: "Automação & Ferramentas IA",
          items: [
            "Bot Discord (JDA), API Javalin segura, IMAP e AES-256-GCM no Bot Acadêmico.",
            "Assistente desktop em Python (BIA4vs) com LLMs/Ollama e scanner de segredos.",
            "Engenharia assistida por IA para prototipação ágil, revisão de segurança e testes."
          ]
        },
        {
          num: "03 // SISTEMAS & BASE",
          title: "Desktop & Fundamentos",
          items: [
            "Interfaces desktop em JavaFX, RBAC e PostgreSQL JDBC no Gestão de Frotas.",
            "Algoritmos, estruturas de dados, álgebra linear e fundamentos em C (C11).",
            "Git, GitHub Actions, ambiente Linux e Apache Maven."
          ]
        }
      ];

  const pillarsHtml = pillars
    .map(
      (p, i) => `
      <div class="pillar-mini-card" data-swarm-target="hero-pillar-${i}">
        <span class="pillar-num">${escapeHtml(p.num)}</span>
        <h2 style="font-size:1rem;margin-bottom:6px;">${escapeHtml(p.title)}</h2>
        <ul class="timeline-list" style="margin:6px 0 0;padding-left:12px;">
          ${p.items.map((item) => `<li style="font-size:0.82rem;margin-bottom:4px;">${escapeHtml(item)}</li>`).join("")}
        </ul>
      </div>`
    )
    .join("");

  return `
    <section class="section" id="home" aria-labelledby="hero-heading">
      <div class="container">
        <div class="hero-marquee-wrap" data-swarm-target="hero-marquee">
          <span class="hero-marquee-title" aria-hidden="true">${escapeHtml(marqueeTitle)}</span>
        </div>

        <div class="hero-3col">
          <div data-swarm-target="hero-left">
            <div class="hero-greeting-box">
              <span class="hero-greeting-small">${escapeHtml(greetingSmall)}</span>
              <h1 id="hero-heading" class="hero-greeting-name">VICTOR EDUARDO</h1>
            </div>

            <div class="hero-role-line">
              <span class="hero-role-dot" aria-hidden="true"></span>
              <span>${escapeHtml(profile.title)}</span>
            </div>

            <p style="font-size:0.95rem;">${escapeHtml(profile.summary)}</p>

            <div class="hero-actions">
              <a class="btn btn-primary" href="#projects">${escapeHtml(profile.hero.ctaProjects)} →</a>
              <a class="btn btn-secondary" href="mailto:${escapeHtml(profile.contacts.email)}">✉ ${escapeHtml(profile.contacts.email)}</a>
              ${resumeButtonsHtml}
              <a class="btn btn-secondary" href="${escapeHtml(profile.contacts.github)}" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
              <a class="btn btn-secondary" href="${escapeHtml(profile.contacts.linkedin)}" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
            </div>

            <div class="hero-stats-row">
              <div class="hero-stat-item">
                <div class="hero-stat-val"><span>UFG</span></div>
                <span class="hero-stat-lbl">${isEn ? "Computer Engineering" : "Eng. da Computação"}</span>
              </div>
              <div class="hero-stat-item">
                <div class="hero-stat-val"><span>30+</span> ${isEn ? "CI Tests" : "Testes CI"}</div>
                <span class="hero-stat-lbl">${isEn ? "JUnit 5, MockMvc & Py" : "JUnit 5, MockMvc e Py"}</span>
              </div>
              <div class="hero-stat-item">
                <div class="hero-stat-val"><span>6h</span>/dia</div>
                <span class="hero-stat-lbl">${isEn ? "Remote or Goiânia/GO" : "Remoto ou Goiânia/GO"}</span>
              </div>
            </div>
          </div>

          <div class="hero-photo-frame" data-swarm-target="hero-photo">
            <div class="hero-photo-img-wrap">
              <img
                class="hero-photo-normal"
                src="${escapeHtml(profile.profileImage)}"
                alt="${escapeHtml(profile.profileImageAlt)}"
                width="400"
                height="400"
                fetchpriority="high"
                decoding="async"
              />
            </div>
            <div class="hero-photo-caption">
              <span><span style="color:var(--status-success);">●</span> ${escapeHtml(profile.name.toUpperCase())} — UFG</span>
              <span>${isEn ? "INTERNSHIP READY" : "DISPONÍVEL ESTÁGIO"}</span>
            </div>
          </div>

          <div class="hero-pillars-col">
            ${pillarsHtml}
          </div>
        </div>
      </div>
    </section>
  `;
}
