import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SignupScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = () => {
    // Simulate signup
    router.back();
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

        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
          <View style={styles.content}>
            <Animated.View entering={FadeInDown.duration(600)} style={styles.logoContainer}>
              <Ionicons name="restaurant" size={64} color="#FF6B6B" />
              <ThemedText type="title" style={styles.title}>
                Créer un compte
              </ThemedText>
              <ThemedText style={styles.subtitle}>
                Inscrivez-vous pour commencer
              </ThemedText>
            </Animated.View>

            <Animated.View entering={FadeInUp.duration(600).delay(200)} style={styles.form}>
              <View style={styles.inputContainer}>
                <Ionicons name="person" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nom complet"
                  placeholderTextColor="#999"
                  value={name}
                  onChangeText={setName}
                />
              </View>

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
                <Ionicons name="call" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Téléphone"
                  placeholderTextColor="#999"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
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

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirmer le mot de passe"
                  placeholderTextColor="#999"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                />
              </View>

              <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
                <ThemedText style={styles.signupButtonText}>S'inscrire</ThemedText>
              </TouchableOpacity>

              <View style={styles.loginContainer}>
                <ThemedText style={styles.loginText}>Déjà un compte? </ThemedText>
                <TouchableOpacity onPress={() => router.push('/login')}>
                  <ThemedText style={styles.loginLink}>Se connecter</ThemedText>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
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
  signupButton: {
    backgroundColor: '#FF6B6B',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  signupButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    fontSize: 14,
    color: '#666',
  },
  loginLink: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '600',
  },
});

