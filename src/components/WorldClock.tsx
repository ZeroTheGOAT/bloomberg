'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Globe } from 'lucide-react';

interface MarketClock {
    city: string;
    exchange: string;
    timezone: string;
    openHour: number;
    closeHour: number;
    flag: string;
}

const markets: MarketClock[] = [
    { city: 'Mumbai', exchange: 'NSE', timezone: 'Asia/Kolkata', openHour: 9, closeHour: 15, flag: '🇮🇳' },
    { city: 'New York', exchange: 'NYSE', timezone: 'America/New_York', openHour: 9, closeHour: 16, flag: '🇺🇸' },
    { city: 'London', exchange: 'LSE', timezone: 'Europe/London', openHour: 8, closeHour: 16, flag: '🇬🇧' },
    { city: 'Tokyo', exchange: 'TSE', timezone: 'Asia/Tokyo', openHour: 9, closeHour: 15, flag: '🇯🇵' },
    { city: 'Hong Kong', exchange: 'HKEX', timezone: 'Asia/Hong_Kong', openHour: 9, closeHour: 16, flag: '🇭🇰' },
    { city: 'Sydney', exchange: 'ASX', timezone: 'Australia/Sydney', openHour: 10, closeHour: 16, flag: '🇦🇺' },
];

export default function WorldClock() {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    const getLocalTime = (tz: string) => {
        return new Intl.DateTimeFormat('en-US', {
            timeZone: tz,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        }).format(now);
    };

    const isOpen = (m: MarketClock) => {
        const localNow = new Date(now.toLocaleString('en-US', { timeZone: m.timezone }));
        const h = localNow.getHours();
        const day = localNow.getDay();
        return day >= 1 && day <= 5 && h >= m.openHour && h < m.closeHour;
    };

    return (
        <div className="p-3">
            <div className="flex items-center space-x-2 mb-3">
                <Globe className="h-3.5 w-3.5 text-brand-cyan" />
                <h3 className="text-[9px] font-mono font-bold uppercase tracking-widest text-white">World Clock</h3>
            </div>
            <div className="space-y-2">
                {markets.map((m) => {
                    const open = isOpen(m);
                    return (
                        <div key={m.exchange} className="flex items-center justify-between px-2 py-1.5 rounded bg-white/[0.02] border border-white/5">
                            <div className="flex items-center space-x-2">
                                <span className="text-sm">{m.flag}</span>
                                <div>
                                    <span className="text-[10px] font-bold text-white">{m.city}</span>
                                    <span className="text-[8px] text-gray-500 ml-1.5">{m.exchange}</span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <span className="text-[11px] font-mono font-bold tabular-nums text-white">{getLocalTime(m.timezone)}</span>
                                <span className={`text-[7px] font-mono font-bold uppercase ${open ? 'text-brand-green' : 'text-gray-600'}`}>
                                    {open ? '● OPEN' : '● CLSD'}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
