import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import PokemonTable from '../../src/components/PokemonTable';
import { bulbasaur, charmander } from '../fixtures/pokemon';

function renderTable(pokemon = [bulbasaur, charmander]) {
  return render(
    <MemoryRouter>
      <PokemonTable pokemon={pokemon} />
    </MemoryRouter>,
  );
}

describe('PokemonTable', () => {
  it('renders a row for every pokemon in the list', () => {
    renderTable();

    expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('Charmander')).toBeInTheDocument();
  });

  it('renders the table with an accessible label', () => {
    renderTable();

    expect(screen.getByRole('table', { name: /pokémon list/i })).toBeInTheDocument();
  });

  it('renders sortable column headers', () => {
    renderTable();

    expect(screen.getByRole('columnheader', { name: /pokémon/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /hp/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /speed/i })).toBeInTheDocument();
  });

  it('initially shows the neutral sort icon on all sortable columns', () => {
    renderTable();

    const nameHeader = screen.getByRole('columnheader', { name: /pokémon/i });
    expect(within(nameHeader).getByText('↕')).toBeInTheDocument();
  });

  it('sorts pokemon by name ascending on first click', async () => {
    renderTable();

    await userEvent.click(screen.getByRole('columnheader', { name: /pokémon/i }));

    const rows = screen.getAllByRole('button');
    const names = rows.map((r) => r.getAttribute('aria-label'));
    // Bulbasaur < Charmander alphabetically
    expect(names[0]).toMatch(/bulbasaur/i);
    expect(names[1]).toMatch(/charmander/i);
  });

  it('reverses sort to descending on a second click of the same column', async () => {
    renderTable();

    const header = screen.getByRole('columnheader', { name: /pokémon/i });
    await userEvent.click(header); // asc
    await userEvent.click(header); // desc

    const rows = screen.getAllByRole('button');
    const names = rows.map((r) => r.getAttribute('aria-label'));
    expect(names[0]).toMatch(/charmander/i);
    expect(names[1]).toMatch(/bulbasaur/i);
  });

  it('shows the ascending sort icon after sorting a column', async () => {
    renderTable();

    await userEvent.click(screen.getByRole('columnheader', { name: /pokémon/i }));

    const nameHeader = screen.getByRole('columnheader', { name: /pokémon/i });
    expect(within(nameHeader).getByText('↑')).toBeInTheDocument();
  });

  it('shows the descending sort icon on a second click', async () => {
    renderTable();

    const header = screen.getByRole('columnheader', { name: /pokémon/i });
    await userEvent.click(header);
    await userEvent.click(header);

    expect(within(header).getByText('↓')).toBeInTheDocument();
  });

  it('sorts pokemon by HP when the HP column is clicked', async () => {
    // bulbasaur HP=45, charmander HP=39 → asc: charmander first
    renderTable();

    await userEvent.click(screen.getByRole('columnheader', { name: /^hp/i }));

    const rows = screen.getAllByRole('button');
    expect(rows[0].getAttribute('aria-label')).toMatch(/charmander/i);
  });

  it('resets active sort icon when switching to a different column', async () => {
    renderTable();

    const nameHeader = screen.getByRole('columnheader', { name: /pokémon/i });
    const hpHeader = screen.getByRole('columnheader', { name: /^hp/i });

    await userEvent.click(nameHeader);
    await userEvent.click(hpHeader);

    expect(within(nameHeader).getByText('↕')).toBeInTheDocument();
    expect(within(hpHeader).getByText('↑')).toBeInTheDocument();
  });

  it('sorts pokemon by speed ascending when the Speed column is clicked', async () => {
    // bulbasaur speed=45, charmander speed=65 → asc: bulbasaur first
    renderTable();

    await userEvent.click(screen.getByRole('columnheader', { name: /^speed/i }));

    const rows = screen.getAllByRole('button');
    expect(rows[0].getAttribute('aria-label')).toMatch(/bulbasaur/i);
    expect(rows[1].getAttribute('aria-label')).toMatch(/charmander/i);
  });

  it('sorts pokemon by speed descending on a second click of Speed', async () => {
    renderTable();

    const speedHeader = screen.getByRole('columnheader', { name: /^speed/i });
    await userEvent.click(speedHeader);
    await userEvent.click(speedHeader);

    const rows = screen.getAllByRole('button');
    expect(rows[0].getAttribute('aria-label')).toMatch(/charmander/i);
  });

  it('shows the active sort icon on the Speed column when sorted', async () => {
    renderTable();

    const speedHeader = screen.getByRole('columnheader', { name: /^speed/i });
    await userEvent.click(speedHeader);

    expect(within(speedHeader).getByText('↑')).toBeInTheDocument();
  });

  it('sorts pokemon by base XP ascending when the Primary Ability column is clicked', async () => {
    // bulbasaur baseXP=64, charmander baseXP=62 → asc: charmander first (62 < 64)
    renderTable();

    await userEvent.click(screen.getByRole('columnheader', { name: /primary ability/i }));

    const rows = screen.getAllByRole('button');
    expect(rows[0].getAttribute('aria-label')).toMatch(/charmander/i);
  });

  it('sorts pokemon by base XP descending on a second click of Primary Ability', async () => {
    renderTable();

    const xpHeader = screen.getByRole('columnheader', { name: /primary ability/i });
    await userEvent.click(xpHeader);
    await userEvent.click(xpHeader);

    const rows = screen.getAllByRole('button');
    expect(rows[0].getAttribute('aria-label')).toMatch(/bulbasaur/i);
  });

  it('shows the active sort icon on the Primary Ability column when sorted', async () => {
    renderTable();

    const xpHeader = screen.getByRole('columnheader', { name: /primary ability/i });
    await userEvent.click(xpHeader);

    expect(within(xpHeader).getByText('↑')).toBeInTheDocument();
  });

  it('treats missing base_experience as 0 when sorting by base XP', async () => {
    const noXp = { ...bulbasaur, id: 99, name: 'missingno', base_experience: null };
    renderTable([noXp, charmander]);

    await userEvent.click(screen.getByRole('columnheader', { name: /primary ability/i }));

    // noXp has 0, charmander has 62 → noXp sorts first ascending
    const rows = screen.getAllByRole('button');
    expect(rows[0].getAttribute('aria-label')).toMatch(/missingno/i);
  });
});
