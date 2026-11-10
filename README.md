# Portfólio Profissional — Victor Eduardo (`VICTOR.EXE` v3 Final)

Portfólio profissional e vitrine técnica de **Victor Eduardo Almeida dos Santos**, estudante do 3º período de Engenharia da Computação na **Universidade Federal de Goiás (UFG)** com foco em Backend, Engenharia de Software, Automação e Integração de Sistemas.

## 1. Destaques desta Versão Final (v3)

- **Foto de Perfil em Alta Resolução e Cores Naturais:** Convertida para `public/images/profile.webp` (400×400px) e exibida sem distorção de cor no card central do Hero.
- **Currículo Oficial Integrado (`public/documents/resume.pdf`):** Botões independentes de **Ver Currículo** (abre em nova aba) e **Baixar Currículo (PDF)** (`download="Curriculo-Victor-Eduardo.pdf"`) habilitados no Hero e na seção de Contato.
- **Galeria Interativa com Capturas de Tela Reais nos Projetos:**
  - **SystemRPG (ZERO RPG):** 5 telas reais verificadas (Ficha/Status Base e Moedas `R$`, `G`, `TR`; Painel de Rolagens Ao Vivo; Perícias, Status do Hardware/Realidade e Corrupção com enquadramento ajustado; Criação de Personagem; Login).
  - **Gestão de Frotas e Telemetria:** Diagrama de Arquitetura + 6 telas reais em JavaFX (Painel do Operador Autenticado 1 Fator, Cadastro de Veículos, Cadastro de Sensores, Diagnóstico em Tempo Real com Velocímetro, Meu Veículo & Sensores e Login).
  - **Guardião Mobile:** Vitrine composta das 3 telas + visualização individual no modal (Central de Proteção, Memória e 2º Plano e Downloads Automáticos).
  - **4BIAVS (`BIA4vs`):** Captura real da interface desktop escura em Python ("BIA4vs — Assistente de Pesquisa e Análise de Código").
  - **Bot Acadêmico:** Diagrama arquitetural detalhado do pipeline `IMAP Reader -> Async Worker -> Mochila 0/1 -> Discord JDA`.
- **Engine de Cursores Construtores Otimizada (`src/lab/cursor-swarm.js`):**
  - Puxa os blocos da página em tempo real com caixas de seleção CAD/Figma e dimensões `LARGURA × ALTURA`.
  - Reduz automaticamente para 4 cursores em telas móveis (`<= 600px`), faz cache de `getBoundingClientRect()` e **hiberna automaticamente o loop `requestAnimationFrame` após 4 segundos sem rolagem** (consumo zero de CPU em repouso, acordando instantaneamente ao rolar a página).
- **TECH LAB Completo:**
  - `API Simulator` (REST & JSON com validação local e bloqueio de senhas).
  - `Algorithm Lab` com 5 algoritmos: Problema da Mochila 0/1, QuickSort, Busca Binária, Busca Linear e Pilha (LIFO) & Fila (FIFO).
  - `Telemetry Monitor` (gráfico SVG em tempo real com indicação explícita de dados simulados).
  - `Code Playground` (exemplos em Java/Spring Boot, C11 e Kotlin/Compose).
- **SEO, Acessibilidade e Deploy Automatizado:**
  - Focus trap por teclado (`Tab` / `Shift+Tab` / `Esc`) e bloqueio de scroll no modal de projetos.
  - `robots.txt`, `sitemap.xml`, `<link rel="canonical">`, metadados Open Graph e dados estruturados JSON-LD (`Person`).
  - Workflow `.github/workflows/deploy.yml` pronto para publicação automática no GitHub Pages.

## 2. Como Executar Localmente

```bash
unzip -o portfolio-victor-eduardo-v3.zip
cd portfolio
python3 -m http.server 8000
```

Em seguida, acesse `http://localhost:8000` no navegador.
