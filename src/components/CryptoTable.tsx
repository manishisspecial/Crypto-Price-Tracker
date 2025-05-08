import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { websocketService } from '../services/websocketService';

const logos: Record<string, string> = {
  BTC: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png',
  ETH: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
  USDT: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
  BNB: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
  SOL: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png',
  XRP: 'https://s2.coinmarketcap.com/static/img/coins/64x64/52.png',
  USDC: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
  DOGE: 'https://s2.coinmarketcap.com/static/img/coins/64x64/74.png',
};
const sparklines: Record<string, string> = {
  BTC: 'https://s3.coinmarketcap.com/generated/sparklines/web/7d/2781/1.svg',
  ETH: 'https://s3.coinmarketcap.com/generated/sparklines/web/7d/2781/1027.svg',
  USDT: 'https://s3.coinmarketcap.com/generated/sparklines/web/7d/2781/825.svg',
  BNB: 'https://s3.coinmarketcap.com/generated/sparklines/web/7d/2781/1839.svg',
  SOL: 'https://s3.coinmarketcap.com/generated/sparklines/web/7d/2781/5426.svg',
  XRP: 'https://s3.coinmarketcap.com/generated/sparklines/web/7d/2781/52.svg',
  USDC: 'https://s3.coinmarketcap.com/generated/sparklines/web/7d/2781/3408.svg',
  DOGE: 'https://s3.coinmarketcap.com/generated/sparklines/web/7d/2781/74.svg',
};

const Arrow = ({ value }: { value: number }) => (
  <span className={
    `ml-1 text-base font-bold ${value > 0 ? 'text-green-500' : value < 0 ? 'text-red-500' : 'text-gray-400'}`
  }>
    {value > 0 ? '▲' : value < 0 ? '▼' : '•'}
  </span>
);

// AnimatedNumber: animates color on value change
function AnimatedNumber({ value, className = '', formatFn }: { value: number, className?: string, formatFn?: (v: number) => string }) {
  const [prev, setPrev] = useState(value);
  const [flash, setFlash] = useState('');
  useEffect(() => {
    if (value > prev) setFlash('animate-flash-green');
    else if (value < prev) setFlash('animate-flash-red');
    setPrev(value);
    const timeout = setTimeout(() => setFlash(''), 400);
    return () => clearTimeout(timeout);
  }, [value]);
  return (
    <span className={className + ' ' + flash}>{formatFn ? formatFn(value) : value}</span>
  );
}

// InfoIcon with tooltip
const InfoIcon = ({ tip }: { tip: string }) => (
  <span className="ml-1 cursor-pointer text-blue-400" title={tip}>
    <svg className="inline w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4m0-4h.01" /></svg>
  </span>
);

const formatNumber = (num: number, digits = 2): string => {
  if (num >= 1e12) return `$${(num / 1e12).toFixed(digits)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(digits)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(digits)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(digits)}K`;
  return `$${num.toFixed(digits)}`;
};

