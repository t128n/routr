import { useState, useEffect } from 'react';
import App from './page';
import { MarkdownDemo } from './markdown-demo';

/**
 * Hauptkomponente für die Anwendungsrouting
 */
export function Router() {
  const [currentPage, setCurrentPage] = useState<'home' | 'markdown'>('home');

  // URL basiertes Routing
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/markdown') {
      setCurrentPage('markdown');
    } else {
      setCurrentPage('home');
    }
  }, []);

  // Navigations-Handler
  const navigate = (page: 'home' | 'markdown') => {
    setCurrentPage(page);
    window.history.pushState(null, '', page === 'home' ? '/' : `/${page}`);
  };

  // Seiten-Renderer
  const renderPage = () => {
    switch (currentPage) {
      case 'markdown':
        return <MarkdownDemo />;
      default:
        return <App />;
    }
  };

  return (
    <div>
      <nav className="bg-primary/10 p-2">
        <ul className="flex gap-4 justify-center">
          <li>
            <button 
              onClick={() => navigate('home')}
              className={`px-4 py-2 rounded ${currentPage === 'home' ? 'bg-primary text-white' : 'hover:bg-primary/20'}`}
            >
              Startseite
            </button>
          </li>
          <li>
            <button 
              onClick={() => navigate('markdown')}
              className={`px-4 py-2 rounded ${currentPage === 'markdown' ? 'bg-primary text-white' : 'hover:bg-primary/20'}`}
            >
              Markdown Demo
            </button>
          </li>
        </ul>
      </nav>
      {renderPage()}
    </div>
  );
} 