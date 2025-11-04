import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';
import * as FileSystem from 'expo-file-system/legacy';

export interface UploadResult {
  downloadURL: string;
  fileName: string;
  fileSize: number;
  uploadedAt: Date;
}

/**
 * Upload file to Firebase Storage and get shareable link
 */
export const uploadFileToCloud = async (
  fileUri: string,
  fileName: string,
  onProgress?: (progress: number) => void
): Promise<UploadResult> => {
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

