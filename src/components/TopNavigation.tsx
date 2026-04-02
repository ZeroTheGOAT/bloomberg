'use client';

import { Globe, Search, Settings, Radio } from 'lucide-react';
import React from 'react';
import TensionIndex from './TensionIndex';

export default function TopNavigation() {
  return (
    <nav className="glass-panel sticky top-0 z-50 flex h-12 items-center justify-between border-b px-4 text-xs font-mono uppercase tracking-wider text-gray-400">

      {/* Left: Logo and Live banner */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Globe className="h-5 w-5 text-brand-cyan" />
            <div className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-brand-green animate-pulse shadow-[0_0_6px_#00ff66]"></div>
          </div>
          <span className="text-sm font-bold tracking-[0.15em] text-white">ZERO<span className="text-brand-cyan">PINNACLE</span></span>
        </div>

        {/* Scrolling alert banner */}
        <div className="hidden xl:flex items-center space-x-2 rounded border border-red-500/20 bg-red-500/5 px-2.5 py-1 max-w-[320px] overflow-hidden">
          <Radio className="h-3 w-3 text-red-500 animate-pulse flex-shrink-0" />
          <span className="text-[8px] text-red-400 font-bold flex-shrink-0">LIVE</span>
          <div className="overflow-hidden">
            <div className="animate-ticker whitespace-nowrap text-[8px] text-gray-400">
              Israeli airstrikes in Lebanon • Fed divided on rate path • RBI holds rates for 8th time • BTC ETF inflows surge $780M • NVDA hits ATH on AI demand
            </div>
          </div>
        </div>
      </div>

      {/* Center: Tension Index */}
      <div className="hidden lg:flex">
        <TensionIndex />
      </div>

      {/* Right: Search and status */}
      <div className="flex items-center space-x-4">
        <div className="hidden sm:flex items-center space-x-2 text-[8px]">
          <span className="text-gray-500">STREAMS</span>
          <span className="h-1.5 w-1.5 rounded-full bg-brand-green animate-pulse"></span>
          <span className="text-brand-green font-bold">ACTIVE</span>
        </div>

        <div className="hidden md:flex items-center space-x-2 rounded border border-white/10 bg-black/40 px-2.5 py-1 transition-colors focus-within:border-brand-cyan/50">
          <Search className="h-3 w-3 text-gray-500" />
          <input
            type="text"
            placeholder="Search... (⌘K)"
            className="w-28 bg-transparent text-[9px] text-white placeholder-gray-600 outline-none font-mono"
          />
        </div>

        <button className="p-1 text-gray-500 hover:text-white transition-colors">
          <Settings className="h-4 w-4" />
        </button>
      </div>
    </nav>
  );
}
