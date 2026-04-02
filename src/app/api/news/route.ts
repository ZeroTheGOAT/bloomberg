import { NextResponse } from 'next/server';

// ── RSS Feed Sources (real, public, free) ──
const RSS_SOURCES = [
    // Financial / Markets
    { url: 'https://news.google.com/rss/search?q=stock+market+today&hl=en-IN&gl=IN&ceid=IN:en', source: 'Google News', sourceType: 'rss', category: 'MARKETS' },
    { url: 'https://news.google.com/rss/search?q=nifty+sensex+india+market&hl=en-IN&gl=IN&ceid=IN:en', source: 'Google News', sourceType: 'rss', category: 'INDIA' },

    // Crypto
    { url: 'https://news.google.com/rss/search?q=bitcoin+ethereum+crypto&hl=en&gl=US&ceid=US:en', source: 'Google News', sourceType: 'rss', category: 'CRYPTO' },

    // Geopolitics
    { url: 'https://news.google.com/rss/search?q=geopolitics+war+conflict+military&hl=en&gl=US&ceid=US:en', source: 'Google News', sourceType: 'rss', category: 'GEOPOLITICS' },

    // Central Banks
    { url: 'https://news.google.com/rss/search?q=federal+reserve+RBI+interest+rate&hl=en&gl=US&ceid=US:en', source: 'Google News', sourceType: 'rss', category: 'CENTRAL BANKS' },

    // Commodities
    { url: 'https://news.google.com/rss/search?q=gold+crude+oil+commodity+price&hl=en&gl=US&ceid=US:en', source: 'Google News', sourceType: 'rss', category: 'COMMODITIES' },
];

interface NewsItem {
    id: string;
    source: string;
    sourceType: string;
    sourceUrl: string;
    severity: 'critical' | 'high' | 'low';
    category: string;
    headline: string;
    relatedAssets: string[];
    time: string;
    pubDate: string;
}

