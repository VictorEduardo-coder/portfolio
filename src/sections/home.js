import { escapeHtml } from "../components/status-badge.js";

export function renderHomeSection(profile) {
  const isEn = profile.lang === "en";
  const greetingSmall = isEn ? "Hello, I'm" : "Olá, sou";

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
            "REST APIs, WebSockets, and relational SQL modeling (MySQL, SQLite).",
            "JDBC, transactional integrity (@Transactional), and JUnit 5 / MockMvc tests."
          ]
        },
        {
          num: "02 // MOBILE",
          title: "Native Android Mobile",
          items: [
            "Kotlin and Android SDK applied in Guardião Mobile.",
            "Reactive interfaces built with Jetpack Compose.",
            "Media folder routing, RAM usage inspection, and local VPN structure."
          ]
        },
        {
          num: "03 // TOOLS & DESKTOP",
          title: "Tooling, Desktop & Automation",
          items: [
            "Python (BIA4vs desktop assistant) and C (C11) fundamentals.",
            "JavaFX desktop interfaces (Fleet Management) and Discord JDA + IMAP.",
            "Git, GitHub, Linux environment, and Apache Maven."
          ]
        }
      ]
    : [
        {
          num: "01 // BACKEND",
          title: "Backend & Persistência",
          items: [
            "Java 21, Spring Boot e Spring Security aplicados no SystemRPG.",
            "APIs REST, WebSockets e modelagem relacional SQL (MySQL, SQLite).",
            "JDBC, transações (@Transactional) e testes com JUnit 5 e MockMvc."
          ]
        },
        {
          num: "02 // MOBILE",
          title: "Mobile Android Nativo",
          items: [
            "Kotlin e Android SDK aplicados no Guardião Mobile.",
            "Interfaces reativas construídas com Jetpack Compose.",
            "Organização de downloads em pastas, leitura de RAM e estrutura de VPN local."
          ]
        },
        {
          num: "03 // FERRAMENTAS",
          title: "Ferramentas, Desktop & Automação",
          items: [
            "Python (assistente desktop BIA4vs) e fundamentos em C (C11).",
            "Interfaces desktop em JavaFX (Gestão de Frotas) e Discord JDA + IMAP.",
            "Git e GitHub, ambiente Linux e Apache Maven."
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
          <span class="hero-marquee-title" aria-hidden="true">PORTFOLIO</span>
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
                <div class="hero-stat-val"><span>3º</span> ${isEn ? "Sem." : "Período"}</div>
                <span class="hero-stat-lbl">Eng. Computação @ UFG</span>
              </div>
              <div class="hero-stat-item">
                <div class="hero-stat-val"><span>5</span> ${isEn ? "Repos" : "Repositórios"}</div>
                <span class="hero-stat-lbl">${isEn ? "Public on GitHub" : "Públicos no GitHub"}</span>
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
