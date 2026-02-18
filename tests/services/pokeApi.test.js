import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  fetchPokemonList,
  fetchPokemon,
  fetchPokemonSpecies,
  fetchEvolutionChain,
  fetchMove,
} from '../../src/services/pokeApi';

const BASE = 'https://pokeapi.co/api/v2';

function mockFetch(data, ok = true, status = 200) {
  return vi.fn().mockResolvedValue({
    ok,
    status,
    json: () => Promise.resolve(data),
  });
}

describe('pokeApi service', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('fetchPokemonList', () => {
    it('calls the correct URL with limit and offset', async () => {
      global.fetch = mockFetch({ count: 100, results: [] });

      await fetchPokemonList(10, 0);

      expect(fetch).toHaveBeenCalledWith(`${BASE}/pokemon?limit=10&offset=0`);
    });

    it('passes through the parsed JSON response', async () => {
      const payload = { count: 1302, results: [{ name: 'bulbasaur' }] };
      global.fetch = mockFetch(payload);

      const result = await fetchPokemonList(1, 0);

      expect(result).toEqual(payload);
    });

    it('supports non-zero offsets for pagination', async () => {
      global.fetch = mockFetch({ count: 100, results: [] });

      await fetchPokemonList(10, 20);

      expect(fetch).toHaveBeenCalledWith(`${BASE}/pokemon?limit=10&offset=20`);
    });
  });

  describe('fetchPokemon', () => {
    it('calls the correct URL for a pokemon name', async () => {
      global.fetch = mockFetch({ id: 1, name: 'bulbasaur' });

      await fetchPokemon('bulbasaur');

      expect(fetch).toHaveBeenCalledWith(`${BASE}/pokemon/bulbasaur`);
    });

    it('calls the correct URL for a numeric id', async () => {
      global.fetch = mockFetch({ id: 1, name: 'bulbasaur' });

      await fetchPokemon(1);

      expect(fetch).toHaveBeenCalledWith(`${BASE}/pokemon/1`);
    });

    it('returns the parsed pokemon data', async () => {
      const data = { id: 1, name: 'bulbasaur' };
      global.fetch = mockFetch(data);

      const result = await fetchPokemon('bulbasaur');

      expect(result).toEqual(data);
    });
  });

  describe('fetchPokemonSpecies', () => {
    it('calls the correct URL with the species id', async () => {
      global.fetch = mockFetch({ id: 1, name: 'bulbasaur' });

      await fetchPokemonSpecies(1);

      expect(fetch).toHaveBeenCalledWith(`${BASE}/pokemon-species/1`);
    });
  });

  describe('fetchEvolutionChain', () => {
    it('calls the exact URL passed as argument', async () => {
      const url = 'https://pokeapi.co/api/v2/evolution-chain/1/';
      global.fetch = mockFetch({ chain: {} });

      await fetchEvolutionChain(url);

      expect(fetch).toHaveBeenCalledWith(url);
    });
  });

  describe('fetchMove', () => {
    it('calls the correct URL for a move name', async () => {
      global.fetch = mockFetch({ id: 13, name: 'razor-wind' });

      await fetchMove('razor-wind');

      expect(fetch).toHaveBeenCalledWith(`${BASE}/move/razor-wind`);
    });
  });

  describe('error handling', () => {
    it('throws an error when the response is not ok', async () => {
      global.fetch = mockFetch(null, false, 404);

      await expect(fetchPokemon('unknown-pokemon')).rejects.toThrow(
        'PokeAPI error 404',
      );
    });

    it('includes the failing URL in the error message', async () => {
      global.fetch = mockFetch(null, false, 500);

      await expect(fetchPokemonList(10, 0)).rejects.toThrow(
        `${BASE}/pokemon?limit=10&offset=0`,
      );
    });
  });
});
