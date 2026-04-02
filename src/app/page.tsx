'use client';

import dynamic from 'next/dynamic';
import React, { useState, useEffect, useRef } from 'react';
import TopNavigation from '@/components/TopNavigation';
import MarketPanel from '@/components/MarketPanel';
import NewsTerminal from '@/components/NewsTerminal';
import LiveStreams from '@/components/LiveStreams';
import TradingSessionTracker from '@/components/TradingSessionTracker';
import TickerBar from '@/components/TickerBar';
import SectorHeatmap from '@/components/SectorHeatmap';
import WorldClock from '@/components/WorldClock';
import MarketSparklines from '@/components/MarketSparklines';

const Globe3D = dynamic(() => import('@/components/Globe3D'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[#010409]">
      <div className="text-xs font-mono text-brand-cyan uppercase tracking-widest animate-pulse">◈ Loading Globe ◈</div>
    </div>
  ),
});

// ── TradingView Advanced Chart (opens in main area, replacing the globe) ──
function InlineChart({ symbol, name, onClose }: { symbol: string; name: string; onClose: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: symbol,
      interval: '15',
      timezone: 'Asia/Kolkata',
      theme: 'dark',
      style: '1',
      locale: 'en',
      backgroundColor: 'rgba(1, 4, 9, 1)',
      gridColor: 'rgba(255, 255, 255, 0.03)',
      hide_side_toolbar: false,
      allow_symbol_change: true,
      calendar: false,
      support_host: 'https://www.tradingview.com',
    });
    containerRef.current.appendChild(script);
  }, [symbol]);

  return (
    <div className="flex h-full flex-col bg-[#010409]">
      <div className="flex items-center justify-between border-b border-white/10 bg-black/50 px-4 py-2">
        <div className="flex items-center space-x-3">
          <span className="h-2 w-2 rounded-full bg-brand-green animate-pulse"></span>
          <span className="text-xs font-mono font-bold text-white">{name}</span>
          <span className="text-[9px] font-mono text-gray-500">{symbol}</span>
          <span className="text-[8px] font-mono text-brand-cyan uppercase">Live Chart</span>
        </div>
        <button
          onClick={onClose}
          className="rounded border border-white/10 bg-white/5 px-3 py-1 text-[9px] font-mono font-bold text-gray-400 uppercase tracking-wider hover:bg-white/10 hover:text-white transition-colors"
        >
          ✕ Close Chart · Show Globe
        </button>
      </div>
      <div ref={containerRef} className="flex-1" />
    </div>
  );
}

// ── 2D Flat World Map — actual geographical map with markers ──
function FlatMapView() {
  // Markers positioned by % on equirectangular map
  const markers = [
    { left: '79%', top: '34%', label: 'NSE/BSE', color: '#00f0ff' },
    { left: '24%', top: '28%', label: 'NYSE', color: '#00f0ff' },
    { left: '49%', top: '20%', label: 'LSE', color: '#00f0ff' },
    { left: '88%', top: '25%', label: 'TSE', color: '#00f0ff' },
    { left: '84%', top: '43%', label: 'SGX', color: '#00f0ff' },
    { left: '82%', top: '30%', label: 'SSE', color: '#00f0ff' },
    { left: '67%', top: '32%', label: 'DFM', color: '#00f0ff' },
    { left: '62%', top: '30%', label: 'CONFLICT', color: '#ff4444' },
    { left: '60%', top: '22%', label: 'CONFLICT', color: '#ff4444' },
  ];

  return (
    <div className="relative h-full w-full bg-[#010409] overflow-hidden">
      {/* Flat Earth map as background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-80"
        style={{
          backgroundImage: `url(https://unpkg.com/three-globe@2.33.0/example/img/earth-blue-marble.jpg)`,
          filter: 'brightness(1.2) contrast(1.1)',
        }}
      />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/30" />
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,240,255,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,240,255,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '10% 10%',
        }}
      />
      {/* Pulsing markers */}
      {markers.map((m, i) => (
        <div
          key={i}
          className="absolute z-10"
          style={{ left: m.left, top: m.top, transform: 'translate(-50%, -50%)' }}
        >
          {/* Pulse ring */}
          <div
            className="absolute w-4 h-4 rounded-full animate-ping"
            style={{ backgroundColor: m.color, opacity: 0.2, left: '-4px', top: '-4px' }}
          />
          {/* Dot */}
          <div
            className="w-2 h-2 rounded-full shadow-lg"
            style={{ backgroundColor: m.color, boxShadow: `0 0 6px ${m.color}` }}
          />
          {/* Label */}
          <div className="absolute left-3 top-[-4px] whitespace-nowrap">
            <span className="text-[7px] font-mono font-bold px-1 py-0.5 rounded bg-black/70 border border-white/10" style={{ color: m.color }}>
              {m.label}
            </span>
          </div>
        </div>
      ))}
      {/* Title */}
      <div className="absolute top-4 left-4 z-10">
        <span className="text-[9px] font-mono font-bold text-brand-cyan uppercase tracking-widest bg-black/50 px-2 py-1 rounded border border-white/10">
          2D World Map · Global Markets
        </span>
      </div>
    </div>
  );
}

