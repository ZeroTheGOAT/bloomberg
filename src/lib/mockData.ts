// ──────────────────────────────────────────────
// Mock Data & Types for the Trading Dashboard
// In production, this data streams from WebSockets
// ──────────────────────────────────────────────

export interface MarketAsset {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    isOpen: boolean;
    region: 'india' | 'us' | 'crypto' | 'commodity';
    currency: string;
}

export interface NewsItem {
    id: string;
    source: string;
    sourceType: 'twitter' | 'telegram' | 'bloomberg' | 'reuters' | 'rss';
    severity: 'critical' | 'high' | 'low';
    category: string;
    headline: string;
    timestamp: Date;
    aiSummary?: string;
    relatedAssets?: string[];
    lat?: number;
    lng?: number;
}

export interface GlobeHotspot {
    id: string;
    lat: number;
    lng: number;
    label: string;
    type: 'financial' | 'risk' | 'event';
    intensity: number; // 0-1
}

// ── Indian Markets ──
export const indianMarkets: MarketAsset[] = [
    { symbol: 'NIFTY', name: 'NIFTY 50', price: 22456.80, change: 267.45, changePercent: 1.21, isOpen: false, region: 'india', currency: '₹' },
    { symbol: 'BANKNIFTY', name: 'Bank Nifty', price: 48234.15, change: -312.50, changePercent: -0.64, isOpen: false, region: 'india', currency: '₹' },
    { symbol: 'SENSEX', name: 'BSE Sensex', price: 73890.25, change: 845.30, changePercent: 1.16, isOpen: false, region: 'india', currency: '₹' },
    { symbol: 'FINNIFTY', name: 'Fin Nifty', price: 20567.40, change: 134.20, changePercent: 0.66, isOpen: false, region: 'india', currency: '₹' },
    { symbol: 'MIDCPNIFTY', name: 'MidCap Nifty', price: 10234.55, change: -45.30, changePercent: -0.44, isOpen: false, region: 'india', currency: '₹' },
    { symbol: 'INRUSD', name: 'INR/USD', price: 83.42, change: -0.12, changePercent: -0.14, isOpen: true, region: 'india', currency: '₹' },
];

// ── US Markets ──
export const usMarkets: MarketAsset[] = [
    { symbol: 'SPX', name: 'S&P 500', price: 5667.56, change: 42.30, changePercent: 0.75, isOpen: false, region: 'us', currency: '$' },
    { symbol: 'NDX', name: 'NASDAQ 100', price: 19876.45, change: 156.78, changePercent: 0.80, isOpen: false, region: 'us', currency: '$' },
    { symbol: 'DJI', name: 'Dow Jones', price: 42340.12, change: -234.50, changePercent: -0.55, isOpen: false, region: 'us', currency: '$' },
    { symbol: 'VIX', name: 'VIX Fear Index', price: 18.34, change: 1.23, changePercent: 7.19, isOpen: false, region: 'us', currency: '$' },
    { symbol: 'RUT', name: 'Russell 2000', price: 2234.56, change: 12.45, changePercent: 0.56, isOpen: false, region: 'us', currency: '$' },
    { symbol: 'DXY', name: 'US Dollar Index', price: 103.67, change: -0.34, changePercent: -0.33, isOpen: true, region: 'us', currency: '$' },
];

// ── Crypto Markets ──
export const cryptoMarkets: MarketAsset[] = [
    { symbol: 'BTC', name: 'Bitcoin', price: 67234.56, change: -1234.78, changePercent: -1.81, isOpen: true, region: 'crypto', currency: '$' },
    { symbol: 'ETH', name: 'Ethereum', price: 3456.12, change: 45.67, changePercent: 1.34, isOpen: true, region: 'crypto', currency: '$' },
    { symbol: 'SOL', name: 'Solana', price: 145.23, change: 8.90, changePercent: 6.53, isOpen: true, region: 'crypto', currency: '$' },
    { symbol: 'XRP', name: 'Ripple', price: 2.34, change: -0.12, changePercent: -4.88, isOpen: true, region: 'crypto', currency: '$' },
    { symbol: 'DOGE', name: 'Dogecoin', price: 0.1234, change: 0.0056, changePercent: 4.75, isOpen: true, region: 'crypto', currency: '$' },
    { symbol: 'BNB', name: 'Binance Coin', price: 612.34, change: -8.90, changePercent: -1.43, isOpen: true, region: 'crypto', currency: '$' },
];

