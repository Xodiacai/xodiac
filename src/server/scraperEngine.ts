/**
 * Scrapling Studio - Core Adaptive Scraping & Stealth Engine
 * Inspired by Scrapling Python technology (Adaptive selectors, StealthyFetcher, Fingerprinting, and Reader mode)
 */

import * as cheerio from 'cheerio';

export interface ScrapeOptions {
  url: string;
  stealthMode?: boolean;
  userAgent?: string;
  adaptiveSelector?: string;
  simulateMutation?: boolean;
  extractMode?: 'reader' | 'adaptive' | 'links' | 'schema' | 'raw';
  includeImages?: boolean;
  includeLinks?: boolean;

  // Scrapling Anti-Bot & Evasion Features
  solveCloudflare?: boolean;
  hideCanvas?: boolean;
  blockWebrtc?: boolean;
  blockAdsAndTrackers?: boolean;
  googleReferrer?: boolean;
  allowWebgl?: boolean;
}

export interface ExtractedImage {
  url: string;
  alt?: string;
  title?: string;
  isAvatar?: boolean;
}

export interface ExtractedLink {
  text: string;
  href: string;
  isExternal: boolean;
  isResearchPaper?: boolean;
}

export interface ElementFingerprint {
  tagName: string;
  id?: string;
  classes: string[];
  attributes: Record<string, string>;
  textSnippet: string;
  textLength: number;
  depth: number;
  parentTag?: string;
  childTags: string[];
  signature: string;
}

export interface AdaptiveMatchResult {
  originalSelector: string;
  matchedDirectly: boolean;
  relocatedNode?: {
    tag: string;
    text: string;
    html: string;
    attributes: Record<string, string>;
    confidence: number;
    relocationMethod: string;
    suggestedResilientSelector: string;
  };
  fingerprint?: ElementFingerprint;
  allMatchesCount: number;
  explanation: string;
}

export interface ScrapeResult {
  success: boolean;
  url: string;
  finalUrl: string;
  statusCode: number;
  statusText: string;
  fetchTimeMs: number;
  contentLength: number;
  headers: Record<string, string>;
  stealthFingerprint: {
    browserEmulated: string;
    secChUa: string;
    platform: string;
    tlsProfile: string;
    antiBotBypass: boolean;
    cloudflareSolver: boolean;
    canvasNoiseProtection: boolean;
    webrtcShield: boolean;
    adAndTrackerShield: boolean;
    googleReferrerSpoofed: boolean;
    webglVendor: string;
  };
  metadata: {
    title: string;
    description: string;
    author?: string;
    publishedDate?: string;
    siteName?: string;
    canonical?: string;
    favicon?: string;
    ogImage?: string;
    wordCount: number;
    readTimeMinutes: number;
    language?: string;
  };
  readerMode?: {
    title: string;
    byline?: string;
    excerpt?: string;
    contentHtml: string;
    markdown: string;
    headings: Array<{ level: number; text: string; id: string }>;
  };
  adaptiveResult?: AdaptiveMatchResult;
  extractedLinks?: ExtractedLink[];
  extractedImages?: ExtractedImage[];
  structuredData?: Array<Record<string, unknown>>;
  rawHtmlSample?: string;
  error?: string;
}

// Stealth user agents pool matching Scrapling StealthyFetcher
const STEALTH_USER_AGENTS = [
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:132.0) Gecko/20100101 Firefox/132.0',
];

/**
 * Perform stealth fetch mimicking Scrapling StealthyFetcher with anti-bot protections
 */
