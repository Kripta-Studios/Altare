import { useState, useEffect, useMemo } from 'react';
import { Icon } from '../components/ui/Icon';
import { useTranslation } from '../lib/i18n';
import { useSettingsStore } from '../store/useSettingsStore';

const bookMap: Record<string, string> = {
  'JUAN': 'John', 'JOHN': 'John', 'GV': 'John', 'JOH': 'John', 'JN': 'John', 'IOANNEM': 'John',
  'LUCAS': 'Luke', 'LUKE': 'Luke', 'LC': 'Luke', 'LK': 'Luke',
  'MATEO': 'Matthew', 'MATTHEW': 'Matthew', 'MT': 'Matthew',
  'MARCOS': 'Mark', 'MARK': 'Mark', 'MC': 'Mark', 'MK': 'Mark'
};

function normalizeSearch(q: string): string {
  const parts = q.split(' ');
  if (parts.length > 0) {
    const book = parts[0].normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
    if (bookMap[book]) {
      parts[0] = bookMap[book];
      return parts.join(' ');
    }
  }
  return q;
}

interface MeditationData {
  [citation: string]: {
    [lang: string]: string;
  };
}

export default function Meditations() {
  const [data, setData] = useState<MeditationData>({});
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const vernacularLang = useSettingsStore(s => s.vernacularLang);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/data/meditations.json');
        if (res.ok) {
          setData(await res.json());
        }
      } catch (e) {
        console.error('Failed to load meditations', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredCitations = useMemo(() => {
    const rawQ = search.toLowerCase().trim();
    if (!rawQ) return Object.keys(data).slice(0, 20);
    
    const normalizedQ = normalizeSearch(rawQ).toLowerCase();
    
    return Object.keys(data).filter(cit => {
      const normalizedCit = cit.toLowerCase();
      if (normalizedCit.includes(normalizedQ) || normalizedCit.includes(rawQ)) return true;
      // Also check content
      const entry = data[cit];
      return Object.values(entry).some(text => text.toLowerCase().includes(rawQ));
    }).sort((a, b) => a.localeCompare(b));
  }, [data, search]);

  return (
    <div className="page">
      <div className="page-header animate-fade-in">
        <h1 style={{ marginBottom: 4 }}>{t("Papal Meditations")}</h1>
        <p className="page-subtitle">{t("Words of the Popes Library")}</p>
      </div>

      <div className="card" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem' }}>
        <Icon name="scroll" size={20} color="var(--accent)" />
        <input 
          type="text" 
          placeholder={t("Search by book, verse or text...")} 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-ui)',
            fontSize: '1rem'
          }}
        />
        {search && (
          <button onClick={() => setSearch('')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            ✕
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <Icon name="scroll" className="animate-spin" size={32} color="var(--accent-soft)" />
          <p style={{ marginTop: 12, color: 'var(--text-muted)' }}>{t("Loading Library...")}</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {filteredCitations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              <Icon name="info" size={48} style={{ opacity: 0.2, marginBottom: 16 }} />
              <p>{t("No meditations found for this search.")}</p>
            </div>
          ) : (
            filteredCitations.map(cit => (
              <div key={cit} className="card animate-slide-up" style={{ borderLeft: '4px solid var(--accent)' }}>
                <h3 style={{ 
                  fontFamily: 'var(--font-display)', 
                  color: 'var(--accent)', 
                  fontSize: '1.1rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  {cit}
                </h3>
                <p style={{ 
                  fontFamily: 'var(--font-body)', 
                  fontSize: '0.95rem', 
                  lineHeight: '1.6',
                  color: 'var(--text-main)',
                  fontStyle: 'italic',
                  whiteSpace: 'pre-wrap'
                }}>
                  {data[cit][vernacularLang] || data[cit]['es'] || data[cit]['en'] || Object.values(data[cit])[0]}
                </p>
                <div style={{ marginTop: '0.75rem', fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                  Vatican News · {Object.keys(data[cit]).map(l => l.toUpperCase()).join(', ')}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
