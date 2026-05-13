import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getLiturgicalDay, formatLiturgicalDate, getToday } from '../lib/calendar';
import { SeasonBadge } from '../components/ui/SeasonBadge';
import { ProgressRing } from '../components/ui/ProgressRing';
import { useTranslation } from '../lib/i18n';
import { Icon } from '../components/ui/Icon';

const antiphonNames: Record<string, [string, string]> = {
  Alma: ['Alma Redémptoris Mater', 'Loving Mother of the Redeemer'],
  Ave: ['Ave Regína Cælórum', 'Hail, Queen of Heaven'],
  Regina: ['Regína Cæli', 'Queen of Heaven'],
  Salve: ['Salve Regína', 'Hail, Holy Queen'],
};

function getMysterySet(d: Date): string {
  const dow = d.getDay();
  if (dow === 2 || dow === 5) return 'Sorrowful Mysteries';
  if (dow === 0 || dow === 3) return 'Glorious Mysteries';
  return 'Joyful Mysteries';
}

function getColorVar(c: string) {
  const m: Record<string, string> = {
    purple: 'var(--season-purple)', green: 'var(--season-green)',
    red: 'var(--season-red)', white: 'var(--season-white)',
    black: 'var(--season-black)', rose: 'var(--season-rose)',
  };
  return m[c] || 'var(--accent)';
}

export default function Today() {
  const navigate = useNavigate();
  const today = useMemo(() => getToday(), []);
  const lit = useMemo(() => getLiturgicalDay(today), [today]);
  const dateStr = useMemo(() => formatLiturgicalDate(today), [today]);
  const daysToSun = (7 - today.getDay()) % 7 || 7;
  const aName = antiphonNames[lit.marianAntiphon];
  const { t } = useTranslation();

  return (
    <div className="page">
      <div className={`season-band ${lit.color}`} style={{ borderRadius: '0 0 8px 8px', marginBottom: '1rem' }} />
      <div className="page-header animate-fade-in">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <SeasonBadge season={lit.season} color={lit.color} />
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            {lit.isFirstFriday && <span style={{display:'flex', alignItems:'center', gap:4}}><Icon name="info" size={10} color="var(--season-red)" /> First Friday</span>}
            {lit.isFirstSaturday && <span style={{display:'flex', alignItems:'center', gap:4}}><Icon name="info" size={10} color="#3498db" /> First Saturday</span>}
            {lit.isEmberDay && <span style={{display:'flex', alignItems:'center', gap:4}}><Icon name="info" size={10} color="#e67e22" /> Ember Day</span>}
          </span>
        </div>
        <h1 style={{ marginBottom: 4 }}>{lit.titleEnglish} {/* Ideally we'd map this to vernacular too, but the calendar engine outputs English titles currently */}</h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--text-secondary)', fontStyle: 'italic', margin: 0 }} lang="la">{lit.titleLatin}</p>
        <p className="page-subtitle">{dateStr}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <Link to="/mass" style={{ textDecoration: 'none' }}>
          <div className="card animate-slide-up" style={{ cursor: 'pointer', minHeight: 120 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: getColorVar(lit.color), display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10, color: '#fff' }}>
              <Icon name="cross" size={20} />
            </div>
            <h3 style={{ fontSize: '0.85rem', margin: '0 0 4px', color: 'var(--text-primary)' }}>{t("Today's Mass")}</h3>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>{t("Follow the Propers")}</p>
          </div>
        </Link>
        <Link to="/prayers" style={{ textDecoration: 'none' }}>
          <div className="card animate-slide-up" style={{ cursor: 'pointer', minHeight: 120 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10, color: '#fff' }}>
                <Icon name="candle" size={20} />
              </div>
              <ProgressRing progress={0} size={36} strokeWidth={3} />
            </div>
            <h3 style={{ fontSize: '0.85rem', margin: '0 0 4px', color: 'var(--text-primary)' }}>{t("Daily Prayers")}</h3>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>{t("Start your rule")}</p>
          </div>
        </Link>
        <Link to="/rosary" style={{ textDecoration: 'none' }}>
          <div className="card animate-slide-up" style={{ cursor: 'pointer', minHeight: 120 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10, color: '#fff' }}>
              <Icon name="rosary" size={20} />
            </div>
            <h3 style={{ fontSize: '0.85rem', margin: '0 0 4px', color: 'var(--text-primary)' }}>{t("Holy Rosary")}</h3>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>{t(getMysterySet(today))}</p>
          </div>
        </Link>
        <div className="card animate-slide-up" onClick={() => navigate('/prayers')} style={{ minHeight: 120, cursor: 'pointer' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10, color: '#fff' }}>
            <Icon name="crown" size={20} />
          </div>
          <h3 style={{ fontSize: '0.85rem', margin: '0 0 4px', color: 'var(--text-primary)' }}>{aName?.[0]}</h3>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>{t("Tap to view prayers")}</p>
        </div>
      </div>

      <div className="card animate-slide-up" onClick={() => navigate('/mass')} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '1rem 1.25rem', marginBottom: 16, cursor: 'pointer' }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', border: `3px solid ${getColorVar(lit.color)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontFamily: 'var(--font-ui)', fontWeight: 700 }}>
          {today.getDay() === 0 ? 'SUN' : `${daysToSun}d`}
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 600, marginBottom: 2, color: 'var(--text-primary)' }}>
            {today.getDay() === 0 ? t('Sunday') : `${daysToSun} ${daysToSun !== 1 ? t('days until Sunday') : t('day until Sunday')}`}
          </div>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            {lit.hasGloria ? `✓ ${t('Gloria')}` : `✗ ${t('No Gloria')}`} · {lit.hasCredo ? `✓ ${t('Credo')}` : `✗ ${t('No Credo')}`}
          </div>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.6rem', color: 'var(--accent)', marginTop: 4 }}>{t("Tap to view today's Mass")}</div>
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '2rem 1rem', marginTop: '1rem' }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.1rem', fontStyle: 'italic', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }} lang="la">Introíbo ad altáre Dei.</p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>I will go unto the altar of God.</p>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.6rem', color: 'var(--text-muted)', margin: '12px 0 0', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Psalm 42:4</p>
      </div>
    </div>
  );
}
