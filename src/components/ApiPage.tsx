import { useState } from 'react';
import {
  Code2,
  Terminal,
  Play,
  Copy,
  Check,
  RefreshCw,
  Clock,
  ExternalLink,
  ShieldCheck,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Button } from './ui/button.tsx';
import { Card } from './ui/card.tsx';

export function ApiPage() {
  const [testUrl, setTestUrl] = useState('https://en.wikipedia.org/wiki/Artificial_intelligence');
  const [testSelector, setTestSelector] = useState('h1, h2, p');
  const [testStealth, setTestStealth] = useState(true);
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRunApiTest = async () => {
    setLoading(true);
    setApiResponse(null);
    try {
      const startTime = Date.now();
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: testUrl,
          selector: testSelector,
          stealthMode: testStealth,
          userAgent: 'chrome-mac',
        }),
      });
      const data = await res.json();
      setApiResponse({
        status: res.status,
        latencyMs: Date.now() - startTime,
        data,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setApiResponse({
        status: 500,
        error: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-black min-h-[calc(100vh-5rem)] text-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-1">
            <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
            <span>REST API REFERENCE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Gray Scrape Cloud API
          </h1>
          <p className="text-sm text-zinc-400 mt-2 leading-relaxed max-w-3xl font-normal">
            Interact with Gray Scrape's high-speed anti-detect extraction engine over standard HTTP REST endpoints.
            Returns clean Markdown, structured DOM elements, images, and self-healing relocation metrics.
          </p>
        </div>

        {/* Endpoint Specs & Live Runner Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Endpoint Spec */}
          <div className="lg:col-span-6 space-y-6">
            <Card className="border-zinc-850 bg-zinc-950 p-6 space-y-5">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded bg-white text-black font-bold font-mono text-xs">
                  POST
                </span>
                <span className="font-mono text-sm font-semibold text-white">
                  /api/scrape
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-mono font-semibold uppercase text-zinc-400">
                  Request Headers
                </h3>
                <div className="p-3 bg-black rounded-lg border border-zinc-850 text-xs font-mono space-y-1 text-zinc-300">
                  <div>Content-Type: application/json</div>
                  <div>Accept: application/json</div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-mono font-semibold uppercase text-zinc-400">
                  Request JSON Body Parameters
                </h3>
                <div className="space-y-2 text-xs font-mono">
                  <div className="p-3 bg-black rounded-lg border border-zinc-850 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-bold">url</span>
                      <span className="text-zinc-500">string · required</span>
                    </div>
                    <p className="text-zinc-400 font-sans text-xs">The target HTTP/HTTPS webpage URL to extract.</p>
                  </div>

                  <div className="p-3 bg-black rounded-lg border border-zinc-850 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-bold">selector</span>
                      <span className="text-zinc-500">string · optional</span>
                    </div>
                    <p className="text-zinc-400 font-sans text-xs">CSS selector to extract and track with adaptive relocation.</p>
                  </div>

                  <div className="p-3 bg-black rounded-lg border border-zinc-850 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-bold">stealthMode</span>
                      <span className="text-zinc-500">boolean · default true</span>
                    </div>
                    <p className="text-zinc-400 font-sans text-xs">Enables TLSv1.3 fingerprinting and anti-bot evasions.</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick cURL Code */}
            <Card className="border-zinc-850 bg-zinc-950 p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-400">cURL Integration Command</span>
                <Button
                  onClick={() =>
                    handleCopy(
                      `curl -X POST "http://localhost:3000/api/scrape" \\\n  -H "Content-Type: application/json" \\\n  -d '{"url": "https://en.wikipedia.org/wiki/Artificial_intelligence", "selector": "#firstHeading"}'`,
                      'api-curl'
                    )
                  }
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs border-zinc-800"
                >
                  {copiedKey === 'api-curl' ? <Check className="h-3 w-3 text-white" /> : <Copy className="h-3 w-3" />}
                  <span>Copy cURL</span>
                </Button>
              </div>
              <pre className="p-4 bg-black rounded-lg border border-zinc-850 text-xs font-mono text-zinc-300 overflow-x-auto leading-relaxed">
{`curl -X POST "/api/scrape" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://en.wikipedia.org/wiki/Artificial_intelligence",
    "selector": "#firstHeading",
    "stealthMode": true
  }'`}
              </pre>
            </Card>
          </div>

          {/* Right: Live Interactive Test Runner */}
          <div className="lg:col-span-6 space-y-6">
            <Card className="border-zinc-850 bg-zinc-950 p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-white" />
                  <span className="text-sm font-semibold text-white tracking-tight">
                    Interactive API Test Console
                  </span>
                </div>
                <span className="text-xs font-mono text-zinc-500">Live Endpoint</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1.5">Target URL</label>
                  <input
                    type="text"
                    value={testUrl}
                    onChange={(e) => setTestUrl(e.target.value)}
                    className="w-full h-10 px-3 bg-black border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1.5">CSS Selector (Optional)</label>
                  <input
                    type="text"
                    value={testSelector}
                    onChange={(e) => setTestSelector(e.target.value)}
                    className="w-full h-10 px-3 bg-black border border-zinc-800 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-zinc-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-zinc-300 font-mono">Enable Stealth Engine</span>
                  <button
                    type="button"
                    onClick={() => setTestStealth(!testStealth)}
                    className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                      testStealth ? 'bg-white' : 'bg-zinc-800'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full transition-transform ${
                        testStealth ? 'translate-x-5 bg-black' : 'translate-x-0 bg-zinc-400'
                      }`}
                    />
                  </button>
                </div>

                <Button
                  onClick={handleRunApiTest}
                  disabled={loading}
                  className="w-full h-11 bg-white hover:bg-zinc-200 text-black font-semibold text-xs tracking-wide rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin text-black" />
                      <span>Executing API Call...</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5 fill-black" />
                      <span>Send API Request</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Response Output */}
              {apiResponse && (
                <div className="space-y-3 pt-4 border-t border-zinc-850">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="px-2 py-0.5 rounded bg-white text-black font-bold text-[10px]">
                      STATUS {apiResponse.status}
                    </span>
                    <span className="text-zinc-400">{apiResponse.latencyMs}ms latency</span>
                  </div>

                  <pre className="p-4 bg-black rounded-lg border border-zinc-850 text-xs font-mono text-zinc-300 max-h-72 overflow-y-auto leading-relaxed">
                    {JSON.stringify(apiResponse.data || apiResponse, null, 2)}
                  </pre>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
