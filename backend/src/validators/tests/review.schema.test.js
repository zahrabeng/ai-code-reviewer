import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { reviewSchema } from '../review.schema.js';
import { CODE_MAX_LENGTH } from '../../../../Utils/languages.js';

describe('review.schema.js', () => {
  describe('reviewSchema', () => {
    it('accepts valid code and language', () => {
      const result = reviewSchema.safeParse({ code: 'console.log("hi")', language: 'javascript' });
      assert.equal(result.success, true);
      assert.deepEqual(result.data, { code: 'console.log("hi")', language: 'javascript' });
    });

    it('rejects empty code', () => {
      const result = reviewSchema.safeParse({ code: '', language: 'javascript' });
      assert.equal(result.success, false);
      assert.match(result.error.issues[0].message, /required/i);
    });

    it('rejects code over the character limit', () => {
      const result = reviewSchema.safeParse({
        code: 'x'.repeat(CODE_MAX_LENGTH + 1),
        language: 'python',
      });
      assert.equal(result.success, false);
      assert.match(result.error.issues[0].message, /5,000-character limit/);
    });

    it('rejects unsupported language', () => {
      const result = reviewSchema.safeParse({ code: 'print("hi")', language: 'cobol' });
      assert.equal(result.success, false);
      assert.match(result.error.issues[0].message, /Unsupported language/);
    });
  });
});
