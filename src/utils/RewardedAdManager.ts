// RewardedAdManager - Removed for build compatibility
// Will be added back when native ads are configured

export class RewardedAdManager {
  static async showAd(): Promise<boolean> {
    console.log('Rewarded ads not available in this build');
    return false;
  }
}