export default function Home() {
  const [activeChart, setActiveChart] = useState<{ symbol: string; name: string } | null>(null);
  const [mapMode, setMapMode] = useState<'3d' | '2d'>('3d');

  return (
    <div className="flex h-screen flex-col bg-[#010409] relative overflow-hidden">
      <TopNavigation />

      <main className="flex flex-1 overflow-hidden">
        {/* ═══════ LEFT PANEL ═══════ */}
        <aside className="z-10 w-80 flex-shrink-0 border-r border-white/10 bg-[#0d1117]/80 backdrop-blur-sm flex flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            <MarketPanel onOpenChart={(symbol, name) => setActiveChart({ symbol, name })} />
          </div>
          <div className="border-t border-white/10 overflow-y-auto max-h-[200px]">
            <TradingSessionTracker />
          </div>
        </aside>

        {/* ═══════ CENTER (scrollable) ═══════ */}
        <div className="relative flex flex-1 flex-col min-w-0 overflow-y-auto overflow-x-hidden">
          {/* ── Hero Section: Globe OR Chart ── */}
          <section className="relative h-[calc(100vh-7.5rem)] flex-shrink-0">
            {activeChart ? (
              <InlineChart
                symbol={activeChart.symbol}
                name={activeChart.name}
                onClose={() => setActiveChart(null)}
              />
            ) : (
              <div className="relative h-full">
                <div className="absolute inset-0 z-0">
                  {mapMode === '3d' ? (
                    <Globe3D />
                  ) : (
                    <div className="h-full w-full bg-[#010409]">
                      <FlatMapView />
                    </div>
                  )}
                </div>

                {/* 2D/3D toggle */}
                <div className="absolute top-4 right-4 z-20 flex space-x-1 rounded border border-white/10 bg-black/60 p-1 backdrop-blur-md">
                  <button
                    onClick={() => setMapMode('3d')}
                    className={`rounded px-3 py-1 text-[9px] font-mono font-bold uppercase transition-colors ${mapMode === '3d' ? 'bg-brand-cyan/15 text-brand-cyan' : 'text-gray-500 hover:text-white'}`}
                  >3D Globe</button>
                  <button
                    onClick={() => setMapMode('2d')}
                    className={`rounded px-3 py-1 text-[9px] font-mono font-bold uppercase transition-colors ${mapMode === '2d' ? 'bg-brand-cyan/15 text-brand-cyan' : 'text-gray-500 hover:text-white'}`}
                  >2D View</button>
                </div>

                {/* Live TV overlay */}
                <div className="absolute bottom-4 left-4 z-20 w-[350px]">
                  <LiveStreams />
                </div>

                {/* Globe filter controls */}
                {mapMode === '3d' && (
                  <div className="pointer-events-none absolute inset-x-0 bottom-4 z-10 flex justify-center">
                    <div className="pointer-events-auto flex items-center space-x-3 rounded-full border border-white/10 bg-black/60 px-4 py-1.5 backdrop-blur-md ml-[370px]">
                      <button className="text-[8px] uppercase font-mono text-white px-2 py-0.5 rounded bg-white/10">All</button>
                      <div className="h-3 w-px bg-white/20"></div>
                      {[
                        { label: 'Exchanges', color: 'bg-brand-cyan' },
                        { label: 'Risk Zones', color: 'bg-brand-red' },
                        { label: 'Events', color: 'bg-brand-orange' },
                      ].map(item => (
                        <button key={item.label} className="flex items-center space-x-1 text-[8px] uppercase font-mono text-gray-400 hover:text-white transition-colors">
                          <span className={`w-1.5 h-1.5 rounded-full ${item.color}`}></span>
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* ══════ DASHBOARD GRID BELOW GLOBE ══════ */}
          <section className="border-t border-white/10 bg-[#0a0e17] p-6">
            <div className="mb-6 flex items-center space-x-3">
              <span className="h-1 w-8 rounded bg-brand-cyan"></span>
              <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-white">Dashboard Intelligence</h2>
            </div>

            {/* Row 1: S&P 500 Heatmap & Indian Screener — LARGE */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              <div className="glass-panel rounded-lg overflow-hidden" style={{ height: '500px' }}>
                <TradingViewHeatmapWidget />
              </div>
              <div className="glass-panel rounded-lg overflow-hidden" style={{ height: '500px' }}>
                <TradingViewScreener />
              </div>
            </div>

            {/* Row 2: Sector Heatmap, Market Overview, World Clock */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              <div className="glass-panel rounded-lg overflow-hidden" style={{ minHeight: '320px' }}>
                <SectorHeatmap />
              </div>
              <div className="glass-panel rounded-lg overflow-hidden" style={{ minHeight: '320px' }}>
                <MarketSparklines />
              </div>
              <div className="glass-panel rounded-lg overflow-hidden" style={{ minHeight: '320px' }}>
                <WorldClock />
              </div>
            </div>
          </section>
        </div>

        {/* ═══════ RIGHT PANEL ═══════ */}
        <aside className="z-10 w-[360px] flex-shrink-0 border-l border-white/10 bg-[#0d1117]/80 backdrop-blur-sm flex flex-col overflow-hidden">
          <NewsTerminal />
        </aside>
      </main>

      <TickerBar />
    </div>
  );
}

// ── TradingView S&P 500 Heatmap Widget ──
function TradingViewHeatmapWidget() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = '';
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      exchanges: [], dataSource: 'SPX500', grouping: 'sector',
      blockSize: 'market_cap_basic', blockColor: 'change',
      locale: 'en', symbolUrl: '', colorTheme: 'dark',
      hasTopBar: true, isDataSetEnabled: true, isZoomEnabled: true,
      hasSymbolTooltip: true, isMonoSize: false,
      width: '100%', height: '100%',
    });
    ref.current.appendChild(script);
  }, []);
  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-white/10 px-4 py-3">
        <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-white">S&P 500 Sector Heatmap</h3>
        <p className="text-[8px] font-mono text-gray-500 mt-0.5">Real-time sector performance · TradingView</p>
      </div>
      <div ref={ref} className="flex-1" />
    </div>
  );
}

// ── TradingView Indian Market Screener ──
function TradingViewScreener() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = '';
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-screener.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      width: '100%', height: '100%',
      defaultColumn: 'overview', defaultScreen: 'most_capitalized',
      market: 'india', showToolbar: true, colorTheme: 'dark',
      locale: 'en', isTransparent: true,
    });
    ref.current.appendChild(script);
  }, []);
  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-white/10 px-4 py-3">
        <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-white">Indian Market Screener</h3>
        <p className="text-[8px] font-mono text-gray-500 mt-0.5">NSE top stocks by market cap · TradingView</p>
      </div>
      <div ref={ref} className="flex-1" />
    </div>
  );
}
