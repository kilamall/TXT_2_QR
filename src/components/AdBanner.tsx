import React from 'react';

// AdBanner component - AdMob removed for build compatibility
// Ads will be available in the web version via AdSense

interface AdBannerProps {
  size?: any;
  style?: any;
}

const AdBanner: React.FC<AdBannerProps> = () => {
  // Return null - no mobile ads in this build
  return null;
};

export default AdBanner;
