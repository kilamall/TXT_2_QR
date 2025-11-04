import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {CameraView, useCameraPermissions} from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import {extractTextFromImage} from '../utils/cloudOCR';

interface CameraScannerProps {
  onTextDetected: (text: string) => void;
  onClose: () => void;
}

const {width, height} = Dimensions.get('window');

const CameraScanner: React.FC<CameraScannerProps> = ({
  onTextDetected,
  onClose,
}) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrStatus, setOcrStatus] = useState('');
  const [useManualEntry, setUseManualEntry] = useState(false);
  const cameraRef = useRef<any>(null);

  const processWithOCR = async (imageUri: string) => {
    setIsProcessing(true);
    setOcrStatus('Converting image...');

    try {
      // Convert image to base64
      let base64;
      try {
        base64 = await FileSystem.readAsStringAsync(imageUri, {
          encoding: 'base64',
        });
        
        if (!base64) {
          throw new Error('Image conversion failed - no data');
        }

        setOcrStatus('Image converted, uploading...');
      } catch (error) {
        console.error('Failed to read image:', error);
        // Fall back to manual entry
        setIsProcessing(false);
        setUseManualEntry(true);
        return;
      }

      // Extract text using cloud OCR
      setOcrStatus('Analyzing image with AI...');
      const text = await extractTextFromImage(base64, (status) => {
        setOcrStatus(status);
      });

      setIsProcessing(false);
      setExtractedText(text);

      Alert.alert(
        '✅ Text Extracted!',
        `Found: ${text.substring(0, 150)}${text.length > 150 ? '...' : ''}`,
        [
          {
            text: 'Use This',
            onPress: () => onTextDetected(text),
          },
          {
            text: 'Edit First',
            onPress: () => {
              // Show manual editing view
              setUseManualEntry(true);
            },
          },
          {
            text: 'Try Again',
            style: 'cancel',
            onPress: () => {
              setCapturedImage(null);
              setExtractedText('');
            },
          },
        ]
      );
    } catch (error: any) {
      setIsProcessing(false);
      Alert.alert(
        'OCR Failed',
        error.message || 'Could not extract text. Would you like to enter it manually?',
        [
          {
            text: 'Enter Manually',
            onPress: () => setUseManualEntry(true),
          },
          {
            text: 'Try Another Image',
            onPress: () => {
              setCapturedImage(null);
              setExtractedText('');
            },
          },
        ]
      );
    }
  };

  const handleTakePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setShowCamera(false);
        setCapturedImage(photo.uri);
        
        // Automatically start OCR
        await processWithOCR(photo.uri);
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setCapturedImage(result.assets[0].uri);
      
      // Automatically start OCR
      await processWithOCR(result.assets[0].uri);
    }
  };

  const handleSubmitText = () => {
    if (extractedText.trim()) {
      onTextDetected(extractedText.trim());
      setCapturedImage(null);
      setExtractedText('');
    } else {
      Alert.alert('Error', 'Please enter the text from the image');
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setExtractedText('');
  };

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.overlay}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={30} color="#000" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Ionicons name="camera-outline" size={80} color="#007AFF" />
            <Text style={styles.title}>Camera Permission Required</Text>
            <Text style={styles.subtitle}>
              We need camera access to capture text from images
            </Text>
            
            <TouchableOpacity style={styles.button} onPress={requestPermission}>
              <Text style={styles.buttonText}>Grant Permission</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.secondaryButton} onPress={onClose}>
              <Text style={styles.secondaryButtonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // Processing OCR view
  if (isProcessing) {
    return (
      <View style={styles.container}>
        <View style={styles.overlay}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Processing Image</Text>
          </View>

          <View style={styles.content}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.title}>Extracting Text...</Text>
            <Text style={styles.subtitle}>{ocrStatus}</Text>
            
            {capturedImage && (
              <Image source={{uri: capturedImage}} style={styles.previewImage} />
            )}

            <Text style={styles.processingTip}>
              Using AI to read text from your image...
            </Text>
          </View>
        </View>
      </View>
    );
  }

  // Manual text entry view (if OCR fails or user wants to edit)
  if (capturedImage && useManualEntry) {
    return (
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.overlay}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={handleRetake}>
              <Ionicons name="arrow-back" size={30} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Extract Text</Text>
            <View style={{width: 44}} />
          </View>

          <View style={styles.extractContent}>
            {/* Image Preview */}
            <View style={styles.imageContainer}>
              <Image source={{uri: capturedImage}} style={styles.image} />
            </View>

            {/* Text Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                📝 Type the text you see in the image:
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter text from image..."
                value={extractedText}
                onChangeText={setExtractedText}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                autoFocus
              />
              
              <Text style={styles.hint}>
                💡 Tip: Type carefully - this will be used to generate your QR code
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.button, !extractedText.trim() && styles.buttonDisabled]}
                onPress={handleSubmitText}
                disabled={!extractedText.trim()}>
                <Ionicons name="checkmark-circle" size={24} color="#fff" />
                <Text style={styles.buttonText}>Generate QR Code</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.button, styles.secondaryButton]}
                onPress={handleRetake}>
                <Ionicons name="camera" size={24} color="#007AFF" />
                <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                  Take Another Photo
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }

  // Menu screen
  if (!showCamera) {
    return (
      <View style={styles.container}>
        <View style={styles.overlay}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={30} color="#000" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Ionicons name="scan" size={80} color="#007AFF" />
            <Text style={styles.title}>Scan Text from Image</Text>
            <Text style={styles.subtitle}>
              Capture or select an image with text
            </Text>
            
            <TouchableOpacity 
              style={styles.button} 
              onPress={() => setShowCamera(true)}>
              <Ionicons name="camera" size={24} color="#fff" />
              <Text style={styles.buttonText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.secondaryButton]} 
              onPress={handlePickImage}>
              <Ionicons name="images" size={24} color="#007AFF" />
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                Choose from Gallery
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.tertiaryButton]} 
              onPress={onClose}>
              <Ionicons name="create" size={24} color="#8E8E93" />
              <Text style={[styles.buttonText, styles.tertiaryButtonText]}>
                Type Manually Instead
              </Text>
            </TouchableOpacity>

            <View style={styles.tipBox}>
              <Ionicons name="bulb" size={20} color="#FF9500" />
              <Text style={styles.tipText}>
                Works great with signs, documents, business cards, receipts, etc.
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  // Camera view
  return (
    <View style={styles.container}>
      <CameraView style={StyleSheet.absoluteFill} ref={cameraRef} facing="back" />
      
      {/* Overlay on top of camera */}
      <View style={styles.cameraOverlay}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={() => setShowCamera(false)}>
            <Ionicons name="arrow-back" size={30} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.scanFrame}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>

        <View style={styles.bottomControls}>
          <Text style={styles.instructions}>
            Position text clearly in the frame
          </Text>
          <Text style={styles.subInstructions}>
            Make sure text is visible and well-lit
          </Text>
          <TouchableOpacity 
            style={styles.captureButton} 
            onPress={handleTakePicture}>
            <View style={styles.captureButtonInner}>
              <Ionicons name="camera" size={40} color="#007AFF" />
            </View>
          </TouchableOpacity>
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
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cameraOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    pointerEvents: 'box-none',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  extractContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  imageContainer: {
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    backgroundColor: '#fff',
  },
  inputContainer: {
    flex: 1,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
  },
  textInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    minHeight: 150,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  hint: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 10,
    fontStyle: 'italic',
  },
  actionButtons: {
    gap: 10,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 15,
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 15,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  buttonDisabled: {
    backgroundColor: '#C7C7CC',
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
  secondaryButtonText: {
    color: '#007AFF',
  },
  tertiaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  tertiaryButtonText: {
    color: '#8E8E93',
  },
  tipBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF9E6',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFE5B4',
  },
  tipText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    color: '#856404',
    lineHeight: 18,
  },
  scanFrame: {
    width: width * 0.8,
    height: height * 0.4,
    alignSelf: 'center',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 50,
    height: 50,
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
  bottomControls: {
    alignItems: 'center',
    paddingBottom: 50,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  instructions: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 5,
  },
  subInstructions: {
    color: '#E5E5EA',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  captureButtonInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: 200,
    height: 150,
    borderRadius: 10,
    marginTop: 20,
    resizeMode: 'contain',
    backgroundColor: '#f5f5f5',
  },
  processingTip: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 15,
    textAlign: 'center',
  },
});

export default CameraScanner;
