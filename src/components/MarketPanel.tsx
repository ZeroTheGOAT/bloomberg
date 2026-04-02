'use client';

import React, { useState, useEffect, useRef } from 'react';

// ── Asset definitions ──
interface AssetDef {
    tvSymbol: string;
    symbol: string;
    name: string;
    region: 'india' | 'us' | 'crypto' | 'commodities';
}

const allAssets: AssetDef[] = [
    { tvSymbol: 'NSE:NIFTY', symbol: 'NIFTY', name: 'NIFTY 50', region: 'india' },
    { tvSymbol: 'NSE:BANKNIFTY', symbol: 'BANKNIFTY', name: 'Bank Nifty', region: 'india' },
    { tvSymbol: 'BSE:SENSEX', symbol: 'SENSEX', name: 'BSE Sensex', region: 'india' },
    { tvSymbol: 'NSE:CNXFINANCE', symbol: 'FINNIFTY', name: 'Fin Nifty', region: 'india' },
    { tvSymbol: 'FX_IDC:USDINR', symbol: 'USDINR', name: 'USD/INR', region: 'india' },
    { tvSymbol: 'NSE:RELIANCE', symbol: 'RELIANCE', name: 'Reliance', region: 'india' },
    { tvSymbol: 'NSE:TCS', symbol: 'TCS', name: 'TCS', region: 'india' },
    { tvSymbol: 'NSE:HDFCBANK', symbol: 'HDFCBANK', name: 'HDFC Bank', region: 'india' },
    { tvSymbol: 'SP:SPX', symbol: 'SPX', name: 'S&P 500', region: 'us' },
    { tvSymbol: 'NASDAQ:NDX', symbol: 'NDX', name: 'NASDAQ 100', region: 'us' },
    { tvSymbol: 'DJ:DJI', symbol: 'DJI', name: 'Dow Jones', region: 'us' },
    { tvSymbol: 'TVC:VIX', symbol: 'VIX', name: 'VIX', region: 'us' },
    { tvSymbol: 'TVC:DXY', symbol: 'DXY', name: 'Dollar Index', region: 'us' },
    { tvSymbol: 'NASDAQ:AAPL', symbol: 'AAPL', name: 'Apple', region: 'us' },
    { tvSymbol: 'NASDAQ:NVDA', symbol: 'NVDA', name: 'NVIDIA', region: 'us' },
    { tvSymbol: 'NASDAQ:TSLA', symbol: 'TSLA', name: 'Tesla', region: 'us' },
    { tvSymbol: 'BINANCE:BTCUSDT', symbol: 'BTC', name: 'Bitcoin', region: 'crypto' },
    { tvSymbol: 'BINANCE:ETHUSDT', symbol: 'ETH', name: 'Ethereum', region: 'crypto' },
    { tvSymbol: 'BINANCE:SOLUSDT', symbol: 'SOL', name: 'Solana', region: 'crypto' },
    { tvSymbol: 'BINANCE:XRPUSDT', symbol: 'XRP', name: 'Ripple', region: 'crypto' },
    { tvSymbol: 'BINANCE:DOGEUSDT', symbol: 'DOGE', name: 'Dogecoin', region: 'crypto' },
    { tvSymbol: 'BINANCE:BNBUSDT', symbol: 'BNB', name: 'BNB', region: 'crypto' },
    { tvSymbol: 'TVC:GOLD', symbol: 'GOLD', name: 'Gold', region: 'commodities' },
    { tvSymbol: 'TVC:SILVER', symbol: 'SILVER', name: 'Silver', region: 'commodities' },
    { tvSymbol: 'TVC:USOIL', symbol: 'CL', name: 'Crude Oil', region: 'commodities' },
    { tvSymbol: 'NYMEX:NG1!', symbol: 'NG', name: 'Natural Gas', region: 'commodities' },
];

