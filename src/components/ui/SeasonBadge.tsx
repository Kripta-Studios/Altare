import type { Season, LiturgicalColor } from '../../lib/calendar';

interface SeasonBadgeProps {
  season: Season;
  color: LiturgicalColor;
  size?: 'small' | 'medium';
}

const seasonLabels: Record<Season, string> = {
  Advent: 'Advent',
  Christmas: 'Christmas',
  Epiphany: 'Epiphany',
  Septuagesima: 'Septuagesima',
  Lent: 'Lent',
  Passiontide: 'Passiontide',
  HolyWeek: 'Holy Week',
  Easter: 'Easter',
  Pentecost: 'Pentecost',
  OrdinaryTime: 'Ordinary Time',
};

const colorMap: Record<LiturgicalColor, string> = {
  purple: 'var(--season-purple)',
  green: 'var(--season-green)',
  red: 'var(--season-red)',
  white: 'var(--season-white)',
  black: 'var(--season-black)',
  rose: 'var(--season-rose)',
};

export function SeasonBadge({ season, color, size = 'medium' }: SeasonBadgeProps) {
  const bgColor = colorMap[color];
  const isSmall = size === 'small';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: isSmall ? '3px 10px' : '5px 14px',
        borderRadius: '20px',
        background: bgColor,
        color: color === 'black' ? '#fff' : color === 'white' ? '#2C1A0E' : '#F0E6D3',
        fontFamily: 'var(--font-ui)',
        fontSize: isSmall ? '0.65rem' : '0.72rem',
        fontWeight: 600,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
      }}
    >
      <span style={{
        width: isSmall ? 6 : 8,
        height: isSmall ? 6 : 8,
        borderRadius: '50%',
        background: 'currentColor',
        opacity: 0.7,
      }} />
      {seasonLabels[season]}
    </span>
  );
}
