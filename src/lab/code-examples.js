import { escapeHtml } from "../components/status-badge.js";

export const CODE_EXAMPLES = {
  "spring-layered": {
    titlePt: "Java / Spring Boot — Serviço de Fichas com Validação",
    titleEn: "Java / Spring Boot — Character Sheet Validation Service",
    language: "Java 21 + Spring Boot",
    explanationPt: "Demonstra isolamento da regra de negócio na camada Service antes de persistir a entidade via repositório, evitando acoplamento no Controller.",
    explanationEn: "Demonstrates isolating domain validation inside the Service layer prior to repository persistence, keeping the REST Controller thin.",
    code: `@Service
public class CharacterSheetService {

    private final CharacterSheetRepository repository;

    public CharacterSheetService(CharacterSheetRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public SheetResponseDto registerSheet(CreateSheetRequest request) {
        if (request.level() < 1 || request.level() > 20) {
            throw new IllegalArgumentException("Character level must be between 1 and 20.");
        }
        CharacterSheet entity = new CharacterSheet(
            request.characterName().trim(),
            request.chassisName().trim(),
            request.level()
        );
        CharacterSheet saved = repository.save(entity);
        return new SheetResponseDto(saved.getId(), saved.getCharacterName(), saved.getLevel());
    }
}`,
    output: `[PRE-COMPUTED TRACE]
Input DTO : CreateSheetRequest[characterName="Apito", chassisName="Abelha Rainha", level=3]
Validation: level=3 (1 <= 3 <= 20) -> PASSED
Persistence: CharacterSheet persisted with id=101
Returned  : SheetResponseDto[id=101, characterName="Apito", level=3]`
  },
  "c11-linear": {
    titlePt: "C (C11) — Produto Matriz-Vetor com Alocação Contígua",
    titleEn: "C (C11) — Matrix-Vector Multiplication with Contiguous Memory",
    language: "C11",
    explanationPt: "Exemplo de fundamento em C11 aplicando Álgebra Linear e acesso sequencial amigável ao cache para multiplicação matriz-vetor.",
    explanationEn: "C11 fundamentals example applying Linear Algebra and cache-friendly sequential memory access for matrix-vector multiplication.",
    code: `#include <stdio.h>
#include <stddef.h>

void matvec_multiply(const double *matrix, const double *vec, double *out, size_t rows, size_t cols) {
    for (size_t i = 0; i < rows; ++i) {
        double acc = 0.0;
        for (size_t j = 0; j < cols; ++j) {
            acc += matrix[i * cols + j] * vec[j];
        }
        out[i] = acc;
    }
}

int main(void) {
    const double A[6] = {2.0, 1.0, 0.0, 3.0, 4.0, -1.0};
    const double x[3] = {1.5, 2.0, 0.5};
    double y[2] = {0.0, 0.0};
    matvec_multiply(A, x, y, 2, 3);
    printf("y = [%.2f, %.2f]\n", y[0], y[1]);
    return 0;
}`,
    output: `[PRE-COMPUTED STDOUT]
Row 0: (2.0 * 1.5) + (1.0 * 2.0) + (0.0 * 0.5) = 5.00
Row 1: (3.0 * 1.5) + (4.0 * 2.0) + (-1.0 * 0.5) = 12.00
y = [5.00, 12.00]`
  },
  "kotlin-compose": {
    titlePt: "Kotlin / Jetpack Compose — Estado Imutável de UI",
    titleEn: "Kotlin / Jetpack Compose — Immutable UI State",
    language: "Kotlin + Jetpack Compose",
    explanationPt: "Modelagem unidirecional de estado (UDF) no Android para exibir indicadores do dispositivo de forma reativa e previsível.",
    explanationEn: "Unidirectional Data Flow (UDF) state modeling on Android to render device indicators predictably.",
    code: `data class StorageUiState(
    val mediaFilesCount: Int = 0,
    val usedRamMb: Int = 0,
    val totalRamMb: Int = 6144,
    val isScanning: Boolean = false
) {
    val usageRatio: Float
        get() = if (totalRamMb > 0) usedRamMb.toFloat() / totalRamMb else 0f
}`,
    output: `[PRE-COMPUTED STATE SNAPSHOT]
StorageUiState(mediaFilesCount=148, usedRamMb=2890, totalRamMb=6144, isScanning=false)
Computed usageRatio = 0.4703 (47.0%)`
  }
};

export function renderCodePlayground(lang) {
  const isEn = lang === "en";
  const initial = CODE_EXAMPLES["spring-layered"];
  return `
    <div class="lab-panel" id="lab-code-playground">
      <div class="card-header">
        <div>
          <h3>4. Code Playground</h3>
          <p>${
            isEn
              ? "Curated code examples with pre-computed, safe deterministic output (no arbitrary eval or remote code execution)."
              : "Exemplos selecionados de código com saída determinística previamente calculada e segura (sem uso de eval ou execução arbitrária)."
          }</p>
        </div>
        <span class="status-badge status-completed">${isEn ? "SAFE SANDBOX" : "EXECUÇÃO SEGURA"}</span>
      </div>

      <div class="lab-controls">
        <div class="field-group" style="flex:1;min-width:240px;">
          <label for="code-example-select">${isEn ? "Select Example" : "Selecionar Exemplo"}</label>
          <select id="code-example-select" class="field-input">
            <option value="spring-layered">${escapeHtml(isEn ? initial.titleEn : initial.titlePt)}</option>
            <option value="c11-linear">${escapeHtml(isEn ? CODE_EXAMPLES["c11-linear"].titleEn : CODE_EXAMPLES["c11-linear"].titlePt)}</option>
            <option value="kotlin-compose">${escapeHtml(isEn ? CODE_EXAMPLES["kotlin-compose"].titleEn : CODE_EXAMPLES["kotlin-compose"].titlePt)}</option>
          </select>
        </div>
      </div>

      <p id="code-explanation" class="notice-banner">${escapeHtml(isEn ? initial.explanationEn : initial.explanationPt)}</p>

      <div class="grid-2" style="margin-top:16px;">
        <div class="terminal-box">
          <div class="terminal-bar">
            <span>SOURCE CODE</span>
            <span class="mono" id="code-lang-badge">${escapeHtml(initial.language)}</span>
          </div>
          <pre class="terminal-body"><code id="code-source-view">${escapeHtml(initial.code)}</code></pre>
        </div>
        <div class="terminal-box">
          <div class="terminal-bar">
            <span>VERIFIED OUTPUT</span>
            <span class="mono">stdout</span>
          </div>
          <pre class="terminal-body" id="code-output-view">${escapeHtml(initial.output)}</pre>
        </div>
      </div>
    </div>
  `;
}

export function bindCodePlaygroundEvents(lang) {
  const selectEl = document.getElementById("code-example-select");
  const expEl = document.getElementById("code-explanation");
  const badgeEl = document.getElementById("code-lang-badge");
  const srcEl = document.getElementById("code-source-view");
  const outEl = document.getElementById("code-output-view");

  if (!selectEl) return;
  const isEn = lang === "en";

  selectEl.addEventListener("change", () => {
    const item = CODE_EXAMPLES[selectEl.value] || CODE_EXAMPLES["spring-layered"];
    expEl.textContent = isEn ? item.explanationEn : item.explanationPt;
    badgeEl.textContent = item.language;
    srcEl.textContent = item.code;
    outEl.textContent = item.output;
  });
}
