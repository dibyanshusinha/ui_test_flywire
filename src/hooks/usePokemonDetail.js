import { useQuery } from '@tanstack/react-query';
import {
  fetchPokemon,
  fetchPokemonSpecies,
  fetchEvolutionChain,
} from '../services/pokeApi';

const STALE_TIME = 24 * 60 * 60 * 1000;

/**
 * Fetches full Pokémon data including species and evolution chain.
 * Chain: pokemon → species (for evolution URL) → evolution chain.
 */
export function usePokemonDetail(id) {
  const pokemonQuery = useQuery({
    queryKey: ['pokemon', String(id)],
    queryFn: () => fetchPokemon(id),
    staleTime: STALE_TIME,
    enabled: Boolean(id),
  });

  const speciesQuery = useQuery({
    queryKey: ['pokemon-species', String(id)],
    queryFn: () => fetchPokemonSpecies(id),
    staleTime: STALE_TIME,
    enabled: Boolean(pokemonQuery.data),
  });

  const evolutionChainUrl = speciesQuery.data?.evolution_chain?.url;

  const evolutionQuery = useQuery({
    queryKey: ['evolution-chain', evolutionChainUrl],
    queryFn: () => fetchEvolutionChain(evolutionChainUrl),
    staleTime: STALE_TIME,
    enabled: Boolean(evolutionChainUrl),
  });

  return {
    pokemon: pokemonQuery.data ?? null,
    species: speciesQuery.data ?? null,
    evolutionChain: evolutionQuery.data ?? null,
    isLoading: pokemonQuery.isLoading,
    isError: pokemonQuery.isError,
    error: pokemonQuery.error ?? null,
  };
}
