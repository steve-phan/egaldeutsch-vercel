const fs = require('fs');
const path = require('path');

// Load all batch files
const batches = [];
for (let i = 1; i <= 6; i++) {
  const batchPath = path.join(__dirname, '..', 'public', 'data', 'dictionary', `batch-${String(i).padStart(3, '0')}.json`);
  if (fs.existsSync(batchPath)) {
    const batch = JSON.parse(fs.readFileSync(batchPath, 'utf8'));
    batches.push(batch);
    console.log(`Loaded batch-${String(i).padStart(3, '0')}.json`);
  }
}

// Merge all batches
const merged = {
  byWord: {},
  byEnglish: {},
  byVietnamese: {},
  byArtikel: { der: [], die: [], das: [] },
  entries: {}
};

for (const batch of batches) {
  Object.assign(merged.byWord, batch.byWord);
  
  for (const [key, ids] of Object.entries(batch.byEnglish)) {
    if (!merged.byEnglish[key]) merged.byEnglish[key] = [];
    merged.byEnglish[key].push(...ids);
  }
  
  for (const [key, ids] of Object.entries(batch.byVietnamese)) {
    if (!merged.byVietnamese[key]) merged.byVietnamese[key] = [];
    merged.byVietnamese[key].push(...ids);
  }
  
  merged.byArtikel.der.push(...batch.byArtikel.der);
  merged.byArtikel.die.push(...batch.byArtikel.die);
  merged.byArtikel.das.push(...batch.byArtikel.das);
  
  Object.assign(merged.entries, batch.entries);
}

// Group by first letter
const letterGroups = {};
for (const [word, id] of Object.entries(merged.byWord)) {
  const firstLetter = word[0].toLowerCase();
  if (!letterGroups[firstLetter]) {
    letterGroups[firstLetter] = {
      byWord: {},
      byEnglish: {},
      byVietnamese: {},
      byArtikel: { der: [], die: [], das: [] },
      entries: {}
    };
  }
  
  const entry = merged.entries[id];
  letterGroups[firstLetter].byWord[word] = id;
  letterGroups[firstLetter].entries[id] = entry;
  
  // Add to byArtikel
  if (merged.byArtikel.der.includes(id)) letterGroups[firstLetter].byArtikel.der.push(id);
  if (merged.byArtikel.die.includes(id)) letterGroups[firstLetter].byArtikel.die.push(id);
  if (merged.byArtikel.das.includes(id)) letterGroups[firstLetter].byArtikel.das.push(id);
  
  // Add to byEnglish and byVietnamese
  for (const [eng, ids] of Object.entries(merged.byEnglish)) {
    if (ids.includes(id)) {
      if (!letterGroups[firstLetter].byEnglish[eng]) letterGroups[firstLetter].byEnglish[eng] = [];
      if (!letterGroups[firstLetter].byEnglish[eng].includes(id)) {
        letterGroups[firstLetter].byEnglish[eng].push(id);
      }
    }
  }
  
  for (const [vi, ids] of Object.entries(merged.byVietnamese)) {
    if (ids.includes(id)) {
      if (!letterGroups[firstLetter].byVietnamese[vi]) letterGroups[firstLetter].byVietnamese[vi] = [];
      if (!letterGroups[firstLetter].byVietnamese[vi].includes(id)) {
        letterGroups[firstLetter].byVietnamese[vi].push(id);
      }
    }
  }
}

// Create output directory
const outputDir = path.join(__dirname, '..', 'public', 'data', 'dictionary', 'letters');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write each letter file
const sortedLetters = Object.keys(letterGroups).sort();
for (const letter of sortedLetters) {
  const data = letterGroups[letter];
  const outputPath = path.join(outputDir, `${letter}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
  console.log(`Created ${letter}.json with ${Object.keys(data.entries).length} entries`);
}

console.log(`\nTotal letters: ${Object.keys(letterGroups).length}`);
console.log(`Total entries: ${Object.keys(merged.entries).length}`);
