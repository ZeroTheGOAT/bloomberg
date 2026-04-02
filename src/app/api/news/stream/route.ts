import { NextResponse } from 'next/server';
import { parseStringPromise } from 'xml2js';

// ── Shared RSS Feeds + Parsing Logic (same as /api/news but adapted for background polling) ──
const RSS_FEEDS = {
    markets: [
        'https://news.google.com/rss/search?q=stock+market+OR+wall+street+OR+dow+jones+OR+nasdaq+when:1h&hl=en-US&gl=US&ceid=US:en',
        'https://news.google.com/rss/search?q=SP500+OR+S%26P500+OR+SPY+OR+QQQ+when:1h&hl=en-US&gl=US&ceid=US:en'
    ],
    india: [
        'https://news.google.com/rss/search?q=nifty+OR+sensex+OR+rbi+OR+indian+stock+market+when:1h&hl=en-IN&gl=IN&ceid=IN:en'
    ],
    crypto: [
        'https://news.google.com/rss/search?q=bitcoin+OR+crypto+OR+ethereum+OR+binance+when:1h&hl=en-US&gl=US&ceid=US:en'
    ],
    geopolitics: [
        'https://news.google.com/rss/search?q=war+OR+geopolitics+OR+conflict+OR+sanctions+OR+biden+OR+putin+when:1h&hl=en-US&gl=US&ceid=US:en'
    ],
    commodities: [
        'https://news.google.com/rss/search?q=gold+OR+crude+oil+OR+opec+when:1h&hl=en-US&gl=US&ceid=US:en'
    ],
    central_banks: [
        'https://news.google.com/rss/search?q=federal+reserve+OR+powell+OR+ecb+OR+interest+rates+when:1h&hl=en-US&gl=US&ceid=US:en'
    ]
};

const IMPORTANT_KEYWORDS = ['crash', 'soar', 'plunge', 'surge', 'war', 'attack', 'emergency', 'hike', 'cut', 'record'];
const ASSET_MAPPING: Record<string, string> = {
    'bitcoin': 'BTC', 'btc': 'BTC', 'ethereum': 'ETH', 'eth': 'ETH', 'crypto': 'CRYPTO',
    'gold': 'GOLD', 'oil': 'CL', 'crude': 'CL',
    'nifty': 'NIFTY', 'sensex': 'SENSEX', 'rbi': 'INR', 'reliance': 'RELIANCE',
    'apple': 'AAPL', 'nvidia': 'NVDA', 'tesla': 'TSLA', 'microsoft': 'MSFT',
    'fed': 'RATE', 'powell': 'RATE', 'ecb': 'RATE',
};

async function fetchInitialNews() {
    const allEntries = [];

    for (const [category, urls] of Object.entries(RSS_FEEDS)) {
        for (const url of urls) {
            try {
                const response = await fetch(url, { next: { revalidate: 60 } });
                if (!response.ok) continue;
                const xmlText = await response.text();
                const result = await parseStringPromise(xmlText);

                const items = result?.rss?.channel?.[0]?.item || [];
                for (const item of items) {
                    const title = item.title?.[0] || '';

                    let severity: "CRITICAL" | "HIGH" | "LOW" = "LOW";
                    const lowerTitle = title.toLowerCase();
                    for (const kw of IMPORTANT_KEYWORDS) {
                        if (lowerTitle.includes(kw)) {
                            severity = "HIGH";
                            break;
                        }
                    }
                    if (lowerTitle.includes('war') || lowerTitle.includes('crash') || lowerTitle.includes('emergency')) {
                        severity = "CRITICAL";
                    }

                    const relatedAssets: string[] = [];
                    for (const [kw, sym] of Object.entries(ASSET_MAPPING)) {
                        if (lowerTitle.includes(kw)) relatedAssets.push(sym);
                    }

                    let source = item.source?.[0]?._ || 'News';
                    if (source.includes('Twitter') || source.includes('X')) source = 'X (Twitter)';

                    allEntries.push({
                        id: item.guid?.[0]?._ || item.link?.[0] || Math.random().toString(),
                        title: title.split(' - ')[0],
                        source: source,
                        sourceUrl: item.link?.[0] || '#',
                        timestamp: new Date(item.pubDate?.[0] || new Date()).toISOString(),
                        severity,
                        category: category.toUpperCase().replace('_', ' '),
                        relatedAssets: [...new Set(relatedAssets)],
                    });
                }
            } catch (e) {
                // silently ignore fetch errors for specific feeds
            }
        }
    }

    // Sort by newest
    return allEntries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 100);
}

