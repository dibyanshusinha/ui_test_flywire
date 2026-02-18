/** @type {Record<string, {bg: string, text: string, icon: string}>} */
const TYPE_STYLES = {
  normal:   { bg: '#A8A8A8', text: '#fff', icon: '⭐' },
  fire:     { bg: '#FF6B35', text: '#fff', icon: '🔥' },
  water:    { bg: '#4488FF', text: '#fff', icon: '💧' },
  grass:    { bg: '#4CAF50', text: '#fff', icon: '🌿' },
  electric: { bg: '#FFD700', text: '#333', icon: '⚡' },
  ice:      { bg: '#40C4FF', text: '#333', icon: '❄️' },
  fighting: { bg: '#D32F2F', text: '#fff', icon: '🥊' },
  poison:   { bg: '#9C27B0', text: '#fff', icon: '☠️' },
  ground:   { bg: '#D4A54A', text: '#fff', icon: '🌍' },
  flying:   { bg: '#7986CB', text: '#fff', icon: '🪶' },
  psychic:  { bg: '#EC407A', text: '#fff', icon: '🔮' },
  bug:      { bg: '#8BC34A', text: '#fff', icon: '🐛' },
  rock:     { bg: '#8D6E63', text: '#fff', icon: '🪨' },
  ghost:    { bg: '#7B1FA2', text: '#fff', icon: '👻' },
  dragon:   { bg: '#3949AB', text: '#fff', icon: '🐉' },
  dark:     { bg: '#4E342E', text: '#fff', icon: '🌑' },
  steel:    { bg: '#90A4AE', text: '#fff', icon: '⚙️' },
  fairy:    { bg: '#F06292', text: '#fff', icon: '✨' },
};

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * Two variants:
 *  - chip (default): colored circle icon + plain text label outside — used in table view
 *  - pill: colored rounded-rect containing emoji + type name — used in detail view
 *
 * @param {{ type: string, size?: 'sm' | 'md', iconOnly?: boolean, variant?: 'chip' | 'pill' }} props
 */
export default function TypeBadge({ type, size = 'sm', iconOnly = false, variant = 'chip' }) {
  const style = TYPE_STYLES[type] ?? { bg: '#A8A8A8', text: '#fff', icon: '⭕' };

  if (variant === 'pill') {
    const pillSize = size === 'md' ? 'px-3 py-1 text-sm gap-1.5' : 'px-2 py-0.5 text-xs gap-1';
    return (
      <span
        className={`inline-flex items-center rounded-md border border-gray-300 text-gray-700 font-medium ${pillSize}`}
      >
        <span aria-hidden="true">{style.icon}</span>
        {capitalize(type)}
      </span>
    );
  }

  // chip variant: circle + optional label outside
  const circleSize = size === 'md' ? 'w-7 h-7 text-base' : 'w-5 h-5 text-xs';
  const labelSize  = size === 'md' ? 'text-sm font-semibold' : 'text-xs font-medium';

  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={`inline-flex items-center justify-center rounded-full shrink-0 ${circleSize}`}
        style={{ backgroundColor: style.bg }}
        aria-hidden="true"
      >
        {style.icon}
      </span>
      {!iconOnly && (
        <span className={`text-gray-700 ${labelSize}`}>{capitalize(type)}</span>
      )}
    </span>
  );
}
