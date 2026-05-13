import { useState, useEffect } from 'react';
import { BilingualText } from '../components/ui/BilingualText';

interface Prayer {
  id: string;
  titleLatin: string;
  titleEnglish: string;
  occasions: string[];
  latin: string;
  english: string;
}

export default function Prayers() {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function loadPrayers() {
      try {
        const res = await fetch('/data/prayers/index.json');
        if (res.ok) {
          const data = await res.json();
          setPrayers(data);
        }
      } catch (err) {
        console.error('Failed to load prayers', err);
      } finally {
        setLoading(false);
      }
    }
    loadPrayers();
  }, []);

  const occasions = ['all', 'morning', 'evening', 'marian', 'before-confession', 'before-mass', 'in-temptation'];

  const filtered = filter === 'all' 
    ? prayers 
    : prayers.filter(p => p.occasions.includes(filter));

  return (
    <div className="page">
      <div className="page-header animate-fade-in">
        <h1 style={{ marginBottom: 4 }}>Prayers</h1>
        <p className="page-subtitle">Traditional Devotions</p>
      </div>
      
      <div className="chip-scroll animate-slide-up" style={{ marginBottom: 16 }}>
        {occasions.map(occ => (
          <button 
            key={occ}
            className={`chip ${filter === occ ? 'active' : ''}`}
            onClick={() => setFilter(occ)}
            style={{ border: 'none', cursor: 'pointer' }}
          >
            {occ.replace('-', ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading...</div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {filtered.map((prayer) => {
            const isExpanded = expandedId === prayer.id;
            return (
              <div key={prayer.id} className="card animate-slide-up" style={{ transition: 'all 0.3s' }}>
                <div 
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                  onClick={() => setExpandedId(isExpanded ? null : prayer.id)}
                >
                  <div>
                    <h3 style={{ margin: '0 0 4px', fontSize: '1.1rem', color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>
                      {prayer.titleEnglish}
                    </h3>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--text-secondary)', fontStyle: 'italic', margin: 0 }} lang="la">
                      {prayer.titleLatin}
                    </p>
                  </div>
                  <div style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>
                    {isExpanded ? '−' : '+'}
                  </div>
                </div>

                {isExpanded && (
                  <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }} className="animate-fade-in">
                    <BilingualText 
                      latin={prayer.latin}
                      english={prayer.english}
                      dropCap={true}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
