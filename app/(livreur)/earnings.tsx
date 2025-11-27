import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo, useState } from 'react';
import { Dimensions, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const periodFilters = ['Aujourd\'hui', 'Cette semaine', 'Ce mois'];

const earningsData = {
  today: 3200,
  week: 18500,
  month: 72000,
  pending: 5600,
  deliveries: 8,
  tips: 450,
  bonuses: 1000,
};

const recentPayments = [
  { id: '1', date: '25 Nov 2025', amount: 18500, deliveries: 42, status: 'paid' },
  { id: '2', date: '18 Nov 2025', amount: 16200, deliveries: 38, status: 'paid' },
  { id: '3', date: '11 Nov 2025', amount: 19800, deliveries: 45, status: 'paid' },
];

export default function LivreurEarningsScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const styles = useMemo(() => createStyles(palette), [palette]);
  const [selectedPeriod, setSelectedPeriod] = useState(0);

  const currentEarnings = selectedPeriod === 0 ? earningsData.today : selectedPeriod === 1 ? earningsData.week : earningsData.month;

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <ThemedText type="subtitle" style={styles.headerTitle}>Mes gains</ThemedText>
        <TouchableOpacity style={styles.historyButton}>
          <Ionicons name="document-text-outline" size={22} color={palette.accent} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Period Filter */}
        <View style={styles.periodFilter}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.periodTabs}>
            {periodFilters.map((period, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.periodTab, selectedPeriod === index && styles.periodTabActive]}
                onPress={() => setSelectedPeriod(index)}>
                <ThemedText style={[styles.periodTabText, selectedPeriod === index && styles.periodTabTextActive]}>
                  {period}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Main Earnings Card */}
        <Animated.View entering={FadeInDown.duration(600)} style={styles.mainEarningsCard}>
          <LinearGradient colors={[palette.success, '#6EE7B7']} style={styles.earningsGradient} />
          <ThemedText style={styles.earningsLabel}>Gains totaux</ThemedText>
          <ThemedText style={styles.earningsValue}>{currentEarnings.toLocaleString()} DA</ThemedText>
          <View style={styles.earningsDetails}>
            <View style={styles.earningsDetail}>
              <Ionicons name="bicycle" size={16} color="rgba(255,255,255,0.9)" />
              <ThemedText style={styles.detailText}>{earningsData.deliveries} livraisons</ThemedText>
            </View>
            <View style={styles.earningsDetail}>
              <Ionicons name="heart" size={16} color="rgba(255,255,255,0.9)" />
              <ThemedText style={styles.detailText}>{earningsData.tips} DA pourboires</ThemedText>
            </View>
          </View>
        </Animated.View>

        {/* Stats Grid */}
        <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="time" size={20} color="#F59E0B" />
            <ThemedText style={styles.statValue}>{earningsData.pending.toLocaleString()} DA</ThemedText>
            <ThemedText style={styles.statLabel}>En attente</ThemedText>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="gift" size={20} color="#8B5CF6" />
            <ThemedText style={styles.statValue}>{earningsData.bonuses.toLocaleString()} DA</ThemedText>
            <ThemedText style={styles.statLabel}>Bonus</ThemedText>
          </View>
        </Animated.View>

        {/* Withdrawal Section */}
        <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Retrait</ThemedText>
          <View style={styles.withdrawCard}>
            <View style={styles.withdrawInfo}>
              <ThemedText style={styles.withdrawLabel}>Solde disponible</ThemedText>
              <ThemedText type="title" style={styles.withdrawAmount}>{earningsData.pending.toLocaleString()} DA</ThemedText>
              <ThemedText style={styles.withdrawNote}>Minimum de retrait: 2000 DA</ThemedText>
            </View>
            <TouchableOpacity style={styles.withdrawButton}>
              <Ionicons name="wallet" size={20} color="#FFFFFF" />
              <ThemedText style={styles.withdrawButtonText}>Retirer</ThemedText>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Recent Payments */}
        <Animated.View entering={FadeInDown.duration(600).delay(300)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Paiements récents</ThemedText>
            <TouchableOpacity>
              <ThemedText style={styles.seeAllText}>Voir tout</ThemedText>
            </TouchableOpacity>
          </View>
          {recentPayments.map((payment) => (
            <View key={payment.id} style={styles.paymentCard}>
              <View style={styles.paymentInfo}>
                <ThemedText type="defaultSemiBold" style={styles.paymentDate}>{payment.date}</ThemedText>
                <ThemedText style={styles.paymentDeliveries}>{payment.deliveries} livraisons</ThemedText>
              </View>
              <View style={styles.paymentRight}>
                <ThemedText type="defaultSemiBold" style={styles.paymentAmount}>{payment.amount.toLocaleString()} DA</ThemedText>
                <View style={styles.paidBadge}>
                  <Ionicons name="checkmark-circle" size={12} color={palette.success} />
                  <ThemedText style={styles.paidText}>Payé</ThemedText>
                </View>
              </View>
            </View>
          ))}
        </Animated.View>

        {/* Bank Info */}
        <Animated.View entering={FadeInDown.duration(600).delay(400)} style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Compte bancaire</ThemedText>
          <TouchableOpacity style={styles.bankCard}>
            <View style={styles.bankIcon}>
              <Ionicons name="card" size={24} color={palette.accent} />
            </View>
            <View style={styles.bankInfo}>
              <ThemedText style={styles.bankName}>CCP / Baridi Mob</ThemedText>
              <ThemedText style={styles.bankNumber}>**** **** 1234</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={20} color={palette.icon} />
          </TouchableOpacity>
        </Animated.View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </ThemedView>
  );
}

