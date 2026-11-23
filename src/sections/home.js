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
          num: "01 // BACKEND",
          title: "Backend & Persistence",
          items: [
            "Java 21, Spring Boot & Spring Security applied in SystemRPG.",
            "REST APIs, WebSockets, and relational SQL modeling (MySQL / TiDB, PostgreSQL, SQLite, H2).",
            "JDBC, Docker multi-stage builds, and cloud deployment configuration (Render)."
          ]
        },
        {
          num: "02 // AUTOMATION",
          title: "Automation & Integrations",
          items: [
            "Discord bot (JDA) + Javalin REST API + IMAP polling in Academic Bot.",
            "PriorityQueue study scheduling heuristic and AES-GCM credential encryption.",
            "Python desktop tooling (PyQt5 + QThread + SQLite) in BIA4vs."
          ]
        },
        {
          num: "03 // DESKTOP & CORE",
          title: "Desktop & CS Foundations",
          items: [
            "JavaFX desktop interfaces and simulated telemetry in Fleet Management.",
            "Algorithms, data structures, linear algebra, and C (C11) fundamentals.",
            "Git, GitHub Actions, Linux environment, and Apache Maven."
          ]
        }
      ]
    : [
        {
          num: "01 // BACKEND",
          title: "Backend & Persistência",
          items: [
            "Java 21, Spring Boot e Spring Security aplicados no SystemRPG.",
            "APIs REST, WebSockets e modelagem SQL (MySQL / TiDB, PostgreSQL, SQLite, H2).",
            "JDBC, containerização com Docker multi-stage e deploy em nuvem (Render)."
          ]
        },
        {
          num: "02 // AUTOMAÇÃO",
          title: "Automação & Integrações",
          items: [
            "Bot Discord (JDA), API HTTP (Javalin) e leitura IMAP no Bot Acadêmico.",
            "Alocação heurística de estudos via PriorityQueue e criptografia AES-GCM.",
            "Assistente desktop modular em Python (PyQt5 + QThread + SQLite) no BIA4vs."
          ]
        },
        {
          num: "03 // DESKTOP & BASE",
          title: "Desktop & Fundamentos",
          items: [
            "Interfaces desktop em JavaFX e telemetria simulada no Gestão de Frotas.",
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
                <div class="hero-stat-val"><span>4</span> ${isEn ? "Projects" : "Projetos"}</div>
                <span class="hero-stat-lbl">${isEn ? "Featured Systems" : "Sistemas em Destaque"}</span>
              </div>
              <div class="hero-stat-item">
                <div class="hero-stat-val"><span>6h</span>/dia</div>
                <span class="hero-stat-lbl">${isEn ? "Internship Availability" : "Disponibilidade Estágio"}</span>
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
