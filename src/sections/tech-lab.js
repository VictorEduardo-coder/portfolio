import { renderApiSimulator, bindApiSimulatorEvents } from "../lab/api-simulator.js";
import { renderAlgorithmLab, bindAlgorithmLabEvents } from "../lab/algorithm-lab.js";
import { renderTelemetrySimulator, bindTelemetrySimulatorEvents, stopTelemetryInterval } from "../lab/telemetry-simulator.js";
import { renderCodePlayground, bindCodePlaygroundEvents } from "../lab/code-examples.js";

export function renderTechLabSection(lang, activeTab = "api-simulator") {
  const isEn = lang === "en";
  const tabs = [
    { id: "api-simulator", label: "1. API Simulator" },
    { id: "algorithm-lab", label: "2. Algorithm Lab" },
    { id: "telemetry-monitor", label: "3. Telemetry Monitor" },
    { id: "code-playground", label: "4. Code Playground" }
  ];

  const tabsHtml = tabs
    .map(
      (t) => `
      <button
        type="button"
        class="lab-tab"
        role="tab"
        data-lab-tab="${t.id}"
        aria-selected="${activeTab === t.id ? "true" : "false"}"
      >${t.label}</button>`
    )
    .join("");

  return `
    <section class="section" id="tech-lab" aria-labelledby="techlab-heading">
      <div class="container">
        <div class="section-index-bar">
          <span>// [ 03.00 ] SEC_TECH_LAB.SANDBOX [ 03 / 06 ]</span>
          <span>LOCAL_BROWSER_SIMULATION</span>
        </div>

        <div class="section-header" data-swarm-target="techlab-header">
          <span class="section-eyebrow">${isEn ? "INTERACTIVE BROWSER DEMOS" : "DEMONSTRAÇÕES INTERATIVAS NO NAVEGADOR"}</span>
          <h2 id="techlab-heading">TECH LAB</h2>
          <p class="section-subtitle">
            ${
              isEn
                ? "Self-contained educational simulations running locally in your browser. Clearly distinguished from external production backends."
                : "Aplicações didáticas independentes executadas localmente no navegador. Claramente diferenciadas dos serviços reais de backend."
            }
          </p>
        </div>

        <div class="lab-tabs" role="tablist" aria-label="Tech Lab Demonstrations">
          ${tabsHtml}
        </div>

        <div id="tech-lab-stage" data-swarm-target="techlab-stage">
          ${renderActiveLabModule(activeTab, lang)}
        </div>
      </div>
    </section>
  `;
}

export function renderActiveLabModule(tabId, lang) {
  if (tabId === "algorithm-lab") return renderAlgorithmLab(lang);
  if (tabId === "telemetry-monitor") return renderTelemetrySimulator(lang);
  if (tabId === "code-playground") return renderCodePlayground(lang);
  return renderApiSimulator(lang);
}

export function bindTechLabEvents(lang, initialTab = "api-simulator") {
  const stage = document.getElementById("tech-lab-stage");
  const tabBtns = document.querySelectorAll("[data-lab-tab]");
  if (!stage) return;

  const bindModule = (tabId) => {
    stopTelemetryInterval();
    if (tabId === "algorithm-lab") bindAlgorithmLabEvents(lang);
    else if (tabId === "telemetry-monitor") bindTelemetrySimulatorEvents(lang);
    else if (tabId === "code-playground") bindCodePlaygroundEvents(lang);
    else bindApiSimulatorEvents(lang);
  };

  const switchTab = (tabId) => {
    tabBtns.forEach((btn) => {
      const isSelected = btn.getAttribute("data-lab-tab") === tabId;
      btn.setAttribute("aria-selected", String(isSelected));
    });
    stage.innerHTML = renderActiveLabModule(tabId, lang);
    bindModule(tabId);
  };

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      switchTab(btn.getAttribute("data-lab-tab"));
    });
  });

  bindModule(initialTab);
  return switchTab;
}
