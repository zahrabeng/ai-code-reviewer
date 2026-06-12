import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useCodeReview } from '../useCodeReview.js';
import { EMPTY_SECTIONS } from '../../utils/reviewStream.js';

vi.mock('../../utils/reviewStream.js', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    streamReview: vi.fn(),
  };
});

import { streamReview } from '../../utils/reviewStream.js';

describe('useCodeReview.js', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => useCodeReview());

    expect(result.current.code).toBe('');
    expect(result.current.language).toBe('javascript');
    expect(result.current.sections).toEqual(EMPTY_SECTIONS);
    expect(result.current.isStreaming).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.hasStarted).toBe(false);
  });

  it('updates code and language', () => {
    const { result } = renderHook(() => useCodeReview());

    act(() => result.current.setCode('const x = 1'));
    act(() => result.current.setLanguage('python'));

    expect(result.current.code).toBe('const x = 1');
    expect(result.current.language).toBe('python');
  });

  it('does not start a review when code is empty', async () => {
    const { result } = renderHook(() => useCodeReview());

    await act(async () => {
      await result.current.handleReview();
    });

    expect(streamReview).not.toHaveBeenCalled();
  });

  it('streams a review and updates sections', async () => {
    streamReview.mockImplementation(async (_code, _language, onUpdate) => {
      onUpdate({ bugs: 'issue', improvements: '', explanation: '', score: '' });
    });

    const { result } = renderHook(() => useCodeReview());

    act(() => result.current.setCode('console.log(1)'));

    await act(async () => {
      await result.current.handleReview();
    });

    await waitFor(() => {
      expect(result.current.hasStarted).toBe(true);
      expect(result.current.isStreaming).toBe(false);
      expect(result.current.sections.bugs).toBe('issue');
    });
  });

  it('sets error state when streaming fails', async () => {
    streamReview.mockRejectedValue(new Error('Server error'));

    const { result } = renderHook(() => useCodeReview());

    act(() => result.current.setCode('console.log(1)'));

    await act(async () => {
      await result.current.handleReview();
    });

    await waitFor(() => {
      expect(result.current.error).toBe('Server error');
      expect(result.current.isStreaming).toBe(false);
    });
  });

  it('clears state with handleClear', async () => {
    streamReview.mockImplementation(async (_code, _language, onUpdate) => {
      onUpdate({ bugs: 'issue', improvements: '', explanation: '', score: '' });
    });

    const { result } = renderHook(() => useCodeReview());

    act(() => result.current.setCode('console.log(1)'));
    await act(async () => {
      await result.current.handleReview();
    });

    act(() => result.current.handleClear());

    expect(result.current.code).toBe('');
    expect(result.current.sections).toEqual(EMPTY_SECTIONS);
    expect(result.current.error).toBeNull();
    expect(result.current.hasStarted).toBe(false);
  });

  it('dismisses errors with dismissError', async () => {
    streamReview.mockRejectedValue(new Error('Server error'));

    const { result } = renderHook(() => useCodeReview());

    act(() => result.current.setCode('console.log(1)'));
    await act(async () => {
      await result.current.handleReview();
    });

    act(() => result.current.dismissError());

    expect(result.current.error).toBeNull();
  });
});
