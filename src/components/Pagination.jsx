/**
 * Simple prev/next pagination control.
 * @param {{ page: number, totalPages: number, onPageChange: (n: number) => void }} props
 */
export default function Pagination({ page, totalPages, onPageChange }) {
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <nav className="flex items-center justify-between mt-4 px-1" aria-label="Pagination">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={!hasPrev}
        className="px-4 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        aria-label="Previous page"
      >
        ← Previous
      </button>

      <span className="text-sm text-gray-600">
        Page <span className="font-semibold">{page}</span> of{' '}
        <span className="font-semibold">{totalPages}</span>
      </span>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNext}
        className="px-4 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        aria-label="Next page"
      >
        Next →
      </button>
    </nav>
  );
}
