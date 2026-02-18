import { useNavigate } from 'react-router-dom';
import TypeBadge from './TypeBadge';

function getStat(stats, name) {
  return stats?.find((s) => s.stat.name === name)?.base_stat ?? '—';
}

function formatName(name) {
  return name.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
}

/**
 * A single row in the Pokémon table.
 * @param {{ pokemon: object }} props
 */
export default function PokemonRow({ pokemon }) {
  const navigate = useNavigate();
  const primaryAbility = pokemon.abilities.find((a) => !a.is_hidden)?.ability.name ?? '—';
  const hp = getStat(pokemon.stats, 'hp');
  const speed = getStat(pokemon.stats, 'speed');

  return (
    <tr
      onClick={() => navigate(`/pokemon/${pokemon.id}`)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') navigate(`/pokemon/${pokemon.id}`);
      }}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${formatName(pokemon.name)}`}
      className="border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors focus:outline-none focus:bg-blue-50"
    >
      {/* Sprite + Name + Base XP */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <img
            src={pokemon.sprites.front_default}
            alt={formatName(pokemon.name)}
            width={48}
            height={48}
            className="shrink-0"
            loading="lazy"
          />
          <div>
            <p className="font-semibold text-gray-800 leading-tight">
              {formatName(pokemon.name)}
            </p>
            <p className="text-xs text-gray-400">
              Base XP: {pokemon.base_experience ?? '—'}
            </p>
          </div>
        </div>
      </td>

      {/* Types */}
      <td className="py-3 px-4">
        <div className="flex flex-wrap gap-1">
          {pokemon.types.map((t) => (
            <TypeBadge key={t.type.name} type={t.type.name} />
          ))}
        </div>
      </td>

      {/* HP */}
      <td className="py-3 px-4 text-center text-gray-700 font-medium">{hp}</td>

      {/* Speed */}
      <td className="py-3 px-4 text-center text-gray-700 font-medium">{speed}</td>

      {/* Primary Ability */}
      <td className="py-3 px-4 text-gray-600 capitalize">{primaryAbility}</td>
    </tr>
  );
}
