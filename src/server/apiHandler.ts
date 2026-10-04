/**
 * Scrapling Studio - API Router & Search Engine
 */

import * as cheerio from 'cheerio';
import { parseScrapling, ScrapeOptions, ScrapeResult, stealthFetch } from './scraperEngine.ts';
import { scrapeTwitter, TwitterScrapeResponse } from './twitterScraper.ts';

export { scrapeTwitter, type TwitterScrapeResponse };

export interface SearchResultItem {
  title: string;
  url: string;
  snippet: string;
  domain: string;
}

// Built-in verified sample pages for instant playground exploration
export const DEMO_PRESETS: Array<{
  id: string;
  name: string;
  category: string;
  url: string;
  suggestedSelector: string;
  description: string;
}> = [
  {
    id: 'wikipedia-ai',
    name: 'Wikipedia: Artificial Intelligence',
    category: 'Knowledge',
    url: 'https://en.wikipedia.org/wiki/Artificial_intelligence',
    suggestedSelector: '#firstHeading',
    description: 'Long-form structured encyclopedia article with infobox, TOC, and rich citations.',
  },
  {
    id: 'hackernews',
    name: 'Hacker News Frontpage',
    category: 'Community',
    url: 'https://news.ycombinator.com',
    suggestedSelector: '.titleline > a',
    description: 'Dynamic link listing with vote scores, submitters, and discussion counts.',
  },
  {
    id: 'github-readme',
    name: 'GitHub: Scrapling Repository',
    category: 'Code & Docs',
    url: 'https://github.com/D4Vinci/Scrapling',
    suggestedSelector: 'article.markdown-body h1',
    description: 'Official open-source Scrapling library repository and technical documentation.',
  },
  {
    id: 'tech-news',
    name: 'TechCrunch: Latest News',
    category: 'News',
    url: 'https://techcrunch.com/category/artificial-intelligence/',
    suggestedSelector: 'h2.wp-block-post-title a',
    description: 'Modern media publication with paywall signals, bylines, and hero graphics.',
  },
];

/**
 * Handle /api/scrape request
 */
export async function handleScrape(options: any): Promise<ScrapeResult> {
  let url = (options.url || '').trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }

  const normalizedOptions: ScrapeOptions = {
    url,
    stealthMode: options.stealthMode !== false,
    userAgent: options.userAgent || 'chrome-mac',
    adaptiveSelector: options.adaptiveSelector || options.selector,
    simulateMutation: options.simulateMutation || false,
    extractMode: options.extractMode || 'reader',
    includeImages: options.includeImages !== false,
    includeLinks: options.includeLinks !== false,
    solveCloudflare: options.solveCloudflare !== false,
    hideCanvas: options.hideCanvas !== false,
    blockWebrtc: options.blockWebrtc !== false,
    blockAdsAndTrackers: options.blockAdsAndTrackers !== false,
    googleReferrer: options.googleReferrer !== false,
    allowWebgl: options.allowWebgl !== false,
  };

  try {
    const fetchRes = await stealthFetch(url, normalizedOptions);
    const parsed = parseScrapling(fetchRes.html, url, normalizedOptions, fetchRes);
    return parsed;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      url,
      finalUrl: url,
      statusCode: 500,
      statusText: 'Scrape Failed',
      fetchTimeMs: 0,
      contentLength: 0,
      headers: {},
      stealthFingerprint: {
        browserEmulated: 'Google Chrome 130',
        secChUa: '"Chromium";v="130"',
        platform: 'macOS',
        tlsProfile: 'TLSv1.3',
        antiBotBypass: false,
        cloudflareSolver: false,
        canvasNoiseProtection: false,
        webrtcShield: false,
        adAndTrackerShield: false,
        googleReferrerSpoofed: false,
        webglVendor: 'None',
      },
      metadata: {
        title: 'Failed to scrape target',
        description: errorMsg,
        wordCount: 0,
        readTimeMinutes: 0,
      },
      error: errorMsg,
    };
  }
}

/**
 * Search the web using multi-source resilient endpoints (free, zero API key)
 */
export async function searchWeb(query: string): Promise<SearchResultItem[]> {
  if (!query || !query.trim()) return [];

  const cleanQuery = query.trim();
  const results: SearchResultItem[] = [];

  // 1. Fetch Tech / Community Articles & Links from HN Algolia API
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);
    const hnRes = await fetch(
      `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(cleanQuery)}&hitsPerPage=6`,
      {
        headers: { 'User-Agent': 'GrayScrape/2.5' },
        signal: controller.signal,
      }
    );
    clearTimeout(timeoutId);
    if (hnRes.ok) {
      const hnData = await hnRes.json();
      if (Array.isArray(hnData.hits)) {
        for (const hit of hnData.hits) {
          const itemUrl = hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`;
          const title = hit.title || hit.story_title;
          if (title && itemUrl && !results.some(r => r.url === itemUrl)) {
            let domain = 'news.ycombinator.com';
            try {
              domain = new URL(itemUrl).hostname;
            } catch {
              // ignore
            }
            results.push({
              title,
              url: itemUrl,
              snippet: hit.comment_text
                ? hit.comment_text.replace(/<[^>]*>/g, '').slice(0, 160)
                : `Discussed on Hacker News (${hit.points || 0} points, ${hit.num_comments || 0} comments).`,
              domain,
            });
          }
        }
      }
    }
  } catch {
    // Graceful fallback without console.error
  }

  // 2. Fetch Knowledge Articles from Wikipedia Search API
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);
    const wikiRes = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
        cleanQuery
      )}&utf8=&format=json&srlimit=6`,
      {
        headers: { 'User-Agent': 'GrayScrape/2.5' },
        signal: controller.signal,
      }
    );
    clearTimeout(timeoutId);
    if (wikiRes.ok) {
      const wikiData = await wikiRes.json();
      if (wikiData.query?.search && Array.isArray(wikiData.query.search)) {
        for (const item of wikiData.query.search) {
          const articleUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(
            item.title.replace(/\s+/g, '_')
          )}`;
          if (!results.some(r => r.url === articleUrl)) {
            const cleanSnippet = (item.snippet || '')
              .replace(/<[^>]*>/g, '')
              .replace(/&quot;/g, '"')
              .replace(/&#039;/g, "'");
            results.push({
              title: item.title,
              url: articleUrl,
              snippet: cleanSnippet || `Wikipedia article covering ${item.title}.`,
              domain: 'en.wikipedia.org',
            });
          }
        }
      }
    }
  } catch {
    // Graceful fallback without console.error
  }

  // 3. If empty, provide curated direct search anchors
  if (results.length === 0) {
    results.push(
      {
        title: `${cleanQuery} on Wikipedia`,
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(cleanQuery.replace(/\s+/g, '_'))}`,
        snippet: `Explore live articles, technical definitions, and citations related to "${cleanQuery}".`,
        domain: 'en.wikipedia.org',
      },
      {
        title: `GitHub Search: ${cleanQuery}`,
        url: `https://github.com/search?q=${encodeURIComponent(cleanQuery)}`,
        snippet: `Find repositories, code implementations, and documentation for "${cleanQuery}".`,
        domain: 'github.com',
      }
    );
  }

  return results;
}
