import fs from 'fs';
import path from 'path';

const ordoFile = path.join(process.cwd(), 'public', 'data', 'ordinary', 'ordo.json');
const targetLangs = ['en', 'de', 'fr', 'it'];

async function translateText(text, targetLang) {
  if (!text) return text;
  
  try {
    // Translate from Spanish (which we have complete) to target
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=es&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
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
  console.log(`Starting translation process for Ordo...`);
  
  if (!fs.existsSync(ordoFile)) {
    console.error('ordo.json not found');
    return;
  }
  
  const data = JSON.parse(fs.readFileSync(ordoFile, 'utf8'));
  let translatedCount = 0;
  
  for (const key of Object.keys(data)) {
    const part = data[key];
    if (part && part.vernacular && part.vernacular.es) {
      for (const lang of targetLangs) {
        if (!part.vernacular[lang]) {
          console.log(`Translating ${key} to ${lang}...`);
          const translated = await translateText(part.vernacular.es, lang);
          part.vernacular[lang] = translated;
          translatedCount++;
          await delay(300); // rate limiting
        }
      }
    }
  }

  if (translatedCount > 0) {
    fs.writeFileSync(ordoFile, JSON.stringify(data, null, 2));
    console.log(`Saved ordo.json with ${translatedCount} new translations.`);
  } else {
    console.log(`No translations needed.`);
  }
}

main().catch(console.error);
