import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { SYSTEM_PROMPT } from '../systemPrompt.js';

describe('systemPrompt.js', () => {
  describe('SYSTEM_PROMPT', () => {
    it('is a non-empty string', () => {
      assert.equal(typeof SYSTEM_PROMPT, 'string');
      assert.ok(SYSTEM_PROMPT.length > 0);
    });

    it('requires the four review section headers in order', () => {
      const bugsIndex = SYSTEM_PROMPT.indexOf('## 🐛 Bugs & Issues');
      const improvementsIndex = SYSTEM_PROMPT.indexOf('## ✅ Improvements');
      const explanationIndex = SYSTEM_PROMPT.indexOf('## 💡 Explanation');
      const scoreIndex = SYSTEM_PROMPT.indexOf('## ⭐ Overall Score /10');

      assert.ok(bugsIndex >= 0);
      assert.ok(improvementsIndex > bugsIndex);
      assert.ok(explanationIndex > improvementsIndex);
      assert.ok(scoreIndex > explanationIndex);
    });

    it('instructs the model to use bullet points and a numeric score', () => {
      assert.match(SYSTEM_PROMPT, /bullet points/i);
      assert.match(SYSTEM_PROMPT, /numeric score/i);
    });
  });
});
