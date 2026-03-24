import { BIBLE_BOOKS, BibleBook } from '../data/bibleBooks';
import { translations, Locale } from './translations';

export interface ParsedQuery {
  bookPart: string;
  chapter: number | null;
}

/**
 * Normalize a string for spaceless comparison: lowercase and remove all spaces.
 */
function normalize(s: string): string {
  return s.toLowerCase().replace(/\s+/g, '');
}

/** All searchable names for each book (English + translated), pre-computed */
const BOOK_SEARCH_NAMES: Map<
  string,
  {names: string[];normalized: string[];}> =
(() => {
  const map = new Map<string, {names: string[];normalized: string[];}>();
  const locales: Locale[] = ['en', 'fr', 'es'];

  for (const book of BIBLE_BOOKS) {
    const names = [
    book.name.toLowerCase(),
    book.abbrev.toLowerCase(),
    book.id.toLowerCase()];


    const entry = translations[book.name];
    if (entry) {
      for (const loc of locales) {
        if (entry[loc]) {
          const tName = entry[loc].toLowerCase();
          if (!names.includes(tName)) names.push(tName);
        }
      }
    }

    map.set(book.id, { names, normalized: names.map(normalize) });
  }

  return map;
})();

/**
 * Parse a search query into a book part and optional chapter number.
 */
export function parseSearchQuery(query: string): ParsedQuery {
  const trimmed = query.trim();
  if (!trimmed) return { bookPart: '', chapter: null };

  // 1. Try space-separated: "Genesis 5", "1 Corinthians 5", "gen 3a"
  const spaceMatch = trimmed.match(/^(.+?)\s+(\d+).*$/);
  if (spaceMatch) {
    return {
      bookPart: spaceMatch[1].trim(),
      chapter: parseInt(spaceMatch[2], 10)
    };
  }

  // 2. Try spaceless: "genesis5", "1kings2", "gen3a", "gen35-2"
  const spacelessMatch = trimmed.match(/^(.*[a-zA-Z])(\d+)/);
  if (spacelessMatch) {
    return {
      bookPart: spacelessMatch[1].trim(),
      chapter: parseInt(spacelessMatch[2], 10)
    };
  }

  return { bookPart: trimmed, chapter: null };
}

/**
 * Find books matching the book part of a query.
 */
export function findMatchingBooks(bookPart: string): BibleBook[] {
  if (!bookPart) return BIBLE_BOOKS;

  const q = bookPart.toLowerCase();
  const qNorm = normalize(bookPart);

  // Exact matches
  const exact = BIBLE_BOOKS.filter((b) => {
    const entry = BOOK_SEARCH_NAMES.get(b.id);
    if (!entry) return false;
    return (
      entry.names.some((n) => n === q) ||
      entry.normalized.some((n) => n === qNorm));

  });
  if (exact.length > 0) return exact;

  // Partial matches
  return BIBLE_BOOKS.filter((b) => {
    const entry = BOOK_SEARCH_NAMES.get(b.id);
    if (!entry) return false;
    return (
      entry.names.some((n) => n.includes(q)) ||
      entry.normalized.some((n) => n.includes(qNorm)));

  });
}

/**
 * Try to resolve a unique book from the book part.
 */
export function resolveUniqueBook(bookPart: string): BibleBook | null {
  if (!bookPart) return null;

  const q = bookPart.toLowerCase();
  const qNorm = normalize(bookPart);

  const exact = BIBLE_BOOKS.filter((b) => {
    const entry = BOOK_SEARCH_NAMES.get(b.id);
    if (!entry) return false;
    return (
      entry.names.some((n) => n === q) ||
      entry.normalized.some((n) => n === qNorm));

  });
  if (exact.length === 1) return exact[0];

  const partial = BIBLE_BOOKS.filter((b) => {
    const entry = BOOK_SEARCH_NAMES.get(b.id);
    if (!entry) return false;
    return (
      entry.names.some((n) => n.includes(q)) ||
      entry.normalized.some((n) => n.includes(qNorm)));

  });
  if (partial.length === 1) return partial[0];

  return null;
}

/**
 * Full resolution: parse query, find book, validate chapter.
 */
export function resolveNavigation(
query: string)
: {book: BibleBook;chapter: number;} | null {
  const { bookPart, chapter } = parseSearchQuery(query);
  if (!bookPart || chapter === null) return null;

  const book = resolveUniqueBook(bookPart);
  if (!book) return null;

  if (chapter < 1 || chapter > book.chapters) return null;

  return { book, chapter };
}