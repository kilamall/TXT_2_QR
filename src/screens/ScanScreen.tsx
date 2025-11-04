import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import QRScanner from '../components/QRScanner';

const ScanScreen = () => {
  const [showScanner, setShowScanner] = useState(false);
  const [lastScanned, setLastScanned] = useState<{
    data: string;
    timestamp: Date;
  } | null>(null);

  const isSimulator = Platform.OS === 'ios' && !Platform.isPad && Platform.isTVOS === false;

  const handleScanned = (data: string) => {
    setLastScanned({
      data,
      timestamp: new Date(),
    });
  };

  const handleScanPress = () => {
    // Check if running in simulator
    if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
      // Try to detect simulator
      Alert.alert(
        'QR Scanner',
        'QR code scanning works best on a real device. Test on your iPhone for full functionality!',
        [
          {text: 'OK', onPress: () => setShowScanner(true)},
          {text: 'Cancel', style: 'cancel'}
        ]
      );
    } else {
      setShowScanner(true);
    }
  };

  if (showScanner) {
    return (
      <QRScanner
        onClose={() => setShowScanner(false)}
        onScanned={handleScanned}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Scan QR Code</Text>
          <Text style={styles.subtitle}>
            Point your camera at any QR code
          </Text>
        </View>

        {/* Scan Button */}
        <TouchableOpacity
          style={styles.scanButton}
          onPress={handleScanPress}>
          <Ionicons name="qr-code-outline" size={80} color="#fff" />
          <Text style={styles.scanButtonText}>Start Scanning</Text>
          <Text style={styles.scanButtonSubtext}>
            Tap to open QR code scanner
          </Text>
        </TouchableOpacity>

        {/* Last Scanned */}
        {lastScanned && (
          <View style={styles.lastScannedContainer}>
            <Text style={styles.sectionTitle}>Last Scanned</Text>
            <View style={styles.lastScannedCard}>
              <Ionicons name="checkmark-circle" size={30} color="#34C759" />
              <View style={styles.lastScannedInfo}>
                <Text style={styles.lastScannedData} numberOfLines={2}>
                  {lastScanned.data}
                </Text>
                <Text style={styles.lastScannedTime}>
                  {lastScanned.timestamp.toLocaleTimeString()}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Features */}
        <View style={styles.featuresContainer}>
          <Text style={styles.sectionTitle}>What You Can Scan</Text>
          
          <View style={styles.featureCard}>
            <Ionicons name="link" size={24} color="#007AFF" />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Website Links</Text>
              <Text style={styles.featureText}>
                Opens URLs directly in your browser
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <Ionicons name="mail" size={24} color="#007AFF" />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Email Addresses</Text>
              <Text style={styles.featureText}>
                Compose emails instantly
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <Ionicons name="call" size={24} color="#007AFF" />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Phone Numbers</Text>
              <Text style={styles.featureText}>
                Call or save to contacts
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <Ionicons name="wifi" size={24} color="#007AFF" />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>WiFi Networks</Text>
              <Text style={styles.featureText}>
                Connect to WiFi automatically
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <Ionicons name="person" size={24} color="#007AFF" />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Contact Cards</Text>
              <Text style={styles.featureText}>
                Save contact information
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <Ionicons name="document-text" size={24} color="#007AFF" />
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Plain Text</Text>
              <Text style={styles.featureText}>
                Copy any text content
              </Text>
            </View>
          </View>
        </View>

        {/* Tip */}
        <View style={styles.tipContainer}>
          <Ionicons name="bulb" size={24} color="#FF9500" />
          <Text style={styles.tipText}>
            <Text style={styles.tipBold}>Tip:</Text> Make sure the QR code is well-lit and centered in the frame for best results.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    padding: 20,
    paddingTop: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 5,
  },
  scanButton: {
    backgroundColor: '#007AFF',
    margin: 20,
    padding: 40,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 15,
  },
  scanButtonSubtext: {
    color: '#E5F1FF',
    fontSize: 14,
    marginTop: 5,
  },
  lastScannedContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  lastScannedCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lastScannedInfo: {
    flex: 1,
    marginLeft: 15,
  },
  lastScannedData: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  lastScannedTime: {
    fontSize: 13,
    color: '#8E8E93',
  },
  featuresContainer: {
    paddingHorizontal: 20,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  featureTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  featureText: {
    fontSize: 13,
    color: '#8E8E93',
  },
  tipContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF9E6',
    padding: 15,
    margin: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE5B4',
  },
  tipText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
  },
  tipBold: {
    fontWeight: '700',
  },
});

export default ScanScreen;

