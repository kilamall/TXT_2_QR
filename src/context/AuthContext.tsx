import React, {createContext, useContext, useEffect, useMemo, useState} from 'react';
import {Alert, Platform} from 'react-native';

type FirebaseAuthModule = typeof import('firebase/auth');
type FirebaseAuthInstance = import('firebase/auth').Auth;
type FirebaseUser = import('firebase/auth').User;

let firebaseAuthModule: FirebaseAuthModule | null = null;
let firebaseApp: import('firebase/app').FirebaseApp | null = null;

const ensureFirebaseAuthModule = () => {
  if (Platform.OS !== 'web') {
    return null;
  }

  if (!firebaseAuthModule) {
    firebaseAuthModule = require('firebase/auth');
  }

  if (!firebaseApp) {
    const firebaseModule = require('../config/firebase');
    firebaseApp =
      (typeof firebaseModule.getFirebaseApp === 'function'
        ? firebaseModule.getFirebaseApp()
        : null) || firebaseModule.default || null;
  }

  return firebaseAuthModule;
};

interface AuthContextType {
  user: FirebaseUser | null;
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
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const auth = useMemo<FirebaseAuthInstance | null>(() => {
    const module = ensureFirebaseAuthModule();
    if (!module || !firebaseApp) {
      return null;
    }
    return module.getAuth(firebaseApp);
  }, []);

  useEffect(() => {
    if (!auth) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = firebaseAuthModule!.onAuthStateChanged(
      auth,
      currentUser => {
        setUser(currentUser);
        setIsLoading(false);
      },
      error => {
        console.error('Auth state error:', error);
        setIsLoading(false);
      },
    );

    return unsubscribe;
  }, [auth]);

  const signIn = async (email: string, password: string) => {
    if (!auth) {
      Alert.alert('Not Available', 'Authentication is only available on web');
      return;
    }

    try {
      setIsLoading(true);
      await firebaseAuthModule!.signInWithEmailAndPassword(auth, email, password);
      Alert.alert('✅ Success!', 'Signed in successfully!');
    } catch (error: any) {
      Alert.alert('Sign In Failed', error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    if (!auth) {
      Alert.alert('Not Available', 'Authentication is only available on web');
      return;
    }

    try {
      setIsLoading(true);
      await firebaseAuthModule!.createUserWithEmailAndPassword(auth, email, password);
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
      if (Platform.OS === 'web' && auth) {
        setIsLoading(true);
        const provider = new firebaseAuthModule!.GoogleAuthProvider();
        await firebaseAuthModule!.signInWithPopup(auth, provider);
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
    if (!auth) {
      return;
    }

    try {
      await firebaseAuthModule!.signOut(auth);
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

