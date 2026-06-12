import { describe, it, mock, before, afterEach } from 'node:test';
import assert from 'node:assert/strict';

describe('review.service.js', () => {
  afterEach(() => mock.restoreAll());

  before(() => {
    process.env.ANTHROPIC_API_KEY = 'test-key';
  });

  it('streamCodeReview yields text deltas from the Anthropic stream', async () => {
    mock.module('@anthropic-ai/sdk', {
      defaultExport: class Anthropic {
        messages = {
          stream: async function* () {
            yield { type: 'content_block_delta', delta: { type: 'text_delta', text: 'Hello ' } };
            yield { type: 'content_block_delta', delta: { type: 'text_delta', text: 'world' } };
            yield { type: 'message_stop' };
          },
        };
      },
    });

    const { streamCodeReview } = await import(`../review.service.js?mock=${Date.now()}`);

    const chunks = [];
    for await (const chunk of streamCodeReview('console.log(1)', 'javascript')) {
      chunks.push(chunk);
    }

    assert.deepEqual(chunks, ['Hello ', 'world']);
  });

  it('streamCodeReview passes code and language in the user message', async () => {
    let capturedMessages;

    mock.module('@anthropic-ai/sdk', {
      defaultExport: class Anthropic {
        messages = {
          stream: (options) => {
            capturedMessages = options.messages;
            return (async function* () {})();
          },
        };
      },
    });

    const { streamCodeReview } = await import(`../review.service.js?capture=${Date.now()}`);

    // eslint-disable-next-line no-unused-vars
    for await (const _chunk of streamCodeReview('const x = 1', 'typescript')) {
      // drain generator
    }

    assert.ok(capturedMessages[0].content.includes('typescript'));
    assert.ok(capturedMessages[0].content.includes('const x = 1'));
  });
});
