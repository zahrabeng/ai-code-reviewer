import { describe, it, expect } from 'vitest';
import { ALLOWED_LANGUAGES } from '@Utils/languages.js';
import { getCodeMirrorLanguage } from '../codemirrorLanguages.js';

describe('codemirrorLanguages.js', () => {
  describe('getCodeMirrorLanguage', () => {
    it('returns an extension for every supported language', () => {
      for (const language of ALLOWED_LANGUAGES) {
        expect(getCodeMirrorLanguage(language)).toBeTruthy();
      }
    });

    it('falls back to javascript for unknown languages', () => {
      expect(getCodeMirrorLanguage('unknown-language')).toBeTruthy();
    });
  });
});
