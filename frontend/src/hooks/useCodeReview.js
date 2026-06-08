import { useState, useCallback } from 'react';
import { EMPTY_SECTIONS, streamReview } from '../utils/reviewStream.js';

export const useCodeReview = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [sections, setSections] = useState(EMPTY_SECTIONS);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const [hasStarted, setHasStarted] = useState(false);

  const handleReview = useCallback(async () => {
    if (!code.trim() || isStreaming) return;

    setIsStreaming(true);
    setError(null);
    setHasStarted(true);
    setSections(EMPTY_SECTIONS);

    let rafId = null;
    let pending = EMPTY_SECTIONS;

    const onSectionsUpdate = (next) => {
      pending = next;
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        setSections(pending);
        rafId = null;
      });
    };

    try {
      await streamReview(code, language, onSectionsUpdate);
      setSections(pending);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      if (rafId) cancelAnimationFrame(rafId);
      setIsStreaming(false);
    }
  }, [code, language, isStreaming]);

  const handleClear = useCallback(() => {
    setCode('');
    setSections(EMPTY_SECTIONS);
    setError(null);
    setHasStarted(false);
    setIsStreaming(false);
  }, []);

  const dismissError = useCallback(() => setError(null), []);

  return {
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
  };
};
