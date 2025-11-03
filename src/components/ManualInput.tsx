import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import {formatQRText} from '../utils/qrDetector';

interface ManualInputProps {
  onSubmit: (text: string) => void;
}

type InputType = 'text' | 'url' | 'email' | 'phone' | 'sms';

const ManualInput: React.FC<ManualInputProps> = ({onSubmit}) => {
  const [text, setText] = useState('');
  const [inputType, setInputType] = useState<InputType>('text');

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
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      Alert.alert('Image Selected', 'For now, please type the text manually. Full OCR coming in next update!');
    }
  };

  const handleDocumentPick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
      });

      if (!result.canceled) {
        Alert.alert('Document Selected', `Selected: ${result.assets[0].name}`);
      }
    } catch (error) {
      console.error('Document picker error:', error);
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

      {/* Generate Button */}
      <TouchableOpacity
        style={[styles.generateButton, !text.trim() && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={!text.trim()}>
        <Ionicons name="qr-code" size={24} color="#fff" />
        <Text style={styles.generateButtonText}>Generate QR Code</Text>
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
});

export default ManualInput;

