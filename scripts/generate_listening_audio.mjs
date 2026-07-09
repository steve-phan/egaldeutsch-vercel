import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contentRoots = [
  path.join(root, 'src/content/road-to-b2'),
  path.join(root, 'src/content/road-to-c1'),
];
const outputRoot = path.join(root, 'public/audio/books');
const endpoint = process.env.TTS_ENDPOINT || 'http://localhost:8080/api/tts/audio';
const mode = process.argv.includes('--generate') ? 'generate' : 'plan';
const insert = process.argv.includes('--insert');

function walkMarkdown(directory) {
  return fs.readdirSync(directory)
    .filter((file) => file.endsWith('.md') && file !== 'index.md')
    .map((file) => path.join(directory, file));
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'audio';
}

function cleanBlockquote(lines) {
  return lines
    .map((line) => line.replace(/^>\s?/, '').trim())
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function isHearingHeading(line) {
  if (!/^#{1,4}\s+/.test(line)) return false;

  const heading = line.replace(/^#{1,4}\s+/, '').trim();
  return /^Hörtext(?:\s+\d+|:|$)/i.test(heading);
}

function findTranscriptAfter(lines, headingIndex) {
  let blockStart = -1;
  for (let i = headingIndex + 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (/^#{1,4}\s+/.test(line)) break;
    if (line.startsWith('>')) {
      blockStart = i;
      break;
    }
  }

  if (blockStart === -1) return null;

  const blockLines = [];
  let end = blockStart;
  for (let i = blockStart; i < lines.length; i += 1) {
    const line = lines[i];
    if (line.startsWith('>') || line.trim() === '') {
      blockLines.push(line);
      end = i;
      continue;
    }
    break;
  }

  const text = cleanBlockquote(blockLines);
  if (text.length < 40) return null;

  return { start: blockStart, end, text };
}

function findParagraphTranscriptAfter(lines, headingIndex) {
  let paragraphStart = -1;

  for (let i = headingIndex + 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (/^#{1,4}\s+/.test(line)) break;
    if (!line.trim()) continue;
    if (/^[-*]\s+/.test(line) || /^\d+\.\s+/.test(line)) break;
    paragraphStart = i;
    break;
  }

  if (paragraphStart === -1) return null;

  const paragraphLines = [];
  let end = paragraphStart;
  for (let i = paragraphStart; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line.trim()) {
      end = i;
      break;
    }
    if (/^#{1,4}\s+/.test(line)) break;
    paragraphLines.push(line.trim());
    end = i;
  }

  const text = paragraphLines.join(' ').replace(/\s+/g, ' ').trim();
  if (text.length < 40) return null;

  return { start: paragraphStart, end, text };
}

function getBookSegment(filePath) {
  return filePath.includes('/road-to-b2/') ? 'road-to-b2' : 'road-to-c1';
}

function extractItems() {
  const items = [];

  for (const directory of contentRoots) {
    for (const filePath of walkMarkdown(directory)) {
      const relativePath = path.relative(root, filePath);
      const book = getBookSegment(filePath);
      const chapterSlug = path.basename(filePath, '.md');
      const source = fs.readFileSync(filePath, 'utf8');
      const lines = source.split('\n');
      let counter = 0;

      lines.forEach((line, index) => {
        if (!isHearingHeading(line)) return;

        const transcript =
          findTranscriptAfter(lines, index) ||
          findParagraphTranscriptAfter(lines, index);
        if (!transcript) return;

        counter += 1;
        const headingText = line.replace(/^#{1,4}\s+/, '').trim();
        const audioSlug = `${String(counter).padStart(2, '0')}-${slugify(headingText)}`;
        const publicPath = `/audio/books/${book}/${chapterSlug}/${audioSlug}.mp3`;
        const outputPath = path.join(outputRoot, book, chapterSlug, `${audioSlug}.mp3`);

        items.push({
          filePath,
          relativePath,
          book,
          chapterSlug,
          headingLine: index + 1,
          transcriptStartLine: transcript.start + 1,
          headingText,
          text: transcript.text,
          publicPath,
          outputPath,
        });
      });
    }
  }

  return items;
}

function audioMarkup(publicPath) {
  return `\n{{audio:${publicPath}}}\n`;
}

async function generateAudio(item) {
  if (fs.existsSync(item.outputPath) && fs.statSync(item.outputPath).size > 0) {
    return 'skipped';
  }

  fs.mkdirSync(path.dirname(item.outputPath), { recursive: true });

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'audio/mpeg',
    },
    body: JSON.stringify({ text: item.text, format: 'mp3' }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`${response.status} ${response.statusText}: ${body.slice(0, 500)}`);
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(item.outputPath, bytes);
  return 'generated';
}

function insertAudio(items) {
  const byFile = new Map();
  for (const item of items) {
    if (!byFile.has(item.filePath)) byFile.set(item.filePath, []);
    byFile.get(item.filePath).push(item);
  }

  for (const [filePath, fileItems] of byFile) {
    let source = fs.readFileSync(filePath, 'utf8');
    for (const item of fileItems) {
      if (source.includes(item.publicPath)) continue;

      const lines = source.split('\n');
      const insertAt = item.transcriptStartLine - 1;
      lines.splice(insertAt, 0, audioMarkup(item.publicPath));
      source = lines.join('\n');
    }
    fs.writeFileSync(filePath, source);
  }
}

const items = extractItems();
console.log(JSON.stringify(items.map((item) => ({
  source: item.relativePath,
  line: item.headingLine,
  heading: item.headingText,
  chars: item.text.length,
  publicPath: item.publicPath,
})), null, 2));
console.log(`Found ${items.length} listening audio item(s).`);

if (mode === 'generate') {
  let generated = 0;
  let skipped = 0;
  for (const item of items) {
    const result = await generateAudio(item);
    if (result === 'generated') generated += 1;
    if (result === 'skipped') skipped += 1;
    console.log(`${result}: ${item.publicPath}`);
  }
  console.log(`Audio done. Generated ${generated}, skipped ${skipped}.`);
}

if (insert) {
  insertAudio(items);
  console.log('Inserted audio markup into markdown files.');
}
