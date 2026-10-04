import { useState } from 'react';
import {
  BookOpen,
  Terminal,
  Code2,
  Shield,
  Layers,
  Copy,
  Check,
  Search,
  ExternalLink,
  ChevronRight,
  Zap,
  Sparkles,
  Globe,
  Download,
  Cpu,
  HelpCircle,
  FileCode,
  CheckCircle2,
} from 'lucide-react';
import { Button } from './ui/button.tsx';
import { Card } from './ui/card.tsx';

export function DocsPage() {
  const [selectedSection, setSelectedSection] = useState('cli');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const SECTIONS = [
    { id: 'cli', title: 'Gray Scrape CLI & Cloud API', icon: Terminal },
    { id: 'ai-agents', title: 'AI Agents & Tool Calling (read_page)', icon: Cpu },
    { id: 'quickstart', title: 'Step-by-Step Installation & Setup', icon: Zap },
    { id: 'stealth', title: 'Stealth & Anti-Bot Protections', icon: Shield },
    { id: 'adaptive', title: 'Adaptive Relocator (adapt_css)', icon: Layers },
    { id: 'api-spec', title: 'REST API & Cloud Endpoints', icon: Code2 },
    { id: 'faq', title: 'FAQ & Troubleshooting Guide', icon: HelpCircle },
  ];

  return (
    <div className="w-full bg-black min-h-[calc(100vh-5rem)] text-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Docs Sidebar */}
          <div className="lg:col-span-3 rounded-xl border border-zinc-850 bg-zinc-950 p-4 space-y-2 sticky top-24 shadow-xl">
            <div className="text-xs font-mono font-semibold uppercase text-zinc-400 px-3 py-1">
              Gray Scrape Docs
            </div>
            <nav className="space-y-1">
              {SECTIONS.map((sec) => {
                const Icon = sec.icon;
                const active = selectedSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => setSelectedSection(sec.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      active
                        ? 'bg-zinc-850 text-white font-semibold shadow-sm'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4 text-zinc-400" />
                      <span>{sec.title}</span>
                    </div>
                    {active && <ChevronRight className="h-3.5 w-3.5 text-white" />}
                  </button>
                );
              })}
            </nav>

            <div className="pt-4 mt-4 border-t border-zinc-850 px-3 space-y-2 font-mono text-xs text-zinc-400">
              <a
                href="https://gray-scrape.vercel.app"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-white transition-colors block"
              >
                <Globe className="h-3.5 w-3.5" />
                <span>gray-scrape.vercel.app</span>
                <ExternalLink className="h-3 w-3" />
              </a>
              <a
                href="/llms.txt"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-white transition-colors block text-zinc-400"
              >
                <FileCode className="h-3.5 w-3.5" />
                <span>llms.txt (LLM Spec)</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Docs Main Content */}
          <div className="lg:col-span-9 space-y-8">
            {/* Section 0: Gray Scrape CLI (Primary requested feature) */}
            {selectedSection === 'cli' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    Gray Scrape CLI
                  </h1>
                  <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
                    The official command-line tool for Gray Scrape. Extract structured data, clean markdown, and research papers from any URL directly from your terminal or CI/CD pipelines.
                  </p>
                </div>

                {/* Instant npx command */}
                <Card className="border-zinc-850 bg-zinc-950 p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-zinc-400">Run Instantly with npx (Zero install required)</span>
                    <Button
                      onClick={() => handleCopy('npx gray-scrape https://openai.com/research', 'npx-cmd')}
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs border-zinc-800 hover:bg-zinc-850"
                    >
                      {copiedKey === 'npx-cmd' ? <Check className="h-3 w-3 text-white" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedKey === 'npx-cmd' ? 'Copied' : 'Copy'}</span>
                    </Button>
                  </div>
                  <pre className="p-3 bg-black rounded-lg text-xs font-mono text-zinc-200 overflow-x-auto border border-zinc-900">
                    npx gray-scrape https://openai.com/research
                  </pre>
                </Card>

                {/* Global Install */}
                <Card className="border-zinc-850 bg-zinc-950 p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-zinc-400">Global Installation (npm / pnpm / yarn)</span>
                    <Button
                      onClick={() => handleCopy('npm install -g gray-scrape', 'npm-install')}
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs border-zinc-800 hover:bg-zinc-850"
                    >
                      {copiedKey === 'npm-install' ? <Check className="h-3 w-3 text-white" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedKey === 'npm-install' ? 'Copied' : 'Copy'}</span>
                    </Button>
                  </div>
                  <pre className="p-3 bg-black rounded-lg text-xs font-mono text-zinc-200 overflow-x-auto border border-zinc-900">
                    npm install -g gray-scrape
                  </pre>
                </Card>

                {/* CLI Commands Reference Table */}
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-white">CLI Command Reference</h3>
                  <div className="rounded-xl border border-zinc-850 bg-zinc-950 overflow-hidden">
                    <div className="divide-y divide-zinc-850 font-mono text-xs">
                      <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-2 bg-black font-semibold text-zinc-400">
                        <div className="md:col-span-5">Command / Flag</div>
                        <div className="md:col-span-7">Description & Behavior</div>
                      </div>

                      <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-2">
                        <div className="md:col-span-5 text-white font-semibold">gray-scrape &lt;url&gt;</div>
                        <div className="md:col-span-7 text-zinc-400 font-sans">
                          Scrapes the target URL in stealth mode and outputs clean formatted Markdown.
                        </div>
                      </div>

                      <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-2">
                        <div className="md:col-span-5 text-white font-semibold">-s, --selector &lt;css&gt;</div>
                        <div className="md:col-span-7 text-zinc-400 font-sans">
                          Runs adaptive element extraction on the specified CSS selector with automatic DOM relocation.
                        </div>
                      </div>

                      <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-2">
                        <div className="md:col-span-5 text-white font-semibold">--links</div>
                        <div className="md:col-span-7 text-zinc-400 font-sans">
                          Enables hyperlink parsing and appends a dedicated <code className="text-white"># Links</code> section at the end of the document. (Default: closed/off).
                        </div>
                      </div>

                      <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-2">
                        <div className="md:col-span-5 text-white font-semibold">--images / --no-images</div>
                        <div className="md:col-span-7 text-zinc-400 font-sans">
                          Toggles extraction of embedded figures, author avatars, and diagrams (Default: on).
                        </div>
                      </div>

                      <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-2">
                        <div className="md:col-span-5 text-white font-semibold">-f, --format &lt;fmt&gt;</div>
                        <div className="md:col-span-7 text-zinc-400 font-sans">
                          Output format: <code className="text-zinc-200">markdown</code> (default), <code className="text-zinc-200">json</code>, <code className="text-zinc-200">text</code>, <code className="text-zinc-200">html</code>.
                        </div>
                      </div>

                      <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-2">
                        <div className="md:col-span-5 text-white font-semibold">-o, --output &lt;file&gt;</div>
                        <div className="md:col-span-7 text-zinc-400 font-sans">
                          Writes the scraped output directly to a file (e.g. <code className="text-zinc-200">-o paper.md</code>).
                        </div>
                      </div>

                      <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-2">
                        <div className="md:col-span-5 text-white font-semibold">gray-scrape search "&lt;q&gt;"</div>
                        <div className="md:col-span-7 text-zinc-400 font-sans">
                          Performs web search across tech & community databases without needing any API key.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Practical Examples */}
                <div className="space-y-3">
                  <h3 className="text-base font-semibold text-white">Example Workflows</h3>
                  <div className="p-4 rounded-xl border border-zinc-850 bg-black font-mono text-xs text-zinc-300 space-y-3">
                    <div>
                      <span className="text-zinc-500"># 1. Scrape an academic research paper to markdown</span>
                      <p className="text-white mt-0.5">npx gray-scrape https://openai.com/research --links -o openai-research.md</p>
                    </div>
                    <div>
                      <span className="text-zinc-500"># 2. Extract specific adaptive element with JSON output</span>
                      <p className="text-white mt-0.5">npx gray-scrape https://news.ycombinator.com -s ".titleline" -f json</p>
                    </div>
                    <div>
                      <span className="text-zinc-500"># 3. Search web without API keys</span>
                      <p className="text-white mt-0.5">npx gray-scrape search "next generation llm agents"</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Section: AI Agents & Tool Calling (read_page) */}
            {selectedSection === 'ai-agents' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    Integrating Gray Scrape into AI Agents
                  </h1>
                  <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
                    Yes! Gray Scrape is engineered specifically for AI Agents (LangChain, OpenAI Agents, Gemini, CrewAI, AutoGen, and custom LLM loops). It returns clean, token-efficient Markdown with ads, navigation, and boilerplate stripped out.
                  </p>
                </div>

                {/* Method 1: TypeScript / Node.js AI Tool */}
                <Card className="border-zinc-850 bg-zinc-950 p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-white">TypeScript / Node.js Agent Tool</h3>
                      <p className="text-xs text-zinc-400 mt-0.5">Ready-to-use function for OpenAI, Gemini, or Claude agents</p>
                    </div>
                    <Button
                      onClick={() =>
                        handleCopy(
                          `async function readWebPage(url: string, selector?: string) {\n  const res = await fetch('https://gray-scrape.vercel.app/api/scrape', {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify({ url, selector, stealthMode: true, includeImages: false, includeLinks: false }),\n  });\n  const data = await res.json();\n  return data.readerMode?.markdown || data.metadata?.description || 'No content extracted';\n}`,
                          'ts-agent'
                        )
                      }
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs border-zinc-800 hover:bg-zinc-850"
                    >
                      {copiedKey === 'ts-agent' ? <Check className="h-3 w-3 text-white" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedKey === 'ts-agent' ? 'Copied' : 'Copy Tool'}</span>
                    </Button>
                  </div>
                  <pre className="p-3 bg-black rounded-lg text-xs font-mono text-zinc-200 overflow-x-auto border border-zinc-900 leading-relaxed">
{`/**
 * AI Agent Tool: read_web_page
 * Uses Gray Scrape stealth engine to fetch and clean any webpage
 */
async function readWebPage(url: string, selector?: string): Promise<string> {
  const response = await fetch('https://gray-scrape.vercel.app/api/scrape', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url,
      selector,
      stealthMode: true,
      includeImages: false, // Save LLM context window tokens
      includeLinks: false,  // Clean pure text
    }),
  });

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || 'Failed to read page');
  }

  return data.readerMode?.markdown || data.metadata?.description || '';
}`}
                  </pre>
                </Card>

                {/* Method 2: OpenAI Function Calling Schema */}
                <Card className="border-zinc-850 bg-zinc-950 p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-white">OpenAI / Claude Tool Schema (JSON)</h3>
                      <p className="text-xs text-zinc-400 mt-0.5">Function definition schema for OpenAI / Gemini function calling</p>
                    </div>
                    <Button
                      onClick={() =>
                        handleCopy(
                          JSON.stringify(
                            {
                              type: 'function',
                              function: {
                                name: 'read_web_page',
                                description: 'Scrapes and reads the clean markdown text content of any website or academic paper without being blocked by anti-bot shields.',
                                parameters: {
                                  type: 'object',
                                  properties: {
                                    url: { type: 'string', description: 'The absolute URL to read (e.g. https://openai.com/research)' },
                                    selector: { type: 'string', description: 'Optional CSS selector for targeted element extraction' },
                                  },
                                  required: ['url'],
                                },
                              },
                            },
                            null,
                            2
                          ),
                          'schema-json'
                        )
                      }
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs border-zinc-800 hover:bg-zinc-850"
                    >
                      {copiedKey === 'schema-json' ? <Check className="h-3 w-3 text-white" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedKey === 'schema-json' ? 'Copied' : 'Copy Schema'}</span>
                    </Button>
                  </div>
                  <pre className="p-3 bg-black rounded-lg text-xs font-mono text-zinc-200 overflow-x-auto border border-zinc-900 leading-relaxed">
{`{
  "type": "function",
  "function": {
    "name": "read_web_page",
    "description": "Reads and extracts clean markdown text from any web page, bypassing Cloudflare and bot shields.",
    "parameters": {
      "type": "object",
      "properties": {
        "url": {
          "type": "string",
          "description": "The target website URL to read"
        },
        "selector": {
          "type": "string",
          "description": "Optional CSS selector to extract specific section"
        }
      },
      "required": ["url"]
    }
  }
}`}
                  </pre>
                </Card>

                {/* Method 3: Python LangChain / CrewAI Tool */}
                <Card className="border-zinc-850 bg-zinc-950 p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-white">Python LangChain / CrewAI Tool</h3>
                      <p className="text-xs text-zinc-400 mt-0.5">Integrate with Python agent frameworks</p>
                    </div>
                    <Button
                      onClick={() =>
                        handleCopy(
                          `import requests\nfrom langchain.tools import tool\n\n@tool\ndef read_web_page(url: str) -> str:\n    """Read and extract clean markdown content from any webpage bypassing bot protections."""\n    res = requests.post("https://gray-scrape.vercel.app/api/scrape", json={"url": url, "stealthMode": True})\n    return res.json().get("readerMode", {}).get("markdown", "")`,
                          'py-tool'
                        )
                      }
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs border-zinc-800 hover:bg-zinc-850"
                    >
                      {copiedKey === 'py-tool' ? <Check className="h-3 w-3 text-white" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedKey === 'py-tool' ? 'Copied' : 'Copy Tool'}</span>
                    </Button>
                  </div>
                  <pre className="p-3 bg-black rounded-lg text-xs font-mono text-zinc-200 overflow-x-auto border border-zinc-900 leading-relaxed">
{`import requests
from langchain.tools import tool

@tool
def read_web_page(url: str) -> str:
    """Read and extract clean markdown from any URL bypassing bot walls."""
    response = requests.post(
        "https://gray-scrape.vercel.app/api/scrape",
        json={"url": url, "stealthMode": True, "includeLinks": False}
    )
    data = response.json()
    return data.get("readerMode", {}).get("markdown", "Failed to extract page.")`}
                  </pre>
                </Card>
              </div>
            )}

            {/* Section 1: Step-by-Step Quickstart & Setup */}
            {selectedSection === 'quickstart' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    Step-by-Step Installation & Setup
                  </h1>
                  <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
                    Follow these 3 easy steps to start scraping protected websites with Gray Scrape CLI, Python, or API endpoints.
                  </p>
                </div>

                {/* Step 1 */}
                <div className="p-5 rounded-xl border border-zinc-850 bg-zinc-950 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-7 w-7 rounded-lg bg-white text-black font-bold font-mono text-xs flex items-center justify-center">
                      1
                    </div>
                    <h3 className="text-sm font-semibold text-white">Step 1: Choose Your Preferred Environment</h3>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed font-sans pl-10">
                    Gray Scrape offers three flexible runtimes depending on your workflow:
                  </p>
                  <div className="pl-10 grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                    <div className="p-3 rounded bg-black border border-zinc-850 text-zinc-300">
                      <span className="text-white font-bold block mb-1">CLI (Instant)</span>
                      <span>No setup. Run via <code className="text-zinc-200">npx gray-scrape &lt;url&gt;</code></span>
                    </div>
                    <div className="p-3 rounded bg-black border border-zinc-850 text-zinc-300">
                      <span className="text-white font-bold block mb-1">REST API</span>
                      <span>HTTP POST to <code className="text-zinc-200">/api/scrape</code></span>
                    </div>
                    <div className="p-3 rounded bg-black border border-zinc-850 text-zinc-300">
                      <span className="text-white font-bold block mb-1">Global CLI</span>
                      <span><code className="text-zinc-200">npm i -g gray-scrape</code></span>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-5 rounded-xl border border-zinc-850 bg-zinc-950 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-7 w-7 rounded-lg bg-white text-black font-bold font-mono text-xs flex items-center justify-center">
                      2
                    </div>
                    <h3 className="text-sm font-semibold text-white">Step 2: Execute Your First Stealth Scrape</h3>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed font-sans pl-10">
                    Run Gray Scrape on a target website to automatically solve Cloudflare challenges and extract clean markdown:
                  </p>
                  <div className="pl-10">
                    <pre className="p-3 bg-black rounded-lg text-xs font-mono text-zinc-200 border border-zinc-900 overflow-x-auto">
                      npx gray-scrape https://openai.com/research -o output.md
                    </pre>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-5 rounded-xl border border-zinc-850 bg-zinc-950 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-7 w-7 rounded-lg bg-white text-black font-bold font-mono text-xs flex items-center justify-center">
                      3
                    </div>
                    <h3 className="text-sm font-semibold text-white">Step 3: Integrate with Your Application or AI Agent</h3>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed font-sans pl-10">
                    Pass the extracted clean Markdown directly to your LLM, database, or agentic pipeline.
                  </p>
                </div>
              </div>
            )}

            {/* Section 2: Stealth */}
            {selectedSection === 'stealth' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    Stealth & Anti-Bot Protections
                  </h1>
                  <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
                    Gray Scrape incorporates multi-tier anti-detection protections to bypass Cloudflare Turnstile, browser fingerprinting, and WAF challenge pages.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl border border-zinc-850 bg-zinc-950 space-y-2">
                    <div className="h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white">
                      <Zap className="h-4 w-4" />
                    </div>
                    <h4 className="text-sm font-semibold text-white">Cloudflare Turnstile Solver</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Solves interactive and non-interactive Cloudflare Turnstile challenges automatically.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl border border-zinc-850 bg-zinc-950 space-y-2">
                    <div className="h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white">
                      <Shield className="h-4 w-4" />
                    </div>
                    <h4 className="text-sm font-semibold text-white">Canvas Anti-Fingerprint Noise</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Injects randomized noise into canvas readbacks to prevent tracking scripts from fingerprinting hardware.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Section 3: Adaptive Relocator */}
            {selectedSection === 'adaptive' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    Adaptive Selectors (<code className="text-white">adapt_css</code>)
                  </h1>
                  <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
                    Never worry about broken CSS selectors again when websites redesign or randomize class names.
                  </p>
                </div>

                <Card className="border-zinc-850 bg-zinc-950 p-5 space-y-3">
                  <div className="text-xs font-mono text-zinc-400">How Adaptive Relocation Works:</div>
                  <ol className="list-decimal list-inside space-y-2 text-xs text-zinc-300 font-sans leading-relaxed">
                    <li><strong className="text-white">Fingerprint Generation:</strong> Captures tag name, depth, parent hierarchy, text length, and structural signatures.</li>
                    <li><strong className="text-white">DOM Mutation Healing:</strong> When exact CSS matching fails, scans DOM candidates with multi-factor similarity scoring.</li>
                    <li><strong className="text-white">Continuous Self-Correction:</strong> Automatically returns the best candidate node with confidence rating.</li>
                  </ol>
                </Card>
              </div>
            )}

            {/* Section 4: REST API */}
            {selectedSection === 'api-spec' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    REST API Reference
                  </h1>
                  <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
                    Public cloud endpoints for automated extraction and web search.
                  </p>
                </div>

                <Card className="border-zinc-850 bg-zinc-950 p-5 space-y-4">
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="px-2 py-0.5 rounded bg-white text-black font-bold">POST</span>
                    <span className="text-white">https://gray-scrape.vercel.app/api/scrape</span>
                  </div>

                  <pre className="p-3 bg-black rounded-lg text-xs font-mono text-zinc-200 overflow-x-auto border border-zinc-900 leading-relaxed">
                    {`curl -X POST "https://gray-scrape.vercel.app/api/scrape" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://openai.com/research",
    "selector": "h1, article",
    "stealthMode": true,
    "includeImages": true,
    "includeLinks": false
  }'`}
                  </pre>
                </Card>
              </div>
            )}

            {/* Section 5: FAQ & Troubleshooting Guide */}
            {selectedSection === 'faq' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    Frequently Asked Questions & Troubleshooting
                  </h1>
                  <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
                    Clear answers to common questions, configuration choices, and troubleshooting steps to avoid confusion.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Q1 */}
                  <Card className="border-zinc-850 bg-zinc-950 p-5 space-y-2">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <HelpCircle className="h-4 w-4 text-zinc-400" />
                      <span>Why are links closed / disabled by default?</span>
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed font-sans pl-6">
                      By default, <code className="text-white">includeLinks</code> is set to <code className="text-white">false</code> so paragraphs extract pure, clean, distraction-free Markdown without clogging LLM context windows. If you need hyperlinks, simply pass <code className="text-white">--links</code> in CLI or set <code className="text-white">"includeLinks": true</code> in the API request, which appends a dedicated <code className="text-white"># Links</code> section at the bottom!
                    </p>
                  </Card>

                  {/* Q2 */}
                  <Card className="border-zinc-850 bg-zinc-950 p-5 space-y-2">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <HelpCircle className="h-4 w-4 text-zinc-400" />
                      <span>Will this work inside my AI Agent (LangChain / OpenAI / Gemini)?</span>
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed font-sans pl-6">
                      Yes! You can define a tool function <code className="text-white">read_web_page(url)</code> that calls <code className="text-white">POST https://gray-scrape.vercel.app/api/scrape</code>. It returns token-optimized Markdown ready for instant ingestion by your agent.
                    </p>
                  </Card>

                  {/* Q3 */}
                  <Card className="border-zinc-850 bg-zinc-950 p-5 space-y-2">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <HelpCircle className="h-4 w-4 text-zinc-400" />
                      <span>How does Gray Scrape bypass Cloudflare Turnstile?</span>
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed font-sans pl-6">
                      Gray Scrape uses TLSv1.3 ClientHello GREASE fingerprinting, canvas anti-fingerprint noise injection, organic Google search referrers, and Turnstile challenge solvers to pass bot checks smoothly.
                    </p>
                  </Card>

                  {/* Q4 */}
                  <Card className="border-zinc-850 bg-zinc-950 p-5 space-y-2">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <HelpCircle className="h-4 w-4 text-zinc-400" />
                      <span>Where is the LLM interface specification file located?</span>
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed font-sans pl-6">
                      The official LLM specification file is served live at <a href="/llms.txt" target="_blank" rel="noreferrer" className="text-white underline font-mono">/llms.txt</a> and <a href="/llms-full.txt" target="_blank" rel="noreferrer" className="text-white underline font-mono">/llms-full.txt</a> for automated web crawlers and agents.
                    </p>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
