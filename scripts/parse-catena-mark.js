import fs from 'fs';
import path from 'path';

const inputPath = path.join(process.cwd(), 'public/data/catena-aurea-gospel-of-mark.txt');
const outputPath = path.join(process.cwd(), 'public/data/commentaries/mark.json');

if (!fs.existsSync(path.dirname(outputPath))) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
}

function parse() {
  const content = fs.readFileSync(inputPath, 'utf8');
  const lines = content.split('\n');
  
  const results = {};
  let currentChapter = 0;
  let currentVerses = []; 
  let currentCommentaries = [];
  
  let buffer = [];
  let mode = 'verses'; // 'verses' or 'commentaries'

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Detect Chapter
    const chapterMatch = line.match(/^CHAPTER\s+(\d+):/i);
    if (chapterMatch) {
      saveCurrentGroup(results, currentChapter, currentVerses, currentCommentaries);
      currentChapter = parseInt(chapterMatch[1]);
      currentVerses = [];
      currentCommentaries = [];
      buffer = [];
      mode = 'verses';
      continue;
    }

    if (currentChapter === 0) continue;

    // Detect Verse Start (e.g. "Ver. 1:" or "2. " or "4, 5. ")
    const verseMatch = line.match(/^(?:Ver\.\s*)?(\d+(?:\s*,\s*\d+)*)[\.:]/i);
    
    // Detect Commentary Start (Author:)
    const authorMatch = line.match(/^([A-Z][a-z]+(?:-[A-Z][a-z]+)?|Pseudo-[A-Z][a-z]+)(?:,\s*[^:]+)?:\s*(.*)/);

    if (verseMatch && mode === 'commentaries') {
      // Transition from commentaries to new verses
      saveCurrentGroup(results, currentChapter, currentVerses, currentCommentaries);
      currentVerses = verseMatch[1].split(/[,\s]+/).filter(v => v).map(v => parseInt(v));
      currentCommentaries = [];
      buffer = [];
      mode = 'verses';
    } else if (verseMatch && mode === 'verses') {
      // Another verse in the same block? (though usually they are on the same line)
      const newVerses = verseMatch[1].split(/[,\s]+/).filter(v => v).map(v => parseInt(v));
      currentVerses = [...new Set([...currentVerses, ...newVerses])];
    } else if (authorMatch) {
      mode = 'commentaries';
      // Process buffer or previous lines if needed? 
      // Actually let's just push the commentary
      const author = authorMatch[1];
      let text = authorMatch[2].trim();
      
      // Look ahead for more text of this author
      let nextI = i + 1;
      while (nextI < lines.length) {
        const nextLine = lines[nextI].trim();
        if (!nextLine) { nextI++; continue; }
        if (nextLine.match(/^([A-Z][a-z]+(?:-[A-Z][a-z]+)?|Pseudo-[A-Z][a-z]+)(?:,\s*[^:]+)?:\s*/) || 
            nextLine.match(/^(?:Ver\.\s*)?(\d+(?:\s*,\s*\d+)*)[\.:]/i) ||
            nextLine.startsWith('____') ||
            nextLine.match(/^CHAPTER\s+\d+:/i)) {
          break;
        }
        text += ' ' + nextLine;
        nextI++;
      }
      i = nextI - 1;
      currentCommentaries.push({ author, text });
    }
  }

  saveCurrentGroup(results, currentChapter, currentVerses, currentCommentaries);

  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`Successfully parsed Catena Aurea for Mark. Found ${Object.keys(results).length} blocks.`);
}

function saveCurrentGroup(results, chapter, verses, commentaries) {
  if (verses.length > 0 && commentaries.length > 0) {
    const key = `Mark ${chapter}:${verses.join(',')}`;
    results[key] = commentaries;
  }
}

parse();
