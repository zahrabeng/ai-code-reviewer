import { describe, it, mock, afterEach } from 'node:test';
import assert from 'node:assert/strict';

describe('review.controller.js', () => {
  afterEach(() => mock.restoreAll());

  const createResponse = () => {
    const res = {
      statusCode: 200,
      headers: {},
      chunks: [],
      ended: false,
      setHeader(name, value) {
        this.headers[name] = value;
      },
      flushHeaders() {},
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        this.body = payload;
        return this;
      },
      write(chunk) {
        this.chunks.push(chunk);
      },
      end() {
        this.ended = true;
      },
      get writableEnded() {
        return this.ended;
      },
    };
    return res;
  };

  it('reviewCode returns 400 when validation fails', async () => {
    const { reviewCode } = await import('../review.controller.js');
    const req = { body: { code: '', language: 'javascript' } };
    const res = createResponse();

    await reviewCode(req, res);

    assert.equal(res.statusCode, 400);
    assert.ok(res.body.error);
  });

  it('reviewCode streams SSE chunks on success', async () => {
    mock.module('../../services/review.service.js', {
      namedExports: {
        streamCodeReview: async function* () {
          yield 'chunk-one';
          yield 'chunk-two';
        },
      },
    });

    const { reviewCode } = await import(`../review.controller.js?ok=${Date.now()}`);
    const req = { body: { code: 'console.log(1)', language: 'javascript' } };
    const res = createResponse();

    await reviewCode(req, res);

    assert.equal(res.headers['Content-Type'], 'text/event-stream');
    assert.ok(res.chunks.some((c) => c.includes('"chunk-one"')));
    assert.ok(res.chunks.some((c) => c.includes('"chunk-two"')));
    assert.ok(res.chunks.some((c) => c.includes('[DONE]')));
    assert.equal(res.ended, true);
  });

  it('reviewCode streams SSE error when the service throws', async () => {
    mock.module('../../services/review.service.js', {
      namedExports: {
        streamCodeReview: async function* () {
          throw { status: 401, error: { error: { message: 'disabled', type: 'authentication_error' } } };
        },
      },
    });

    const { reviewCode } = await import(`../review.controller.js?err=${Date.now()}`);
    const req = { body: { code: 'console.log(1)', language: 'javascript' } };
    const res = createResponse();

    await reviewCode(req, res);

    assert.ok(
      res.chunks.some((c) =>
        c.includes('The API key is disabled. Code reviews are unavailable at this time.')
      )
    );
    assert.equal(res.ended, true);
  });
});
