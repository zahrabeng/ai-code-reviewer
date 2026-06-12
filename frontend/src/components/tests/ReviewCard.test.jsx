import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReviewCard from '../ReviewCard.jsx';

describe('ReviewCard.jsx', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the section title and content', () => {
    render(
      <ReviewCard
        sectionKey="bugs"
        title="🐛 Bugs & Issues"
        content="- Missing null check"
        isStreaming={false}
        isActive={false}
      />
    );

    expect(screen.getByRole('region', { name: '🐛 Bugs & Issues' })).toBeInTheDocument();
    expect(screen.getByText('Missing null check')).toBeInTheDocument();
  });

  it('shows plain text with a cursor while the active section is streaming', () => {
    render(
      <ReviewCard
        sectionKey="bugs"
        title="🐛 Bugs & Issues"
        content="Streaming text"
        isStreaming={true}
        isActive={true}
      />
    );

    expect(screen.getByText('Streaming text')).toBeInTheDocument();
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('copies section content to the clipboard', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText } });

    render(
      <ReviewCard
        sectionKey="bugs"
        title="🐛 Bugs & Issues"
        content="- Missing null check"
        isStreaming={false}
        isActive={false}
      />
    );

    await user.click(
      screen.getByRole('button', { name: 'Copy 🐛 Bugs & Issues to clipboard' })
    );

    expect(writeText).toHaveBeenCalledWith('- Missing null check');
    expect(await screen.findByText('Copied')).toBeInTheDocument();
  });

  it('disables copy when content is empty', () => {
    render(
      <ReviewCard
        sectionKey="bugs"
        title="🐛 Bugs & Issues"
        content=""
        isStreaming={false}
        isActive={false}
      />
    );

    expect(
      screen.getByRole('button', { name: 'Copy 🐛 Bugs & Issues to clipboard' })
    ).toBeDisabled();
  });
});
