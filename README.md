# AI Code Reviewer

A real-time AI-powered code review tool. Paste any code snippet, pick a language, and receive a structured review from Claude covering bugs, improvements, an explanation, and an overall score — streamed live to the browser.

## Live Demo

Deployed app: [https://ai-code-reviewer-frontend-qjqm.onrender.com/](https://ai-code-reviewer-frontend-qjqm.onrender.com/)

Paste code, select a language, and click **Review Code** to see the four-panel streaming review in action.

## Stack


| Layer    | Technology                                               |
| -------- | -------------------------------------------------------- |
| Backend  | Node.js · Express · Anthropic SDK · SSE                  |
| Frontend | React · Vite · Tailwind CSS · Framer Motion · CodeMirror |
| AI Model | `claude-sonnet-4-6` (configurable via `ANTHROPIC_MODEL`) |


## Project Structure

```
ai-code-reviewer/
├── Utils/                  # Shared constants (languages, code length limit)
├── backend/
│   ├── config/             # Environment validation
│   └── src/
│       ├── controllers/
│       ├── middlewares/
│       ├── prompts/
│       ├── routes/
│       ├── services/
│       ├── utils/
│       └── validators/
└── frontend/
    ├── public/             # Static assets (favicon)
    └── src/
        ├── components/
        ├── hooks/
        └── utils/
```

## Architecture

```
CodeInput  →  POST /api/review (SSE)  →  review.controller
                                              ↓
                                        review.service  →  Anthropic API
                                              ↓
                                        SSE chunks  →  ReviewOutput (4 cards)
```

1. The user pastes code in `CodeInput` and selects a language.
2. The frontend sends a `POST` to `/api/review` and opens an SSE stream.
3. `review.controller` validates input, then delegates to `review.service`.
4. `review.service` streams Claude's response chunk-by-chunk back through SSE.
5. The frontend parses the four markdown sections and renders them as animated cards in `ReviewOutput`.

## Setup

### 1. API Key

Copy the backend environment template and add your Anthropic API key:

```bash
cp backend/.env.example backend/.env
# then edit backend/.env and set ANTHROPIC_API_KEY
```

### 2. Install dependencies

This is a monorepo with separate `package.json` files — install each app independently:

```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 3. Run

```bash
# Terminal 1 — backend (port 3001)
cd backend && npm run dev

# Terminal 2 — frontend (port 5173)
cd frontend && npm run dev
```

## Security

- **Helmet** — secure HTTP response headers
- **CORS** — restricted to the configured frontend origin (`ALLOWED_ORIGIN` env var)
- **Rate limiting** — 20 requests / IP / 15 min on `/api/review`
- **Body size cap** — requests over 50 KB are rejected before reaching the AI
- **Input validation** — language must be in an allow-list; code is capped at 5,000 characters (Zod schema)
- **Sanitised errors** — stack traces and raw SDK errors are never forwarded to the client
- **API key guard** — server refuses to start if `ANTHROPIC_API_KEY` is missing

