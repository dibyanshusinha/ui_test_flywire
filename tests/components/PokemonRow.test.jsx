import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import PokemonRow from '../../src/components/PokemonRow';
import { bulbasaur } from '../fixtures/pokemon';

// vi.mock is hoisted before imports; use vi.hoisted() so the variable is in scope
const navigateMock = vi.hoisted(() => vi.fn());

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useNavigate: () => navigateMock };
});

function renderRow(pokemon) {
  return render(
    <MemoryRouter>
      <table>
        <tbody>
          <PokemonRow pokemon={pokemon} />
        </tbody>
      </table>
    </MemoryRouter>,
  );
}

describe('PokemonRow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the formatted pokemon name', () => {
    renderRow(bulbasaur);

    expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
  });

  it('renders hyphenated names with each segment capitalised', () => {
    renderRow({ ...bulbasaur, name: 'mr-mime' });

    expect(screen.getByText('Mr Mime')).toBeInTheDocument();
  });

  it('renders the pokemon sprite image', () => {
    renderRow(bulbasaur);

    expect(screen.getByRole('img', { name: 'Bulbasaur' })).toBeInTheDocument();
  });

  it('renders a TypeBadge for each type', () => {
    renderRow(bulbasaur);

    expect(screen.getByText('Grass')).toBeInTheDocument();
    expect(screen.getByText('Poison')).toBeInTheDocument();
  });

  it('renders the HP stat', () => {
    renderRow(bulbasaur);

    // bulbasaur HP = 45
    expect(screen.getAllByText('45').length).toBeGreaterThanOrEqual(1);
  });

  it('renders the Speed stat', () => {
    // Both HP and Speed are 45 for bulbasaur — both cells show 45
    renderRow(bulbasaur);

    expect(screen.getAllByText('45')).toHaveLength(2);
  });

  it('renders the primary (non-hidden) ability', () => {
    renderRow(bulbasaur);

    expect(screen.getByText('overgrow')).toBeInTheDocument();
  });

  it('renders the base XP', () => {
    renderRow(bulbasaur);

    expect(screen.getByText('Base XP: 64')).toBeInTheDocument();
  });

  it('renders — for base XP when not available', () => {
    renderRow({ ...bulbasaur, base_experience: null });

    expect(screen.getByText('Base XP: —')).toBeInTheDocument();
  });

  it('has an accessible label describing the pokemon', () => {
    renderRow(bulbasaur);

    expect(
      screen.getByRole('button', { name: /view details for bulbasaur/i }),
    ).toBeInTheDocument();
  });

  it('calls navigate with the pokemon detail route when the row is clicked', async () => {
    renderRow(bulbasaur);

    await userEvent.click(screen.getByRole('button', { name: /view details for bulbasaur/i }));

    expect(navigateMock).toHaveBeenCalledWith('/pokemon/1');
  });

  it('calls navigate when Enter is pressed on the focused row', async () => {
    renderRow(bulbasaur);

    const row = screen.getByRole('button', { name: /view details for bulbasaur/i });
    row.focus();
    await userEvent.keyboard('{Enter}');

    expect(navigateMock).toHaveBeenCalledWith('/pokemon/1');
  });

  it('calls navigate when Space is pressed on the focused row', async () => {
    renderRow(bulbasaur);

    const row = screen.getByRole('button', { name: /view details for bulbasaur/i });
    row.focus();
    await userEvent.keyboard(' ');

    expect(navigateMock).toHaveBeenCalledWith('/pokemon/1');
  });

  it('renders — for HP when the stat is not present in the stats array', () => {
    renderRow({ ...bulbasaur, stats: [] });

    // Both HP and Speed cells should show '—'
    expect(screen.getAllByText('—').length).toBeGreaterThanOrEqual(1);
  });

  it('renders — for the primary ability when all abilities are hidden', () => {
    const allHidden = {
      ...bulbasaur,
      abilities: [{ ability: { name: 'chlorophyll' }, is_hidden: true }],
    };
    renderRow(allHidden);

    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('does not navigate when a non-trigger key is pressed on the row', async () => {
    renderRow(bulbasaur);

    const row = screen.getByRole('button', { name: /view details for bulbasaur/i });
    row.focus();
    await userEvent.keyboard('{Tab}');

    expect(navigateMock).not.toHaveBeenCalled();
  });
});
