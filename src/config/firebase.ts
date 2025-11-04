import {Platform} from 'react-native';

// Firebase configuration
// TODO: Replace with your Firebase project credentials
// Get these from: https://console.firebase.google.com/
const firebaseConfig = {
  apiKey: "AIzaSyDEMO_KEY_REPLACE_WITH_YOUR_KEY",
  authDomain: "txt2qr-demo.firebaseapp.com",
  projectId: "txt2qr-demo",
  storageBucket: "txt2qr-demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase (lazy load to avoid bundling issues on mobile)
let app: any = null;
let storage: any = null;

const initializeFirebase = () => {
  if (!app) {
    const { initializeApp } = require('firebase/app');
    app = initializeApp(firebaseConfig);
  }
  return app;
};

export const getFirebaseApp = () => {
  return initializeFirebase();
};

export const getFirebaseStorage = () => {
  if (!storage) {
    const firebaseApp = initializeFirebase();
    const { getStorage } = require('firebase/storage');
    storage = getStorage(firebaseApp);
  }
  return storage;
};

// For backwards compatibility
export { storage };

export default Platform.OS === 'web' ? initializeFirebase() : null;

