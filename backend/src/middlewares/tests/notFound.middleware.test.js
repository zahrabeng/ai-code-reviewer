import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { notFoundHandler } from '../notFound.middleware.js';

describe('notFound.middleware.js', () => {
  describe('notFoundHandler', () => {
    it('responds with 404 and JSON error', () => {
      const res = {
        statusCode: null,
        body: null,
        status(code) {
          this.statusCode = code;
          return this;
        },
        json(payload) {
          this.body = payload;
          return this;
        },
      };

      notFoundHandler({}, res);

      assert.equal(res.statusCode, 404);
      assert.deepEqual(res.body, { error: 'Not found.' });
    });
  });
});