// ── Commodities ──
export const commodities: MarketAsset[] = [
    { symbol: 'XAUUSD', name: 'Gold', price: 2342.56, change: 12.34, changePercent: 0.53, isOpen: true, region: 'commodity', currency: '$' },
    { symbol: 'XAGUSD', name: 'Silver', price: 28.67, change: -0.45, changePercent: -1.55, isOpen: true, region: 'commodity', currency: '$' },
    { symbol: 'CL', name: 'Crude Oil (WTI)', price: 78.34, change: 1.23, changePercent: 1.60, isOpen: true, region: 'commodity', currency: '$' },
    { symbol: 'NG', name: 'Natural Gas', price: 2.345, change: 0.087, changePercent: 3.86, isOpen: true, region: 'commodity', currency: '$' },
];

// ── News Feed Mock Data ──
export const mockNews: NewsItem[] = [
    {
        id: '1', source: 'FinancialJuice', sourceType: 'telegram', severity: 'critical',
        category: 'GEOPOLITICS', headline: 'BREAKING: Israeli airstrikes hit multiple targets in southern Lebanon. IDF confirms operations underway.',
        timestamp: new Date(Date.now() - 30000), relatedAssets: ['XAUUSD', 'CL'], lat: 33.27, lng: 35.20,
    },
    {
        id: '2', source: 'Bloomberg', sourceType: 'bloomberg', severity: 'high',
        category: 'CENTRAL BANKS', headline: 'Fed minutes show officials divided over rate path. "Higher for longer" stance gaining support.',
        timestamp: new Date(Date.now() - 120000), relatedAssets: ['SPX', 'DXY', 'NDX'], lat: 38.89, lng: -77.03,
    },
    {
        id: '3', source: '@zerohedge', sourceType: 'twitter', severity: 'high',
        category: 'FINANCIALS', headline: '*CLIFFWATER $33 BLN PRIVATE CREDIT FUND Q1 REDEMPTIONS REACH 14%',
        timestamp: new Date(Date.now() - 180000), relatedAssets: ['SPX'], lat: 40.71, lng: -74.01,
    },
    {
        id: '4', source: 'Reuters', sourceType: 'reuters', severity: 'high',
        category: 'INDIA', headline: 'RBI holds repo rate unchanged at 6.5% for 8th consecutive time. GDP growth forecast raised to 7.2%.',
        timestamp: new Date(Date.now() - 300000), relatedAssets: ['NIFTY', 'BANKNIFTY', 'INRUSD'], lat: 18.93, lng: 72.83,
    },
    {
        id: '5', source: 'CoinDesk', sourceType: 'rss', severity: 'low',
        category: 'CRYPTO', headline: 'Bitcoin ETF daily inflows surge to $780M as institutional demand accelerates ahead of halving.',
        timestamp: new Date(Date.now() - 450000), relatedAssets: ['BTC', 'ETH'], lat: 40.71, lng: -74.01,
    },
    {
        id: '6', source: '@WalterBloomberg', sourceType: 'twitter', severity: 'critical',
        category: 'MARKETS', headline: 'NVIDIA CEO Jensen Huang: "We are at the iPhone moment of AI." Stock jumps 6% after-hours.',
        timestamp: new Date(Date.now() - 600000), relatedAssets: ['NDX'], lat: 37.39, lng: -122.08,
    },
    {
        id: '7', source: 'Moneycontrol', sourceType: 'rss', severity: 'high',
        category: 'INDIA', headline: 'FII selling intensifies: ₹4,500 Cr outflow from Indian equities in single session. DIIs absorb pressure.',
        timestamp: new Date(Date.now() - 900000), relatedAssets: ['NIFTY', 'SENSEX'], lat: 19.07, lng: 72.87,
    },
    {
        id: '8', source: 'FinancialJuice', sourceType: 'telegram', severity: 'low',
        category: 'COMMODITIES', headline: 'OPEC+ discussing potential production cut extension through Q3 2025. Crude rallies.',
        timestamp: new Date(Date.now() - 1200000), relatedAssets: ['CL', 'NG'], lat: 24.47, lng: 54.37,
    },
];

