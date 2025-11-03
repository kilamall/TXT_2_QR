import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {CameraView, useCameraPermissions} from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

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
  const cameraRef = useRef<any>(null);

  const handleTakePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        // For now, we'll let user type the text from the photo
        Alert.alert(
          'Photo Captured!',
          'For now, please type the text you see. Full OCR coming soon!',
          [
            {text: 'OK', onPress: onClose}
          ]
        );
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

    if (!result.canceled) {
      Alert.alert(
        'Image Selected!',
        'For now, please type the text you see. Full OCR coming soon!',
        [
          {text: 'OK', onPress: onClose}
        ]
      );
    }
  };

  const handleManualInput = () => {
    Alert.prompt(
      'Enter Text',
      'Type or paste the text you want to convert to QR:',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Create QR',
          onPress: (text) => {
            if (text && text.trim()) {
              onTextDetected(text.trim());
            }
          }
        }
      ],
      'plain-text'
    );
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
              We need camera access to scan text from images
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
            <Text style={styles.title}>Scan Text</Text>
            <Text style={styles.subtitle}>
              Choose how you'd like to add text
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
              style={[styles.button, styles.secondaryButton]} 
              onPress={handleManualInput}>
              <Ionicons name="create" size={24} color="#007AFF" />
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>Enter Manually</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

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

          <View style={styles.bottomControls}>
            <Text style={styles.instructions}>
              Position text in the frame
            </Text>
            <TouchableOpacity 
              style={styles.captureButton} 
              onPress={handleTakePicture}>
              <View style={styles.captureButtonInner} />
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
    backgroundColor: 'rgba(0,0,0,0.3)',
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
  bottomControls: {
    alignItems: 'center',
    paddingBottom: 50,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingTop: 20,
  },
  instructions: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
});

export default CameraScanner;
