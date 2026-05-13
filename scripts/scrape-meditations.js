import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

const baseUrls = {
  es: 'https://www.vaticannews.va/es/evangelio-de-hoy',
  en: 'https://www.vaticannews.va/en/word-of-the-day',
  it: 'https://www.vaticannews.va/it/vangelo-del-giorno-e-parola-del-giorno',
  de: 'https://www.vaticannews.va/de/tagesevangelium-und-tagesliturgie',
  fr: 'https://www.vaticannews.va/fr/evangile-du-jour'
};

const keywords = {
  es: { gospel: 'EVANGELIO', pope: 'PALABRAS DE LOS PAPAS' },
  en: { gospel: 'GOSPEL', pope: 'WORDS OF THE POPE' },
  it: { gospel: 'VANGELO', pope: 'PAROLE DEI PAPI' },
  de: { gospel: 'EVANGELIUM', pope: 'WORTE DER PÄPSTE' },
  fr: { gospel: 'ÉVANGILE', pope: 'PAROLES DES PAPES' }
};

const bookMap = {
  'JUAN': 'John', 'JOHN': 'John', 'GV': 'John', 'JOH': 'John', 'JN': 'John',
  'LUCAS': 'Luke', 'LUKE': 'Luke', 'LC': 'Luke', 'LK': 'Luke',
  'MATEO': 'Matthew', 'MATTHEW': 'Matthew', 'MT': 'Matthew',
  'MARCOS': 'Mark', 'MARK': 'Mark', 'MC': 'Mark', 'MK': 'Mark'
};

function normalizeCitation(text) {
  if (!text) return '';
  // Enhanced regex to find Book Chapter:Verse even inside long strings
  // Supports "Juan 16, 1-5", "Jn 16:1-5", "1 John 2:3", etc.
  const regex = /(?:(?:\d\s*)?[A-Za-z\u00C0-\u017F]+)\s*\d+[,:]\s*\d+(?:[-\u2013]\s*\d+)?/g;
  const matches = text.match(regex);
  if (matches && matches.length > 0) {
    // Take the last one often found in headers or the first one if it's a short string
    let cit = matches[0];
    const parts = cit.match(/((?:\d\s*)?[A-Za-z\u00C0-\u017F]+)\s*(\d+)[,:]\s*(\d+)(?:[-\u2013]\s*(\d+))?/);
    if (parts) {
      const rawBook = parts[1].toUpperCase().replace(/\s/g, '');
      const book = bookMap[rawBook] || parts[1].trim();
      const chapter = parts[2];
      const startVerse = parts[3];
      const endVerse = parts[4] ? `-${parts[4]}` : '';
      return `${book} ${chapter}:${startVerse}${endVerse}`;
    }
  }
  return text;
}

async function scrapeDate(year, month, day, lang) {
  const datePath = `${year}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}.html`;
  const url = `${baseUrls[lang]}/${datePath}`;

  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const html = await res.text();
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    const sections = doc.querySelectorAll('section');
    let gospelCitation = '';
    let meditation = '';

    sections.forEach(section => {
      const head = section.querySelector('.section__head')?.textContent?.trim()?.toUpperCase() || '';
      const content = section.querySelector('.section__content');

      if (head.includes(keywords[lang].gospel)) {
        gospelCitation = normalizeCitation(content?.textContent?.trim() || '');
      }

      if (head.includes(keywords[lang].pope)) {
        meditation = content?.textContent?.trim() || '';
      }
    });

    return { gospelCitation, meditation };
  } catch (e) {
    console.error(`Error scraping ${lang}:`, e);
    return null;
  }
}

async function main() {
  const years = [2023, 2025, 2026];
  const outPath = path.join(process.cwd(), 'public', 'data', 'meditations.json');
  let meditations = {};
  if (fs.existsSync(outPath)) {
    meditations = JSON.parse(fs.readFileSync(outPath, 'utf8'));
  }

  console.log('Starting bulk scrape for years:', years);

  for (const year of years) {
    for (let month = 1; month <= 12; month++) {
      // Days in month
      const days = new Date(year, month, 0).getDate();
      for (let day = 1; day <= days; day++) {
        // Optimization: skip if we already have a meditation for this specific date? 
        // No, because we map by citation, not date. But we can't easily know if a date has been processed.
        // Let's just process it.

        const results = {};
        for (const lang of Object.keys(baseUrls)) {
          const data = await scrapeDate(year, month, day, lang);
          if (data && data.meditation && data.gospelCitation) {
            const key = data.gospelCitation;
            if (!results[key]) results[key] = {};
            results[key][lang] = data.meditation;
          }
          await new Promise(r => setTimeout(r, 10)); // 10ms delay between languages
        }

        // Merge results into main object
        let found = false;
        for (const key in results) {
          if (!meditations[key]) meditations[key] = {};
          meditations[key] = { ...meditations[key], ...results[key] };
          found = true;
        }

        if (found) {
          console.log(`[${year}-${month}-${day}] Processed.`);
          // Save every day to be safe
          fs.writeFileSync(outPath, JSON.stringify(meditations, null, 2));
        }

        await new Promise(r => setTimeout(r, 10)); // 10ms delay between days
      }
    }
  }

  console.log('Bulk scrape finished! Total citations:', Object.keys(meditations).length);
}

main();
