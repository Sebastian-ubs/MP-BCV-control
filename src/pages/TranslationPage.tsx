import React, { useCallback, useEffect, useState } from 'react';
import { TopBar } from '../components/TopBar';
import { BIBLE_BOOKS } from '../data/bibleBooks';
import type { NavigationHistoryEntry } from '../components/CommandNavigator';
import { useT } from '../lib/i18n';
export function TranslationPage() {
  const { t } = useT();
  const [currentBookId, setCurrentBookId] = useState('JHN');
  const [currentChapter, setCurrentChapter] = useState(1);
  const [navigationHistory, setNavigationHistory] = useState<
    NavigationHistoryEntry[]>(
    []);
  const bookName =
  BIBLE_BOOKS.find((b) => b.id === currentBookId)?.name || 'John';
  useEffect(() => {
    const book = BIBLE_BOOKS.find((b) => b.id === currentBookId);
    if (!book) return;
    setNavigationHistory((prev) => {
      const filtered = prev.filter(
        (e) => !(e.bookId === currentBookId && e.chapter === currentChapter)
      );
      const newEntry: NavigationHistoryEntry = {
        bookId: currentBookId,
        bookName: book.name,
        chapter: currentChapter
      };
      return [newEntry, ...filtered].slice(0, 10);
    });
  }, [currentBookId, currentChapter]);
  const handleNavigate = useCallback((bookId: string, chapter: number) => {
    setCurrentBookId(bookId);
    setCurrentChapter(chapter);
  }, []);
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <TopBar
        currentBookName={bookName}
        currentChapter={currentChapter}
        currentBookId={currentBookId}
        onNavigate={handleNavigate}
        navigationHistory={navigationHistory} />
      

      <div className="flex-1 flex items-center justify-center text-muted-foreground p-8 text-center">
        <div>
          <h2 className="text-2xl font-serif font-bold text-foreground mb-2">
            {t(bookName)} {currentChapter}
          </h2>
          <p>
            {t('Press')}{' '}
            <kbd className="px-2 py-1 bg-muted rounded-md font-mono text-xs mx-1">
              Ctrl+K
            </kbd>{' '}
            {t('or click the book name to navigate.')}
          </p>
        </div>
      </div>
    </div>);

}