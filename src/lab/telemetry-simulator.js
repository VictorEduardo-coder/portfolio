const VEHICLES = {
  "FLT-01": { name: "Unidade FLT-01 (Urbano)", baseSpeed: 58, baseTemp: 86 },
  "FLT-02": { name: "Unidade FLT-02 (Rodoviário)", baseSpeed: 88, baseTemp: 92 },
  "FLT-03": { name: "Unidade FLT-03 (VUC Logística)", baseSpeed: 45, baseTemp: 82 }
};

let telemetryInterval = null;
let tickCount = 0;
let historySpeeds = [58, 61, 59, 63, 60, 62];

export function stopTelemetryInterval() {
  if (telemetryInterval) {
    clearInterval(telemetryInterval);
    telemetryInterval = null;
  }
}

export function renderTelemetrySimulator(lang) {
  const isEn = lang === "en";
  return `
    <div class="lab-panel" id="lab-telemetry">
      <div class="card-header">
        <div>
          <h3>3. Network / Telemetry Monitor</h3>
          <p>${
            isEn
              ? "Visual demonstration of vehicle telemetry indicators and alerts. Strictly simulated data — not connected to physical vehicles or a live MQTT broker."
              : "Demonstração visual de indicadores de telemetria veicular e alertas. Dados estritamente simulados — sem conexão com veículos reais ou broker MQTT externo."
          }</p>
        </div>
        <span class="status-badge status-optimization">${isEn ? "SIMULATED DATA" : "DADOS SIMULADOS"}</span>
      </div>

      <div class="lab-controls">
        <div class="field-group">
          <label for="telemetry-vehicle">${isEn ? "Fictional Vehicle" : "Veículo Fictício"}</label>
          <select id="telemetry-vehicle" class="field-input">
            <option value="FLT-01">FLT-01 — Urbano</option>
            <option value="FLT-02">FLT-02 — Rodoviário</option>
            <option value="FLT-03">FLT-03 — Logística</option>
          </select>
        </div>

        <button type="button" class="btn btn-primary" id="telemetry-toggle-btn">
          ${isEn ? "Start Simulation" : "Iniciar Simulação"}
        </button>
        <button type="button" class="btn btn-secondary" id="telemetry-reset-btn">
          ${isEn ? "Reset" : "Reiniciar"}
        </button>
      </div>

      <div class="telemetry-metrics">
        <div class="metric-box">
          <div class="metric-label">${isEn ? "SIMULATED SPEED" : "VELOCIDADE SIMULADA"}</div>
          <div class="metric-value" id="tm-speed">58 km/h</div>
        </div>
        <div class="metric-box">
          <div class="metric-label">${isEn ? "COOLANT TEMP" : "TEMPERATURA MOTOR"}</div>
          <div class="metric-value" id="tm-temp">86 °C</div>
        </div>
        <div class="metric-box">
          <div class="metric-label">${isEn ? "LINK STATE" : "ESTADO DA CONEXÃO"}</div>
          <div class="metric-value" id="tm-conn">ONLINE (SIM)</div>
        </div>
        <div class="metric-box">
          <div class="metric-label">${isEn ? "ALERT STATUS" : "ALERTA OPERACIONAL"}</div>
          <div class="metric-value" id="tm-alert">NORMAL</div>
        </div>
      </div>

      <div class="terminal-box">
        <div class="terminal-bar">
          <span>SIMULATED TELEMETRY CHART (SVG)</span>
          <span class="mono" id="tm-ticks">ticks: 0/30</span>
        </div>
        <div class="terminal-body">
          <svg id="tm-svg" viewBox="0 0 500 110" width="100%" height="110" role="img" aria-label="Simulated telemetry speed history chart">
            <line x1="0" y1="25" x2="500" y2="25" stroke="#262C36" stroke-dasharray="4 4"/>
            <line x1="0" y1="55" x2="500" y2="55" stroke="#262C36" stroke-dasharray="4 4"/>
            <line x1="0" y1="85" x2="500" y2="85" stroke="#262C36" stroke-dasharray="4 4"/>
            <polyline id="tm-polyline" fill="none" stroke="#E5484D" stroke-width="3" points="0,65 90,60 180,63 270,56 360,61 450,58"/>
          </svg>
        </div>
      </div>
    </div>
  `;
}

