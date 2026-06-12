import { describe, it, expect } from 'vitest';
import { fillEditorTheme } from '../codemirrorLayout.js';

describe('codemirrorLayout.js', () => {
  describe('fillEditorTheme', () => {
    it('exports a CodeMirror theme extension', () => {
      expect(fillEditorTheme).toBeTruthy();
      expect(typeof fillEditorTheme).toBe('object');
    });
  });
});
