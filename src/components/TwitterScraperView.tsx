import { useState, useEffect } from 'react';
import {
  Search,
  Zap,
  Copy,
  Check,
  RefreshCw,
  Clock,
  Code2,
  ExternalLink,
  MessageSquare,
  Repeat2,
  Heart,
  Eye,
  Bookmark,
  Calendar,
  MapPin,
  Link as LinkIcon,
  CheckCircle,
  XCircle,
  Building2,
  Landmark,
  ShieldAlert,
  Info,
  ArrowRight,
} from 'lucide-react';
import { Button } from './ui/button.tsx';
import { Input } from './ui/input.tsx';
import { Card } from './ui/card.tsx';
import type { TwitterScrapeResponse } from '../server/twitterScraper.ts';

export function TwitterScraperView() {
  const [target, setTarget] = useState('@sama');
  const [scrapeType, setScrapeType] = useState<'profile' | 'post' | 'search'>('profile');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TwitterScrapeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showArchitectureNote, setShowArchitectureNote] = useState(false);

  useEffect(() => {
    handleScrape('@sama', 'profile');
  }, []);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleScrape = async (overrideTarget = target, overrideType = scrapeType) => {
    if (!overrideTarget || !overrideTarget.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/twitter/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target: overrideTarget.trim(),
          type: overrideType,
        }),
      });

      const json: TwitterScrapeResponse = await res.json();
      if (!json.success && json.error) {
        setError(json.error);
        setData(null);
      } else {
        setData(json);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(`Twitter scraper error: ${msg}`);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Architecture Transparency Banner */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 text-xs font-mono">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-zinc-300">
            <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
            <span className="text-white font-semibold">LIVE TWITTER SYNDICATION GATEWAY</span>
            <span aria-hidden="true" className="text-zinc-700">·</span>
            <span className="text-zinc-400">Zero Login Wall · Authentic Real-Time Data</span>
          </div>

          <button
            type="button"
            onClick={() => setShowArchitectureNote(!showArchitectureNote)}
            className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer text-xs"
          >
            <Info className="h-3.5 w-3.5" />
            <span>{showArchitectureNote ? 'Hide Anti-Bot Explainer' : 'Why Twitter Scraping is Hard (Truth)'}</span>
          </button>
        </div>

        {showArchitectureNote && (
          <div className="mt-3 pt-3 border-t border-zinc-850 text-zinc-400 leading-relaxed space-y-2 font-sans text-xs">
            <p>
              <strong className="text-white font-mono">The Truth About Twitter/X:</strong> Twitter blocks direct unauthenticated
              server requests from cloud IPs (AWS, GCP, DigitalOcean) and redirects them to <code className="text-white font-mono">x.com/i/flow/login</code>.
            </p>
            <p>
              <strong className="text-white font-mono">How Gray Scrape Extracts Live Data:</strong> We route requests through
              the live syndication network (<code className="text-white font-mono">api.fxtwitter.com</code>) to extract authentic live follower counts,
              biographies, real avatars, join dates, and tweet metrics. If an account has private timeline posts, we never fabricate fake posts.
            </p>
          </div>
        )}
      </div>

      {/* Twitter Scraper Header / Toolbar */}
      <Card className="border-zinc-800 bg-zinc-950 p-5 sm:p-6 shadow-2xl">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-1">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                <span>X / TWITTER ADAPTIVE EXTRACTOR</span>
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Profile, Post & Search Scraper
              </h3>
            </div>

            {/* Mode Selector */}
            <div className="flex items-center rounded-md border border-zinc-800 bg-black p-0.5 text-xs font-mono">
              <button
                type="button"
                onClick={() => {
                  setScrapeType('profile');
                  if (target.includes('status/')) setTarget('@sama');
                }}
                className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
                  scrapeType === 'profile' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Profile
              </button>
              <button
                type="button"
                onClick={() => {
                  setScrapeType('post');
                  setTarget('https://x.com/jack/status/20');
                }}
                className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
                  scrapeType === 'post' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Post / Tweet
              </button>
              <button
                type="button"
                onClick={() => {
                  setScrapeType('search');
                  setTarget('#AI');
                }}
                className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
                  scrapeType === 'search' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Search / Hashtag
              </button>
            </div>
          </div>

          {/* Input Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
              <Input
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleScrape()}
                placeholder={
                  scrapeType === 'profile'
                    ? 'Enter ANY @username or URL (e.g., @sama, @karpathy, @naval, @paulg)...'
                    : scrapeType === 'post'
                    ? 'Enter Tweet URL or Status ID (e.g. x.com/jack/status/20)...'
                    : 'Enter search keyword or hashtag (e.g., #AI, Scrapling, NextJS)...'
                }
                className="pl-10 h-11 bg-black border-zinc-800 text-white font-mono text-sm placeholder:text-zinc-500 focus-visible:border-white"
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
                  <span>Extracting Live...</span>
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 fill-black text-black" />
                  <span>Scrape X</span>
                </>
              )}
            </Button>
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-850 text-xs text-zinc-400">
            <span className="text-zinc-500 font-mono">
              {scrapeType === 'search'
                ? 'Search queries on X:'
                : scrapeType === 'post'
                ? 'Verified status URLs:'
                : 'Live verified targets:'}
            </span>

            {scrapeType === 'search' && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setTarget('AI');
                    handleScrape('AI', 'search');
                  }}
                  className="px-2.5 py-1 rounded border border-zinc-800 bg-black text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer"
                >
                  AI
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTarget('OpenAI');
                    handleScrape('OpenAI', 'search');
                  }}
                  className="px-2.5 py-1 rounded border border-zinc-800 bg-black text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer"
                >
                  OpenAI
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTarget('Python');
                    handleScrape('Python', 'search');
                  }}
                  className="px-2.5 py-1 rounded border border-zinc-800 bg-black text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer"
                >
                  Python
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTarget('Scrapling');
                    handleScrape('Scrapling', 'search');
                  }}
                  className="px-2.5 py-1 rounded border border-zinc-800 bg-black text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer"
                >
                  Scrapling
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTarget('Elon Musk');
                    handleScrape('Elon Musk', 'search');
                  }}
                  className="px-2.5 py-1 rounded border border-zinc-800 bg-black text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer"
                >
                  Elon Musk
                </button>
              </>
            )}

            {scrapeType === 'profile' && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setTarget('@sama');
                    handleScrape('@sama', 'profile');
                  }}
                  className="px-2.5 py-1 rounded border border-zinc-800 bg-black text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer"
                >
                  @sama (Sam Altman)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTarget('@karpathy');
                    handleScrape('@karpathy', 'profile');
                  }}
                  className="px-2.5 py-1 rounded border border-zinc-800 bg-black text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer"
                >
                  @karpathy (Andrej Karpathy)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTarget('@elonmusk');
                    handleScrape('@elonmusk', 'profile');
                  }}
                  className="px-2.5 py-1 rounded border border-zinc-800 bg-black text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer"
                >
                  @elonmusk
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTarget('@GrayTell_Org');
                    handleScrape('@GrayTell_Org', 'profile');
                  }}
                  className="px-2.5 py-1 rounded border border-zinc-800 bg-black text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer"
                >
                  @GrayTell_Org (Graytell Labs)
                </button>
              </>
            )}

            {scrapeType === 'post' && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setTarget('https://x.com/jack/status/20');
                    handleScrape('https://x.com/jack/status/20', 'post');
                  }}
                  className="px-2.5 py-1 rounded border border-zinc-800 bg-black text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer"
                >
                  First Tweet (Jack #20)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTarget('https://twitter.com/openai/status/1727206187077370115');
                    handleScrape('https://twitter.com/openai/status/1727206187077370115', 'post');
                  }}
                  className="px-2.5 py-1 rounded border border-zinc-800 bg-black text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer"
                >
                  OpenAI Altman Agreement
                </button>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Error Notice */}
      {error && (
        <div className="p-4 rounded-lg border border-zinc-700 bg-zinc-900/60 text-zinc-200 flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-white shrink-0 mt-0.5" />
          <div className="text-sm">
            <span className="font-semibold text-white">Notice: </span>
            {error}
          </div>
        </div>
      )}

      {/* Telemetry Bar */}
      {data && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 px-4 rounded-lg border border-zinc-800 bg-zinc-950 text-xs font-mono">
          <div className="flex flex-wrap items-center gap-4 text-zinc-300">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-white" />
              <span className="text-white font-semibold uppercase">{data.type} EXTRACTED</span>
            </div>
            <span aria-hidden="true" className="text-zinc-700">|</span>
            <div className="flex items-center gap-1 text-zinc-400">
              <Clock className="h-3.5 w-3.5" />
              <span>{data.fetchTimeMs}ms latency</span>
            </div>
            <span aria-hidden="true" className="text-zinc-700">|</span>
            <div className="text-zinc-400">Source: {data.source}</div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => handleCopy(data.markdown, 'tw-md')}
              variant="outline"
              size="sm"
              className="h-7 text-xs"
            >
              {copiedKey === 'tw-md' ? <Check className="h-3 w-3 text-white" /> : <Copy className="h-3 w-3" />}
              <span>{copiedKey === 'tw-md' ? 'Copied' : 'Copy Markdown'}</span>
            </Button>
            <Button
              onClick={() => handleCopy(JSON.stringify(data, null, 2), 'tw-json')}
              variant="outline"
              size="sm"
              className="h-7 text-xs"
            >
              {copiedKey === 'tw-json' ? <Check className="h-3 w-3 text-white" /> : <Copy className="h-3 w-3" />}
              <span>Copy JSON</span>
            </Button>
          </div>
        </div>
      )}

      {/* OUTPUT VIEWS */}
      {data && (
        <div className="space-y-6">
          {/* 1. PROFILE VIEW */}
          {data.profile && (
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-2xl">
                {/* Banner: In authentic full color (no grayscale filter) */}
                {data.profile.banner ? (
                  <div className="h-44 sm:h-56 w-full overflow-hidden bg-zinc-900 border-b border-zinc-800">
                    <img
                      src={data.profile.banner}
                      alt="Banner"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-32 w-full bg-zinc-900 border-b border-zinc-800" />
                )}

                {/* Profile Header Details */}
                <div className="p-6 relative">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
                    {/* Avatar: In authentic full color (no grayscale filter) */}
                    <div className="relative">
                      <img
                        src={data.profile.avatar}
                        alt={data.profile.name}
                        className="h-24 w-24 sm:h-28 sm:w-28 rounded-full border-4 border-black object-cover bg-zinc-900 shadow-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80';
                        }}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Verified Badge Check Indicator */}
                      {data.profile.verified ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-zinc-700 bg-zinc-900 text-xs font-mono text-white">
                          {data.profile.verificationType === 'organization' ? (
                            <Building2 className="h-3.5 w-3.5 text-white" />
                          ) : data.profile.verificationType === 'government' ? (
                            <Landmark className="h-3.5 w-3.5 text-white" />
                          ) : (
                            <CheckCircle className="h-3.5 w-3.5 text-white fill-white stroke-black" />
                          )}
                          <span className="capitalize font-semibold">
                            {data.profile.verificationType === 'organization'
                              ? 'Verified Organization'
                              : data.profile.verificationType === 'government'
                              ? 'Verified Government'
                              : 'Verified Account'}
                          </span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-zinc-800 bg-black text-xs font-mono text-zinc-500">
                          <XCircle className="h-3.5 w-3.5 text-zinc-500" />
                          <span>Not Verified</span>
                        </div>
                      )}

                      <a
                        href={`https://x.com/${data.profile.handle.replace('@', '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-zinc-700 bg-black text-xs font-mono text-white hover:bg-zinc-900 transition-colors"
                      >
                        <span>View on X</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        {data.profile.name}
                      </h2>
                      {data.profile.verified && (
                        <CheckCircle className="h-4 w-4 text-white fill-white stroke-black" />
                      )}
                    </div>
                    <p className="text-sm font-mono text-zinc-400">{data.profile.handle}</p>
                  </div>

                  {data.profile.bio && (
                    <p className="mt-3 text-sm text-zinc-200 leading-relaxed font-normal max-w-2xl">
                      {data.profile.bio}
                    </p>
                  )}

                  {/* Metadata Row */}
                  <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400">
                    {data.profile.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                        <span>{data.profile.location}</span>
                      </div>
                    )}
                    {data.profile.website && (
                      <div className="flex items-center gap-1">
                        <LinkIcon className="h-3.5 w-3.5 text-zinc-500" />
                        <span className="text-white hover:underline">{data.profile.website}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                      <span>{data.profile.joinedDate}</span>
                    </div>
                  </div>

                  {/* Following / Followers */}
                  <div className="mt-4 pt-4 border-t border-zinc-850 flex items-center gap-6 text-sm font-mono">
                    <div>
                      <span className="font-bold text-white">
                        {data.profile.followingCount.toLocaleString()}
                      </span>{' '}
                      <span className="text-zinc-500">Following</span>
                    </div>
                    <div>
                      <span className="font-bold text-white">
                        {data.profile.followersCount.toLocaleString()}
                      </span>{' '}
                      <span className="text-zinc-500">Followers</span>
                    </div>
                    {data.profile.tweetsCount !== undefined && data.profile.tweetsCount > 0 && (
                      <div>
                        <span className="font-bold text-white">
                          {data.profile.tweetsCount.toLocaleString()}
                        </span>{' '}
                        <span className="text-zinc-500">Posts</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Genuine Timeline Stream OR Honest Notice */}
              {data.recentPosts && data.recentPosts.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-sm font-mono font-semibold uppercase text-zinc-400 tracking-wider">
                    Recent Timeline Posts ({data.recentPosts.length})
                  </h3>
                  <div className="space-y-3">
                    {data.recentPosts.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                </div>
              ) : (
                <Card className="border-zinc-800 bg-zinc-950 p-6 text-center space-y-3">
                  <div className="max-w-md mx-auto space-y-2">
                    <p className="text-sm font-medium text-white">
                      Profile Timeline Protected by X / Twitter Login Wall
                    </p>
                    <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                      X restricts full user post feeds to authenticated account sessions. We do not show fabricated or incorrect posts.
                      To scrape any exact tweet from this user, enter its direct post URL in the Post / Tweet tab.
                    </p>
                    <div className="pt-2">
                      <Button
                        type="button"
                        onClick={() => {
                          setScrapeType('post');
                          setTarget(`https://x.com/${data.profile?.handle.replace('@', '')}/status/1843510294819230491`);
                        }}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                      >
                        <span>Switch to Post / Tweet Scraper</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* 2. SINGLE POST VIEW */}
          {data.post && (
            <div className="space-y-4">
              <h3 className="text-sm font-mono font-semibold uppercase text-zinc-400 tracking-wider">
                Extracted Tweet Payload
              </h3>
              <PostCard post={data.post} full />
            </div>
          )}

          {/* 3. SEARCH RESULTS STREAM */}
          {data.searchResults && (
            <div className="space-y-4">
              <h3 className="text-sm font-mono font-semibold uppercase text-zinc-400 tracking-wider">
                Scraped Search Results ({data.searchResults.length})
              </h3>
              <div className="space-y-3">
                {data.searchResults.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          )}

          {/* Python Code Card for Twitter */}
          <Card className="border-zinc-800 bg-zinc-950 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                <Code2 className="h-4 w-4" />
                <span>Python Scrapling Script for this Target</span>
              </div>
              <Button
                onClick={() => handleCopy(data.pythonCode, 'tw-py')}
                variant="outline"
                size="sm"
                className="h-7 text-xs"
              >
                {copiedKey === 'tw-py' ? <Check className="h-3 w-3 text-white" /> : <Copy className="h-3 w-3" />}
                <span>{copiedKey === 'tw-py' ? 'Copied' : 'Copy Python'}</span>
              </Button>
            </div>
            <pre className="p-3 bg-black rounded border border-zinc-850 text-xs font-mono text-zinc-300 overflow-x-auto leading-relaxed">
              {data.pythonCode}
            </pre>
          </Card>
        </div>
      )}
    </div>
  );
}

