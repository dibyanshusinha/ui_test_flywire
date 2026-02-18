import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { usePokemonDetail } from '../../src/hooks/usePokemonDetail';
import { bulbasaur, bulbasaurSpecies } from '../fixtures/pokemon';
import { bulbasaurChain } from '../fixtures/evolutionChain';
import { createTestQueryClient } from '../utils';

vi.mock('../../src/services/pokeApi', () => ({
  fetchPokemon: vi.fn(),
  fetchPokemonSpecies: vi.fn(),
  fetchEvolutionChain: vi.fn(),
}));

import {
  fetchPokemon,
  fetchPokemonSpecies,
  fetchEvolutionChain,
} from '../../src/services/pokeApi';

function wrapper({ children }) {
  return (
    <QueryClientProvider client={createTestQueryClient()}>
      {children}
    </QueryClientProvider>
  );
}

describe('usePokemonDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns isLoading=true before data arrives', () => {
    fetchPokemon.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => usePokemonDetail(1), { wrapper });

    expect(result.current.isLoading).toBe(true);
  });

  it('returns the pokemon data after the first fetch resolves', async () => {
    fetchPokemon.mockResolvedValue(bulbasaur);
    fetchPokemonSpecies.mockResolvedValue(bulbasaurSpecies);
    fetchEvolutionChain.mockResolvedValue(bulbasaurChain);

    const { result } = renderHook(() => usePokemonDetail(1), { wrapper });

    await waitFor(() => expect(result.current.pokemon).toBeTruthy());

    expect(result.current.pokemon).toEqual(bulbasaur);
  });

  it('returns the species data after the species fetch resolves', async () => {
    fetchPokemon.mockResolvedValue(bulbasaur);
    fetchPokemonSpecies.mockResolvedValue(bulbasaurSpecies);
    fetchEvolutionChain.mockResolvedValue(bulbasaurChain);

    const { result } = renderHook(() => usePokemonDetail(1), { wrapper });

    await waitFor(() => expect(result.current.species).toBeTruthy());

    expect(result.current.species).toEqual(bulbasaurSpecies);
  });

  it('returns the evolution chain after all dependent fetches resolve', async () => {
    fetchPokemon.mockResolvedValue(bulbasaur);
    fetchPokemonSpecies.mockResolvedValue(bulbasaurSpecies);
    fetchEvolutionChain.mockResolvedValue(bulbasaurChain);

    const { result } = renderHook(() => usePokemonDetail(1), { wrapper });

    await waitFor(() => expect(result.current.evolutionChain).toBeTruthy());

    expect(result.current.evolutionChain).toEqual(bulbasaurChain);
  });

  it('fetches species only after pokemon data is available', async () => {
    // Delay the pokemon fetch
    fetchPokemon.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(bulbasaur), 50)),
    );
    fetchPokemonSpecies.mockResolvedValue(bulbasaurSpecies);
    fetchEvolutionChain.mockResolvedValue(bulbasaurChain);

    renderHook(() => usePokemonDetail(1), { wrapper });

    // Species should not be called immediately
    expect(fetchPokemonSpecies).not.toHaveBeenCalled();

    await waitFor(() => expect(fetchPokemonSpecies).toHaveBeenCalled());
  });

  it('returns isError=true when the pokemon fetch fails', async () => {
    fetchPokemon.mockRejectedValue(new Error('Not found'));

    const { result } = renderHook(() => usePokemonDetail(999), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it('surfaces the error from a failed pokemon fetch', async () => {
    const err = new Error('Not found');
    fetchPokemon.mockRejectedValue(err);

    const { result } = renderHook(() => usePokemonDetail(999), { wrapper });

    await waitFor(() => expect(result.current.error).toBeTruthy());
    expect(result.current.error.message).toBe('Not found');
  });

  it('returns null values when id is falsy', () => {
    const { result } = renderHook(() => usePokemonDetail(null), { wrapper });

    expect(result.current.pokemon).toBeNull();
    expect(result.current.species).toBeNull();
    expect(result.current.evolutionChain).toBeNull();
  });

  it('passes the correct id when fetching pokemon', async () => {
    fetchPokemon.mockResolvedValue(bulbasaur);
    fetchPokemonSpecies.mockResolvedValue(bulbasaurSpecies);
    fetchEvolutionChain.mockResolvedValue(bulbasaurChain);

    renderHook(() => usePokemonDetail(1), { wrapper });

    await waitFor(() => expect(fetchPokemon).toHaveBeenCalledWith(1));
  });

  it('passes the evolution chain URL to fetchEvolutionChain', async () => {
    fetchPokemon.mockResolvedValue(bulbasaur);
    fetchPokemonSpecies.mockResolvedValue(bulbasaurSpecies);
    fetchEvolutionChain.mockResolvedValue(bulbasaurChain);

    renderHook(() => usePokemonDetail(1), { wrapper });

    await waitFor(() =>
      expect(fetchEvolutionChain).toHaveBeenCalledWith(
        bulbasaurSpecies.evolution_chain.url,
      ),
    );
  });
});