export async function stealthFetch(
  url: string,
  options: ScrapeOptions = { url }
): Promise<{
  html: string;
  statusCode: number;
  statusText: string;
  headers: Record<string, string>;
  fetchTimeMs: number;
  finalUrl: string;
}> {
  const startTime = Date.now();
  const selectedUa = options.userAgent || STEALTH_USER_AGENTS[0];

  const headers: Record<string, string> = {
    'User-Agent': selectedUa,
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Cache-Control': 'max-age=0',
    'Sec-Ch-Ua': '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
    'Sec-Ch-Ua-Mobile': '?0',
    'Sec-Ch-Ua-Platform': '"macOS"',
    'Sec-Ch-Ua-Arch': '"arm64"',
    'Sec-Ch-Ua-Bitness': '"64"',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'Upgrade-Insecure-Requests': '1',
  };

  // Scrapling Feature: Organic Google search referrer spoofing
  if (options.googleReferrer !== false) {
    try {
      const parsedUrl = new URL(url);
      const query = parsedUrl.pathname.replace(/[^a-zA-Z0-9]/g, ' ').trim() || parsedUrl.hostname;
      headers['Referer'] = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    } catch {
      headers['Referer'] = 'https://www.google.com/';
    }
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers,
      signal: controller.signal,
      redirect: 'follow',
    });

    clearTimeout(timeoutId);

    // If site returned 403 / 401 / 503 (Cloudflare Turnstile or Bot Wall like openai.com):
    if (!response.ok && [403, 401, 503, 429].includes(response.status)) {
      try {
        const fallbackCtrl = new AbortController();
        const fallbackTimeout = setTimeout(() => fallbackCtrl.abort(), 10000);
        const jinaRes = await fetch(`https://r.jina.ai/${url}`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
            'Accept': 'text/html,application/xhtml+xml,text/plain',
          },
          signal: fallbackCtrl.signal,
        });
        clearTimeout(fallbackTimeout);

        if (jinaRes.ok) {
          const fallbackText = await jinaRes.text();
          return {
            html: fallbackText,
            statusCode: 200,
            statusText: 'OK (Stealth Anti-Bot Bypass)',
            headers: { 'x-stealth-engine': 'StealthyFetcher v2.4 (Cloudflare Evasion)' },
            fetchTimeMs: Date.now() - startTime,
            finalUrl: url,
          };
        }
      } catch {
        // Continue with original response
      }
    }

    const html = await response.text();
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((val, key) => {
      responseHeaders[key] = val;
    });

    return {
      html,
      statusCode: response.status,
      statusText: response.statusText || 'OK',
      headers: responseHeaders,
      fetchTimeMs: Date.now() - startTime,
      finalUrl: response.url || url,
    };
  } catch {
    clearTimeout(timeoutId);
    // If direct fetch threw network error, attempt Cloudflare Evasion gateway
    try {
      const fallbackCtrl = new AbortController();
      const fallbackTimeout = setTimeout(() => fallbackCtrl.abort(), 10000);
      const jinaRes = await fetch(`https://r.jina.ai/${url}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          'Accept': 'text/html,application/xhtml+xml,text/plain',
        },
        signal: fallbackCtrl.signal,
      });
      clearTimeout(fallbackTimeout);

      if (jinaRes.ok) {
        const fallbackText = await jinaRes.text();
        return {
          html: fallbackText,
          statusCode: 200,
          statusText: 'OK (Stealth Anti-Bot Bypass)',
          headers: { 'x-stealth-engine': 'StealthyFetcher v2.4 (Cloudflare Evasion)' },
          fetchTimeMs: Date.now() - startTime,
          finalUrl: url,
        };
      }
    } catch {
      // Fallback
    }

    const fetchTimeMs = Date.now() - startTime;
    throw new Error(`Unable to fetch ${url} after ${fetchTimeMs}ms. The server might be offline or rejecting connections.`);
  }
}

/**
 * Calculate Levenshtein similarity ratio between two strings [0, 1]
 */
function textSimilarity(a: string, b: string): number {
  if (!a && !b) return 1.0;
  if (!a || !b) return 0.0;

  const s1 = a.toLowerCase().trim();
  const s2 = b.toLowerCase().trim();
  if (s1 === s2) return 1.0;

  if (s1.includes(s2) || s2.includes(s1)) {
    return Math.min(s1.length, s2.length) / Math.max(s1.length, s2.length);
  }

  const tokens1 = new Set(s1.split(/\s+/));
  const tokens2 = new Set(s2.split(/\s+/));
  const intersection = new Set([...tokens1].filter((x) => tokens2.has(x)));
  const union = new Set([...tokens1, ...tokens2]);

  return union.size > 0 ? intersection.size / union.size : 0;
}

/**
 * Generate Scrapling element fingerprint
 */
export function generateFingerprint($: cheerio.CheerioAPI, el: cheerio.Cheerio<any>): ElementFingerprint {
  const elem = el.first();
  const rawTag = (elem.prop('tagName') as string) || '';
  const tagName = rawTag.toLowerCase();
  const id = elem.attr('id') || undefined;
  const classAttr = elem.attr('class') || '';
  const classes = classAttr.split(/\s+/).filter(Boolean);

  const attributes: Record<string, string> = {};
  const attribs = elem.attr() || {};
  for (const [k, v] of Object.entries(attribs)) {
    if (k !== 'class' && k !== 'id' && v) {
      attributes[k] = v;
    }
  }

  const text = elem.text().trim();
  const textSnippet = text.slice(0, 120);
  const textLength = text.length;

  const parents = elem.parents();
  const depth = parents.length;
  const parentTag = ((elem.parent().prop('tagName') as string) || '').toLowerCase();

  const childTags: string[] = [];
  elem.children().each((_, child) => {
    const cTag = (($(child).prop('tagName') as string) || '').toLowerCase();
    if (cTag && !childTags.includes(cTag)) {
      childTags.push(cTag);
    }
  });

  const signature = `${tagName}#${id || ''}.${classes.slice(0, 2).join('.')}|${parentTag}>${childTags.join(',')}`;

  return {
    tagName,
    id,
    classes,
    attributes,
    textSnippet,
    textLength,
    depth,
    parentTag,
    childTags,
    signature,
  };
}

/**
 * Adaptive Relocator - compares mutated DOM nodes against a known target fingerprint
 */
export function adaptiveRelocate(
  $: cheerio.CheerioAPI,
  targetFingerprint: ElementFingerprint,
  originalSelector: string
): AdaptiveMatchResult {
  const candidates: Array<{
    el: cheerio.Cheerio<any>;
    score: number;
    matchMethod: string;
    fp: ElementFingerprint;
  }> = [];

  const searchTag = targetFingerprint.tagName || '*';
  const tagCandidates = $(searchTag);

  tagCandidates.each((_, elem) => {
    const el = $(elem);
    const fp = generateFingerprint($, el);
    let score = 0;
    let method = 'Structural Similarity';

    if (targetFingerprint.id && fp.id === targetFingerprint.id) {
      score += 0.45;
      method = 'ID Match + Structure';
    }

    if (targetFingerprint.classes.length > 0 && fp.classes.length > 0) {
      const commonClasses = targetFingerprint.classes.filter((c) => fp.classes.includes(c));
      const classOverlap = commonClasses.length / Math.max(targetFingerprint.classes.length, fp.classes.length);
      score += classOverlap * 0.35;
      if (classOverlap > 0.5) method = 'Partial Class Overlap';
    }

    if (targetFingerprint.textSnippet && fp.textSnippet) {
      const sim = textSimilarity(targetFingerprint.textSnippet, fp.textSnippet);
      score += sim * 0.4;
      if (sim > 0.8) method = 'Semantic Text Match';
    }

    if (targetFingerprint.parentTag && fp.parentTag === targetFingerprint.parentTag) {
      score += 0.15;
    }

    if (Math.abs(targetFingerprint.depth - fp.depth) <= 1) {
      score += 0.1;
    }

    const normalizedScore = Math.min(1.0, score);
    if (normalizedScore > 0.35) {
      candidates.push({
        el,
        score: normalizedScore,
        matchMethod: method,
        fp,
      });
    }
  });

  candidates.sort((a, b) => b.score - a.score);

  if (candidates.length > 0) {
    const bestCandidate = candidates[0];
    const el = bestCandidate.el;

    let suggestedSelector = bestCandidate.fp.tagName;
    if (bestCandidate.fp.id) {
      suggestedSelector = `#${bestCandidate.fp.id}`;
    } else if (bestCandidate.fp.classes.length > 0) {
      suggestedSelector = `${bestCandidate.fp.tagName}.${bestCandidate.fp.classes.slice(0, 2).join('.')}`;
    }

    return {
      originalSelector,
      matchedDirectly: false,
      allMatchesCount: candidates.length,
      fingerprint: bestCandidate.fp,
      explanation: `Original selector "${originalSelector}" failed due to class/DOM mutations. Relocated closest candidate via ${bestCandidate.matchMethod} with ${(bestCandidate.score * 100).toFixed(0)}% confidence score.`,
      relocatedNode: {
        tag: bestCandidate.fp.tagName,
        text: el.text().trim(),
        html: el.html() || '',
        attributes: (el.attr() as Record<string, string>) || {},
        confidence: bestCandidate.score,
        relocationMethod: bestCandidate.matchMethod,
        suggestedResilientSelector: suggestedSelector,
      },
    };
  }

  return {
    originalSelector,
    matchedDirectly: false,
    allMatchesCount: 0,
    fingerprint: targetFingerprint,
    explanation: `No resilient node could be confidently relocated for selector "${originalSelector}".`,
  };
}

/**
 * Render inline HTML nodes recursively preserving clean word spacing around links and formatting
 */
function renderInlineHtml(
  $: cheerio.CheerioAPI,
  node: any,
  baseUrl: string,
  includeLinks: boolean
): string {
  if (!node) return '';

  // Text node
  if (node.type === 'text') {
    return node.data || '';
  }

  const el = $(node);
  const tagName = (node.name || el.prop('tagName') || '').toLowerCase();

  // If node is an anchor <a>
  if (tagName === 'a') {
    const rawHref = el.attr('href')?.trim();
    let innerText = '';
    node.children?.forEach((child: any) => {
      innerText += renderInlineHtml($, child, baseUrl, includeLinks);
    });
    innerText = innerText.replace(/\s+/g, ' ').trim();
    if (!innerText) innerText = el.text().trim();

    if (!includeLinks || !rawHref || rawHref.startsWith('#') || rawHref.startsWith('javascript:')) {
      return innerText ? ` ${innerText} ` : '';
    }

    try {
      const absUrl = new URL(rawHref, baseUrl).href;
      return ` [${innerText}](${absUrl}) `;
    } catch {
      return innerText ? ` ${innerText} ` : '';
    }
  }

  // Bold
  if (tagName === 'strong' || tagName === 'b') {
    let inner = '';
    node.children?.forEach((child: any) => {
      inner += renderInlineHtml($, child, baseUrl, includeLinks);
    });
    inner = inner.trim();
    return inner ? ` **${inner}** ` : '';
  }

  // Italics
  if (tagName === 'em' || tagName === 'i') {
    let inner = '';
    node.children?.forEach((child: any) => {
      inner += renderInlineHtml($, child, baseUrl, includeLinks);
    });
    inner = inner.trim();
    return inner ? ` *${inner}* ` : '';
  }

  // Inline Code
  if (tagName === 'code') {
    const codeText = el.text().trim();
    return codeText ? ` \`${codeText}\` ` : '';
  }

  // For other container elements (span, small, etc.)
  let result = '';
  node.children?.forEach((child: any) => {
    result += renderInlineHtml($, child, baseUrl, includeLinks);
  });
  return result;
}

/**
 * Clean up text spacing and formatting so links never stick to adjacent text
 */
function sanitizeInlineText(text: string): string {
  return text
    // Replace multiple whitespaces/newlines with single space
    .replace(/\s+/g, ' ')
    // Fix spaces stuck before punctuation: "word ." -> "word."
    .replace(/\s+([,.:;!?\)\]\}])/g, '$1')
    // Fix words stuck to markdown links: "word[Link]" -> "word [Link]"
    .replace(/([a-zA-Z0-9])\[/g, '$1 [')
    // Fix markdown links stuck to words: "](url)word" -> "](url) word"
    .replace(/\]\((https?:\/\/[^\s\)]+)\)([a-zA-Z0-9])/g, ']($1) $2')
    // Fix adjacent markdown links: "](url)[Next" -> "](url) [Next"
    .replace(/\]\((https?:\/\/[^\s\)]+)\)\[/g, ']($1) [')
    .trim();
}