// ── The SSE streaming endpoint ──

// Fake real-time military/market injections to mimic Glint Trade's WebSocket
const INJECTS = [
    { s: 'ISRAEL HOME FRONT COMMAND', c: 'CRITICAL', t: 'Hostile Aircraft Intrusion', a: ['IL'] },
    { s: 'US CENTCOM', c: 'HIGH', t: 'Carrier Strike Group maneuvers reported in Red Sea', a: ['OIL', 'DEF'] },
    { s: 'BLOOMBERG TERMINAL', c: 'HIGH', t: 'Large block trade detected: 50,000 contracts ES1!', a: ['SPX', 'ES'] },
    { s: 'OSINT TECHNICAL', c: 'CRITICAL', t: 'Multiple heavy bomber sorties tracked from Engels AFB', a: ['DEF'] },
    { s: 'REUTERS ALERT', c: 'HIGH', t: 'OPEC+ considering emergency virtual meeting', a: ['CL', 'BRENT'] },
    { s: 'WHALE ALERT', c: 'HIGH', t: '15,000 BTC moved to unknown wallet', a: ['BTC', 'CRYPTO'] },
    { s: 'PENTAGON SPOKESPERSON', c: 'CRITICAL', t: 'Unscheduled press briefing announced for 14:00 EST', a: ['VIX'] },
    { s: 'SEC FILING', c: 'LOW', t: 'Form 4: CEO sells 250,000 shares', a: ['NVDA'] },
];

export async function GET(request: Request) {
    const stream = new ReadableStream({
        async start(controller) {
            const seenIds = new Set<string>();

            // Initial batch
            const initialNews = await fetchInitialNews();
            initialNews.forEach(item => seenIds.add(item.id));
            const chunk = `data: ${JSON.stringify({ type: 'init', data: initialNews })}\n\n`;
            controller.enqueue(new TextEncoder().encode(chunk));

            // Polling loop
            const interval = setInterval(async () => {
                try {
                    // RSS Polling
                    const freshNews = await fetchInitialNews();
                    const newItems = freshNews.filter(item => !seenIds.has(item.id));

                    // Random Glint-style injects every cycle to keep the terminal hyper-active
                    if (Math.random() > 0.4) {
                        const inject = INJECTS[Math.floor(Math.random() * INJECTS.length)];
                        newItems.push({
                            id: `inject-${Date.now()}-${Math.random()}`,
                            title: inject.t,
                            source: `${inject.s} [HIGH REP]`,
                            sourceUrl: '#',
                            timestamp: new Date().toISOString(),
                            severity: inject.c as any,
                            category: 'INTELLIGENCE',
                            relatedAssets: inject.a,
                        });
                    }

                    if (newItems.length > 0) {
                        newItems.forEach(item => seenIds.add(item.id));
                        const updateChunk = `data: ${JSON.stringify({ type: 'update', data: newItems })}\n\n`;
                        controller.enqueue(new TextEncoder().encode(updateChunk));
                    }

                    controller.enqueue(new TextEncoder().encode(`: heartbeat\n\n`));
                } catch (error) {
                    console.error('SSE Poll error:', error);
                }
            }, 3000); // Super fast 3s polling for Bloomberg terminal feel

            request.signal.addEventListener('abort', () => {
                clearInterval(interval);
                controller.close();
            });
        }
    });

    return new NextResponse(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
        },
    });
}
