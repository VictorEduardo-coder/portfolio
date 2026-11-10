const AGENT_DEFS = [
  { id: "ui-layout", color: "#3B82F6" },
  { id: "dom-builder", color: "#E5484D" },
  { id: "core-sync", color: "#2EAD6B" },
  { id: "api-worker", color: "#F59E0B" },
  { id: "grid-align", color: "#A855F7" },
  { id: "sql-schema", color: "#06B6D4" },
  { id: "jvm-thread", color: "#EC4899" },
  { id: "compose-ui", color: "#84CC16" },
  { id: "vec-math", color: "#60A5FA" },
  { id: "sec-guard", color: "#F97316" }
];

let swarmState = {
  enabled: true,
  rafId: null,
  observer: null,
  agents: [],
  queue: [],
  activeJobs: [],
  overlayEl: null,
  bootHubEl: null,
  startTime: 0,
  lastActivityTime: 0,
  bootPhaseDone: false,
  hibernating: false,
  listenersAttached: false
};

function createCursorSvg(color) {
  return `<svg width="15" height="18" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 1L13.5 8.2L7.4 10.1L4.6 16.5L1 1Z" fill="${color}" stroke="#ffffff" stroke-width="1.2" stroke-linejoin="round"/>
  </svg>`;
}

function refreshActiveJobRects() {
  for (let i = 0; i < swarmState.activeJobs.length; i++) {
    const job = swarmState.activeJobs[i];
    if (job.el && document.body.contains(job.el)) {
      job.cachedRect = job.el.getBoundingClientRect();
    }
  }
}

function wakeUpSwarm() {
  if (!swarmState.enabled) return;
  swarmState.lastActivityTime = performance.now();
  refreshActiveJobRects();
  if (swarmState.hibernating && !swarmState.rafId) {
    swarmState.hibernating = false;
    swarmState.rafId = requestAnimationFrame(runSwarmTick);
  }
}

export function stopCursorSwarm(revealAll = true) {
  if (swarmState.rafId) {
    cancelAnimationFrame(swarmState.rafId);
    swarmState.rafId = null;
  }
  if (swarmState.observer) {
    swarmState.observer.disconnect();
    swarmState.observer = null;
  }
  if (swarmState.overlayEl) {
    swarmState.overlayEl.innerHTML = "";
  }
  swarmState.activeJobs = [];
  swarmState.queue = [];
  swarmState.hibernating = false;
  if (revealAll && typeof document !== "undefined") {
    document.querySelectorAll("[data-swarm-target]").forEach((el) => {
      el.classList.remove("swarm-pending", "swarm-building");
      el.classList.add("swarm-built");
    });
  }
}

function runSwarmTick(now) {
  const elapsed = now - swarmState.startTime;
  const cx = window.innerWidth * 0.5;
  const cy = window.innerHeight * 0.5;

  if (!swarmState.bootPhaseDone) {
    if (elapsed < 360) {
      swarmState.agents.forEach((ag, idx) => {
        const a = ag.phaseOffset + elapsed * 0.006;
        const r = 48 + (idx % 3) * 14;
        ag.tx = cx + Math.cos(a) * r;
        ag.ty = cy + Math.sin(a) * r;
        ag.x += (ag.tx - ag.x) * 0.25;
        ag.y += (ag.ty - ag.y) * 0.25;
        ag.el.style.transform = `translate3d(${ag.x.toFixed(1)}px, ${ag.y.toFixed(1)}px, 0)`;
      });
      swarmState.rafId = requestAnimationFrame(runSwarmTick);
      return;
    } else {
      swarmState.bootPhaseDone = true;
      if (swarmState.bootHubEl) {
        swarmState.bootHubEl.classList.add("is-hidden");
      }
    }
  }

  while (swarmState.queue.length > 0) {
    const freeAgents = swarmState.agents.filter((a) => !a.busy);
    if (freeAgents.length < 2) break;

    const targetEl = swarmState.queue.shift();
    if (!targetEl || !document.body.contains(targetEl)) continue;

    const rect = targetEl.getBoundingClientRect();
    if (rect.width < 10 || rect.height < 10) {
      targetEl.classList.remove("swarm-pending");
      targetEl.classList.add("swarm-built");
      continue;
    }

    const anchorAgent = freeAgents[0];
    const pullAgent = freeAgents[1];
    anchorAgent.busy = true;
    pullAgent.busy = true;

    targetEl.classList.remove("swarm-pending");
    targetEl.classList.add("swarm-building");

    const boxEl = document.createElement("div");
    boxEl.className = "swarm-selection-box";
    boxEl.innerHTML = `
      <span class="swarm-handle tl"></span>
      <span class="swarm-handle tr"></span>
      <span class="swarm-handle bl"></span>
      <span class="swarm-handle br"></span>
      <span class="swarm-dim-badge">0 × 0</span>
    `;
    swarmState.overlayEl.appendChild(boxEl);

    swarmState.lastActivityTime = now;
    swarmState.activeJobs.push({
      el: targetEl,
      cachedRect: rect,
      boxEl,
      badgeEl: boxEl.querySelector(".swarm-dim-badge"),
      anchorAgent,
      pullAgent,
      startTime: now,
      duration: 420 + Math.min(200, (rect.width + rect.height) * 0.12)
    });
  }

  for (let i = swarmState.activeJobs.length - 1; i >= 0; i--) {
    const job = swarmState.activeJobs[i];
    const rect = job.cachedRect || job.el.getBoundingClientRect();
    const rawProgress = (now - job.startTime) / job.duration;
    const p = Math.max(0, Math.min(1, rawProgress));
    const ease = 1 - Math.pow(1 - p, 3);

    const curW = Math.max(18, rect.width * ease);
    const curH = Math.max(16, rect.height * ease);

    job.boxEl.style.left = `${rect.left.toFixed(1)}px`;
    job.boxEl.style.top = `${rect.top.toFixed(1)}px`;
    job.boxEl.style.width = `${curW.toFixed(1)}px`;
    job.boxEl.style.height = `${curH.toFixed(1)}px`;

    if (job.badgeEl) {
      job.badgeEl.textContent = `${Math.round(curW)} × ${Math.round(curH)}`;
    }

    job.anchorAgent.tx = rect.left - 4;
    job.anchorAgent.ty = rect.top - 4;
    job.pullAgent.tx = rect.left + curW;
    job.pullAgent.ty = rect.top + curH;

    if (p >= 1) {
      job.el.classList.remove("swarm-building", "swarm-pending");
      job.el.classList.add("swarm-built");
      job.boxEl.remove();
      job.anchorAgent.busy = false;
      job.pullAgent.busy = false;
      swarmState.activeJobs.splice(i, 1);
      swarmState.lastActivityTime = now;
    }
  }

  const orbitCenterX = Math.max(180, window.innerWidth - 90);
  const orbitCenterY = window.innerHeight * 0.56;

  swarmState.agents.forEach((ag, idx) => {
    if (!ag.busy) {
      const t = now * 0.0018 + ag.phaseOffset;
      const rx = 38 + (idx % 3) * 12;
      const ry = 54 + (idx % 2) * 18;
      ag.tx = orbitCenterX + Math.cos(t) * rx;
      ag.ty = orbitCenterY + Math.sin(t * 1.3) * ry;
    }
    const speed = ag.busy ? 0.34 : 0.09;
    ag.x += (ag.tx - ag.x) * speed;
    ag.y += (ag.ty - ag.y) * speed;
    ag.el.style.transform = `translate3d(${ag.x.toFixed(1)}px, ${ag.y.toFixed(1)}px, 0)`;
  });

  if (
    swarmState.activeJobs.length === 0 &&
    swarmState.queue.length === 0 &&
    now - swarmState.lastActivityTime > 4000
  ) {
    swarmState.hibernating = true;
    swarmState.rafId = null;
    return;
  }

  swarmState.rafId = requestAnimationFrame(runSwarmTick);
}

