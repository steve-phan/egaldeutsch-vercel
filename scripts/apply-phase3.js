const fs = require('fs');
const path = require('path');

// Read Phase 3 data
const phase3Data = JSON.parse(fs.readFileSync('/tmp/phase3-data.json', 'utf8'));

const lettersDir = path.join(__dirname, '..', 'public', 'data', 'dictionary', 'letters');

// Get the highest existing ID across all letter files
function getMaxId() {
  let maxId = 0;
  const files = fs.readdirSync(lettersDir);
  
  files.forEach(file => {
    if (file.endsWith('.json')) {
      const data = JSON.parse(fs.readFileSync(path.join(lettersDir, file), 'utf8'));
      Object.keys(data.entries || {}).forEach(id => {
        const num = parseInt(id.replace('ID', ''));
        if (num > maxId) maxId = num;
      });
    }
  });
  
  return maxId;
}

let currentId = getMaxId() + 1;
console.log(`Starting from ID${currentId.toString().padStart(3, '0')}`);

// Process each letter
['L', 'M', 'N', 'O', 'P'].forEach(letter => {
  const letterLower = letter.toLowerCase();
  const filepath = path.join(lettersDir, `${letterLower}.json`);
  
  if (!fs.existsSync(filepath)) {
    console.log(`File ${letterLower}.json not found, skipping`);
    return;
  }
  
  const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
  const newEntries = phase3Data[letter] || [];
  
  console.log(`\nProcessing letter ${letter}: adding ${newEntries.length} entries`);
  
  newEntries.forEach(entry => {
    const id = `ID${currentId.toString().padStart(3, '0')}`;
    const wordLower = entry.word.toLowerCase();
    
    // Add to byWord
    data.byWord[wordLower] = id;
    
    // Add to byEnglish
    if (!data.byEnglish[entry.english]) {
      data.byEnglish[entry.english] = [];
    }
    if (!data.byEnglish[entry.english].includes(id)) {
      data.byEnglish[entry.english].push(id);
    }
    
    // Add to byVietnamese
    if (!data.byVietnamese[entry.vietnamese]) {
      data.byVietnamese[entry.vietnamese] = [];
    }
    if (!data.byVietnamese[entry.vietnamese].includes(id)) {
      data.byVietnamese[entry.vietnamese].push(id);
    }
    
    // Add to byArtikel
    if (!data.byArtikel[entry.artikel].includes(id)) {
      data.byArtikel[entry.artikel].push(id);
    }
    
    // Add to entries
    data.entries[id] = {
      word: entry.word,
      artikel: entry.artikel,
      plural: entry.plural,
      english: entry.english,
      vietnamese: entry.vietnamese,
      definition_en: `A ${entry.english}.`,
      definition_vi: `Một ${entry.vietnamese}.`,
      examples: [
        {
          de: `${entry.artikel === 'der' ? 'Der' : entry.artikel === 'die' ? 'Die' : 'Das'} ${entry.word} ist wichtig.`,
          en: `The ${entry.english} is important.`,
          vi: `${entry.vietnamese.charAt(0).toUpperCase() + entry.vietnamese.slice(1)} thì quan trọng.`
        }
      ]
    };
    
    currentId++;
  });
  
  // Write back
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`✓ Updated ${letterLower}.json with ${newEntries.length} entries`);
});

console.log(`\nPhase 3 expansion complete! Final ID: ID${(currentId-1).toString().padStart(3, '0')}`);
