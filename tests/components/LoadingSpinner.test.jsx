import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../../src/components/LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders the default loading message', () => {
    render(<LoadingSpinner />);

    expect(screen.getByText('Loading…')).toBeInTheDocument();
  });

  it('renders a custom message when provided', () => {
    render(<LoadingSpinner message="Fetching Pokémon…" />);

    expect(screen.getByText('Fetching Pokémon…')).toBeInTheDocument();
  });

  it('has role="status" for screen reader accessibility', () => {
    render(<LoadingSpinner />);

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('exposes the message as an aria-label on the status element', () => {
    render(<LoadingSpinner message="Please wait" />);

    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Please wait');
  });
});
