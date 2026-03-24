import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import {
  ArrowLeftIcon,
  BookOpenIcon,
  HashIcon,
  CornerDownLeftIcon,
  ClockIcon,
  SearchIcon } from
'lucide-react';
import { BIBLE_BOOKS, BibleBook } from '../data/bibleBooks';
import {
  parseSearchQuery,
  findMatchingBooks,
  resolveUniqueBook,
  resolveNavigation } from
'../lib/bibleSearch';
import { useT } from '../lib/i18n';
import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandEmpty } from
'./ui/command';
import { Dialog, DialogContent } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { cn } from '../lib/utils';
export interface NavigationHistoryEntry {
  bookId: string;
  bookName: string;
  chapter: number;
}
interface CommandNavigatorProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (bookId: string, chapter: number) => void;
  currentBookId: string;
  currentChapter: number;
  navigationHistory?: NavigationHistoryEntry[];
}
export function CommandNavigator({
  isOpen,
  onClose,
  onNavigate,
  currentBookId,
  currentChapter,
  navigationHistory = []
}: CommandNavigatorProps) {
  const { t } = useT();
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [focusedChapter, setFocusedChapter] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const chapterGridRef = useRef<HTMLDivElement>(null);
  const chapterScrollRef = useRef<HTMLDivElement>(null);
  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setFocusedIndex(-1);
      setFocusedChapter(-1);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);
  // Scroll to current book when opening with empty search
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      if (!listRef.current || searchQuery) return;
      const currentBookBtn = listRef.current.querySelector(
        `[data-book-id="${currentBookId}"]`
      ) as HTMLElement;
      if (currentBookBtn) {
        currentBookBtn.scrollIntoView({
          block: 'center',
          behavior: 'instant'
        });
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [isOpen, currentBookId, searchQuery]);
  const parsed = useMemo(() => parseSearchQuery(searchQuery), [searchQuery]);
  const directMatch = useMemo(
    () => resolveNavigation(searchQuery),
    [searchQuery]
  );
  const uniqueBookMatch = useMemo(() => {
    if (parsed.chapter !== null) return null;
    const book = resolveUniqueBook(parsed.bookPart);
    if (!book) return null;
    if (book.chapters === 1) return null;
    return book;
  }, [parsed]);
  const singleChapterMatch = useMemo(() => {
    if (parsed.chapter !== null) return null;
    const book = resolveUniqueBook(parsed.bookPart);
    if (!book || book.chapters !== 1) return null;
    return {
      book,
      chapter: 1
    };
  }, [parsed]);
  const effectiveDirectMatch = directMatch || singleChapterMatch;
  const resolvedBook = effectiveDirectMatch?.book || uniqueBookMatch || null;
  const filteredBooks = useMemo(() => {
    if (resolvedBook) return [];
    return findMatchingBooks(parsed.bookPart);
  }, [parsed.bookPart, resolvedBook]);
  const showHistory =
  !searchQuery && !resolvedBook && navigationHistory.length > 0;
  useEffect(() => {
    setFocusedIndex(-1);
  }, [filteredBooks.length]);
  useEffect(() => {
    setFocusedChapter(-1);
  }, [resolvedBook?.id]);
  useEffect(() => {
    if (focusedIndex < 0 || !listRef.current) return;
    const buttons = listRef.current.querySelectorAll('[data-book-item]');
    const el = buttons[focusedIndex] as HTMLElement;
    if (el)
    el.scrollIntoView({
      block: 'nearest'
    });
  }, [focusedIndex]);
  useEffect(() => {
    if (!chapterGridRef.current || !chapterScrollRef.current) return;
    const targetChapter =
    focusedChapter >= 0 ?
    focusedChapter :
    effectiveDirectMatch ?
    effectiveDirectMatch.chapter - 1 :
    -1;
    if (targetChapter < 0) return;
    const buttons =
    chapterGridRef.current.querySelectorAll('[data-chapter-btn]');
    const el = buttons[targetChapter] as HTMLElement;
    if (el)
    el.scrollIntoView({
      block: 'nearest',
      behavior: 'smooth'
    });
  }, [focusedChapter, effectiveDirectMatch]);
  const getGridCols = useCallback((): number => {
    if (!chapterGridRef.current) return 10;
    const buttons =
    chapterGridRef.current.querySelectorAll('[data-chapter-btn]');
    if (buttons.length < 2) return 1;
    const firstTop = (buttons[0] as HTMLElement).offsetTop;
    let cols = 0;
    for (let i = 0; i < buttons.length; i++) {
      if ((buttons[i] as HTMLElement).offsetTop === firstTop) cols++;else
      break;
    }
    return cols || 1;
  }, []);
  const handleBookSelect = (book: BibleBook) => {
    setSearchQuery(book.name + ' ');
    setFocusedIndex(-1);
    setFocusedChapter(-1);
    inputRef.current?.focus();
  };
  const handleChapterSelect = (book: BibleBook, chapter: number) => {
    onNavigate(book.id, chapter);
    onClose();
  };
  const focusInput = () => {
    setFocusedIndex(-1);
    setFocusedChapter(-1);
    inputRef.current?.focus();
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (resolvedBook && searchQuery) {
        setSearchQuery('');
        setFocusedChapter(-1);
        e.stopPropagation();
        e.preventDefault();
      } else {
        onClose();
      }
      return;
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      e.stopPropagation();
      if (e.shiftKey) {
        focusInput();
      } else {
        if (resolvedBook) {
          setFocusedChapter(0);
        } else if (filteredBooks.length > 0) {
          setFocusedIndex(0);
        }
      }
      return;
    }
    // === CHAPTER GRID NAVIGATION ===
    if (resolvedBook && focusedChapter >= 0) {
      const totalChapters = resolvedBook.chapters;
      const cols = getGridCols();
      const updateChapterFocus = (newIndex: number) => {
        setFocusedChapter(newIndex);
        setSearchQuery(resolvedBook.name + ' ' + (newIndex + 1));
      };
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (focusedChapter < totalChapters - 1)
        updateChapterFocus(focusedChapter + 1);
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (focusedChapter > 0) updateChapterFocus(focusedChapter - 1);
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = focusedChapter + cols;
        if (next < totalChapters) updateChapterFocus(next);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const next = focusedChapter - cols;
        if (next < 0) focusInput();else
        updateChapterFocus(next);
        return;
      }
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleChapterSelect(resolvedBook, focusedChapter + 1);
        return;
      }
      return;
    }
    // === BOOK LIST NAVIGATION ===
    if (!resolvedBook && filteredBooks.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        e.stopPropagation();
        if (focusedIndex < 0) {
          setFocusedIndex(0);
        } else {
          const next = focusedIndex + 1;
          if (next < filteredBooks.length) setFocusedIndex(next);
        }
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        e.stopPropagation();
        if (focusedIndex < 0) return;
        const next = focusedIndex - 1;
        if (next < 0) focusInput();else
        setFocusedIndex(next);
        return;
      }
    }
    // === INPUT-LEVEL NAVIGATION ===
    if (resolvedBook && focusedChapter < 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const startIndex = effectiveDirectMatch ?
        effectiveDirectMatch.chapter - 1 :
        0;
        setFocusedChapter(startIndex);
        setSearchQuery(resolvedBook.name + ' ' + (startIndex + 1));
        return;
      }
    }
    if (
    e.key === 'Enter' ||
    e.key === ' ' && !resolvedBook && focusedIndex >= 0)
    {
      if (
      !resolvedBook &&
      focusedIndex >= 0 &&
      focusedIndex < filteredBooks.length)
      {
        e.preventDefault();
        handleBookSelect(filteredBooks[focusedIndex]);
        return;
      }
      if (e.key === 'Enter') {
        if (effectiveDirectMatch) {
          onNavigate(effectiveDirectMatch.book.id, effectiveDirectMatch.chapter);
          onClose();
          return;
        }
        if (!resolvedBook && filteredBooks.length === 1) {
          handleBookSelect(filteredBooks[0]);
          return;
        }
      }
    }
  };
  const hintText = useMemo(() => {
    if (focusedChapter >= 0 && resolvedBook) {
      return `${t('Enter to go to')} ${t(resolvedBook.name)} ${focusedChapter + 1}`;
    }
    if (effectiveDirectMatch) {
      return `${t('Press Enter to go to')} ${t(effectiveDirectMatch.book.name)} ${effectiveDirectMatch.chapter}`;
    }
    if (uniqueBookMatch) {
      return t('Type a chapter number or click to select');
    }
    if (filteredBooks.length === 1 && parsed.bookPart) {
      return `↓ ${t('Enter to select')} ${t(filteredBooks[0].name)}`;
    }
    if (focusedIndex >= 0 && focusedIndex < filteredBooks.length) {
      return `${t('Enter to select')} ${t(filteredBooks[focusedIndex].name)}`;
    }
    if (showHistory) {
      return `${navigationHistory.length} ${t('recent')} · ${filteredBooks.length} ${t('books')} · ${t('Search books… e.g. "GEN 5" or "Genesis 5"')}`;
    }
    return `${filteredBooks.length} ${t('books available')} · ${t('Search books… e.g. "GEN 5" or "Genesis 5"')}`;
  }, [
  effectiveDirectMatch,
  uniqueBookMatch,
  filteredBooks,
  parsed.bookPart,
  focusedIndex,
  focusedChapter,
  resolvedBook,
  showHistory,
  navigationHistory.length,
  t]
  );
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}>
      
      <DialogContent className="overflow-hidden p-0" showCloseButton={false}>
        <Command
          className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground"
          shouldFilter={false}>
          
          {/* Custom input wrapper with optional back button */}
          <div className="flex items-center border-b px-3">
            {resolvedBook ?
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 mr-2"
              onClick={() => {
                setSearchQuery('');
                setFocusedChapter(-1);
                inputRef.current?.focus();
              }}>
              
                <ArrowLeftIcon className="h-4 w-4" />
              </Button> :

            <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            }
            <input
              ref={inputRef}
              value={searchQuery}
              onChange={(e) => {
                const val = e.target.value;
                setSearchQuery(val);
                setFocusedChapter(-1);
                setFocusedIndex(-1);
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                setFocusedChapter(-1);
                setFocusedIndex(-1);
              }}
              placeholder={t('Search books… e.g. "GEN 5" or "Genesis 5"')}
              autoFocus
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50" />
            
          </div>

          {/* Direct match banner */}
          {effectiveDirectMatch &&
          <div className="px-4 py-2 bg-muted border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CornerDownLeftIcon className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-sm text-foreground">
                  {t('Go to')}{' '}
                  <span className="font-serif font-bold">
                    {t(effectiveDirectMatch.book.name)}{' '}
                    {effectiveDirectMatch.chapter}
                  </span>
                </span>
              </div>
              <Badge variant="secondary">ENTER</Badge>
            </div>
          }

          {/* Unique book match banner */}
          {!effectiveDirectMatch && uniqueBookMatch &&
          <div className="px-4 py-2 bg-muted border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CornerDownLeftIcon className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-sm text-foreground">
                  {t('Select chapter in')}{' '}
                  <span className="font-serif font-semibold">
                    {t(uniqueBookMatch.name)}
                  </span>
                </span>
              </div>
            </div>
          }

          {/* Sticky chapter header */}
          {resolvedBook &&
          <div className="px-4 py-3 flex items-baseline justify-between border-b">
              <h3 className="font-serif text-lg font-bold">
                {t(resolvedBook.name)}
              </h3>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                {resolvedBook.chapters} {t('Chapters')}
              </span>
            </div>
          }

          {/* Navigation History Section */}
          {!resolvedBook && showHistory &&
          <div className="px-2 py-2 border-b">
              <div className="flex items-center gap-1.5 px-2 mb-2">
                <ClockIcon className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">
                  {t('Recent')}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                {navigationHistory.map((entry, idx) => {
                const isCurrent =
                entry.bookId === currentBookId &&
                entry.chapter === currentChapter;
                return (
                  <button
                    key={`history-${idx}`}
                    tabIndex={-1}
                    onClick={() => {
                      onNavigate(entry.bookId, entry.chapter);
                      onClose();
                    }}
                    className={cn(
                      'flex items-center justify-between px-2 py-1.5 rounded-sm text-sm outline-none transition-colors w-full',
                      isCurrent ?
                      'bg-accent text-accent-foreground' :
                      'hover:bg-accent hover:text-accent-foreground'
                    )}>
                    
                      <span className="font-serif">
                        {t(entry.bookName)} {entry.chapter}
                      </span>
                      {isCurrent &&
                    <Badge variant="secondary" className="text-[10px]">
                          {t('Current')}
                        </Badge>
                    }
                    </button>);

              })}
              </div>
            </div>
          }

          {/* Content Area */}
          {resolvedBook ?
          <div
            ref={chapterScrollRef}
            className="max-h-[300px] overflow-y-auto overflow-x-hidden p-4">
            
              <div
              ref={chapterGridRef}
              className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
              
                {Array.from({
                length: resolvedBook.chapters
              }).map((_, i) => {
                const chapter = i + 1;
                const isMatched = effectiveDirectMatch?.chapter === chapter;
                const isCurrent =
                resolvedBook.id === currentBookId &&
                chapter === currentChapter;
                const isFocused = focusedChapter === i;
                return (
                  <Button
                    key={chapter}
                    data-chapter-btn
                    tabIndex={-1}
                    variant={
                    isFocused || isMatched ?
                    'default' :
                    isCurrent ?
                    'secondary' :
                    'outline'
                    }
                    onClick={() => handleChapterSelect(resolvedBook, chapter)}
                    className={cn(
                      'aspect-square p-0 h-auto font-mono',
                      isFocused && 'ring-2 ring-ring ring-offset-2'
                    )}>
                    
                      {chapter}
                    </Button>);

              })}
              </div>
            </div> :

          <CommandList ref={listRef}>
              <CommandGroup heading={showHistory ? t('All Books') : undefined}>
                {filteredBooks.map((book, idx) => {
                const isFocused = focusedIndex === idx;
                return (
                  <CommandItem
                    key={book.id}
                    data-book-item
                    data-book-id={book.id}
                    onSelect={() => handleBookSelect(book)}
                    aria-selected={isFocused}
                    className={cn(
                      'flex items-center justify-between w-full',
                      currentBookId === book.id &&
                      !isFocused &&
                      'bg-accent/50',
                      isFocused && 'bg-accent text-accent-foreground'
                    )}>
                    
                      <div className="flex items-center gap-2">
                        <span className="font-serif">{t(book.name)}</span>
                        <span className="font-mono text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100">
                          {book.id}
                        </span>
                      </div>
                      {currentBookId === book.id && !isFocused &&
                    <Badge variant="secondary" className="text-[10px]">
                          {t('Current')}
                        </Badge>
                    }
                    </CommandItem>);

              })}
              </CommandGroup>
              {filteredBooks.length === 0 &&
            <CommandEmpty>
                  {t('No books found matching')} &ldquo;{searchQuery}&rdquo;
                </CommandEmpty>
            }
            </CommandList>
          }

          {/* Footer */}
          <div className="px-4 py-2 border-t flex justify-between items-center text-xs text-muted-foreground">
            <span>{hintText}</span>
            <div className="flex gap-3">
              <span className="flex items-center gap-1">
                <BookOpenIcon className="w-3 h-3" />
                <span>{t('Book')}</span>
              </span>
              <span className="flex items-center gap-1">
                <HashIcon className="w-3 h-3" />
                <span>{t('Chapter')}</span>
              </span>
            </div>
          </div>
        </Command>
      </DialogContent>
    </Dialog>);

}