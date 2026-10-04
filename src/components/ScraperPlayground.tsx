import { useState, useEffect } from 'react';
import {
  Globe,
  Search,
  Zap,
  Shield,
  Layers,
  FileText,
  Code2,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
  Clock,
  BookOpen,
  Link as LinkIcon,
  ChevronRight,
} from 'lucide-react';
import { Button } from './ui/button.tsx';
import { Input } from './ui/input.tsx';
import { Card, CardContent } from './ui/card.tsx';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs.tsx';
import { TwitterScraperView } from './TwitterScraperView.tsx';
import type { ScrapeResult } from '../server/scraperEngine.ts';
import type { SearchResultItem } from '../server/apiHandler.ts';

interface ScraperPlaygroundProps {
  initialUrl?: string;
  initialSelector?: string;
}

const FALLBACK_SEARCH_RESULTS: SearchResultItem[] = [
  {
    title: 'Wikipedia: Artificial Intelligence',
    url: 'https://en.wikipedia.org/wiki/Artificial_intelligence',
    snippet: 'Comprehensive encyclopedia article covering reasoning, neural networks, ethics, and research history.',
    domain: 'en.wikipedia.org',
  },
  {
    title: 'Hacker News Frontpage',
    url: 'https://news.ycombinator.com',
    snippet: 'Curated technical news, startup launches, discussions, and AI engineering discussions.',
    domain: 'news.ycombinator.com',
  },
  {
    title: 'OpenAI Research',
    url: 'https://openai.com/research',
    snippet: 'Undetectable, blazing-fast web scraper library in Python with adaptive element tracking.',
    domain: 'github.com',
  },
  {
    title: 'TechCrunch: Artificial Intelligence',
    url: 'https://techcrunch.com/category/artificial-intelligence/',
    snippet: 'Latest news, enterprise deployments, venture investments, and foundation models in AI.',
    domain: 'techcrunch.com',
  },
];

