import Dexie, { type EntityTable } from 'dexie';

/** Prayer rule assignment */
export interface PrayerRuleItem {
  id?: number;
  prayerId: string;
  slot: 'morning' | 'midday' | 'evening';
  order: number;
}

/** Daily prayer completion */
export interface PrayerCompletion {
  id?: number;
  prayerId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
}

/** Patron saint daily streak */
export interface SaintStreak {
  id?: number;
  saintId: string;
  date: string;
  practices: Record<string, boolean>; // practiceId -> completed
}

/** Latin lesson mastery */
export interface LatinMastery {
  id?: number;
  flashcardId: string;
  correct: number;
  attempts: number;
  lastAttempt: string;
}

/** Penance log entry */
export interface PenanceEntry {
  id?: number;
  date: string;
  discipline: '1962' | '1917';
  type: 'fast' | 'abstinence' | 'both' | 'none';
  notes?: string;
}

/** User preferences */
export interface UserSetting {
  key: string;
  value: string;
}

/** Database definition */
const db = new Dexie('AltareDB') as Dexie & {
  prayerRuleItems: EntityTable<PrayerRuleItem, 'id'>;
  prayerCompletions: EntityTable<PrayerCompletion, 'id'>;
  saintStreaks: EntityTable<SaintStreak, 'id'>;
  latinMastery: EntityTable<LatinMastery, 'id'>;
  penanceEntries: EntityTable<PenanceEntry, 'id'>;
  settings: EntityTable<UserSetting, 'key'>;
};

db.version(1).stores({
  prayerRuleItems: '++id, prayerId, slot',
  prayerCompletions: '++id, [prayerId+date], date',
  saintStreaks: '++id, [saintId+date], saintId',
  latinMastery: '++id, flashcardId',
  penanceEntries: '++id, date',
  settings: 'key',
});

export { db };
