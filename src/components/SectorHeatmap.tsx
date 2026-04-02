'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

// Sector data with simulated real-time changes
const sectors = [
    { name: 'Technology', shortName: 'TECH', emoji: '💻' },
    { name: 'Finance', shortName: 'FIN', emoji: '🏦' },
    { name: 'Energy', shortName: 'ENRG', emoji: '⚡' },
    { name: 'Healthcare', shortName: 'HLTH', emoji: '🏥' },
    { name: 'Consumer', shortName: 'CONS', emoji: '🛒' },
    { name: 'Industrial', shortName: 'IND', emoji: '🏭' },
    { name: 'Real Estate', shortName: 'RLST', emoji: '🏢' },
    { name: 'Materials', shortName: 'MATL', emoji: '🪨' },
    { name: 'Utilities', shortName: 'UTIL', emoji: '💡' },
    { name: 'Telecom', shortName: 'TELC', emoji: '📡' },
    { name: 'Staples', shortName: 'STPL', emoji: '🧴' },
    { name: 'Semis', shortName: 'SEMI', emoji: '🔬' },
];

export default function SectorHeatmap() {
    const [data, setData] = useState<{ name: string; shortName: string; emoji: string; change: number }[]>([]);

    useEffect(() => {
        const generate = () => sectors.map(s => ({
            ...s,
            change: (Math.random() - 0.45) * 6,
        }));
        setData(generate());
        const interval = setInterval(() => {
            setData(prev => prev.map(s => ({
                ...s,
                change: s.change + (Math.random() - 0.5) * 0.4,
            })));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const getColor = (change: number) => {
        if (change > 2) return 'bg-green-500/40 text-green-300 border-green-500/20';
        if (change > 0.5) return 'bg-green-500/20 text-green-400 border-green-500/10';
        if (change > -0.5) return 'bg-gray-500/15 text-gray-400 border-gray-500/10';
        if (change > -2) return 'bg-red-500/20 text-red-400 border-red-500/10';
        return 'bg-red-500/40 text-red-300 border-red-500/20';
    };

    return (
        <div className="p-3">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                    <Activity className="h-3.5 w-3.5 text-brand-cyan" />
                    <h3 className="text-[9px] font-mono font-bold uppercase tracking-widest text-white">Sector Performance</h3>
                </div>
                <span className="text-[7px] font-mono text-gray-500">Simulated · Auto-refresh</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
                {data.map((sector) => (
                    <div
                        key={sector.shortName}
                        className={`rounded border p-2 text-center transition-colors cursor-pointer hover:brightness-125 ${getColor(sector.change)}`}
                    >
                        <div className="text-[10px] font-mono font-bold">{sector.shortName}</div>
                        <div className="text-[9px] font-mono font-bold tabular-nums mt-0.5">
                            {sector.change >= 0 ? '+' : ''}{sector.change.toFixed(2)}%
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
