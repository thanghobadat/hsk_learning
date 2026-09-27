import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import current data
const dataPath = path.resolve(__dirname, '../src/data/hsk1LessonsData.js');

// Helper to inject mnemonics
export function applyMnemonics(lessonsData, mnemonicsMap) {
  let updatedCount = 0;
  lessonsData.forEach(lesson => {
    const lessonMap = mnemonicsMap[lesson.number] || mnemonicsMap[lesson.id] || {};
    lesson.words.forEach(word => {
      if (lessonMap[word.hanzi]) {
        word.mnemonic = lessonMap[word.hanzi];
        updatedCount++;
      }
    });
  });
  return updatedCount;
}
