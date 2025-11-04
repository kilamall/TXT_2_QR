import React, {useEffect} from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import {usePremium} from '../context/PremiumContext';

interface WebAdsProps {
  slot?: string;
  style?: any;
}

/**
 * Google AdSense for Web Platform
 * 
 * Setup:
 * 1. Go to https://www.google.com/adsense/
 * 2. Sign up and get approved
 * 3. Create Display Ads unit
 * 4. Copy your Publisher ID (ca-pub-XXXXX)
 * 5. Copy your Ad Slot ID
 * 6. Update below
 */
const WebAds: React.FC<WebAdsProps> = ({
  slot = '1234567890', // Replace with your Ad Slot ID
  style,
}) => {
  const {isPremium} = usePremium();

  useEffect(() => {
    if (Platform.OS === 'web' && !isPremium && typeof window !== 'undefined') {
      try {
        // Initialize AdSense
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push(
          {}
        );
      } catch (error) {
        console.log('AdSense init error:', error);
      }
    }
  }, [isPremium]);

  // Only show on web and if not premium
  if (Platform.OS !== 'web' || isPremium) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          minHeight: 90,
        }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Replace with your Publisher ID
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 90,
    marginVertical: 15,
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
  },
});

export default WebAds;

