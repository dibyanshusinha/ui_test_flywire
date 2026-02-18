import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatsHeader from '../../src/components/StatsHeader';
import { bulbasaur, charmander } from '../fixtures/pokemon';

describe('StatsHeader', () => {
  it('renders nothing when the pokemon list is empty', () => {
    const { container } = render(<StatsHeader pokemon={[]} totalCount={0} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('displays the total count of pokemon in the collection', () => {
    render(<StatsHeader pokemon={[bulbasaur]} totalCount={1302} />);

    expect(screen.getByText('1,302')).toBeInTheDocument();
  });

  it('calculates and displays the average HP of the current page', () => {
    // bulbasaur HP = 45, charmander HP = 39 → avg = 42.0
    render(<StatsHeader pokemon={[bulbasaur, charmander]} totalCount={2} />);

    expect(screen.getByText('42.0')).toBeInTheDocument();
  });

  it('shows average HP for a single pokemon', () => {
    // bulbasaur HP = 45 → avg = 45.0
    render(<StatsHeader pokemon={[bulbasaur]} totalCount={1} />);

    expect(screen.getByText('45.0')).toBeInTheDocument();
  });

  it('identifies and displays the most powerful pokemon by score', () => {
    // bulbasaur: HP(45) + Speed(45) + baseXP(64) = 154
    // charmander: HP(39) + Speed(65) + baseXP(62) = 166  ← winner
    render(<StatsHeader pokemon={[bulbasaur, charmander]} totalCount={2} />);

    expect(screen.getByText('Charmander')).toBeInTheDocument();
  });

  it('displays the power score of the strongest pokemon', () => {
    // charmander score = 39 + 65 + 62 = 166
    render(<StatsHeader pokemon={[bulbasaur, charmander]} totalCount={2} />);

    expect(screen.getByText('Score: 166')).toBeInTheDocument();
  });

  it('renders type distribution percentages for top types', () => {
    // bulbasaur: grass, poison → each 50% of 2 pokemon
    // charmander: fire → 50%
    render(<StatsHeader pokemon={[bulbasaur, charmander]} totalCount={2} />);

    // Each of grass, poison, fire appears in 1/2 = 50%
    const fiftyPcts = screen.getAllByText('50%');
    expect(fiftyPcts.length).toBeGreaterThanOrEqual(1);
  });

  it('uses 0 for HP when the stat is absent from a pokemon stats array', () => {
    // pokemon with no stats → getStat returns 0, average HP = 0.0
    const noStats = { ...bulbasaur, stats: [] };
    render(<StatsHeader pokemon={[noStats]} totalCount={1} />);

    expect(screen.getByText('0.0')).toBeInTheDocument();
  });

  it('treats null base_experience as 0 when computing the power score', () => {
    // bulbasaur with null base_experience: score = HP(45) + Speed(45) + 0 = 90
    const noXp = { ...bulbasaur, base_experience: null };
    render(<StatsHeader pokemon={[noXp]} totalCount={1} />);

    expect(screen.getByText('Score: 90')).toBeInTheDocument();
  });

  it('counts each type only once per pokemon even if listed twice', () => {
    // duplicate type entries on the same pokemon should not double-count
    const duplicateType = {
      ...bulbasaur,
      types: [{ type: { name: 'grass' } }, { type: { name: 'grass' } }],
    };
    render(<StatsHeader pokemon={[duplicateType]} totalCount={1} />);

    // grass should count as 100% (1/1 pokemon), not 200%
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.queryByText('200%')).not.toBeInTheDocument();
  });

  it('falls back to gray color swatch for a pokemon with an unknown type', () => {
    const unknownType = {
      ...bulbasaur,
      types: [{ type: { name: 'cosmic' } }],
    };
    const { container } = render(<StatsHeader pokemon={[unknownType]} totalCount={1} />);

    // jsdom normalises hex → rgb; #A8A8A8 = rgb(168, 168, 168)
    const swatches = Array.from(container.querySelectorAll('[aria-hidden="true"]'));
    const grayFallback = swatches.find(
      (el) => el.style.backgroundColor === 'rgb(168, 168, 168)',
    );
    expect(grayFallback).toBeDefined();
  });
});
