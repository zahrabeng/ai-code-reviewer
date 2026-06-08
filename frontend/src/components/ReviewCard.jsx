import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const CARD_COLORS = {
  bugs: {
    border: 'border-red-200 dark:border-red-900/50',
    bg:     'bg-red-50/60 dark:bg-gray-900/60',
    dot:    'bg-red-400 dark:bg-red-500',
  },
  improvements: {
    border: 'border-green-200 dark:border-green-900/50',
    bg:     'bg-green-50/60 dark:bg-gray-900/60',
    dot:    'bg-green-500',
  },
  explanation: {
    border: 'border-blue-200 dark:border-blue-900/50',
    bg:     'bg-blue-50/60 dark:bg-gray-900/60',
    dot:    'bg-blue-400 dark:bg-blue-500',
  },
  score: {
    border: 'border-yellow-200 dark:border-yellow-900/50',
    bg:     'bg-yellow-50/60 dark:bg-gray-900/60',
    dot:    'bg-yellow-400',
  },
};

const ReviewCard = ({ sectionKey, title, content, isStreaming }) => {
  const [copied, setCopied] = useState(false);
  const colors = CARD_COLORS[sectionKey] ?? CARD_COLORS.bugs;
  const hasContent = content && content.trim().length > 0;

  const handleCopy = async () => {
    if (!hasContent) return;
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard access denied — silent fail
    }
  };

  return (
    <motion.div
      layout
      role="region"
      aria-label={title}
      className={`rounded-xl border ${colors.border} ${colors.bg} overflow-hidden transition-colors duration-200`}
    >
      <div className="flex items-center justify-between px-4 py-3
                      border-b border-gray-200/80 dark:border-gray-800/60">
        <div className="flex items-center gap-2">
          <div
            className={`w-1.5 h-1.5 rounded-full ${colors.dot} ${isStreaming && hasContent ? 'animate-pulse' : ''}`}
            aria-hidden="true"
          />
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{title}</span>
        </div>
        <motion.button
          onClick={handleCopy}
          disabled={!hasContent}
          whileHover={hasContent ? { scale: 1.08 } : {}}
          whileTap={hasContent ? { scale: 0.92 } : {}}
          aria-label={copied ? `${title} copied to clipboard` : `Copy ${title} to clipboard`}
          className="flex items-center gap-1 text-xs px-2 py-1 rounded-md
                     text-gray-400 dark:text-gray-500
                     hover:text-gray-700 dark:hover:text-gray-300
                     hover:bg-gray-200/60 dark:hover:bg-gray-800
                     disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          {copied ? (
            <>
              <Check size={12} className="text-green-500" aria-hidden="true" />
              <span className="text-green-500">Copied</span>
            </>
          ) : (
            <>
              <Copy size={12} aria-hidden="true" />
              Copy
            </>
          )}
        </motion.button>
      </div>

      <motion.div layout className="px-4 py-3 min-h-[60px]">
        {hasContent ? (
          <div className="prose prose-sm dark:prose-invert max-w-none
                          prose-p:text-gray-700 dark:prose-p:text-gray-300
                          prose-p:leading-relaxed
                          prose-li:text-gray-700 dark:prose-li:text-gray-300
                          prose-li:leading-relaxed
                          prose-strong:text-gray-900 dark:prose-strong:text-gray-100
                          prose-strong:font-semibold
                          prose-code:text-indigo-600 dark:prose-code:text-indigo-300
                          prose-code:bg-gray-100 dark:prose-code:bg-gray-800
                          prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs
                          prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800
                          prose-pre:border prose-pre:border-gray-200 dark:prose-pre:border-gray-700
                          prose-headings:text-gray-900 dark:prose-headings:text-gray-100">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : (
          <div className="flex flex-col gap-2 py-2">
            {[80, 60, 90].map((w, i) => (
              <motion.div
                key={i}
                className="h-2.5 rounded bg-gray-200 dark:bg-gray-800"
                style={{ width: `${w}%` }}
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ReviewCard;
