export const getReviewErrorMessage = (err) => {
  const status = err?.status ?? 500;
  const apiMessage = err?.error?.error?.message ?? err?.message ?? '';
  const apiType = err?.error?.error?.type ?? '';

  if (status === 401) {
    if (/disabled/i.test(apiMessage)) {
      return 'The API key is disabled. Code reviews are unavailable at this time.';
    }
    if (apiType === 'authentication_error') {
      return 'The API key is invalid or disabled. Code reviews are unavailable at this time.';
    }
    return 'Invalid API key. Please check your configuration.';
  }

  if (status === 404) return 'AI model not found. Please check the model name in your configuration.';
  if (status === 429) return 'Claude API rate limit reached. Try again in a moment.';
  if (status === 400) return 'The request was rejected by the AI service.';

  return 'An error occurred while processing your request.';
};
