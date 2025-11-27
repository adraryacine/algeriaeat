import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSession } from '@/providers/session-provider';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo } from 'react';
import { Dimensions, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const platformStats = {
  totalOrders: 15420,
  totalRevenue: 4850000,
  activeRestaurants: 156,
  activeLivreurs: 89,
  activeUsers: 12500,
  todayOrders: 342,
};

const recentActivity = [
  { id: '1', type: 'order', message: 'Nouvelle commande #ORD-15421', time: 'Il y a 2 min' },
  { id: '2', type: 'restaurant', message: 'Restaurant "Chez Fatima" vérifié', time: 'Il y a 15 min' },
  { id: '3', type: 'livreur', message: 'Nouveau livreur inscrit à Oran', time: 'Il y a 30 min' },
  { id: '4', type: 'support', message: 'Ticket #1234 résolu', time: 'Il y a 1h' },
];

export default function AdminDashboard() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const styles = useMemo(() => createStyles(palette), [palette]);
  const { user, switchRole } = useSession();

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View>
          <ThemedText style={styles.welcomeText}>Admin Dashboard</ThemedText>
          <ThemedText type="title" style={styles.title}>AlgeriaEat</ThemedText>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color={palette.text} />
          <View style={styles.notificationBadge}>
            <ThemedText style={styles.notificationBadgeText}>5</ThemedText>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Stats Grid */}
        <Animated.View entering={FadeInDown.duration(600)} style={styles.statsGrid}>
          <View style={styles.statCard}>
            <LinearGradient colors={[palette.accent, '#FF8E8E']} style={styles.statGradient} />
            <Ionicons name="receipt" size={24} color="#FFFFFF" />
            <ThemedText style={styles.statValue}>{platformStats.todayOrders}</ThemedText>
            <ThemedText style={styles.statLabel}>Commandes aujourd'hui</ThemedText>
          </View>
          <View style={styles.statCard}>
            <LinearGradient colors={[palette.success, '#6EE7B7']} style={styles.statGradient} />
            <Ionicons name="cash" size={24} color="#FFFFFF" />
            <ThemedText style={styles.statValue}>{(platformStats.totalRevenue / 1000000).toFixed(1)}M</ThemedText>
            <ThemedText style={styles.statLabel}>Revenus totaux (DA)</ThemedText>
          </View>
          <View style={styles.statCard}>
            <LinearGradient colors={['#8B5CF6', '#A78BFA']} style={styles.statGradient} />
            <Ionicons name="restaurant" size={24} color="#FFFFFF" />
            <ThemedText style={styles.statValue}>{platformStats.activeRestaurants}</ThemedText>
            <ThemedText style={styles.statLabel}>Restaurants actifs</ThemedText>
          </View>
          <View style={styles.statCard}>
            <LinearGradient colors={['#F59E0B', '#FBBF24']} style={styles.statGradient} />
            <Ionicons name="bicycle" size={24} color="#FFFFFF" />
            <ThemedText style={styles.statValue}>{platformStats.activeLivreurs}</ThemedText>
            <ThemedText style={styles.statLabel}>Livreurs actifs</ThemedText>
          </View>
          <View style={styles.statCard}>
            <LinearGradient colors={['#0EA5E9', '#38BDF8']} style={styles.statGradient} />
            <Ionicons name="people" size={24} color="#FFFFFF" />
            <ThemedText style={styles.statValue}>{(platformStats.activeUsers / 1000).toFixed(1)}K</ThemedText>
            <ThemedText style={styles.statLabel}>Utilisateurs</ThemedText>
          </View>
          <View style={styles.statCard}>
            <LinearGradient colors={['#EC4899', '#F472B6']} style={styles.statGradient} />
            <Ionicons name="trending-up" size={24} color="#FFFFFF" />
            <ThemedText style={styles.statValue}>{platformStats.totalOrders}</ThemedText>
            <ThemedText style={styles.statLabel}>Total commandes</ThemedText>
          </View>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Actions rapides</ThemedText>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.quickAction}>
              <View style={[styles.quickActionIcon, { backgroundColor: palette.accentMuted }]}>
                <Ionicons name="add-circle" size={24} color={palette.accent} />
              </View>
              <ThemedText style={styles.quickActionText}>Ajouter restaurant</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#E0F2FE' }]}>
                <Ionicons name="pricetag" size={24} color="#0EA5E9" />
              </View>
              <ThemedText style={styles.quickActionText}>Créer promo</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="megaphone" size={24} color="#F59E0B" />
              </View>
              <ThemedText style={styles.quickActionText}>Notification push</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction} onPress={() => switchRole('client')}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#FCE7F3' }]}>
                <Ionicons name="swap-horizontal" size={24} color="#EC4899" />
              </View>
              <ThemedText style={styles.quickActionText}>Mode Client</ThemedText>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Recent Activity */}
        <Animated.View entering={FadeInDown.duration(600).delay(400)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Activité récente</ThemedText>
            <TouchableOpacity>
              <ThemedText style={styles.seeAllText}>Voir tout</ThemedText>
            </TouchableOpacity>
          </View>
          {recentActivity.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={[styles.activityIcon, { backgroundColor: palette.accentMuted }]}>
                <Ionicons
                  name={
                    activity.type === 'order' ? 'receipt' :
                    activity.type === 'restaurant' ? 'restaurant' :
                    activity.type === 'livreur' ? 'bicycle' : 'chatbubble'
                  }
                  size={18}
                  color={palette.accent}
                />
              </View>
              <View style={styles.activityInfo}>
                <ThemedText style={styles.activityMessage}>{activity.message}</ThemedText>
                <ThemedText style={styles.activityTime}>{activity.time}</ThemedText>
              </View>
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
      alignItems: 'flex-start',
      paddingHorizontal: 20,
      paddingBottom: 16,
      backgroundColor: palette.surface,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: palette.border,
    },
    welcomeText: { fontSize: 14, color: palette.textMuted },
    title: { fontSize: 24, fontWeight: '800', color: palette.text },
    notificationButton: { position: 'relative', padding: 8 },
    notificationBadge: {
      position: 'absolute',
      top: 4,
      right: 4,
      backgroundColor: palette.accent,
      borderRadius: 10,
      minWidth: 18,
      height: 18,
      justifyContent: 'center',
      alignItems: 'center',
    },
    notificationBadgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
    scrollView: { flex: 1 },
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 20, gap: 12 },
    statCard: {
      width: (SCREEN_WIDTH - 52) / 2,
      borderRadius: 16,
      padding: 16,
      overflow: 'hidden',
      ...Platform.select({
        ios: { shadowColor: palette.heroShadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8 },
        android: { elevation: 4 },
      }),
    },
    statGradient: { ...StyleSheet.absoluteFillObject },
    statValue: { fontSize: 24, fontWeight: '800', color: '#FFFFFF', marginTop: 8 },
    statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.9)', marginTop: 4 },
    section: { paddingHorizontal: 20, marginBottom: 24 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    sectionTitle: { fontSize: 20, fontWeight: '700', color: palette.text, marginBottom: 16 },
    seeAllText: { fontSize: 14, fontWeight: '600', color: palette.accent },
    quickActionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    quickAction: {
      width: (SCREEN_WIDTH - 52) / 2,
      backgroundColor: palette.card,
      borderRadius: 16,
      padding: 16,
      alignItems: 'center',
      ...Platform.select({
        ios: { shadowColor: palette.heroShadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6 },
        android: { elevation: 2 },
      }),
    },
    quickActionIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
    quickActionText: { fontSize: 13, fontWeight: '600', color: palette.text, textAlign: 'center' },
    activityItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: palette.border },
    activityIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
    activityInfo: { flex: 1, marginLeft: 12 },
    activityMessage: { fontSize: 14, color: palette.text },
    activityTime: { fontSize: 12, color: palette.textMuted, marginTop: 2 },
  });

