import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface CryptoAsset {
  id: number;
  logo: string;
  name: string;
  symbol: string;
  price: number;
  change1h: number;
  change24h: number;
  change7d: number;
  marketCap: number;
  volume24h: number;
  circulatingSupply: number;
  maxSupply?: number | null; // Make maxSupply optional and allow null
  chart7d: string; // URL or data for 7D chart
}

interface CryptoState {
  assets: CryptoAsset[];
  loading: boolean;
  error: string | null;
}

const initialState: CryptoState = {
  assets: [
    {
      id: 1,
      logo: '/assets/bitcoin.png',
      name: 'Bitcoin',
      symbol: 'BTC',
      price: 50000,
      change1h: 0.5,
      change24h: 2.3,
      change7d: 5.7,
      marketCap: 950000000000,
      volume24h: 25000000000,
      circulatingSupply: 19000000,
      maxSupply: 21000000,
      chart7d: '/assets/btc-chart.png'
    },
    {
      id: 2,
      logo: '/assets/ethereum.png',
      name: 'Ethereum',
      symbol: 'ETH',
      price: 3000,
      change1h: -0.2,
      change24h: 1.5,
      change7d: 3.2,
      marketCap: 350000000000,
      volume24h: 15000000000,
      circulatingSupply: 120000000,
      maxSupply: null,
      chart7d: '/assets/eth-chart.png'
    },
    {
      id: 3,
      logo: '/assets/tether.png',
      name: 'Tether',
      symbol: 'USDT',
      price: 1,
      change1h: 0.01,
      change24h: 0.02,
      change7d: 0.05,
      marketCap: 80000000000,
      volume24h: 50000000000,
      circulatingSupply: 80000000000,
      maxSupply: null,
      chart7d: '/assets/usdt-chart.png'
    },
    {
      id: 4,
      logo: '/assets/bnb.png',
      name: 'BNB',
      symbol: 'BNB',
      price: 400,
      change1h: 0.8,
      change24h: 3.1,
      change7d: 7.2,
      marketCap: 60000000000,
      volume24h: 2000000000,
      circulatingSupply: 150000000,
      maxSupply: 170000000,
      chart7d: '/assets/bnb-chart.png'
    },
    {
      id: 5,
      logo: '/assets/solana.png',
      name: 'Solana',
      symbol: 'SOL',
      price: 100,
      change1h: -1.2,
      change24h: 4.5,
      change7d: 12.3,
      marketCap: 40000000000,
      volume24h: 3000000000,
      circulatingSupply: 400000000,
      maxSupply: null,
      chart7d: '/assets/sol-chart.png'
    }
  ],
  loading: false,
  error: null
};

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    updateAsset: (state, action: PayloadAction<{ id: number; updates: Partial<CryptoAsset> }>) => {
      const { id, updates } = action.payload;
      const asset = state.assets.find(a => a.id === id);
      if (asset) {
        Object.assign(asset, updates);
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

export const { updateAsset, setLoading, setError } = cryptoSlice.actions;
export default cryptoSlice.reducer; 