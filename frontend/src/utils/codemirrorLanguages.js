import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { rust } from '@codemirror/lang-rust';
import { php } from '@codemirror/lang-php';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { sql } from '@codemirror/lang-sql';
import { StreamLanguage } from '@codemirror/language';
import { go } from '@codemirror/legacy-modes/mode/go';
import { ruby } from '@codemirror/legacy-modes/mode/ruby';
import { shell } from '@codemirror/legacy-modes/mode/shell';
import { swift } from '@codemirror/legacy-modes/mode/swift';
import { kotlin } from '@codemirror/legacy-modes/mode/clike';

const LANGUAGE_EXTENSIONS = {
  javascript: () => javascript(),
  typescript: () => javascript({ typescript: true }),
  python: () => python(),
  go: () => StreamLanguage.define(go),
  rust: () => rust(),
  java: () => java(),
  cpp: () => cpp(),
  c: () => cpp(),
  ruby: () => StreamLanguage.define(ruby),
  php: () => php(),
  swift: () => StreamLanguage.define(swift),
  kotlin: () => StreamLanguage.define(kotlin),
  bash: () => StreamLanguage.define(shell),
  sql: () => sql(),
  html: () => html(),
  css: () => css(),
};

export const getCodeMirrorLanguage = (language) =>
  LANGUAGE_EXTENSIONS[language]?.() ?? javascript();
