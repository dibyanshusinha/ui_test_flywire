import { useQuery, useQueries } from '@tanstack/react-query';
import { fetchPokemonList, fetchPokemon } from '../services/pokeApi';

const STALE_TIME = 24 * 60 * 60 * 1000; // 24 h — matches PokeAPI cache headers

function idFromUrl(url) {
  return url.split('/').filter(Boolean).pop();
}

/**
 * Fetches a page of Pokémon with full detail data.
 * Strategy: list fetch → parallel individual detail fetches (useQueries).
 */
export function usePokemonPage(page, pageSize = 10) {
  const offset = (page - 1) * pageSize;

  const listQuery = useQuery({
    queryKey: ['pokemon-list', pageSize, offset],
    queryFn: () => fetchPokemonList(pageSize, offset),
    staleTime: STALE_TIME,
  });

  const ids = listQuery.data?.results.map((p) => idFromUrl(p.url)) ?? [];

  const detailQueries = useQueries({
    queries: ids.map((id) => ({
      queryKey: ['pokemon', id],
      queryFn: () => fetchPokemon(id),
      staleTime: STALE_TIME,
      enabled: Boolean(id),
    })),
  });

  const isLoading =
    listQuery.isLoading || detailQueries.some((q) => q.isLoading);
  const isError =
    listQuery.isError || detailQueries.some((q) => q.isError);
  const error =
    listQuery.error ?? detailQueries.find((q) => q.error)?.error ?? null;

  // Preserve insertion order; filter out any still-loading slots
  const pokemon = detailQueries.map((q) => q.data).filter(Boolean);

  return {
    pokemon,
    totalCount: listQuery.data?.count ?? 0,
    isLoading,
    isError,
    error,
  };
}