function WatchlistWidget() {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;
        ref.current.innerHTML = '';

        const wrapper = document.createElement('div');
        wrapper.className = 'tradingview-widget-container';
        wrapper.style.height = '100%';
        wrapper.style.width = '100%';

        const innerDiv = document.createElement('div');
        innerDiv.className = 'tradingview-widget-container__widget';
        innerDiv.style.height = '100%';
        innerDiv.style.width = '100%';
        wrapper.appendChild(innerDiv);

        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js';
        script.async = true;
        script.innerHTML = JSON.stringify({
            "colorTheme": "dark",
            "dateRange": "12M",
            "showChart": true,
            "locale": "en",
            "largeChartUrl": "",
            "isTransparent": true,
            "showSymbolLogo": true,
            "showFloatingTooltip": true,
            "width": "100%",
            "height": "100%",
            "tabs": [
                {
                    "title": "INDIA",
                    "symbols": [
                        { "s": "BSE:SENSEX", "d": "SENSEX" },
                        { "s": "OANDA:IN50_USD", "d": "NIFTY 50 (CFD)" },
                        { "s": "BSE:BANKEX", "d": "BANKEX" },
                        { "s": "FX_IDC:USDINR", "d": "USD/INR" },
                        { "s": "BSE:RELIANCE", "d": "RELIANCE" },
                        { "s": "BSE:TCS", "d": "TCS" }
                    ],
                    "originalTitle": "Indices"
                },
                {
                    "title": "US / GLOBAL",
                    "symbols": [
                        { "s": "SP:SPX", "d": "S&P 500" },
                        { "s": "NASDAQ:NDX", "d": "Nasdaq 100" },
                        { "s": "DJ:DJI", "d": "Dow Jones" },
                        { "s": "TVC:VIX", "d": "VIX" },
                        { "s": "TVC:DXY", "d": "Dollar Index" },
                        { "s": "NASDAQ:AAPL", "d": "Apple" },
                        { "s": "NASDAQ:NVDA", "d": "NVIDIA" }
                    ]
                },
                {
                    "title": "CRYPTO",
                    "symbols": [
                        { "s": "BINANCE:BTCUSDT", "d": "Bitcoin" },
                        { "s": "BINANCE:ETHUSDT", "d": "Ethereum" },
                        { "s": "BINANCE:SOLUSDT", "d": "Solana" },
                        { "s": "BINANCE:XRPUSDT", "d": "Ripple" },
                        { "s": "BINANCE:DOGEUSDT", "d": "Dogecoin" }
                    ]
                },
                {
                    "title": "COMMOD",
                    "symbols": [
                        { "s": "TVC:GOLD", "d": "Gold" },
                        { "s": "TVC:SILVER", "d": "Silver" },
                        { "s": "TVC:USOIL", "d": "Crude Oil" },
                        { "s": "NYMEX:NG1!", "d": "Natural Gas" }
                    ]
                }
            ]
        });
        wrapper.appendChild(script);
        ref.current.appendChild(wrapper);
    }, []);

    return <div ref={ref} className="h-full w-full" />;
}

export default function MarketPanel({ onOpenChart }: { onOpenChart?: (symbol: string, name: string) => void }) {
    // We add a few popular quick-access buttons at the top, then the widget fills the rest
    const quickLinks = [
        { tvSymbol: 'NSE:NIFTY', symbol: 'NIFTY' },
        { tvSymbol: 'NSE:BANKNIFTY', symbol: 'BANKNIFTY' },
        { tvSymbol: 'BINANCE:BTCUSDT', symbol: 'BTC' },
        { tvSymbol: 'NASDAQ:NVDA', symbol: 'NVDA' },
        { tvSymbol: 'TVC:GOLD', symbol: 'GOLD' },
    ];

    return (
        <div className="flex flex-col h-full bg-[#0a0e17]">
            {/* Quick chart buttons */}
            <div className="border-b border-white/5 px-2 py-1.5 bg-black/40 flex flex-wrap gap-1 justify-center">
                <span className="text-[9px] font-mono text-gray-500 mr-1 mt-1">QUICK:</span>
                {quickLinks.map((asset) => (
                    <button
                        key={asset.tvSymbol}
                        onClick={() => onOpenChart?.(asset.tvSymbol, asset.symbol)}
                        className="px-2 py-1 rounded text-[9px] font-mono font-bold text-gray-400 hover:text-brand-cyan hover:bg-brand-cyan/5 border border-white/5 hover:border-brand-cyan/20 transition-all"
                        title={`Open ${asset.symbol} chart`}
                    >
                        📈 {asset.symbol}
                    </button>
                ))}
            </div>

            {/* Live prices via Unified TradingView Market Overview widget */}
            <div className="flex-1 min-h-0 overflow-hidden">
                <WatchlistWidget />
            </div>
        </div>
    );
}