const createStyles = (palette: typeof Colors.light) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: palette.background },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingBottom: 16,
      backgroundColor: palette.surface,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: palette.border,
    },
    headerTitle: { fontSize: 22, fontWeight: '700', color: palette.text },
    historyButton: { padding: 8 },
    scrollView: { flex: 1 },
    periodFilter: { backgroundColor: palette.surface, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: palette.border },
    periodTabs: { paddingHorizontal: 20, paddingVertical: 12, gap: 8 },
    periodTab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: palette.surfaceMuted, marginRight: 8 },
    periodTabActive: { backgroundColor: palette.accent },
    periodTabText: { fontSize: 14, fontWeight: '600', color: palette.textMuted },
    periodTabTextActive: { color: '#FFFFFF', fontWeight: '700' },
    mainEarningsCard: {
      margin: 20,
      borderRadius: 20,
      padding: 24,
      overflow: 'hidden',
      ...Platform.select({
        ios: { shadowColor: palette.heroShadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 12 },
        android: { elevation: 6 },
      }),
    },
    earningsGradient: { ...StyleSheet.absoluteFillObject },
    earningsLabel: { fontSize: 14, color: 'rgba(255,255,255,0.9)' },
    earningsValue: { fontSize: 40, fontWeight: '800', color: '#FFFFFF', marginTop: 8 },
    earningsDetails: { flexDirection: 'row', marginTop: 16, gap: 20 },
    earningsDetail: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    detailText: { fontSize: 13, color: 'rgba(255,255,255,0.9)' },
    statsGrid: { flexDirection: 'row', paddingHorizontal: 20, gap: 12 },
    statCard: {
      flex: 1,
      backgroundColor: palette.card,
      borderRadius: 16,
      padding: 16,
      alignItems: 'center',
      ...Platform.select({
        ios: { shadowColor: palette.heroShadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6 },
        android: { elevation: 2 },
      }),
    },
    statValue: { fontSize: 18, fontWeight: '700', color: palette.text, marginTop: 8 },
    statLabel: { fontSize: 12, color: palette.textMuted, marginTop: 4 },
    section: { paddingHorizontal: 20, marginTop: 24 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: palette.text, marginBottom: 16 },
    seeAllText: { fontSize: 14, fontWeight: '600', color: palette.accent },
    withdrawCard: {
      backgroundColor: palette.card,
      borderRadius: 16,
      padding: 20,
      ...Platform.select({
        ios: { shadowColor: palette.heroShadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6 },
        android: { elevation: 2 },
      }),
    },
    withdrawInfo: { marginBottom: 16 },
    withdrawLabel: { fontSize: 13, color: palette.textMuted },
    withdrawAmount: { fontSize: 28, color: palette.text, marginTop: 4 },
    withdrawNote: { fontSize: 12, color: palette.textMuted, marginTop: 4 },
    withdrawButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: palette.accent,
      paddingVertical: 14,
      borderRadius: 12,
      gap: 8,
    },
    withdrawButtonText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
    paymentCard: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: palette.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 8,
    },
    paymentInfo: {},
    paymentDate: { fontSize: 15, color: palette.text },
    paymentDeliveries: { fontSize: 12, color: palette.textMuted, marginTop: 2 },
    paymentRight: { alignItems: 'flex-end' },
    paymentAmount: { fontSize: 16, color: palette.success },
    paidBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
    paidText: { fontSize: 11, color: palette.success },
    bankCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: palette.card,
      borderRadius: 16,
      padding: 16,
      ...Platform.select({
        ios: { shadowColor: palette.heroShadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6 },
        android: { elevation: 2 },
      }),
    },
    bankIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: palette.accentMuted, justifyContent: 'center', alignItems: 'center' },
    bankInfo: { flex: 1, marginLeft: 12 },
    bankName: { fontSize: 15, fontWeight: '600', color: palette.text },
    bankNumber: { fontSize: 13, color: palette.textMuted, marginTop: 2 },
  });
