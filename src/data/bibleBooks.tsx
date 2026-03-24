import React from 'react';
export type Testament = 'OT' | 'NT';
export interface BibleBook {
  id: string;
  name: string;
  abbrev: string;
  chapters: number;
  testament: Testament;
}
export const BIBLE_BOOKS: BibleBook[] = [
// Old Testament
{
  id: 'GEN',
  name: 'Genesis',
  abbrev: 'Gen',
  chapters: 50,
  testament: 'OT'
},
{
  id: 'EXO',
  name: 'Exodus',
  abbrev: 'Exo',
  chapters: 40,
  testament: 'OT'
},
{
  id: 'LEV',
  name: 'Leviticus',
  abbrev: 'Lev',
  chapters: 27,
  testament: 'OT'
},
{
  id: 'NUM',
  name: 'Numbers',
  abbrev: 'Num',
  chapters: 36,
  testament: 'OT'
},
{
  id: 'DEU',
  name: 'Deuteronomy',
  abbrev: 'Deu',
  chapters: 34,
  testament: 'OT'
},
{
  id: 'JOS',
  name: 'Joshua',
  abbrev: 'Jos',
  chapters: 24,
  testament: 'OT'
},
{
  id: 'JDG',
  name: 'Judges',
  abbrev: 'Jdg',
  chapters: 21,
  testament: 'OT'
},
{
  id: 'RUT',
  name: 'Ruth',
  abbrev: 'Rut',
  chapters: 4,
  testament: 'OT'
},
{
  id: '1SA',
  name: '1 Samuel',
  abbrev: '1Sa',
  chapters: 31,
  testament: 'OT'
},
{
  id: '2SA',
  name: '2 Samuel',
  abbrev: '2Sa',
  chapters: 24,
  testament: 'OT'
},
{
  id: '1KI',
  name: '1 Kings',
  abbrev: '1Ki',
  chapters: 22,
  testament: 'OT'
},
{
  id: '2KI',
  name: '2 Kings',
  abbrev: '2Ki',
  chapters: 25,
  testament: 'OT'
},
{
  id: '1CH',
  name: '1 Chronicles',
  abbrev: '1Ch',
  chapters: 29,
  testament: 'OT'
},
{
  id: '2CH',
  name: '2 Chronicles',
  abbrev: '2Ch',
  chapters: 36,
  testament: 'OT'
},
{
  id: 'EZR',
  name: 'Ezra',
  abbrev: 'Ezr',
  chapters: 10,
  testament: 'OT'
},
{
  id: 'NEH',
  name: 'Nehemiah',
  abbrev: 'Neh',
  chapters: 13,
  testament: 'OT'
},
{
  id: 'EST',
  name: 'Esther',
  abbrev: 'Est',
  chapters: 10,
  testament: 'OT'
},
{
  id: 'JOB',
  name: 'Job',
  abbrev: 'Job',
  chapters: 42,
  testament: 'OT'
},
{
  id: 'PSA',
  name: 'Psalms',
  abbrev: 'Psa',
  chapters: 150,
  testament: 'OT'
},
{
  id: 'PRO',
  name: 'Proverbs',
  abbrev: 'Pro',
  chapters: 31,
  testament: 'OT'
},
{
  id: 'ECC',
  name: 'Ecclesiastes',
  abbrev: 'Ecc',
  chapters: 12,
  testament: 'OT'
},
{
  id: 'SNG',
  name: 'Song of Solomon',
  abbrev: 'Sng',
  chapters: 8,
  testament: 'OT'
},
{
  id: 'ISA',
  name: 'Isaiah',
  abbrev: 'Isa',
  chapters: 66,
  testament: 'OT'
},
{
  id: 'JER',
  name: 'Jeremiah',
  abbrev: 'Jer',
  chapters: 52,
  testament: 'OT'
},
{
  id: 'LAM',
  name: 'Lamentations',
  abbrev: 'Lam',
  chapters: 5,
  testament: 'OT'
},
{
  id: 'EZK',
  name: 'Ezekiel',
  abbrev: 'Ezk',
  chapters: 48,
  testament: 'OT'
},
{
  id: 'DAN',
  name: 'Daniel',
  abbrev: 'Dan',
  chapters: 12,
  testament: 'OT'
},
{
  id: 'HOS',
  name: 'Hosea',
  abbrev: 'Hos',
  chapters: 14,
  testament: 'OT'
},
{
  id: 'JOL',
  name: 'Joel',
  abbrev: 'Jol',
  chapters: 3,
  testament: 'OT'
},
{
  id: 'AMO',
  name: 'Amos',
  abbrev: 'Amo',
  chapters: 9,
  testament: 'OT'
},
{
  id: 'OBA',
  name: 'Obadiah',
  abbrev: 'Oba',
  chapters: 1,
  testament: 'OT'
},
{
  id: 'JON',
  name: 'Jonah',
  abbrev: 'Jon',
  chapters: 4,
  testament: 'OT'
},
{
  id: 'MIC',
  name: 'Micah',
  abbrev: 'Mic',
  chapters: 7,
  testament: 'OT'
},
{
  id: 'NAM',
  name: 'Nahum',
  abbrev: 'Nam',
  chapters: 3,
  testament: 'OT'
},
{
  id: 'HAB',
  name: 'Habakkuk',
  abbrev: 'Hab',
  chapters: 3,
  testament: 'OT'
},
{
  id: 'ZEP',
  name: 'Zephaniah',
  abbrev: 'Zep',
  chapters: 3,
  testament: 'OT'
},
{
  id: 'HAG',
  name: 'Haggai',
  abbrev: 'Hag',
  chapters: 2,
  testament: 'OT'
},
{
  id: 'ZEC',
  name: 'Zechariah',
  abbrev: 'Zec',
  chapters: 14,
  testament: 'OT'
},
{
  id: 'MAL',
  name: 'Malachi',
  abbrev: 'Mal',
  chapters: 4,
  testament: 'OT'
},
// New Testament
{
  id: 'MAT',
  name: 'Matthew',
  abbrev: 'Mat',
  chapters: 28,
  testament: 'NT'
},
{
  id: 'MRK',
  name: 'Mark',
  abbrev: 'Mrk',
  chapters: 16,
  testament: 'NT'
},
{
  id: 'LUK',
  name: 'Luke',
  abbrev: 'Luk',
  chapters: 24,
  testament: 'NT'
},
{
  id: 'JHN',
  name: 'John',
  abbrev: 'Jhn',
  chapters: 21,
  testament: 'NT'
},
{
  id: 'ACT',
  name: 'Acts',
  abbrev: 'Act',
  chapters: 28,
  testament: 'NT'
},
{
  id: 'ROM',
  name: 'Romans',
  abbrev: 'Rom',
  chapters: 16,
  testament: 'NT'
},
{
  id: '1CO',
  name: '1 Corinthians',
  abbrev: '1Co',
  chapters: 16,
  testament: 'NT'
},
{
  id: '2CO',
  name: '2 Corinthians',
  abbrev: '2Co',
  chapters: 13,
  testament: 'NT'
},
{
  id: 'GAL',
  name: 'Galatians',
  abbrev: 'Gal',
  chapters: 6,
  testament: 'NT'
},
{
  id: 'EPH',
  name: 'Ephesians',
  abbrev: 'Eph',
  chapters: 6,
  testament: 'NT'
},
{
  id: 'PHP',
  name: 'Philippians',
  abbrev: 'Php',
  chapters: 4,
  testament: 'NT'
},
{
  id: 'COL',
  name: 'Colossians',
  abbrev: 'Col',
  chapters: 4,
  testament: 'NT'
},
{
  id: '1TH',
  name: '1 Thessalonians',
  abbrev: '1Th',
  chapters: 5,
  testament: 'NT'
},
{
  id: '2TH',
  name: '2 Thessalonians',
  abbrev: '2Th',
  chapters: 3,
  testament: 'NT'
},
{
  id: '1TI',
  name: '1 Timothy',
  abbrev: '1Ti',
  chapters: 6,
  testament: 'NT'
},
{
  id: '2TI',
  name: '2 Timothy',
  abbrev: '2Ti',
  chapters: 4,
  testament: 'NT'
},
{
  id: 'TIT',
  name: 'Titus',
  abbrev: 'Tit',
  chapters: 3,
  testament: 'NT'
},
{
  id: 'PHM',
  name: 'Philemon',
  abbrev: 'Phm',
  chapters: 1,
  testament: 'NT'
},
{
  id: 'HEB',
  name: 'Hebrews',
  abbrev: 'Heb',
  chapters: 13,
  testament: 'NT'
},
{
  id: 'JAS',
  name: 'James',
  abbrev: 'Jas',
  chapters: 5,
  testament: 'NT'
},
{
  id: '1PE',
  name: '1 Peter',
  abbrev: '1Pe',
  chapters: 5,
  testament: 'NT'
},
{
  id: '2PE',
  name: '2 Peter',
  abbrev: '2Pe',
  chapters: 3,
  testament: 'NT'
},
{
  id: '1JN',
  name: '1 John',
  abbrev: '1Jn',
  chapters: 5,
  testament: 'NT'
},
{
  id: '2JN',
  name: '2 John',
  abbrev: '2Jn',
  chapters: 1,
  testament: 'NT'
},
{
  id: '3JN',
  name: '3 John',
  abbrev: '3Jn',
  chapters: 1,
  testament: 'NT'
},
{
  id: 'JUD',
  name: 'Jude',
  abbrev: 'Jud',
  chapters: 1,
  testament: 'NT'
},
{
  id: 'REV',
  name: 'Revelation',
  abbrev: 'Rev',
  chapters: 22,
  testament: 'NT'
}];