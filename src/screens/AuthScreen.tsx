import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import {useAuth} from '../context/AuthContext';

const AuthScreen = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const {signIn, signUp, signInWithGoogle, isLoading} = useAuth();

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      return;
    }

    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
    } catch (error) {
      // Error already shown in auth context
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      // Error already shown
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Ionicons name="qr-code" size={80} color="#007AFF" />
            <Text style={styles.title}>TXT 2 QR</Text>
            <Text style={styles.subtitle}>
              {isSignUp ? 'Create your account' : 'Welcome back!'}
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#8E8E93" />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#8E8E93" />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            {isSignUp && (
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#8E8E93"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>
            )}

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>
                  {isSignUp ? 'Sign Up' : 'Sign In'}
                </Text>
              )}
            </TouchableOpacity>

            {/* Google Sign In (Web only) */}
            {Platform.OS === 'web' && (
              <TouchableOpacity
                style={styles.googleButton}
                onPress={handleGoogleSignIn}
                disabled={isLoading}>
                <Ionicons name="logo-google" size={20} color="#fff" />
                <Text style={styles.googleButtonText}>
                  Continue with Google
                </Text>
              </TouchableOpacity>
            )}

            {/* Toggle Sign Up/Sign In */}
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => setIsSignUp(!isSignUp)}>
              <Text style={styles.toggleText}>
                {isSignUp
                  ? 'Already have an account? Sign In'
                  : "Don't have an account? Sign Up"}
              </Text>
            </TouchableOpacity>

            {/* Skip for now */}
            <TouchableOpacity
              style={styles.skipButton}
              onPress={() => {
                // This would be handled by navigation
              }}>
              <Text style={styles.skipText}>
                Continue without signing in
              </Text>
            </TouchableOpacity>
          </View>

          {/* Benefits */}
          <View style={styles.benefits}>
            <Text style={styles.benefitsTitle}>
              Why sign in?
            </Text>
            <View style={styles.benefitItem}>
              <Ionicons name="cloud-outline" size={20} color="#007AFF" />
              <Text style={styles.benefitText}>
                Sync your QR codes across devices
              </Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#007AFF" />
              <Text style={styles.benefitText}>
                Secure cloud backup
              </Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="star-outline" size={20} color="#007AFF" />
              <Text style={styles.benefitText}>
                Premium features and benefits
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 10,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#000',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: '#DB4437',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    gap: 10,
  },
  googleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  toggleButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  toggleText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  skipButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  skipText: {
    color: '#8E8E93',
    fontSize: 14,
  },
  benefits: {
    marginTop: 40,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 15,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitText: {
    marginLeft: 15,
    fontSize: 14,
    color: '#000',
  },
});

export default AuthScreen;

