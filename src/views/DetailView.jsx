import { useParams, useNavigate } from 'react-router-dom';
import { usePokemonDetail } from '../hooks/usePokemonDetail';
import TypeBadge from '../components/TypeBadge';
import BaseStatsBar from '../components/BaseStatsBar';
import EvolutionChain from '../components/EvolutionChain';
import MovesList from '../components/MovesList';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

/** Gradient per primary type for the header banner */
const TYPE_GRADIENTS = {
  normal:   'linear-gradient(135deg, #9E9E9E, #616161)',
  fire:     'linear-gradient(135deg, #FF8A65, #c0392b)',
  water:    'linear-gradient(135deg, #64B5F6, #1565C0)',
  grass:    'linear-gradient(135deg, #81C784, #2E7D32)',
  electric: 'linear-gradient(135deg, #FFF176, #F9A825)',
  ice:      'linear-gradient(135deg, #80DEEA, #0097A7)',
  fighting: 'linear-gradient(135deg, #EF9A9A, #B71C1C)',
  poison:   'linear-gradient(135deg, #CE93D8, #6A1B9A)',
  ground:   'linear-gradient(135deg, #FFCC80, #E65100)',
  flying:   'linear-gradient(135deg, #B39DDB, #311B92)',
  psychic:  'linear-gradient(135deg, #F48FB1, #880E4F)',
  bug:      'linear-gradient(135deg, #C5E1A5, #33691E)',
  rock:     'linear-gradient(135deg, #BCAAA4, #4E342E)',
  ghost:    'linear-gradient(135deg, #9575CD, #311B92)',
  dragon:   'linear-gradient(135deg, #7986CB, #1A237E)',
  dark:     'linear-gradient(135deg, #78909C, #263238)',
  steel:    'linear-gradient(135deg, #90A4AE, #37474F)',
  fairy:    'linear-gradient(135deg, #F48FB1, #AD1457)',
};

function formatName(name) {
  return name.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
}

function getStat(stats, name) {
  return stats?.find((s) => s.stat.name === name)?.base_stat ?? 0;
}

const STAT_ORDER = [
  'hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed',
];

export default function DetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pokemon, evolutionChain, isLoading, isError, error } = usePokemonDetail(id);

  if (isLoading) return <LoadingSpinner message={`Loading Pokémon #${id}…`} />;
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorMessage error={error} onRetry={() => navigate(0)} />
      </div>
    );
  }
  if (!pokemon) return null;

  const primaryType = pokemon.types[0]?.type.name ?? 'normal';
  const gradient = TYPE_GRADIENTS[primaryType] ?? TYPE_GRADIENTS.normal;
  const artwork = pokemon.sprites.other?.['official-artwork']?.front_default;

  return (
    <main className="min-h-screen bg-white">
      {/* Back button */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm font-bold text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 transition-colors"
          aria-label="Go back"
        >
          <span aria-hidden="true">←</span>
          <span>Back</span>
        </button>
      </div>

      {/* Hero header */}
      <div
        className="relative overflow-hidden"
        style={{ background: gradient }}
        aria-label={`${formatName(pokemon.name)} header`}
      >
        <div className="max-w-4xl mx-auto px-6 py-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white drop-shadow">
              {formatName(pokemon.name)}
            </h1>
            <p className="text-white/80 mt-1 text-lg">
              #{String(pokemon.id).padStart(3, '0')}
            </p>
          </div>
          {artwork && (
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-white/20 flex items-center justify-center shrink-0 shadow-lg">
              <img
                src={artwork}
                alt={`Official artwork of ${formatName(pokemon.name)}`}
                className="w-full h-full object-contain p-2"
              />
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* ROW 1: Type / Abilities / Physical Traits  |  Base Stats */}
        <div className="flex flex-col lg:flex-row lg:divide-x divide-gray-100">

          {/* Left half */}
          <div className="flex-1 lg:pr-8 flex flex-col divide-y divide-gray-100">
            {/* Type */}
            <section className="py-5">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                Type
              </h2>
              <div className="flex flex-wrap gap-2">
                {pokemon.types.map((t) => (
                  <TypeBadge key={t.type.name} type={t.type.name} size="md" variant="pill" />
                ))}
              </div>
            </section>

            {/* Abilities */}
            <section className="py-5">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                Abilities
              </h2>
              <div className="flex flex-wrap gap-2">
                {pokemon.abilities.map(({ ability, is_hidden }) => (
                  <span
                    key={ability.name}
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${
                      is_hidden
                        ? 'border-purple-300 bg-purple-50 text-purple-700'
                        : 'border-gray-300 bg-gray-100 text-gray-700'
                    }`}
                  >
                    {formatName(ability.name)}
                    {is_hidden && (
                      <span className="ml-1 text-xs text-purple-400">(Hidden)</span>
                    )}
                  </span>
                ))}
              </div>
            </section>

            {/* Physical Traits */}
            <section className="py-5">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                Physical Traits
              </h2>
              <div className="flex gap-8">
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {(pokemon.height / 10).toFixed(1)}m
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">Height</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {(pokemon.weight / 10).toFixed(1)}kg
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">Weight</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {pokemon.base_experience ?? '—'}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">Base Exp</p>
                </div>
              </div>
            </section>
          </div>

          {/* Right half — Base Stats */}
          <div className="flex-1 lg:pl-8">
            <section className="py-5">
              <h2 className="text-sm font-bold text-gray-700 mb-4">
                Base Stats
              </h2>
              <div className="flex flex-col gap-3">
                {STAT_ORDER.map((statName) => {
                  const value = getStat(pokemon.stats, statName);
                  return (
                    <BaseStatsBar key={statName} statName={statName} value={value} />
                  );
                })}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
                <span className="text-gray-400">Total</span>
                <span className="font-bold text-gray-800">
                  {STAT_ORDER.reduce((sum, name) => sum + getStat(pokemon.stats, name), 0)}
                </span>
              </div>
            </section>
          </div>

        </div>

        {/* ROW 2: Evolution Chain — full width */}
        {evolutionChain && (
          <section className="py-5 border-t border-gray-100">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
              Evolution Chain
            </h2>
            <EvolutionChain chain={evolutionChain} currentId={id} />
          </section>
        )}

        {/* ROW 3: Moves — full width */}
        {pokemon.moves.length > 0 && (
          <section className="py-5 border-t border-gray-100">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
              Moves
            </h2>
            <MovesList moves={pokemon.moves} />
          </section>
        )}

      </div>
    </main>
  );
}
