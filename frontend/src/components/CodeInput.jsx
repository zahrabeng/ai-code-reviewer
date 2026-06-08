import { useMemo, useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Trash2, Loader2 } from 'lucide-react';
import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark, vscodeLight } from '@uiw/codemirror-theme-vscode';
import { LANGUAGES, CODE_MAX_LENGTH } from '@Utils/languages.js';
import { getCodeMirrorLanguage } from '../utils/codemirrorLanguages.js';
import { maxLengthExtension } from '../utils/codemirrorMaxLength.js';
import { fillEditorTheme } from '../utils/codemirrorLayout.js';

const CodeInput = ({
  code,
  language,
  isStreaming,
  theme,
  onCodeChange,
  onLanguageChange,
  onReview,
  onClear,
}) => {
  const hasCode = code.trim().length > 0;
  const canReview = hasCode && !isStreaming;
  const canClear = hasCode && !isStreaming;
  const charsRemaining = CODE_MAX_LENGTH - code.length;
  const isNearLimit = charsRemaining <= 200;
  const isAtLimit = charsRemaining <= 0;
  const selectedLabel = LANGUAGES.find((l) => l.value === language)?.label ?? 'code';

  const extensions = useMemo(
    () => [
      getCodeMirrorLanguage(language),
      maxLengthExtension(CODE_MAX_LENGTH),
      fillEditorTheme,
    ],
    [language]
  );
  const editorTheme = theme === 'dark' ? vscodeDark : vscodeLight;
  const containerRef = useRef(null);
  const [editorHeight, setEditorHeight] = useState(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateHeight = () => {
      requestAnimationFrame(() => {
        const height = el.getBoundingClientRect().height;
        if (height > 0) {
          setEditorHeight(Math.floor(height));
        }
      });
    };

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  const handleChange = (value) => {
    onCodeChange(value.slice(0, CODE_MAX_LENGTH));
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      <div
        className="flex items-center justify-between px-4 py-3 shrink-0
                   border-b border-gray-200 dark:border-gray-800"
        role="toolbar"
        aria-label="Code input controls"
      >
        <div className="flex items-center gap-2">
          <span
            id="code-panel-label"
            className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
          >
            Code
          </span>
          <span className="text-gray-300 dark:text-gray-700" aria-hidden="true">·</span>
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            disabled={isStreaming}
            aria-label="Select programming language"
            className="text-xs bg-gray-100 dark:bg-gray-900
                       border border-gray-300 dark:border-gray-700
                       text-gray-700 dark:text-gray-300
                       rounded-md px-2 py-1
                       focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500
                       disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-sans
                       transition-colors"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            onClick={onClear}
            disabled={!canClear}
            whileHover={canClear ? { scale: 1.04 } : {}}
            whileTap={canClear ? { scale: 0.96 } : {}}
            aria-label="Clear code input and review"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md
                       text-gray-500 dark:text-gray-400
                       hover:text-gray-700 dark:hover:text-gray-200
                       border border-gray-300 dark:border-gray-700
                       hover:border-gray-400 dark:hover:border-gray-600
                       bg-white dark:bg-gray-900
                       hover:bg-gray-50 dark:hover:bg-gray-800
                       disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Trash2 size={13} aria-hidden="true" />
            Clear
          </motion.button>

          <motion.button
            onClick={onReview}
            disabled={!canReview}
            whileHover={canReview ? { scale: 1.02 } : {}}
            whileTap={canReview ? { scale: 0.98 } : {}}
            aria-label={isStreaming ? 'Review in progress' : `Review ${selectedLabel} code`}
            aria-busy={isStreaming}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md
                       bg-indigo-600 hover:bg-indigo-500 text-white transition-colors
                       disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            {isStreaming ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  aria-hidden="true"
                >
                  <Loader2 size={13} />
                </motion.div>
                Reviewing…
              </>
            ) : (
              <>
                <Play size={13} aria-hidden="true" />
                Review Code
              </>
            )}
          </motion.button>
        </div>
      </div>

      <div ref={containerRef} className="flex-1 min-h-0 overflow-hidden relative">
        <div className="absolute inset-0 overflow-hidden">
          <CodeMirror
            value={code}
            height={editorHeight ? `${editorHeight}px` : '100%'}
            theme={editorTheme}
            extensions={extensions}
            onChange={handleChange}
            editable={!isStreaming}
            basicSetup={{
              lineNumbers: true,
              highlightActiveLine: true,
              highlightActiveLineGutter: true,
              foldGutter: false,
            }}
            className="code-editor h-full"
            aria-labelledby="code-panel-label"
            aria-describedby="char-count"
            placeholder={`Paste your ${selectedLabel} here…`}
          />
        </div>

        <div
          id="char-count"
          aria-live="polite"
          aria-atomic="true"
          className={`absolute bottom-3 right-5 z-10 text-xs pointer-events-none select-none transition-colors ${
            isAtLimit
              ? 'text-red-500 dark:text-red-400 font-medium'
              : isNearLimit
              ? 'text-yellow-600 dark:text-yellow-400'
              : 'text-gray-400 dark:text-gray-600'
          }`}
        >
          {hasCode
            ? isNearLimit
              ? `${charsRemaining.toLocaleString()} remaining`
              : `${code.length.toLocaleString()} / ${CODE_MAX_LENGTH.toLocaleString()}`
            : ''}
        </div>
      </div>
    </div>
  );
};

export default CodeInput;
