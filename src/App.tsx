/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Navbar, type NavPage } from './components/Navbar.tsx';
import { PlaygroundPage } from './components/PlaygroundPage.tsx';
import { DocsPage } from './components/DocsPage.tsx';
import { ApiPage } from './components/ApiPage.tsx';
import { ProductsPage } from './components/ProductsPage.tsx';
import { HomePage } from './components/HomePage.tsx';
import { Footer } from './components/Footer.tsx';

export default function App() {
  const [currentPage, setCurrentPage] = useState<NavPage>('playground');
  const [playgroundTarget, setPlaygroundTarget] = useState({
    url: 'https://en.wikipedia.org/wiki/Artificial_intelligence',
    selector: '#firstHeading',
    timestamp: Date.now(),
  });

  // Sync with browser hash if present (e.g. #docs, #api, #playground, #products)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (['playground', 'docs', 'products', 'api', 'home'].includes(hash)) {
        setCurrentPage(hash as NavPage);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (page: NavPage) => {
    setCurrentPage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLaunchPlayground = (targetUrl?: string, targetSelector?: string) => {
    if (targetUrl) {
      setPlaygroundTarget({
        url: targetUrl,
        selector: targetSelector || '#firstHeading',
        timestamp: Date.now(),
      });
    }
    handleNavigate('playground');
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-white selection:text-black">
      {/* Sticky Clean Header Navigation */}
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />

      {/* Main Dedicated Page Content */}
      <main className="flex-1">
        {currentPage === 'playground' && (
          <PlaygroundPage
            key={playgroundTarget.timestamp}
            initialUrl={playgroundTarget.url}
            initialSelector={playgroundTarget.selector}
          />
        )}

        {currentPage === 'home' && (
          <HomePage
            onNavigatePlayground={handleLaunchPlayground}
            onNavigateDocs={() => handleNavigate('docs')}
            onNavigateApi={() => handleNavigate('api')}
          />
        )}

        {currentPage === 'docs' && <DocsPage />}

        {currentPage === 'products' && (
          <ProductsPage onNavigatePlayground={() => handleNavigate('playground')} />
        )}

        {currentPage === 'api' && <ApiPage />}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
