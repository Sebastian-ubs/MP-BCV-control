import React from 'react';
import { TranslationPage } from './pages/TranslationPage';
import { I18nProvider } from './lib/i18n';
export function App() {
  return (
    <I18nProvider>
      <TranslationPage />
    </I18nProvider>);

}