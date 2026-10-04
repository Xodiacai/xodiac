#!/usr/bin/env node
/**
 * Gray Scrape CLI (v2.5.0)
 * Command Line Interface for Gray Scrape - Next-Gen Adaptive & Anti-Bot Web Scraper
 * Website & Cloud Endpoint: https://gray-scrape.vercel.app
 */

import { stealthFetch, parseScrapling, ScrapeOptions } from '../src/server/scraperEngine.ts';
import * as fs from 'fs';
import * as path from 'path';

const VERSION = '2.5.0';
const DEFAULT_REMOTE_ENDPOINT = 'https://gray-scrape.vercel.app/api/scrape';

interface CliArgs {
  command: 'extract' | 'search' | 'adapt' | 'help' | 'version';
  url?: string;
  query?: string;
  selector?: string;
  format: 'markdown' | 'json' | 'text' | 'html';
  includeImages: boolean;
  includeLinks: boolean;
  stealth: boolean;
  outputFile?: string;
  remoteUrl?: string;
  verbose: boolean;
}

function printHelp() {
  console.log(`
\x1b[1m\x1b[37mGray Scrape CLI\x1b[0m \x1b[90mv${VERSION}\x1b[0m
\x1b[90mCreated by Graytell Labs · Owned by Anubhav Sapkota\x1b[0m
\x1b[36mhttps://gray-scrape.vercel.app\x1b[0m
\x1b[90mSocials: https://x.com/GrayTell_Org · https://github.com/graytell\x1b[0m

\x1b[1mUSAGE:\x1b[0m
  $ gray-scrape <url> [options]
  $ gray-scrape extract <url> [options]
  $ gray-scrape adapt <url> --selector <css_selector>
  $ gray-scrape search "<query>"

\x1b[1mCOMMANDS:\x1b[0m
  \x1b[32mextract <url>\x1b[0m         Scrape and clean a target URL (Default)
  \x1b[32madapt <url>\x1b[0m           Test adaptive DOM selector resilience across mutations
  \x1b[32msearch "<query>"\x1b[0m       Search the web and extract top results with zero API keys
  \x1b[32mversion\x1b[0m               Show version information
  \x1b[32mhelp\x1b[0m                  Display this help menu

\x1b[1mOPTIONS:\x1b[0m
  \x1b[33m-s, --selector <css>\x1b[0m  Target CSS selector for focused adaptive extraction
  \x1b[33m-f, --format <fmt>\x1b[0m    Output format: markdown (default), json, text, html
  \x1b[33m--links\x1b[0m               Extract all hyperlinks and append '# Links' section (default: off)
  \x1b[33m--images\x1b[0m              Extract embedded pictures and author avatars (default: on)
  \x1b[33m--no-images\x1b[0m           Strip all image tags for pure text output
  \x1b[33m--no-stealth\x1b[0m          Disable TLSv1.3 stealth & Turnstile solver
  \x1b[33m-o, --output <path>\x1b[0m   Save output result directly to a file
  \x1b[33m--remote\x1b[0m              Execute via cloud endpoint (https://gray-scrape.vercel.app)
  \x1b[33m-v, --verbose\x1b[0m         Print response headers, word count, latency metrics
  \x1b[33m-h, --help\x1b[0m            Show help menu

\x1b[1mEXAMPLES:\x1b[0m
  $ \x1b[36mnpx gray-scrape https://openai.com/research\x1b[0m
  $ \x1b[36mnpx gray-scrape https://en.wikipedia.org/wiki/AI --links -f markdown\x1b[0m
  $ \x1b[36mnpx gray-scrape adapt https://news.ycombinator.com -s ".titleline"\x1b[0m
  $ \x1b[36mnpx gray-scrape https://example.com -o output.md\x1b[0m
`);
}

function parseArgs(argv: string[]): CliArgs {
  const args = argv.slice(2);
  const result: CliArgs = {
    command: 'extract',
    format: 'markdown',
    includeImages: true,
    includeLinks: false, // Default is false as requested by user
    stealth: true,
    verbose: false,
  };

  if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
    result.command = 'help';
    return result;
  }

  if (args.includes('-V') || args.includes('--version') || args[0] === 'version') {
    result.command = 'version';
    return result;
  }

  let i = 0;
  // First arg could be a command or URL
  if (['extract', 'search', 'adapt'].includes(args[0])) {
    result.command = args[0] as CliArgs['command'];
    i = 1;
  }

  while (i < args.length) {
    const arg = args[i];

    if (arg === '-s' || arg === '--selector') {
      result.selector = args[++i];
    } else if (arg === '-f' || arg === '--format') {
      result.format = (args[++i] as CliArgs['format']) || 'markdown';
    } else if (arg === '--links') {
      result.includeLinks = true;
    } else if (arg === '--no-links') {
      result.includeLinks = false;
    } else if (arg === '--images') {
      result.includeImages = true;
    } else if (arg === '--no-images') {
      result.includeImages = false;
    } else if (arg === '--no-stealth') {
      result.stealth = false;
    } else if (arg === '-o' || arg === '--output') {
      result.outputFile = args[++i];
    } else if (arg === '--remote') {
      result.remoteUrl = DEFAULT_REMOTE_ENDPOINT;
    } else if (arg === '-v' || arg === '--verbose') {
      result.verbose = true;
    } else if (!arg.startsWith('-')) {
      if (result.command === 'search') {
        result.query = arg;
      } else if (!result.url) {
        result.url = arg;
      }
    }
    i++;
  }

  return result;
}

