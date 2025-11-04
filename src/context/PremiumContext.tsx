import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';

interface PremiumContextType {
  isPremium: boolean;
  purchasePremium: () => Promise<void>;
  restorePurchases: () => Promise<void>;
  isLoading: boolean;
}

const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

const PREMIUM_STORAGE_KEY = '@txt2qr_premium';

export const PremiumProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load premium status from storage
  useEffect(() => {
    loadPremiumStatus();
  }, []);

  const loadPremiumStatus = async () => {
    try {
      const status = await AsyncStorage.getItem(PREMIUM_STORAGE_KEY);
      if (status === 'true') {
        setIsPremium(true);
      }
    } catch (error) {
      console.error('Error loading premium status:', error);
    }
  };

  const setPremiumStatus = async (status: boolean) => {
    try {
      await AsyncStorage.setItem(PREMIUM_STORAGE_KEY, status.toString());
      setIsPremium(status);
    } catch (error) {
      console.error('Error saving premium status:', error);
    }
  };

  const purchasePremium = async () => {
    if (isPremium) {
      Alert.alert('Already Premium', 'You already have premium access!');
      return;
    }

    Alert.alert(
      'Go Premium',
      'In-app purchases are not available in this version. Please visit our website to upgrade.',
      [
        {text: 'OK', style: 'default'},
      ]
    );
  };

  const restorePurchases = async () => {
    setIsLoading(true);

    try {
      await loadPremiumStatus();
      setIsLoading(false);
      
      if (isPremium) {
        Alert.alert('✅ Restored!', 'Your premium access has been restored.');
      } else {
        Alert.alert('No Purchases Found', 'No previous purchases to restore.');
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Could not restore purchases');
    }
  };

  return (
    <PremiumContext.Provider
      value={{
        isPremium,
        purchasePremium,
        restorePurchases,
        isLoading,
      }}>
      {children}
    </PremiumContext.Provider>
  );
};

export const usePremium = () => {
  const context = useContext(PremiumContext);
  if (!context) {
    throw new Error('usePremium must be used within PremiumProvider');
  }
  return context;
};

