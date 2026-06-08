# AI Code Reviewer

A real-time AI-powered code review tool. Paste any code snippet, pick a language, and receive a structured review from Claude covering bugs, improvements, an explanation, and an overall score — streamed live to the browser.

## Stack

| Layer    | Technology |
|----------|-----------|
| Backend  | Node.js · Express · Anthropic SDK · SSE |
| Frontend | React · Vite · Tailwind CSS · Framer Motion |
| AI Model | `claude-sonnet-4-6` |

## Project Structure

```
ai-code-reviewer/
├── backend/          # Express API server
│   ├── src/index.js
│   ├── .env.example
│   └── package.json
└── frontend/         # React SPA
    ├── src/
    │   ├── App.jsx
    │   └── components/
    │       ├── CodeInput.jsx
    │       ├── ReviewOutput.jsx
    │       ├── ReviewCard.jsx
    │       └── ErrorBanner.jsx
    └── package.json
```

## Setup

### 1. API Key

Copy the backend environment template and add your Anthropic API key:

```bash
cp backend/.env.example backend/.env
# then edit backend/.env and set ANTHROPIC_API_KEY
```

### 2. Install dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 3. Run (two terminals)

```bash
# Terminal 1 — backend (port 3001)
cd backend && npm run dev

# Terminal 2 — frontend (port 5173)
cd frontend && npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Security

- **Helmet** — secure HTTP response headers
- **CORS** — restricted to the configured frontend origin (`ALLOWED_ORIGIN` env var)
- **Rate limiting** — 20 requests / IP / 15 min on `/api/review`
- **Body size cap** — requests over 50 KB are rejected before reaching the AI
- **Input validation** — language must be in an allow-list; code is capped at 20 000 characters (Zod schema)
- **Sanitised errors** — stack traces and raw SDK errors are never forwarded to the client
- **API key guard** — server refuses to start if `ANTHROPIC_API_KEY` is missing
