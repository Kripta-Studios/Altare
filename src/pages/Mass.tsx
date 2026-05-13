import { useEffect, useState, useMemo } from 'react';
import { BilingualText } from '../components/ui/BilingualText';
import { getLiturgicalDay, getToday } from '../lib/calendar';

interface ProperData {
  id: string;
  titleLatin: string;
  titleVernacular: Record<string, string>;
  introit: { la: string } & Record<string, string>;
  collect: ({ la: string } & Record<string, string>)[];
  epistle: { la: string } & Record<string, string>;
  gradual: { la: string } & Record<string, string>;
  gospel: { la: string } & Record<string, string>;
  offertory: { la: string } & Record<string, string>;
  secret: ({ la: string } & Record<string, string>)[];
  communionAntiphon: { la: string } & Record<string, string>;
  postcommunion: ({ la: string } & Record<string, string>)[];
}

import { useSettingsStore } from '../store/useSettingsStore';

export default function Mass() {
  const today = useMemo(() => getToday(), []);
  const litDay = useMemo(() => getLiturgicalDay(today), [today]);
  const vernacularLang = useSettingsStore((s) => s.vernacularLang);
  
  const [proper, setProper] = useState<ProperData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMass() {
      try {
        setLoading(true);
        // The parser lowercased the IDs
        const properId = litDay.properId.toLowerCase();
        
        // Fetch the proper for today
        const properRes = await fetch(`/data/propers/${properId}.json`);
        if (!properRes.ok) {
          throw new Error(`Could not load proper for ${litDay.properId}`);
        }
        const properData = await properRes.json();
        setProper(properData);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadMass();
  }, [litDay.properId]);

  if (loading) {
    return (
      <div className="page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ fontFamily: 'var(--font-ui)', color: 'var(--text-muted)' }}>Loading Missal...</p>
      </div>
    );
  }

  if (error || !proper) {
    return (
      <div className="page">
        <div className="page-header">
          <h1>Holy Mass</h1>
          <p className="page-subtitle">Error loading texts</p>
        </div>
        <div className="card" style={{ color: 'var(--accent)' }}>
          <p>{error || 'Proper not found for today.'}</p>
        </div>
      </div>
    );
  }

  // Helper to safely format Divinum Officium text which might contain newlines and markers like "v." or "!"
  const formatDOText = (text: string) => {
    if (!text) return '';
    return text.split('\n')
      .filter(line => !line.startsWith('!')) // Remove rubric markers for now
      .join('\n');
  };

  return (
    <div className="page">
      <div className={`season-band ${litDay.color}`} style={{ borderRadius: '0 0 8px 8px', marginBottom: '1rem' }} />

      <div className="page-header animate-fade-in">
        <h1 style={{ marginBottom: 4 }}>{proper.titleVernacular?.[vernacularLang] || proper.titleVernacular?.['en'] || proper.titleLatin}</h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--text-secondary)', fontStyle: 'italic', margin: 0 }} lang="la">
          {proper.titleLatin}
        </p>
      </div>

      <div className="card animate-slide-up" style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
          Introitus
        </h2>
        <BilingualText 
          latin={formatDOText(proper.introit?.la)}
          vernacular={proper.introit}
          dropCap={true}
          seasonColor={litDay.color}
        />
      </div>

      <div className="card animate-slide-up" style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
          Oratio
        </h2>
        {proper.collect?.map((c, i) => (
          <div key={i} style={{ marginBottom: i < proper.collect.length - 1 ? '1rem' : 0 }}>
            <BilingualText 
              latin={formatDOText(c.la)}
              vernacular={c}
              dropCap={i === 0}
            />
          </div>
        ))}
      </div>

      <div className="card animate-slide-up" style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
          Lectio
        </h2>
        <BilingualText 
          latin={formatDOText(proper.epistle?.la)}
          vernacular={proper.epistle}
          dropCap={true}
        />
      </div>

      <div className="card animate-slide-up" style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
          Graduale
        </h2>
        <BilingualText 
          latin={formatDOText(proper.gradual?.la)}
          vernacular={proper.gradual}
          dropCap={true}
        />
      </div>

      <div className="card animate-slide-up" style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
          Evangelium
        </h2>
        <BilingualText 
          latin={formatDOText(proper.gospel?.la)}
          vernacular={proper.gospel}
          dropCap={true}
        />
      </div>

      <div className="card animate-slide-up" style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
          Offertorium
        </h2>
        <BilingualText 
          latin={formatDOText(proper.offertory?.la)}
          vernacular={proper.offertory}
          dropCap={true}
        />
      </div>

      <div className="card animate-slide-up" style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
          Secreta
        </h2>
        {proper.secret?.map((s, i) => (
          <div key={i} style={{ marginBottom: i < proper.secret.length - 1 ? '1rem' : 0 }}>
            <BilingualText 
              latin={formatDOText(s.la)}
              vernacular={s}
              dropCap={i === 0}
            />
          </div>
        ))}
      </div>

      <div className="card animate-slide-up" style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
          Communio
        </h2>
        <BilingualText 
          latin={formatDOText(proper.communionAntiphon?.la)}
          vernacular={proper.communionAntiphon}
          dropCap={true}
        />
      </div>

      <div className="card animate-slide-up" style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
          Postcommunio
        </h2>
        {proper.postcommunion?.map((p, i) => (
          <div key={i} style={{ marginBottom: i < proper.postcommunion.length - 1 ? '1rem' : 0 }}>
            <BilingualText 
              latin={formatDOText(p.la)}
              vernacular={p}
              dropCap={i === 0}
            />
          </div>
        ))}
      </div>
      
      <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', fontStyle: 'italic' }}>
          *The Ordinary of the Mass (Ordo Missae) is currently rendered dynamically alongside the propers.*
        </p>
      </div>
    </div>
  );
}
