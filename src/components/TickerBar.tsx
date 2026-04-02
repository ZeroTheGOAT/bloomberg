'use client';

import React, { useEffect, useRef } from 'react';

// ── TradingView Ticker Tape Widget (real live data, zero API cost) ──
export default function TickerBar() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        containerRef.current.innerHTML = '';

        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
        script.async = true;
        script.innerHTML = JSON.stringify({
            symbols: [
                { proName: 'NSE:NIFTY', title: 'NIFTY 50' },
                { proName: 'NSE:BANKNIFTY', title: 'Bank Nifty' },
                { proName: 'BSE:SENSEX', title: 'Sensex' },
                { proName: 'FX_IDC:USDINR', title: 'USD/INR' },
                { proName: 'BINANCE:BTCUSDT', title: 'Bitcoin' },
                { proName: 'BINANCE:ETHUSDT', title: 'Ethereum' },
                { proName: 'BINANCE:SOLUSDT', title: 'Solana' },
                { proName: 'SP:SPX', title: 'S&P 500' },
                { proName: 'NASDAQ:NDX', title: 'NASDAQ' },
                { proName: 'DJ:DJI', title: 'Dow Jones' },
                { proName: 'TVC:GOLD', title: 'Gold' },
                { proName: 'TVC:USOIL', title: 'Crude Oil' },
                { proName: 'NASDAQ:AAPL', title: 'Apple' },
                { proName: 'NASDAQ:NVDA', title: 'NVIDIA' },
                { proName: 'NASDAQ:TSLA', title: 'Tesla' },
                { proName: 'TVC:VIX', title: 'VIX' },
                { proName: 'TVC:DXY', title: 'Dollar Index' },
                { proName: 'TVC:SILVER', title: 'Silver' },
                { proName: 'BINANCE:XRPUSDT', title: 'XRP' },
                { proName: 'BINANCE:DOGEUSDT', title: 'Doge' },
            ],
            showSymbolLogo: false,
            isTransparent: true,
            displayMode: 'adaptive',
            colorTheme: 'dark',
            locale: 'en',
        });
        containerRef.current.appendChild(script);
    }, []);

    return (
        <footer className="z-50 border-t border-white/10 bg-black/90 backdrop-blur-md h-[46px] overflow-hidden">
            <div ref={containerRef} className="tradingview-widget-container h-full" />
        </footer>
    );
}
