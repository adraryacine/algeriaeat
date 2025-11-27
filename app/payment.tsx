import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLoyalty } from '@/providers/loyalty-provider';
import { useOrders } from '@/providers/orders-provider';
import type { Order } from '@/types/order';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const paymentMethods = [
  { id: 1, name: 'Espèces', value: 'Espèces', icon: 'cash', color: '#4ECDC4', desc: 'Payer en espèces à la livraison' },
  { id: 2, name: 'Carte bancaire', value: 'Carte bancaire', icon: 'card', color: '#FF6B6B', desc: 'Visa, Mastercard, CIB, etc.' },
  { id: 3, name: 'Mobile Money', value: 'Mobile Money', icon: 'phone-portrait', color: '#FFE66D', desc: 'Ex: Djezzy, Ooredoo, Mobilis' },
  { id: 4, name: 'CCP/Baridi Mob', value: 'CCP/Baridi Mob', icon: 'mail', color: '#2196F3', desc: 'Payer via CCP (poste) ou Baridi Mob' },
  { id: 5, name: 'Paiement à la livraison (COD)', value: 'Paiement à la livraison (COD)', icon: 'cash-outline', color: '#374151', desc: 'Payer lors de la livraison' },
];

const paymentGuides: Record<number, { title: string; steps: string[] }> = {
  1: {
    title: 'Paiement en espèces',
    steps: ['Préparez le montant exact si possible', 'Votre livreur remettra un reçu officiel'],
  },
  2: {
    title: 'Carte bancaire',
    steps: ['Toutes les cartes algériennes CIB acceptées', 'Authentification 3D Secure requise'],
  },
  3: {
    title: 'Mobile Money',
    steps: ['Compatible BaridiPay, Djezzy Pay, etc.', 'Un QR code vous sera envoyé'],
  },
  4: {
    title: 'CCP / Baridi Mob',
    steps: ['Indiquez votre numéro CCP ou Baridi Mob', 'Confirmation instantanée côté poste', 'Support 24h/24 Baridi Contact: 1530'],
  },
  5: {
    title: 'Paiement à la livraison (COD)',
    steps: ['Paiement sécurisé auprès du livreur', 'Possibilité de vérifier la commande avant paiement'],
  },
};

