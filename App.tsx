import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import MainNavigator from './src/navigation/MainNavigator';
import {QRProvider} from './src/context/QRContext';
import {PremiumProvider} from './src/context/PremiumContext';
import {AuthProvider} from './src/context/AuthContext';

function AppContent() {
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
