import { ArrowRight, Terminal, RefreshCw, Shield, Code2 } from 'lucide-react';
import { Button } from './ui/button.tsx';

interface HeroProps {
  onLaunchDemo: (url: string, selector?: string) => void;
  onExplorePlayground: () => void;
}

export function Hero({ onLaunchDemo, onExplorePlayground }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24">
      {/* Subtle monochrome ambient light */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(255,255,255,0.08),rgba(0,0,0,0))] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Subtle monochrome kicker */}
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-zinc-400 uppercase mb-6 border border-zinc-800 bg-zinc-950/80 px-3 py-1 rounded-full">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            <span>Adaptive Scraping Engine</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span>Zero-Breakage Architecture</span>
          </div>

          {/* Main Headline with Geist font hierarchy */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tighter text-white leading-[1.05]">
            Web scraping that <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-500">
              never breaks
            </span>{' '}
            when pages change.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-zinc-400 font-normal leading-relaxed max-w-2xl mx-auto">
            Gray Scrape is a free unlimited scraper in the world. Engineered with adaptive element fingerprinting and stealth extraction.
            Extract clean articles, bypass anti-bot shields, and auto-relocate elements even
            when CSS classes mutate.
          </p>

          {/* Action Buttons in Black & White */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              onClick={onExplorePlayground}
              variant="default"
              size="lg"
              className="px-6 h-11 text-sm font-semibold tracking-tight"
            >
              <span>Open Playground</span>
              <ArrowRight className="h-4 w-4" />
            </Button>

            <Button
              onClick={() => onLaunchDemo('https://en.wikipedia.org/wiki/Artificial_intelligence', '#firstHeading')}
              variant="outline"
              size="lg"
              className="px-6 h-11 text-sm"
            >
              <Terminal className="h-4 w-4" />
              <span>Test Wikipedia Demo</span>
            </Button>
          </div>

          {/* Quick preset targets */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-xs text-zinc-400">
            <span className="text-zinc-500 font-mono">Sample targets:</span>
            <button
              onClick={() => onLaunchDemo('https://en.wikipedia.org/wiki/Artificial_intelligence', '#firstHeading')}
              className="px-2.5 py-1 rounded border border-zinc-800 bg-zinc-950 text-zinc-300 hover:text-white hover:border-zinc-600 transition-colors cursor-pointer"
            >
              Wikipedia AI
            </button>
            <button
              onClick={() => onLaunchDemo('https://news.ycombinator.com', '.titleline > a')}
              className="px-2.5 py-1 rounded border border-zinc-800 bg-zinc-950 text-zinc-300 hover:text-white hover:border-zinc-600 transition-colors cursor-pointer"
            >
              Hacker News
            </button>
            <button
              onClick={() => onLaunchDemo('https://openai.com/research', 'h1')}
              className="px-2.5 py-1 rounded border border-zinc-800 bg-zinc-950 text-zinc-300 hover:text-white hover:border-zinc-600 transition-colors cursor-pointer"
            >
              OpenAI Research
            </button>
            <button
              onClick={() => onLaunchDemo('https://techcrunch.com/category/artificial-intelligence/', 'h2.wp-block-post-title a')}
              className="px-2.5 py-1 rounded border border-zinc-800 bg-zinc-950 text-zinc-300 hover:text-white hover:border-zinc-600 transition-colors cursor-pointer"
            >
              TechCrunch AI
            </button>
          </div>
        </div>

        {/* Live Architecture Visual Card in Monochrome */}
        <div className="mt-14 max-w-4xl mx-auto rounded-xl border border-zinc-800 bg-zinc-950 p-5 sm:p-6 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-zinc-850 pb-4 mb-5">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-700 inline-block" />
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-700 inline-block" />
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-700 inline-block" />
              <span className="ml-3 font-mono text-xs text-zinc-400">
                gray_scrape_daemon.ts
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
              <span className="text-white font-medium">TLS 1.3 Spoofing</span>
              <span>·</span>
              <span>HTTP/3 Ready</span>
              <span>·</span>
              <span>Bot Mitigation</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Feature 1 */}
            <div className="rounded-lg border border-zinc-850 bg-black p-4 transition-all hover:border-zinc-700">
              <div className="flex items-center gap-2 text-white mb-2">
                <RefreshCw className="h-4 w-4 text-zinc-300" />
                <span className="text-sm font-semibold text-white">Adaptive Relocation</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                When classes change to dynamic hashes like <code className="text-white bg-zinc-900 px-1 py-0.5 rounded text-[11px]">.x7a9_title</code>,
                Gray Scrape computes multi-factor fingerprint vectors to re-match the exact target node.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-lg border border-zinc-850 bg-black p-4 transition-all hover:border-zinc-700">
              <div className="flex items-center gap-2 text-white mb-2">
                <Shield className="h-4 w-4 text-zinc-300" />
                <span className="text-sm font-semibold text-white">StealthyFetcher</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                Spoofs real Chromium fingerprint, Sec-Ch-Ua client hints, realistic header ordering, and TLS ciphers
                to bypass bot defenses without heavy headless browsers.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-lg border border-zinc-850 bg-black p-4 transition-all hover:border-zinc-700">
              <div className="flex items-center gap-2 text-white mb-2">
                <Code2 className="h-4 w-4 text-zinc-300" />
                <span className="text-sm font-semibold text-white">Reader & LLM Markdown</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                Strips cookie banners, navs, ads, and popups. Distills pristine structured Markdown with headings, tables,
                and metadata ready for RAG pipelines.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
