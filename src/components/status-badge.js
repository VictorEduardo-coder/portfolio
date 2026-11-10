export function renderStatusBadge(statusKey, statusLabels, lang) {
  const dictionary = (statusLabels && statusLabels[lang]) || {};
  const label = dictionary[statusKey] || statusKey;
  const safeKey = String(statusKey || "development").replace(/[^a-z0-9_-]/gi, "");
  return `<span class="status-badge status-${safeKey}" role="status"><span aria-hidden="true">●</span> ${escapeHtml(label)}</span>`;
}

export function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