export function initCursorSwarm() {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const prefersReduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let overlay = document.getElementById("swarm-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "swarm-overlay";
    overlay.setAttribute("aria-hidden", "true");
    document.body.appendChild(overlay);
  }
  swarmState.overlayEl = overlay;

  if (prefersReduced || !swarmState.enabled) {
    stopCursorSwarm(true);
    return;
  }

  stopCursorSwarm(false);

  if (!swarmState.listenersAttached) {
    window.addEventListener("scroll", wakeUpSwarm, { passive: true });
    window.addEventListener("resize", wakeUpSwarm, { passive: true });
    swarmState.listenersAttached = true;
  }

  const isMobile = window.innerWidth <= 600;
  const activeDefs = isMobile ? AGENT_DEFS.slice(0, 4) : AGENT_DEFS;

  const cx = window.innerWidth * 0.5;
  const cy = window.innerHeight * 0.5;

  const bootHub = document.createElement("div");
  bootHub.className = "swarm-boot-hub";
  bootHub.textContent = ">_";
  overlay.appendChild(bootHub);
  swarmState.bootHubEl = bootHub;

  swarmState.agents = activeDefs.map((def, idx) => {
    const angle = (idx / activeDefs.length) * Math.PI * 2;
    const radius = 50 + (idx % 3) * 15;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;

    const el = document.createElement("div");
    el.className = "swarm-cursor";
    el.innerHTML = `${createCursorSvg(def.color)}<span class="swarm-cursor-tag" style="background:${def.color}">${def.id}</span>`;
    overlay.appendChild(el);

    return {
      id: def.id,
      color: def.color,
      el,
      x,
      y,
      tx: x,
      ty: y,
      busy: false,
      phaseOffset: angle
    };
  });

  const targets = Array.from(document.querySelectorAll("[data-swarm-target]"));
  targets.forEach((el) => {
    el.classList.remove("swarm-built", "swarm-building");
    el.classList.add("swarm-pending");
  });

  swarmState.observer = new IntersectionObserver(
    (entries) => {
      let added = false;
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          if (
            el.classList.contains("swarm-pending") &&
            !swarmState.queue.includes(el) &&
            !swarmState.activeJobs.some((j) => j.el === el)
          ) {
            swarmState.queue.push(el);
            added = true;
          }
        }
      });
      if (added) {
        wakeUpSwarm();
      }
    },
    { rootMargin: "0px 0px -5% 0px", threshold: 0.05 }
  );

  targets.forEach((t) => swarmState.observer.observe(t));

  const now = performance.now();
  swarmState.startTime = now;
  swarmState.lastActivityTime = now;
  swarmState.bootPhaseDone = false;
  swarmState.hibernating = false;
  swarmState.rafId = requestAnimationFrame(runSwarmTick);
}

export function toggleCursorSwarm() {
  swarmState.enabled = !swarmState.enabled;
  if (swarmState.enabled) {
    initCursorSwarm();
  } else {
    stopCursorSwarm(true);
  }
  return swarmState.enabled;
}

export function isCursorSwarmEnabled() {
  return swarmState.enabled;
}
