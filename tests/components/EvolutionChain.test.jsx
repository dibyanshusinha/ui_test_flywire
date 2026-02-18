import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import EvolutionChain from '../../src/components/EvolutionChain';
import { bulbasaurChain, singleStageChain } from '../fixtures/evolutionChain';

// vi.mock is hoisted before imports; use vi.hoisted() so the variable is in scope
const navigateMock = vi.hoisted(() => vi.fn());

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useNavigate: () => navigateMock };
});

function renderChain(chain, currentId = '1') {
  return render(
    <MemoryRouter>
      <EvolutionChain chain={chain} currentId={currentId} />
    </MemoryRouter>,
  );
}

describe('EvolutionChain', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows "No evolutions" message for a single-stage pokemon', () => {
    renderChain(singleStageChain, '132');

    expect(screen.getByText(/no evolutions/i)).toBeInTheDocument();
  });

  it('renders all evolution stages for a three-stage chain', () => {
    renderChain(bulbasaurChain, '1');

    expect(screen.getByRole('button', { name: /view bulbasaur/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /view ivysaur/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /view venusaur/i })).toBeInTheDocument();
  });

  it('renders separating arrows between evolution stages', () => {
    renderChain(bulbasaurChain, '1');

    // 3 stages → 2 arrows
    const arrows = screen.getAllByText('→');
    expect(arrows).toHaveLength(2);
  });

  it('marks the current pokemon stage with aria-current="true"', () => {
    renderChain(bulbasaurChain, '2');

    const ivysaurBtn = screen.getByRole('button', { name: /view ivysaur/i });
    expect(ivysaurBtn).toHaveAttribute('aria-current', 'true');
  });

  it('does not mark non-current stages with aria-current', () => {
    renderChain(bulbasaurChain, '1');

    const ivysaurBtn = screen.getByRole('button', { name: /view ivysaur/i });
    expect(ivysaurBtn).not.toHaveAttribute('aria-current');
  });

  it('renders a sprite image for each evolution stage', () => {
    renderChain(bulbasaurChain, '1');

    expect(screen.getByAltText('Bulbasaur')).toBeInTheDocument();
    expect(screen.getByAltText('Ivysaur')).toBeInTheDocument();
    expect(screen.getByAltText('Venusaur')).toBeInTheDocument();
  });

  it('calls navigate with the correct detail route when a stage button is clicked', async () => {
    renderChain(bulbasaurChain, '1');

    await userEvent.click(screen.getByRole('button', { name: /view ivysaur/i }));

    expect(navigateMock).toHaveBeenCalledWith('/pokemon/2');
  });

  it('formats hyphenated evolution names with capitalised words', () => {
    const chainWithHyphen = {
      chain: {
        species: {
          name: 'mr-mime',
          url: 'https://pokeapi.co/api/v2/pokemon-species/122/',
        },
        evolves_to: [
          {
            species: {
              name: 'mr-rime',
              url: 'https://pokeapi.co/api/v2/pokemon-species/866/',
            },
            evolves_to: [],
          },
        ],
      },
    };
    renderChain(chainWithHyphen, '122');

    expect(screen.getByRole('button', { name: /view mr mime/i })).toBeInTheDocument();
  });
});
