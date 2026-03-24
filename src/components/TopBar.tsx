import React, { useEffect, useState } from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { CommandNavigator } from './CommandNavigator';
import type { NavigationHistoryEntry } from './CommandNavigator';
import { useT } from '../lib/i18n';
import { Button } from './ui/button';
export type WorkflowId =
'draft' |
'checking' |
'backtranslation' |
'sync' |
'help' |
'settings' |
'avatar' |
string;
interface TopBarProps {
  currentBookName: string;
  currentChapter: number;
  currentBookId?: string;
  onNavigate?: (bookId: string, chapter: number) => void;
  navigationHistory?: NavigationHistoryEntry[];
}
export function TopBar({
  currentBookName,
  currentChapter,
  currentBookId = 'JHN',
  onNavigate,
  navigationHistory = []
}: TopBarProps) {
  const { t } = useT();
  const [showNavigation, setShowNavigation] = useState(false);
  // Ctrl+K shortcut to open navigator
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowNavigation(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  const handleNavigate = (bookId: string, chapter: number) => {
    onNavigate?.(bookId, chapter);
  };
  return (
    <>
      <div className="h-12 border-b flex items-center px-4 bg-background">
        {/* Scripture location selector */}
        <div className="inline-flex rounded-md">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowNavigation(true)}
            className="flex items-center gap-2 px-3 py-1.5 h-auto group">
            
            <span className="font-serif font-bold text-foreground text-sm whitespace-nowrap capitalize">
              {t(currentBookName)} {currentChapter}
            </span>
            <ChevronDownIcon className="w-3 h-3 text-muted-foreground flex-shrink-0" />
          </Button>
        </div>
      </div>

      {/* CommandNavigator modal */}
      <CommandNavigator
        isOpen={showNavigation}
        onClose={() => setShowNavigation(false)}
        onNavigate={handleNavigate}
        currentBookId={currentBookId}
        currentChapter={currentChapter}
        navigationHistory={navigationHistory} />
      
    </>);

}