export default function PaymentScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const { addOrder } = useOrders();
  const { addPoints } = useLoyalty();
  const styles = useMemo(() => createStyles(palette), [palette]);

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
    const method = paymentMethods.find((m) => m.id === selectedMethod)?.value ?? 'Espèces';
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      restaurant: 'Commande AlgeriaEat',
      image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400',
      items: 3,
      itemsList: ['Commande personnalisée'],
      total: orderSummary.total,
      paymentMethod: method,
      status: 'En route',
      date: "Aujourd'hui",
      statusColor: '#FF6B6B',
      canReorder: true,
      canRate: false,
      canTrack: true,
      estimatedTime: '30 min',
    };
    addOrder(newOrder);
    addPoints(Math.round(orderSummary.total * 0.05), { source: 'order', title: newOrder.restaurant });
    Alert.alert(
      'Paiement réussi! 🎉',
      `Votre commande de ${orderSummary.total} DA (${method}) a été confirmée.`,
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
          <Ionicons name="arrow-back" size={24} color={palette.text} />
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
              style={[styles.paymentMethod, selectedMethod === method.id && styles.paymentMethodSelected]}
              onPress={() => setSelectedMethod(method.id)}
              activeOpacity={0.7}>
              <View style={[styles.paymentIcon, { backgroundColor: method.color + '20' }]}>
                {method.logo ? (
                  <Image source={method.logo} style={{width:28,height:28,borderRadius:4}} />
                ) : (
                  <Ionicons name={method.icon as any} size={24} color={method.color} />
                )}
              </View>
              <View style={{flex:1}}>
                <ThemedText style={[styles.paymentMethodName, selectedMethod === method.id && styles.paymentMethodNameSelected]}>
                  {method.name}
                </ThemedText>
                <ThemedText style={{fontSize:12,color:'#888'}}>{method.desc}</ThemedText>
              </View>
              {selectedMethod === method.id && <Ionicons name="checkmark-circle" size={24} color={palette.accent} />}
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Payment Guide */}
        <Animated.View entering={FadeInDown.duration(600).delay(150)} style={styles.guideCard}>
          <View style={styles.guideHeader}>
            <Ionicons name="shield-checkmark" size={20} color={palette.accent} />
            <ThemedText type="defaultSemiBold" style={styles.guideTitle}>
              {paymentGuides[selectedMethod]?.title ?? 'Conseils de paiement'}
            </ThemedText>
          </View>
          {paymentGuides[selectedMethod]?.steps.map((tip, idx) => (
            <View key={idx} style={styles.guideRow}>
              <View style={[styles.guideBullet, { backgroundColor: palette.accent }]} />
              <ThemedText style={styles.guideText}>{tip}</ThemedText>
            </View>
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
                  <Ionicons name="card" size={20} color={palette.icon} style={styles.inputIcon} />
                  <View style={styles.inputPlaceholder}>
                    <ThemedText style={styles.inputPlaceholderText}>•••• •••• •••• ••••</ThemedText>
                  </View>
                </View>
              </View>
              <View style={styles.cardInput}>
                <ThemedText style={styles.cardLabel}>Nom sur la carte</ThemedText>
                <View style={styles.inputWrapper}>
                  <Ionicons name="person" size={20} color={palette.icon} style={styles.inputIcon} />
                  <View style={styles.inputPlaceholder}>
                    <ThemedText style={styles.inputPlaceholderText}>Nom complet</ThemedText>
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
              <ThemedText style={[styles.summaryLabel, { color: palette.success }]}>Réduction</ThemedText>
              <ThemedText style={[styles.summaryValue, { color: palette.success }]}>-{orderSummary.discount} DA</ThemedText>
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
      <Animated.View entering={FadeInUp.duration(400)} style={[styles.footer, { paddingBottom: insets.bottom + 10 }]}>
        <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
          <View style={styles.payButtonLeft}>
            <Ionicons name="lock-closed" size={20} color="#FFF" />
            <ThemedText style={styles.payButtonText}>Payer {orderSummary.total} DA</ThemedText>
          </View>
          <Ionicons name="arrow-forward" size={20} color="#FFF" />
        </TouchableOpacity>
        <ThemedText style={styles.securityText}>🔒 Paiement sécurisé et crypté</ThemedText>
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
    guideCard: {
      marginHorizontal: 20,
      marginBottom: 20,
      padding: 16,
      borderRadius: 16,
      backgroundColor: palette.surface,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: palette.border,
      gap: 10,
    },
    guideHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    guideTitle: {
      fontSize: 16,
      color: palette.text,
    },
    guideRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 8,
    },
    guideBullet: {
      width: 6,
      height: 6,
      borderRadius: 3,
      marginTop: 8,
    },
    guideText: {
      flex: 1,
      fontSize: 13,
      color: palette.textMuted,
      lineHeight: 18,
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
    paymentMethod: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderRadius: 12,
      backgroundColor: palette.surfaceMuted,
      marginBottom: 12,
    },
    paymentMethodSelected: {
      backgroundColor: palette.accentMuted,
      borderWidth: 2,
      borderColor: palette.accent,
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
      color: palette.text,
    },
    paymentMethodNameSelected: {
      color: palette.accent,
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
      color: palette.textMuted,
      marginBottom: 8,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: palette.surfaceMuted,
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
      color: palette.icon,
    },
    cardRow: {
      flexDirection: 'row',
    },
    summary: {
      padding: 20,
      backgroundColor: palette.card,
      margin: 20,
      borderRadius: 16,
    },
    summaryTitle: {
      fontSize: 18,
      fontWeight: '700',
      marginBottom: 16,
      color: palette.text,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    summaryLabel: {
      fontSize: 15,
      color: palette.textMuted,
    },
    summaryValue: {
      fontSize: 15,
      color: palette.text,
      fontWeight: '600',
    },
    summaryTotalRow: {
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: palette.border,
      marginBottom: 0,
    },
    summaryTotalLabel: {
      fontSize: 18,
      color: palette.text,
      fontWeight: '700',
    },
    summaryTotal: {
      fontSize: 24,
      color: palette.accent,
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
    payButton: {
      backgroundColor: palette.accent,
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
      color: palette.textMuted,
      textAlign: 'center',
    },
  });
