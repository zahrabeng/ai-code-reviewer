import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import ReviewCard from './ReviewCard.jsx';
import ErrorBanner from './ErrorBanner.jsx';

const SECTIONS = [
  { key: 'bugs',         title: '🐛 Bugs & Issues' },
  { key: 'improvements', title: '✅ Improvements' },
  { key: 'explanation',  title: '💡 Explanation' },
  { key: 'score',        title: '⭐ Overall Score /10' },
];

const cardVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

const EmptyState = () => {
  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center h-full text-center px-8 py-20"
    >
      <div className="w-16 h-16 rounded-2xl
                      bg-gray-100 dark:bg-gray-900
                      border border-gray-200 dark:border-gray-800
                      flex items-center justify-center mb-5">
        <Sparkles size={30} className="text-gray-400 dark:text-gray-600" aria-hidden="true" />
      </div>
      <p className="text-gray-500 dark:text-gray-500 text-sm font-medium">
        Your AI review will appear here
      </p>
      <p className="text-gray-400 dark:text-gray-700 text-xs mt-1.5 max-w-xs leading-relaxed">
        Paste your code in the left panel, select a language, and click{' '}
        <span className="text-indigo-500 dark:text-indigo-400">Review Code</span>.
      </p>
    </motion.div>
  );
};

const ReviewOutput = ({ sections, isStreaming, error, hasStarted, onDismissError }) => {
  const hasAnyContent = SECTIONS.some((s) => sections[s.key]?.trim().length > 0);
  const showCards = hasStarted && (hasAnyContent || isStreaming);

  return (
    <div className="flex flex-col h-full min-h-[50vh] lg:min-h-0">
      <div className="flex items-center gap-2 px-4 py-3
                      border-b border-gray-200 dark:border-gray-800">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Review
        </span>
        <AnimatePresence>
          {isStreaming && (
            <motion.span
              key="streaming-indicator"
              role="status"
              aria-live="polite"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1 text-xs text-indigo-500 dark:text-indigo-400"
            >
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 0.9, repeat: Infinity }}
                className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400"
                aria-hidden="true"
              />
              Streaming…
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin flex flex-col gap-4">
        <AnimatePresence>
          {error && (
            <ErrorBanner
              key="error-banner"
              message={error}
              onDismiss={onDismissError}
            />
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {!hasStarted ? (
            <EmptyState key="empty" />
          ) : showCards ? (
            <motion.div
              key="cards"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-4"
            >
              <AnimatePresence initial={false}>
                {SECTIONS.map((section, index) => {
                  const content = sections[section.key];
                  const shouldShow = isStreaming || (content && content.trim().length > 0);
                  return shouldShow ? (
                    <motion.div
                      key={section.key}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ delay: index * 0.06 }}
                    >
                      <ReviewCard
                        sectionKey={section.key}
                        title={section.title}
                        content={content}
                        isStreaming={isStreaming}
                      />
                    </motion.div>
                  ) : null;
                })}
              </AnimatePresence>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ReviewOutput;