// ── Globe Hotspot Data ──
export const globeHotspots: GlobeHotspot[] = [
    { id: 'mumbai', lat: 19.07, lng: 72.87, label: 'NSE/BSE', type: 'financial', intensity: 0.9 },
    { id: 'nyc', lat: 40.71, lng: -74.01, label: 'NYSE/NASDAQ', type: 'financial', intensity: 1 },
    { id: 'london', lat: 51.51, lng: -0.12, label: 'LSE', type: 'financial', intensity: 0.85 },
    { id: 'tokyo', lat: 35.68, lng: 139.69, label: 'TSE', type: 'financial', intensity: 0.8 },
    { id: 'shanghai', lat: 31.23, lng: 121.47, label: 'SSE', type: 'financial', intensity: 0.75 },
    { id: 'hk', lat: 22.27, lng: 114.17, label: 'HKEX', type: 'financial', intensity: 0.7 },
    { id: 'frankfurt', lat: 50.11, lng: 8.68, label: 'FSE', type: 'financial', intensity: 0.6 },
    { id: 'dubai', lat: 25.20, lng: 55.27, label: 'DFM', type: 'financial', intensity: 0.5 },
    { id: 'sydney', lat: -33.87, lng: 151.21, label: 'ASX', type: 'financial', intensity: 0.5 },
    { id: 'singapore', lat: 1.35, lng: 103.82, label: 'SGX', type: 'financial', intensity: 0.65 },
    // Risk hotspots
    { id: 'lebanon', lat: 33.89, lng: 35.50, label: 'CONFLICT ZONE', type: 'risk', intensity: 1 },
    { id: 'ukraine', lat: 48.38, lng: 31.17, label: 'CONFLICT ZONE', type: 'risk', intensity: 0.95 },
    { id: 'taiwan', lat: 23.70, lng: 120.96, label: 'GEOPOLITICAL TENSION', type: 'risk', intensity: 0.6 },
];

// ── Trading Session Times ──
export interface TradingSession {
    name: string;
    region: string;
    openHourUTC: number;
    closeHourUTC: number;
    timezone: string;
}

export const tradingSessions: TradingSession[] = [
    { name: 'NSE/BSE', region: 'India', openHourUTC: 3.75, closeHourUTC: 10, timezone: 'IST (UTC+5:30)' },
    { name: 'NYSE', region: 'United States', openHourUTC: 14.5, closeHourUTC: 21, timezone: 'EST (UTC-5)' },
    { name: 'NASDAQ', region: 'United States', openHourUTC: 14.5, closeHourUTC: 21, timezone: 'EST (UTC-5)' },
    { name: 'LSE', region: 'United Kingdom', openHourUTC: 8, closeHourUTC: 16.5, timezone: 'GMT (UTC+0)' },
    { name: 'TSE', region: 'Japan', openHourUTC: 0, closeHourUTC: 6, timezone: 'JST (UTC+9)' },
    { name: 'HKEX', region: 'Hong Kong', openHourUTC: 1.5, closeHourUTC: 8, timezone: 'HKT (UTC+8)' },
    { name: 'Crypto', region: 'Global', openHourUTC: 0, closeHourUTC: 24, timezone: '24/7' },
];

// ── Utility to simulate price fluctuation ──
export function simulatePriceTick(asset: MarketAsset): MarketAsset {
    const volatility = asset.region === 'crypto' ? 0.003 : 0.0005;
    const randomChange = (Math.random() - 0.5) * 2 * volatility * asset.price;
    const newPrice = +(asset.price + randomChange).toFixed(
        asset.price < 10 ? 4 : 2
    );
    const newChange = +(newPrice - (asset.price - asset.change)).toFixed(
        asset.price < 10 ? 4 : 2
    );
    const newChangePercent = +(
        (newChange / (newPrice - newChange)) * 100
    ).toFixed(2);

    return {
        ...asset,
        price: newPrice,
        change: newChange,
        changePercent: newChangePercent,
    };
}