// Simple XML parser for RSS (no external dependency needed)
function parseRSSItems(xml: string, feedMeta: typeof RSS_SOURCES[0]): NewsItem[] {
    const items: NewsItem[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xml)) !== null) {
        const itemXml = match[1];

        const titleMatch = itemXml.match(/<title><!\[CDATA\[([\s\S]*?)\]\]>|<title>([\s\S]*?)<\/title>/);
        const linkMatch = itemXml.match(/<link>([\s\S]*?)<\/link>/);
        const pubDateMatch = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
        const sourceMatch = itemXml.match(/<source[^>]*>([\s\S]*?)<\/source>/);

        const title = (titleMatch?.[1] || titleMatch?.[2] || '').trim().replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
        const link = (linkMatch?.[1] || '').trim();
        const pubDate = pubDateMatch?.[1] || new Date().toISOString();
        const actualSource = sourceMatch?.[1]?.trim() || feedMeta.source;

        if (!title || title.length < 10) continue;

        // Determine severity based on keywords
        let severity: 'critical' | 'high' | 'low' = 'low';
        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes('breaking') || lowerTitle.includes('crash') || lowerTitle.includes('war') ||
            lowerTitle.includes('strike') || lowerTitle.includes('emergency') || lowerTitle.includes('surge')) {
            severity = 'critical';
        } else if (lowerTitle.includes('rise') || lowerTitle.includes('fall') || lowerTitle.includes('rate') ||
            lowerTitle.includes('cut') || lowerTitle.includes('hike') || lowerTitle.includes('record') ||
            lowerTitle.includes('plunge') || lowerTitle.includes('rally') || lowerTitle.includes('jump')) {
            severity = 'high';
        }

        // Extract related assets
        const relatedAssets: string[] = [];
        if (lowerTitle.includes('nifty')) relatedAssets.push('$NIFTY');
        if (lowerTitle.includes('sensex')) relatedAssets.push('$SENSEX');
        if (lowerTitle.includes('bitcoin') || lowerTitle.includes('btc')) relatedAssets.push('$BTC');
        if (lowerTitle.includes('ethereum') || lowerTitle.includes('eth')) relatedAssets.push('$ETH');
        if (lowerTitle.includes('gold')) relatedAssets.push('$GOLD');
        if (lowerTitle.includes('oil') || lowerTitle.includes('crude')) relatedAssets.push('$CL');
        if (lowerTitle.includes('s&p') || lowerTitle.includes('s&p 500')) relatedAssets.push('$SPX');
        if (lowerTitle.includes('nasdaq')) relatedAssets.push('$NDX');
        if (lowerTitle.includes('fed') || lowerTitle.includes('federal reserve')) relatedAssets.push('$DXY');
        if (lowerTitle.includes('rbi') || lowerTitle.includes('reserve bank')) relatedAssets.push('$USDINR');
        if (lowerTitle.includes('tesla')) relatedAssets.push('$TSLA');
        if (lowerTitle.includes('nvidia') || lowerTitle.includes('nvda')) relatedAssets.push('$NVDA');
        if (lowerTitle.includes('apple')) relatedAssets.push('$AAPL');
        if (lowerTitle.includes('solana') || lowerTitle.includes('sol')) relatedAssets.push('$SOL');
        if (lowerTitle.includes('rupee') || lowerTitle.includes('inr')) relatedAssets.push('$USDINR');
        if (relatedAssets.length === 0) relatedAssets.push('$SPX');

        // Calculate time ago
        const pubDateMs = new Date(pubDate).getTime();
        const nowMs = Date.now();
        const diffMs = nowMs - pubDateMs;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        let timeAgo = '';
        if (diffMins < 1) timeAgo = 'now';
        else if (diffMins < 60) timeAgo = `${diffMins}m ago`;
        else if (diffHours < 24) timeAgo = `${diffHours}h ago`;
        else timeAgo = `${Math.floor(diffHours / 24)}d ago`;

        // Determine source type based on actual source name
        let sourceType = feedMeta.sourceType;
        const lowerSource = actualSource.toLowerCase();
        if (lowerSource.includes('reuters')) sourceType = 'reuters';
        else if (lowerSource.includes('bloomberg')) sourceType = 'bloomberg';
        else if (lowerSource.includes('cnbc')) sourceType = 'rss';
        else if (lowerSource.includes('moneycontrol')) sourceType = 'rss';
        else if (lowerSource.includes('coindesk') || lowerSource.includes('cointelegraph')) sourceType = 'rss';

        items.push({
            id: `${feedMeta.category}-${Buffer.from(title).toString('base64').slice(0, 12)}`,
            source: actualSource,
            sourceType,
            sourceUrl: link,
            severity,
            category: feedMeta.category,
            headline: title,
            relatedAssets: [...new Set(relatedAssets)].slice(0, 4),
            time: timeAgo,
            pubDate,
        });
    }

    return items;
}

// Cache to avoid hammering RSS feeds
let cachedResult: { data: NewsItem[]; timestamp: number } | null = null;
const CACHE_TTL = 30000; // 30 seconds

export async function GET() {
    // Return cache if fresh
    if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_TTL) {
        return NextResponse.json({ items: cachedResult.data, cached: true, count: cachedResult.data.length });
    }

    const allItems: NewsItem[] = [];

    // Fetch all RSS feeds in parallel
    const results = await Promise.allSettled(
        RSS_SOURCES.map(async (feed) => {
            try {
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), 5000);

                const response = await fetch(feed.url, {
                    signal: controller.signal,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (compatible; ZeroPinnacle/1.0)',
                    },
                });
                clearTimeout(timeout);

                if (!response.ok) return [];
                const xml = await response.text();
                return parseRSSItems(xml, feed);
            } catch {
                return [];
            }
        })
    );

    for (const result of results) {
        if (result.status === 'fulfilled' && Array.isArray(result.value)) {
            allItems.push(...result.value);
        }
    }

    // Sort by publication date (newest first) and deduplicate
    const seen = new Set<string>();
    const deduped = allItems
        .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
        .filter(item => {
            const key = item.headline.slice(0, 60).toLowerCase();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        })
        .slice(0, 100);

    // Update cache
    cachedResult = { data: deduped, timestamp: Date.now() };

    return NextResponse.json({
        items: deduped,
        cached: false,
        count: deduped.length,
        fetchedAt: new Date().toISOString(),
    });
}
