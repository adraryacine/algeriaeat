import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSession } from '@/providers/session-provider';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo } from 'react';
import { Dimensions, Platform, ScrollView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const todayStats = {
  orders: 24,
  revenue: 45600,
  pending: 3,
  preparing: 2,
};

const recentOrders = [
  { id: 'ORD-1234', items: 'Couscous Royal x2, Chorba', total: 3200, status: 'pending', time: '2 min' },
  { id: 'ORD-1233', items: 'Tajine Zitoune x1', total: 1800, status: 'preparing', time: '8 min' },
  { id: 'ORD-1232', items: 'Chakhchoukha x3', total: 4500, status: 'ready', time: '15 min' },
];

export default function RestaurantDashboard() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const styles = useMemo(() => createStyles(palette), [palette]);
  const { user, switchRole } = useSession();
  const [isOpen, setIsOpen] = React.useState(true);

  const restaurantName = user?.role === 'restaurant' ? user.restaurant_name : 'Mon Restaurant';

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View>
          <ThemedText style={styles.welcomeText}>Bienvenue 👋</ThemedText>
          <ThemedText type="title" style={styles.restaurantName}>{restaurantName}</ThemedText>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.statusToggle}>
            <ThemedText style={styles.statusLabel}>{isOpen ? 'Ouvert' : 'Fermé'}</ThemedText>
            <Switch
              value={isOpen}
              onValueChange={setIsOpen}
              trackColor={{ false: palette.surfaceMuted, true: palette.success + '50' }}
              thumbColor={isOpen ? palette.success : palette.textMuted}
            />
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Stats Cards */}
        <Animated.View entering={FadeInDown.duration(600)} style={styles.statsGrid}>
          <View style={styles.statCard}>
            <LinearGradient colors={[palette.accent, '#FF8E8E']} style={styles.statGradient} />
            <Ionicons name="receipt" size={24} color="#FFFFFF" />
            <ThemedText style={styles.statValue}>{todayStats.orders}</ThemedText>
            <ThemedText style={styles.statLabel}>Commandes</ThemedText>
          </View>
          <View style={styles.statCard}>
            <LinearGradient colors={[palette.success, '#6EE7B7']} style={styles.statGradient} />
            <Ionicons name="cash" size={24} color="#FFFFFF" />
            <ThemedText style={styles.statValue}>{(todayStats.revenue / 1000).toFixed(1)}K</ThemedText>
            <ThemedText style={styles.statLabel}>Revenus (DA)</ThemedText>
          </View>
          <View style={styles.statCard}>
            <LinearGradient colors={['#F59E0B', '#FBBF24']} style={styles.statGradient} />
            <Ionicons name="time" size={24} color="#FFFFFF" />
            <ThemedText style={styles.statValue}>{todayStats.pending}</ThemedText>
            <ThemedText style={styles.statLabel}>En attente</ThemedText>
          </View>
          <View style={styles.statCard}>
            <LinearGradient colors={['#8B5CF6', '#A78BFA']} style={styles.statGradient} />
            <Ionicons name="flame" size={24} color="#FFFFFF" />
            <ThemedText style={styles.statValue}>{todayStats.preparing}</ThemedText>
            <ThemedText style={styles.statLabel}>En préparation</ThemedText>
          </View>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Actions rapides</ThemedText>
          <View style={styles.quickActionsRow}>
            <TouchableOpacity style={styles.quickAction}>
              <View style={[styles.quickActionIcon, { backgroundColor: palette.accentMuted }]}>
                <Ionicons name="add-circle" size={24} color={palette.accent} />
              </View>
              <ThemedText style={styles.quickActionText}>Ajouter plat</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="pricetag" size={24} color="#F59E0B" />
              </View>
              <ThemedText style={styles.quickActionText}>Promotion</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#E0F2FE' }]}>
                <Ionicons name="stats-chart" size={24} color="#0EA5E9" />
              </View>
              <ThemedText style={styles.quickActionText}>Analytics</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction} onPress={() => switchRole('client')}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#FCE7F3' }]}>
                <Ionicons name="swap-horizontal" size={24} color="#EC4899" />
              </View>
              <ThemedText style={styles.quickActionText}>Mode Client</ThemedText>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Recent Orders */}
        <Animated.View entering={FadeInDown.duration(600).delay(400)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Commandes récentes</ThemedText>
            <TouchableOpacity>
              <ThemedText style={styles.seeAllText}>Voir tout</ThemedText>
            </TouchableOpacity>
          </View>
          {recentOrders.map((order) => (
            <TouchableOpacity key={order.id} style={styles.orderCard} activeOpacity={0.7}>
              <View style={styles.orderInfo}>
                <ThemedText type="defaultSemiBold" style={styles.orderId}>{order.id}</ThemedText>
                <ThemedText style={styles.orderItems} numberOfLines={1}>{order.items}</ThemedText>
                <View style={styles.orderMeta}>
                  <ThemedText style={styles.orderTotal}>{order.total} DA</ThemedText>
                  <ThemedText style={styles.orderTime}>• {order.time}</ThemedText>
                </View>
              </View>
              <View style={styles.orderActions}>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: order.status === 'pending' ? '#FEF3C7' : order.status === 'preparing' ? palette.accentMuted : '#D1FAE5' }
                ]}>
                  <ThemedText style={[
                    styles.statusText,
                    { color: order.status === 'pending' ? '#F59E0B' : order.status === 'preparing' ? palette.accent : palette.success }
                  ]}>
                    {order.status === 'pending' ? 'En attente' : order.status === 'preparing' ? 'En cours' : 'Prêt'}
                  </ThemedText>
                </View>
                <TouchableOpacity style={styles.acceptButton}>
                  <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
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
    restaurantName: { fontSize: 22, fontWeight: '800', color: palette.text, marginTop: 2 },
    headerRight: { alignItems: 'flex-end' },
    statusToggle: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    statusLabel: { fontSize: 13, fontWeight: '600', color: palette.textMuted },
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
    statValue: { fontSize: 28, fontWeight: '800', color: '#FFFFFF', marginTop: 8 },
    statLabel: { fontSize: 12, color: 'rgba(255,255,255,0.9)', marginTop: 2 },
    section: { paddingHorizontal: 20, marginBottom: 24 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    sectionTitle: { fontSize: 20, fontWeight: '700', color: palette.text, marginBottom: 16 },
    seeAllText: { fontSize: 14, fontWeight: '600', color: palette.accent },
    quickActionsRow: { flexDirection: 'row', justifyContent: 'space-between' },
    quickAction: { alignItems: 'center', width: (SCREEN_WIDTH - 60) / 4 },
    quickActionIcon: { width: 52, height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
    quickActionText: { fontSize: 11, fontWeight: '600', color: palette.text, textAlign: 'center' },
    orderCard: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: palette.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      ...Platform.select({
        ios: { shadowColor: palette.heroShadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6 },
        android: { elevation: 2 },
      }),
    },
    orderInfo: { flex: 1, marginRight: 12 },
    orderId: { fontSize: 15, color: palette.text },
    orderItems: { fontSize: 13, color: palette.textMuted, marginTop: 4 },
    orderMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
    orderTotal: { fontSize: 14, fontWeight: '700', color: palette.accent },
    orderTime: { fontSize: 12, color: palette.textMuted, marginLeft: 4 },
    orderActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    statusText: { fontSize: 11, fontWeight: '700' },
    acceptButton: { backgroundColor: palette.success, width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  });
