import React, {useEffect} from 'react';
import {StatusBar, LogBox} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import mobileAds from 'react-native-google-mobile-ads';
import MainNavigator from './navigation/MainNavigator';
import {QRProvider} from './context/QRContext';

// Ignore specific warnings
LogBox.ignoreLogs(['new NativeEventEmitter']);

const App = () => {
  useEffect(() => {
    // Initialize Google Mobile Ads
    mobileAds()
      .initialize()
      .then(adapterStatuses => {
        console.log('AdMob initialized:', adapterStatuses);
      })
      .catch(error => {
        console.error('AdMob initialization error:', error);
      });
  }, []);

  return (
    <SafeAreaProvider>
      <QRProvider>
        <NavigationContainer>
          <StatusBar barStyle="dark-content" backgroundColor="#fff" />
          <MainNavigator />
        </NavigationContainer>
      </QRProvider>
    </SafeAreaProvider>
  );
};

export default App;

