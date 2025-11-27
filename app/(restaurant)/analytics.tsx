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

const periodFilters = ['Aujourd\'hui', 'Cette semaine', 'Ce mois', 'Cette année'];

const stats = {
  revenue: 156000,
  orders: 89,
  averageOrder: 1752,
  rating: 4.7,
  reviews: 23,
  returnRate: 68,
};

const topItems = [
  { name: 'Couscous Royal', orders: 45, revenue: 72000 },
  { name: 'Tajine Zitoune', orders: 32, revenue: 44800 },
  { name: 'Chorba Frik', orders: 28, revenue: 11200 },
  { name: 'Chakhchoukha', orders: 21, revenue: 31500 },
];

const recentReviews = [
  { id: '1', name: 'Ahmed B.', rating: 5, comment: 'Excellent couscous, comme à la maison!', date: 'Hier' },
  { id: '2', name: 'Fatima K.', rating: 4, comment: 'Très bon mais livraison un peu lente', date: 'Il y a 2 jours' },
];

export default function RestaurantAnalyticsScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const styles = useMemo(() => createStyles(palette), [palette]);
  const [selectedPeriod, setSelectedPeriod] = useState(1);

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <ThemedText type="subtitle" style={styles.headerTitle}>Analytics</ThemedText>
        <TouchableOpacity style={styles.exportButton}>
          <Ionicons name="download-outline" size={22} color={palette.accent} />
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

        {/* Main Stats */}
        <Animated.View entering={FadeInDown.duration(600)} style={styles.statsGrid}>
          <View style={styles.mainStatCard}>
            <LinearGradient colors={[palette.accent, '#FF8E8E']} style={styles.statGradient} />
            <Ionicons name="cash" size={28} color="#FFFFFF" />
            <ThemedText style={styles.mainStatValue}>{(stats.revenue / 1000).toFixed(0)}K DA</ThemedText>
            <ThemedText style={styles.mainStatLabel}>Revenus totaux</ThemedText>
            <View style={styles.statTrend}>
              <Ionicons name="trending-up" size={14} color="#FFFFFF" />
              <ThemedText style={styles.trendText}>+12% vs semaine dernière</ThemedText>
            </View>
          </View>
        </Animated.View>

        {/* Secondary Stats */}
        <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.secondaryStats}>
          <View style={styles.secondaryStatCard}>
            <Ionicons name="receipt" size={20} color={palette.accent} />
            <ThemedText style={styles.secondaryStatValue}>{stats.orders}</ThemedText>
            <ThemedText style={styles.secondaryStatLabel}>Commandes</ThemedText>
          </View>
          <View style={styles.secondaryStatCard}>
            <Ionicons name="cart" size={20} color={palette.success} />
            <ThemedText style={styles.secondaryStatValue}>{stats.averageOrder} DA</ThemedText>
            <ThemedText style={styles.secondaryStatLabel}>Panier moyen</ThemedText>
          </View>
          <View style={styles.secondaryStatCard}>
            <Ionicons name="star" size={20} color="#FFD700" />
            <ThemedText style={styles.secondaryStatValue}>{stats.rating}</ThemedText>
            <ThemedText style={styles.secondaryStatLabel}>Note ({stats.reviews} avis)</ThemedText>
          </View>
        </Animated.View>

        {/* Top Items */}
        <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Plats les plus vendus</ThemedText>
          {topItems.map((item, index) => (
            <View key={index} style={styles.topItemRow}>
              <View style={styles.topItemRank}>
                <ThemedText style={styles.rankText}>#{index + 1}</ThemedText>
              </View>
              <View style={styles.topItemInfo}>
                <ThemedText style={styles.topItemName}>{item.name}</ThemedText>
                <ThemedText style={styles.topItemOrders}>{item.orders} commandes</ThemedText>
              </View>
              <ThemedText style={styles.topItemRevenue}>{(item.revenue / 1000).toFixed(1)}K DA</ThemedText>
            </View>
          ))}
        </Animated.View>

        {/* Recent Reviews */}
        <Animated.View entering={FadeInDown.duration(600).delay(300)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Avis récents</ThemedText>
            <TouchableOpacity>
              <ThemedText style={styles.seeAllText}>Voir tout</ThemedText>
            </TouchableOpacity>
          </View>
          {recentReviews.map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewerInfo}>
                  <View style={styles.reviewerAvatar}>
                    <ThemedText style={styles.avatarText}>{review.name.charAt(0)}</ThemedText>
                  </View>
                  <View>
                    <ThemedText style={styles.reviewerName}>{review.name}</ThemedText>
                    <ThemedText style={styles.reviewDate}>{review.date}</ThemedText>
                  </View>
                </View>
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={12} color="#FFD700" />
                  <ThemedText style={styles.ratingText}>{review.rating}</ThemedText>
                </View>
              </View>
              <ThemedText style={styles.reviewComment}>{review.comment}</ThemedText>
              <TouchableOpacity style={styles.replyButton}>
                <Ionicons name="chatbubble-outline" size={14} color={palette.accent} />
                <ThemedText style={styles.replyButtonText}>Répondre</ThemedText>
              </TouchableOpacity>
            </View>
          ))}
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
    exportButton: { padding: 8 },
    scrollView: { flex: 1 },
    periodFilter: { backgroundColor: palette.surface, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: palette.border },
    periodTabs: { paddingHorizontal: 20, paddingVertical: 12, gap: 8 },
    periodTab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: palette.surfaceMuted, marginRight: 8 },
    periodTabActive: { backgroundColor: palette.accent },
    periodTabText: { fontSize: 14, fontWeight: '600', color: palette.textMuted },
    periodTabTextActive: { color: '#FFFFFF', fontWeight: '700' },
    statsGrid: { padding: 20 },
    mainStatCard: {
      borderRadius: 20,
      padding: 24,
      overflow: 'hidden',
      ...Platform.select({
        ios: { shadowColor: palette.heroShadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 12 },
        android: { elevation: 6 },
      }),
    },
    statGradient: { ...StyleSheet.absoluteFillObject },
    mainStatValue: { fontSize: 36, fontWeight: '800', color: '#FFFFFF', marginTop: 12 },
    mainStatLabel: { fontSize: 14, color: 'rgba(255,255,255,0.9)', marginTop: 4 },
    statTrend: { flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 4 },
    trendText: { fontSize: 12, color: 'rgba(255,255,255,0.9)' },
    secondaryStats: { flexDirection: 'row', paddingHorizontal: 20, gap: 12 },
    secondaryStatCard: {
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
    secondaryStatValue: { fontSize: 18, fontWeight: '700', color: palette.text, marginTop: 8 },
    secondaryStatLabel: { fontSize: 11, color: palette.textMuted, marginTop: 4, textAlign: 'center' },
    section: { paddingHorizontal: 20, marginTop: 24 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: palette.text, marginBottom: 16 },
    seeAllText: { fontSize: 14, fontWeight: '600', color: palette.accent },
    topItemRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: palette.card,
      borderRadius: 12,
      padding: 12,
      marginBottom: 8,
    },
    topItemRank: { width: 32, height: 32, borderRadius: 16, backgroundColor: palette.accentMuted, justifyContent: 'center', alignItems: 'center' },
    rankText: { fontSize: 12, fontWeight: '700', color: palette.accent },
    topItemInfo: { flex: 1, marginLeft: 12 },
    topItemName: { fontSize: 15, fontWeight: '600', color: palette.text },
    topItemOrders: { fontSize: 12, color: palette.textMuted, marginTop: 2 },
    topItemRevenue: { fontSize: 14, fontWeight: '700', color: palette.success },
    reviewCard: {
      backgroundColor: palette.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      ...Platform.select({
        ios: { shadowColor: palette.heroShadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6 },
        android: { elevation: 2 },
      }),
    },
    reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    reviewerInfo: { flexDirection: 'row', alignItems: 'center' },
    reviewerAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: palette.accentMuted, justifyContent: 'center', alignItems: 'center' },
    avatarText: { fontSize: 16, fontWeight: '700', color: palette.accent },
    reviewerName: { fontSize: 15, fontWeight: '600', color: palette.text, marginLeft: 10 },
    reviewDate: { fontSize: 12, color: palette.textMuted, marginLeft: 10 },
    ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FEF3C7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    ratingText: { fontSize: 13, fontWeight: '700', color: '#F59E0B' },
    reviewComment: { fontSize: 14, color: palette.text, marginTop: 12, lineHeight: 20 },
    replyButton: { flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 6 },
    replyButtonText: { fontSize: 13, fontWeight: '600', color: palette.accent },
  });
