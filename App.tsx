import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import mobileAds from 'react-native-google-mobile-ads';
import MainNavigator from './src/navigation/MainNavigator';
import {QRProvider} from './src/context/QRContext';
import {PremiumProvider} from './src/context/PremiumContext';

function AppContent() {
  useEffect(() => {
    // Initialize AdMob
    mobileAds()
      .initialize()
      .then(() => {
        console.log('AdMob initialized');
      })
      .catch(error => {
        console.log('AdMob init error:', error);
      });
  }, []);

  return (
    <SafeAreaProvider>
      <PremiumProvider>
        <QRProvider>
          <NavigationContainer>
            <MainNavigator />
          </NavigationContainer>
        </QRProvider>
      </PremiumProvider>
    </SafeAreaProvider>
  );
}

export default AppContent;
