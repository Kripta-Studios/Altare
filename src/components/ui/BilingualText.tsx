import { useSettingsStore } from '../../store/useSettingsStore';

interface BilingualTextProps {
  latin: string | null;
  vernacular?: Record<string, string> | string | null;
  english?: string | null; // For backwards compatibility during transition
  className?: string;
  dropCap?: boolean;
  seasonColor?: string;
}

export function BilingualText({ latin, vernacular, english, className = '', dropCap = false, seasonColor }: BilingualTextProps) {
  const displayLang = useSettingsStore((s) => s.displayLang);
  const vernacularLang = useSettingsStore((s) => s.vernacularLang);

  // Extract the localized string based on the preference, or fallback to English, or empty string.
  let vernacularText = '';
  if (typeof vernacular === 'object' && vernacular !== null) {
      vernacularText = vernacular[vernacularLang] || vernacular['en'] || '';
  } else if (typeof vernacular === 'string') {
      vernacularText = vernacular;
  } else if (english) {
      vernacularText = english;
  }
  
  const latinText = latin || '';

  if (displayLang === 'la') {
    return (
      <div className={`${className} ${dropCap ? `drop-cap ${seasonColor ? `season-${seasonColor}` : ''}` : ''}`}>
        <p lang="la">{latinText}</p>
      </div>
    );
  }

  if (displayLang === 'vernacular') {
    return (
      <div className={`${className} ${dropCap ? 'drop-cap' : ''}`}>
        <p>{vernacularText}</p>
      </div>
    );
  }

  // Both languages side by side
  return (
    <div className={`bilingual-grid ${className}`}>
      <div className={`latin-col ${dropCap ? `drop-cap ${seasonColor ? `season-${seasonColor}` : ''}` : ''}`}>
        <p lang="la">{latinText}</p>
      </div>
      <div className="english-col">
        <p>{vernacularText}</p>
      </div>
    </div>
  );
}
