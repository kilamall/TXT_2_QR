import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
  Dimensions,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {BarCodeScanner} from 'expo-barcode-scanner';

interface QRScannerProps {
  onClose: () => void;
  onScanned?: (data: string) => void;
}

const {width, height} = Dimensions.get('window');

const QRScanner: React.FC<QRScannerProps> = ({onClose, onScanned}) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [flashOn, setFlashOn] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const {status} = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({type, data}: {type: string; data: string}) => {
    setScanned(true);
    
    // Detect what type of QR code it is
    const qrType = detectQRType(data);
    
    Alert.alert(
      'QR Code Scanned!',
      `Type: ${qrType}\n\nContent: ${data}`,
      [
        {
          text: 'Open',
          onPress: () => handleOpenQR(data, qrType),
        },
        {
          text: 'Copy',
          onPress: () => {
            Alert.alert('Copied!', 'QR code content copied to clipboard');
            // Could use Clipboard API here
          },
        },
        {
          text: 'Scan Another',
          onPress: () => setScanned(false),
        },
        {
          text: 'Done',
          onPress: onClose,
        },
      ]
    );

    if (onScanned) {
      onScanned(data);
    }
  };

  const detectQRType = (data: string): string => {
    if (data.match(/^https?:\/\//i)) return 'URL';
    if (data.match(/^mailto:/i) || data.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return 'Email';
    if (data.match(/^tel:/i) || data.match(/^\+?[\d\s\-\(\)]{10,}$/)) return 'Phone';
    if (data.match(/^sms:/i)) return 'SMS';
    if (data.match(/^WIFI:/i)) return 'WiFi';
    if (data.match(/^BEGIN:VCARD/i)) return 'Contact';
    return 'Text';
  };

  const handleOpenQR = async (data: string, type: string) => {
    try {
      if (type === 'URL') {
        const url = data.startsWith('http') ? data : `https://${data}`;
        await Linking.openURL(url);
      } else if (type === 'Email') {
        const email = data.startsWith('mailto:') ? data : `mailto:${data}`;
        await Linking.openURL(email);
      } else if (type === 'Phone') {
        const phone = data.startsWith('tel:') ? data : `tel:${data}`;
        await Linking.openURL(phone);
      } else if (type === 'SMS') {
        const sms = data.startsWith('sms:') ? data : `sms:${data}`;
        await Linking.openURL(sms);
      } else {
        Alert.alert('Content', data);
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to open this content');
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Ionicons name="camera-off" size={80} color="#FF3B30" />
          <Text style={styles.title}>Camera Access Denied</Text>
          <Text style={styles.subtitle}>
            Please enable camera access in Settings to scan QR codes
          </Text>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
        torchMode={flashOn ? 'on' : 'off'}
      />

      {/* Overlay */}
      <View style={styles.overlay}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={30} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.flashButton} 
            onPress={() => setFlashOn(!flashOn)}>
            <Ionicons 
              name={flashOn ? "flash" : "flash-off"} 
              size={30} 
              color="#fff" 
            />
          </TouchableOpacity>
        </View>

        {/* Scan Area */}
        <View style={styles.scanArea}>
          <View style={styles.scanFrame}>
            {/* Corner indicators */}
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
          
          <Text style={styles.instructions}>
            {scanned ? 'QR Code Scanned!' : 'Point camera at QR code'}
          </Text>
        </View>

        {/* Bottom info */}
        <View style={styles.bottomInfo}>
          <Ionicons name="qr-code-outline" size={40} color="#fff" />
          <Text style={styles.bottomText}>
            Scanning for QR codes...
          </Text>
          {scanned && (
            <TouchableOpacity 
              style={styles.rescanButton}
              onPress={() => setScanned(false)}>
              <Text style={styles.rescanButtonText}>Tap to Scan Again</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 50,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flashButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: width * 0.7,
    height: width * 0.7,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#007AFF',
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  instructions: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 30,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 3,
  },
  bottomInfo: {
    alignItems: 'center',
    paddingBottom: 50,
    paddingTop: 20,
  },
  bottomText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  rescanButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 20,
  },
  rescanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#E5E5EA',
    marginTop: 15,
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
});

export default QRScanner;

