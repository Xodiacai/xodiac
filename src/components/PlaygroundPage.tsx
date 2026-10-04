import { useState, useEffect } from 'react';
import {
  Zap,
  Box,
  Users,
  Shield,
  Table,
  BookOpen,
  Copy,
  Check,
  RefreshCw,
  Clock,
  Code2,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Download,
  FileText,
  Terminal,
  Database,
  Layers,
  ArrowRight,
  Info,
  Image as ImageIcon,
  Link as LinkIcon,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  EyeOff,
  Globe,
  Radio,
} from 'lucide-react';
import { Button } from './ui/button.tsx';
import { Card } from './ui/card.tsx';
import type { ScrapeResult } from '../server/scraperEngine.ts';

interface PlaygroundPageProps {
  initialUrl?: string;
  initialSelector?: string;
}

export function PlaygroundPage({ initialUrl = '', initialSelector = '' }: PlaygroundPageProps) {
  // Query / Target State
  const [queryMode, setQueryMode] = useState<'single' | 'multiple'>('single');
  const [targetUrl, setTargetUrl] = useState(
    initialUrl || 'https://en.wikipedia.org/wiki/Artificial_intelligence'
  );
  const [multipleUrls, setMultipleUrls] = useState(
    'https://en.wikipedia.org/wiki/Artificial_intelligence\nhttps://openai.com/research\nhttps://news.ycombinator.com'
  );

  // Settings Toggles (Links closed/off by default as requested)
  const [stealthEngine, setStealthEngine] = useState(true);
  const [adaptiveRelocator, setAdaptiveRelocator] = useState(true);
  const [adaptiveSelector, setAdaptiveSelector] = useState(initialSelector || 'h1, h2, p, article');
  const [includeImages, setIncludeImages] = useState(true);
  const [includeLinks, setIncludeLinks] = useState(false);
  const [responseLimits, setResponseLimits] = useState(true);
  const [showSelectorInput, setShowSelectorInput] = useState(false);

  // Gray Scrape Core Anti-Bot Features Toggles
  const [showAdvancedBotShields, setShowAdvancedBotShields] = useState(false);
  const [solveCloudflare, setSolveCloudflare] = useState(true);
  const [hideCanvas, setHideCanvas] = useState(true);
  const [blockWebrtc, setBlockWebrtc] = useState(true);
  const [googleReferrer, setGoogleReferrer] = useState(true);
  const [blockAdsAndTrackers, setBlockAdsAndTrackers] = useState(true);

  // Execution State
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScrapeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Active Workspace Tab: defaults to 'examples' until user scrapes, then switches to 'reader'
  const [activeTab, setActiveTab] = useState<'examples' | 'response' | 'code' | 'reader'>('examples');
  const [responseSubTab, setResponseSubTab] = useState<'markdown' | 'papers' | 'images' | 'json' | 'html'>('markdown');
  const [codeLanguage, setCodeLanguage] = useState<'cli' | 'python' | 'curl' | 'node'>('cli');

  // Reader Mode settings
  const [readerFontSize, setReaderFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');

  // Copy helper
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleExecuteScrape = async (overrideUrl?: string, overrideSelector?: string) => {
    const urlToScrape = overrideUrl || (queryMode === 'single' ? targetUrl.trim() : multipleUrls.split('\n')[0]?.trim());
    if (!urlToScrape) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: urlToScrape,
          selector: overrideSelector || (adaptiveRelocator ? adaptiveSelector : undefined),
          simulateMutation: false,
          stealthMode: stealthEngine,
          userAgent: 'chrome-mac',
          includeImages,
          includeLinks,
          solveCloudflare,
          hideCanvas,
          blockWebrtc,
          googleReferrer,
          blockAdsAndTrackers,
        }),
      });

      const data: ScrapeResult = await res.json();
      if (!data.success && data.error) {
        setError(data.error);
      } else {
        setResult(data);
        // Automatically switch to Reader tab to display full content!
        setActiveTab('reader');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(`Extraction notice: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  // Keyboard shortcut: Cmd/Ctrl + Enter to scrape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        handleExecuteScrape();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    targetUrl,
    queryMode,
    multipleUrls,
    stealthEngine,
    adaptiveRelocator,
    adaptiveSelector,
    includeImages,
    includeLinks,
    solveCloudflare,
    hideCanvas,
    blockWebrtc,
    googleReferrer,
    blockAdsAndTrackers,
  ]);

  // Pre-configured Examples (matching screenshot cards design)
  const EXAMPLES = [
    {
      id: 'openai-research',
      icon: GraduationCap,
      title: 'OpenAI Research Papers & Citations',
      description: 'Scrape protected research publications, academic papers, and citation references.',
      url: 'https://openai.com/research',
      selector: 'h1, h2, h3, a, p',
    },
    {
      id: 'fast-lookup',
      icon: Zap,
      title: 'Fast lookup for agents',
      description: 'Get low-latency web results and structured text extraction inside agent loops.',
      url: 'https://en.wikipedia.org/wiki/Artificial_intelligence',
      selector: 'h1, h2, p, article',
    },
    {
      id: 'track-releases',
      icon: Box,
      title: 'Track project releases & docs',
      description: 'Monitor official release announcements and technical documentation across repositories.',
      url: 'https://github.com/D4Vinci/Scrapling',
      selector: 'article.markdown-body, h1, h2',
    },
    {
      id: 'fintech-intel',
      icon: Users,
      title: 'Find company & leadership intel',
      description: 'Extract executive bios, startup news, and company discussions with clean heuristics.',
      url: 'https://news.ycombinator.com',
      selector: '.titleline, .subline',
    },
    {
      id: 'cloudflare-stealth',
      icon: Shield,
      title: 'Cloudflare Turnstile stealth bypass',
      description: 'Test anti-bot TLS fingerprinting, HTTP/2 multiplexing, and stealth browser evasion.',
      url: 'https://httpbin.org/headers',
      selector: 'pre',
    },
    {
      id: 'ecommerce-catalog',
      icon: Table,
      title: 'E-Commerce & catalog tabular extraction',
      description: 'Extract product catalogs, specifications, quotes, and tabular metadata automatically.',
      url: 'https://quotes.toscrape.com',
      selector: '.quote, .text, .author',
    },
  ];

  const handleSelectExample = (ex: typeof EXAMPLES[0]) => {
    setQueryMode('single');
    setTargetUrl(ex.url);
    setAdaptiveSelector(ex.selector);
    handleExecuteScrape(ex.url, ex.selector);
  };

  const researchPapers = (result?.extractedLinks || []).filter((l) => l.isResearchPaper);
  const extractedImagesList = result?.extractedImages || [];

  return (
    <div className="w-full bg-black min-h-[calc(100vh-5rem)] text-white">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-4">
        {/* Main 2-Column Playground Grid (Matching Uploaded Image) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ================= LEFT CONFIGURATION PANEL ================= */}
          <div className="lg:col-span-4 xl:col-span-4 rounded-xl border border-zinc-850 bg-zinc-950/80 p-5 sm:p-6 flex flex-col justify-between shadow-2xl backdrop-blur-xl">
            <div className="space-y-6">
              {/* Header: Query / Target & Mode Toggle */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-white tracking-tight">
                    Target URL / Query
                  </label>

                  {/* Single / Multiple Toggle */}
                  <div className="flex items-center rounded-lg border border-zinc-800 bg-black p-0.5 text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => setQueryMode('single')}
                      className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                        queryMode === 'single'
                          ? 'bg-zinc-800 text-white font-medium shadow-sm'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Single
                    </button>
                    <button
                      type="button"
                      onClick={() => setQueryMode('multiple')}
                      className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                        queryMode === 'multiple'
                          ? 'bg-zinc-800 text-white font-medium shadow-sm'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Multiple
                    </button>
                  </div>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed font-normal mb-3">
                  The URL or domain to scrape; switch to Multiple to send several targets in one request. ↗
                </p>

                {/* Input Area */}
                {queryMode === 'single' ? (
                  <div className="relative">
                    <input
                      type="text"
                      value={targetUrl}
                      onChange={(e) => setTargetUrl(e.target.value)}
                      placeholder="Enter target URL (e.g. https://openai.com/research)..."
                      className="w-full h-11 px-3.5 bg-black border border-zinc-800 rounded-lg text-white font-mono text-xs placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
                    />
                  </div>
                ) : (
                  <div className="relative">
                    <textarea
                      rows={4}
                      value={multipleUrls}
                      onChange={(e) => setMultipleUrls(e.target.value)}
                      placeholder="One URL per line..."
                      className="w-full p-3 bg-black border border-zinc-800 rounded-lg text-white font-mono text-xs placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors leading-relaxed"
                    />
                  </div>
                )}
              </div>

              {/* Toggles List with Clean Dark Switches */}
              <div className="space-y-4 pt-4 border-t border-zinc-850">
                {/* 1. Stealth Engine */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-zinc-200 block">Stealth Engine</span>
                    <span className="text-[11px] text-zinc-400 block font-normal">
                      TLSv1.3 ClientHello & Cloudflare Turnstile bypass
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStealthEngine(!stealthEngine)}
                    className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                      stealthEngine ? 'bg-white' : 'bg-zinc-800'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full transition-transform ${
                        stealthEngine ? 'translate-x-5 bg-black' : 'translate-x-0 bg-zinc-400'
                      }`}
                    />
                  </button>
                </div>

                {/* 2. Include Images & Avatars */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-zinc-200 block">Include Images & Avatars</span>
                    <span className="text-[11px] text-zinc-400 block font-normal">
                      Extract and render embedded images & author photos
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIncludeImages(!includeImages)}
                    className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                      includeImages ? 'bg-white' : 'bg-zinc-800'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full transition-transform ${
                        includeImages ? 'translate-x-5 bg-black' : 'translate-x-0 bg-zinc-400'
                      }`}
                    />
                  </button>
                </div>

                {/* 3. Include Links & Research Papers */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-zinc-200 block">Scrape Links & Papers</span>
                    <span className="text-[11px] text-zinc-400 block font-normal">
                      Clean paragraph links + separate <code className="text-zinc-200"># Links</code> section
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIncludeLinks(!includeLinks)}
                    className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                      includeLinks ? 'bg-white' : 'bg-zinc-800'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full transition-transform ${
                        includeLinks ? 'translate-x-5 bg-black' : 'translate-x-0 bg-zinc-400'
                      }`}
                    />
                  </button>
                </div>

                {/* 4. Adaptive Selectors */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-medium text-zinc-200 block">Adaptive Selectors</span>
                      <span className="text-[11px] text-zinc-400 block font-normal">
                        Auto-relocates when website CSS classes mutate
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setAdaptiveRelocator(!adaptiveRelocator);
                        setShowSelectorInput(!showSelectorInput);
                      }}
                      className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                        adaptiveRelocator ? 'bg-white' : 'bg-zinc-800'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full transition-transform ${
                          adaptiveRelocator ? 'translate-x-5 bg-black' : 'translate-x-0 bg-zinc-400'
                        }`}
                      />
                    </button>
                  </div>

                  {adaptiveRelocator && (
                    <input
                      type="text"
                      value={adaptiveSelector}
                      onChange={(e) => setAdaptiveSelector(e.target.value)}
                      placeholder="CSS selector e.g. #firstHeading, article, .title"
                      className="w-full h-8 px-3 bg-black border border-zinc-800 rounded-md text-zinc-300 font-mono text-[11px] focus:outline-none focus:border-zinc-500"
                    />
                  )}
                </div>

                {/* 5. Advanced Scrapling Anti-Bot & Evasion Shields (Expandable) */}
                <div className="pt-2 border-t border-zinc-900">
                  <button
                    type="button"
                    onClick={() => setShowAdvancedBotShields(!showAdvancedBotShields)}
                    className="w-full flex items-center justify-between py-2 text-xs font-medium text-zinc-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-white" />
                      <span>Gray Scrape Anti-Bot Suite</span>
                    </div>
                    {showAdvancedBotShields ? (
                      <ChevronDown className="h-4 w-4 text-zinc-400" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-zinc-400" />
                    )}
                  </button>

                  {showAdvancedBotShields && (
                    <div className="space-y-3 pt-3 pl-2 border-l border-zinc-800 mt-2 text-xs">
                      {/* Cloudflare Solver */}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-zinc-200 block text-[11px] font-medium">Cloudflare Turnstile Solver</span>
                          <span className="text-[10px] text-zinc-500 block">Solve JS & interstitial challenges</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSolveCloudflare(!solveCloudflare)}
                          className={`w-8 h-4 rounded-full p-0.5 transition-colors cursor-pointer ${
                            solveCloudflare ? 'bg-white' : 'bg-zinc-800'
                          }`}
                        >
                          <div className={`w-3 h-3 rounded-full transition-transform ${solveCloudflare ? 'translate-x-4 bg-black' : 'translate-x-0 bg-zinc-400'}`} />
                        </button>
                      </div>

                      {/* Canvas Noise */}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-zinc-200 block text-[11px] font-medium">Canvas Anti-Fingerprint Noise</span>
                          <span className="text-[10px] text-zinc-500 block">Randomizes canvas readback hashing</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setHideCanvas(!hideCanvas)}
                          className={`w-8 h-4 rounded-full p-0.5 transition-colors cursor-pointer ${
                            hideCanvas ? 'bg-white' : 'bg-zinc-800'
                          }`}
                        >
                          <div className={`w-3 h-3 rounded-full transition-transform ${hideCanvas ? 'translate-x-4 bg-black' : 'translate-x-0 bg-zinc-400'}`} />
                        </button>
                      </div>

                      {/* WebRTC Shield */}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-zinc-200 block text-[11px] font-medium">WebRTC IP Leak Shield</span>
                          <span className="text-[10px] text-zinc-500 block">Prevents STUN/TURN real IP leaks</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setBlockWebrtc(!blockWebrtc)}
                          className={`w-8 h-4 rounded-full p-0.5 transition-colors cursor-pointer ${
                            blockWebrtc ? 'bg-white' : 'bg-zinc-800'
                          }`}
                        >
                          <div className={`w-3 h-3 rounded-full transition-transform ${blockWebrtc ? 'translate-x-4 bg-black' : 'translate-x-0 bg-zinc-400'}`} />
                        </button>
                      </div>

                      {/* Google Referrer */}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-zinc-200 block text-[11px] font-medium">Google Referrer Spoofing</span>
                          <span className="text-[10px] text-zinc-500 block">Simulates organic search referral</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setGoogleReferrer(!googleReferrer)}
                          className={`w-8 h-4 rounded-full p-0.5 transition-colors cursor-pointer ${
                            googleReferrer ? 'bg-white' : 'bg-zinc-800'
                          }`}
                        >
                          <div className={`w-3 h-3 rounded-full transition-transform ${googleReferrer ? 'translate-x-4 bg-black' : 'translate-x-0 bg-zinc-400'}`} />
                        </button>
                      </div>

                      {/* 3500 Ad and Tracker Blocker */}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-zinc-200 block text-[11px] font-medium">Ad & Tracker Domain Shield</span>
                          <span className="text-[10px] text-zinc-500 block">Block ~3,500 tracking vectors</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setBlockAdsAndTrackers(!blockAdsAndTrackers)}
                          className={`w-8 h-4 rounded-full p-0.5 transition-colors cursor-pointer ${
                            blockAdsAndTrackers ? 'bg-white' : 'bg-zinc-800'
                          }`}
                        >
                          <div className={`w-3 h-3 rounded-full transition-transform ${blockAdsAndTrackers ? 'translate-x-4 bg-black' : 'translate-x-0 bg-zinc-400'}`} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Action Bar (Matching Screenshot Key required ⌘ ↵ style) */}
            <div className="pt-6 mt-6 border-t border-zinc-850">
              <Button
                onClick={() => handleExecuteScrape()}
                disabled={loading}
                variant="default"
                className="w-full h-12 bg-zinc-200 hover:bg-white text-black font-semibold text-xs tracking-wide rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin text-black" />
                    <span>Extracting Target...</span>
                  </>
                ) : (
                  <>
                    <span>Execute Scrape</span>
                    <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-zinc-400/40 text-black rounded border border-zinc-400/60">
                      ⌘ ↵
                    </kbd>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* ================= RIGHT WORKSPACE PANEL ================= */}
          <div className="lg:col-span-8 xl:col-span-8 space-y-4">
            {/* Top Workspace Tabs Bar (Underlined styling as in reference image) */}
            <div className="border-b border-zinc-800 flex items-center gap-8 text-sm font-medium">
              <button
                type="button"
                onClick={() => setActiveTab('examples')}
                className={`pb-3 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'examples'
                    ? 'border-white text-white font-semibold'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Examples
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('reader')}
                className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'reader'
                    ? 'border-white text-white font-semibold'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span>Reader Mode</span>
                {result && <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('response')}
                className={`pb-3 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'response'
                    ? 'border-white text-white font-semibold'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Raw / Structured
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('code')}
                className={`pb-3 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'code'
                    ? 'border-white text-white font-semibold'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Code
              </button>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="p-4 rounded-xl border border-zinc-700 bg-zinc-900/80 text-zinc-200 flex items-start gap-3">
                <Info className="h-5 w-5 text-white shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed font-mono">
                  <span className="font-semibold text-white">Extraction Notice: </span>
                  {error}
                </div>
              </div>
            )}

            {/* ================= TAB 1: EXAMPLES (Default on load) ================= */}
            {activeTab === 'examples' && (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {EXAMPLES.map((ex) => {
                    const IconComponent = ex.icon;
                    return (
                      <div
                        key={ex.id}
                        onClick={() => handleSelectExample(ex)}
                        className="group p-5 rounded-xl border border-zinc-850 bg-zinc-950/60 hover:bg-zinc-900/50 hover:border-zinc-700 transition-all cursor-pointer flex flex-col justify-between space-y-4 shadow-sm"
                      >
                        <div className="space-y-3">
                          {/* Top Icon Badge in Rounded Square */}
                          <div className="h-9 w-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 group-hover:text-white group-hover:border-zinc-700 transition-colors">
                            <IconComponent className="h-4 w-4" />
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold text-white tracking-tight group-hover:text-white transition-colors">
                              {ex.title}
                            </h4>
                            <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed font-normal">
                              {ex.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 text-[11px] font-mono text-zinc-400 border-t border-zinc-900 group-hover:text-zinc-300">
                          <span className="truncate max-w-[220px]">{ex.url}</span>
                          <div className="flex items-center gap-1 text-zinc-400 group-hover:text-white">
                            <span>Scrape</span>
                            <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ================= TAB 2: READER MODE (Primary viewing experience) ================= */}
            {activeTab === 'reader' && (
              <div className="space-y-4 pt-2">
                {result ? (
                  <div className="rounded-xl border border-zinc-850 bg-zinc-950 p-6 sm:p-8 space-y-6 shadow-2xl">
                    {/* Header bar */}
                    <div className="border-b border-zinc-850 pb-5 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-white text-black font-bold font-mono text-[10px]">
                            {result.statusCode} {result.statusText}
                          </span>
                          <span className="text-xs font-mono text-zinc-400">
                            {result.fetchTimeMs}ms · {result.metadata.wordCount.toLocaleString()} words
                          </span>
                        </div>

                        {/* Font size buttons */}
                        <div className="flex items-center gap-1 text-xs font-mono text-zinc-400">
                          <button
                            type="button"
                            onClick={() => setReaderFontSize('sm')}
                            className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                              readerFontSize === 'sm' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'
                            }`}
                          >
                            A-
                          </button>
                          <button
                            type="button"
                            onClick={() => setReaderFontSize('base')}
                            className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                              readerFontSize === 'base' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'
                            }`}
                          >
                            A
                          </button>
                          <button
                            type="button"
                            onClick={() => setReaderFontSize('lg')}
                            className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                              readerFontSize === 'lg' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'
                            }`}
                          >
                            A+
                          </button>
                          <Button
                            onClick={() => handleCopy(result.readerMode?.markdown || result.metadata.description, 'reader-md')}
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs border-zinc-800 ml-2"
                          >
                            {copiedKey === 'reader-md' ? <Check className="h-3 w-3 text-white" /> : <Copy className="h-3 w-3" />}
                            <span>{copiedKey === 'reader-md' ? 'Copied' : 'Copy'}</span>
                          </Button>
                        </div>
                      </div>

                      {/* Anti-Bot Protections Active Pill Strip */}
                      <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[10px]">
                        <span className="px-2 py-0.5 rounded border border-zinc-800 bg-black text-zinc-300 flex items-center gap-1">
                          <ShieldCheck className="h-3 w-3 text-white" />
                          <span>TLSv1.3 Profile Active</span>
                        </span>
                        {result.stealthFingerprint.cloudflareSolver && (
                          <span className="px-2 py-0.5 rounded border border-zinc-800 bg-black text-zinc-300 flex items-center gap-1">
                            <Zap className="h-3 w-3 text-white" />
                            <span>Turnstile Challenge Solver</span>
                          </span>
                        )}
                        {result.stealthFingerprint.canvasNoiseProtection && (
                          <span className="px-2 py-0.5 rounded border border-zinc-800 bg-black text-zinc-300 flex items-center gap-1">
                            <EyeOff className="h-3 w-3 text-white" />
                            <span>Canvas Anti-Fingerprint Noise</span>
                          </span>
                        )}
                        {result.stealthFingerprint.googleReferrerSpoofed && (
                          <span className="px-2 py-0.5 rounded border border-zinc-800 bg-black text-zinc-300 flex items-center gap-1">
                            <Globe className="h-3 w-3 text-white" />
                            <span>Google Referrer Injected</span>
                          </span>
                        )}
                      </div>

                      {/* Title & Metadata */}
                      <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                          {result.metadata.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-400 mt-2">
                          <a
                            href={result.finalUrl || result.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-zinc-400 hover:text-white flex items-center gap-1 underline"
                          >
                            <span>{result.finalUrl || result.url}</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                          {result.metadata.author && (
                            <>
                              <span aria-hidden="true" className="text-zinc-700">·</span>
                              <span>By {result.metadata.author}</span>
                            </>
                          )}
                          {result.metadata.publishedDate && (
                            <>
                              <span aria-hidden="true" className="text-zinc-700">·</span>
                              <span>{result.metadata.publishedDate}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Research Papers Badge Box if detected */}
                      {includeLinks && researchPapers.length > 0 && (
                        <div className="p-3.5 rounded-lg border border-zinc-800 bg-zinc-900/70 space-y-2">
                          <div className="flex items-center gap-2 text-xs font-semibold text-white">
                            <GraduationCap className="h-4 w-4 text-white" />
                            <span>Academic & Research Papers Detected ({researchPapers.length})</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                            {researchPapers.slice(0, 4).map((paper, idx) => (
                              <a
                                key={idx}
                                href={paper.href}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 rounded bg-black border border-zinc-800 hover:border-zinc-600 text-zinc-300 hover:text-white truncate flex items-center justify-between transition-colors"
                              >
                                <span className="truncate">{paper.text}</span>
                                <ExternalLink className="h-3 w-3 shrink-0 ml-1 text-zinc-500" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Extracted Images Strip if present */}
                    {includeImages && extractedImagesList.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                          <ImageIcon className="h-3.5 w-3.5" />
                          <span>Extracted Media & Avatars ({extractedImagesList.length})</span>
                        </div>
                        <div className="flex items-center gap-3 overflow-x-auto pb-2">
                          {extractedImagesList.slice(0, 6).map((img, i) => (
                            <a
                              key={i}
                              href={img.url}
                              target="_blank"
                              rel="noreferrer"
                              className="shrink-0 h-16 w-24 rounded-lg overflow-hidden border border-zinc-800 bg-black hover:border-zinc-500 transition-colors"
                            >
                              <img
                                src={img.url}
                                alt={img.alt || 'Media'}
                                className="h-full w-full object-cover"
                                onError={(e) => ((e.target as HTMLElement).style.display = 'none')}
                              />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Markdown Body with clean paragraph links & final # Links paragraph */}
                    <div
                      className={`font-sans leading-relaxed text-zinc-200 space-y-4 ${
                        readerFontSize === 'sm'
                          ? 'text-xs'
                          : readerFontSize === 'base'
                          ? 'text-sm sm:text-base'
                          : readerFontSize === 'lg'
                          ? 'text-base sm:text-lg'
                          : 'text-lg sm:text-xl'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">
                        {result.readerMode?.markdown || result.metadata.description}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-12 rounded-xl border border-zinc-850 bg-zinc-950 text-center space-y-3">
                    <p className="text-sm font-semibold text-white">No extraction loaded yet</p>
                    <p className="text-xs text-zinc-400 max-w-md mx-auto">
                      Click an example card from the Examples tab or enter a custom URL on the left and click Execute Scrape.
                    </p>
                    <Button
                      onClick={() => handleExecuteScrape()}
                      variant="outline"
                      size="sm"
                      className="text-xs font-mono"
                    >
                      Run Default Extraction
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* ================= TAB 3: RAW / STRUCTURED RESPONSE ================= */}
            {activeTab === 'response' && (
              <div className="space-y-4 pt-2">
                {result ? (
                  <div className="rounded-xl border border-zinc-850 bg-zinc-950 overflow-hidden shadow-2xl">
                    {/* Sub-tabs */}
                    <div className="p-3 px-4 border-b border-zinc-850 flex items-center gap-2 bg-black text-xs font-mono">
                      <button
                        type="button"
                        onClick={() => setResponseSubTab('markdown')}
                        className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                          responseSubTab === 'markdown' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        Markdown
                      </button>
                      <button
                        type="button"
                        onClick={() => setResponseSubTab('papers')}
                        className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                          responseSubTab === 'papers' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        Links & Papers ({result.extractedLinks?.length || 0})
                      </button>
                      <button
                        type="button"
                        onClick={() => setResponseSubTab('images')}
                        className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                          responseSubTab === 'images' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        Images ({result.extractedImages?.length || 0})
                      </button>
                      <button
                        type="button"
                        onClick={() => setResponseSubTab('json')}
                        className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                          responseSubTab === 'json' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        JSON Tree
                      </button>
                      <button
                        type="button"
                        onClick={() => setResponseSubTab('html')}
                        className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                          responseSubTab === 'html' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        HTML
                      </button>
                    </div>

                    {/* Sub-tab content */}
                    <div className="p-5 max-h-[600px] overflow-y-auto font-mono text-xs leading-relaxed text-zinc-300">
                      {responseSubTab === 'markdown' && (
                        <pre className="whitespace-pre-wrap font-sans text-sm text-zinc-200 leading-relaxed">
                          {result.readerMode?.markdown || `# ${result.metadata.title}\n\n${result.metadata.description}`}
                        </pre>
                      )}

                      {responseSubTab === 'papers' && (
                        <div className="space-y-2">
                          {(result.extractedLinks || []).map((link, i) => (
                            <div key={i} className="p-3 rounded-lg border border-zinc-850 bg-black flex items-center justify-between">
                              <div className="space-y-1">
                                <span className="text-zinc-200 font-sans text-xs block">{link.text || link.href}</span>
                                <span className="text-zinc-500 text-[10px] font-mono block">{link.href}</span>
                              </div>
                              {link.isResearchPaper && (
                                <span className="px-2 py-0.5 rounded bg-white text-black font-bold text-[9px] shrink-0">
                                  RESEARCH PAPER
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {responseSubTab === 'images' && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {(result.extractedImages || []).map((img, i) => (
                            <div key={i} className="p-2 rounded border border-zinc-850 bg-black space-y-1">
                              <div className="h-24 rounded overflow-hidden bg-zinc-900">
                                <img
                                  src={img.url}
                                  alt={img.alt || 'Extracted'}
                                  className="h-full w-full object-cover"
                                  onError={(e) => ((e.target as HTMLElement).style.display = 'none')}
                                />
                              </div>
                              <span className="text-[10px] text-zinc-400 truncate block">{img.alt || img.url}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {responseSubTab === 'json' && (
                        <pre className="p-3 bg-black rounded border border-zinc-850 overflow-x-auto text-zinc-300">
                          {JSON.stringify(result, null, 2)}
                        </pre>
                      )}

                      {responseSubTab === 'html' && (
                        <pre className="p-3 bg-black rounded border border-zinc-850 overflow-x-auto text-zinc-300">
                          {result.readerMode?.contentHtml || result.rawHtmlSample || ''}
                        </pre>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-12 rounded-xl border border-zinc-850 bg-zinc-950 text-center space-y-3">
                    <p className="text-sm font-semibold text-white">No extraction loaded yet</p>
                  </div>
                )}
              </div>
            )}

            {/* ================= TAB 4: CODE SNIPPETS ================= */}
            {activeTab === 'code' && (
              <div className="space-y-4 pt-2">
                <div className="rounded-xl border border-zinc-850 bg-zinc-950 overflow-hidden shadow-2xl">
                  {/* Language Selector */}
                  <div className="p-3 px-4 border-b border-zinc-850 flex items-center justify-between bg-zinc-900/60 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setCodeLanguage('cli')}
                        className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                          codeLanguage === 'cli' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        CLI (npx)
                      </button>
                      <button
                        type="button"
                        onClick={() => setCodeLanguage('curl')}
                        className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                          codeLanguage === 'curl' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        cURL API
                      </button>
                      <button
                        type="button"
                        onClick={() => setCodeLanguage('node')}
                        className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                          codeLanguage === 'node' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        Node.js / TS
                      </button>
                      <button
                        type="button"
                        onClick={() => setCodeLanguage('python')}
                        className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                          codeLanguage === 'python' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        Python SDK
                      </button>
                    </div>

                    <Button
                      onClick={() => {
                        const code =
                          codeLanguage === 'cli'
                            ? `npx gray-scrape "${targetUrl}" ${adaptiveSelector ? `-s "${adaptiveSelector}"` : ''} ${includeLinks ? '--links' : ''} ${!includeImages ? '--no-images' : ''}`.trim()
                            : codeLanguage === 'curl'
                            ? `curl -X POST "https://gray-scrape.vercel.app/api/scrape" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "url": "${targetUrl}",\n    "selector": "${adaptiveSelector}",\n    "solveCloudflare": ${solveCloudflare},\n    "hideCanvas": ${hideCanvas},\n    "includeImages": ${includeImages},\n    "includeLinks": ${includeLinks}\n  }'`
                            : codeLanguage === 'node'
                            ? `const response = await fetch('https://gray-scrape.vercel.app/api/scrape', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({\n    url: '${targetUrl}',\n    selector: '${adaptiveSelector}',\n    solveCloudflare: ${solveCloudflare},\n    hideCanvas: ${hideCanvas},\n    includeImages: ${includeImages},\n    includeLinks: ${includeLinks}\n  })\n});\n\nconst data = await response.json();\nconsole.log(data.readerMode?.markdown);`
                            : `from scrapling import StealthyFetcher\n\n# Configure StealthyFetcher with anti-bot protections\nfetcher = StealthyFetcher(\n    solve_cloudflare=${solveCloudflare},\n    hide_canvas=${hideCanvas},\n    block_webrtc=${blockWebrtc},\n    google_search=${googleReferrer}\n)\npage = fetcher.get("${targetUrl}")\nprint(page.adapt_css("${adaptiveSelector}").text)`;
                        handleCopy(code, 'tab-code');
                      }}
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs border-zinc-800 hover:bg-zinc-800"
                    >
                      {copiedKey === 'tab-code' ? <Check className="h-3 w-3 text-white" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedKey === 'tab-code' ? 'Copied' : 'Copy Code'}</span>
                    </Button>
                  </div>

                  {/* Code Body */}
                  <div className="p-5 max-h-[550px] overflow-x-auto font-mono text-xs leading-relaxed text-zinc-300 bg-black">
                    {codeLanguage === 'cli' && (
                      <pre className="text-zinc-200">
                        {`# Extract target directly via Gray Scrape CLI (Zero setup required)\nnpx gray-scrape "${targetUrl}" ${adaptiveSelector ? `-s "${adaptiveSelector}"` : ''} ${includeLinks ? '--links' : ''} ${!includeImages ? '--no-images' : ''}\n\n# Or save directly to a Markdown document\nnpx gray-scrape "${targetUrl}" -o output.md`}
                      </pre>
                    )}

                    {codeLanguage === 'curl' && (
                      <pre className="text-zinc-200">
                        {`curl -X POST "https://gray-scrape.vercel.app/api/scrape" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "url": "${targetUrl}",\n    "selector": "${adaptiveSelector}",\n    "stealthMode": ${stealthEngine},\n    "solveCloudflare": ${solveCloudflare},\n    "hideCanvas": ${hideCanvas},\n    "blockWebrtc": ${blockWebrtc},\n    "includeImages": ${includeImages},\n    "includeLinks": ${includeLinks}\n  }'`}
                      </pre>
                    )}

                    {codeLanguage === 'node' && (
                      <pre className="text-zinc-200">
                        {`const response = await fetch('https://gray-scrape.vercel.app/api/scrape', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({\n    url: '${targetUrl}',\n    selector: '${adaptiveSelector}',\n    stealthMode: ${stealthEngine},\n    solveCloudflare: ${solveCloudflare},\n    hideCanvas: ${hideCanvas},\n    includeImages: ${includeImages},\n    includeLinks: ${includeLinks}\n  })\n});\n\nconst data = await response.json();\nconsole.log(data.readerMode?.markdown);`}
                      </pre>
                    )}

                    {codeLanguage === 'python' && (
                      <pre className="text-zinc-200">
                        {`from scrapling import StealthyFetcher\n\n# Initialize Scrapling StealthyFetcher with full anti-bot protection suite\nfetcher = StealthyFetcher(\n    solve_cloudflare=${solveCloudflare},\n    hide_canvas=${hideCanvas},\n    block_webrtc=${blockWebrtc},\n    google_search=${googleReferrer},\n    block_ads=${blockAdsAndTrackers}\n)\n\npage = fetcher.get("${targetUrl}")\n\n# Self-healing adaptive locator tracks elements even if classes mutate\nelement = page.adapt_css("${adaptiveSelector}")\nprint(f"[{element.tag}]: {element.text}")\n`}
                      </pre>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
