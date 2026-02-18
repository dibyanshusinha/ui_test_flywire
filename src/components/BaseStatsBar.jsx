const STAT_CONFIG = {
  hp:               { label: 'HP',        color: '#EF5350' },
  attack:           { label: 'Attack',    color: '#FF8A65' },
  defense:          { label: 'Defense',   color: '#FFD54F' },
  'special-attack': { label: 'Sp. Atk',  color: '#5C6BC0' },
  'special-defense':{ label: 'Sp. Def',  color: '#66BB6A' },
  speed:            { label: 'Speed',     color: '#EC407A' },
};

const MAX_STAT = 255;

/**
 * Animated horizontal bar for a single base stat.
 * @param {{ statName: string, value: number }} props
 */
export default function BaseStatsBar({ statName, value }) {
  const config = STAT_CONFIG[statName] ?? { label: statName, color: '#90A4AE' };
  const pct = Math.min((value / MAX_STAT) * 100, 100).toFixed(1);

  return (
    <div className="flex items-center gap-3">
      <span className="w-20 text-sm text-gray-500 text-right shrink-0">
        {config.label}
      </span>
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, backgroundColor: config.color }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={MAX_STAT}
          aria-label={`${config.label}: ${value}`}
        />
      </div>
      <span className="w-8 text-sm font-medium text-gray-700 shrink-0">
        {value}
      </span>
    </div>
  );
}
