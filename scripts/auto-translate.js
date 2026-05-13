import fs from 'fs';
import path from 'path';

const propersDir = path.join(process.cwd(), 'public', 'data', 'propers');
let files = fs.readdirSync(propersDir).filter(f => f.endsWith('.json'));

const args = process.argv.slice(2);
if (args.length > 0) {
  files = files.filter(f => args.includes(f));
}

const targetLangs = ['es', 'de', 'fr', 'it'];

const textFields = ['introit', 'epistle', 'gradual', 'gospel', 'offertory', 'communionAntiphon'];
const arrayFields = ['collect', 'secret', 'postcommunion'];

async function translateText(text, targetLang) {
  if (!text) return text;
  try {
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
  console.log(`Starting multi-language translation for propers...`);
  let translatedTotal = 0;
  
  for (const file of files) {
    const filePath = path.join(propersDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let modified = false;

    const processField = async (obj, fieldName) => {
      if (!obj || !obj.en) return;
      
      for (const lang of targetLangs) {
        if (!obj[lang] || obj[lang] === obj.en) {
          console.log(`Translating ${fieldName} in ${file} to ${lang}...`);
          const translated = await translateText(obj.en, lang);
          if (translated && translated !== obj.en) {
            obj[lang] = translated;
            modified = true;
            translatedTotal++;
            await delay(300);
          }
        }
      }
    };

    if (data.titleVernacular) await processField(data.titleVernacular, 'title');

    for (const field of textFields) {
      if (data[field]) await processField(data[field], field);
    }

    for (const field of arrayFields) {
      if (Array.isArray(data[field])) {
        for (let i = 0; i < data[field].length; i++) {
          await processField(data[field][i], `${field}[${i}]`);
        }
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`Updated ${file}`);
    }
  }

  console.log(`Done! Total new translations: ${translatedTotal}`);
}

main().catch(console.error);
