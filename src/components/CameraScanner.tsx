import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {CameraView, useCameraPermissions} from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import {recognizeTextWithProgress} from '../utils/ocrService';

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
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const cameraRef = useRef<any>(null);

  const processImage = async (imageUri: string) => {
    setIsProcessing(true);
    setOcrProgress(0);

    try {
      const text = await recognizeTextWithProgress(imageUri, (progress) => {
        setOcrProgress(Math.round(progress * 100));
      });

      if (text && text.trim().length > 0) {
        Alert.alert(
          'Text Detected!',
          `Found: ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}`,
          [
            {
              text: 'Use This Text',
              onPress: () => {
                onTextDetected(text);
                setIsProcessing(false);
              },
            },
            {
              text: 'Try Again',
              onPress: () => setIsProcessing(false),
              style: 'cancel',
            },
          ]
        );
      } else {
        Alert.alert(
          'No Text Found',
          'Could not detect any text in the image. Try again with better lighting or clearer text.',
          [{text: 'OK', onPress: () => setIsProcessing(false)}]
        );
      }
    } catch (error) {
      Alert.alert(
        'OCR Error',
        'Failed to process image. Please try again.',
        [{text: 'OK', onPress: () => setIsProcessing(false)}]
      );
    }
  };

  const handleTakePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setShowCamera(false);
        await processImage(photo.uri);
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
      await processImage(result.assets[0].uri);
    }
  };

  const handleManualInput = () => {
    onClose();
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
              We need camera access to scan text from images using OCR
            </Text>
            
            <TouchableOpacity style={styles.button} onPress={requestPermission}>
              <Text style={styles.buttonText}>Grant Permission</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.secondaryButton} onPress={handleManualInput}>
              <Text style={styles.secondaryButtonText}>Or Enter Text Manually</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // Processing screen
  if (isProcessing) {
    return (
      <View style={styles.container}>
        <View style={styles.overlay}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={30} color="#000" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.title}>Processing Image...</Text>
            <Text style={styles.subtitle}>
              Using OCR to extract text
            </Text>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    {width: `${ocrProgress}%`}
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>{ocrProgress}%</Text>
            </View>

            <Text style={styles.processingTip}>
              This may take 10-30 seconds...
            </Text>
          </View>
        </View>
      </View>
    );
  }

  // Menu screen (choose camera or gallery)
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
            <Text style={styles.title}>Scan Text with OCR</Text>
            <Text style={styles.subtitle}>
              Choose how you'd like to capture text
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
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>Choose from Gallery</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.tertiaryButton]} 
              onPress={handleManualInput}>
              <Ionicons name="create" size={24} color="#8E8E93" />
              <Text style={[styles.buttonText, styles.tertiaryButtonText]}>Enter Manually Instead</Text>
            </TouchableOpacity>

            <View style={styles.tipBox}>
              <Ionicons name="information-circle" size={20} color="#007AFF" />
              <Text style={styles.tipText}>
                Works best with clear, well-lit images of printed text
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
      <CameraView style={StyleSheet.absoluteFill} ref={cameraRef} facing="back">
        <View style={styles.overlay}>
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
      </CameraView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
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
    backgroundColor: '#E5F1FF',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  tipText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    color: '#007AFF',
    lineHeight: 18,
  },
  progressContainer: {
    width: '100%',
    marginTop: 30,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E5EA',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginTop: 10,
  },
  processingTip: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 15,
    textAlign: 'center',
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
});

export default CameraScanner;
