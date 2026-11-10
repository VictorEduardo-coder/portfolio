import { escapeHtml } from "./status-badge.js";

export function renderContactLinks(contacts, lang) {
  const emailLabel = lang === "en" ? "Email" : "E-mail";
  return `
    <div class="contact-links-bar" style="display:flex;flex-wrap:wrap;gap:12px;">
      <a class="btn btn-primary" href="mailto:${escapeHtml(contacts.email)}">${emailLabel}: ${escapeHtml(contacts.email)}</a>
      <a class="btn btn-secondary" href="${escapeHtml(contacts.github)}" target="_blank" rel="noopener noreferrer">GitHub</a>
      <a class="btn btn-secondary" href="${escapeHtml(contacts.linkedin)}" target="_blank" rel="noopener noreferrer">LinkedIn</a>
    </div>
  `;
}
