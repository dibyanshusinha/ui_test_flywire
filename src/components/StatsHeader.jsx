import TypeBadge from './TypeBadge';

function getStat(stats, name) {
  return stats?.find((s) => s.stat.name === name)?.base_stat ?? 0;
}

function powerScore(p) {
  return getStat(p.stats, 'hp') + getStat(p.stats, 'speed') + (p.base_experience ?? 0);
}

/**
 * Aggregated stats header: total count, avg HP, type distribution, most powerful.
 * @param {{ pokemon: object[], totalCount: number }} props
 */
export default function StatsHeader({ pokemon, totalCount }) {
  if (!pokemon.length) return null;

  // Average HP of current page
  const avgHP =
    pokemon.reduce((sum, p) => sum + getStat(p.stats, 'hp'), 0) / pokemon.length;

  // Type distribution: % of current-page Pokémon that have each type
  const typeCounts = {};
  for (const p of pokemon) {
    const seen = new Set();
    for (const t of p.types) {
      const name = t.type.name;
      if (!seen.has(name)) {
        typeCounts[name] = (typeCounts[name] ?? 0) + 1;
        seen.add(name);
      }
    }
  }
  const typeEntries = Object.entries(typeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([type, count]) => ({
      type,
      pct: Math.round((count / pokemon.length) * 100),
    }));

  // Most powerful: HP + Speed + base_experience
  const strongest = pokemon.reduce(
    (best, p) => (powerScore(p) > powerScore(best) ? p : best),
    pokemon[0],
  );
  const strongestName =
    strongest.name.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
  const strongestScore = powerScore(strongest);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Pokémon</p>
        <p className="text-3xl font-bold text-gray-800">{totalCount.toLocaleString()}</p>
        <p className="text-xs text-gray-400 mt-1">in collection</p>
      </div>

      {/* Average HP */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Average HP</p>
        <p className="text-3xl font-bold text-gray-800">{avgHP.toFixed(1)}</p>
        <p className="text-xs text-gray-400 mt-1">points</p>
      </div>

      {/* Type Distribution */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Type Distribution</p>
        <div className="flex flex-wrap justify-center gap-3">
          {typeEntries.map(({ type, pct }) => (
            <span key={type} className="flex items-center gap-1">
              <TypeBadge type={type} size="sm" iconOnly />
              <span className="text-xs font-medium text-gray-500">{pct}%</span>
            </span>
          ))}
        </div>
      </div>

      {/* Most Powerful */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Most Powerful</p>
        <p className="text-lg font-bold text-gray-800 leading-tight">{strongestName}</p>
        <p className="text-xs text-gray-400 mt-1">Score: {strongestScore}</p>
      </div>
    </div>
  );
}
