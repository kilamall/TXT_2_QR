import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import MainNavigator from './src/navigation/MainNavigator';
import {QRProvider} from './src/context/QRContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <QRProvider>
        <NavigationContainer>
          <MainNavigator />
        </NavigationContainer>
      </QRProvider>
    </SafeAreaProvider>
  );
}
