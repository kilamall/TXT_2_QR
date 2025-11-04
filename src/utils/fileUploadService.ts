import {Platform} from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';

// Conditionally import Firebase Storage for web only
let ref: any, uploadBytes: any, getDownloadURL: any, storage: any;
if (Platform.OS === 'web') {
  const firebaseStorage = require('firebase/storage');
  ref = firebaseStorage.ref;
  uploadBytes = firebaseStorage.uploadBytes;
  getDownloadURL = firebaseStorage.getDownloadURL;
  const firebaseConfig = require('../config/firebase');
  storage = firebaseConfig.storage;
}

export interface UploadResult {
  downloadURL: string;
  fileName: string;
  fileSize: number;
  uploadedAt: Date;
}

/**
 * Upload file to Firebase Storage and get shareable link
 * Note: Only available on web platform
 */
export const uploadFileToCloud = async (
  fileUri: string,
  fileName: string,
  onProgress?: (progress: number) => void
): Promise<UploadResult> => {
  if (Platform.OS !== 'web') {
    throw new Error('File upload to cloud is only available on web platform');
  }

  try {
    onProgress?.(0);

    // Read file as blob
    const response = await fetch(fileUri);
    const blob = await response.blob();
    
    onProgress?.(30);

    // Create unique filename
    const timestamp = Date.now();
    const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `uploads/${timestamp}_${cleanFileName}`;

    // Create storage reference
    const storageRef = ref(storage, storagePath);

    onProgress?.(50);

    // Upload file
    await uploadBytes(storageRef, blob);

    onProgress?.(80);

    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);

    onProgress?.(100);

    return {
      downloadURL,
      fileName: cleanFileName,
      fileSize: blob.size,
      uploadedAt: new Date(),
    };
  } catch (error: any) {
    console.error('Upload error:', error);
    throw new Error(error.message || 'Failed to upload file');
  }
};

/**
 * Get file info from URI
 */
export const getFileInfo = async (fileUri: string) => {
  try {
    const info = await FileSystem.getInfoAsync(fileUri);
    return info;
  } catch (error) {
    console.error('Error getting file info:', error);
    return null;
  }
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

