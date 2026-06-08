import { motion } from 'framer-motion';
import { Code2, Sun, Moon } from 'lucide-react';
import CodeInput from './components/CodeInput.jsx';
import ReviewOutput from './components/ReviewOutput.jsx';
import { useCodeReview } from './hooks/useCodeReview.js';
import { useTheme } from './hooks/useTheme.js';

const App = () => {
  const {
    code,
    setCode,
    language,
    setLanguage,
    sections,
    isStreaming,
    error,
    hasStarted,
    handleReview,
    handleClear,
    dismissError,
  } = useCodeReview();

  const { theme, toggleTheme } = useTheme();

  return (
    <div className="h-screen bg-white dark:bg-gray-950 flex flex-col overflow-hidden transition-colors duration-200">
      <header className="shrink-0 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
          <Code2 size={18} className="text-white" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-base font-semibold text-gray-900 dark:text-white leading-none">
            AI Code Reviewer
          </h1>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Powered by Claude</p>
        </div>

        <motion.button
          onClick={toggleTheme}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="ml-auto flex items-center justify-center w-8 h-8 rounded-lg
                     text-gray-500 dark:text-gray-400
                     hover:text-gray-700 dark:hover:text-gray-200
                     bg-gray-100 dark:bg-gray-800
                     hover:bg-gray-200 dark:hover:bg-gray-700
                     border border-gray-200 dark:border-gray-700
                     transition-colors"
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </motion.button>
      </header>

      <main className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden">
        <motion.div
          className="flex-1 min-h-0 lg:w-1/2 border-r border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <CodeInput
            code={code}
            language={language}
            isStreaming={isStreaming}
            theme={theme}
            onCodeChange={setCode}
            onLanguageChange={setLanguage}
            onReview={handleReview}
            onClear={handleClear}
          />
        </motion.div>

        <motion.div
          className="flex-1 min-h-0 lg:w-1/2 flex flex-col overflow-hidden"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
        >
          <ReviewOutput
            sections={sections}
            isStreaming={isStreaming}
            error={error}
            hasStarted={hasStarted}
            onDismissError={dismissError}
          />
        </motion.div>
      </main>
    </div>
  );
};

export default App;
