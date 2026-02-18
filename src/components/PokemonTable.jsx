import { useState, useMemo } from 'react';
import PokemonRow from './PokemonRow';

function getStat(stats, name) {
  return stats?.find((s) => s.stat.name === name)?.base_stat ?? 0;
}

/** Chevron icon for sort direction */
function SortIcon({ column, sort }) {
  if (sort.column !== column) {
    return <span className="ml-1 text-gray-300 text-xs">↕</span>;
  }
  return (
    <span className="ml-1 text-blue-500 text-xs">
      {sort.direction === 'asc' ? '↑' : '↓'}
    </span>
  );
}

/**
 * Full Pokémon table with sortable columns.
 * @param {{ pokemon: object[] }} props
 */
export default function PokemonTable({ pokemon }) {
  const [sort, setSort] = useState({ column: null, direction: 'asc' });

  function toggleSort(column) {
    setSort((prev) =>
      prev.column === column
        ? { column, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { column, direction: 'asc' },
    );
  }

  const sorted = useMemo(() => {
    if (!sort.column) return pokemon;
    return [...pokemon].sort((a, b) => {
      let av, bv;
      const dir = sort.direction === 'asc' ? 1 : -1;
      switch (sort.column) {
        case 'name':
          return dir * a.name.localeCompare(b.name);
        case 'hp':
          av = getStat(a.stats, 'hp');
          bv = getStat(b.stats, 'hp');
          return dir * (av - bv);
        case 'speed':
          av = getStat(a.stats, 'speed');
          bv = getStat(b.stats, 'speed');
          return dir * (av - bv);
        case 'baseXP':
          av = a.base_experience ?? 0;
          bv = b.base_experience ?? 0;
          return dir * (av - bv);
        default:
          return 0;
      }
    });
  }, [pokemon, sort]);

  const thClass =
    'py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider select-none';
  const thSortable = `${thClass} cursor-pointer hover:text-gray-800 transition-colors`;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full" aria-label="Pokémon list">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th
                className={thSortable}
                onClick={() => toggleSort('name')}
                aria-sort={sort.column === 'name' ? sort.direction + 'ending' : 'none'}
              >
                Pokémon <SortIcon column="name" sort={sort} />
              </th>
              <th className={thClass}>Type</th>
              <th
                className={`${thSortable} text-center`}
                onClick={() => toggleSort('hp')}
                aria-sort={sort.column === 'hp' ? sort.direction + 'ending' : 'none'}
              >
                HP <SortIcon column="hp" sort={sort} />
              </th>
              <th
                className={`${thSortable} text-center`}
                onClick={() => toggleSort('speed')}
                aria-sort={sort.column === 'speed' ? sort.direction + 'ending' : 'none'}
              >
                Speed <SortIcon column="speed" sort={sort} />
              </th>
              <th
                className={thSortable}
                onClick={() => toggleSort('baseXP')}
                aria-sort={sort.column === 'baseXP' ? sort.direction + 'ending' : 'none'}
              >
                Primary Ability <SortIcon column="baseXP" sort={sort} />
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((p) => (
              <PokemonRow key={p.id} pokemon={p} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
