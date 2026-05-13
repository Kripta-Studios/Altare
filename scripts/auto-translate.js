import fs from 'fs';
import path from 'path';

const propersDir = path.join(process.cwd(), 'public', 'data', 'propers');
let files = fs.readdirSync(propersDir).filter(f => f.endsWith('.json'));

const args = process.argv.slice(2);
if (args.length > 0) {
  files = files.filter(f => args.includes(f));
}

const targetLang = 'es';

// Fields in a proper that contain { la, en, es, de, fr, it }
const textFields = ['introit', 'epistle', 'gradual', 'gospel', 'offertory', 'communionAntiphon'];
// Fields that are arrays of { la, en, es, de, fr, it }
const arrayFields = ['collect', 'secret', 'postcommunion'];

async function translateText(text, targetLang) {
  if (!text) return text;
  
  // We don't want to translate DO markers like "!Ps 24:1-2" or "&Gloria" or "v."
  // It's safer to just send the whole text, Google Translate is usually smart enough,
  // but let's be careful. Actually, let's just translate the whole text.
  
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    
    // Google Translate returns an array of translated segments. We need to join them.
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

// Helper to delay between requests to avoid rate limits
const delay = ms => new Promise(res => setTimeout(res, ms));

async function main() {
  console.log(`Starting translation process for ${targetLang}...`);
  let translatedCount = 0;
  
  for (const file of files) {
    const filePath = path.join(propersDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let modified = false;

    // Helper to translate a field object
    const processField = async (obj) => {
      if (!obj || !obj.en) return;
      // If the target language is exactly the same as English, it means it's a fallback or untranslated
      // or if it's empty
      if (!obj[targetLang] || obj[targetLang] === obj.en) {
        console.log(`Translating field in ${file}...`);
        const translated = await translateText(obj.en, targetLang);
        if (translated !== obj.en) {
          obj[targetLang] = translated;
          modified = true;
          translatedCount++;
          await delay(300); // 300ms delay to prevent rate limits
        }
      }
    };

    if (data.titleVernacular) await processField(data.titleVernacular);

    for (const field of textFields) {
      if (data[field]) await processField(data[field]);
    }

    for (const field of arrayFields) {
      if (Array.isArray(data[field])) {
        for (const item of data[field]) {
          await processField(item);
        }
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`Saved ${file}`);
    }
  }

  console.log(`Done! Translated ${translatedCount} fields to ${targetLang}.`);
}

main().catch(console.error);
