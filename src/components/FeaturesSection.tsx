import { Cpu, Shield, Zap, Terminal, Code2, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Card } from './ui/card.tsx';
import { Button } from './ui/button.tsx';

export function FeaturesSection() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="bg-black text-white">
      {/* SECTION 1: DOCS */}
      <section id="docs" className="py-20 border-t border-zinc-900 relative">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="max-w-3xl mb-14">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-zinc-400 uppercase mb-3 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              <span>Documentation</span>
              <span aria-hidden="true" className="text-zinc-600">·</span>
              <span>Gray Scrape Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
              Adaptive DOM Relocation
            </h2>
            <p className="mt-4 text-base sm:text-lg text-zinc-400 font-normal leading-relaxed">
              Gray Scrape is a free unlimited scraper in the world. Traditional web scrapers fail the moment a website modifies its CSS classes or changes layout hierarchies.
              Gray Scrape solves this using multi-dimensional fingerprint vectors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-zinc-800 bg-zinc-950 p-6">
              <div className="h-10 w-10 rounded-md bg-white text-black flex items-center justify-center mb-6">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Fingerprint Vectors</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                Generates a signature containing tag type, DOM tree depth, text length, parent container, and semantic attributes.
              </p>
            </Card>

            <Card className="border-zinc-800 bg-zinc-950 p-6">
              <div className="h-10 w-10 rounded-md bg-white text-black flex items-center justify-center mb-6">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Resilient Similarity Matching</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                Uses token Jaccard similarity and Levenshtein distance to evaluate candidate nodes across the DOM tree when selectors break.
              </p>
            </Card>

            <Card className="border-zinc-800 bg-zinc-950 p-6">
              <div className="h-10 w-10 rounded-md bg-white text-black flex items-center justify-center mb-6">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Auto-Healed Selectors</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                Generates new resilient selector recommendations that persist through future website deployments and A/B test variations.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* SECTION 2: PRODUCTS */}
      <section id="products" className="py-20 border-t border-zinc-900 relative">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="max-w-3xl mb-14">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-zinc-400 uppercase mb-3 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              <span>Products & Tooling</span>
              <span aria-hidden="true" className="text-zinc-600">·</span>
              <span>Gray Scrape Ecosystem</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
              Built for production extraction pipelines.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-zinc-400 font-normal leading-relaxed">
              Explore the modular toolset designed for developers, data engineers, and AI agent builders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-zinc-800 bg-zinc-950 p-6 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider block mb-2">
                  Engine Core
                </span>
                <h3 className="text-xl font-bold text-white mb-2">StealthyFetcher</h3>
                <p className="text-sm text-zinc-400 leading-relaxed mb-6 font-normal">
                  High-speed HTTP client that mimics modern browser TLS signatures, Client Hints, and realistic header casings
                  to bypass Cloudflare Turnstile and anti-scraping firewalls without launching Chromium.
                </p>
              </div>
              <div className="text-xs font-mono text-zinc-400 border-t border-zinc-850 pt-4 flex items-center justify-between">
                <span>TLSv1.3 · HTTP/3 · Client Hints</span>
                <span className="text-white font-medium">Native Python & Node</span>
              </div>
            </Card>

            <Card className="border-zinc-800 bg-zinc-950 p-6 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider block mb-2">
                  AI & RAG Tooling
                </span>
                <h3 className="text-xl font-bold text-white mb-2">Reader Distillation Pipeline</h3>
                <p className="text-sm text-zinc-400 leading-relaxed mb-6 font-normal">
                  Cleans noisy HTML down to pristine Markdown with headings, tables, links, and structured JSON-LD schemas.
                  Directly ready for feeding into large language models and vector search databases.
                </p>
              </div>
              <div className="text-xs font-mono text-zinc-400 border-t border-zinc-850 pt-4 flex items-center justify-between">
                <span>Zero-Noise · Schema.org · Table of Contents</span>
                <span className="text-white font-medium">Instant Export</span>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* SECTION 3: API REFERENCE */}
      <section id="api" className="py-20 border-t border-zinc-900 relative">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="max-w-3xl mb-14">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-zinc-400 uppercase mb-3 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              <span>Developer API</span>
              <span aria-hidden="true" className="text-zinc-600">·</span>
              <span>REST & Python SDK</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
              Simple, declarative integration.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-zinc-400 font-normal leading-relaxed">
              Execute adaptive scrapes directly through standard HTTP REST endpoints or in Node.js / CLI with Gray Scrape.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* cURL REST Endpoint Example */}
            <Card className="border-zinc-800 bg-zinc-950 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-zinc-400">POST /api/scrape</span>
                <Button
                  onClick={() =>
                    handleCopy(
                      `curl -X POST http://localhost:3000/api/scrape \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://example.com/article", "adaptiveSelector": "h1"}'`,
                      'curl'
                    )
                  }
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                >
                  {copiedKey === 'curl' ? <Check className="h-3 w-3 text-white" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedKey === 'curl' ? 'Copied' : 'Copy cURL'}</span>
                </Button>
              </div>

              <pre className="p-4 bg-black rounded-lg border border-zinc-800 text-xs font-mono text-zinc-300 overflow-x-auto leading-relaxed">
{`curl -X POST https://your-app/api/scrape \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://en.wikipedia.org/wiki/Artificial_intelligence",
    "adaptiveSelector": "#firstHeading",
    "stealthMode": true
  }'`}
              </pre>

              <div className="mt-4 space-y-2 text-xs font-mono text-zinc-400">
                <div className="flex justify-between border-b border-zinc-850 pb-1.5">
                  <span className="text-zinc-500">url:</span>
                  <span className="text-white">string (required)</span>
                </div>
                <div className="flex justify-between border-b border-zinc-850 pb-1.5">
                  <span className="text-zinc-500">adaptiveSelector:</span>
                  <span className="text-zinc-300">string (optional)</span>
                </div>
                <div className="flex justify-between pb-1.5">
                  <span className="text-zinc-500">simulateMutation:</span>
                  <span className="text-zinc-300">boolean (optional)</span>
                </div>
              </div>
            </Card>

            {/* Python SDK Example */}
            <Card className="border-zinc-800 bg-zinc-950 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-zinc-400">Python Scrapling SDK</span>
                <Button
                  onClick={() =>
                    handleCopy(
                      `from scrapling import StealthyFetcher

fetcher = StealthyFetcher()
page = fetcher.get("https://example.com")
title = page.adapt_css("h1.title")
print(title.text)`,
                      'pysdk'
                    )
                  }
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                >
                  {copiedKey === 'pysdk' ? <Check className="h-3 w-3 text-white" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedKey === 'pysdk' ? 'Copied' : 'Copy Python'}</span>
                </Button>
              </div>

              <pre className="p-4 bg-black rounded-lg border border-zinc-800 text-xs font-mono text-zinc-300 overflow-x-auto leading-relaxed">
{`from scrapling import StealthyFetcher

# Stealth fetch with client hint emulation
fetcher = StealthyFetcher()
page = fetcher.get("https://en.wikipedia.org/wiki/Artificial_intelligence")

# Auto-relocating adaptive selector
target = page.adapt_css("#firstHeading")
print(f"Extracted: {target.text}")`}
              </pre>

              <div className="mt-4 p-3 bg-black rounded border border-zinc-850 text-xs text-zinc-400 font-normal">
                Install via pip: <code className="text-white font-mono">pip install scrapling</code>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
