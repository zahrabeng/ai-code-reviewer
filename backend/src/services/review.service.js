import Anthropic from '@anthropic-ai/sdk';
import { env } from '../../config/env.js';
import { SYSTEM_PROMPT } from '../prompts/systemPrompt.js';

const client = new Anthropic({ apiKey: env.anthropicApiKey });

export const streamCodeReview = async function* (code, language) {
  const stream = client.messages.stream({
    model: env.model,
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
      yield event.delta.text;
    }
  }
};
