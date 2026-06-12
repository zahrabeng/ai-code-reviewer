import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReviewOutput from '../ReviewOutput.jsx';
import { EMPTY_SECTIONS } from '../../utils/reviewStream.js';

vi.mock('../ReviewCard.jsx', () => ({
  default: ({ title, content }) => (
    <div data-testid="review-card">
      <h3>{title}</h3>
      <p>{content}</p>
    </div>
  ),
}));

describe('ReviewOutput.jsx', () => {
  it('shows the empty state before a review starts', () => {
    render(
      <ReviewOutput
        sections={EMPTY_SECTIONS}
        isStreaming={false}
        error={null}
        hasStarted={false}
        onDismissError={vi.fn()}
      />
    );

    expect(screen.getByText(/your ai review will appear here/i)).toBeInTheDocument();
  });

  it('shows the streaming state while waiting for content', () => {
    render(
      <ReviewOutput
        sections={EMPTY_SECTIONS}
        isStreaming={true}
        error={null}
        hasStarted={true}
        onDismissError={vi.fn()}
      />
    );

    expect(screen.getByText(/analyzing your code/i)).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(/streaming/i);
  });

  it('renders review cards when section content exists', () => {
    render(
      <ReviewOutput
        sections={{ bugs: 'issue', improvements: '', explanation: '', score: '' }}
        isStreaming={false}
        error={null}
        hasStarted={true}
        onDismissError={vi.fn()}
      />
    );

    expect(screen.getAllByTestId('review-card')).toHaveLength(1);
    expect(screen.getByText('issue')).toBeInTheDocument();
  });

  it('renders an error banner and dismisses it', async () => {
    const user = userEvent.setup();
    const onDismissError = vi.fn();

    render(
      <ReviewOutput
        sections={EMPTY_SECTIONS}
        isStreaming={false}
        error="The API key is disabled."
        hasStarted={true}
        onDismissError={onDismissError}
      />
    );

    expect(screen.getByRole('alert')).toHaveTextContent('The API key is disabled.');

    await user.click(screen.getByRole('button', { name: /dismiss error/i }));

    expect(onDismissError).toHaveBeenCalledOnce();
  });
});
