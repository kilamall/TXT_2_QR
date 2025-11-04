import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import CameraScanner from '../components/CameraScanner';
import ManualInput from '../components/ManualInput';
import QRPreviewModal from '../components/QRPreviewModal';
import AdBanner from '../components/AdBanner';
import {useQR} from '../context/QRContext';
import {detectQRType, generateId} from '../utils/qrDetector';

const HomeScreen = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [qrText, setQrText] = useState('');
  const {addQRCode} = useQR();

  const handleTextDetected = (text: string) => {
    setQrText(text);
    setShowCamera(false);
    setShowPreview(true);
  };

  const handleManualSubmit = (text: string) => {
    setQrText(text);
    setShowPreview(true);
  };

  const handleSaveQR = async () => {
    const qrCode = {
      id: generateId(),
      text: qrText,
      type: detectQRType(qrText),
      timestamp: Date.now(),
    };
    
    await addQRCode(qrCode);
    setShowPreview(false);
    setQrText('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>TXT 2 QR</Text>
          <Text style={styles.subtitle}>
            Scan text or create QR codes instantly
          </Text>
        </View>

        {/* Camera Scan Button - Works on web too! */}
        <TouchableOpacity
          style={styles.cameraButton}
          onPress={() => setShowCamera(true)}>
          <Ionicons name="camera" size={40} color="#fff" />
          <Text style={styles.cameraButtonText}>Scan Text with Camera</Text>
          <Text style={styles.cameraButtonSubtext}>
            {Platform.OS === 'web' 
              ? 'Upload image or use device camera (mobile browsers)'
              : 'Use OCR to extract text from images'}
          </Text>
        </TouchableOpacity>

        {/* Manual Input */}
        <ManualInput onSubmit={handleManualSubmit} />

        {/* Features Section */}
        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>Features</Text>
          
          <View style={styles.featureRow}>
            <View style={styles.featureCard}>
              <Ionicons name="scan" size={30} color="#007AFF" />
              <Text style={styles.featureText}>OCR Scanning</Text>
            </View>
            
            <View style={styles.featureCard}>
              <Ionicons name="qr-code" size={30} color="#007AFF" />
              <Text style={styles.featureText}>QR Generator</Text>
            </View>
          </View>
          
          <View style={styles.featureRow}>
            <View style={styles.featureCard}>
              <Ionicons name="share-social" size={30} color="#007AFF" />
              <Text style={styles.featureText}>Easy Sharing</Text>
            </View>
            
            <View style={styles.featureCard}>
              <Ionicons name="time" size={30} color="#007AFF" />
              <Text style={styles.featureText}>History</Text>
            </View>
          </View>
        </View>

        {/* Ad Banner */}
        <AdBanner style={styles.adBanner} />
      </ScrollView>

      {/* Camera Scanner Modal */}
      <Modal
        visible={showCamera}
        animationType="slide"
        presentationStyle="fullScreen">
        <CameraScanner
          onTextDetected={handleTextDetected}
          onClose={() => setShowCamera(false)}
        />
      </Modal>

      {/* QR Preview Modal */}
      <QRPreviewModal
        visible={showPreview}
        qrText={qrText}
        onClose={() => {
          setShowPreview(false);
          setQrText('');
        }}
        onSave={handleSaveQR}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollView: {
    flex: 1,
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
  cameraButton: {
    backgroundColor: '#007AFF',
    margin: 15,
    marginTop: 20,
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  cameraButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
  },
  cameraButtonSubtext: {
    color: '#E5F1FF',
    fontSize: 14,
    marginTop: 5,
  },
  featuresContainer: {
    padding: 15,
    marginTop: 10,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  featureCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  adBanner: {
    marginTop: 20,
  },
});

export default HomeScreen;

