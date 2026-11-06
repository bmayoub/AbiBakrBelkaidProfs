import fs from 'fs';
import { CURRICULA } from '../src/data/curricula.js';
import { SYLLABUS_DATA } from '../src/data/syllabusData.js';

fs.writeFileSync('data/curricula_default.json', JSON.stringify(CURRICULA, null, 2), 'utf-8');
fs.writeFileSync('data/syllabus_default.json', JSON.stringify(SYLLABUS_DATA, null, 2), 'utf-8');

console.log('Defaults exported to data/ successfully!');
