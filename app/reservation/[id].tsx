import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
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
          <Ionicons name="arrow-back" size={24} color="#333" />
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
            <Ionicons name="calendar" size={20} color="#FF6B6B" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={date}
              onChangeText={setDate}
              placeholder="JJ/MM/AAAA"
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
              <Animated.View
                key={slot}
                entering={FadeInRight.duration(300).delay(index * 50)}>
                <TouchableOpacity
                  style={[
                    styles.timeSlot,
                    time === slot && styles.timeSlotSelected,
                  ]}
                  onPress={() => setTime(slot)}
                  activeOpacity={0.7}>
                  <ThemedText
                    style={[
                      styles.timeSlotText,
                      time === slot && styles.timeSlotTextSelected,
                    ]}>
                    {slot}
                  </ThemedText>
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
              <Animated.View
                key={num}
                entering={FadeInDown.duration(300).delay(250 + index * 50)}>
                <TouchableOpacity
                  style={[
                    styles.guestButton,
                    guests === num.toString() && styles.guestButtonSelected,
                  ]}
                  onPress={() => setGuests(num.toString())}
                  activeOpacity={0.7}>
                  <ThemedText
                    style={[
                      styles.guestButtonText,
                      guests === num.toString() && styles.guestButtonTextSelected,
                    ]}>
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
            <Ionicons name="person" size={20} color="#FF6B6B" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Nom complet"
            />
          </View>
          <View style={[styles.inputContainer, { marginTop: 12 }]}>
            <Ionicons name="call" size={20} color="#FF6B6B" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Téléphone"
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
            multiline
            numberOfLines={4}
          />
        </Animated.View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Confirm Button */}
      <Animated.View
        entering={FadeInDown.duration(400).delay(500)}
        style={[styles.footer, { paddingBottom: insets.bottom + 10 }]}>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => router.push('/payment')}>
          <ThemedText style={styles.confirmButtonText}>
            Confirmer la réservation
          </ThemedText>
        </TouchableOpacity>
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
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
    color: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#000000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  timeSlots: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  timeSlot: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F9F9F9',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  timeSlotSelected: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
    ...Platform.select({
      ios: {
        shadowColor: '#FF6B6B',
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
    color: '#1A1A1A',
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
    backgroundColor: '#F9F9F9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  guestButtonSelected: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
    ...Platform.select({
      ios: {
        shadowColor: '#FF6B6B',
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
    color: '#666',
  },
  guestButtonTextSelected: {
    color: '#FFFFFF',
  },
  textArea: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: '#333',
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
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
    backgroundColor: '#FF6B6B',
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

