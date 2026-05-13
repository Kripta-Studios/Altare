/**
 * fill-empty-translations.js
 * 
 * For every propers JSON file, if a vernacular field (es, fr, de, it) is empty "",
 * copy the English text into it so users always see SOMETHING.
 * Latin text is never touched.
 */
import fs from 'fs';
import path from 'path';

const propersDir = path.join(process.cwd(), 'public', 'data', 'propers');
const files = fs.readdirSync(propersDir).filter(f => f.endsWith('.json'));

const langs = ['es', 'de', 'fr', 'it'];

// Fields in a proper that contain { la, en, es, de, fr, it }
const textFields = ['introit', 'epistle', 'gradual', 'gospel', 'offertory', 'communionAntiphon'];
// Fields that are arrays of { la, en, es, de, fr, it }
const arrayFields = ['collect', 'secret', 'postcommunion'];

let totalFilled = 0;
let filesModified = 0;

for (const file of files) {
  const filePath = path.join(propersDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let modified = false;

  // Fill titleVernacular
  if (data.titleVernacular) {
    for (const lang of langs) {
      if (data.titleVernacular[lang] !== undefined && data.titleVernacular[lang] === '') {
        if (data.titleVernacular.en) {
          data.titleVernacular[lang] = data.titleVernacular.en;
          totalFilled++;
          modified = true;
        }
      }
    }
  }

  // Fill text fields
  for (const field of textFields) {
    if (data[field]) {
      for (const lang of langs) {
        if (data[field][lang] !== undefined && data[field][lang] === '') {
          if (data[field].en) {
            data[field][lang] = data[field].en;
            totalFilled++;
            modified = true;
          }
        }
      }
    }
  }

  // Fill array fields
  for (const field of arrayFields) {
    if (Array.isArray(data[field])) {
      for (const item of data[field]) {
        for (const lang of langs) {
          if (item[lang] !== undefined && item[lang] === '') {
            if (item.en) {
              item[lang] = item.en;
              totalFilled++;
              modified = true;
            }
          }
        }
      }
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    filesModified++;
  }
}

console.log(`Done! Filled ${totalFilled} empty translation fields across ${filesModified} files.`);
