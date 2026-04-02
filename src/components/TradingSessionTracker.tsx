'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Globe, Sun, Moon, Sunrise } from 'lucide-react';
import { tradingSessions } from '@/lib/mockData';

function getSessionStatus(session: typeof tradingSessions[0], nowUTC: number) {
    if (session.name === 'Crypto') return { isOpen: true, label: '24/7 OPEN', progress: 1 };

    const open = session.openHourUTC;
    const close = session.closeHourUTC;

    const isOpen = nowUTC >= open && nowUTC < close;

    if (isOpen) {
        const total = close - open;
        const elapsed = nowUTC - open;
        const progress = elapsed / total;
        return { isOpen: true, label: 'OPEN', progress };
    }

    // Calculate time until open
    let hoursUntilOpen = open - nowUTC;
    if (hoursUntilOpen < 0) hoursUntilOpen += 24;
    const h = Math.floor(hoursUntilOpen);
    const m = Math.floor((hoursUntilOpen - h) * 60);
    return { isOpen: false, label: `Opens in ${h}h ${m}m`, progress: 0 };
}

export default function TradingSessionTracker() {
    const [currentUTC, setCurrentUTC] = useState(0);

    useEffect(() => {
        const update = () => {
            const now = new Date();
            setCurrentUTC(now.getUTCHours() + now.getUTCMinutes() / 60);
        };
        update();
        const interval = setInterval(update, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="glass-panel rounded-lg overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
                <div className="flex items-center space-x-2">
                    <Globe className="h-3 w-3 text-brand-cyan" />
                    <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-white">Trading Sessions</h3>
                </div>
                <div className="flex items-center space-x-1 text-[9px] font-mono text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>{new Date().toUTCString().slice(17, 25)} UTC</span>
                </div>
            </div>

            <div className="p-2 space-y-1">
                {tradingSessions.map((session) => {
                    const status = getSessionStatus(session, currentUTC);
                    return (
                        <div
                            key={session.name}
                            className={`flex items-center justify-between rounded px-2.5 py-2 transition-colors ${status.isOpen ? 'bg-green-500/5 border border-green-500/10' : 'border border-transparent hover:bg-white/[0.02]'
                                }`}
                        >
                            <div className="flex items-center space-x-2.5 min-w-0">
                                <div className={`h-2 w-2 rounded-full flex-shrink-0 ${status.isOpen ? 'bg-brand-green shadow-[0_0_6px_#00ff66] animate-pulse' : 'bg-gray-600'
                                    }`} />
                                <div>
                                    <div className="text-[10px] font-mono font-bold text-white">{session.name}</div>
                                    <div className="text-[8px] text-gray-500">{session.region} · {session.timezone}</div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 flex-shrink-0">
                                {/* Progress bar for open sessions */}
                                {status.isOpen && session.name !== 'Crypto' && (
                                    <div className="w-16 h-1 rounded-full bg-white/10 overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-brand-green transition-all"
                                            style={{ width: `${status.progress * 100}%` }}
                                        />
                                    </div>
                                )}
                                <span className={`text-[9px] font-mono font-bold ${status.isOpen ? 'text-brand-green' : 'text-gray-500'
                                    }`}>
                                    {status.label}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
