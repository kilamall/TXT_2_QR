import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Platform} from 'react-native';
import MainNavigator from './src/navigation/MainNavigator';
import {QRProvider} from './src/context/QRContext';
import {PremiumProvider} from './src/context/PremiumContext';

function AppContent() {
  useEffect(() => {
    // Initialize AdMob (mobile only)
    if (Platform.OS !== 'web') {
      import('react-native-google-mobile-ads').then(({default: mobileAds}) => {
        mobileAds()
          .initialize()
          .then(() => {
            console.log('AdMob initialized');
          })
          .catch(error => {
            console.log('AdMob init error:', error);
          });
      });
    }
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <PremiumProvider>
          <QRProvider>
            <NavigationContainer>
              <MainNavigator />
            </NavigationContainer>
          </QRProvider>
        </PremiumProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

export default AppContent;