export function bindTelemetrySimulatorEvents(lang) {
  stopTelemetryInterval();
  const vehicleEl = document.getElementById("telemetry-vehicle");
  const toggleBtn = document.getElementById("telemetry-toggle-btn");
  const resetBtn = document.getElementById("telemetry-reset-btn");
  const speedEl = document.getElementById("tm-speed");
  const tempEl = document.getElementById("tm-temp");
  const connEl = document.getElementById("tm-conn");
  const alertEl = document.getElementById("tm-alert");
  const ticksEl = document.getElementById("tm-ticks");
  const polyEl = document.getElementById("tm-polyline");

  if (!vehicleEl || !toggleBtn) return;

  const isEn = lang === "en";

  const drawSvg = () => {
    const pts = historySpeeds
      .map((spd, idx) => {
        const x = idx * 80;
        const y = Math.max(12, Math.min(98, 105 - spd * 0.8));
        return `${x},${Math.round(y)}`;
      })
      .join(" ");
    polyEl.setAttribute("points", pts);
  };

  const stepSimulation = () => {
    tickCount += 1;
    if (tickCount >= 30) {
      stopTelemetryInterval();
      toggleBtn.textContent = isEn ? "Start Simulation" : "Iniciar Simulação";
    }
    const v = VEHICLES[vehicleEl.value] || VEHICLES["FLT-01"];
    const wave = Math.round(Math.sin(tickCount * 0.7) * 9);
    const speed = Math.max(0, v.baseSpeed + wave);
    const temp = v.baseTemp + Math.round(Math.cos(tickCount * 0.5) * 6);

    historySpeeds.push(speed);
    if (historySpeeds.length > 7) historySpeeds.shift();

    speedEl.textContent = `${speed} km/h`;
    tempEl.textContent = `${temp} °C`;
    connEl.textContent = "ONLINE (SIM)";
    if (temp >= 96 || speed >= 94) {
      alertEl.textContent = isEn ? "HIGH TEMP/SPEED" : "TEMP/VEL ALTA";
      alertEl.style.color = "var(--accent-red)";
    } else {
      alertEl.textContent = "NORMAL";
      alertEl.style.color = "var(--status-success)";
    }
    ticksEl.textContent = `ticks: ${tickCount}/30`;
    drawSvg();
  };

  toggleBtn.addEventListener("click", () => {
    if (telemetryInterval) {
      stopTelemetryInterval();
      toggleBtn.textContent = isEn ? "Start Simulation" : "Iniciar Simulação";
    } else {
      if (tickCount >= 30) tickCount = 0;
      toggleBtn.textContent = isEn ? "Stop Simulation" : "Parar Simulação";
      stepSimulation();
      telemetryInterval = setInterval(stepSimulation, 1100);
    }
  });

  resetBtn.addEventListener("click", () => {
    stopTelemetryInterval();
    tickCount = 0;
    const v = VEHICLES[vehicleEl.value] || VEHICLES["FLT-01"];
    historySpeeds = [v.baseSpeed, v.baseSpeed + 2, v.baseSpeed - 1, v.baseSpeed + 3, v.baseSpeed, v.baseSpeed + 1];
    speedEl.textContent = `${v.baseSpeed} km/h`;
    tempEl.textContent = `${v.baseTemp} °C`;
    alertEl.textContent = "NORMAL";
    alertEl.style.color = "var(--status-success)";
    ticksEl.textContent = "ticks: 0/30";
    toggleBtn.textContent = isEn ? "Start Simulation" : "Iniciar Simulação";
    drawSvg();
  });

  vehicleEl.addEventListener("change", () => {
    resetBtn.click();
  });
}
