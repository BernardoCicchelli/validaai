# ValidAI

> Validate your idea before you build it.

ValidAI é um motor de diagnóstico estratégico que avalia ideias de produto **antes da execução**. Em vez de elogios genéricos, ele entrega uma análise crítica e estruturada — apontando riscos, pontos cegos e fraquezas de posicionamento — usando frameworks de _problem-market fit_ e análise de risco.

Cole a descrição da sua ideia, e o ValidAI retorna um dashboard com uma nota de viabilidade e o detalhamento por dimensão.

---

## ✨ Funcionalidades

- **Nota de viabilidade (0–100)** — score geral crítico, sem otimismo gratuito.
- **Análise por dimensão**, cada uma com nota e justificativa:
  - Clareza do problema (_problem clarity_)
  - Definição do ICP (_ideal customer profile_)
  - Saturação de mercado
  - Diferenciação
- **Riscos estratégicos** — 2 a 4 riscos principais identificados.
- **Pontos cegos** — o que o fundador provavelmente está ignorando ou assumindo.
- **Nível de confiança** da avaliação (low / medium / high).
- **Multilíngue** — a resposta é gerada no mesmo idioma da ideia enviada.
- Interface fluida com estados animados (idle → loading → resultado) via Framer Motion.

---

## 🧱 Stack

| Camada    | Tecnologia                                                                       |
| --------- | ------------------------------------------------------------------------------- |
| Framework | [Next.js 16](https://nextjs.org) (App Router)                                    |
| UI        | React 19, Tailwind CSS 4, Framer Motion                                          |
| Ícones    | lucide-react                                                                     |
| IA        | [Google Gemini](https://ai.google.dev) (`gemini-2.5-flash`) via `@google/genai` |
| Linguagem | TypeScript                                                                       |

A análise usa **structured output** do Gemini (`responseSchema`) para garantir que a resposta sempre siga o contrato JSON definido em [src/types/api.ts](src/types/api.ts).

---

## 🚀 Começando

### Pré-requisitos

- Node.js 18+
- Uma API key do Google Gemini ([Google AI Studio](https://aistudio.google.com/app/apikey))

### Instalação

```bash
git clone <repo-url>
cd validaai
npm install
```

### Variáveis de ambiente

Crie um arquivo `.env.local` na raiz:

```bash
GEMINI_API_KEY=sua_chave_aqui
```

> O SDK `@google/genai` lê a `GEMINI_API_KEY` automaticamente do ambiente.

### Rodando em desenvolvimento

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

---

## 📜 Scripts

| Comando         | Descrição                            |
| --------------- | ------------------------------------ |
| `npm run dev`   | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera o build de produção             |
| `npm run start` | Sobe o servidor de produção          |
| `npm run lint`  | Roda o ESLint                        |

---

## 🗂️ Estrutura do projeto

```
src/
├── app/
│   ├── api/analyze/route.ts   # Endpoint POST que chama o Gemini
│   ├── layout.tsx             # Layout raiz + metadata
│   ├── page.tsx               # UI principal (estados idle/loading/error/success)
│   └── globals.css            # Estilos globais (Tailwind)
├── components/
│   └── ResultDashboard.tsx    # Dashboard de resultados da análise
├── lib/
│   └── utils.ts               # Utilitários (clsx / tailwind-merge)
└── types/
    └── api.ts                 # Contratos de request/response
```

---

## 🔌 API

### `POST /api/analyze`

Analisa uma ideia de produto.

**Request**

```json
{
  "idea": "Um app que conecta nutricionistas a pacientes via vídeo..."
}
```

**Response** (`200 OK`)

```json
{
  "score": 62,
  "problem_clarity":   { "score": 70, "reasoning": "..." },
  "icp_definition":    { "score": 55, "reasoning": "..." },
  "market_saturation": { "score": 40, "reasoning": "..." },
  "differentiation":   { "score": 50, "reasoning": "..." },
  "strategic_risks":   ["...", "..."],
  "blind_spots":       ["...", "..."],
  "confidence": "medium"
}
```

**Erros**

| Status | Quando                                   |
| ------ | ---------------------------------------- |
| `400`  | Campo `idea` ausente ou inválido         |
| `500`  | Falha na chamada ao Gemini ou no parsing |

O uso de tokens de cada chamada é logado no terminal do servidor.

---

## ☁️ Deploy

O caminho mais simples é a [Vercel](https://vercel.com/new). Lembre-se de configurar a variável de ambiente `GEMINI_API_KEY` no painel do projeto.
