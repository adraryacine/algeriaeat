import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSession } from '@/providers/session-provider';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const styles = useMemo(() => createStyles(palette), [palette]);
  const { signInWithEmail } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);
    const { error: authError } = await signInWithEmail(email, password);
    setIsLoading(false);

    if (authError) {
      setError(authError.message || 'Email ou mot de passe incorrect');
    } else {
      router.replace('/(tabs)/profile');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <LinearGradient
        colors={[
          palette.gradientPrimary[0],
          palette.gradientPrimary[1],
          palette.gradientPrimary[2] ?? palette.gradientPrimary[1],
        ] as [string, string, string]}
        style={[styles.heroGlow, { opacity: colorScheme === 'dark' ? 0.35 : 0.15 }]}
        pointerEvents="none"
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={palette.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Animated.View entering={FadeInDown.duration(600)} style={styles.logoContainer}>
            <Ionicons name="restaurant" size={64} color={palette.accent} />
            <ThemedText type="title" style={styles.title}>
              rkhis eat
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Connectez-vous pour continuer
            </ThemedText>
          </Animated.View>

          <Animated.View entering={FadeInUp.duration(600).delay(200)} style={styles.form}>
            <View style={styles.inputContainer}>
              <Ionicons name="mail" size={20} color={palette.icon} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={palette.icon}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed" size={20} color={palette.icon} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                placeholderTextColor={palette.icon}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!isLoading}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}>
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color={palette.icon}
                />
              </TouchableOpacity>
            </View>

            {error && (
              <Animated.View entering={FadeInDown.duration(300)} style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={20} color={palette.danger} />
                <ThemedText style={styles.errorText}>{error}</ThemedText>
              </Animated.View>
            )}

            <TouchableOpacity style={styles.forgotPassword}>
              <ThemedText style={styles.forgotPasswordText}>
                Mot de passe oublié?
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <ThemedText style={styles.loginButtonText}>Se connecter</ThemedText>
              )}
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

const createStyles = (palette: typeof Colors.light) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: palette.background,
    },
    heroGlow: {
      position: 'absolute',
      width: '140%',
      height: '40%',
      top: -120,
      alignSelf: 'center',
      borderRadius: 400,
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
      color: palette.text,
    },
    subtitle: {
      fontSize: 16,
      color: palette.textMuted,
    },
    form: {
      width: '100%',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: palette.surfaceMuted,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: palette.border,
    },
    inputIcon: {
      marginRight: 12,
    },
    input: {
      flex: 1,
      fontSize: 15,
      color: palette.text,
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
      color: palette.accent,
      fontWeight: '600',
    },
    loginButton: {
      backgroundColor: palette.accent,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginBottom: 24,
      shadowColor: palette.heroShadow,
      shadowOpacity: 0.2,
      shadowOffset: { width: 0, height: 10 },
      shadowRadius: 20,
      elevation: 4,
    },
    loginButtonDisabled: {
      opacity: 0.7,
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
      color: palette.textMuted,
    },
    signupLink: {
      fontSize: 14,
      color: palette.accent,
      fontWeight: '600',
    },
    errorContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: palette.accentMuted,
      padding: 12,
      borderRadius: 12,
      marginBottom: 16,
      gap: 8,
    },
    errorText: {
      flex: 1,
      fontSize: 14,
      color: palette.danger,
      fontWeight: '600',
    },
  });
