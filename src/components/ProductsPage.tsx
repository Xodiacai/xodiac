import { Zap, ShieldCheck, Layers, Cpu, Check, X, ArrowRight } from 'lucide-react';
import { Button } from './ui/button.tsx';
import { Card } from './ui/card.tsx';

interface ProductsPageProps {
  onNavigatePlayground: () => void;
}

export function ProductsPage({ onNavigatePlayground }: ProductsPageProps) {
  const BENCHMARKS = [
    {
      feature: 'Speed (Requests / sec)',
      grayScrape: '180+ req/s',
      bs4: '120 req/s',
      playwright: '12 req/s',
      scrapy: '140 req/s',
    },
    {
      feature: 'Adaptive Element Relocation',
      grayScrape: 'Native (Auto-healing)',
      bs4: 'None (Throws Error)',
      playwright: 'None (Timeout)',
      scrapy: 'None (Requires update)',
    },
    {
      feature: 'Cloudflare Turnstile Bypass',
      grayScrape: 'Yes (Stealth TLS)',
      bs4: 'Blocked (403)',
      playwright: 'Requires heavy plugins',
      scrapy: 'Blocked (403)',
    },
    {
      feature: 'RAM Memory Footprint',
      grayScrape: '~25 MB',
      bs4: '~20 MB',
      playwright: '~350 MB',
      scrapy: '~45 MB',
    },
    {
      feature: 'JavaScript Dynamic Execution',
      grayScrape: 'Optional (Camoufox Engine)',
      bs4: 'No',
      playwright: 'Yes',
      scrapy: 'Requires Splash plugin',
    },
  ];

  return (
    <div className="w-full bg-black min-h-[calc(100vh-5rem)] text-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-950 text-xs font-mono text-zinc-400">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            <span>GRAY SCRAPE ARCHITECTURE & BENCHMARKS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Engineered for Zero Maintenance
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed font-normal">
            Gray Scrape is a free unlimited scraper in the world. Traditional web scrapers break the moment website developers change a CSS class name.
            Gray Scrape combines low-level TLS fingerprinting with semantic tree heuristics to make scrapers self-healing.
          </p>
        </div>

        {/* 3 Core Architecture Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-zinc-850 bg-zinc-950 p-6 space-y-4">
            <div className="h-10 w-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Adaptive Element Relocator
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-normal">
              When target websites deploy new builds and mutate class names (like <code className="text-zinc-200">.btn_9x1</code> to <code className="text-zinc-200">.btn_v2</code>),
              Gray Scrape evaluates structural DOM distance, ancestor hierarchy, and node signatures to relocate elements without manual fixes.
            </p>
          </Card>

          <Card className="border-zinc-850 bg-zinc-950 p-6 space-y-4">
            <div className="h-10 w-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Stealth TLS Fingerprinting
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-normal">
              Bypasses modern anti-bot systems (Cloudflare, Akamai, Turnstile) by shaping cipher suites, ALPN protocols,
              and HTTP/2 headers to match real desktop Chrome and Firefox clients perfectly.
            </p>
          </Card>

          <Card className="border-zinc-850 bg-zinc-950 p-6 space-y-4">
            <div className="h-10 w-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white">
              <Cpu className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Zero-Overhead Parsing
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-normal">
              Built on high-performance C-bindings and optimized lxml trees, Gray Scrape extracts content in under 15ms per document
              with a tiny memory footprint.
            </p>
          </Card>
        </div>

        {/* Benchmark Comparison Matrix */}
        <Card className="border-zinc-850 bg-zinc-950 overflow-hidden shadow-2xl">
          <div className="p-5 border-b border-zinc-850 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Framework Comparison Matrix
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">Gray Scrape vs Popular Web Scraping Frameworks</p>
            </div>
            <Button
              onClick={onNavigatePlayground}
              variant="outline"
              size="sm"
              className="text-xs font-mono border-zinc-800"
            >
              <span>Test in Playground</span>
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-zinc-900/60 border-b border-zinc-850 text-zinc-400">
                <tr>
                  <th className="p-4 font-semibold text-zinc-300">Feature / Metric</th>
                  <th className="p-4 font-bold text-white bg-zinc-900">Gray Scrape v2.5</th>
                  <th className="p-4 font-normal text-zinc-400">BeautifulSoup4</th>
                  <th className="p-4 font-normal text-zinc-400">Playwright</th>
                  <th className="p-4 font-normal text-zinc-400">Scrapy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850/60">
                {BENCHMARKS.map((row, i) => (
                  <tr key={i} className="hover:bg-zinc-900/30 transition-colors">
                    <td className="p-4 text-zinc-300 font-sans font-medium">{row.feature}</td>
                    <td className="p-4 text-white font-bold bg-zinc-900/40">{row.grayScrape}</td>
                    <td className="p-4 text-zinc-400">{row.bs4}</td>
                    <td className="p-4 text-zinc-400">{row.playwright}</td>
                    <td className="p-4 text-zinc-400">{row.scrapy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
