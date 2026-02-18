import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { usePokemonPage } from '../../src/hooks/usePokemonPage';
import { bulbasaur, charmander, pokemonList } from '../fixtures/pokemon';
import { createTestQueryClient } from '../utils';

vi.mock('../../src/services/pokeApi', () => ({
  fetchPokemonList: vi.fn(),
  fetchPokemon: vi.fn(),
}));

import { fetchPokemonList, fetchPokemon } from '../../src/services/pokeApi';

function wrapper({ children }) {
  return (
    <QueryClientProvider client={createTestQueryClient()}>
      {children}
    </QueryClientProvider>
  );
}

describe('usePokemonPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns isLoading=true before data arrives', () => {
    fetchPokemonList.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => usePokemonPage(1), { wrapper });

    expect(result.current.isLoading).toBe(true);
  });

  it('returns an empty pokemon array while loading', () => {
    fetchPokemonList.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => usePokemonPage(1), { wrapper });

    expect(result.current.pokemon).toEqual([]);
  });

  it('returns the full pokemon list after all detail fetches resolve', async () => {
    fetchPokemonList.mockResolvedValue(pokemonList);
    fetchPokemon
      .mockResolvedValueOnce(bulbasaur)
      .mockResolvedValueOnce(charmander);

    const { result } = renderHook(() => usePokemonPage(1, 2), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.pokemon).toEqual([bulbasaur, charmander]);
  });

  it('exposes the total pokemon count from the list response', async () => {
    fetchPokemonList.mockResolvedValue(pokemonList);
    fetchPokemon.mockResolvedValue(bulbasaur);

    const { result } = renderHook(() => usePokemonPage(1, 1), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.totalCount).toBe(1302);
  });

  it('returns isError=true when the list fetch fails', async () => {
    fetchPokemonList.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => usePokemonPage(1), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it('surfaces the error object when the list fetch fails', async () => {
    const err = new Error('Network error');
    fetchPokemonList.mockRejectedValue(err);

    const { result } = renderHook(() => usePokemonPage(1), { wrapper });

    await waitFor(() => expect(result.current.error).toBeTruthy());
    expect(result.current.error.message).toBe('Network error');
  });

  it('calculates the correct offset based on page and pageSize', async () => {
    fetchPokemonList.mockResolvedValue({ count: 1302, results: [] });

    renderHook(() => usePokemonPage(3, 10), { wrapper });

    await waitFor(() =>
      expect(fetchPokemonList).toHaveBeenCalledWith(10, 20),
    );
  });

  it('fetches individual pokemon details for each list entry', async () => {
    fetchPokemonList.mockResolvedValue(pokemonList);
    fetchPokemon.mockResolvedValue(bulbasaur);

    renderHook(() => usePokemonPage(1, 2), { wrapper });

    await waitFor(() =>
      expect(fetchPokemon).toHaveBeenCalledTimes(2),
    );
  });
});