export function ScraperPlayground({ initialUrl = '', initialSelector = '' }: ScraperPlaygroundProps) {
  // Input state
  const [url, setUrl] = useState(initialUrl || 'https://en.wikipedia.org/wiki/Artificial_intelligence');
  const [adaptiveSelector, setAdaptiveSelector] = useState(initialSelector || '#firstHeading');
  const [simulateMutation, setSimulateMutation] = useState(false);
  const [stealthMode, setStealthMode] = useState(true);
  const [userAgent, setUserAgent] = useState('chrome-mac');

  // Execution state
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScrapeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Search tab state
  const [searchQuery, setSearchQuery] = useState('Scrapling Python adaptive web scraper');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>(FALLBACK_SEARCH_RESULTS);

  // Reader mode adjustments
  const [readerFontSize, setReaderFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');

  // Copy feedback
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Active tab
  const [activeTab, setActiveTab] = useState('reader');
  // Engine Mode: Universal Scraper vs X / Twitter Scraper
  const [engineMode, setEngineMode] = useState<'universal' | 'twitter'>('universal');

  useEffect(() => {
    if (initialUrl) {
      setUrl(initialUrl);
      if (initialSelector) setAdaptiveSelector(initialSelector);
      handleScrape(initialUrl, initialSelector);
    } else {
      handleScrape(url, adaptiveSelector);
    }
    handleSearch(searchQuery);
  }, []);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleScrape = async (targetUrl = url, selector = adaptiveSelector, mutate = simulateMutation) => {
    if (!targetUrl || !targetUrl.trim()) return;

    setLoading(true);
    setError(null);

    const uaMap: Record<string, string> = {
      'chrome-mac':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
      'chrome-win':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      'firefox-linux':
        'Mozilla/5.0 (X11; Linux x86_64; rv:132.0) Gecko/20100101 Firefox/132.0',
    };

    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: targetUrl.trim(),
          adaptiveSelector: selector.trim(),
          simulateMutation: mutate,
          stealthMode,
          userAgent: uaMap[userAgent] || uaMap['chrome-mac'],
        }),
      });

      const data: ScrapeResult = await res.json();
      if (!data.success && data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(`Network error: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query = searchQuery) => {
    if (!query || !query.trim()) return;
    setSearching(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.results) && data.results.length > 0) {
          setSearchResults(data.results);
          return;
        }
      }
      // If server returned empty, filter fallback items
      const qLower = query.toLowerCase();
      const filtered = FALLBACK_SEARCH_RESULTS.filter(
        (r) => r.title.toLowerCase().includes(qLower) || r.snippet.toLowerCase().includes(qLower)
      );
      setSearchResults(filtered.length > 0 ? filtered : FALLBACK_SEARCH_RESULTS);
    } catch {
      // Graceful fallback to default search results without throwing
      const qLower = query.toLowerCase();
      const filtered = FALLBACK_SEARCH_RESULTS.filter(
        (r) => r.title.toLowerCase().includes(qLower) || r.snippet.toLowerCase().includes(qLower)
      );
      setSearchResults(filtered.length > 0 ? filtered : FALLBACK_SEARCH_RESULTS);
    } finally {
      setSearching(false);
    }
  };

  const handleSelectSearchResult = (resultUrl: string) => {
    setUrl(resultUrl);
    setAdaptiveSelector('h1, h2, article');
    setActiveTab('reader');
    handleScrape(resultUrl, 'h1, h2, article');
  };

  return (
    <section id="playground" className="py-12 sm:py-16 bg-black">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        {/* Engine Switcher: Universal vs Twitter/X */}
        <div className="flex items-center gap-2 mb-8 border-b border-zinc-850 pb-4">
          <button
            type="button"
            onClick={() => setEngineMode('universal')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${
              engineMode === 'universal'
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            Universal Web Scraper
          </button>

          <button
            type="button"
            onClick={() => setEngineMode('twitter')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer flex items-center gap-2 ${
              engineMode === 'twitter'
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <span>X / Twitter Scraper</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
              engineMode === 'twitter' ? 'bg-black text-white' : 'bg-zinc-800 text-zinc-300'
            }`}>
              Profiles & Posts
            </span>
          </button>
        </div>

        {engineMode === 'twitter' ? (
          <TwitterScraperView />
        ) : (
          <>
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  <span>GRAY SCRAPE INTERACTIVE ENGINE</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Adaptive Extraction & Stealth Playground
                </h2>
                <p className="text-sm text-zinc-400 mt-1 font-normal">
                  Test adaptive element recovery, stealth request headers, clean reader distillation, and web discovery.
                </p>
              </div>

              {/* Quick presets in monochrome */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500 font-mono hidden sm:inline">Presets:</span>
                <button
                  type="button"
                  onClick={() => {
                    setUrl('https://en.wikipedia.org/wiki/Artificial_intelligence');
                    setAdaptiveSelector('#firstHeading');
                    handleScrape('https://en.wikipedia.org/wiki/Artificial_intelligence', '#firstHeading');
                  }}
                  className="text-xs px-2.5 py-1.5 rounded border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 hover:text-white text-zinc-300 transition-colors cursor-pointer"
                >
                  Wikipedia AI
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUrl('https://news.ycombinator.com');
                    setAdaptiveSelector('.titleline > a');
                    handleScrape('https://news.ycombinator.com', '.titleline > a');
                  }}
                  className="text-xs px-2.5 py-1.5 rounded border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 hover:text-white text-zinc-300 transition-colors cursor-pointer"
                >
                  Hacker News
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUrl('https://github.com/D4Vinci/Scrapling');
                    setAdaptiveSelector('article.markdown-body h1');
                    handleScrape('https://github.com/D4Vinci/Scrapling', 'article.markdown-body h1');
                  }}
                  className="text-xs px-2.5 py-1.5 rounded border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 hover:text-white text-zinc-300 transition-colors cursor-pointer"
                >
                  GitHub Scrapling
                </button>
              </div>
            </div>

        {/* Scraper Control Console */}
        <Card className="border-zinc-800 bg-zinc-950 shadow-2xl mb-8">
          <CardContent className="p-4 sm:p-6 space-y-4">
            {/* Top row: URL Input + Scrape Button */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Globe className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleScrape()}
                  placeholder="Enter any target website URL (e.g., https://example.com/article)..."
                  className="pl-10 h-11 bg-black border-zinc-800 text-white placeholder:text-zinc-500 font-mono text-sm focus-visible:border-white"
                />
              </div>

              <Button
                onClick={() => handleScrape()}
                disabled={loading}
                variant="default"
                className="h-11 px-6 font-semibold"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin text-black" />
                    <span>Scraping...</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 fill-black text-black" />
                    <span>Run Scraper</span>
                  </>
                )}
              </Button>
            </div>

            {/* Bottom row: Adaptive Selector + Scrapling Controls */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-3 border-t border-zinc-850 items-center">
              {/* Adaptive Selector Input */}
              <div className="md:col-span-6 flex items-center gap-2">
                <span className="text-xs font-mono text-zinc-400 whitespace-nowrap">
                  Adaptive CSS Selector:
                </span>
                <Input
                  value={adaptiveSelector}
                  onChange={(e) => setAdaptiveSelector(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleScrape()}
                  placeholder="#firstHeading or article h1..."
                  className="h-8 text-xs font-mono bg-black border-zinc-800 text-white"
                />
              </div>

              {/* Simulate DOM Mutation Toggle (Scrapling Showcase) */}
              <div className="md:col-span-3 flex items-center gap-2">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-zinc-300 hover:text-white">
                  <input
                    type="checkbox"
                    checked={simulateMutation}
                    onChange={(e) => {
                      setSimulateMutation(e.target.checked);
                      handleScrape(url, adaptiveSelector, e.target.checked);
                    }}
                    className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-white focus:ring-white focus:ring-offset-black"
                  />
                  <span className="font-medium">Simulate DOM Mutation</span>
                </label>
                <span
                  title="Simulates website changing its classes/markup to test Gray Scrape's automatic element relocation engine."
                  className="text-zinc-500 cursor-help text-xs"
                >
                  ⓘ
                </span>
              </div>

              {/* Stealth & User-Agent Controls */}
              <div className="md:col-span-3 flex items-center justify-end gap-3 text-xs">
                <div className="flex items-center gap-1.5 text-zinc-300">
                  <Shield className="h-3.5 w-3.5 text-zinc-400" />
                  <span className="text-zinc-400">Stealth:</span>
                  <button
                    type="button"
                    onClick={() => setStealthMode(!stealthMode)}
                    className={`font-mono text-[11px] px-2 py-0.5 rounded cursor-pointer transition-colors ${
                      stealthMode
                        ? 'bg-zinc-850 text-white border border-zinc-700'
                        : 'bg-zinc-900 text-zinc-500'
                    }`}
                  >
                    {stealthMode ? 'ACTIVE' : 'OFF'}
                  </button>
                </div>

                <select
                  value={userAgent}
                  onChange={(e) => setUserAgent(e.target.value)}
                  className="bg-black border border-zinc-800 rounded px-2 py-1 text-[11px] font-mono text-zinc-300 focus:outline-none focus:border-zinc-600"
                >
                  <option value="chrome-mac">Chrome 130 (macOS)</option>
                  <option value="chrome-win">Chrome 131 (Windows)</option>
                  <option value="firefox-linux">Firefox 132 (Linux)</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Notification */}
        {error && (
          <div className="mb-6 p-4 rounded-lg border border-zinc-700 bg-zinc-900/60 text-zinc-200 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-white shrink-0 mt-0.5" />
            <div className="text-sm">
              <span className="font-semibold text-white">Notice: </span>
              {error}
              <p className="mt-1 text-xs text-zinc-400">
                Tip: Some sites block cloud IP fetches. Try one of our verified presets or search results.
              </p>
            </div>
          </div>
        )}

        {/* Live Telemetry Bar */}
        {result && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 p-3 px-4 rounded-lg border border-zinc-800 bg-zinc-950 text-xs font-mono">
            <div className="flex flex-wrap items-center gap-4 text-zinc-300">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-white" />
                <span className="text-white font-semibold">
                  HTTP {result.statusCode} {result.statusText}
                </span>
              </div>
              <span aria-hidden="true" className="text-zinc-700">|</span>
              <div className="flex items-center gap-1 text-zinc-400">
                <Clock className="h-3.5 w-3.5" />
                <span>{result.fetchTimeMs}ms latency</span>
              </div>
              <span aria-hidden="true" className="text-zinc-700">|</span>
              <div className="text-zinc-400">
                {(result.contentLength / 1024).toFixed(1)} KB payload
              </div>
              <span aria-hidden="true" className="text-zinc-700">|</span>
              <div className="text-zinc-400">
                {result.metadata.wordCount.toLocaleString()} words · ~{result.metadata.readTimeMinutes} min read
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-zinc-400">
              <span>Stealth: {result.stealthFingerprint.browserEmulated}</span>
            </div>
          </div>
        )}

        {/* Playground Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
            <TabsList>
              <TabsTrigger value="reader" icon={<BookOpen />}>
                Reader Mode
              </TabsTrigger>
              <TabsTrigger value="adaptive" icon={<RefreshCw />}>
                Adaptive Inspector
                {result?.adaptiveResult && (
                  <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded font-mono bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {result.adaptiveResult.matchedDirectly ? 'Direct' : 'Relocated'}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="search" icon={<Search />}>
                Web Search & Scrape
              </TabsTrigger>
              <TabsTrigger value="schema" icon={<Layers />}>
                Structured Schema
              </TabsTrigger>
              <TabsTrigger value="spider" icon={<LinkIcon />}>
                Spider & Links ({result?.extractedLinks?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="code" icon={<Code2 />}>
                Python / Code
              </TabsTrigger>
            </TabsList>

            {/* Quick Export Actions */}
            {result?.readerMode && (
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => handleCopy(result.readerMode?.markdown || '', 'md')}
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                >
                  {copiedKey === 'md' ? <Check className="h-3.5 w-3.5 text-white" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedKey === 'md' ? 'Copied' : 'Copy Markdown'}</span>
                </Button>
                <Button
                  onClick={() => handleCopy(JSON.stringify(result, null, 2), 'json')}
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                >
                  {copiedKey === 'json' ? <Check className="h-3.5 w-3.5 text-white" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>Copy JSON</span>
                </Button>
              </div>
            )}
          </div>

          {/* TAB 1: READER MODE */}
          <TabsContent value="reader">
            {result?.readerMode ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
                {/* Article Content Container */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Article Card */}
                  <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 sm:p-10 text-white shadow-2xl">
                    {/* Reader Controls Toolbar */}
                    <div className="flex items-center justify-between border-b border-zinc-850 pb-4 mb-6 text-xs text-zinc-400">
                      <div className="flex items-center gap-2">
                        <span>Font size:</span>
                        <div className="flex items-center rounded border border-zinc-800 bg-black p-0.5">
                          {(['sm', 'base', 'lg', 'xl'] as const).map((sz) => (
                            <button
                              key={sz}
                              type="button"
                              onClick={() => setReaderFontSize(sz)}
                              className={`px-2 py-0.5 rounded text-[11px] uppercase ${
                                readerFontSize === sz ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-white'
                              }`}
                            >
                              {sz}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="text-zinc-500 font-mono text-[11px]">
                        Distilled by Gray Scrape Reader
                      </div>
                    </div>

                    {/* Metadata Kicker */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 mb-3 font-normal">
                      <span>{result.metadata.siteName}</span>
                      <span aria-hidden="true">·</span>
                      {result.metadata.author && (
                        <>
                          <span>By {result.metadata.author}</span>
                          <span aria-hidden="true">·</span>
                        </>
                      )}
                      <span>{result.metadata.wordCount.toLocaleString()} words</span>
                      <span aria-hidden="true">·</span>
                      <span>{result.metadata.readTimeMinutes} min read</span>
                    </div>

                    {/* Clean Article Title */}
                    <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight mb-4">
                      {result.readerMode.title}
                    </h1>

                    {/* Excerpt if present */}
                    {result.readerMode.excerpt && (
                      <p className="text-base sm:text-lg text-zinc-400 font-normal mb-6 border-l border-zinc-700 pl-4 py-1">
                        {result.readerMode.excerpt}
                      </p>
                    )}

                    {/* Lead Image if extracted */}
                    {result.metadata.ogImage && (
                      <div className="my-6 rounded-lg overflow-hidden border border-zinc-800 bg-black">
                        <img
                          src={result.metadata.ogImage}
                          alt={result.readerMode.title}
                          className="w-full max-h-96 object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}

                    {/* Rendered Body Typography */}
                    <div
                      className={`max-w-none space-y-4 leading-relaxed font-normal ${
                        readerFontSize === 'sm'
                          ? 'text-sm'
                          : readerFontSize === 'base'
                          ? 'text-base'
                          : readerFontSize === 'lg'
                          ? 'text-lg'
                          : 'text-xl'
                      }`}
                    >
                      {result.readerMode.markdown.split('\n\n').map((paragraph, idx) => {
                        const trimmed = paragraph.trim();
                        if (!trimmed) return null;

                        if (trimmed.startsWith('# ')) {
                          return (
                            <h2 key={idx} className="text-2xl font-bold text-white mt-8 mb-4 border-b border-zinc-800 pb-2">
                              {trimmed.replace('# ', '')}
                            </h2>
                          );
                        }
                        if (trimmed.startsWith('## ')) {
                          return (
                            <h3 key={idx} className="text-xl font-semibold text-white mt-6 mb-3">
                              {trimmed.replace('## ', '')}
                            </h3>
                          );
                        }
                        if (trimmed.startsWith('### ')) {
                          return (
                            <h4 key={idx} className="text-lg font-medium text-zinc-200 mt-4 mb-2">
                              {trimmed.replace('### ', '')}
                            </h4>
                          );
                        }
                        if (trimmed.startsWith('> ')) {
                          return (
                            <blockquote key={idx} className="border-l-2 border-white pl-4 py-1 text-zinc-300 my-4 bg-zinc-900/60 rounded-r">
                              {trimmed.replace('> ', '')}
                            </blockquote>
                          );
                        }
                        if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
                          const items = trimmed.split('\n').filter(Boolean);
                          return (
                            <ul key={idx} className="list-disc list-inside space-y-1 my-3 pl-2 text-zinc-300">
                              {items.map((item, i) => (
                                <li key={i}>{item.replace(/^[\*\-]\s+/, '')}</li>
                              ))}
                            </ul>
                          );
                        }
                        if (trimmed.startsWith('```')) {
                          return (
                            <pre key={idx} className="bg-black p-4 rounded-lg overflow-x-auto text-xs font-mono border border-zinc-800 my-4 text-zinc-200">
                              <code>{trimmed.replace(/```/g, '')}</code>
                            </pre>
                          );
                        }

                        return (
                          <p key={idx} className="text-zinc-300 leading-relaxed font-normal">
                            {trimmed}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Sidebar: Table of Contents & Metadata */}
                <div className="lg:col-span-4 space-y-4">
                  {/* Table of Contents */}
                  {result.readerMode.headings.length > 0 && (
                    <Card className="border-zinc-800 bg-zinc-950 p-4">
                      <h4 className="text-xs font-mono font-semibold text-white uppercase tracking-wider mb-3">
                        Table of Contents
                      </h4>
                      <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1 text-xs">
                        {result.readerMode.headings.map((h, i) => (
                          <div
                            key={i}
                            className={`py-1 text-zinc-400 hover:text-white transition-colors cursor-pointer truncate ${
                              h.level === 1 ? 'font-semibold text-white' : h.level === 2 ? 'pl-3' : 'pl-6 text-zinc-500'
                            }`}
                          >
                            {h.text}
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}

                  {/* Scrape Target Info Card */}
                  <Card className="border-zinc-800 bg-zinc-950 p-4 text-xs space-y-3">
                    <h4 className="font-mono font-semibold text-white uppercase tracking-wider">
                      Target Intelligence
                    </h4>
                    <div className="space-y-2 text-zinc-400 font-mono">
                      <div>
                        <span className="text-zinc-500">Source:</span>{' '}
                        <a
                          href={result.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-white hover:underline break-all"
                        >
                          {result.url}
                        </a>
                      </div>
                      <div>
                        <span className="text-zinc-500">Site:</span> {result.metadata.siteName}
                      </div>
                      <div>
                        <span className="text-zinc-500">Language:</span> {result.metadata.language || 'en'}
                      </div>
                      <div>
                        <span className="text-zinc-500">Total Words:</span> {result.metadata.wordCount.toLocaleString()}
                      </div>
                      <div>
                        <span className="text-zinc-500">Links Found:</span> {result.extractedLinks?.length || 0}
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 text-zinc-500">
                <FileText className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p>Run the scraper to display the clean Reader Mode article.</p>
              </div>
            )}
          </TabsContent>

          {/* TAB 2: ADAPTIVE INSPECTOR (Scrapling Signature) */}
          <TabsContent value="adaptive">
            {result?.adaptiveResult ? (
              <div className="space-y-6 mt-4">
                {/* Banner: Adaptive Status */}
                <div className="p-4 rounded-lg border border-zinc-800 bg-zinc-950 flex items-start gap-4">
                  <div className="h-10 w-10 rounded-md bg-white text-black flex items-center justify-center shrink-0">
                    <RefreshCw className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">
                        {result.adaptiveResult.matchedDirectly
                          ? 'Direct CSS Selector Match'
                          : 'Gray Scrape Adaptive Relocation Engaged'}
                      </h3>
                      <span className="text-xs px-2 py-0.5 rounded font-mono bg-zinc-900 border border-zinc-700 text-white">
                        {result.adaptiveResult.relocatedNode?.confidence || 100}% Confidence
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">
                      {result.adaptiveResult.explanation}
                    </p>
                  </div>
                </div>

                {/* Fingerprint Vector Analysis */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left: Captured Fingerprint Vector */}
                  <Card className="border-zinc-800 bg-zinc-950 p-5">
                    <h4 className="text-xs font-mono font-semibold text-white uppercase tracking-wider mb-4 flex items-center justify-between">
                      <span>Target Element Fingerprint</span>
                      <span className="text-zinc-500 text-[10px]">Gray Scrape Vector</span>
                    </h4>

                    {result.adaptiveResult.fingerprint ? (
                      <div className="space-y-3 text-xs font-mono">
                        <div className="flex justify-between border-b border-zinc-850 pb-2">
                          <span className="text-zinc-500">DOM Tag Name:</span>
                          <span className="text-white font-bold">
                            &lt;{result.adaptiveResult.fingerprint.tagName}&gt;
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-zinc-850 pb-2">
                          <span className="text-zinc-500">DOM Depth:</span>
                          <span className="text-zinc-200">{result.adaptiveResult.fingerprint.depth} levels</span>
                        </div>
                        <div className="flex justify-between border-b border-zinc-850 pb-2">
                          <span className="text-zinc-500">Parent Container:</span>
                          <span className="text-zinc-200">
                            &lt;{result.adaptiveResult.fingerprint.parentTag || 'root'}&gt;
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-zinc-850 pb-2">
                          <span className="text-zinc-500">Classes Captured:</span>
                          <span className="text-zinc-300 truncate max-w-[200px]">
                            {result.adaptiveResult.fingerprint.classes.join(', ') || 'None'}
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-zinc-850 pb-2">
                          <span className="text-zinc-500">Text Sample Length:</span>
                          <span className="text-zinc-200">
                            {result.adaptiveResult.fingerprint.textLength} chars
                          </span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block mb-1">Text Snippet:</span>
                          <p className="text-zinc-300 bg-black p-2.5 rounded border border-zinc-800 font-sans text-xs">
                            "{result.adaptiveResult.fingerprint.textSnippet}"
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-zinc-500">No fingerprint available.</p>
                    )}
                  </Card>

                  {/* Right: Relocated Node Details */}
                  <Card className="border-zinc-800 bg-zinc-950 p-5">
                    <h4 className="text-xs font-mono font-semibold text-white uppercase tracking-wider mb-4 flex items-center justify-between">
                      <span>Relocated Node Details</span>
                      <span className="text-zinc-500 text-[10px]">
                        {result.adaptiveResult.relocatedNode?.relocationMethod || 'Standard'}
                      </span>
                    </h4>

                    {result.adaptiveResult.relocatedNode ? (
                      <div className="space-y-4">
                        <div>
                          <span className="text-xs font-mono text-zinc-500 block mb-1">
                            Suggested Resilient Selector:
                          </span>
                          <div className="flex items-center gap-2">
                            <code className="text-xs font-mono text-white bg-black border border-zinc-800 px-3 py-1.5 rounded flex-1">
                              {result.adaptiveResult.relocatedNode.suggestedResilientSelector}
                            </code>
                            <Button
                              onClick={() =>
                                handleCopy(
                                  result.adaptiveResult?.relocatedNode?.suggestedResilientSelector || '',
                                  'sel'
                                )
                              }
                              variant="outline"
                              size="sm"
                              className="h-8"
                            >
                              {copiedKey === 'sel' ? <Check className="h-3 w-3 text-white" /> : <Copy className="h-3 w-3" />}
                            </Button>
                          </div>
                        </div>

                        <div>
                          <span className="text-xs font-mono text-zinc-500 block mb-1">
                            Target Element Text Content:
                          </span>
                          <div className="bg-black p-3 rounded border border-zinc-800 text-xs text-zinc-200 max-h-40 overflow-y-auto">
                            {result.adaptiveResult.relocatedNode.text}
                          </div>
                        </div>

                        {/* Interactive Mutation Test Trigger */}
                        <div className="pt-2 border-t border-zinc-850">
                          <Button
                            onClick={() => {
                              const nextMutate = !simulateMutation;
                              setSimulateMutation(nextMutate);
                              handleScrape(url, adaptiveSelector, nextMutate);
                            }}
                            variant="secondary"
                            size="sm"
                            className="w-full text-xs"
                          >
                            <RefreshCw className="h-3.5 w-3.5 mr-1" />
                            <span>
                              {simulateMutation
                                ? 'Reset DOM to Original State'
                                : 'Trigger DOM Mutation & Test Adaptive Recovery'}
                            </span>
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-zinc-500">No relocated node found.</p>
                    )}
                  </Card>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 text-zinc-500">
                <RefreshCw className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p>Enter an adaptive CSS selector above and run the scraper to inspect.</p>
              </div>
            )}
          </TabsContent>

          {/* TAB 3: WEB SEARCH & SCRAPE */}
          <TabsContent value="search">
            <div className="space-y-6 mt-4">
              {/* Search Bar */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search any topic, news, or site to scrape..."
                    className="pl-10 h-10 bg-black border-zinc-800 text-white placeholder:text-zinc-500 font-mono text-sm"
                  />
                </div>
                <Button onClick={() => handleSearch()} disabled={searching} className="h-10 px-5">
                  {searching ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  <span>Search</span>
                </Button>
              </div>

              {/* Search Results List */}
              <div className="space-y-3">
                {searchResults.length > 0 ? (
                  searchResults.map((item, idx) => (
                    <Card
                      key={idx}
                      className="border-zinc-850 hover:border-zinc-700 bg-zinc-950 transition-all p-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
                            <span>{item.domain}</span>
                            <span aria-hidden="true">·</span>
                            <span className="truncate max-w-[300px]">{item.url}</span>
                          </div>
                          <h4 className="text-sm sm:text-base font-semibold text-white hover:underline">
                            <a href={item.url} target="_blank" rel="noreferrer">
                              {item.title}
                            </a>
                          </h4>
                          <p className="text-xs text-zinc-400 line-clamp-2">{item.snippet}</p>
                        </div>

                        <Button
                          onClick={() => handleSelectSearchResult(item.url)}
                          variant="outline"
                          size="sm"
                          className="shrink-0 h-9"
                        >
                          <Zap className="h-3.5 w-3.5 text-white" />
                          <span>Scrape Page</span>
                        </Button>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-16 text-zinc-500 text-sm">
                    {searching ? 'Querying the web...' : 'Enter a query above to search and scrape pages.'}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* TAB 4: STRUCTURED SCHEMA */}
          <TabsContent value="schema">
            {result ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {/* Meta OpenGraph Card */}
                <Card className="border-zinc-800 bg-zinc-950 p-5">
                  <h4 className="text-xs font-mono font-semibold text-white uppercase tracking-wider mb-4">
                    Extracted Metadata & OpenGraph
                  </h4>
                  <div className="space-y-3 text-xs font-mono">
                    {Object.entries(result.metadata).map(([key, val]) => (
                      <div key={key} className="flex flex-col border-b border-zinc-850 pb-2">
                        <span className="text-zinc-500 capitalize">{key}:</span>
                        <span className="text-zinc-200 break-all">{String(val || 'N/A')}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* JSON-LD Structured Data */}
                <Card className="border-zinc-800 bg-zinc-950 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-mono font-semibold text-white uppercase tracking-wider">
                      JSON-LD Structured Data ({result.structuredData?.length || 0})
                    </h4>
                    <Button
                      onClick={() =>
                        handleCopy(JSON.stringify(result.structuredData || {}, null, 2), 'schema')
                      }
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs"
                    >
                      {copiedKey === 'schema' ? <Check className="h-3 w-3 text-white" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                  <pre className="p-3 bg-black rounded border border-zinc-800 text-[11px] font-mono text-zinc-300 max-h-96 overflow-y-auto">
                    {JSON.stringify(result.structuredData || {}, null, 2)}
                  </pre>
                </Card>
              </div>
            ) : (
              <div className="text-center py-20 text-zinc-500">Run the scraper to view structured schema.</div>
            )}
          </TabsContent>

          {/* TAB 5: SPIDER & EXTRACTED LINKS */}
          <TabsContent value="spider">
            {result?.extractedLinks ? (
              <Card className="border-zinc-800 bg-zinc-950 p-5 mt-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-sm font-bold text-white">Extracted Outbound & Internal Links</h4>
                    <p className="text-xs text-zinc-400">
                      Discovered {result.extractedLinks.length} navigable links from the target DOM.
                    </p>
                  </div>
                </div>

                <div className="divide-y divide-zinc-850 max-h-96 overflow-y-auto">
                  {result.extractedLinks.map((link, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between gap-4 text-xs font-mono">
                      <div className="truncate max-w-lg">
                        <span className="text-white block truncate font-sans text-sm font-medium">
                          {link.text || 'Unnamed Link'}
                        </span>
                        <span className="text-zinc-500 text-[11px] truncate block">{link.href}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-zinc-900 border border-zinc-800 text-zinc-400">
                          {link.isExternal ? 'EXTERNAL' : 'INTERNAL'}
                        </span>
                        <Button
                          onClick={() => {
                            setUrl(link.href);
                            handleScrape(link.href, adaptiveSelector);
                          }}
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs text-white hover:text-zinc-300"
                        >
                          <span>Scrape</span>
                          <ChevronRight className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ) : (
              <div className="text-center py-20 text-zinc-500">Run scraper to crawl links.</div>
            )}
          </TabsContent>

          {/* TAB 6: PYTHON CODE GENERATOR */}
          <TabsContent value="code">
            <Card className="border-zinc-800 bg-zinc-950 p-6 mt-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Code2 className="h-4 w-4 text-zinc-400" />
                    <span>Gray Scrape Code Integration</span>
                  </h4>
                  <p className="text-xs text-zinc-400">
                    Copy and run this CLI command or API request.
                  </p>
                </div>
                <Button
                  onClick={() => {
                    const code = `# Install scrapling: pip install scrapling
from scrapling import StealthyFetcher, Adaptor

# Initialize StealthyFetcher with anti-bot bypass
fetcher = StealthyFetcher()
page = fetcher.get("${url}")

# Adaptive selector with automatic element relocation
target = page.adapt_css("${adaptiveSelector}")
print("Found element:", target.text)

# Extract clean markdown article
print("Article Title:", page.css("h1").first().text)
`;
                    handleCopy(code, 'pycode');
                  }}
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                >
                  {copiedKey === 'pycode' ? <Check className="h-3.5 w-3.5 text-white" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedKey === 'pycode' ? 'Copied' : 'Copy Python Code'}</span>
                </Button>
              </div>

              <pre className="p-4 bg-black rounded-lg border border-zinc-800 text-xs font-mono text-zinc-200 overflow-x-auto leading-relaxed">
{`# 1. Install official Scrapling library
# pip install scrapling

from scrapling import StealthyFetcher, Adaptor

def run_scraper():
    # StealthyFetcher handles TLS fingerprinting & anti-bot bypass
    fetcher = StealthyFetcher(auto_match=True)
    response = fetcher.get("${url}")

    # Adaptive element extraction (survives DOM changes)
    target = response.adapt_css("${adaptiveSelector}")
    if target:
        print(f"[*] Extracted: {target.text}")
        print(f"[*] Tag: {target.tag_name}")
    else:
        print("[-] Target not relocated")

if __name__ == "__main__":
    run_scraper()`}
              </pre>
            </Card>
          </TabsContent>
        </Tabs>
        </>
        )}
      </div>
    </section>
  );
}
