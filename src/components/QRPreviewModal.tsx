import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  SafeAreaView,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import QRGenerator from './QRGenerator';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

interface QRPreviewModalProps {
  visible: boolean;
  qrText: string;
  onClose: () => void;
  onSave: () => void;
}

const QRPreviewModal: React.FC<QRPreviewModalProps> = ({
  visible,
  qrText,
  onClose,
  onSave,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const qrRef = useRef<any>(null);


  const handleSaveToGallery = async () => {
    Alert.alert('Info', 'QR code saved to history! Use the Share button to save to your device.');
    onSave();
  };

  const handleShare = async () => {
    try {
      if (qrRef.current) {
        qrRef.current.toDataURL(async (dataURL: string) => {
          try {
            // Use directoryPath and encoding from expo-file-system for compatibility
            const fileUri = FileSystem.cacheDirectory! + `qr_${Date.now()}.png`;
            await FileSystem.writeAsStringAsync(
              fileUri,
              dataURL.replace('data:image/png;base64,', ''),
              { encoding: FileSystem.Encoding.Base64 }
            );
            const isAvailable = await Sharing.isAvailableAsync();
            if (isAvailable) {
              await Sharing.shareAsync(fileUri);
            } else {
              Alert.alert('Error', 'Sharing is not available on this device');
            }
          } catch (error) {
            console.error('Share error:', error);
            Alert.alert('Error', 'Failed to share QR code');
          }
        });
      }
    } catch (error) {
      console.error('Share error:', error);
      Alert.alert('Error', 'Failed to share QR code');
    }
  };

  const handleCopyText = () => {
    // You can use Clipboard API here if needed
    Alert.alert('Info', 'Text copied!');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Your QR Code</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={28} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* QR Code Display */}
            <View style={styles.qrContainer}>
              <QRGenerator
                value={qrText}
                size={250}
                getRef={(ref: any) => {
                  qrRef.current = ref;
                }}
              />
            </View>

            {/* Text Display */}
            <View style={styles.textContainer}>
              <Text style={styles.textLabel}>Content:</Text>
              <Text style={styles.textContent}>{qrText}</Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={[styles.actionButton, styles.primaryButton]}
                onPress={handleSaveToGallery}
                disabled={isSaving}>
                <Ionicons name="download" size={24} color="#fff" />
                <Text style={styles.actionButtonText}>
                  {isSaving ? 'Saving...' : 'Save to Gallery'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleShare}>
                <Ionicons name="share-social" size={24} color="#007AFF" />
                <Text style={[styles.actionButtonText, styles.secondaryText]}>
                  Share
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={onSave}>
                <Ionicons name="save" size={24} color="#007AFF" />
                <Text style={[styles.actionButtonText, styles.secondaryText]}>
                  Save to History
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  closeButton: {
    padding: 5,
  },
  scrollContent: {
    padding: 20,
  },
  qrContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  textContainer: {
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  textLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 8,
  },
  textContent: {
    fontSize: 16,
    color: '#000',
    lineHeight: 24,
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#F2F2F7',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  actionButtonText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  secondaryText: {
    color: '#007AFF',
  },
});

export default QRPreviewModal;

