import {Platform} from 'react-native';
import {
  InterstitialAd,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

// Replace with your actual AdMob Interstitial Ad Unit IDs
const INTERSTITIAL_AD_UNIT_ID = __DEV__
  ? TestIds.INTERSTITIAL
  : Platform.select({
      ios: 'ca-app-pub-xxxxxxxxxxxxx/zzzzzzzzzz',
      android: 'ca-app-pub-xxxxxxxxxxxxx/zzzzzzzzzz',
    }) || TestIds.INTERSTITIAL;

class InterstitialAdManager {
  private interstitial: InterstitialAd | null = null;
  private loaded = false;
  private showCount = 0;
  private readonly SHOW_AD_FREQUENCY = 3; // Show ad every 3 QR generations

  constructor() {
    this.loadAd();
  }

  private loadAd() {
    this.interstitial = InterstitialAd.createForAdRequest(
      INTERSTITIAL_AD_UNIT_ID,
      {
        requestNonPersonalizedAdsOnly: false,
      },
    );

    this.interstitial.addAdEventListener(AdEventType.LOADED, () => {
      console.log('Interstitial ad loaded');
      this.loaded = true;
    });

    this.interstitial.addAdEventListener(AdEventType.ERROR, error => {
      console.error('Interstitial ad error:', error);
      this.loaded = false;
    });

    this.interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      console.log('Interstitial ad closed');
      this.loaded = false;
      // Load next ad
      this.loadAd();
    });

    this.interstitial.load();
  }

  public async showAd(): Promise<void> {
    this.showCount++;

    // Only show ad based on frequency
    if (this.showCount % this.SHOW_AD_FREQUENCY !== 0) {
      return;
    }

    if (this.loaded && this.interstitial) {
      try {
        await this.interstitial.show();
      } catch (error) {
        console.error('Error showing interstitial ad:', error);
        // Reload ad if show fails
        this.loadAd();
      }
    } else {
      console.log('Interstitial ad not ready');
      // Try to load if not loaded
      this.loadAd();
    }
  }

  public resetCount() {
    this.showCount = 0;
  }
}

// Singleton instance
export default new InterstitialAdManager();

