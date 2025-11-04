import React, {useEffect} from 'react';
import {View, StyleSheet, Platform} from 'react-native';

interface GoogleAdsenseProps {
  client?: string;
  slot?: string;
  style?: any;
  format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
}

/**
 * Google AdSense for Web
 * Only shows on web platform
 * 
 * To set up:
 * 1. Go to https://www.google.com/adsense/
 * 2. Create account and get approved
 * 3. Create ad unit
 * 4. Get your Publisher ID (ca-pub-XXXXX)
 * 5. Get your Ad Slot ID
 * 6. Replace in the component usage
 */
const GoogleAdsense: React.FC<GoogleAdsenseProps> = ({
  client = 'ca-pub-XXXXXXXXXXXXXXXX', // Replace with your AdSense Publisher ID
  slot = '1234567890', // Replace with your Ad Slot ID
  style,
  format = 'auto',
}) => {
  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        // Load AdSense script if not already loaded
        if (!(window as any).adsbygoogle) {
          const script = document.createElement('script');
          script.src =
            'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
          script.async = true;
          script.crossOrigin = 'anonymous';
          script.setAttribute('data-ad-client', client);
          document.head.appendChild(script);
        }

        // Push ad
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push(
          {}
        );
      } catch (error) {
        console.log('AdSense error:', error);
      }
    }
  }, [client, slot]);

  // Only render on web
  if (Platform.OS !== 'web') {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
        }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
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
    marginVertical: 10,
  },
});

export default GoogleAdsense;

