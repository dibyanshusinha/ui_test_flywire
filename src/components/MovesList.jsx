import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMove } from '../services/pokeApi';
import TypeBadge from './TypeBadge';

function idFromUrl(url) {
  return url.split('/').filter(Boolean).pop();
}

function formatMoveName(name) {
  return name.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
}

/**
 * A single move row — fetches its own type via TanStack Query.
 * Query results are cached globally, so revisiting a Pokémon reuses cached types.
 */
function MoveItem({ move }) {
  const moveId = idFromUrl(move.url);
  const { data, isLoading } = useQuery({
    queryKey: ['move', moveId],
    queryFn: () => fetchMove(moveId),
    staleTime: Infinity,
  });

  return (
    <div className="flex items-center justify-between px-4 py-2.5 bg-gray-100 rounded-lg">
      <span className="text-sm text-gray-700">{formatMoveName(move.name)}</span>
      {isLoading ? (
        <span className="text-xs text-gray-300 animate-pulse">···</span>
      ) : data ? (
        <TypeBadge type={data.type.name} size="sm" variant="pill" />
      ) : null}
    </div>
  );
}

const MOVES_PER_PAGE = 20;

/**
 * Scrollable moves list with pagination.
 * @param {{ moves: { move: { name: string, url: string } }[] }} props
 */
export default function MovesList({ moves }) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const filtered = query
    ? moves.filter(({ move }) => formatMoveName(move.name).toLowerCase().includes(query.toLowerCase()))
    : moves;

  const totalPages = Math.ceil(filtered.length / MOVES_PER_PAGE);
  const paginated = filtered.slice((page - 1) * MOVES_PER_PAGE, page * MOVES_PER_PAGE);
  const showPagination = filtered.length > MOVES_PER_PAGE;

  function handleSearch(e) {
    setQuery(e.target.value);
    setPage(1);
  }

  return (
    <div className="flex flex-col gap-2">
      <input
        type="search"
        value={query}
        onChange={handleSearch}
        placeholder="Search moves…"
        aria-label="Search moves"
        className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-200 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
      />
      <div
        className="max-h-72 overflow-y-auto flex flex-col gap-2"
        aria-label="Moves list"
      >
        {paginated.length > 0 ? (
          paginated.map(({ move }) => (
            <MoveItem key={move.name} move={move} />
          ))
        ) : (
          <p className="text-xs text-gray-400 text-center py-4">No moves match "{query}"</p>
        )}
      </div>
      {showPagination && (
        <div className="flex items-center justify-between">
          <button onClick={() => setPage((p) => p - 1)} disabled={page === 1}>
            ←
          </button>
          <span>{page} / {totalPages} ({filtered.length} total)</span>
          <button onClick={() => setPage((p) => p + 1)} disabled={page === totalPages}>
            →
          </button>
        </div>
      )}
    </div>
  );
}
