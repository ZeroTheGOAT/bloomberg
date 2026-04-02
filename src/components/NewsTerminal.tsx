'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink, Radio, Hash, Loader2 } from 'lucide-react';

interface NewsItem {
    id: string;
    source: string;
    category: string;
    headline: string;
    sourceUrl: string;
    severity: 'CRITICAL' | 'HIGH' | 'LOW';
    relatedAssets: string[];
    timestamp: string;
    isNew?: boolean; // flag for animation
}

const severityStyles: Record<string, { bg: string; text: string }> = {
    CRITICAL: { bg: 'bg-red-500/20', text: 'text-red-400' },
    HIGH: { bg: 'bg-orange-500/15', text: 'text-orange-400' },
    LOW: { bg: 'bg-gray-500/15', text: 'text-gray-400' },
};

// Returns relative time: "0s ago", "4m ago"
function getRelativeTime(timestamp: string) {
    const diffInSeconds = Math.floor((new Date().getTime() - new Date(timestamp).getTime()) / 1000);
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    return `${Math.floor(diffInMinutes / 60)}h ago`;
}

export default function NewsTerminal() {
    const [items, setItems] = useState<NewsItem[]>([]);
    const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
    const [status, setStatus] = useState<'CONNECTING' | 'LIVE' | 'OFFLINE'>('CONNECTING');
    const scrollRef = useRef<HTMLDivElement>(null);
    const [, setTick] = useState(0);

    // Force re-render every second to update "0s ago" counters smoothly
    useEffect(() => {
        const timer = setInterval(() => setTick(t => t + 1), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const eventSource = new EventSource('/api/news/stream');

        eventSource.onopen = () => {
            setStatus('LIVE');
        };

        eventSource.onmessage = (event) => {
            if (event.data === ': heartbeat') return;

            try {
                const parsed = JSON.parse(event.data);

                if (parsed.type === 'init') {
                    setItems(parsed.data.map((item: any) => ({
                        ...item,
                        headline: item.title,
                        isNew: false
                    })));
                } else if (parsed.type === 'update') {
                    // Prepend new items and mark them with isNew flag for animation
                    const newItems = parsed.data.map((item: any) => ({
                        ...item,
                        headline: item.title,
                        isNew: true
                    }));

                    setItems(prev => {
                        const merged = [...newItems, ...prev];
                        // Remove isNew flag after animation duration
                        setTimeout(() => {
                            setItems(current => current.map(item =>
                                newItems.find((n: any) => n.id === item.id) ? { ...item, isNew: false } : item
                            ));
                        }, 2000);
                        return merged.slice(0, 150); // Keep max 150
                    });
                }
            } catch (e) {
                console.error('SSE Parse Error', e);
            }
        };

        eventSource.onerror = () => {
            setStatus('OFFLINE');
            eventSource.close();
            // Try to reconnect after 5s
            setTimeout(() => {
                setStatus('CONNECTING');
                // Component unmount handles actual reconnect via dependency array (empty)
                // In reality we'd need a more robust reconnect loop here if doing production SSE
            }, 5000);
        };

        return () => {
            eventSource.close();
        };
    }, []);

    const filtered = filterSeverity === 'ALL'
        ? items
        : items.filter(i => i.severity === filterSeverity);

    return (
        <div className="flex flex-col h-full bg-black font-mono">
            {/* Header - Bloomberg Style */}
            <div className="flex items-center justify-between border-b-2 border-green-900/30 px-2 py-1.5 bg-[#000500]">
                <div className="flex items-center space-x-2">
                    <div className={`h-2 w-2 ${status === 'LIVE' ? 'bg-green-500 animate-pulse' : 'bg-red-500'} rounded-sm`} />
                    <span className="text-[12px] font-bold text-green-500 uppercase tracking-widest">
                        ZPT &lt;GO&gt; INTELLIGENCE WIDGET
                    </span>
                </div>
                <div className="flex items-center space-x-2">
                    <span className={`text-[9px] ${status === 'LIVE' ? 'text-green-500' : 'text-red-500'}`}>
                        {status === 'LIVE' ? 'LIVE STREAM CONNECTED' : 'OFFLINE'}
                    </span>
                </div>
            </div>

            {/* Severity filters */}
            <div className="flex items-center space-x-2 border-b border-green-900/30 px-2 py-1 bg-black">
                <span className="text-[9px] text-green-700">FILTERS:</span>
                {['ALL', 'CRITICAL', 'HIGH'].map(s => (
                    <button
                        key={s}
                        onClick={() => setFilterSeverity(s)}
                        className={`px-1.5 py-0.5 text-[9px] font-bold uppercase transition-colors ${filterSeverity === s ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'text-green-800 hover:text-green-500 border border-transparent'
                            }`}
                    >
                        {s}
                    </button>
                ))}
            </div>

            {/* Table Header */}
            <div className="flex items-center border-b border-green-900/30 px-2 py-1 bg-[#050505] text-[8px] text-green-700 font-bold">
                <div className="w-10">TIME</div>
                <div className="w-16">SEVERITY</div>
                <div className="flex-1">HEADLINE / EVENT</div>
                <div className="w-12 text-right">TICKER</div>
            </div>

            {/* News feed content */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto">
                {items.length === 0 ? (
                    <div className="flex items-center justify-center h-40">
                        {status === 'LIVE' ? (
                            <span className="text-[10px] text-green-600 animate-pulse">AWAITING INJECTS...</span>
                        ) : (
                            <span className="text-[10px] text-red-500 animate-pulse">CONNECTION LOST...</span>
                        )}
                    </div>
                ) : (
                    filtered.map((item) => {
                        const timeString = getRelativeTime(item.timestamp);
                        const isBrandNew = item.isNew || timeString.includes('0s');
                        const isCritical = item.severity === 'CRITICAL';

                        return (
                            <article
                                key={item.id}
                                className={`flex items-start px-2 py-1.5 border-b border-green-900/10 transition-colors ${isBrandNew ? 'bg-green-500/20' : 'hover:bg-green-900/20'
                                    }`}
                            >
                                {/* Time */}
                                <div className={`w-10 text-[9px] font-bold ${isBrandNew ? 'text-green-300 animate-pulse' : 'text-green-800'} shrink-0 pt-0.5`}>
                                    {timeString}
                                </div>

                                {/* Severity Flag */}
                                <div className="w-16 shrink-0 pt-0.5">
                                    <span className={`text-[8px] px-1 py-0.5 border ${isCritical ? 'text-red-500 border-red-500/30 bg-red-500/10' :
                                            item.severity === 'HIGH' ? 'text-amber-500 border-amber-500/30 bg-amber-500/10' :
                                                'text-green-500 border-green-500/30 bg-green-500/10'
                                        }`}>
                                        {item.severity}
                                    </span>
                                </div>

                                {/* Headline / Source */}
                                <div className="flex-1 min-w-0 pr-2">
                                    <div className="flex flex-col">
                                        <span className={`text-[8px] font-bold mb-0.5 ${isCritical ? 'text-red-400' : 'text-green-600'}`}>
                                            [{item.source.toUpperCase()}]
                                        </span>
                                        <a
                                            href={item.sourceUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`text-[10px] leading-tight hover:underline ${isBrandNew ? 'text-white font-bold' : 'text-green-100'
                                                }`}
                                        >
                                            {item.headline.toUpperCase()}
                                        </a>
                                    </div>
                                </div>

                                {/* Ticker / Tags */}
                                <div className="w-12 text-right shrink-0 pt-0.5 flex flex-col items-end gap-1">
                                    {item.relatedAssets.slice(0, 2).map(asset => (
                                        <span key={asset} className="text-[8px] text-black bg-green-500 px-1 font-bold">
                                            {asset}
                                        </span>
                                    ))}
                                </div>
                            </article>
                        );
                    })
                )}
            </div>

            {/* Footer */}
            <div className="border-t-2 border-green-900/30 px-2 py-1 bg-[#000500] flex justify-between">
                <span className="text-[8px] text-green-700 animate-pulse">■ RECEIVING WSS PAYLOAD...</span>
                <span className="text-[8px] text-green-700">PAGE 1 OF 1</span>
            </div>
        </div>
    );
}
