export const getReviewErrorMessage = (err) => {
  const status = err?.status ?? 500;

  if (status === 401) return 'Invalid API key. Please check your configuration.';
  if (status === 404) return 'AI model not found. Please check the model name in your configuration.';
  if (status === 429) return 'Claude API rate limit reached. Try again in a moment.';
  if (status === 400) return 'The request was rejected by the AI service.';

  return 'An error occurred while processing your request.';
};
