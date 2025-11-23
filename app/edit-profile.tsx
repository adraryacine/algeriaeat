import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
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
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function EditProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('Yacine Benali');
  const [email, setEmail] = useState('yacine.benali@example.com');
  const [phone, setPhone] = useState('+213 555 123 456');
  const [address, setAddress] = useState('123 Rue Didouche Mourad, Alger');

  const handleSave = () => {
    router.back();
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <ThemedText type="subtitle" style={styles.headerTitle}>
            Modifier le profil
          </ThemedText>
          <TouchableOpacity onPress={handleSave}>
            <ThemedText style={styles.saveButton}>Enregistrer</ThemedText>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
          <Animated.View entering={FadeInDown.duration(600)} style={styles.avatarSection}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200' }}
              style={styles.avatar}
              contentFit="cover"
            />
            <TouchableOpacity style={styles.editAvatarButton}>
              <Ionicons name="camera" size={20} color="#FFF" />
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Nom complet</ThemedText>
              <View style={styles.inputContainer}>
                <Ionicons name="person" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Nom complet"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Email</ThemedText>
              <View style={styles.inputContainer}>
                <Ionicons name="mail" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Téléphone</ThemedText>
              <View style={styles.inputContainer}>
                <Ionicons name="call" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Téléphone"
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Adresse</ThemedText>
              <View style={styles.inputContainer}>
                <Ionicons name="location" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Adresse"
                  multiline
                />
              </View>
            </View>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B6B',
  },
  scrollView: {
    flex: 1,
  },
  avatarSection: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  editAvatarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,
    right: '45%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  form: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
});

