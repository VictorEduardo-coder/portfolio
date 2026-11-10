import { escapeHtml } from "../components/status-badge.js";

const INITIAL_DB = [
  { id: 101, character: "Apito", chassis: "Abelha Rainha (Scraper)", level: 3, active: true },
  { id: 102, character: "Kaelen", chassis: "Aegis-IV", level: 5, active: true }
];

let localStore = JSON.parse(JSON.stringify(INITIAL_DB));

export function resetApiSimulatorStore() {
  localStore = JSON.parse(JSON.stringify(INITIAL_DB));
  return localStore;
}

export function simulateApiRequest(method, route, payloadRaw) {
  const cleanMethod = String(method || "GET").toUpperCase();
  const cleanRoute = String(route || "/api/v1/sheets").trim();

  if (cleanMethod === "GET" && cleanRoute === "/api/v1/sheets") {
    return {
      status: 200,
      statusText: "200 OK",
      validationMessage: "Simulated local read executed.",
      requestBody: null,
      responseBody: {
        simulation: true,
        count: localStore.length,
        data: localStore
      }
    };
  }

  if (cleanMethod === "GET" && cleanRoute === "/api/v1/health") {
    return {
      status: 200,
      statusText: "200 OK",
      validationMessage: "Simulated healthcheck endpoint.",
      requestBody: null,
      responseBody: {
        simulation: true,
        service: "SystemRPG-Mock-API",
        status: "UP",
        mode: "LOCAL_BROWSER_SIMULATION"
      }
    };
  }

  if (cleanMethod === "POST" && cleanRoute === "/api/v1/sheets") {
    let parsed;
    try {
      parsed = JSON.parse(payloadRaw || "{}");
    } catch {
      return {
        status: 400,
        statusText: "400 Bad Request",
        validationMessage: "Invalid JSON syntax in request payload.",
        requestBody: payloadRaw,
        responseBody: { error: "MALFORMED_JSON", message: "Request body must be valid JSON." }
      };
    }

    if (parsed.password || parsed.secret || parsed.token) {
      return {
        status: 422,
        statusText: "422 Unprocessable Entity",
        validationMessage: "Security rule: do not send passwords or secrets to the simulator.",
        requestBody: "[REDACTED]",
        responseBody: { error: "SENSITIVE_FIELD_REJECTED", message: "Passwords and tokens are prohibited." }
      };
    }

    const character = String(parsed.character || "").trim();
    const chassis = String(parsed.chassis || "").trim();
    const level = Number(parsed.level);

    if (!character || !chassis || !Number.isInteger(level) || level < 1 || level > 20) {
      return {
        status: 422,
        statusText: "422 Unprocessable Entity",
        validationMessage: "Validation failed: 'character' (non-empty), 'chassis' (non-empty), and 'level' (integer 1-20) are required.",
        requestBody: parsed,
        responseBody: {
          error: "VALIDATION_ERROR",
          fields: ["character", "chassis", "level (1..20)"]
        }
      };
    }

    const created = {
      id: 100 + localStore.length + 1,
      character: character.slice(0, 40),
      chassis: chassis.slice(0, 50),
      level,
      active: true
    };
    localStore.push(created);

    return {
      status: 201,
      statusText: "201 Created",
      validationMessage: "Resource validated and stored in local memory.",
      requestBody: parsed,
      responseBody: {
        simulation: true,
        created
      }
    };
  }

  if (cleanMethod === "PUT" && cleanRoute === "/api/v1/sheets/101") {
    let parsed;
    try {
      parsed = JSON.parse(payloadRaw || "{}");
    } catch {
      return {
        status: 400,
        statusText: "400 Bad Request",
        validationMessage: "Invalid JSON syntax.",
        requestBody: payloadRaw,
        responseBody: { error: "MALFORMED_JSON" }
      };
    }
    const target = localStore.find((item) => item.id === 101);
    if (!target) {
      return {
        status: 404,
        statusText: "404 Not Found",
        validationMessage: "Record #101 not found in local state.",
        requestBody: parsed,
        responseBody: { error: "NOT_FOUND" }
      };
    }
    if (parsed.level !== undefined) {
      const lv = Number(parsed.level);
      if (!Number.isInteger(lv) || lv < 1 || lv > 20) {
        return {
          status: 422,
          statusText: "422 Unprocessable Entity",
          validationMessage: "Level must be an integer between 1 and 20.",
          requestBody: parsed,
          responseBody: { error: "INVALID_LEVEL" }
        };
      }
      target.level = lv;
    }
    if (parsed.character) {
      target.character = String(parsed.character).slice(0, 40);
    }
    return {
      status: 200,
      statusText: "200 OK",
      validationMessage: "Record #101 updated in local memory.",
      requestBody: parsed,
      responseBody: { simulation: true, updated: target }
    };
  }

  if (cleanMethod === "DELETE" && cleanRoute === "/api/v1/sheets/102") {
    const idx = localStore.findIndex((item) => item.id === 102);
    if (idx === -1) {
      return {
        status: 404,
        statusText: "404 Not Found",
        validationMessage: "Record #102 was already removed. Reset state to restore.",
        requestBody: null,
        responseBody: { error: "RESOURCE_NOT_FOUND", id: 102 }
      };
    }
    const removed = localStore.splice(idx, 1)[0];
    return {
      status: 200,
      statusText: "200 OK",
      validationMessage: "Record #102 deleted from local memory.",
      requestBody: null,
      responseBody: { simulation: true, deleted: removed }
    };
  }

  return {
    status: 405,
    statusText: "405 Method Not Allowed",
    validationMessage: "Combination of HTTP method and route is not enabled in this demo.",
    requestBody: null,
    responseBody: {
      simulation: true,
      error: "METHOD_ROUTE_MISMATCH",
      allowedExamples: [
        "GET /api/v1/sheets",
        "GET /api/v1/health",
        "POST /api/v1/sheets",
        "PUT /api/v1/sheets/101",
        "DELETE /api/v1/sheets/102"
      ]
    }
  };
}

