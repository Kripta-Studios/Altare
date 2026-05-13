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
  let isFallbackEnglish = false;

  if (typeof vernacular === 'object' && vernacular !== null) {
    const nativeText = vernacular[vernacularLang];
    const enText = vernacular['en'] || '';
    // Use native translation if it exists AND is different from English (real translation)
    if (nativeText && nativeText !== enText) {
      vernacularText = nativeText;
    } else {
      vernacularText = enText;
      if (vernacularLang !== 'en' && enText) {
        isFallbackEnglish = true;
      }
    }
  } else if (typeof vernacular === 'string') {
    vernacularText = vernacular;
  } else if (english) {
    vernacularText = english;
    if (vernacularLang !== 'en') {
      isFallbackEnglish = true;
    }
  }

  const latinText = latin || '';

  // When text is fallback English, mark it with lang="en" so the browser
  // auto-translate correctly identifies it as needing translation.
  // Latin text is always marked with translate="no" to protect it.
  const vernacularLangAttr = isFallbackEnglish ? 'en' : vernacularLang;

  if (displayLang === 'la') {
    return (
      <div className={`${className} ${dropCap ? `drop-cap ${seasonColor ? `season-${seasonColor}` : ''}` : ''}`}>
        <p lang="la" translate="no">{latinText}</p>
      </div>
    );
  }

  if (displayLang === 'vernacular') {
    return (
      <div className={`${className} ${dropCap ? 'drop-cap' : ''}`}>
        <p lang={vernacularLangAttr}>{vernacularText}</p>
      </div>
    );
  }

  // Both languages side by side
  return (
    <div className={`bilingual-grid ${className}`}>
      <div className={`latin-col ${dropCap ? `drop-cap ${seasonColor ? `season-${seasonColor}` : ''}` : ''}`}>
        <p lang="la" translate="no">{latinText}</p>
      </div>
      <div className="vernacular-col">
        <p lang={vernacularLangAttr}>{vernacularText}</p>
      </div>
    </div>
  );
}
