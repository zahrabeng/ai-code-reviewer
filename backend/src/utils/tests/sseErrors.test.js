import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getReviewErrorMessage } from '../sseErrors.js';

describe('sseErrors.js', () => {
  describe('getReviewErrorMessage', () => {
    it('returns disabled-key message when API message mentions disabled', () => {
      const err = {
        status: 401,
        error: { error: { message: 'API key is disabled', type: 'authentication_error' } },
      };
      assert.equal(
        getReviewErrorMessage(err),
        'The API key is disabled. Code reviews are unavailable at this time.'
      );
    });

    it('returns invalid-or-disabled message for authentication_error type', () => {
      const err = {
        status: 401,
        error: { error: { message: 'Invalid bearer token', type: 'authentication_error' } },
      };
      assert.equal(
        getReviewErrorMessage(err),
        'The API key is invalid or disabled. Code reviews are unavailable at this time.'
      );
    });

    it('returns generic invalid API key message for other 401 errors', () => {
      const err = { status: 401 };
      assert.equal(getReviewErrorMessage(err), 'Invalid API key. Please check your configuration.');
    });

    it('returns model not found message for 404', () => {
      assert.equal(
        getReviewErrorMessage({ status: 404 }),
        'AI model not found. Please check the model name in your configuration.'
      );
    });

    it('returns rate limit message for 429', () => {
      assert.equal(
        getReviewErrorMessage({ status: 429 }),
        'Claude API rate limit reached. Try again in a moment.'
      );
    });

    it('returns bad request message for 400', () => {
      assert.equal(
        getReviewErrorMessage({ status: 400 }),
        'The request was rejected by the AI service.'
      );
    });

    it('returns generic message for unknown errors', () => {
      assert.equal(
        getReviewErrorMessage({ status: 500 }),
        'An error occurred while processing your request.'
      );
      assert.equal(getReviewErrorMessage({}), 'An error occurred while processing your request.');
    });

    it('falls back to err.message for apiMessage when nested body is missing', () => {
      const err = { status: 401, message: 'Key is disabled for this account' };
      assert.equal(
        getReviewErrorMessage(err),
        'The API key is disabled. Code reviews are unavailable at this time.'
      );
    });
  });
});
