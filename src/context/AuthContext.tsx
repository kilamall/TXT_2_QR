import React, {createContext, useContext, useState, useEffect} from 'react';
import {Alert, Platform} from 'react-native';

// Conditionally import Firebase auth for web only
let getAuth: any,
  signInWithEmailAndPassword: any,
  createUserWithEmailAndPassword: any,
  signOut: any,
  onAuthStateChanged: any,
  GoogleAuthProvider: any,
  signInWithPopup: any,
  User: any,
  app: any;

if (Platform.OS === 'web') {
  const auth = require('firebase/auth');
  getAuth = auth.getAuth;
  signInWithEmailAndPassword = auth.signInWithEmailAndPassword;
  createUserWithEmailAndPassword = auth.createUserWithEmailAndPassword;
  signOut = auth.signOut;
  onAuthStateChanged = auth.onAuthStateChanged;
  GoogleAuthProvider = auth.GoogleAuthProvider;
  signInWithPopup = auth.signInWithPopup;
  User = auth.User;
  app = require('../config/firebase').default;
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
  
  // Lazy initialize auth on web only
  const getAuthInstance = () => {
    if (Platform.OS !== 'web' || !app) {
      return null;
    }
    return getAuth(app);
  };
  
  const auth = getAuthInstance();

  useEffect(() => {
    if (!auth) {
      setIsLoading(false);
      return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });

    return unsubscribe;
  }, [auth]);

  const signIn = async (email: string, password: string) => {
    if (!auth) {
      Alert.alert('Not Available', 'Authentication is only available on web');
      return;
    }
    
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
    if (!auth) {
      Alert.alert('Not Available', 'Authentication is only available on web');
      return;
    }
    
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
      if (Platform.OS === 'web' && auth) {
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
    if (!auth) {
      return;
    }
    
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

