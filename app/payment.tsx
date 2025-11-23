import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const paymentMethods = [
  { id: 1, name: 'Espèces', icon: 'cash', color: '#4ECDC4' },
  { id: 2, name: 'Carte bancaire', icon: 'card', color: '#FF6B6B' },
  { id: 3, name: 'Mobile Money', icon: 'phone-portrait', color: '#FFE66D' },
];

export default function PaymentScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedMethod, setSelectedMethod] = useState(1);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const orderSummary = {
    subtotal: 3900,
    deliveryFee: 150,
    discount: 0,
    total: 4050,
  };

  const handlePayment = () => {
    Alert.alert(
      'Paiement réussi! 🎉',
      `Votre commande de ${orderSummary.total} DA a été confirmée. Vous recevrez une notification de suivi.`,
      [
        {
          text: 'Voir le suivi',
          onPress: () => {
            router.push('/(tabs)/tracking');
          },
        },
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <ThemedText type="subtitle" style={styles.headerTitle}>
          Paiement
        </ThemedText>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Payment Methods */}
        <Animated.View entering={FadeInDown.duration(600)} style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Méthode de paiement
          </ThemedText>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentMethod,
                selectedMethod === method.id && styles.paymentMethodSelected,
              ]}
              onPress={() => setSelectedMethod(method.id)}
              activeOpacity={0.7}>
              <View style={[styles.paymentIcon, { backgroundColor: method.color + '20' }]}>
                <Ionicons name={method.icon as any} size={24} color={method.color} />
              </View>
              <ThemedText
                style={[
                  styles.paymentMethodName,
                  selectedMethod === method.id && styles.paymentMethodNameSelected,
                ]}>
                {method.name}
              </ThemedText>
              {selectedMethod === method.id && (
                <Ionicons name="checkmark-circle" size={24} color="#FF6B6B" />
              )}
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Card Details (if card selected) */}
        {selectedMethod === 2 && (
          <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Détails de la carte
            </ThemedText>
            <View style={styles.cardForm}>
              <View style={styles.cardInput}>
                <ThemedText style={styles.cardLabel}>Numéro de carte</ThemedText>
                <View style={styles.inputWrapper}>
                  <Ionicons name="card" size={20} color="#999" style={styles.inputIcon} />
                  <View style={styles.inputPlaceholder}>
                    <ThemedText style={styles.inputPlaceholderText}>
                      •••• •••• •••• ••••
                    </ThemedText>
                  </View>
                </View>
              </View>
              <View style={styles.cardInput}>
                <ThemedText style={styles.cardLabel}>Nom sur la carte</ThemedText>
                <View style={styles.inputWrapper}>
                  <Ionicons name="person" size={20} color="#999" style={styles.inputIcon} />
                  <View style={styles.inputPlaceholder}>
                    <ThemedText style={styles.inputPlaceholderText}>
                      Nom complet
                    </ThemedText>
                  </View>
                </View>
              </View>
              <View style={styles.cardRow}>
                <View style={[styles.cardInput, { flex: 1, marginRight: 8 }]}>
                  <ThemedText style={styles.cardLabel}>Expiration</ThemedText>
                  <View style={styles.inputWrapper}>
                    <View style={styles.inputPlaceholder}>
                      <ThemedText style={styles.inputPlaceholderText}>MM/AA</ThemedText>
                    </View>
                  </View>
                </View>
                <View style={[styles.cardInput, { flex: 1, marginLeft: 8 }]}>
                  <ThemedText style={styles.cardLabel}>CVV</ThemedText>
                  <View style={styles.inputWrapper}>
                    <View style={styles.inputPlaceholder}>
                      <ThemedText style={styles.inputPlaceholderText}>•••</ThemedText>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Summary */}
        <Animated.View entering={FadeInUp.duration(600)} style={styles.summary}>
          <ThemedText type="subtitle" style={styles.summaryTitle}>
            Résumé de la commande
          </ThemedText>
          <View style={styles.summaryRow}>
            <ThemedText style={styles.summaryLabel}>Sous-total</ThemedText>
            <ThemedText style={styles.summaryValue}>{orderSummary.subtotal} DA</ThemedText>
          </View>
          <View style={styles.summaryRow}>
            <ThemedText style={styles.summaryLabel}>Frais de livraison</ThemedText>
            <ThemedText style={styles.summaryValue}>{orderSummary.deliveryFee} DA</ThemedText>
          </View>
          {orderSummary.discount > 0 && (
            <View style={styles.summaryRow}>
              <ThemedText style={[styles.summaryLabel, { color: '#4ECDC4' }]}>
                Réduction
              </ThemedText>
              <ThemedText style={[styles.summaryValue, { color: '#4ECDC4' }]}>
                -{orderSummary.discount} DA
              </ThemedText>
            </View>
          )}
          <View style={[styles.summaryRow, styles.summaryTotalRow]}>
            <ThemedText type="defaultSemiBold" style={styles.summaryTotalLabel}>
              Total
            </ThemedText>
            <ThemedText type="defaultSemiBold" style={styles.summaryTotal}>
              {orderSummary.total} DA
            </ThemedText>
          </View>
        </Animated.View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Pay Button */}
      <Animated.View
        entering={FadeInUp.duration(400)}
        style={[styles.footer, { paddingBottom: insets.bottom + 10 }]}>
        <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
          <View style={styles.payButtonLeft}>
            <Ionicons name="lock-closed" size={20} color="#FFF" />
            <ThemedText style={styles.payButtonText}>
              Payer {orderSummary.total} DA
            </ThemedText>
          </View>
          <Ionicons name="arrow-forward" size={20} color="#FFF" />
        </TouchableOpacity>
        <ThemedText style={styles.securityText}>
          🔒 Paiement sécurisé et crypté
        </ThemedText>
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
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    marginBottom: 12,
  },
  paymentMethodSelected: {
    backgroundColor: '#FFF5F5',
    borderWidth: 2,
    borderColor: '#FF6B6B',
  },
  paymentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paymentMethodName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  paymentMethodNameSelected: {
    color: '#FF6B6B',
  },
  cardForm: {
    gap: 16,
  },
  cardInput: {
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  inputWrapper: {
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
  inputPlaceholder: {
    flex: 1,
  },
  inputPlaceholderText: {
    fontSize: 15,
    color: '#999',
  },
  cardRow: {
    flexDirection: 'row',
  },
  summary: {
    padding: 20,
    backgroundColor: '#F9F9F9',
    margin: 20,
    borderRadius: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#000000',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 15,
    color: '#666',
  },
  summaryValue: {
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
  },
  summaryTotalRow: {
    marginTop: 12,
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
  summaryTotal: {
    fontSize: 24,
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
  payButton: {
    backgroundColor: '#FF6B6B',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  payButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  securityText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});

