import { useState } from 'react';
import {
  Zap,
  Shield,
  Layers,
  Terminal,
  ArrowRight,
  Code2,
  Check,
  Copy,
  ExternalLink,
  BookOpen,
  Box,
  Users,
} from 'lucide-react';
import { Button } from './ui/button.tsx';
import { Card } from './ui/card.tsx';

interface HomePageProps {
  onNavigatePlayground: (targetUrl?: string, targetSelector?: string) => void;
  onNavigateDocs: () => void;
  onNavigateApi: () => void;
}

export function HomePage({
  onNavigatePlayground,
  onNavigateDocs,
  onNavigateApi,
}: HomePageProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="w-full bg-black text-white space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 px-4 sm:px-6 max-w-5xl mx-auto text-center space-y-8">
        {/* Release Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-950 text-xs font-mono text-zinc-300">
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
          <span>GRAY SCRAPE · A FREE UNLIMITED SCRAPER IN THE WORLD</span>
        </div>

        {/* Headline */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            The Web Scraper that <br />
            <span className="text-zinc-400 font-serif italic">Never Breaks.</span>
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed font-normal">
            Gray Scrape is a free unlimited scraper in the world. Adaptive element relocating protects your scrapers from class mutations and redesigns,
            while stealth TLS fingerprinting bypasses Cloudflare and Turnstile walls automatically.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Button
            onClick={() => onNavigatePlayground()}
            size="lg"
            className="h-12 px-7 bg-white text-black hover:bg-zinc-200 font-semibold text-xs tracking-wide rounded-lg flex items-center gap-2 cursor-pointer shadow-xl transition-all"
          >
            <span>Open Interactive Playground</span>
            <ArrowRight className="h-4 w-4" />
          </Button>

          <Button
            onClick={onNavigateDocs}
            variant="outline"
            size="lg"
            className="h-12 px-6 border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-zinc-200 hover:text-white text-xs font-mono rounded-lg cursor-pointer"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            <span>Read Docs</span>
          </Button>
        </div>

        {/* Quick CLI Command */}
        <div className="max-w-md mx-auto p-3 rounded-lg border border-zinc-850 bg-zinc-950/80 flex items-center justify-between font-mono text-xs text-zinc-300">
          <div className="flex items-center gap-2">
            <span className="text-zinc-600">$</span>
            <span>npx gray-scrape https://openai.com/research</span>
          </div>
          <button
            type="button"
            onClick={() => handleCopy('npx gray-scrape https://openai.com/research', 'home-cli')}
            className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
          >
            {copiedKey === 'home-cli' ? <Check className="h-3.5 w-3.5 text-white" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>
      </section>

      {/* Feature Pillars Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            onClick={() => onNavigatePlayground('https://en.wikipedia.org/wiki/Artificial_intelligence', '#firstHeading')}
            className="border-zinc-850 bg-zinc-950/80 p-6 space-y-4 hover:border-zinc-700 transition-all cursor-pointer group shadow-lg"
          >
            <div className="h-10 w-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 group-hover:text-white transition-colors">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">Adaptive Relocating</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-normal">
              When class names scramble or HTML structures shift, Gray Scrape locates elements via structural similarity heuristics.
            </p>
            <div className="flex items-center gap-1 text-xs font-mono text-zinc-400 group-hover:text-white pt-2">
              <span>Try adaptive demo</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Card>

          <Card
            onClick={() => onNavigatePlayground('https://httpbin.org/headers', 'pre')}
            className="border-zinc-850 bg-zinc-950/80 p-6 space-y-4 hover:border-zinc-700 transition-all cursor-pointer group shadow-lg"
          >
            <div className="h-10 w-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 group-hover:text-white transition-colors">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">Stealth Anti-Detect</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-normal">
              Bypasses Cloudflare Turnstile, DataDome, and bot managers with authentic TLS client hello profiles and HTTP/2 headers.
            </p>
            <div className="flex items-center gap-1 text-xs font-mono text-zinc-400 group-hover:text-white pt-2">
              <span>Test stealth headers</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Card>

          <Card
            onClick={() => onNavigateApi()}
            className="border-zinc-850 bg-zinc-950/80 p-6 space-y-4 hover:border-zinc-700 transition-all cursor-pointer group shadow-lg"
          >
            <div className="h-10 w-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 group-hover:text-white transition-colors">
              <Code2 className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">Cloud Scrape API</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-normal">
              Instant REST API endpoint returning clean Markdown, token counts, and structured DOM trees for LLM agent pipelines.
            </p>
            <div className="flex items-center gap-1 text-xs font-mono text-zinc-400 group-hover:text-white pt-2">
              <span>View API specs</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Card>
        </div>
      </section>

      {/* Code Showcase Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <Card className="border-zinc-850 bg-zinc-950 overflow-hidden shadow-2xl">
          <div className="p-4 px-5 bg-zinc-900/60 border-b border-zinc-850 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-zinc-300">
              <span className="h-2 w-2 rounded-full bg-white" />
              <span>main.py — Production Scrapling Pipeline</span>
            </div>
            <Button
              onClick={() =>
                handleCopy(
                  `from scrapling import StealthyFetcher\n\nfetcher = StealthyFetcher()\npage = fetcher.get("https://news.ycombinator.com")\n\ntitles = page.adapt_css(".titleline").all()\nfor title in titles:\n    print(title.text)`,
                  'home-code'
                )
              }
              variant="outline"
              size="sm"
              className="h-7 text-xs border-zinc-800"
            >
              {copiedKey === 'home-code' ? <Check className="h-3 w-3 text-white" /> : <Copy className="h-3 w-3" />}
              <span>Copy</span>
            </Button>
          </div>
          <pre className="p-6 bg-black text-xs font-mono text-zinc-200 leading-relaxed overflow-x-auto">
{`from scrapling import StealthyFetcher

# 1. Initialize StealthyFetcher with anti-bot TLS profile
fetcher = StealthyFetcher()
page = fetcher.get("https://news.ycombinator.com")

# 2. Extract elements with adaptive relocation
# Even if class names mutate from '.titleline' to '.title_hash91', adapt_css self-heals!
articles = page.adapt_css(".titleline").all()

for article in articles[:5]:
    print(f"-> {article.text}")`}
          </pre>
        </Card>
      </section>
    </div>
  );
}
