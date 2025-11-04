import React from 'react';
import {StatusBar, LogBox} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import MainNavigator from './navigation/MainNavigator';
import {QRProvider} from './context/QRContext';
import {PremiumProvider} from './context/PremiumContext';
import {AuthProvider} from './context/AuthContext';

// Ignore specific warnings
LogBox.ignoreLogs(['new NativeEventEmitter']);

const App = () => {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <PremiumProvider>
          <QRProvider>
            <NavigationContainer>
              <StatusBar barStyle="dark-content" backgroundColor="#fff" />
              <MainNavigator />
            </NavigationContainer>
          </QRProvider>
        </PremiumProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;

