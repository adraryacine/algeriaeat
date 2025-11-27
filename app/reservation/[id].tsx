import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ReservationScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const styles = useMemo(() => createStyles(palette), [palette]);

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState('2');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  const timeSlots = ['12:00', '12:30', '13:00', '13:30', '14:00', '19:00', '19:30', '20:00', '20:30', '21:00'];

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={palette.text} />
        </TouchableOpacity>
        <ThemedText type="subtitle" style={styles.headerTitle}>
          Réserver une table
        </ThemedText>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Date Selection */}
        <Animated.View entering={FadeInDown.duration(600)} style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Date
          </ThemedText>
          <View style={styles.inputContainer}>
            <Ionicons name="calendar" size={20} color={palette.accent} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={date}
              onChangeText={setDate}
              placeholder="JJ/MM/AAAA"
              placeholderTextColor={palette.icon}
            />
          </View>
        </Animated.View>

        {/* Time Selection */}
        <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Heure
          </ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timeSlots}>
            {timeSlots.map((slot, index) => (
              <Animated.View key={slot} entering={FadeInRight.duration(300).delay(index * 50)}>
                <TouchableOpacity
                  style={[styles.timeSlot, time === slot && styles.timeSlotSelected]}
                  onPress={() => setTime(slot)}
                  activeOpacity={0.7}>
                  <ThemedText style={[styles.timeSlotText, time === slot && styles.timeSlotTextSelected]}>{slot}</ThemedText>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Guests */}
        <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Nombre de personnes
          </ThemedText>
          <View style={styles.guestsContainer}>
            {[1, 2, 3, 4, 5, 6].map((num, index) => (
              <Animated.View key={num} entering={FadeInDown.duration(300).delay(250 + index * 50)}>
                <TouchableOpacity
                  style={[styles.guestButton, guests === num.toString() && styles.guestButtonSelected]}
                  onPress={() => setGuests(num.toString())}
                  activeOpacity={0.7}>
                  <ThemedText style={[styles.guestButtonText, guests === num.toString() && styles.guestButtonTextSelected]}>
                    {num}
                  </ThemedText>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Contact Info */}
        <Animated.View entering={FadeInDown.duration(600).delay(300)} style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Informations de contact
          </ThemedText>
          <View style={styles.inputContainer}>
            <Ionicons name="person" size={20} color={palette.accent} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Nom complet"
              placeholderTextColor={palette.icon}
            />
          </View>
          <View style={[styles.inputContainer, { marginTop: 12 }]}>
            <Ionicons name="call" size={20} color={palette.accent} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Téléphone"
              placeholderTextColor={palette.icon}
              keyboardType="phone-pad"
            />
          </View>
        </Animated.View>

        {/* Notes */}
        <Animated.View entering={FadeInDown.duration(600).delay(400)} style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Notes (optionnel)
          </ThemedText>
          <TextInput
            style={styles.textArea}
            value={notes}
            onChangeText={setNotes}
            placeholder="Demandes spéciales..."
            placeholderTextColor={palette.icon}
            multiline
            numberOfLines={4}
          />
        </Animated.View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Confirm Button */}
      <Animated.View entering={FadeInDown.duration(400).delay(500)} style={[styles.footer, { paddingBottom: insets.bottom + 10 }]}>
        <TouchableOpacity style={styles.confirmButton} onPress={() => router.push('/payment')}>
          <ThemedText style={styles.confirmButtonText}>Confirmer la réservation</ThemedText>
        </TouchableOpacity>
      </Animated.View>
    </ThemedView>
  );
}

const createStyles = (palette: typeof Colors.light) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: palette.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingBottom: 16,
      backgroundColor: palette.surface,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: palette.border,
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
      color: palette.text,
    },
    scrollView: {
      flex: 1,
    },
    section: {
      padding: 20,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: palette.border,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      marginBottom: 16,
      color: palette.text,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: palette.surfaceMuted,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
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
    timeSlots: {
      marginHorizontal: -20,
      paddingHorizontal: 20,
    },
    timeSlot: {
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 12,
      backgroundColor: palette.surfaceMuted,
      marginRight: 12,
      borderWidth: 1,
      borderColor: palette.border,
    },
    timeSlotSelected: {
      backgroundColor: palette.accent,
      borderColor: palette.accent,
      ...Platform.select({
        ios: {
          shadowColor: palette.accent,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    timeSlotText: {
      fontSize: 15,
      fontWeight: '600',
      color: palette.text,
    },
    timeSlotTextSelected: {
      color: '#FFFFFF',
    },
    guestsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    guestButton: {
      width: 50,
      height: 50,
      borderRadius: 12,
      backgroundColor: palette.surfaceMuted,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: palette.border,
    },
    guestButtonSelected: {
      backgroundColor: palette.accent,
      borderColor: palette.accent,
      ...Platform.select({
        ios: {
          shadowColor: palette.accent,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    guestButtonText: {
      fontSize: 18,
      fontWeight: '700',
      color: palette.textMuted,
    },
    guestButtonTextSelected: {
      color: '#FFFFFF',
    },
    textArea: {
      backgroundColor: palette.surfaceMuted,
      borderRadius: 12,
      padding: 16,
      fontSize: 15,
      color: palette.text,
      minHeight: 100,
      textAlignVertical: 'top',
      borderWidth: 1,
      borderColor: palette.border,
    },
    footer: {
      paddingHorizontal: 20,
      paddingTop: 16,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: palette.border,
      backgroundColor: palette.surface,
      ...Platform.select({
        ios: {
          shadowColor: palette.heroShadow,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        android: {
          elevation: 8,
        },
      }),
    },
    confirmButton: {
      backgroundColor: palette.accent,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
    },
    confirmButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '700',
    },
  });
