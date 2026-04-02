'use client';

import React, { useEffect, useRef } from 'react';
import { TrendingUp } from 'lucide-react';

// ── TradingView Mini Chart Widgets for key markets ──
export default function MarketSparklines() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        containerRef.current.innerHTML = '';

        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js';
        script.async = true;
        script.innerHTML = JSON.stringify({
            colorTheme: 'dark',
            dateRange: '1D',
            showChart: true,
            locale: 'en',
            width: '100%',
            height: '100%',
            largeChartUrl: '',
            isTransparent: true,
            showSymbolLogo: true,
            showFloatingTooltip: true,
            plotLineColorGrowing: 'rgba(0, 240, 255, 1)',
            plotLineColorFalling: 'rgba(255, 51, 51, 1)',
            gridLineColor: 'rgba(255, 255, 255, 0.04)',
            scaleFontColor: 'rgba(255, 255, 255, 0.3)',
            belowLineFillColorGrowing: 'rgba(0, 240, 255, 0.04)',
            belowLineFillColorFalling: 'rgba(255, 51, 51, 0.04)',
            belowLineFillColorGrowingBottom: 'rgba(0, 0, 0, 0)',
            belowLineFillColorFallingBottom: 'rgba(0, 0, 0, 0)',
            symbolActiveColor: 'rgba(0, 240, 255, 0.08)',
            tabs: [
                {
                    title: 'Indices',
                    symbols: [
                        { s: 'NSE:NIFTY', d: 'NIFTY 50' },
                        { s: 'NSE:BANKNIFTY', d: 'Bank Nifty' },
                        { s: 'SP:SPX', d: 'S&P 500' },
                        { s: 'NASDAQ:NDX', d: 'NASDAQ' },
                        { s: 'TVC:VIX', d: 'VIX' },
                    ],
                    originalTitle: 'Indices',
                },
                {
                    title: 'Crypto',
                    symbols: [
                        { s: 'BINANCE:BTCUSDT', d: 'Bitcoin' },
                        { s: 'BINANCE:ETHUSDT', d: 'Ethereum' },
                        { s: 'BINANCE:SOLUSDT', d: 'Solana' },
                        { s: 'BINANCE:XRPUSDT', d: 'XRP' },
                    ],
                    originalTitle: 'Crypto',
                },
                {
                    title: 'Commodities',
                    symbols: [
                        { s: 'TVC:GOLD', d: 'Gold' },
                        { s: 'TVC:SILVER', d: 'Silver' },
                        { s: 'TVC:USOIL', d: 'Crude Oil' },
                        { s: 'NYMEX:NG1!', d: 'Natural Gas' },
                    ],
                    originalTitle: 'Commodities',
                },
            ],
        });
        containerRef.current.appendChild(script);
    }, []);

    return (
        <div className="flex flex-col h-full">
            <div className="border-b border-white/10 px-3 py-2 flex items-center space-x-2">
                <TrendingUp className="h-3.5 w-3.5 text-brand-cyan" />
                <h3 className="text-[9px] font-mono font-bold uppercase tracking-widest text-white">Market Overview</h3>
            </div>
            <div ref={containerRef} className="flex-1 min-h-[300px]" />
        </div>
    );
}
