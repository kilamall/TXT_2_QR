import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  requestPurchase,
  useIAP,
  Product,
  PurchaseError,
  withIAPContext,
} from 'react-native-iap';
import {Alert, Platform} from 'react-native';

interface PremiumContextType {
  isPremium: boolean;
  purchasePremium: () => Promise<void>;
  restorePurchases: () => Promise<void>;
  isLoading: boolean;
}

const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

const PREMIUM_STORAGE_KEY = '@txt2qr_premium';

// Product IDs - Set these up in App Store Connect / Google Play Console
const PRODUCT_IDS = Platform.select({
  ios: ['com.txt2qr.app.removeads'],
  android: ['com.txt2qr.app.removeads'],
  default: ['com.txt2qr.app.removeads'],
});

const PremiumProviderBase: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    connected,
    products,
    currentPurchase,
    finishTransaction,
    getProducts,
  } = useIAP();

  // Load premium status from storage
  useEffect(() => {
    loadPremiumStatus();
  }, []);

  // Get products on mount
  useEffect(() => {
    if (connected) {
      getProducts({skus: PRODUCT_IDS});
    }
  }, [connected, getProducts]);

  // Handle purchase completion
  useEffect(() => {
    const checkCurrentPurchase = async () => {
      if (currentPurchase) {
        try {
          const receipt = currentPurchase.transactionReceipt;
          
          if (receipt) {
            // Grant premium access
            await setPremiumStatus(true);
            
            // Finish the transaction
            await finishTransaction({
              purchase: currentPurchase,
              isConsumable: false,
            });

            Alert.alert(
              '🎉 Purchase Successful!',
              'Thank you! Ads have been removed. Enjoy TXT 2 QR ad-free!'
            );
          }
        } catch (error) {
          console.error('Purchase error:', error);
        }
      }
    };

    checkCurrentPurchase();
  }, [currentPurchase, finishTransaction]);

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

    if (!connected) {
      Alert.alert('Not Ready', 'Store connection not ready. Please try again.');
      return;
    }

    setIsLoading(true);

    try {
      await requestPurchase({
        sku: PRODUCT_IDS[0],
        andDangerouslyFinishTransactionAutomaticallyIOS: false,
      });
    } catch (error: any) {
      setIsLoading(false);
      
      if (error.code === 'E_USER_CANCELLED') {
        // User cancelled - don't show error
        return;
      }

      Alert.alert(
        'Purchase Failed',
        error.message || 'Could not complete purchase. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const restorePurchases = async () => {
    setIsLoading(true);

    try {
      // In a real app, you'd validate receipts with your server
      // For now, we'll check local storage
      Alert.alert(
        'Restore Purchases',
        'If you previously purchased premium, it will be restored.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => setIsLoading(false),
          },
          {
            text: 'Restore',
            onPress: async () => {
              // For demo: restore from storage
              await loadPremiumStatus();
              setIsLoading(false);
              
              if (isPremium) {
                Alert.alert('✅ Restored!', 'Your premium access has been restored.');
              } else {
                Alert.alert('No Purchases Found', 'No previous purchases to restore.');
              }
            },
          },
        ]
      );
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

// Wrap with IAP Context
export const PremiumProvider = withIAPContext(PremiumProviderBase);

export const usePremium = () => {
  const context = useContext(PremiumContext);
  if (!context) {
    throw new Error('usePremium must be used within PremiumProvider');
  }
  return context;
};