// Subcomponent: Authentic Twitter Post Card (Original Photo & Media Colors)
function PostCard({ post, full = false }: { post: any; full?: boolean }) {
  return (
    <Card className="border-zinc-800 bg-zinc-950 p-5 sm:p-6 transition-all hover:border-zinc-700">
      <div className="flex items-start gap-3">
        {/* Author Avatar: Original full color (no grayscale filter) */}
        <img
          src={post.author.avatar}
          alt={post.author.name}
          className="h-10 w-10 rounded-full object-cover border border-zinc-800 shrink-0 bg-zinc-900"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';
          }}
        />

        <div className="flex-1 min-w-0">
          {/* Author Header */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-white text-sm tracking-tight">{post.author.name}</span>
              {post.author.verified && (
                <CheckCircle className="h-3.5 w-3.5 text-white fill-white stroke-black" />
              )}
              <span className="text-xs font-mono text-zinc-500">{post.author.handle}</span>
              <span aria-hidden="true" className="text-zinc-700">·</span>
              <span className="text-xs font-mono text-zinc-500">{post.createdAt}</span>
            </div>

            <a
              href={post.url}
              target="_blank"
              rel="noreferrer"
              className="text-zinc-500 hover:text-white transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Post Text Content */}
          <p
            className={`mt-2.5 text-zinc-100 font-normal leading-relaxed ${
              full ? 'text-base sm:text-lg' : 'text-sm'
            }`}
          >
            {post.text}
          </p>

          {/* Optional Media: Original full color (no grayscale filter) */}
          {post.media && post.media.length > 0 && (
            <div className="mt-3 rounded-lg overflow-hidden border border-zinc-850 max-h-80 bg-black">
              <img
                src={post.media[0].url}
                alt="Post media"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Monochrome Engagement Metrics Bar */}
          <div className="mt-4 pt-3 border-t border-zinc-850/80 flex items-center justify-between text-xs font-mono text-zinc-400 max-w-md">
            <div className="flex items-center gap-1.5 hover:text-white cursor-pointer transition-colors">
              <MessageSquare className="h-3.5 w-3.5 text-zinc-500" />
              <span>{post.metrics.replies.toLocaleString()}</span>
            </div>

            <div className="flex items-center gap-1.5 hover:text-white cursor-pointer transition-colors">
              <Repeat2 className="h-3.5 w-3.5 text-zinc-500" />
              <span>{post.metrics.retweets.toLocaleString()}</span>
            </div>

            <div className="flex items-center gap-1.5 hover:text-white cursor-pointer transition-colors">
              <Heart className="h-3.5 w-3.5 text-zinc-500" />
              <span>{post.metrics.likes.toLocaleString()}</span>
            </div>

            <div className="flex items-center gap-1.5 hover:text-white cursor-pointer transition-colors">
              <Eye className="h-3.5 w-3.5 text-zinc-500" />
              <span>{post.metrics.views.toLocaleString()}</span>
            </div>

            <div className="flex items-center gap-1.5 hover:text-white cursor-pointer transition-colors">
              <Bookmark className="h-3.5 w-3.5 text-zinc-500" />
              <span>{post.metrics.bookmarks.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
