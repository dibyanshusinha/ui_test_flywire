/**
 * Displays an error with an optional retry action.
 * @param {{ error: Error|null, onRetry?: () => void }} props
 */
export default function ErrorMessage({ error, onRetry }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 py-16 text-center"
    >
      <span className="text-4xl" aria-hidden="true">⚠️</span>
      <p className="text-red-600 font-medium">
        {error?.message ?? 'Something went wrong'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Try again
        </button>
      )}
    </div>
  );
}
