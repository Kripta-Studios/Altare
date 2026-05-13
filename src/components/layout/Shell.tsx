import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { useSettingsStore } from '../../store/useSettingsStore';

export function Shell() {
  const loadSettings = useSettingsStore((s) => s.loadSettings);
  const loaded = useSettingsStore((s) => s.loaded);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  if (!loaded) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100dvh',
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--accent)', fontWeight: 600 }}>Altare</div>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✝</div>
          <div>Introibo ad altare Dei</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <main>
        <Outlet />
      </main>
      <BottomNav />
    </>
  );
}
