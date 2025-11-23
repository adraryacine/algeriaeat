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
import Animated, { FadeInDown, FadeInRight, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function OrderScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [deliveryAddress, setDeliveryAddress] = useState('123 Rue Didouche Mourad, Alger');
  const [phone, setPhone] = useState('+213 555 123 456');
  const [notes, setNotes] = useState('');

  const orderItems = [
    { id: 1, name: 'Couscous Royal', price: 1200, quantity: 2 },
    { id: 2, name: 'Tajine d\'Agneau', price: 1500, quantity: 1 },
  ];

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 150;
  const total = subtotal + deliveryFee;

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <ThemedText type="subtitle" style={styles.headerTitle}>
          Commande
        </ThemedText>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Restaurant Info Card */}
        <Animated.View entering={FadeInDown.duration(600)} style={styles.restaurantCard}>
          <View style={styles.restaurantCardHeader}>
            <View style={styles.restaurantCardInfo}>
              <ThemedText type="defaultSemiBold" style={styles.restaurantCardName}>
                Le Gourmet Algérien
              </ThemedText>
              <View style={styles.restaurantCardRating}>
                <Ionicons name="star" size={14} color="#FFD700" />
                <ThemedText style={styles.restaurantCardRatingText}>4.8</ThemedText>
              </View>
            </View>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="create-outline" size={20} color="#FF6B6B" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Order Items */}
        <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Articles ({orderItems.length})
          </ThemedText>
          {orderItems.map((item, index) => (
            <Animated.View
              key={item.id}
              entering={FadeInRight.duration(400).delay(150 + index * 50)}
              style={styles.orderItem}>
              <View style={styles.orderItemLeft}>
                <View style={styles.orderItemNumber}>
                  <ThemedText style={styles.orderItemNumberText}>{index + 1}</ThemedText>
                </View>
                <View style={styles.orderItemInfo}>
                  <ThemedText type="defaultSemiBold" style={styles.orderItemName}>
                    {item.name}
                  </ThemedText>
                  <ThemedText style={styles.orderItemQuantity}>
                    Quantité: {item.quantity}
                  </ThemedText>
                </View>
              </View>
              <ThemedText type="defaultSemiBold" style={styles.orderItemPrice}>
                {item.price * item.quantity} DA
              </ThemedText>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Delivery Address */}
        <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Adresse de livraison
          </ThemedText>
          <View style={styles.inputContainer}>
            <Ionicons name="location" size={20} color="#FF6B6B" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={deliveryAddress}
              onChangeText={setDeliveryAddress}
              placeholder="Adresse de livraison"
            />
          </View>
        </Animated.View>

        {/* Phone */}
        <Animated.View entering={FadeInDown.duration(600).delay(300)} style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Téléphone
          </ThemedText>
          <View style={styles.inputContainer}>
            <Ionicons name="call" size={20} color="#FF6B6B" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Numéro de téléphone"
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
            placeholder="Instructions spéciales..."
            multiline
            numberOfLines={4}
          />
        </Animated.View>

        {/* Summary */}
        <Animated.View entering={FadeInUp.duration(600)} style={styles.summary}>
          <View style={styles.summaryRow}>
            <ThemedText style={styles.summaryLabel}>Sous-total</ThemedText>
            <ThemedText style={styles.summaryValue}>{subtotal} DA</ThemedText>
          </View>
          <View style={styles.summaryRow}>
            <ThemedText style={styles.summaryLabel}>Frais de livraison</ThemedText>
            <ThemedText style={styles.summaryValue}>{deliveryFee} DA</ThemedText>
          </View>
          <View style={[styles.summaryRow, styles.summaryTotal]}>
            <ThemedText type="defaultSemiBold" style={styles.summaryTotalLabel}>
              Total
            </ThemedText>
            <ThemedText type="defaultSemiBold" style={styles.summaryTotalValue}>
              {total} DA
            </ThemedText>
          </View>
        </Animated.View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Payment Button */}
      <Animated.View
        entering={FadeInUp.duration(400)}
        style={[styles.footer, { paddingBottom: insets.bottom + 10 }]}>
        <TouchableOpacity
          style={styles.paymentButton}
          onPress={() => router.push('/payment')}>
          <ThemedText style={styles.paymentButtonText}>
            Procéder au paiement
          </ThemedText>
          <Ionicons name="arrow-forward" size={20} color="#FFF" />
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
    backgroundColor: '#F9F9F9',
  },
  restaurantCard: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    marginBottom: 0,
    padding: 16,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  restaurantCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  restaurantCardInfo: {
    flex: 1,
  },
  restaurantCardName: {
    fontSize: 18,
    marginBottom: 4,
  },
  restaurantCardRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  restaurantCardRatingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  section: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#000000',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  orderItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  orderItemNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  orderItemNumberText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  orderItemInfo: {
    flex: 1,
  },
  orderItemName: {
    fontSize: 16,
    marginBottom: 4,
    color: '#000000',
    fontWeight: '700',
  },
  orderItemQuantity: {
    fontSize: 14,
    color: '#4A4A4A',
    fontWeight: '500',
  },
  orderItemPrice: {
    fontSize: 16,
    color: '#FF6B6B',
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
    color: '#1A1A1A',
    fontWeight: '500',
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
  summary: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 15,
    color: '#4A4A4A',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 15,
    color: '#1A1A1A',
    fontWeight: '600',
  },
  summaryTotal: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    marginBottom: 0,
  },
  summaryTotalLabel: {
    fontSize: 18,
    color: '#000000',
    fontWeight: '700',
  },
  summaryTotalValue: {
    fontSize: 20,
    color: '#FF6B6B',
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
  paymentButton: {
    backgroundColor: '#FF6B6B',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  paymentButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

