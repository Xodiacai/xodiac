import { Zap } from 'lucide-react';

export type NavPage = 'home' | 'playground' | 'docs' | 'products' | 'api';

interface NavbarProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
}

export function Navbar({ currentPage, onNavigate }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur-xl border-b border-zinc-850 transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
        {/* Minimalist Monochrome Logo */}
        <div
          className="flex items-center gap-2.5 cursor-pointer group"
          onClick={() => onNavigate('home')}
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-black transition-transform group-hover:scale-105 shadow-sm">
            <Zap className="h-3.5 w-3.5 fill-black stroke-black" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-white font-mono">
            GRAY SCRAPE
          </span>
        </div>

        {/* 4 Dedicated Pages Navigation Bar */}
        <nav className="flex items-center gap-2 sm:gap-4 text-xs font-medium font-mono">
          <button
            type="button"
            onClick={() => onNavigate('playground')}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              currentPage === 'playground'
                ? 'bg-zinc-800 text-white font-semibold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            Playground
          </button>

          <button
            type="button"
            onClick={() => onNavigate('docs')}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              currentPage === 'docs'
                ? 'bg-zinc-800 text-white font-semibold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            Docs
          </button>

          <button
            type="button"
            onClick={() => onNavigate('products')}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              currentPage === 'products'
                ? 'bg-zinc-800 text-white font-semibold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            Products
          </button>

          <button
            type="button"
            onClick={() => onNavigate('api')}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              currentPage === 'api'
                ? 'bg-zinc-800 text-white font-semibold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            API
          </button>
        </nav>
      </div>
    </header>
  );
}
