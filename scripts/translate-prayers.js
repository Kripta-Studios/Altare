import fs from 'fs';
import path from 'path';

const ordoFile = path.join(process.cwd(), 'public', 'data', 'prayers', 'index.json');
const targetLangs = ['es', 'de', 'fr', 'it'];

async function translateText(text, targetLang) {
  if (!text) return text;
  
  try {
    // Translate from English to target
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    
    let translatedText = '';
    if (data && data[0]) {
      data[0].forEach(segment => {
        if (segment[0]) translatedText += segment[0];
      });
    }
    return translatedText || text;
  } catch (e) {
    console.error('Translation error:', e);
    return text;
  }
}

const delay = ms => new Promise(res => setTimeout(res, ms));

async function main() {
  console.log(`Starting translation process for Prayers...`);
  
  if (!fs.existsSync(ordoFile)) {
    console.error('prayers index.json not found');
    return;
  }
  
  const data = JSON.parse(fs.readFileSync(ordoFile, 'utf8'));
  let translatedCount = 0;
  
  for (const prayer of data) {
    if (!prayer.vernacular) {
      prayer.vernacular = {};
    }
    if (!prayer.titleVernacular) {
      prayer.titleVernacular = {};
    }

    if (prayer.english) {
      prayer.vernacular['en'] = prayer.english;
      for (const lang of targetLangs) {
        if (!prayer.vernacular[lang]) {
          console.log(`Translating ${prayer.id} text to ${lang}...`);
          const translated = await translateText(prayer.english, lang);
          prayer.vernacular[lang] = translated;
          translatedCount++;
          await delay(300);
        }
      }
    }

    if (prayer.titleEnglish) {
      prayer.titleVernacular['en'] = prayer.titleEnglish;
      for (const lang of targetLangs) {
        if (!prayer.titleVernacular[lang]) {
          console.log(`Translating ${prayer.id} title to ${lang}...`);
          const translated = await translateText(prayer.titleEnglish, lang);
          prayer.titleVernacular[lang] = translated;
          translatedCount++;
          await delay(300);
        }
      }
    }
  }

  if (translatedCount > 0) {
    fs.writeFileSync(ordoFile, JSON.stringify(data, null, 2));
    console.log(`Saved index.json with ${translatedCount} new translations.`);
  } else {
    console.log(`No translations needed.`);
  }
}

main().catch(console.error);
