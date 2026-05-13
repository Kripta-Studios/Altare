/**
 * Introibo — Liturgical Calendar Engine
 * Computes the liturgical day for any date according to the 1962 Roman Missal
 */

export type Season = 'Advent' | 'Christmas' | 'Epiphany' | 'Septuagesima' | 'Lent' | 'Passiontide' | 'HolyWeek' | 'Easter' | 'Pentecost' | 'OrdinaryTime';
export type LiturgicalColor = 'white' | 'red' | 'green' | 'purple' | 'black' | 'rose';
export type MarianAntiphon = 'Alma' | 'Ave' | 'Regina' | 'Salve';
export type RubricYear = 1962 | 1955 | 'pre-1955';

export interface LiturgicalDay {
  date: Date;
  season: Season;
  week: number;
  dayClass: 1 | 2 | 3 | 4;
  properId: string;
  titleLatin: string;
  titleEnglish: string;
  color: LiturgicalColor;
  marianAntiphon: MarianAntiphon;
  isEmberDay: boolean;
  isFirstFriday: boolean;
  isFirstSaturday: boolean;
  hasGloria: boolean;
  hasCredo: boolean;
  isRogationDay: boolean;
}

/** 
 * Compute Easter Sunday using the Meeus/Jones/Butcher algorithm 
 * Valid for all years in the Gregorian calendar (1583–4099)
 */
