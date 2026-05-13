import { create } from 'zustand';
import { db } from '../lib/db';

export type ThemeName = 'parchment' | 'white' | 'walnut';
export type TextSize = 'small' | 'medium' | 'large';
export type DisplayLang = 'la' | 'vernacular' | 'both';
export type VernacularLang = 'en' | 'es' | 'de' | 'fr' | 'it';
export type RubricYearSetting = '1962' | '1955' | 'pre-1955';
export type PenanceDiscipline = '1962' | '1917';

interface SettingsState {
  theme: ThemeName;
  textSize: TextSize;
  textDarkness: number;
  displayLang: DisplayLang;
  vernacularLang: VernacularLang;
  rubricYear: RubricYearSetting;
  penanceDiscipline: PenanceDiscipline;
  patronSaint: string;
  loaded: boolean;

  setTheme: (t: ThemeName) => void;
  setTextSize: (s: TextSize) => void;
  setTextDarkness: (d: number) => void;
  setDisplayLang: (l: DisplayLang) => void;
  setVernacularLang: (l: VernacularLang) => void;
  setRubricYear: (r: RubricYearSetting) => void;
  setPenanceDiscipline: (d: PenanceDiscipline) => void;
  setPatronSaint: (s: string) => void;
  loadSettings: () => Promise<void>;
}

async function persist(key: string, value: string) {
  try {
    await db.settings.put({ key, value });
  } catch { /* ignore db errors */ }
}

async function loadSetting(key: string, fallback: string): Promise<string> {
  try {
    const item = await db.settings.get(key);
    return item?.value ?? fallback;
  } catch {
    return fallback;
  }
}

export const useSettingsStore = create<SettingsState>((set) => ({
  theme: 'parchment',
  textSize: 'medium',
  textDarkness: 1,
  displayLang: 'both',
  vernacularLang: 'en',
  rubricYear: '1962',
  penanceDiscipline: '1962',
  patronSaint: '',
  loaded: false,

  setTheme: (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    persist('theme', theme);
    set({ theme });
  },

  setTextSize: (textSize) => {
    document.documentElement.setAttribute('data-text-size', textSize);
    persist('textSize', textSize);
    set({ textSize });
  },

  setTextDarkness: (textDarkness) => {
    document.documentElement.style.setProperty('--text-darkness', String(textDarkness));
    persist('textDarkness', String(textDarkness));
    set({ textDarkness });
  },

  setDisplayLang: (displayLang) => {
    persist('displayLang', displayLang);
    set({ displayLang });
  },

  setVernacularLang: (vernacularLang) => {
    document.documentElement.lang = vernacularLang;
    persist('vernacularLang', vernacularLang);
    set({ vernacularLang });
  },

  setRubricYear: (rubricYear) => {
    persist('rubricYear', rubricYear);
    set({ rubricYear });
  },

  setPenanceDiscipline: (penanceDiscipline) => {
    persist('penanceDiscipline', penanceDiscipline);
    set({ penanceDiscipline });
  },

  setPatronSaint: (patronSaint) => {
    persist('patronSaint', patronSaint);
    set({ patronSaint });
  },

  loadSettings: async () => {
    const theme = await loadSetting('theme', 'parchment') as ThemeName;
    const textSize = await loadSetting('textSize', 'medium') as TextSize;
    const textDarkness = parseFloat(await loadSetting('textDarkness', '1'));
    const displayLang = await loadSetting('displayLang', 'both') as DisplayLang;
    const vernacularLang = await loadSetting('vernacularLang', 'en') as VernacularLang;
    const rubricYear = await loadSetting('rubricYear', '1962') as RubricYearSetting;
    const penanceDiscipline = await loadSetting('penanceDiscipline', '1962') as PenanceDiscipline;
    const patronSaint = await loadSetting('patronSaint', '');

    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-text-size', textSize);
    document.documentElement.style.setProperty('--text-darkness', String(textDarkness));
    document.documentElement.lang = vernacularLang;

    set({ theme, textSize, textDarkness, displayLang, vernacularLang, rubricYear, penanceDiscipline, patronSaint, loaded: true });
  },
}));
