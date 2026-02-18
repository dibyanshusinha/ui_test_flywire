/**
 * Accessible centered loading spinner.
 * @param {{ message?: string }} props
 */
export default function LoadingSpinner({ message = 'Loading…' }) {
  return (
    <div
      role="status"
      aria-label={message}
      className="flex flex-col items-center justify-center gap-3 py-16"
    >
      <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
      <span className="text-sm text-gray-500">{message}</span>
    </div>
  );
}
