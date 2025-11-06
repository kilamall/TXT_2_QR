import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImageManipulator from 'expo-image-manipulator';
import {formatQRText} from '../utils/qrDetector';
import {uploadFileToCloud, formatFileSize} from '../utils/fileUploadService';

interface ManualInputProps {
  onSubmit: (text: string) => void;
}

type InputType = 'text' | 'url' | 'email' | 'phone' | 'sms';

const ManualInput: React.FC<ManualInputProps> = ({onSubmit}) => {
  const [text, setText] = useState('');
  const [inputType, setInputType] = useState<InputType>('text');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleSubmit = () => {
    if (!text.trim()) {
      Alert.alert('Error', 'Please enter some text');
      return;
    }

    const formattedText = formatQRText(text.trim(), inputType);
    onSubmit(formattedText);
    setText('');
  };

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        // Start OCR processing
        setIsUploading(true);
        setUploadProgress(0);

        try {
          const imageUri = result.assets[0].uri;
          
          // Compress image to under 1MB
          setUploadProgress(20);
          const manipulatedImage = await ImageManipulator.manipulateAsync(
            imageUri,
            [
              {resize: {width: 1200}}, // Max 1200px width
            ],
            {
              compress: 0.7, // 70% quality
              format: ImageManipulator.SaveFormat.JPEG,
            }
          );

          setUploadProgress(30);
          
          // Convert to base64
          const base64 = await FileSystem.readAsStringAsync(manipulatedImage.uri, {
            encoding: 'base64',
          });

          // Check if still too large
          const sizeKB = (base64.length * 0.75) / 1024;
          if (sizeKB > 1000) {
            // Compress more
            const smallerImage = await ImageManipulator.manipulateAsync(
              imageUri,
              [{resize: {width: 800}}],
              {compress: 0.5, format: ImageManipulator.SaveFormat.JPEG}
            );
            const base64Small = await FileSystem.readAsStringAsync(smallerImage.uri, {
              encoding: 'base64',
            });
            setUploadProgress(40);
          }

          setUploadProgress(50);

          // Import OCR function
          const {extractTextFromImage} = require('../utils/cloudOCR');

          // Extract text
          const extractedText = await extractTextFromImage(
            base64,
            (status: string) => {
              console.log('OCR:', status);
              setUploadProgress(70);
            },
          );

          setUploadProgress(100);
          setIsUploading(false);

          if (extractedText && extractedText.trim()) {
            Alert.alert(
              '✅ Text Extracted!',
              `Found: ${extractedText.substring(0, 200)}${extractedText.length > 200 ? '...' : ''}`,
              [
                {
                  text: 'Use This Text',
                  onPress: () => {
                    setText(extractedText);
                    setUploadProgress(0);
                  },
                },
                {
                  text: 'Cancel',
                  style: 'cancel',
                  onPress: () => setUploadProgress(0),
                },
              ]
            );
          } else {
            setUploadProgress(0);
            Alert.alert('No Text Found', 'Could not detect text in the image. Please try another image or type manually.');
          }
        } catch (error: any) {
          setIsUploading(false);
          setUploadProgress(0);
          Alert.alert(
            'OCR Error',
            'Could not extract text. Please type manually.',
            [{text: 'OK'}]
          );
        }
      }
    } catch (error) {
      console.error('Image picker error:', error);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDocumentPick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];
        
        Alert.alert(
          'Upload File to Cloud?',
          `File: ${file.name}\nSize: ${formatFileSize(file.size || 0)}\n\nThis will upload to cloud storage and create a QR code with the download link.`,
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Upload & Create QR',
              onPress: () => uploadAndCreateQR(file.uri, file.name),
            },
          ]
        );
      }
    } catch (error) {
      console.error('Document picker error:', error);
    }
  };

  const uploadAndCreateQR = async (fileUri: string, fileName: string) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const result = await uploadFileToCloud(fileUri, fileName, (progress) => {
        setUploadProgress(Math.round(progress));
      });

      setIsUploading(false);
      setUploadProgress(0);

      // Create QR code with the download URL
      Alert.alert(
        '✅ Upload Complete!',
        `File uploaded successfully!\n\nCreating QR code with download link...`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Submit the download URL as the QR code content
              onSubmit(result.downloadURL);
            },
          },
        ]
      );
    } catch (error: any) {
      setIsUploading(false);
      setUploadProgress(0);
      Alert.alert(
        'Upload Failed',
        error.message || 'Could not upload file. Please check your Firebase configuration.',
        [{text: 'OK'}]
      );
    }
  };

  const inputTypes: {type: InputType; icon: string; label: string}[] = [
    {type: 'text', icon: 'text', label: 'Text'},
    {type: 'url', icon: 'link', label: 'URL'},
    {type: 'email', icon: 'mail', label: 'Email'},
    {type: 'phone', icon: 'call', label: 'Phone'},
    {type: 'sms', icon: 'chatbubble', label: 'SMS'},
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create QR Code</Text>

      {/* Input Type Selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.typeSelector}>
        {inputTypes.map(item => (
          <TouchableOpacity
            key={item.type}
            style={[
              styles.typeButton,
              inputType === item.type && styles.typeButtonActive,
            ]}
            onPress={() => setInputType(item.type)}>
            <Ionicons
              name={item.icon as any}
              size={20}
              color={inputType === item.type ? '#fff' : '#007AFF'}
            />
            <Text
              style={[
                styles.typeButtonText,
                inputType === item.type && styles.typeButtonTextActive,
              ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Text Input */}
      <TextInput
        style={styles.input}
        placeholder={`Enter ${inputType}...`}
        value={text}
        onChangeText={setText}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        autoCapitalize={inputType === 'email' ? 'none' : 'sentences'}
        keyboardType={
          inputType === 'email'
            ? 'email-address'
            : inputType === 'phone'
            ? 'phone-pad'
            : inputType === 'url'
            ? 'url'
            : 'default'
        }
      />

      {/* Action Buttons */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleImagePick}>
          <Ionicons name="image-outline" size={24} color="#007AFF" />
          <Text style={styles.actionText}>Image</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleDocumentPick}>
          <Ionicons name="document-outline" size={24} color="#007AFF" />
          <Text style={styles.actionText}>File</Text>
        </TouchableOpacity>
      </View>

      {/* Upload Progress */}
      {isUploading && (
        <View style={styles.uploadingContainer}>
          <ActivityIndicator size="small" color="#007AFF" />
          <Text style={styles.uploadingText}>Uploading file...</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, {width: `${uploadProgress}%`}]} />
          </View>
          <Text style={styles.progressText}>{uploadProgress}%</Text>
        </View>
      )}

      {/* Generate Button */}
      <TouchableOpacity
        style={[styles.generateButton, (!text.trim() || isUploading) && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={!text.trim() || isUploading}>
        <Ionicons name="qr-code" size={24} color="#fff" />
        <Text style={styles.generateButtonText}>
          {isUploading ? 'Uploading...' : 'Generate QR Code'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  typeSelector: {
    marginBottom: 15,
    flexGrow: 0,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  typeButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  typeButtonText: {
    marginLeft: 5,
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 14,
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
    minHeight: 100,
    marginBottom: 15,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  actionButton: {
    alignItems: 'center',
    padding: 10,
  },
  actionText: {
    marginTop: 5,
    color: '#007AFF',
    fontSize: 12,
  },
  generateButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    gap: 10,
  },
  buttonDisabled: {
    backgroundColor: '#C7C7CC',
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  uploadingContainer: {
    backgroundColor: '#F9F9F9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  uploadingText: {
    marginTop: 10,
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#E5E5EA',
    borderRadius: 3,
    marginTop: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 3,
  },
  progressText: {
    marginTop: 5,
    fontSize: 12,
    color: '#8E8E93',
  },
});

export default ManualInput;

