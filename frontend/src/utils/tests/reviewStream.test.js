import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  EMPTY_SECTIONS,
  SECTION_ORDER,
  getActiveSectionKey,
  parseReviewSections,
  streamReview,
} from '../reviewStream.js';

describe('reviewStream.js', () => {
  describe('EMPTY_SECTIONS', () => {
    it('initializes all section keys to empty strings', () => {
      expect(EMPTY_SECTIONS).toEqual({
        bugs: '',
        improvements: '',
        explanation: '',
        score: '',
      });
    });
  });

  describe('SECTION_ORDER', () => {
    it('lists sections in display order', () => {
      expect(SECTION_ORDER).toEqual(['bugs', 'improvements', 'explanation', 'score']);
    });
  });

  describe('getActiveSectionKey', () => {
    it('returns null when not streaming', () => {
      expect(getActiveSectionKey({ bugs: 'issue' }, false)).toBeNull();
    });

    it('returns the last non-empty section while streaming', () => {
      const sections = { bugs: 'a', improvements: 'b', explanation: '', score: '' };
      expect(getActiveSectionKey(sections, true)).toBe('improvements');
    });

    it('returns null while streaming if all sections are empty', () => {
      expect(getActiveSectionKey(EMPTY_SECTIONS, true)).toBeNull();
    });
  });

  describe('parseReviewSections', () => {
    it('parses markdown into the four review sections', () => {
      const raw = [
        '## 🐛 Bugs & Issues',
        '- Missing null check',
        '## ✅ Improvements',
        '- Add tests',
        '## 💡 Explanation',
        'The code works but can be safer.',
        '## ⭐ Overall Score /10',
        '7/10 — solid start.',
      ].join('\n');

      expect(parseReviewSections(raw)).toEqual({
        bugs: '- Missing null check',
        improvements: '- Add tests',
        explanation: 'The code works but can be safer.',
        score: '7/10 — solid start.',
      });
    });

    it('returns empty sections when headers are missing', () => {
      expect(parseReviewSections('no headers here')).toEqual(EMPTY_SECTIONS);
    });
  });

  describe('streamReview', () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it('throws when the HTTP response is not ok', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          status: 400,
          json: async () => ({ error: 'Bad request' }),
        })
      );

      await expect(streamReview('code', 'javascript', vi.fn())).rejects.toThrow('Bad request');
    });

    it('streams chunks and calls onSectionsUpdate', async () => {
      const encoder = new TextEncoder();
      const body = [
        'data: {"chunk":"## 🐛 Bugs & Issues\\n- bug\\n"}\n\n',
        'data: [DONE]\n\n',
      ].join('');

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          body: {
            getReader: () => {
              let sent = false;
              return {
                read: async () => {
                  if (sent) return { done: true, value: undefined };
                  sent = true;
                  return { done: false, value: encoder.encode(body) };
                },
              };
            },
          },
        })
      );

      const onSectionsUpdate = vi.fn();
      await streamReview('code', 'javascript', onSectionsUpdate);

      expect(onSectionsUpdate).toHaveBeenCalled();
      expect(onSectionsUpdate.mock.calls.at(-1)[0].bugs).toContain('bug');
    });

    it('throws when the SSE payload contains an error', async () => {
      const encoder = new TextEncoder();
      const body = 'data: {"error":"The API key is disabled."}\n\n';

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          body: {
            getReader: () => {
              let sent = false;
              return {
                read: async () => {
                  if (sent) return { done: true, value: undefined };
                  sent = true;
                  return { done: false, value: encoder.encode(body) };
                },
              };
            },
          },
        })
      );

      await expect(streamReview('code', 'javascript', vi.fn())).rejects.toThrow(
        'The API key is disabled.'
      );
    });
  });
});
