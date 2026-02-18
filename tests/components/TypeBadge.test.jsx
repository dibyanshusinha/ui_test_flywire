import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TypeBadge from '../../src/components/TypeBadge';

describe('TypeBadge', () => {
  it('renders the type name capitalized', () => {
    render(<TypeBadge type="fire" />);

    expect(screen.getByText('Fire')).toBeInTheDocument();
  });

  it('applies the correct background color for a known type', () => {
    const { container } = render(<TypeBadge type="water" />);
    const icon = container.querySelector('[aria-hidden="true"]');

    expect(icon).toHaveStyle({ backgroundColor: '#4488FF' });
  });

  it('applies the correct background color for types with a light text color', () => {
    const { container } = render(<TypeBadge type="fire" />);
    const icon = container.querySelector('[aria-hidden="true"]');

    expect(icon).toHaveStyle({ backgroundColor: '#FF6B35' });
  });

  it('applies a bright background color for electric type', () => {
    const { container } = render(<TypeBadge type="electric" />);
    const icon = container.querySelector('[aria-hidden="true"]');

    expect(icon).toHaveStyle({ backgroundColor: '#FFD700' });
  });

  it('falls back to gray for an unknown type', () => {
    const { container } = render(<TypeBadge type="unknown-type" />);
    const icon = container.querySelector('[aria-hidden="true"]');

    expect(icon).toHaveStyle({ backgroundColor: '#A8A8A8' });
  });

  it('renders with small icon size by default', () => {
    const { container } = render(<TypeBadge type="fire" />);
    const icon = container.querySelector('[aria-hidden="true"]');

    expect(icon).toHaveClass('w-5', 'h-5', 'text-xs');
  });

  it('renders with medium icon size when size="md"', () => {
    const { container } = render(<TypeBadge type="fire" size="md" />);
    const icon = container.querySelector('[aria-hidden="true"]');

    expect(icon).toHaveClass('w-7', 'h-7', 'text-base');
  });

  it('renders a decorative dot that is hidden from assistive technology', () => {
    const { container } = render(<TypeBadge type="grass" />);
    const dot = container.querySelector('[aria-hidden="true"]');

    expect(dot).toBeInTheDocument();
  });
});
