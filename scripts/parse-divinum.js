import fs from 'fs';
import path from 'path';

const REPO_ROOT = path.join(process.cwd(), '../divinum-officium-master/divinum-officium-master/web/www/missa');
const OUTPUT_DIR = path.join(process.cwd(), 'public/data');

// Create output directories
fs.mkdirSync(path.join(OUTPUT_DIR, 'propers'), { recursive: true });
fs.mkdirSync(path.join(OUTPUT_DIR, 'ordinary'), { recursive: true });

function parseDOFile(filePath) {
    if (!fs.existsSync(filePath)) return null;
    const content = fs.readFileSync(filePath, 'utf-8');
    const sections = {};
    let currentSection = null;
    let currentLines = [];

    const lines = content.split('\n');
    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
            if (currentSection) {
                sections[currentSection] = currentLines.join('\n').trim();
            }
            currentSection = trimmed.slice(1, -1);
            currentLines = [];
        } else if (currentSection && trimmed !== '') {
            currentLines.push(trimmed);
        }
    }
    if (currentSection) {
        sections[currentSection] = currentLines.join('\n').trim();
    }
    return sections;
}

const VER_LANGS = {
    'en': 'English',
    'es': 'Espanol',
    'de': 'Deutsch',
    'fr': 'Francais',
    'it': 'Italiano'
};

function processTempora() {
    const latDir = path.join(REPO_ROOT, 'Latin/Tempora');
    if (!fs.existsSync(latDir)) {
        console.error(`Latin Tempora dir not found at ${latDir}`);
        return;
    }

    const files = fs.readdirSync(latDir).filter(f => f.endsWith('.txt'));
    let count = 0;

    for (const file of files) {
        const id = file.replace('.txt', '');
        const latData = parseDOFile(path.join(latDir, file));
        if (!latData) continue;

        const verData = {};
        for (const [code, dirName] of Object.entries(VER_LANGS)) {
            verData[code] = parseDOFile(path.join(REPO_ROOT, dirName, 'Tempora', file)) || {};
        }

        const buildMultilingualField = (sectionKey) => {
            const field = { la: latData[sectionKey] || '' };
            for (const code of Object.keys(VER_LANGS)) {
                field[code] = verData[code][sectionKey] || '';
            }
            return field;
        };

        const proper = {
            id: id,
            titleLatin: latData['Officium']?.split('\n')[0] || id,
            titleVernacular: (() => {
                const title = {};
                for (const code of Object.keys(VER_LANGS)) {
                    title[code] = verData[code]['Officium']?.split('\n')[0] || '';
                }
                return title;
            })(),
            class: 1, 
            color: 'green',
            hasGloria: latData['Rule']?.includes('Gloria') || false,
            hasCredo: latData['Rule']?.includes('Credo') || false,
            introit: buildMultilingualField('Introitus'),
            collect: [buildMultilingualField('Oratio')],
            epistle: buildMultilingualField('Lectio'),
            gradual: buildMultilingualField('Graduale'),
            gospel: buildMultilingualField('Evangelium'),
            offertory: buildMultilingualField('Offertorium'),
            secret: [buildMultilingualField('Secreta')],
            communionAntiphon: buildMultilingualField('Communio'),
            postcommunion: [buildMultilingualField('Postcommunio')]
        };

        fs.writeFileSync(
            path.join(OUTPUT_DIR, 'propers', `${id.toLowerCase()}.json`),
            JSON.stringify(proper, null, 2)
        );
        count++;
    }
    console.log(`Processed ${count} Tempora propers with translations.`);
}

function processOrdinary() {
    const latOrdo = parseDOFile(path.join(REPO_ROOT, 'Latin/Ordo/Ordo.txt'));
    if (!latOrdo) {
        console.error('Latin Ordo.txt not found.');
        return;
    }

    const verOrdo = {};
    for (const [code, dirName] of Object.entries(VER_LANGS)) {
        verOrdo[code] = parseDOFile(path.join(REPO_ROOT, dirName, 'Ordo', 'Ordo.txt')) || {};
    }

    const buildMultilingualField = (sectionKey) => {
        const field = { la: latOrdo[sectionKey] || '' };
        for (const code of Object.keys(VER_LANGS)) {
            field[code] = verOrdo[code][sectionKey] || '';
        }
        return field;
    };

    fs.writeFileSync(path.join(OUTPUT_DIR, 'ordinary', 'canon.json'), JSON.stringify(buildMultilingualField('Canon'), null, 2));
    fs.writeFileSync(path.join(OUTPUT_DIR, 'ordinary', 'creed.json'), JSON.stringify(buildMultilingualField('Credo'), null, 2));

    console.log('Processed Ordinary components with translations.');
}

console.log('Starting Divinum Officium multilingual parser...');
processTempora();
processOrdinary();
console.log('Parsing complete.');
