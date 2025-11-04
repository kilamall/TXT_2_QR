import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from 'react-native-google-mobile-ads';
import {usePremium} from '../context/PremiumContext';

// AdMob Test IDs - Replace with your real IDs for production
// Get your IDs from: https://admob.google.com/
const BANNER_AD_UNIT_ID = __DEV__
  ? TestIds.BANNER
  : Platform.select({
      ios: 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyy', // Replace with your iOS Banner ID
      android: 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyy', // Replace with your Android Banner ID
    }) || TestIds.BANNER;

interface AdBannerProps {
  size?: BannerAdSize;
  style?: any;
}

const AdBanner: React.FC<AdBannerProps> = ({
  size = BannerAdSize.ANCHORED_ADAPTIVE_BANNER,
  style,
}) => {
  const {isPremium} = usePremium();

  // Don't show ads if user has premium
  if (isPremium) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <BannerAd
        unitId={BANNER_AD_UNIT_ID}
        size={size}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
        }}
        onAdLoaded={() => {
          console.log('Banner ad loaded');
        }}
        onAdFailedToLoad={error => {
          console.error('Banner ad failed to load:', error);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
});

export default AdBanner;

