import 'dotenv/config';

const required = ['ANTHROPIC_API_KEY'];

export const validateEnv = () => {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error(`[startup] Missing required env vars: ${missing.join(', ')}`);
    process.exit(1);
  }
};

export const env = {
  port: parseInt(process.env.PORT ?? '3001', 10),
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  allowedOrigin: process.env.ALLOWED_ORIGIN ?? 'http://localhost:5173',
  model: process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-4-6',
};
