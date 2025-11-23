import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Mock user profile
const MOCK_USER = {
  email: 'miss.lqehba@example.com',
  password: 'password123',
  name: 'Miss Lqehba',
  city: 'Bejaia',
  phone: '+213 555 123 789',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
};

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = () => {
    setError('');
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    
    // Check if it's the mock user
    if (email.toLowerCase() === MOCK_USER.email.toLowerCase() && password === MOCK_USER.password) {
      // Store user data (in a real app, this would be done with AsyncStorage or context)
      // For now, we'll use a simple approach
      router.back();
    } else {
      setError('Email ou mot de passe incorrect');
    }
  };

  const handleQuickLogin = () => {
    setEmail(MOCK_USER.email);
    setPassword(MOCK_USER.password);
    setError('');
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Animated.View entering={FadeInDown.duration(600)} style={styles.logoContainer}>
            <Ionicons name="restaurant" size={64} color="#FF6B6B" />
            <ThemedText type="title" style={styles.title}>
              rkhis eat
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Connectez-vous pour continuer
            </ThemedText>
          </Animated.View>

          <Animated.View entering={FadeInUp.duration(600).delay(200)} style={styles.form}>
            <View style={styles.inputContainer}>
              <Ionicons name="mail" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}>
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color="#999"
                />
              </TouchableOpacity>
            </View>

            {error && (
              <Animated.View entering={FadeInDown.duration(300)} style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={20} color="#FF6B6B" />
                <ThemedText style={styles.errorText}>{error}</ThemedText>
              </Animated.View>
            )}

            <TouchableOpacity style={styles.forgotPassword}>
              <ThemedText style={styles.forgotPasswordText}>
                Mot de passe oublié?
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <ThemedText style={styles.loginButtonText}>Se connecter</ThemedText>
            </TouchableOpacity>

            {/* Quick Login for Mock User */}
            <TouchableOpacity style={styles.quickLoginButton} onPress={handleQuickLogin}>
              <Ionicons name="flash" size={18} color="#FF6B6B" />
              <ThemedText style={styles.quickLoginText}>
                Connexion rapide (Miss Lqehba)
              </ThemedText>
            </TouchableOpacity>

            <View style={styles.signupContainer}>
              <ThemedText style={styles.signupText}>Pas encore de compte? </ThemedText>
              <TouchableOpacity onPress={() => router.push('/signup')}>
                <ThemedText style={styles.signupLink}>S'inscrire</ThemedText>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  eyeButton: {
    padding: 4,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#FF6B6B',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signupText: {
    fontSize: 14,
    color: '#666',
  },
  signupLink: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  quickLoginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF5F5',
    padding: 14,
    borderRadius: 12,
    marginTop: 12,
    gap: 8,
  },
  quickLoginText: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '600',
  },
});

