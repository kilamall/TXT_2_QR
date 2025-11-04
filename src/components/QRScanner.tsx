import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

interface QRScannerProps {
  onClose: () => void;
  onScanned: (data: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({onClose}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.messageContainer}>
        <Ionicons name="qr-code-outline" size={100} color="#fff" />
        <Text style={styles.title}>QR Scanner Not Available</Text>
        <Text style={styles.message}>
          QR code scanning has been temporarily disabled for build compatibility.
        </Text>
        <Text style={styles.message}>
          You can still create QR codes and use all other features!
        </Text>
        {Platform.OS === 'web' && (
          <Text style={styles.subMessage}>
            (QR scanning requires camera access on mobile devices)
          </Text>
        )}
      </View>

      <TouchableOpacity onPress={onClose} style={styles.button}>
        <Text style={styles.buttonText}>Close</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
    paddingTop: 50,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
    opacity: 0.8,
  },
  subMessage: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
    opacity: 0.6,
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: '#007AFF',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default QRScanner;
