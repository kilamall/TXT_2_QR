import React, {createContext, useContext, useState, useEffect} from 'react';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {Alert, Platform} from 'react-native';
import app from '../config/firebase';

// Conditionally import popup methods for web only
let GoogleAuthProvider: any;
let signInWithPopup: any;
if (Platform.OS === 'web') {
  const auth = require('firebase/auth');
  GoogleAuthProvider = auth.GoogleAuthProvider;
  signInWithPopup = auth.signInWithPopup;
}

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('✅ Success!', 'Signed in successfully!');
    } catch (error: any) {
      Alert.alert('Sign In Failed', error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert('✅ Success!', 'Account created! You are now signed in.');
    } catch (error: any) {
      Alert.alert('Sign Up Failed', error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      if (Platform.OS === 'web') {
        setIsLoading(true);
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        Alert.alert('✅ Success!', 'Signed in with Google!');
      } else {
        Alert.alert('Info', 'Google sign-in available on web version');
      }
    } catch (error: any) {
      Alert.alert('Google Sign In Failed', error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      Alert.alert('Signed Out', 'You have been signed out');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signUp,
        signInWithGoogle,
        logout,
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