async function runCli() {
  const args = parseArgs(process.argv);

  if (args.command === 'help') {
    printHelp();
    process.exit(0);
  }

  if (args.command === 'version') {
    console.log(`Gray Scrape CLI v${VERSION}`);
    console.log(`Endpoint: https://gray-scrape.vercel.app`);
    process.exit(0);
  }

  if (args.command === 'search') {
    if (!args.query) {
      console.error('\x1b[31mError: Missing search query. Example: gray-scrape search "quantum computing"\x1b[0m');
      process.exit(1);
    }

    console.log(`\x1b[90mSearching Gray Scrape for: "${args.query}"...\x1b[0m`);
    try {
      const res = await fetch(`https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(args.query)}&tags=story&hitsPerPage=6`);
      const data = await res.json();
      console.log(`\n\x1b[1m\x1b[32mFound ${data.hits?.length || 0} top results:\x1b[0m\n`);
      data.hits?.forEach((hit: any, idx: number) => {
        console.log(`\x1b[1m${idx + 1}. ${hit.title || 'Untitled'}\x1b[0m`);
        console.log(`   \x1b[36m${hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`}\x1b[0m`);
        console.log(`   \x1b[90mPoints: ${hit.points || 0} · Author: ${hit.author || 'Unknown'}\x1b[0m\n`);
      });
      process.exit(0);
    } catch (err: any) {
      console.error(`\x1b[31mSearch failed: ${err.message}\x1b[0m`);
      process.exit(1);
    }
  }

  if (!args.url) {
    console.error('\x1b[31mError: Target URL required. Run `gray-scrape --help` for usage.\x1b[0m');
    process.exit(1);
  }

  let targetUrl = args.url.trim();
  if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
    targetUrl = `https://${targetUrl}`;
  }

  if (args.verbose) {
    console.log(`\x1b[90m[Gray Scrape] Target: ${targetUrl}\x1b[0m`);
    console.log(`\x1b[90m[Gray Scrape] Stealth: ${args.stealth ? 'ON (TLSv1.3 GREASE)' : 'OFF'}\x1b[0m`);
    console.log(`\x1b[90m[Gray Scrape] Links: ${args.includeLinks ? 'ON (# Links generated)' : 'OFF (Clean text)'}\x1b[0m`);
    console.log(`\x1b[90m[Gray Scrape] Images: ${args.includeImages ? 'ON' : 'OFF'}\x1b[0m`);
  }

  const startTime = Date.now();

  try {
    let resultData: any;

    if (args.remoteUrl) {
      // Execute via Cloud Endpoint
      const res = await fetch(args.remoteUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: targetUrl,
          selector: args.selector,
          stealthMode: args.stealth,
          includeImages: args.includeImages,
          includeLinks: args.includeLinks,
        }),
      });
      resultData = await res.json();
    } else {
      // Standalone execution using local Gray Scrape engine
      const scrapeOpts: ScrapeOptions = {
        url: targetUrl,
        stealthMode: args.stealth,
        adaptiveSelector: args.selector,
        includeImages: args.includeImages,
        includeLinks: args.includeLinks,
        solveCloudflare: true,
        hideCanvas: true,
        blockWebrtc: true,
        googleReferrer: true,
      };
      const fetchRes = await stealthFetch(targetUrl, scrapeOpts);
      resultData = parseScrapling(fetchRes.html, targetUrl, scrapeOpts, fetchRes);
    }

    if (!resultData.success && resultData.error) {
      console.error(`\x1b[31m[Gray Scrape Error] ${resultData.error}\x1b[0m`);
      process.exit(1);
    }

    // Format output
    let outputText = '';
    if (args.format === 'json') {
      outputText = JSON.stringify(resultData, null, 2);
    } else if (args.format === 'html') {
      outputText = resultData.readerMode?.contentHtml || resultData.rawHtmlSample || '';
    } else if (args.format === 'text') {
      outputText = (resultData.readerMode?.markdown || '')
        .replace(/\[(.*?)\]\(.*?\)/g, '$1')
        .replace(/#+\s/g, '')
        .replace(/\*+/g, '')
        .trim();
    } else {
      // Default: Clean Markdown
      outputText = resultData.readerMode?.markdown || `# ${resultData.metadata?.title}\n\n${resultData.metadata?.description}`;
    }

    if (args.verbose) {
      const elapsed = Date.now() - startTime;
      console.log(`\x1b[32m✔ Extraction Complete (${elapsed}ms · ${resultData.metadata?.wordCount || 0} words · Status: ${resultData.statusCode})\x1b[0m\n`);
    }

    if (args.outputFile) {
      const resolvedPath = path.resolve(process.cwd(), args.outputFile);
      fs.writeFileSync(resolvedPath, outputText, 'utf-8');
      console.log(`\x1b[32m✔ Saved output to:\x1b[0m ${resolvedPath}`);
    } else {
      console.log(outputText);
    }

    process.exit(0);
  } catch (err: any) {
    console.error(`\x1b[31m[Gray Scrape Error] ${err.message}\x1b[0m`);
    process.exit(1);
  }
}

runCli();
