import { motion } from 'framer-motion';
import { Play, Trash2, Loader2 } from 'lucide-react';
import { LANGUAGES, CODE_MAX_LENGTH } from '@Utils/languages.js';

const CodeInput = ({
  code,
  language,
  isStreaming,
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

  return (
    <div className="flex flex-col h-full min-h-[50vh] lg:min-h-0">
      <div
        className="flex items-center justify-between px-4 py-3
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

      <div className="flex-1 relative">
        <label htmlFor="code-textarea" className="sr-only">
          {selectedLabel} code input
        </label>
        <textarea
          id="code-textarea"
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          disabled={isStreaming}
          spellCheck={false}
          maxLength={CODE_MAX_LENGTH}
          placeholder={`Paste your ${selectedLabel} here…`}
          aria-label={`${selectedLabel} code input`}
          aria-describedby="char-count"
          className="absolute inset-0 w-full h-full
                     bg-white dark:bg-gray-950
                     text-gray-800 dark:text-gray-200
                     text-sm font-mono resize-none p-4 leading-relaxed
                     placeholder:text-gray-400 dark:placeholder:text-gray-700
                     focus:outline-none scrollbar-thin
                     disabled:opacity-60 disabled:cursor-not-allowed
                     transition-colors"
        />
        <div
          id="char-count"
          aria-live="polite"
          aria-atomic="true"
          className={`absolute bottom-3 right-3 text-xs pointer-events-none select-none transition-colors ${
            isAtLimit
              ? 'text-red-500 dark:text-red-400 font-medium'
              : isNearLimit
              ? 'text-yellow-600 dark:text-yellow-400'
              : 'text-gray-400 dark:text-gray-700'
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
