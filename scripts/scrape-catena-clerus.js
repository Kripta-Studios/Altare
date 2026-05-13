import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

const baseUrl = 'https://www.clerus.org/bibliaclerusonline/es/';

const markPages = [
  'eel.htm', // Cap 1
  'eem.htm', // Cap 2
  'een.htm', // Cap 3
  'eeo.htm', // Cap 4-5
  'eep.htm', // Cap 6
  'eer.htm', // Cap 7
  'ees.htm', // Cap 8
  'eet.htm', // Cap 9
  'eev.htm', // Cap 10
  'eew.htm', // Cap 11
  'eex.htm', // Cap 12
  'eez.htm', // Cap 13-14
  'ee1.htm', // Cap 15
  'ee3.htm', // Cap 16
];

async function scrapePage(page) {
  const url = `${baseUrl}${page}`;
  console.log(`Scraping ${url}...`);
  
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const html = await res.text();
    const dom = new JSDOM(html);
    const doc = dom.window.document;
    
    const results = {};
    let currentKey = '';
    
    // Clerus.org uses many <p> and <a> tags. 
    // We look for <a>MARCOS X,Y-Z:</a>
    const links = doc.querySelectorAll('a');
    
    links.forEach(link => {
      const text = link.textContent.trim();
      const match = text.match(/MARCOS\s+(\d+),(\d+(?:-\d+)?):/i);
      if (match) {
        const chapter = match[1];
        const verses = match[2].replace(',', '.'); // Normalize
        currentKey = `Mark ${chapter}:${verses}`;
        results[currentKey] = [];
        
        // Now look for commentaries in the following sibling elements
        let next = link.parentElement;
        if (next.tagName !== 'P') next = next.parentElement;
        next = next.nextElementSibling;
        
        while (next) {
          // If we hit another section header, stop
          if (next.querySelector('a')?.textContent.match(/MARCOS\s+\d+,\d+/i)) break;
          
          const bold = next.querySelector('b') || next.querySelector('strong');
          if (bold) {
            const author = bold.textContent.trim().replace(':', '');
            // Get the text after the author
            let commentaryText = next.textContent.trim();
            // Remove the author name from the start
            commentaryText = commentaryText.substring(commentaryText.indexOf(':') + 1).trim();
            
            if (author && commentaryText) {
              results[currentKey].push({
                author: author,
                text: commentaryText
              });
            }
          }
          next = next.nextElementSibling;
        }
      }
    });
    
    return results;
  } catch (e) {
    console.error(`Error scraping ${page}:`, e);
    return {};
  }
}

async function main() {
  const allResults = {};
  for (const page of markPages) {
    const pageData = await scrapePage(page);
    Object.assign(allResults, pageData);
    await new Promise(r => setTimeout(r, 500)); // Respectful delay
  }
  
  const outPath = path.join(process.cwd(), 'public/data/commentaries/mark_es.json');
  if (!fs.existsSync(path.dirname(outPath))) {
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
  }
  
  fs.writeFileSync(outPath, JSON.stringify(allResults, null, 2));
  console.log(`Finished scraping Spanish Catena Aurea. Found ${Object.keys(allResults).length} sections.`);
}

main();
