import fs from 'fs';
import path from 'path';

const outPath = path.join(process.cwd(), 'public', 'data', 'meditations.json');

async function translateText(text, targetLang, sourceLang = 'en') {
  if (!text) return text;
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
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
    console.error(`Translation error (${sourceLang} -> ${targetLang}):`, e);
    return text;
  }
}

const delay = ms => new Promise(res => setTimeout(res, ms));

async function main() {
  if (!fs.existsSync(outPath)) {
    console.error('meditations.json not found');
    return;
  }

  const meditations = JSON.parse(fs.readFileSync(outPath, 'utf8'));
  const citations = Object.keys(meditations);
  let translatedTotal = 0;

  console.log(`Checking ${citations.length} meditations for missing Spanish translations...`);

  for (const cit of citations) {
    const entry = meditations[cit];
    
    // If Spanish is missing, try to translate from available languages
    if (!entry.es) {
      // Find a source language that exists
      const sourceLang = entry.en ? 'en' : entry.it ? 'it' : entry.de ? 'de' : entry.fr ? 'fr' : null;
      
      if (sourceLang) {
        console.log(`Translating "${cit}" to Spanish from ${sourceLang.toUpperCase()}...`);
        const translated = await translateText(entry[sourceLang], 'es', sourceLang);
        
        if (translated && translated !== entry[sourceLang]) {
          entry.es = translated;
          translatedTotal++;
          
          // Periodic save to avoid data loss
          if (translatedTotal % 10 === 0) {
            fs.writeFileSync(outPath, JSON.stringify(meditations, null, 2));
          }
          
          await delay(200); // Respect Google API
        }
      }
    }
  }

  fs.writeFileSync(outPath, JSON.stringify(meditations, null, 2));
  console.log(`Done! Total meditations translated to Spanish: ${translatedTotal}`);
}

main().catch(console.error);
