import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CodeInput from '../CodeInput.jsx';

vi.mock('@uiw/react-codemirror', () => ({
  default: ({ value, onChange, placeholder, 'aria-labelledby': labelledBy }) => (
    <textarea
      aria-labelledby={labelledBy}
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  ),
}));

describe('CodeInput.jsx', () => {
  const defaultProps = {
    code: '',
    language: 'javascript',
    isStreaming: false,
    theme: 'dark',
    onCodeChange: vi.fn(),
    onLanguageChange: vi.fn(),
    onReview: vi.fn(),
    onClear: vi.fn(),
  };

  it('renders language selector and action buttons', () => {
    render(<CodeInput {...defaultProps} />);

    expect(screen.getByRole('toolbar', { name: /code input controls/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/select programming language/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /review javascript code/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /clear code input and review/i })).toBeDisabled();
  });

  it('enables review and clear when code is present', () => {
    render(<CodeInput {...defaultProps} code="console.log(1)" />);

    expect(screen.getByRole('button', { name: /review javascript code/i })).toBeEnabled();
    expect(screen.getByRole('button', { name: /clear code input and review/i })).toBeEnabled();
  });

  it('calls onReview when the review button is clicked', async () => {
    const user = userEvent.setup();
    const onReview = vi.fn();

    render(<CodeInput {...defaultProps} code="console.log(1)" onReview={onReview} />);

    await user.click(screen.getByRole('button', { name: /review javascript code/i }));

    expect(onReview).toHaveBeenCalledOnce();
  });

  it('calls onClear when the clear button is clicked', async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();

    render(<CodeInput {...defaultProps} code="console.log(1)" onClear={onClear} />);

    await user.click(screen.getByRole('button', { name: /clear code input and review/i }));

    expect(onClear).toHaveBeenCalledOnce();
  });

  it('calls onLanguageChange when the language selector changes', async () => {
    const user = userEvent.setup();
    const onLanguageChange = vi.fn();

    render(<CodeInput {...defaultProps} onLanguageChange={onLanguageChange} />);

    await user.selectOptions(screen.getByLabelText(/select programming language/i), 'python');

    expect(onLanguageChange).toHaveBeenCalledWith('python');
  });

  it('shows character count when code is present', () => {
    render(<CodeInput {...defaultProps} code="abc" />);

    expect(screen.getByText(/3 \/ 5,000/)).toBeInTheDocument();
  });

  it('disables controls while streaming', () => {
    render(<CodeInput {...defaultProps} code="console.log(1)" isStreaming={true} />);

    expect(screen.getByRole('button', { name: /review in progress/i })).toBeDisabled();
    expect(screen.getByLabelText(/select programming language/i)).toBeDisabled();
  });
});
