import { useSettingsStore } from '../store/useSettingsStore';
import type { ThemeName, TextSize, DisplayLang, VernacularLang } from '../store/useSettingsStore';
import { useTranslation } from '../lib/i18n';

export default function Settings() {
  const { 
    theme, setTheme, 
    textSize, setTextSize,
    displayLang, setDisplayLang,
    vernacularLang, setVernacularLang
  } = useSettingsStore();
  const { t } = useTranslation();

  return (
    <div className="page">
      <div className="page-header animate-fade-in">
        <h1 style={{ marginBottom: 4 }}>{t("Settings")}</h1>
        <p className="page-subtitle">{t("Preferences & Configuration")}</p>
      </div>
      
      <div className="card animate-slide-up" style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: 12 }}>{t("Appearance")}</h2>
        
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 8 }}>{t("Theme")}</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['parchment', 'white', 'walnut'] as ThemeName[]).map(t => (
              <button 
                key={t}
                onClick={() => setTheme(t)}
                style={{
                  flex: 1,
                  padding: '8px 0',
                  borderRadius: 6,
                  border: `2px solid ${theme === t ? 'var(--accent)' : 'var(--border)'}`,
                  background: t === 'parchment' ? '#F5EDDA' : t === 'white' ? '#FFFFFF' : '#1C1410',
                  color: t === 'walnut' ? '#F0E6D3' : '#2C1A0E',
                  textTransform: 'capitalize',
                  fontFamily: 'var(--font-ui)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 8 }}>{t("Text Size")}</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['small', 'medium', 'large'] as TextSize[]).map(s => (
              <button 
                key={s}
                onClick={() => setTextSize(s)}
                style={{
                  flex: 1,
                  padding: '8px 0',
                  borderRadius: 6,
                  border: `1px solid ${textSize === s ? 'var(--accent)' : 'var(--border)'}`,
                  background: textSize === s ? 'var(--accent)' : 'var(--bg-secondary)',
                  color: textSize === s ? '#fff' : 'var(--text-primary)',
                  textTransform: 'capitalize',
                  fontFamily: 'var(--font-ui)',
                  fontSize: s === 'small' ? '0.8rem' : s === 'medium' ? '1rem' : '1.2rem',
                  cursor: 'pointer'
                }}
              >
                Aa
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 8 }}>{t("Translation Language")}</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              { id: 'en', label: 'English' },
              { id: 'es', label: 'Español' },
              { id: 'de', label: 'Deutsch' },
              { id: 'fr', label: 'Français' },
              { id: 'it', label: 'Italiano' }
            ].map(l => (
              <button 
                key={l.id}
                onClick={() => setVernacularLang(l.id as VernacularLang)}
                style={{
                  flex: '1 1 30%',
                  padding: '8px 0',
                  borderRadius: 6,
                  border: `1px solid ${vernacularLang === l.id ? 'var(--accent)' : 'var(--border)'}`,
                  background: vernacularLang === l.id ? 'var(--accent)' : 'var(--bg-secondary)',
                  color: vernacularLang === l.id ? '#fff' : 'var(--text-primary)',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 8 }}>{t("Display Layout")}</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { id: 'la', label: 'Latin Only' },
              { id: 'both', label: 'Bilingual' },
              { id: 'vernacular', label: 'Translation Only' }
            ].map(l => (
              <button 
                key={l.id}
                onClick={() => setDisplayLang(l.id as DisplayLang)}
                style={{
                  flex: 1,
                  padding: '8px 0',
                  borderRadius: 6,
                  border: `1px solid ${displayLang === l.id ? 'var(--accent)' : 'var(--border)'}`,
                  background: displayLang === l.id ? 'var(--accent)' : 'var(--bg-secondary)',
                  color: displayLang === l.id ? '#fff' : 'var(--text-primary)',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
