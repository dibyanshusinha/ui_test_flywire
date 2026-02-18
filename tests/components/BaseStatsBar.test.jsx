import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import BaseStatsBar from '../../src/components/BaseStatsBar';

describe('BaseStatsBar', () => {
  it('renders the label for a known stat name', () => {
    render(<BaseStatsBar statName="hp" value={45} />);

    expect(screen.getByText('HP')).toBeInTheDocument();
  });

  it('renders the numeric stat value', () => {
    render(<BaseStatsBar statName="attack" value={49} />);

    expect(screen.getByText('49')).toBeInTheDocument();
  });

  it('falls back to the raw stat name as label for unknown stats', () => {
    render(<BaseStatsBar statName="custom-stat" value={100} />);

    expect(screen.getByText('custom-stat')).toBeInTheDocument();
  });

  it('sets the progressbar aria-valuenow to the stat value', () => {
    render(<BaseStatsBar statName="speed" value={45} />);

    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '45');
  });

  it('sets progressbar aria-valuemax to 255', () => {
    render(<BaseStatsBar statName="speed" value={45} />);

    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '255');
  });

  it('sets the accessible label to include stat name and value', () => {
    render(<BaseStatsBar statName="hp" value={45} />);

    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-label', 'HP: 45');
  });

  it('calculates the bar width as (value / 255) * 100 percent', () => {
    render(<BaseStatsBar statName="hp" value={255} />);
    const bar = screen.getByRole('progressbar');

    expect(bar).toHaveStyle({ width: '100.0%' });
  });

  it('clamps the bar width at 100% even for values above 255', () => {
    render(<BaseStatsBar statName="hp" value={300} />);
    const bar = screen.getByRole('progressbar');

    expect(bar).toHaveStyle({ width: '100.0%' });
  });

  it('applies the correct color for the hp stat', () => {
    render(<BaseStatsBar statName="hp" value={45} />);
    const bar = screen.getByRole('progressbar');

    expect(bar).toHaveStyle({ backgroundColor: '#EF5350' });
  });

  it('applies the correct color for the speed stat', () => {
    render(<BaseStatsBar statName="speed" value={45} />);
    const bar = screen.getByRole('progressbar');

    expect(bar).toHaveStyle({ backgroundColor: '#EC407A' });
  });
});
