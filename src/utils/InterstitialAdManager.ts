// InterstitialAdManager - Removed for build compatibility
// Will be added back when native ads are configured

export class InterstitialAdManager {
  static async showAd(): Promise<boolean> {
    console.log('Interstitial ads not available in this build');
    return false;
  }
}
