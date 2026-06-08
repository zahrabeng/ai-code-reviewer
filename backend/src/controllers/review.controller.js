import { reviewSchema } from '../validators/review.schema.js';
import { streamCodeReview } from '../services/review.service.js';
import { getReviewErrorMessage } from '../utils/sseErrors.js';

const setSseHeaders = (res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();
};

export const reviewCode = async (req, res) => {
  const parsed = reviewSchema.safeParse(req.body);
  if (!parsed.success) {
    const messages = parsed.error.issues.map((i) => i.message).join(' ');
    return res.status(400).json({ error: messages });
  }

  const { code, language } = parsed.data;
  setSseHeaders(res);

  try {
    for await (const chunk of streamCodeReview(code, language)) {
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    console.error('[/api/review]', err);

    if (!res.writableEnded) {
      const message = getReviewErrorMessage(err);
      res.write(`data: ${JSON.stringify({ error: message })}\n\n`);
      res.end();
    }
  }
};
