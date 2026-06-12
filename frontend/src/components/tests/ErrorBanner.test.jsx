import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorBanner from '../ErrorBanner.jsx';

describe('ErrorBanner.jsx', () => {
  it('renders the error message with alert role', () => {
    render(<ErrorBanner message="Something went wrong" />);

    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong');
  });

  it('calls onDismiss when the dismiss button is clicked', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();

    render(<ErrorBanner message="Something went wrong" onDismiss={onDismiss} />);

    await user.click(screen.getByRole('button', { name: /dismiss error/i }));

    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('does not render a dismiss button when onDismiss is omitted', () => {
    const { container } = render(<ErrorBanner message="Something went wrong" />);

    expect(container.querySelector('[aria-label="Dismiss error"]')).not.toBeInTheDocument();
  });
});
