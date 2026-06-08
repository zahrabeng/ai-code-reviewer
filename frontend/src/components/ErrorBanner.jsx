import { motion } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

const shakeVariants = {
  initial: { opacity: 0, y: -8 },
  animate: {
    opacity: 1,
    y: 0,
    x: [0, -6, 6, -4, 4, -2, 2, 0],
    transition: {
      opacity: { duration: 0.25 },
      y: { duration: 0.25 },
      x: { duration: 0.5, delay: 0.1 },
    },
  },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

const ErrorBanner = ({ message, onDismiss }) => {
  return (
    <motion.div
      variants={shakeVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      role="alert"
      aria-live="assertive"
      className="flex items-center gap-3 px-4 py-3 rounded-xl
                 bg-red-50 dark:bg-red-950/60
                 border border-red-200 dark:border-red-800/70
                 text-red-600 dark:text-red-300"
    >
      <AlertTriangle size={16} className="shrink-0 text-red-500 dark:text-red-400" aria-hidden="true" />
      <p className="text-sm flex-1 leading-snug">{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex items-center justify-center
                     text-red-400 dark:text-red-500
                     hover:text-red-600 dark:hover:text-red-300
                     transition-colors shrink-0"
          aria-label="Dismiss error"
        >
          <X size={16} />
        </button>
      )}
    </motion.div>
  );
};

export default ErrorBanner;