export function renderApiSimulator(lang) {
  const isEn = lang === "en";
  return `
    <div class="lab-panel" id="lab-api-simulator">
      <div class="card-header">
        <div>
          <h3>1. API Simulator (REST & JSON)</h3>
          <p>${
            isEn
              ? "Local browser simulation of HTTP methods, payload validation, and status codes. No data is sent to external servers."
              : "Simulação local no navegador de métodos HTTP, validação de payloads e códigos de status. Nenhum dado é enviado a servidores reais."
          }</p>
        </div>
        <span class="status-badge status-development">${isEn ? "LOCAL SIMULATION" : "SIMULAÇÃO LOCAL"}</span>
      </div>

      <div class="lab-controls">
        <div class="field-group">
          <label for="api-method">${isEn ? "HTTP Method" : "Método HTTP"}</label>
          <select id="api-method" class="field-input">
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>

        <div class="field-group" style="flex:1;min-width:220px;">
          <label for="api-route">${isEn ? "Fictional Route" : "Rota Fictícia"}</label>
          <select id="api-route" class="field-input">
            <option value="/api/v1/sheets">/api/v1/sheets</option>
            <option value="/api/v1/health">/api/v1/health</option>
            <option value="/api/v1/sheets/101">/api/v1/sheets/101</option>
            <option value="/api/v1/sheets/102">/api/v1/sheets/102</option>
          </select>
        </div>

        <button type="button" class="btn btn-primary" id="api-send-btn">
          ${isEn ? "Execute Request" : "Executar Requisição"}
        </button>
        <button type="button" class="btn btn-secondary" id="api-reset-btn">
          ${isEn ? "Restore Initial State" : "Restaurar Estado Inicial"}
        </button>
      </div>

      <div class="field-group" style="margin-bottom:16px;">
        <label for="api-payload">${
          isEn
            ? "Request Payload (JSON for POST/PUT — never enter real passwords)"
            : "Corpo da Requisição (JSON para POST/PUT — nunca insira senhas reais)"
        }</label>
        <textarea id="api-payload" class="field-input" rows="4">{"character": "Lyra", "chassis": "Vanguard-MK2", "level": 4}</textarea>
      </div>

      <div id="api-status-output" class="notice-banner" role="status" aria-live="polite">
        ${isEn ? "Ready to simulate local request." : "Pronto para simular requisição local."}
      </div>

      <div class="grid-2" style="margin-top:16px;">
        <div class="terminal-box">
          <div class="terminal-bar">
            <span>REQUEST</span>
            <span class="mono" id="api-req-meta">GET /api/v1/sheets</span>
          </div>
          <pre class="terminal-body" id="api-req-body">null</pre>
        </div>
        <div class="terminal-box">
          <div class="terminal-bar">
            <span>RESPONSE</span>
            <span class="mono" id="api-res-status">200 OK</span>
          </div>
          <pre class="terminal-body" id="api-res-body"></pre>
        </div>
      </div>
    </div>
  `;
}

export function bindApiSimulatorEvents(lang) {
  const methodEl = document.getElementById("api-method");
  const routeEl = document.getElementById("api-route");
  const payloadEl = document.getElementById("api-payload");
  const sendBtn = document.getElementById("api-send-btn");
  const resetBtn = document.getElementById("api-reset-btn");
  const statusOut = document.getElementById("api-status-output");
  const reqMeta = document.getElementById("api-req-meta");
  const reqBody = document.getElementById("api-req-body");
  const resStatus = document.getElementById("api-res-status");
  const resBody = document.getElementById("api-res-body");

  if (!sendBtn || !resetBtn) return;

  const updateView = (result, method, route) => {
    reqMeta.textContent = `${method} ${route}`;
    reqBody.textContent = result.requestBody ? JSON.stringify(result.requestBody, null, 2) : "null";
    resStatus.textContent = result.statusText;
    resBody.textContent = JSON.stringify(result.responseBody, null, 2);
    statusOut.textContent = `[HTTP ${result.status}] ${result.validationMessage}`;
  };

  const initial = simulateApiRequest("GET", "/api/v1/sheets", "");
  updateView(initial, "GET", "/api/v1/sheets");

  sendBtn.addEventListener("click", () => {
    const m = methodEl.value;
    const r = routeEl.value;
    const p = payloadEl.value;
    const res = simulateApiRequest(m, r, p);
    updateView(res, m, r);
  });

  resetBtn.addEventListener("click", () => {
    resetApiSimulatorStore();
    methodEl.value = "GET";
    routeEl.value = "/api/v1/sheets";
    payloadEl.value = '{"character": "Lyra", "chassis": "Vanguard-MK2", "level": 4}';
    const res = simulateApiRequest("GET", "/api/v1/sheets", "");
    updateView(res, "GET", "/api/v1/sheets");
    statusOut.textContent =
      lang === "en"
        ? "Initial local state restored."
        : "Estado inicial local restaurado.";
  });
}
