const SECTION_HEADERS = [
  { key: 'bugs', label: '🐛 Bugs & Issues', pattern: /##\s*🐛\s*Bugs\s*&\s*Issues/i },
  { key: 'improvements', label: '✅ Improvements', pattern: /##\s*✅\s*Improvements/i },
  { key: 'explanation', label: '💡 Explanation', pattern: /##\s*💡\s*Explanation/i },
  { key: 'score', label: '⭐ Overall Score /10', pattern: /##\s*⭐\s*Overall\s*Score/i },
];

export const EMPTY_SECTIONS = {
  bugs: '',
  improvements: '',
  explanation: '',
  score: '',
};

export const SECTION_ORDER = ['bugs', 'improvements', 'explanation', 'score'];

export const getActiveSectionKey = (sections, isStreaming) => {
  if (!isStreaming) return null;

  let active = null;
  for (const key of SECTION_ORDER) {
    if (sections[key]?.trim()) active = key;
  }
  return active;
};

export const parseReviewSections = (rawText) => {
  const sections = { ...EMPTY_SECTIONS };
  const keys = SECTION_HEADERS.map((h) => h.key);

  let currentKey = null;
  const lines = rawText.split('\n');

  for (const line of lines) {
    let matched = false;
    for (const header of SECTION_HEADERS) {
      if (header.pattern.test(line)) {
        currentKey = header.key;
        matched = true;
        break;
      }
    }
    if (!matched && currentKey) {
      sections[currentKey] += line + '\n';
    }
  }

  for (const key of keys) {
    sections[key] = sections[key].trim();
  }

  return sections;
};

const API_BASE_URL = import.meta.env.VITE_API_URL || '';
export const streamReview = async (code, language, onSectionsUpdate) => {
  const response = await fetch(`${API_BASE_URL}/api/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, language }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || `Server error: ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let accumulated = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop();

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data:')) continue;

      const payload = trimmed.slice(5).trim();
      if (payload === '[DONE]') return;

      try {
        const parsed = JSON.parse(payload);
        if (parsed.error) throw new Error(parsed.error);
        if (parsed.chunk) {
          accumulated += parsed.chunk;
          onSectionsUpdate(parseReviewSections(accumulated));
        }
      } catch (parseErr) {
        if (!(parseErr instanceof SyntaxError)) throw parseErr;
      }
    }
  }
};