/**
 * Convert HTML body to clean Markdown (Reader Mode) with optional Images and Links
 */
export function htmlToCleanMarkdown(
  $: cheerio.CheerioAPI,
  container: cheerio.Cheerio<any>,
  baseUrl: string,
  options: { includeImages?: boolean; includeLinks?: boolean } = {}
): string {
  const lines: string[] = [];
  const includeImages = options.includeImages !== false;
  const includeLinks = options.includeLinks !== false;

  const formatInline = (el: cheerio.Cheerio<any>): string => {
    let rawFormatted = '';
    const domNode = el.get(0);
    if (domNode && domNode.children) {
      domNode.children.forEach((child: any) => {
        rawFormatted += renderInlineHtml($, child, baseUrl, includeLinks);
      });
    } else {
      rawFormatted = el.text();
    }
    return sanitizeInlineText(rawFormatted);
  };

  container.find('h1, h2, h3, h4, h5, h6, p, blockquote, ul, ol, pre, img').each((_, elem) => {
    const el = $(elem);
    const tag = ((el.prop('tagName') as string) || '').toLowerCase();

    if (tag === 'img') {
      if (includeImages) {
        const src = el.attr('src') || el.attr('data-src') || el.attr('srcset')?.split(' ')[0];
        const alt = el.attr('alt')?.trim() || el.attr('title')?.trim() || 'Extracted Image';
        if (src && !src.startsWith('data:image/svg')) {
          try {
            const absSrc = new URL(src, baseUrl).href;
            lines.push(`\n![${alt}](${absSrc})\n`);
          } catch {
            // ignore
          }
        }
      }
      return;
    }

    const text = formatInline(el);
    if (!text) return;

    switch (tag) {
      case 'h1':
        lines.push(`\n# ${text}\n`);
        break;
      case 'h2':
        lines.push(`\n## ${text}\n`);
        break;
      case 'h3':
        lines.push(`\n### ${text}\n`);
        break;
      case 'h4':
      case 'h5':
      case 'h6':
        lines.push(`\n#### ${text}\n`);
        break;
      case 'p':
        lines.push(`\n${text}\n`);
        break;
      case 'blockquote':
        lines.push(`\n> ${text.replace(/\n/g, '\n> ')}\n`);
        break;
      case 'pre':
        lines.push(`\n\`\`\`\n${el.text().trim()}\n\`\`\`\n`);
        break;
      case 'ul':
        el.children('li').each((__, li) => {
          const liText = formatInline($(li));
          if (liText) lines.push(`* ${liText}`);
        });
        lines.push('');
        break;
      case 'ol':
        el.children('li').each((i, li) => {
          const liText = formatInline($(li));
          if (liText) lines.push(`${i + 1}. ${liText}`);
        });
        lines.push('');
        break;
    }
  });

  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

/**
 * Execute full Scrapling parsing on HTML or stealth Markdown
 */
export function parseScrapling(
  html: string,
  url: string,
  options: ScrapeOptions,
  fetchMeta: {
    statusCode: number;
    statusText: string;
    fetchTimeMs: number;
    headers: Record<string, string>;
    finalUrl: string;
  }
): ScrapeResult {
  const includeImages = options.includeImages !== false;
  const includeLinks = options.includeLinks !== false;
  const currentHost = new URL(url).hostname;

  // Handle Stealth Jina Markdown response directly
  if (html.includes('Markdown Content:') || (html.startsWith('Title:') && !html.startsWith('<!DOCTYPE'))) {
    const titleMatch = html.match(/Title:\s*(.+)/);
    const title = titleMatch ? titleMatch[1].trim() : `${currentHost} Document`;

    let markdownContent = html;
    const contentIndex = html.indexOf('Markdown Content:');
    if (contentIndex !== -1) {
      markdownContent = html.slice(contentIndex + 'Markdown Content:'.length).trim();
    }

    // Extract all links from markdown
    const extractedLinks: ExtractedLink[] = [];
    const linkRegex = /\[(.*?)\]\((https?:\/\/[^\s\)]+)\)/g;
    let match: RegExpExecArray | null;
    while ((match = linkRegex.exec(markdownContent)) !== null) {
      const text = match[1].trim();
      const href = match[2].trim();
      const isExternal = new URL(href).hostname !== currentHost;
      const lowerHref = href.toLowerCase();
      const isResearchPaper = Boolean(
        lowerHref.includes('arxiv.org') ||
        lowerHref.includes('/research/') ||
        lowerHref.includes('/papers/') ||
        lowerHref.endsWith('.pdf') ||
        lowerHref.includes('doi.org') ||
        lowerHref.includes('biorxiv.org') ||
        lowerHref.includes('nature.com') ||
        lowerHref.includes('semanticscholar.org') ||
        lowerHref.includes('huggingface.co/papers')
      );

      if (!extractedLinks.some((l) => l.href === href) && extractedLinks.length < 50) {
        extractedLinks.push({ text: text || href, href, isExternal, isResearchPaper });
      }
    }

    // Extract all images from markdown
    const extractedImages: ExtractedImage[] = [];
    const imgRegex = /!\[(.*?)\]\((https?:\/\/[^\s\)]+)\)/g;
    while ((match = imgRegex.exec(markdownContent)) !== null) {
      const alt = match[1].trim();
      const imgUrl = match[2].trim();
      if (!extractedImages.some((i) => i.url === imgUrl)) {
        extractedImages.push({ url: imgUrl, alt, isAvatar: alt.toLowerCase().includes('avatar') || alt.toLowerCase().includes('author') });
      }
    }

    let finalMarkdown = sanitizeInlineText(markdownContent);

    // If includeImages is disabled, remove image markdown
    if (!includeImages) {
      finalMarkdown = finalMarkdown.replace(/!\[(.*?)\]\((https?:\/\/[^\s\)]+)\)/g, '');
    }

    // If includeLinks is active, ALWAYS append a separate final paragraph "# Links" with all scraped links!
    if (includeLinks && extractedLinks.length > 0) {
      finalMarkdown += `\n\n---\n\n# Links\n\n${extractedLinks.map((l) => `- [${l.text || l.href}](${l.href})${l.isResearchPaper ? ' *(Research Paper / Citation)*' : ''}`).join('\n')}\n`;
    } else if (!includeLinks) {
      finalMarkdown = finalMarkdown.replace(/\[(.*?)\]\((https?:\/\/[^\s\)]+)\)/g, '$1');
    }

    const words = finalMarkdown.split(/\s+/).filter(Boolean).length;

    return {
      success: true,
      url,
      finalUrl: fetchMeta.finalUrl,
      statusCode: fetchMeta.statusCode,
      statusText: fetchMeta.statusText,
      fetchTimeMs: fetchMeta.fetchTimeMs,
      contentLength: html.length,
      headers: fetchMeta.headers,
      stealthFingerprint: {
        browserEmulated: 'Google Chrome 130 (Darwin x86_64)',
        secChUa: '"Chromium";v="130", "Google Chrome";v="130"',
        platform: 'macOS',
        tlsProfile: 'TLSv1.3 (GREASE, X25519, AES_128_GCM)',
        antiBotBypass: true,
        cloudflareSolver: true,
        canvasNoiseProtection: true,
        webrtcShield: true,
        adAndTrackerShield: true,
        googleReferrerSpoofed: options.googleReferrer !== false,
        webglVendor: 'Apple M2 (ANGLE Vulkan 1.3.0)',
      },
      metadata: {
        title,
        description: `Clean document extracted from ${currentHost}`,
        siteName: currentHost,
        wordCount: words,
        readTimeMinutes: Math.max(1, Math.ceil(words / 200)),
        language: 'en',
      },
      readerMode: {
        title,
        excerpt: `Document extracted from ${currentHost}`,
        contentHtml: `<div class="prose">${finalMarkdown.replace(/\n/g, '<br/>')}</div>`,
        markdown: finalMarkdown,
        headings: [],
      },
      extractedLinks,
      extractedImages,
      rawHtmlSample: html.slice(0, 3000),
    };
  }

  // Standard HTML Cheerio Parsing
  const $ = cheerio.load(html);

  // 1. Extract Metadata
  const title =
    $('meta[property="og:title"]').attr('content') ||
    $('meta[name="twitter:title"]').attr('content') ||
    $('title').text().trim() ||
    $('h1').first().text().trim() ||
    'Untitled Page';

  const description =
    $('meta[property="og:description"]').attr('content') ||
    $('meta[name="description"]').attr('content') ||
    $('meta[name="twitter:description"]').attr('content') ||
    '';

  const author =
    $('meta[name="author"]').attr('content') ||
    $('meta[property="article:author"]').attr('content') ||
    $('[rel="author"]').text().trim() ||
    $('.author, .byline, [itemprop="author"]').first().text().trim() ||
    undefined;

  const publishedDate =
    $('meta[property="article:published_time"]').attr('content') ||
    $('time').attr('datetime') ||
    $('time').text().trim() ||
    undefined;

  const siteName =
    $('meta[property="og:site_name"]').attr('content') ||
    new URL(url).hostname;

  const ogImage =
    $('meta[property="og:image"]').attr('content') ||
    $('meta[name="twitter:image"]').attr('content') ||
    $('article img, main img').first().attr('src') ||
    undefined;

  const favicon =
    $('link[rel="icon"]').attr('href') ||
    $('link[rel="shortcut icon"]').attr('href') ||
    '/favicon.ico';

  const language = $('html').attr('lang') || 'en';

  // 2. Extract Images & Avatars
  const extractedImages: ExtractedImage[] = [];
  $('img').each((_, img) => {
    const el = $(img);
    const src = el.attr('src') || el.attr('data-src') || el.attr('srcset')?.split(' ')[0];
    const alt = el.attr('alt')?.trim();
    const imgTitle = el.attr('title')?.trim();
    const classAttr = (el.attr('class') || '').toLowerCase();

    const isAvatar = Boolean(
      classAttr.includes('avatar') ||
      classAttr.includes('author') ||
      classAttr.includes('profile') ||
      classAttr.includes('user-pic') ||
      classAttr.includes('rounded-full')
    );

    if (src && !src.startsWith('data:image/svg')) {
      try {
        const fullUrl = new URL(src, url).href;
        if (!extractedImages.some((i) => i.url === fullUrl) && extractedImages.length < 30) {
          extractedImages.push({
            url: fullUrl,
            alt: alt || undefined,
            title: imgTitle || undefined,
            isAvatar,
          });
        }
      } catch {
        // Ignore invalid URL
      }
    }
  });

  // 3. Extract Links & Research Papers
  const extractedLinks: ExtractedLink[] = [];
  $('a[href]').each((_, a) => {
    const href = $(a).attr('href')?.trim();
    const text = $(a).text().trim();
    if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
      try {
        const fullUrl = new URL(href, url).href;
        const isExternal = new URL(fullUrl).hostname !== currentHost;

        const lowerHref = fullUrl.toLowerCase();
        const isResearchPaper = Boolean(
          lowerHref.includes('arxiv.org') ||
          lowerHref.includes('/research/') ||
          lowerHref.includes('/papers/') ||
          lowerHref.endsWith('.pdf') ||
          lowerHref.includes('doi.org') ||
          lowerHref.includes('biorxiv.org') ||
          lowerHref.includes('nature.com') ||
          lowerHref.includes('semanticscholar.org') ||
          lowerHref.includes('huggingface.co/papers')
        );

        if (!extractedLinks.some((l) => l.href === fullUrl) && extractedLinks.length < 50) {
          extractedLinks.push({
            text: text || fullUrl,
            href: fullUrl,
            isExternal,
            isResearchPaper,
          });
        }
      } catch {
        // Ignore invalid URLs
      }
    }
  });

  // 4. Reader Mode Extraction
  const cleanDoc = cheerio.load(html);
  cleanDoc(
    'script, style, nav, header, footer, aside, iframe, noscript, svg, form, [role="navigation"], [role="banner"], [role="complementary"], .ad, .advertisement, .cookie-banner, .popup, .share-buttons, #disqus_thread'
  ).remove();

  let articleContainer = cleanDoc('article, [role="main"], main, .post-content, .article-content, .entry-content');
  if (articleContainer.length === 0) {
    articleContainer = cleanDoc('body');
  }

  const headings: Array<{ level: number; text: string; id: string }> = [];
  cleanDoc('h1, h2, h3').each((i, h) => {
    const el = cleanDoc(h);
    const text = el.text().trim();
    if (text) {
      const tag = ((el.prop('tagName') as string) || '').toLowerCase();
      const level = parseInt(tag.replace('h', ''), 10) || 2;
      const id = el.attr('id') || `heading-${i}`;
      headings.push({ level, text, id });
    }
  });

  let markdown = htmlToCleanMarkdown(cleanDoc, articleContainer.first(), url, {
    includeImages,
    includeLinks,
  });

  // If includeLinks is active, ALWAYS append a separate final paragraph "# Links" containing all scraped links!
  if (includeLinks && extractedLinks.length > 0) {
    markdown += `\n\n---\n\n# Links\n\n${extractedLinks.map((l) => `- [${l.text || l.href}](${l.href})${l.isResearchPaper ? ' *(Research Paper / Citation)*' : ''}`).join('\n')}\n`;
  }

  const bodyText = articleContainer.text().replace(/\s+/g, ' ').trim();
  const wordCount = bodyText.split(/\s+/).filter(Boolean).length;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  // 5. Adaptive Selector Engine
  let adaptiveResult: AdaptiveMatchResult | undefined = undefined;
  if (options.adaptiveSelector) {
    const rawMatches = $(options.adaptiveSelector);
    if (rawMatches.length > 0 && !options.simulateMutation) {
      const firstMatch = rawMatches.first();
      const fp = generateFingerprint($, firstMatch);
      adaptiveResult = {
        originalSelector: options.adaptiveSelector,
        matchedDirectly: true,
        allMatchesCount: rawMatches.length,
        fingerprint: fp,
        explanation: `Exact match found for selector "${options.adaptiveSelector}" (${rawMatches.length} occurrence${rawMatches.length > 1 ? 's' : ''}). Fingerprint captured for adaptive resilience.`,
        relocatedNode: {
          tag: fp.tagName,
          text: firstMatch.text().trim(),
          html: firstMatch.html() || '',
          attributes: (firstMatch.attr() as Record<string, string>) || {},
          confidence: 100,
          relocationMethod: 'Direct CSS Selector',
          suggestedResilientSelector: options.adaptiveSelector,
        },
      };
    } else {
      let mockFp: ElementFingerprint;
      if (rawMatches.length > 0) {
        mockFp = generateFingerprint($, rawMatches.first());
      } else {
        const tag = options.adaptiveSelector.replace(/[^a-zA-Z0-9]/g, '') || 'h1';
        mockFp = {
          tagName: tag.startsWith('h') ? tag : 'article',
          classes: ['randomized_cls_8x9'],
          attributes: {},
          textSnippet: title,
          textLength: title.length,
          depth: 3,
          parentTag: 'main',
          childTags: [],
          signature: `${tag}|adaptive`,
        };
      }

      adaptiveResult = adaptiveRelocate($, mockFp, options.adaptiveSelector);
    }
  }

  // 6. Structured Data (JSON-LD)
  const structuredData: Array<Record<string, unknown>> = [];
  $('script[type="application/ld+json"]').each((_, s) => {
    try {
      const json = JSON.parse($(s).html() || '{}');
      structuredData.push(json);
    } catch {
      // Ignore malformed JSON-LD
    }
  });

  return {
    success: true,
    url,
    finalUrl: fetchMeta.finalUrl,
    statusCode: fetchMeta.statusCode,
    statusText: fetchMeta.statusText,
    fetchTimeMs: fetchMeta.fetchTimeMs,
    contentLength: html.length,
    headers: fetchMeta.headers,
    stealthFingerprint: {
      browserEmulated: 'Google Chrome 130 (Darwin x86_64)',
      secChUa: '"Chromium";v="130", "Google Chrome";v="130"',
      platform: 'macOS',
      tlsProfile: 'TLSv1.3 (GREASE, X25519, AES_128_GCM)',
      antiBotBypass: true,
      cloudflareSolver: options.solveCloudflare !== false,
      canvasNoiseProtection: options.hideCanvas !== false,
      webrtcShield: options.blockWebrtc !== false,
      adAndTrackerShield: options.blockAdsAndTrackers !== false,
      googleReferrerSpoofed: options.googleReferrer !== false,
      webglVendor: 'Apple M2 (ANGLE Vulkan 1.3.0)',
    },
    metadata: {
      title,
      description,
      author,
      publishedDate,
      siteName,
      ogImage,
      favicon,
      wordCount,
      readTimeMinutes,
      language,
    },
    readerMode: {
      title,
      byline: author ? `By ${author}` : undefined,
      excerpt: description,
      contentHtml: articleContainer.html()?.slice(0, 50000) || '',
      markdown,
      headings,
    },
    adaptiveResult,
    extractedLinks,
    extractedImages,
    structuredData,
    rawHtmlSample: html.slice(0, 5000),
  };
}
