import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { LESSONS_2_TO_6 } from './data_lessons_2_to_6.mjs';
import { LESSONS_7_TO_11 } from './data_lessons_7_to_11.mjs';
import { LESSONS_12_TO_16 } from './data_lessons_12_to_16.mjs';
import { LESSONS_17_TO_20 } from './data_lessons_17_to_20.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.resolve(__dirname, '../src/data/hsk1LessonsData.js');

const ALL_MAPS = {
  ...LESSONS_2_TO_6,
  ...LESSONS_7_TO_11,
  ...LESSONS_12_TO_16,
  ...LESSONS_17_TO_20
};

// Global fallback dictionary for repeated words or shared stems
const GLOBAL_DICT = {};
Object.values(ALL_MAPS).forEach(map => {
  Object.entries(map).forEach(([k, v]) => {
    GLOBAL_DICT[k] = v;
  });
});

async function main() {
  const mod = await import('../src/data/hsk1LessonsData.js');
  const lessons = mod.HSK1_LESSONS;

  let totalWords = 0;
  let hasMnemonic = 0;
  let missing = [];

  lessons.forEach(lesson => {
    const lessonNum = lesson.number;
    const lessonMap = ALL_MAPS[lessonNum] || {};

    lesson.words.forEach(word => {
      totalWords++;
      if (!word.mnemonic) {
        if (lessonMap[word.hanzi]) {
          word.mnemonic = lessonMap[word.hanzi];
        } else if (GLOBAL_DICT[word.hanzi]) {
          word.mnemonic = GLOBAL_DICT[word.hanzi];
        } else {
          missing.push({ lesson: lessonNum, hanzi: word.hanzi, meaning: word.meaning });
        }
      }
      if (word.mnemonic) {
        hasMnemonic++;
      }
    });
  });

  console.log(`Total words: ${totalWords}`);
  console.log(`Has mnemonic: ${hasMnemonic} / ${totalWords} (${((hasMnemonic / totalWords) * 100).toFixed(1)}%)`);

  if (missing.length > 0) {
    console.log('Missing mnemonics for words:', missing);
  }

  // Format code cleanly
  const fileContent = `// Dữ liệu 20 Bài Học Chuẩn HSK 3.0 Mới Nhất (Cấp Độ HSK 1 - 500 từ vựng & 48 điểm ngữ pháp)
export const HSK1_LESSONS = ${JSON.stringify(lessons, null, 2)};
`;

  fs.writeFileSync(DATA_FILE, fileContent, 'utf8');
  console.log('Successfully wrote updated HSK1_LESSONS to', DATA_FILE);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
