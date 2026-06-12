import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { LANGUAGES, ALLOWED_LANGUAGES, CODE_MAX_LENGTH } from '../languages.js';

describe('languages.js', () => {
  it('exports 16 languages with value and label', () => {
    assert.equal(LANGUAGES.length, 16);
    for (const lang of LANGUAGES) {
      assert.ok(lang.value);
      assert.ok(lang.label);
    }
  });

  it('ALLOWED_LANGUAGES contains all language values', () => {
    assert.deepEqual(
      ALLOWED_LANGUAGES,
      LANGUAGES.map(({ value }) => value)
    );
  });

  it('CODE_MAX_LENGTH is 5000', () => {
    assert.equal(CODE_MAX_LENGTH, 5000);
  });
});
