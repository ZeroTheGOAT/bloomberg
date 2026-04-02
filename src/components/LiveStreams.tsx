'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Radio, Volume2, VolumeX, Minimize2, Maximize2, Tv } from 'lucide-react';

// ── Verified working 24/7 live streams (from worldmonitor.app + extras) ──
const channels = [
    // YouTube Live Streams
    { id: 'bloomberg', name: 'Bloomberg', type: 'youtube', videoId: 'iEpJwprxDdk' },
    { id: 'cnbc', name: 'CNBC', type: 'youtube', videoId: '9NyxcX3rhQs' },
    { id: 'aljazeera', name: 'Al Jazeera', type: 'youtube', videoId: 'gCNeDWCI0vo' },
    // Webcams
    { id: 'tehran', name: 'Tehran Cam', type: 'youtube', videoId: '-zGuR1qVKrU' },
    { id: 'telaviv', name: 'Tel Aviv Cam', type: 'youtube', videoId: 'gmtlJ_m2r5A' },
    { id: 'jerusalem', name: 'Jerusalem Cam', type: 'youtube', videoId: 'fIurYTprwzg' },
];

export default function LiveStreams() {
    const [activeChannel, setActiveChannel] = useState(channels[0]);
    const [muted, setMuted] = useState(true);
    const [minimized, setMinimized] = useState(false);

    if (minimized) {
        return (
            <div className="glass-panel rounded-lg border border-white/10">
                <div className="flex items-center justify-between px-3 py-2">
                    <div className="flex items-center space-x-2">
                        <Radio className="h-3 w-3 text-red-500 animate-pulse" />
                        <span className="text-[9px] font-mono font-bold text-white uppercase">Live TV</span>
                        <span className="text-[8px] font-mono text-gray-500">{activeChannel.name}</span>
                    </div>
                    <button onClick={() => setMinimized(false)} className="text-gray-400 hover:text-white transition-colors">
                        <Maximize2 className="h-3 w-3" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="glass-panel rounded-lg border border-white/10 overflow-hidden" style={{ width: '100%' }}>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-3 py-1.5 bg-black/50">
                <div className="flex items-center space-x-2">
                    <Radio className="h-3 w-3 text-red-500 animate-pulse" />
                    <span className="text-[9px] font-mono font-bold text-white uppercase">Live TV</span>
                    <span className="text-[8px] font-mono text-gray-500">{activeChannel.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <button onClick={() => setMuted(!muted)} className="text-gray-400 hover:text-white transition-colors">
                        {muted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                    </button>
                    <button onClick={() => setMinimized(true)} className="text-gray-400 hover:text-white transition-colors">
                        <Minimize2 className="h-3 w-3" />
                    </button>
                </div>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video bg-black">
                <iframe
                    key={activeChannel.id}
                    src={`https://www.youtube.com/embed/${activeChannel.videoId}?autoplay=1&mute=${muted ? 1 : 0}&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3`}
                    className="absolute inset-0 w-full h-full"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    style={{ border: 0 }}
                />
            </div>

            {/* Channel Selector */}
            <div className="flex overflow-x-auto border-t border-white/10 bg-black/50">
                {channels.map((channel) => (
                    <button
                        key={channel.id}
                        onClick={() => setActiveChannel(channel)}
                        className={`flex-shrink-0 px-3 py-1.5 text-[8px] font-mono font-bold uppercase tracking-wider transition-colors ${activeChannel.id === channel.id
                                ? 'text-brand-cyan bg-brand-cyan/10'
                                : 'text-gray-500 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        {channel.name}
                    </button>
                ))}
            </div>
        </div>
    );
}
