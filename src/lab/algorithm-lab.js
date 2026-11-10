import { escapeHtml } from "../components/status-badge.js";

export function runQuickSortSteps(numbers) {
  const arr = numbers.slice(0, 12).map((n) => Number(n)).filter((n) => Number.isFinite(n));
  const steps = [];
  steps.push(`Input (${arr.length} items): [${arr.join(", ")}]`);

  function sort(sub) {
    if (sub.length <= 1) return sub;
    const pivot = sub[Math.floor(sub.length / 2)];
    const left = sub.filter((x) => x < pivot);
    const equal = sub.filter((x) => x === pivot);
    const right = sub.filter((x) => x > pivot);
    steps.push(`Pivot ${pivot} -> left:[${left.join(", ")}] | eq:[${equal.join(", ")}] | right:[${right.join(", ")}]`);
    return [...sort(left), ...equal, ...sort(right)];
  }

  const sorted = sort(arr);
  steps.push(`Sorted output: [${sorted.join(", ")}]`);
  return {
    result: sorted,
    steps,
    complexity: "Time: O(n log n) avg / O(n²) worst | Space: O(n)"
  };
}

export function runBinarySearchSteps(numbers, targetValue) {
  const sorted = numbers
    .slice(0, 15)
    .map((n) => Number(n))
    .filter((n) => Number.isFinite(n))
    .sort((a, b) => a - b);
  const target = Number(targetValue);
  const steps = [`Sorted array: [${sorted.join(", ")}], Target: ${target}`];

  let low = 0;
  let high = sorted.length - 1;
  let foundIndex = -1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const midVal = sorted[mid];
    steps.push(`low=${low}, high=${high} -> mid=${mid} (value=${midVal})`);
    if (midVal === target) {
      foundIndex = mid;
      steps.push(`Target ${target} found at index ${mid}.`);
      break;
    } else if (midVal < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  if (foundIndex === -1) {
    steps.push(`Target ${target} not found in array.`);
  }

  return {
    result: foundIndex,
    sortedArray: sorted,
    steps,
    complexity: "Time: O(log n) | Space: O(1) (after sorting)"
  };
}

export function runLinearSearchSteps(numbers, targetValue) {
  const arr = numbers
    .slice(0, 15)
    .map((n) => Number(n))
    .filter((n) => Number.isFinite(n));
  const target = Number(targetValue);
  const steps = [`Input array: [${arr.join(", ")}], Target: ${target}`];
  let foundIndex = -1;

  for (let i = 0; i < arr.length; i++) {
    steps.push(`Step ${i + 1}: checking index ${i} (value=${arr[i]})`);
    if (arr[i] === target) {
      foundIndex = i;
      steps.push(`Match! Target ${target} found at index ${i}.`);
      break;
    }
  }

  if (foundIndex === -1) {
    steps.push(`Target ${target} not found after scanning ${arr.length} elements.`);
  }

  return {
    result: foundIndex,
    steps,
    complexity: "Time: O(n) | Space: O(1)"
  };
}

export function runStackQueueSimulation(numbers) {
  const items = numbers
    .slice(0, 8)
    .map((n) => Number(n))
    .filter((n) => Number.isFinite(n));
  const stack = [];
  const queue = [];
  const steps = [`Input sequence: [${items.join(", ")}]`];

  for (const val of items) {
    stack.push(val);
    queue.push(val);
    steps.push(`PUSH / ENQUEUE ${val} -> Stack top=${stack[stack.length - 1]} | Queue front=${queue[0]}`);
  }

  const popped = stack.pop();
  const dequeued = queue.shift();
  steps.push(`POP (LIFO) removed ${popped} -> Remaining Stack: [${stack.join(", ")}]`);
  steps.push(`DEQUEUE (FIFO) removed ${dequeued} -> Remaining Queue: [${queue.join(", ")}]`);

  return {
    stackRemaining: stack,
    queueRemaining: queue,
    popped,
    dequeued,
    steps,
    complexity: "Time: O(1) per push/pop/enqueue/dequeue | Space: O(n)"
  };
}

export function runKnapsackStudyPlanner(capacityHours, customTasks) {
  const cap = Math.max(1, Math.min(12, Math.floor(Number(capacityHours) || 6)));
  const tasks =
    Array.isArray(customTasks) && customTasks.length > 0
      ? customTasks
      : [
          { name: "Revisão Álgebra Linear", hours: 2, priority: 7 },
          { name: "Lab Redes HTTP/FTP", hours: 3, priority: 9 },
          { name: "Refatorar DAO SQLite", hours: 2, priority: 6 },
          { name: "Leitura Artigo IA", hours: 1, priority: 4 },
          { name: "Testes Spring Boot", hours: 3, priority: 8 }
        ];

  const n = tasks.length;
  const dp = Array.from({ length: n + 1 }, () => Array(cap + 1).fill(0));
  const steps = [`Available time budget: ${cap}h | Candidate tasks: ${n}`];

  for (let i = 1; i <= n; i++) {
    const task = tasks[i - 1];
    for (let w = 0; w <= cap; w++) {
      if (task.hours <= w) {
        const take = task.priority + dp[i - 1][w - task.hours];
        const skip = dp[i - 1][w];
        dp[i][w] = Math.max(take, skip);
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
    steps.push(
      `Evaluated "${task.name}" (${task.hours}h, priority=${task.priority}) -> max score at ${cap}h = ${dp[i][cap]}`
    );
  }

  const selected = [];
  let rem = cap;
  for (let i = n; i >= 1; i--) {
    if (dp[i][rem] !== dp[i - 1][rem]) {
      selected.push(tasks[i - 1]);
      rem -= tasks[i - 1].hours;
    }
  }
  selected.reverse();

  return {
    maxPriorityScore: dp[n][cap],
    selectedTasks: selected,
    steps,
    complexity: `Time: O(n × W) where n=${n}, W=${cap} | Space: O(n × W)`
  };
}

export function renderAlgorithmLab(lang) {
  const isEn = lang === "en";
  return `
    <div class="lab-panel" id="lab-algorithm">
      <div class="card-header">
        <div>
          <h3>2. Algorithm Lab</h3>
          <p>${
            isEn
              ? "Interactive step-by-step execution of 0/1 Knapsack, QuickSort, Binary Search, Linear Search, and Stack (LIFO) / Queue (FIFO) with bounded inputs."
              : "Execução passo a passo interativa do Problema da Mochila 0/1, QuickSort, Busca Binária, Busca Linear e Pilha (LIFO) / Fila (FIFO) com entradas controladas."
          }</p>
        </div>
        <span class="status-badge status-completed">${isEn ? "DETERMINISTIC" : "DETERMINÍSTICO"}</span>
      </div>

      <div class="lab-controls">
        <div class="field-group">
          <label for="algo-select">${isEn ? "Select Algorithm" : "Selecionar Algoritmo"}</label>
          <select id="algo-select" class="field-input">
            <option value="knapsack">${isEn ? "0/1 Knapsack (Study Task Prioritization)" : "Problema da Mochila 0/1 (Priorização de Estudos)"}</option>
            <option value="quicksort">${isEn ? "QuickSort (Number Sorting)" : "QuickSort (Ordenação de Números)"}</option>
            <option value="binarysearch">${isEn ? "Binary Search" : "Busca Binária"}</option>
            <option value="linearsearch">${isEn ? "Linear Search" : "Busca Linear"}</option>
            <option value="stackqueue">${isEn ? "Stack (LIFO) & Queue (FIFO)" : "Pilha (LIFO) & Fila (FIFO)"}</option>
          </select>
        </div>

        <div class="field-group" style="flex:1;min-width:200px;">
          <label for="algo-input">${isEn ? "Numbers (comma-separated) or Hours (1-12)" : "Números (separados por vírgula) ou Horas (1-12)"}</label>
          <input id="algo-input" type="text" class="field-input" value="6" />
        </div>

        <div class="field-group" id="algo-target-group" style="width:130px;">
          <label for="algo-target">${isEn ? "Search Target" : "Alvo da Busca"}</label>
          <input id="algo-target" type="number" class="field-input" value="23" />
        </div>

        <button type="button" class="btn btn-primary" id="algo-run-btn">${isEn ? "Run Step-by-Step" : "Executar Passo a Passo"}</button>
        <button type="button" class="btn btn-secondary" id="algo-reset-btn">${isEn ? "Reset" : "Reiniciar"}</button>
      </div>

      <div id="algo-complexity" class="notice-banner" role="status" aria-live="polite"></div>

      <div class="terminal-box" style="margin-top:16px;">
        <div class="terminal-bar">
          <span>EXECUTION TRACE</span>
          <span class="mono" id="algo-trace-label">knapsack_01.trace</span>
        </div>
        <pre class="terminal-body" id="algo-output"></pre>
      </div>
    </div>
  `;
}

export function bindAlgorithmLabEvents(lang) {
  const selectEl = document.getElementById("algo-select");
  const inputEl = document.getElementById("algo-input");
  const targetEl = document.getElementById("algo-target");
  const runBtn = document.getElementById("algo-run-btn");
  const resetBtn = document.getElementById("algo-reset-btn");
  const compEl = document.getElementById("algo-complexity");
  const outEl = document.getElementById("algo-output");
  const traceLabel = document.getElementById("algo-trace-label");

  if (!selectEl || !runBtn) return;

  const parseNumList = (fallback) => {
    const nums = inputEl.value
      .split(",")
      .map((x) => Number(x.trim()))
      .filter((x) => Number.isFinite(x));
    return nums.length > 0 ? nums : fallback;
  };

  const executeCurrent = () => {
    const mode = selectEl.value;
    if (mode === "knapsack") {
      traceLabel.textContent = "knapsack_01.trace";
      const hours = Number(inputEl.value) || 6;
      const res = runKnapsackStudyPlanner(hours);
      compEl.textContent = res.complexity;
      const summary = res.selectedTasks
        .map((t) => `• ${t.name} (${t.hours}h, score=${t.priority})`)
        .join("\n");
      outEl.textContent =
        res.steps.join("\n") +
        `\n\nSelected Tasks (Total Score = ${res.maxPriorityScore}):\n` +
        summary;
    } else if (mode === "quicksort") {
      traceLabel.textContent = "quicksort.trace";
      const res = runQuickSortSteps(parseNumList([42, 15, 8, 99, 23, 4, 16]));
      compEl.textContent = res.complexity;
      outEl.textContent = res.steps.join("\n");
    } else if (mode === "binarysearch") {
      traceLabel.textContent = "binary_search.trace";
      const res = runBinarySearchSteps(
        parseNumList([4, 8, 15, 16, 23, 42, 99]),
        Number(targetEl.value || 23)
      );
      compEl.textContent = res.complexity;
      outEl.textContent = res.steps.join("\n");
    } else if (mode === "linearsearch") {
      traceLabel.textContent = "linear_search.trace";
      const res = runLinearSearchSteps(
        parseNumList([42, 15, 8, 99, 23, 4, 16]),
        Number(targetEl.value || 23)
      );
      compEl.textContent = res.complexity;
      outEl.textContent = res.steps.join("\n");
    } else {
      traceLabel.textContent = "stack_queue.trace";
      const res = runStackQueueSimulation(parseNumList([10, 20, 30, 40, 50]));
      compEl.textContent = res.complexity;
      outEl.textContent = res.steps.join("\n");
    }
  };

  selectEl.addEventListener("change", () => {
    if (selectEl.value === "knapsack") {
      inputEl.value = "6";
    } else if (selectEl.value === "stackqueue") {
      inputEl.value = "10, 20, 30, 40, 50";
    } else {
      inputEl.value = "42, 15, 8, 99, 23, 4, 16";
    }
    executeCurrent();
  });

  runBtn.addEventListener("click", executeCurrent);
  resetBtn.addEventListener("click", () => {
    selectEl.value = "knapsack";
    inputEl.value = "6";
    targetEl.value = "23";
    executeCurrent();
  });

  executeCurrent();
}
