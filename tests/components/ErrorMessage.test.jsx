import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorMessage from '../../src/components/ErrorMessage';

describe('ErrorMessage', () => {
  it('displays the error message text', () => {
    render(<ErrorMessage error={new Error('Network failure')} />);

    expect(screen.getByText('Network failure')).toBeInTheDocument();
  });

  it('displays a generic fallback when no error object is provided', () => {
    render(<ErrorMessage error={null} />);

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('has role="alert" so screen readers announce it immediately', () => {
    render(<ErrorMessage error={null} />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders the retry button when onRetry is provided', () => {
    render(<ErrorMessage error={null} onRetry={vi.fn()} />);

    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('does not render a retry button when onRetry is omitted', () => {
    render(<ErrorMessage error={null} />);

    expect(screen.queryByRole('button', { name: /try again/i })).not.toBeInTheDocument();
  });

  it('calls onRetry when the retry button is clicked', async () => {
    const onRetry = vi.fn();
    render(<ErrorMessage error={null} onRetry={onRetry} />);

    await userEvent.click(screen.getByRole('button', { name: /try again/i }));

    expect(onRetry).toHaveBeenCalledOnce();
  });
});
