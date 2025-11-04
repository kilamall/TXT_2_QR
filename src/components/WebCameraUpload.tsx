import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  Platform,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system/legacy';
import {extractTextFromImage} from '../utils/cloudOCR';

interface WebCameraUploadProps {
  onTextDetected: (text: string) => void;
  onClose: () => void;
}

const WebCameraUpload: React.FC<WebCameraUploadProps> = ({
  onTextDetected,
  onClose,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrStatus, setOcrStatus] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleCameraCapture = async () => {
    try {
      // Request camera permission
      const {status} = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera permission is needed to take photos');
        return;
      }

      // Take photo
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 0.8,
        allowsEditing: false,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        await processWithOCR(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to access camera. Try uploading an image instead.');
    }
  };

  const handleFileUpload = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        await processWithOCR(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select image');
    }
  };

  const processWithOCR = async (imageUri: string) => {
    setIsProcessing(true);
    setOcrStatus('Preparing image...');

    try {
      // Compress image
      setOcrStatus('Compressing image...');
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        imageUri,
        [{resize: {width: 1200}}],
        {compress: 0.7, format: ImageManipulator.SaveFormat.JPEG}
      );

      // Convert to base64
      const base64 = await FileSystem.readAsStringAsync(manipulatedImage.uri, {
        encoding: 'base64',
      });

      // Check size and compress more if needed
      const sizeKB = (base64.length * 0.75) / 1024;
      let finalBase64 = base64;
      
      if (sizeKB > 1000) {
        setOcrStatus('Image too large, compressing more...');
        const smallerImage = await ImageManipulator.manipulateAsync(
          imageUri,
          [{resize: {width: 800}}],
          {compress: 0.5, format: ImageManipulator.SaveFormat.JPEG}
        );
        finalBase64 = await FileSystem.readAsStringAsync(smallerImage.uri, {
          encoding: 'base64',
        });
      }

      // Extract text
      setOcrStatus('Extracting text with AI...');
      const text = await extractTextFromImage(finalBase64, (status) => {
        setOcrStatus(status);
      });

      setIsProcessing(false);

      Alert.alert(
        '✅ Text Extracted!',
        `Found: ${text.substring(0, 200)}${text.length > 200 ? '...' : ''}`,
        [
          {
            text: 'Use This',
            onPress: () => onTextDetected(text),
          },
          {
            text: 'Try Again',
            style: 'cancel',
            onPress: () => {
              setSelectedImage(null);
              setOcrStatus('');
            },
          },
        ]
      );
    } catch (error: any) {
      setIsProcessing(false);
      Alert.alert(
        'OCR Failed',
        error.message || 'Could not extract text from image',
        [
          {
            text: 'Try Another Image',
            onPress: () => setSelectedImage(null),
          },
          {
            text: 'Cancel',
            onPress: onClose,
          },
        ]
      );
    }
  };

  if (isProcessing) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.title}>Processing Image...</Text>
          <Text style={styles.status}>{ocrStatus}</Text>
          
          {selectedImage && (
            <Image source={{uri: selectedImage}} style={styles.preview} />
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Scan Text</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Ionicons name="scan" size={80} color="#007AFF" />
        <Text style={styles.subtitle}>
          {Platform.OS === 'web'
            ? 'Upload an image to extract text'
            : 'Capture or upload an image'}
        </Text>

        {Platform.OS === 'web' && (
          <TouchableOpacity style={styles.button} onPress={handleFileUpload}>
            <Ionicons name="cloud-upload" size={24} color="#fff" />
            <Text style={styles.buttonText}>Upload Image</Text>
          </TouchableOpacity>
        )}

        {Platform.OS !== 'web' && (
          <>
            <TouchableOpacity style={styles.button} onPress={handleCameraCapture}>
              <Ionicons name="camera" size={24} color="#fff" />
              <Text style={styles.buttonText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={handleFileUpload}>
              <Ionicons name="images" size={24} color="#007AFF" />
              <Text style={[styles.buttonText, styles.secondaryText]}>
                Choose from Gallery
              </Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity
          style={[styles.button, styles.tertiaryButton]}
          onPress={onClose}>
          <Ionicons name="create" size={24} color="#8E8E93" />
          <Text style={[styles.buttonText, styles.tertiaryText]}>
            Type Manually Instead
          </Text>
        </TouchableOpacity>

        <View style={styles.tip}>
          <Ionicons name="bulb" size={20} color="#FF9500" />
          <Text style={styles.tipText}>
            {Platform.OS === 'web'
              ? 'Upload images with clear, printed text for best OCR results'
              : 'Use good lighting and clear text for best results'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  closeButton: {
    padding: 5,
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
    color: '#000',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 15,
    marginBottom: 30,
    textAlign: 'center',
  },
  status: {
    fontSize: 16,
    color: '#007AFF',
    marginTop: 15,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 12,
    width: '100%',
    maxWidth: 400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  secondaryButton: {
    backgroundColor: '#F2F2F7',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  secondaryText: {
    color: '#007AFF',
  },
  tertiaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  tertiaryText: {
    color: '#8E8E93',
  },
  preview: {
    width: 200,
    height: 150,
    borderRadius: 10,
    marginTop: 20,
    resizeMode: 'contain',
  },
  tip: {
    flexDirection: 'row',
    backgroundColor: '#FFF9E6',
    padding: 12,
    borderRadius: 8,
    marginTop: 30,
    alignItems: 'center',
    maxWidth: 400,
  },
  tipText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    color: '#856404',
  },
});

export default WebCameraUpload;

