import { useNavigate } from 'react-router-dom';

/**
 * Recursively flattens the first evolution path from PokeAPI's chain tree.
 * Branching evolutions (e.g. Eevee) follow only the first branch.
 * @param {object} chain
 * @returns {{ name: string, id: string }[]}
 */
function flattenChain(chain) {
  const result = [];
  let node = chain;
  while (node) {
    const id = node.species.url.split('/').filter(Boolean).pop();
    result.push({ name: node.species.name, id });
    node = node.evolves_to?.[0] ?? null;
  }
  return result;
}

function formatName(name) {
  return name.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
}

/**
 * Horizontal evolution chain display.
 * @param {{ chain: object, currentId: string|number }} props
 */
export default function EvolutionChain({ chain, currentId }) {
  const navigate = useNavigate();
  const stages = flattenChain(chain.chain);

  if (stages.length <= 1) {
    return <p className="text-sm text-gray-400 italic">No evolutions</p>;
  }

  return (
    <div className="flex items-center flex-wrap gap-2">
      {stages.map((stage, idx) => (
        <div key={stage.id} className="flex items-center gap-2">
          {idx > 0 && (
            <span className="text-gray-400 text-lg" aria-hidden="true">→</span>
          )}
          <button
            onClick={() => navigate(`/pokemon/${stage.id}`)}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              String(stage.id) === String(currentId)
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-200 bg-gray-50 hover:border-gray-300'
            }`}
            aria-label={`View ${formatName(stage.name)}`}
            aria-current={String(stage.id) === String(currentId) ? 'true' : undefined}
          >
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${stage.id}.png`}
              alt={formatName(stage.name)}
              width={56}
              height={56}
              loading="lazy"
            />
            <span className="text-xs text-gray-600 capitalize font-medium">
              {formatName(stage.name)}
            </span>
          </button>
        </div>
      ))}
    </div>
  );
}
