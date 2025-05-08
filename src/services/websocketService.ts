import { store } from '../store/store';
import { updateAsset } from '../store/cryptoSlice';
import type { CryptoAsset } from '../store/cryptoSlice';

class WebSocketService {
  private interval: ReturnType<typeof setInterval> | null = null;
  private readonly UPDATE_INTERVAL = 2000; // 2 seconds

  private generateRandomChange(): number {
    return (Math.random() * 2 - 1) * 0.5; // Random change between -0.5% and 0.5%
  }

  private generateRandomVolumeChange(): number {
    return (Math.random() * 2 - 1) * 0.1; // Random change between -10% and 10%
  }

  private updateAssetPrice(asset: CryptoAsset): void {
    const priceChange = asset.price * (this.generateRandomChange() / 100);
    const newPrice = asset.price + priceChange;
    const volumeChange = asset.volume24h * (this.generateRandomVolumeChange() / 100);
    const newVolume = asset.volume24h + volumeChange;

    store.dispatch(updateAsset({
      id: asset.id,
      updates: {
        price: Number(newPrice.toFixed(2)),
        change1h: Number((asset.change1h + this.generateRandomChange()).toFixed(2)),
        change24h: Number((asset.change24h + this.generateRandomChange()).toFixed(2)),
        change7d: Number((asset.change7d + this.generateRandomChange()).toFixed(2)),
        volume24h: Number(newVolume.toFixed(2))
      }
    }));
  }

  public start(): void {
    if (this.interval) return;

    this.interval = setInterval(() => {
      const state = store.getState();
      state.crypto.assets.forEach(asset => {
        this.updateAssetPrice(asset);
      });
    }, this.UPDATE_INTERVAL);
  }

  public stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}

export const websocketService = new WebSocketService(); 