import { useSearchParams } from 'react-router-dom';
import { usePokemonPage } from '../hooks/usePokemonPage';
import StatsHeader from '../components/StatsHeader';
import PokemonTable from '../components/PokemonTable';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const PAGE_SIZE = 10;

export default function TableView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));

  const { pokemon, totalCount, isLoading, isError, error } = usePokemonPage(
    page,
    PAGE_SIZE,
  );

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  function handlePageChange(newPage) {
    setSearchParams({ page: String(newPage) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Pokémon Collection
        </h1>

        {/* Bonus: aggregated stats header */}
        {!isLoading && !isError && pokemon.length > 0 && (
          <StatsHeader pokemon={pokemon} totalCount={totalCount} />
        )}

        {isLoading && <LoadingSpinner message="Loading Pokémon…" />}

        {isError && (
          <ErrorMessage
            error={error}
            onRetry={() => setSearchParams({ page: String(page) })}
          />
        )}

        {!isLoading && !isError && pokemon.length > 0 && (
          <>
            <PokemonTable pokemon={pokemon} />
            {totalPages > 1 && (
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}
