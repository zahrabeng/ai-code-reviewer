import { describe, it, expect } from 'vitest';
import { EditorState } from '@codemirror/state';
import { maxLengthExtension } from '../codemirrorMaxLength.js';

describe('codemirrorMaxLength.js', () => {
  describe('maxLengthExtension', () => {
    it('allows changes within the max length', () => {
      const state = EditorState.create({
        doc: 'abc',
        extensions: [maxLengthExtension(5)],
      });

      const tr = state.update({ changes: { from: 3, insert: 'de' } });
      expect(tr.changes.length).toBeGreaterThan(0);
    });

    it('blocks changes that exceed the max length', () => {
      const state = EditorState.create({
        doc: 'abcde',
        extensions: [maxLengthExtension(5)],
      });

      const tr = state.update({ changes: { from: 5, insert: 'f' } });
      expect(tr.changes.empty).toBe(true);
    });
  });
});