export function computeEaster(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

/** Add days to a date */
function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/** Check if two dates are the same day */
function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/** Day of week: 0=Sunday */
function dayOfWeek(d: Date): number {
  return d.getDay();
}



/** Days between two dates */
function daysBetween(a: Date, b: Date): number {
  const msPerDay = 86400000;
  return Math.round((b.getTime() - a.getTime()) / msPerDay);
}



/** Get Advent 1 date (Sunday nearest Nov 30, but >= Nov 27) */
function getAdvent1(year: number): Date {
  const nov30 = new Date(year, 10, 30); // Nov 30
  const dow = nov30.getDay();
  // Advent 1 is the Sunday closest to Nov 30
  if (dow <= 3) {
    return addDays(nov30, -dow); // Go back to Sunday
  } else {
    return addDays(nov30, 7 - dow); // Go forward to Sunday
  }
}

/** Determine the liturgical season */
export function getSeason(date: Date, easter: Date, year: number): Season {
  const christmas = new Date(year, 11, 25);
  const christmasPrev = new Date(year - 1, 11, 25);
  const advent1 = getAdvent1(year);
  const epiphany = new Date(year, 0, 6);
  const ashWednesday = addDays(easter, -46);
  const septuagesima = addDays(easter, -63);
  const passionSunday = addDays(easter, -14);
  const palmSunday = addDays(easter, -7);

  const pentecost = addDays(easter, 49);

  if (date >= advent1) return 'Advent';
  if (date >= christmas || date < epiphany) return 'Christmas';
  if (date >= epiphany && date < septuagesima) return 'Epiphany';
  if (date >= septuagesima && date < ashWednesday) return 'Septuagesima';
  if (date >= ashWednesday && date < passionSunday) return 'Lent';
  if (date >= passionSunday && date < palmSunday) return 'Passiontide';
  if (date >= palmSunday && date < easter) return 'HolyWeek';
  if (sameDay(date, easter) || (date > easter && date <= addDays(easter, 49))) return 'Easter';
  if (date >= pentecost && date < advent1) return 'OrdinaryTime';

  // Fallback — check previous year's Christmas
  if (date >= christmasPrev && date < epiphany) return 'Christmas';

  return 'OrdinaryTime';
}

/** Get liturgical color for a season */
export function getSeasonColor(season: Season): LiturgicalColor {
  switch (season) {
    case 'Advent': case 'Lent': case 'Septuagesima': case 'Passiontide': return 'purple';
    case 'Christmas': case 'Easter': case 'Epiphany': return 'white';
    case 'HolyWeek': return 'purple';
    case 'Pentecost': return 'red';
    case 'OrdinaryTime': return 'green';
    default: return 'green';
  }
}

/** Determine the Marian antiphon based on the date */
export function getMarianAntiphon(date: Date, easter: Date): MarianAntiphon {
  const year = date.getFullYear();
  const advent1 = getAdvent1(year);
  const feb2 = new Date(year, 1, 2); // Purification
  const holyThursday = addDays(easter, -3);
  const trinity = addDays(easter, 56);


  // Advent to Feb 2: Alma Redemptoris Mater
  if (date >= advent1 || date <= feb2) return 'Alma';
  // Feb 2 to Holy Thursday: Ave Regina Caelorum  
  if (date > feb2 && date <= holyThursday) return 'Ave';
  // Easter to Trinity: Regina Caeli
  if (date >= easter && date <= trinity) return 'Regina';
  // Trinity to Advent: Salve Regina
  return 'Salve';
}

/** Check if a date is an Ember Day */
export function isEmberDay(date: Date, easter: Date): boolean {
  const year = date.getFullYear();
  const dow = dayOfWeek(date);
  if (dow !== 3 && dow !== 5 && dow !== 6) return false; // Wed, Fri, Sat only

  const ashWednesday = addDays(easter, -46);
  const pentecost = addDays(easter, 49);

  // 1) After Ash Wednesday (Lent Ember Days)

  if (date >= ashWednesday && date <= addDays(ashWednesday, 5)) {
    return dow === 3 || dow === 5 || dow === 6;
  }

  // 2) After Pentecost (Whitsun Ember Days)
  const pentEmberStart = addDays(pentecost, 3); // Wed after Pentecost
  if (date >= pentEmberStart && date <= addDays(pentEmberStart, 3)) {
    return true;
  }

  // 3) After Holy Cross (Sep 14) - Week after 3rd Sunday of September
  const sep14 = new Date(year, 8, 14);
  const sep14Wed = addDays(sep14, ((3 - dayOfWeek(sep14) + 7) % 7) || 7);
  if (date >= sep14Wed && date <= addDays(sep14Wed, 3)) {
    return true;
  }

  // 4) After St. Lucy (Dec 13) - Week after 3rd Sunday of Advent
  const dec13 = new Date(year, 11, 13);
  const dec13Wed = addDays(dec13, ((3 - dayOfWeek(dec13) + 7) % 7) || 7);
  if (date >= dec13Wed && date <= addDays(dec13Wed, 3)) {
    return true;
  }

  return false;
}

/** Build proper ID from date */
function buildProperId(date: Date, season: Season, easter: Date): string {
  const month = date.getMonth();
  const day = date.getDate();
  const dow = dayOfWeek(date);
  const year = date.getFullYear();

  // Fixed dates (Sanctoral cycle) — use MM-DD format
  const mmdd = `${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  // Temporal cycle
  switch (season) {
    case 'Advent': {
      const advent1 = getAdvent1(year);
      const weekNum = Math.floor(daysBetween(advent1, date) / 7) + 1;
      return `Adv${weekNum}-${dow}`;
    }
    case 'Christmas': {
      if (month === 11 && day === 25) return '12-25'; // Christmas
      if (month === 11 && day === 26) return '12-26';
      if (month === 11 && day === 27) return '12-27';
      if (month === 11 && day === 28) return '12-28';
      if (month === 11 && day === 31) return '12-31';
      if (month === 0 && day === 1) return '01-01'; // Circumcision
      return mmdd;
    }
    case 'Epiphany': {
      if (month === 0 && day === 6) return '01-06';
      // Sundays after Epiphany
      const epiph = new Date(year, 0, 6);
      const weeksAfter = Math.floor(daysBetween(epiph, date) / 7);
      if (dow === 0 && weeksAfter > 0) return `Epi${weeksAfter}-0`;
      return mmdd;
    }
    case 'Septuagesima': {
      const septuagesima = addDays(easter, -63);
      const daysFrom = daysBetween(septuagesima, date);
      if (daysFrom < 7) return `Sept-${dow}`;
      if (daysFrom < 14) return `Sex-${dow}`;
      return `Quin-${dow}`;
    }
    case 'Lent': {
      const ashWed = addDays(easter, -46);
      const daysFromAsh = daysBetween(ashWed, date);
      const weekNum = Math.floor(daysFromAsh / 7) + 1;
      return `Quad${weekNum}-${dow}`;
    }
    case 'Passiontide': {
      const passionSun = addDays(easter, -14);
      const daysFromPassion = daysBetween(passionSun, date);
      if (daysFromPassion < 7) return `Pass-${dow}`;
      return mmdd;
    }
    case 'HolyWeek': {
      const palmSun = addDays(easter, -7);
      const daysFromPalm = daysBetween(palmSun, date);
      return `Maj6-${daysFromPalm}`;
    }
    case 'Easter': {
      if (sameDay(date, easter)) return 'Pasc0-0';
      const daysFromEaster = daysBetween(easter, date);
      const weekNum = Math.floor(daysFromEaster / 7);
      return `Pasc${weekNum}-${dow}`;
    }
    case 'Pentecost':
    case 'OrdinaryTime': {
      const pentecost = addDays(easter, 49);
      if (sameDay(date, pentecost)) return 'Pent0-0';
      const daysFromPent = daysBetween(pentecost, date);
      if (daysFromPent > 0) {
        const weekNum = Math.floor(daysFromPent / 7) + 1;
        if (dow === 0) return `Pent${weekNum}-0`;
        return mmdd; // Weekdays in OT → check sanctoral
      }
      return mmdd;
    }
  }
  return mmdd;
}

/** Full liturgical day computation */
export function getLiturgicalDay(date: Date, _rubricYear: RubricYear = 1962): LiturgicalDay {
  const year = date.getFullYear();
  const easter = computeEaster(year);
  const season = getSeason(date, easter, year);
  const color = getSeasonColor(season);
  const marianAntiphon = getMarianAntiphon(date, easter);
  const properId = buildProperId(date, season, easter);
  const dow = dayOfWeek(date);

  // First Friday / First Saturday
  const isFirstFriday = dow === 5 && date.getDate() <= 7;
  const isFirstSaturday = dow === 6 && date.getDate() <= 7;

  // Gloria: not in Advent, Lent, Passiontide, or ferial days
  const suppressGloria = season === 'Advent' || season === 'Lent' || season === 'Septuagesima' || season === 'Passiontide' || season === 'HolyWeek';


  // Creed: Sundays and major feasts
  const hasCredo = dow === 0;

  // Season display names
  const seasonNames: Record<Season, [string, string]> = {
    'Advent': ['Tempus Adventus', 'Season of Advent'],
    'Christmas': ['Tempus Nativitatis', 'Christmas Season'],
    'Epiphany': ['Tempus Epiphaniæ', 'Season of Epiphany'],
    'Septuagesima': ['Tempus Septuagesimæ', 'Septuagesima Season'],
    'Lent': ['Tempus Quadragesimæ', 'Season of Lent'],
    'Passiontide': ['Tempus Passionis', 'Passiontide'],
    'HolyWeek': ['Hebdomada Sancta', 'Holy Week'],
    'Easter': ['Tempus Paschale', 'Easter Season'],
    'Pentecost': ['Tempus Pentecostes', 'Pentecost'],
    'OrdinaryTime': ['Tempus per Annum', 'Ordinary Time'],
  };

  const [titleLatin, titleEnglish] = seasonNames[season];

  return {
    date,
    season,
    week: 0,
    dayClass: dow === 0 ? 2 : 4,
    properId,
    titleLatin,
    titleEnglish,
    color,
    marianAntiphon,
    isEmberDay: isEmberDay(date, easter),
    isFirstFriday,
    isFirstSaturday,
    hasGloria: !suppressGloria,
    hasCredo,
    isRogationDay: false,
  };
}

/** Format date for display */
export function formatLiturgicalDate(date: Date): string {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

/** Get today's date at midnight */
export function getToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}
