import { initializeApp, FirebaseApp } from 'firebase/app';

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

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

// Initialize Cloud Storage (lazy load for web compatibility)
let storage: any;
export const getFirebaseStorage = () => {
  if (!storage) {
    const { getStorage } = require('firebase/storage');
    storage = getStorage(app);
  }
  return storage;
};

export { storage };

export default app;