const formatSupply = (num: number, symbol: string): string => {
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B ${symbol}`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M ${symbol}`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K ${symbol}`;
  return `${num.toFixed(2)} ${symbol}`;
};

const formatPercentage = (num: number): string => {
  return `${num > 0 ? '+' : ''}${num.toFixed(2)}%`;
};

const CryptoTable = () => {
  const assets = useSelector((state: RootState) => state.crypto.assets);
  const leftRowsRef = useRef<(HTMLTableRowElement | null)[]>([]);
  const rightRowsRef = useRef<(HTMLTableRowElement | null)[]>([]);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  useEffect(() => {
    websocketService.start();
    return () => websocketService.stop();
  }, []);

  // Sync row heights for split-table on mobile/tablet using useLayoutEffect and window resize
  useLayoutEffect(() => {
    function syncHeights() {
      if (window.innerWidth >= 1280) return;
      if (!leftRowsRef.current.length || !rightRowsRef.current.length) return;
      leftRowsRef.current.forEach((row, i) => {
        if (row && rightRowsRef.current[i]) {
          const rightRow = rightRowsRef.current[i];
          const maxHeight = Math.max(row.offsetHeight, rightRow!.offsetHeight);
          row.style.height = rightRow!.style.height = maxHeight + 'px';
        }
      });
    }
    syncHeights();
    window.addEventListener('resize', syncHeights);
    return () => window.removeEventListener('resize', syncHeights);
  }, [assets]);

  return (
    <div className="w-full px-2 md:px-4 py-6">
      {/* Desktop: full table */}
      <div className="hidden xl:block overflow-x-auto rounded-2xl shadow-lg bg-white dark:bg-gray-900">
        <table className="min-w-[1200px] w-full table-auto text-sm md:text-base">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-950 text-gray-700 dark:text-white sticky top-0 z-20">
              <th className="py-4 px-2 text-left font-semibold whitespace-nowrap">#</th>
              <th className="py-4 px-2 text-left font-semibold whitespace-nowrap">Logo</th>
              <th className="py-4 px-2 text-left font-semibold whitespace-nowrap">Name</th>
              <th className="py-4 px-2 text-left font-semibold whitespace-nowrap">Symbol</th>
              <th className="py-4 px-2 text-left font-semibold whitespace-nowrap">Price<InfoIcon tip="Current price in USD" /></th>
              <th className="py-4 px-2 text-left font-semibold whitespace-nowrap">1h %<InfoIcon tip="Change in the last 1 hour" /></th>
              <th className="py-4 px-2 text-left font-semibold whitespace-nowrap">24h %<InfoIcon tip="Change in the last 24 hours" /></th>
              <th className="py-4 px-2 text-left font-semibold whitespace-nowrap">7d %<InfoIcon tip="Change in the last 7 days" /></th>
              <th className="py-4 px-2 text-left font-semibold whitespace-nowrap dark:text-white">Market Cap<InfoIcon tip="Total market value of circulating supply" /></th>
              <th className="py-4 px-2 text-left font-semibold whitespace-nowrap dark:text-white">24h Volume<InfoIcon tip="Trading volume in the last 24 hours" /></th>
              <th className="py-4 px-2 text-left font-semibold whitespace-nowrap">Circulating Supply<InfoIcon tip="Coins that are circulating in the market" /></th>
              <th className="py-4 px-2 text-left font-semibold whitespace-nowrap">Max Supply<InfoIcon tip="Maximum number of coins that will ever exist" /></th>
              <th className="py-4 px-2 text-left font-semibold whitespace-nowrap">7D Chart</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset, index) => (
              <tr
                key={asset.id}
                className={
                  `border-b dark:border-gray-700 last:border-b-0 transition group cursor-pointer ` +
                  (selectedRow === index
                    ? 'bg-blue-50 dark:bg-gray-800 shadow-md'
                    : 'hover:bg-blue-50 dark:hover:bg-gray-800 hover:shadow-sm')
                }
                onClick={() => setSelectedRow(index)}
              >
                <td className="py-4 px-2 align-middle font-semibold text-gray-500 dark:text-gray-300">{index + 1}</td>
                <td className="py-4 px-2 align-middle">
                  <img src={logos[asset.symbol] || asset.logo} alt={asset.name} className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 mx-auto" />
                </td>
                <td className="py-4 px-2 align-middle font-bold text-gray-900 dark:text-white">{asset.name}</td>
                <td className="py-4 px-2 align-middle text-xs text-gray-400 dark:text-gray-400 font-semibold">{asset.symbol}</td>
                <td className="py-4 px-2 align-middle font-bold text-gray-900 dark:text-white">
                  <AnimatedNumber value={asset.price} formatFn={formatNumber} />
                </td>
                <td className="py-4 px-2 align-middle">
                  <span className={`flex items-center font-semibold ${asset.change1h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    <Arrow value={asset.change1h} />
                    <AnimatedNumber value={asset.change1h} formatFn={formatPercentage} />
                  </span>
                </td>
                <td className="py-4 px-2 align-middle">
                  <span className={`flex items-center font-semibold ${asset.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    <Arrow value={asset.change24h} />
                    <AnimatedNumber value={asset.change24h} formatFn={formatPercentage} />
                  </span>
                </td>
                <td className="py-4 px-2 align-middle">
                  <span className={`flex items-center font-semibold ${asset.change7d >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    <Arrow value={asset.change7d} />
                    <AnimatedNumber value={asset.change7d} formatFn={formatPercentage} />
                  </span>
                </td>
                <td className="py-4 px-2 align-middle font-semibold text-gray-700 dark:text-white">
                  <AnimatedNumber value={asset.marketCap} formatFn={v => formatNumber(v, 0)} />
                </td>
                <td className="py-4 px-2 align-middle">
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-700"><AnimatedNumber value={asset.volume24h} formatFn={v => formatNumber(v, 2)} /></span>
                    <span className="text-xs text-gray-400 dark:text-gray-400">{formatSupply(asset.volume24h, asset.symbol)}</span>
                  </div>
                </td>
                <td className="py-4 px-2 align-middle font-semibold text-gray-700 dark:text-gray-200">{formatSupply(asset.circulatingSupply, asset.symbol)}</td>
                <td className="py-4 px-2 align-middle font-semibold text-gray-700 dark:text-gray-200">{asset.maxSupply ? formatSupply(asset.maxSupply, asset.symbol) : '∞'}</td>
                <td className="py-4 px-2 align-middle">
                  <img
                    src={sparklines[asset.symbol] || asset.chart7d}
                    alt={`${asset.name} 7D Chart`}
                    className="w-32 h-10 object-contain mx-auto"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Tablet/Mobile: split table */}
      <div className="block xl:hidden w-full">
        <div className="flex w-full bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-x-auto">
          {/* Left sticky table */}
          <div className="sticky left-0 z-30 bg-white dark:bg-gray-900 w-2/5 min-w-[160px] max-w-[220px] border-r border-gray-200 dark:border-gray-700 shadow-lg shadow-blue-100/30">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-950 text-gray-700 dark:text-white sticky top-0 z-20">
                  <th className="py-4 px-2 text-left font-semibold whitespace-nowrap">#</th>
                  <th className="py-4 px-2 text-left font-semibold whitespace-nowrap">Logo</th>
                  <th className="py-4 px-2 text-left font-semibold whitespace-nowrap">Name</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset, index) => (
                  <tr
                    key={asset.id}
                    ref={el => { leftRowsRef.current[index] = el; }}
                    className={
                      `transition group cursor-pointer ` +
                      (selectedRow === index
                        ? 'bg-blue-50 dark:bg-gray-800 shadow-md'
                        : 'hover:bg-blue-50 dark:hover:bg-gray-800 hover:shadow-sm')
                    }
                    onClick={() => setSelectedRow(index)}
                  >
                    <td className="py-4 px-2 align-middle font-semibold text-gray-500 dark:text-gray-300">{index + 1}</td>
                    <td className="py-4 px-2 align-middle">
                      <img src={logos[asset.symbol] || asset.logo} alt={asset.name} className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 mx-auto" />
                    </td>
                    <td className="py-4 px-2 align-middle font-bold text-gray-900 dark:text-white">{asset.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Right scrollable table */}
          <div className="flex-1 min-w-[700px] overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-950 text-gray-700 dark:text-white sticky top-0 z-20">
                  <th className="py-4 px-2 text-left font-semibold whitespace-nowrap">Symbol</th>
                  <th className="py-4 px-2 text-left font-semibold whitespace-nowrap">Price<InfoIcon tip="Current price in USD" /></th>
                  <th className="py-4 px-2 text-left font-semibold whitespace-nowrap">1h %<InfoIcon tip="Change in the last 1 hour" /></th>
                  <th className="py-4 px-2 text-left font-semibold whitespace-nowrap">24h %<InfoIcon tip="Change in the last 24 hours" /></th>
                  <th className="py-4 px-2 text-left font-semibold whitespace-nowrap">7d %<InfoIcon tip="Change in the last 7 days" /></th>
                  <th className="py-4 px-2 text-left font-semibold whitespace-nowrap dark:text-white">Market Cap<InfoIcon tip="Total market value of circulating supply" /></th>
                  <th className="py-4 px-2 text-left font-semibold whitespace-nowrap dark:text-white">24h Volume<InfoIcon tip="Trading volume in the last 24 hours" /></th>
                  <th className="py-4 px-2 text-left font-semibold whitespace-nowrap">Circulating Supply<InfoIcon tip="Coins that are circulating in the market" /></th>
                  <th className="py-4 px-2 text-left font-semibold whitespace-nowrap">Max Supply<InfoIcon tip="Maximum number of coins that will ever exist" /></th>
                  <th className="py-4 px-2 text-left font-semibold whitespace-nowrap">7D Chart</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset, index) => (
                  <tr
                    key={asset.id}
                    ref={el => { rightRowsRef.current[index] = el; }}
                    className={
                      `transition group cursor-pointer ` +
                      (selectedRow === index
                        ? 'bg-blue-50 dark:bg-gray-800 shadow-md'
                        : 'hover:bg-blue-50 dark:hover:bg-gray-800 hover:shadow-sm')
                    }
                    onClick={() => setSelectedRow(index)}
                  >
                    <td className="py-4 px-2 align-middle text-xs text-gray-400 dark:text-gray-400 font-semibold">{asset.symbol}</td>
                    <td className="py-4 px-2 align-middle font-bold text-gray-900 dark:text-white">
                      <AnimatedNumber value={asset.price} formatFn={formatNumber} />
                    </td>
                    <td className="py-4 px-2 align-middle">
                      <span className={`flex items-center font-semibold ${asset.change1h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        <Arrow value={asset.change1h} />
                        <AnimatedNumber value={asset.change1h} formatFn={formatPercentage} />
                      </span>
                    </td>
                    <td className="py-4 px-2 align-middle">
                      <span className={`flex items-center font-semibold ${asset.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        <Arrow value={asset.change24h} />
                        <AnimatedNumber value={asset.change24h} formatFn={formatPercentage} />
                      </span>
                    </td>
                    <td className="py-4 px-2 align-middle">
                      <span className={`flex items-center font-semibold ${asset.change7d >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        <Arrow value={asset.change7d} />
                        <AnimatedNumber value={asset.change7d} formatFn={formatPercentage} />
                      </span>
                    </td>
                    <td className="py-4 px-2 align-middle font-semibold text-gray-700 dark:text-white">
                      <AnimatedNumber value={asset.marketCap} formatFn={v => formatNumber(v, 0)} />
                    </td>
                    <td className="py-4 px-2 align-middle">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-700"><AnimatedNumber value={asset.volume24h} formatFn={v => formatNumber(v, 2)} /></span>
                        <span className="text-xs text-gray-400 dark:text-gray-400">{formatSupply(asset.volume24h, asset.symbol)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-2 align-middle font-semibold text-gray-700 dark:text-gray-200">{formatSupply(asset.circulatingSupply, asset.symbol)}</td>
                    <td className="py-4 px-2 align-middle font-semibold text-gray-700 dark:text-gray-200">{asset.maxSupply ? formatSupply(asset.maxSupply, asset.symbol) : '∞'}</td>
                    <td className="py-4 px-2 align-middle">
                      <img
                        src={sparklines[asset.symbol] || asset.chart7d}
                        alt={`${asset.name} 7D Chart`}
                        className="w-32 h-10 object-contain mx-auto"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoTable;

// Tailwind animation classes (add to your global CSS or tailwind.config.js):
// .animate-flash-green { animation: flash-green 0.4s; }
// .animate-flash-red { animation: flash-red 0.4s; }
// @keyframes flash-green { 0% { background: #bbf7d0; } 100% { background: none; } }
// @keyframes flash-red { 0% { background: #fecaca; } 100% { background: none; } } 