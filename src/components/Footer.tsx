import { Zap, Github, Twitter, Instagram, Mail } from 'lucide-react';
import type { NavPage } from './Navbar.tsx';

interface FooterProps {
  onNavigate?: (page: NavPage) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="border-t border-zinc-850 bg-black text-zinc-400 py-10 text-xs font-mono">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-white text-black font-bold">
              <Zap className="h-3 w-3 fill-black stroke-black" />
            </div>
            <div>
              <span className="font-semibold text-white tracking-tight">GRAY SCRAPE</span>
              <p className="text-[11px] text-zinc-500 font-sans">Created by Graytell Labs · Owned by Anubhav Sapkota</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400">
            {onNavigate && (
              <>
                <button
                  type="button"
                  onClick={() => onNavigate('playground')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Playground
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('docs')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Docs
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('products')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Products
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('api')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  API
                </button>
                <span aria-hidden="true" className="text-zinc-800">·</span>
              </>
            )}

            <a
              href="https://x.com/GrayTell_Org"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <Twitter className="h-3.5 w-3.5" />
              <span>@GrayTell_Org</span>
            </a>

            <a
              href="https://www.instagram.com/GrayTell_Org"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <Instagram className="h-3.5 w-3.5" />
              <span>Instagram</span>
            </a>

            <a
              href="https://github.com/graytell"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <Github className="h-3.5 w-3.5" />
              <span>GitHub</span>
            </a>

            <a
              href="mailto:graytell.t@gmail.com"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <Mail className="h-3.5 w-3.5" />
              <span>Email</span>
            </a>
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500 font-sans gap-2">
          <p>© {new Date().getFullYear()} Gray Scrape by Graytell Labs (Owner: Anubhav Sapkota). All rights reserved.</p>
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <a href="/sitemap.xml" className="hover:text-white transition-colors">Sitemap</a>
            <span>·</span>
            <a href="/llms.txt" className="hover:text-white transition-colors">llms.txt</a>
            <span>·</span>
            <a href="/robots.txt" className="hover:text-white transition-colors">robots.txt</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
