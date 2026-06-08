import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { SYSTEM_PROMPT } from './prompts/systemPrompt.js';
import { ALLOWED_LANGUAGES, CODE_MAX_LENGTH } from '../../Utils/languages.js';

// ── Startup guard ────────────────────────────────────────────────────────────
if (!process.env.ANTHROPIC_API_KEY) {
  console.error('[startup] ANTHROPIC_API_KEY is not set. Exiting.');
  process.exit(1);
}

const PORT = parseInt(process.env.PORT ?? '3001', 10);
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── Input validation schema ──────────────────────────────────────────────────
const reviewSchema = z.object({
  code: z
    .string()
    .min(1, 'Code is required.')
    .max(CODE_MAX_LENGTH, `Code exceeds the ${CODE_MAX_LENGTH.toLocaleString()}-character limit.`),
  language: z.enum(ALLOWED_LANGUAGES, {
    errorMap: () => ({ message: 'Unsupported language.' }),
  }),
});

// ── Express app ──────────────────────────────────────────────────────────────
const app = express();

// 1. Secure HTTP headers
app.use(helmet());

// 2. CORS — restricted to the configured frontend origin
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN ?? 'http://localhost:5173',
    methods: ['POST'],
    allowedHeaders: ['Content-Type'],
  })
);

// 3. Body size cap — prevents oversized payloads reaching Anthropic
app.use(express.json({ limit: '50kb' }));

// 4. Rate limit — 20 review requests per IP per 15 minutes
const reviewLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please wait before trying again.' },
});

// ── POST /api/review ─────────────────────────────────────────────────────────
app.post('/api/review', reviewLimiter, async (req, res) => {
  // Input validation
  const parsed = reviewSchema.safeParse(req.body);
  if (!parsed.success) {
    const messages = parsed.error.issues.map((i) => i.message).join(' ');
    return res.status(400).json({ error: messages });
  }

  const { code, language } = parsed.data;

  // SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  try {
    const stream = client.messages.stream({
      model: 'claude-haiku-4-5',
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Please review the following ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\``,
        },
      ],
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
        res.write(`data: ${JSON.stringify({ chunk: event.delta.text })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    // Full error logged server-side only
    console.error('[/api/review]', err);

    const status = err?.status ?? 500;
    let message = 'An error occurred while processing your request.';
    if (status === 401) message = 'Invalid API key. Please check your configuration.';
    else if (status === 404) message = 'AI model not found. Please check the model name in your configuration.';
    else if (status === 429) message = 'Claude API rate limit reached. Try again in a moment.';
    else if (status === 400) message = 'The request was rejected by the AI service.';

    // Only write error if headers not yet fully flushed into a stream
    if (!res.writableEnded) {
      res.write(`data: ${JSON.stringify({ error: message })}\n\n`);
      res.end();
    }
  }
});

// ── 404 catch-all ────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found.' });
});

// ── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[server] Listening on http://localhost:${PORT}`);
});
