import {Platform} from 'react-native';
import {
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

// Replace with your actual AdMob Rewarded Ad Unit IDs
const REWARDED_AD_UNIT_ID = __DEV__
  ? TestIds.REWARDED
  : Platform.select({
      ios: 'ca-app-pub-xxxxxxxxxxxxx/wwwwwwwwww',
      android: 'ca-app-pub-xxxxxxxxxxxxx/wwwwwwwwww',
    }) || TestIds.REWARDED;

class RewardedAdManager {
  private rewarded: RewardedAd | null = null;
  private loaded = false;

  constructor() {
    this.loadAd();
  }

  private loadAd() {
    this.rewarded = RewardedAd.createForAdRequest(REWARDED_AD_UNIT_ID, {
      requestNonPersonalizedAdsOnly: false,
    });

    this.rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      console.log('Rewarded ad loaded');
      this.loaded = true;
    });

    this.rewarded.addAdEventListener(RewardedAdEventType.ERROR, error => {
      console.error('Rewarded ad error:', error);
      this.loaded = false;
    });

    this.rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      reward => {
        console.log('User earned reward:', reward);
      },
    );

    this.rewarded.load();
  }

  public async showAd(onRewarded: () => void): Promise<boolean> {
    if (this.loaded && this.rewarded) {
      try {
        // Add one-time listener for reward
        const unsubscribeEarned = this.rewarded.addAdEventListener(
          RewardedAdEventType.EARNED_REWARD,
          () => {
            onRewarded();
            unsubscribeEarned();
          },
        );

        // Add one-time listener for ad close
        const unsubscribeClosed = this.rewarded.addAdEventListener(
          RewardedAdEventType.CLOSED,
          () => {
            this.loaded = false;
            this.loadAd();
            unsubscribeClosed();
          },
        );

        await this.rewarded.show();
        return true;
      } catch (error) {
        console.error('Error showing rewarded ad:', error);
        this.loadAd();
        return false;
      }
    } else {
      console.log('Rewarded ad not ready');
      this.loadAd();
      return false;
    }
  }

  public isLoaded(): boolean {
    return this.loaded;
  }
}

// Singleton instance
export default new RewardedAdManager();

