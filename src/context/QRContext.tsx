import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface QRCode {
  id: string;
  text: string;
  type: 'text' | 'url' | 'email' | 'phone' | 'sms' | 'wifi' | 'contact' | 'other';
  timestamp: number;
  svg?: string;
}

interface QRContextType {
  qrCodes: QRCode[];
  currentQR: QRCode | null;
  addQRCode: (qr: QRCode) => Promise<void>;
  deleteQRCode: (id: string) => Promise<void>;
  setCurrentQR: (qr: QRCode | null) => void;
  clearHistory: () => Promise<void>;
}

const QRContext = createContext<QRContextType | undefined>(undefined);

const STORAGE_KEY = '@txt2qr_history';

export const QRProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [qrCodes, setQRCodes] = useState<QRCode[]>([]);
  const [currentQR, setCurrentQR] = useState<QRCode | null>(null);

  // Load QR codes from storage on mount
  useEffect(() => {
    loadQRCodes();
  }, []);

  const loadQRCodes = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setQRCodes(parsed);
      }
    } catch (error) {
      console.error('Error loading QR codes:', error);
    }
  };

  const saveQRCodes = async (codes: QRCode[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(codes));
    } catch (error) {
      console.error('Error saving QR codes:', error);
    }
  };

  const addQRCode = async (qr: QRCode) => {
    const newQRCodes = [qr, ...qrCodes];
    setQRCodes(newQRCodes);
    await saveQRCodes(newQRCodes);
    setCurrentQR(qr);
  };

  const deleteQRCode = async (id: string) => {
    const filtered = qrCodes.filter(qr => qr.id !== id);
    setQRCodes(filtered);
    await saveQRCodes(filtered);
  };

  const clearHistory = async () => {
    setQRCodes([]);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  return (
    <QRContext.Provider
      value={{
        qrCodes,
        currentQR,
        addQRCode,
        deleteQRCode,
        setCurrentQR,
        clearHistory,
      }}>
      {children}
    </QRContext.Provider>
  );
};

export const useQR = () => {
  const context = useContext(QRContext);
  if (!context) {
    throw new Error('useQR must be used within QRProvider');
  }
  return context;
};

