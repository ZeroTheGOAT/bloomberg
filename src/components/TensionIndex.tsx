'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, Shield, Skull } from 'lucide-react';

export default function TensionIndex() {
    const [tension, setTension] = useState(85);
    const [flash, setFlash] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setTension(prev => {
                const change = (Math.random() - 0.45) * 3;
                return Math.max(0, Math.min(100, prev + change));
            });
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (tension > 90) {
            setFlash(true);
            const t = setTimeout(() => setFlash(false), 500);
            return () => clearTimeout(t);
        }
    }, [tension]);

    const level = tension >= 90 ? 'SEVERE' : tension >= 70 ? 'ELEVATED' : tension >= 50 ? 'GUARDED' : 'LOW';
    const color = tension >= 90 ? 'text-red-500' : tension >= 70 ? 'text-orange-500' : tension >= 50 ? 'text-yellow-500' : 'text-green-500';
    const bg = tension >= 90 ? 'bg-red-500/10 border-red-500/30' : tension >= 70 ? 'bg-orange-500/10 border-orange-500/30' : tension >= 50 ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-green-500/10 border-green-500/30';
    const glowColor = tension >= 90 ? 'shadow-[0_0_20px_rgba(255,50,50,0.3)]' : tension >= 70 ? 'shadow-[0_0_15px_rgba(255,150,0,0.2)]' : '';

    const Icon = tension >= 90 ? Skull : tension >= 70 ? AlertTriangle : Shield;

    return (
        <div className={`inline-flex items-center space-x-2 rounded-full border px-4 py-1.5 ${bg} ${glowColor} transition-all duration-300 ${flash ? 'animate-pulse' : ''}`}>
            <span className={`h-2 w-2 rounded-full animate-pulse ${tension >= 70 ? 'bg-current' : 'bg-current'} ${color}`}></span>
            <Icon className={`h-3.5 w-3.5 ${color}`} />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400">
                Global Tension
            </span>
            <span className={`text-sm font-mono font-black tabular-nums ${color}`}>
                {Math.round(tension)}
            </span>
            <span className={`text-[9px] font-mono font-bold uppercase ${color}`}>
                {level}
            </span>
        </div>
    );
}
