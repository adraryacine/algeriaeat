import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSession } from '@/providers/session-provider';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo, useState } from 'react';
import { Dimensions, Platform, ScrollView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const todayStats = {
  deliveries: 8,
  earnings: 3200,
  distance: 24.5,
  rating: 4.9,
};

const availableDeliveries = [
  { id: '1', restaurant: 'Le Gourmet Algérien', pickup: 'Rue Didouche Mourad', dropoff: 'Rue Larbi Ben M\'hidi', distance: 2.3, earnings: 350, items: 3 },
  { id: '2', restaurant: 'Pizza Palace', pickup: 'Bd Mohamed V', dropoff: 'Rue Abane Ramdane', distance: 3.1, earnings: 400, items: 2 },
];

export default function LivreurHomeScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const styles = useMemo(() => createStyles(palette), [palette]);
  const { user, switchRole } = useSession();
  const [isAvailable, setIsAvailable] = useState(true);

  const livreurName = user?.name || 'Livreur';

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View>
          <ThemedText style={styles.welcomeText}>Bonjour 👋</ThemedText>
          <ThemedText type="title" style={styles.userName}>{livreurName}</ThemedText>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.statusToggle}>
            <ThemedText style={styles.statusLabel}>{isAvailable ? 'En ligne' : 'Hors ligne'}</ThemedText>
            <Switch
              value={isAvailable}
              onValueChange={setIsAvailable}
              trackColor={{ false: palette.surfaceMuted, true: palette.success + '50' }}
              thumbColor={isAvailable ? palette.success : palette.textMuted}
            />
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Stats Cards */}
        <Animated.View entering={FadeInDown.duration(600)} style={styles.statsGrid}>
          <View style={styles.statCard}>
            <LinearGradient colors={[palette.accent, '#FF8E8E']} style={styles.statGradient} />
            <Ionicons name="bicycle" size={24} color="#FFFFFF" />
            <ThemedText style={styles.statValue}>{todayStats.deliveries}</ThemedText>
            <ThemedText style={styles.statLabel}>Livraisons</ThemedText>
          </View>
          <View style={styles.statCard}>
            <LinearGradient colors={[palette.success, '#6EE7B7']} style={styles.statGradient} />
            <Ionicons name="cash" size={24} color="#FFFFFF" />
            <ThemedText style={styles.statValue}>{todayStats.earnings}</ThemedText>
            <ThemedText style={styles.statLabel}>Gains (DA)</ThemedText>
          </View>
          <View style={styles.statCard}>
            <LinearGradient colors={['#8B5CF6', '#A78BFA']} style={styles.statGradient} />
            <Ionicons name="speedometer" size={24} color="#FFFFFF" />
            <ThemedText style={styles.statValue}>{todayStats.distance}</ThemedText>
            <ThemedText style={styles.statLabel}>Km parcourus</ThemedText>
          </View>
          <View style={styles.statCard}>
            <LinearGradient colors={['#F59E0B', '#FBBF24']} style={styles.statGradient} />
            <Ionicons name="star" size={24} color="#FFFFFF" />
            <ThemedText style={styles.statValue}>{todayStats.rating}</ThemedText>
            <ThemedText style={styles.statLabel}>Note moyenne</ThemedText>
          </View>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Actions rapides</ThemedText>
          <View style={styles.quickActionsRow}>
            <TouchableOpacity style={styles.quickAction}>
              <View style={[styles.quickActionIcon, { backgroundColor: palette.accentMuted }]}>
                <Ionicons name="map" size={24} color={palette.accent} />
              </View>
              <ThemedText style={styles.quickActionText}>Navigation</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="wallet" size={24} color="#F59E0B" />
              </View>
              <ThemedText style={styles.quickActionText}>Mes gains</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#E0F2FE' }]}>
                <Ionicons name="time" size={24} color="#0EA5E9" />
              </View>
              <ThemedText style={styles.quickActionText}>Historique</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction} onPress={() => switchRole('client')}>
              <View style={[styles.quickActionIcon, { backgroundColor: '#FCE7F3' }]}>
                <Ionicons name="swap-horizontal" size={24} color="#EC4899" />
              </View>
              <ThemedText style={styles.quickActionText}>Mode Client</ThemedText>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Available Deliveries */}
        <Animated.View entering={FadeInDown.duration(600).delay(400)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>Livraisons disponibles</ThemedText>
            <TouchableOpacity>
              <Ionicons name="refresh" size={20} color={palette.accent} />
            </TouchableOpacity>
          </View>
          {availableDeliveries.map((delivery) => (
            <TouchableOpacity key={delivery.id} style={styles.deliveryCard} activeOpacity={0.7}>
              <View style={styles.deliveryHeader}>
                <ThemedText type="defaultSemiBold" style={styles.restaurantName}>{delivery.restaurant}</ThemedText>
                <View style={styles.earningsBadge}>
                  <ThemedText style={styles.earningsText}>{delivery.earnings} DA</ThemedText>
                </View>
              </View>
              
              <View style={styles.routeInfo}>
                <View style={styles.routePoint}>
                  <View style={[styles.routeDot, { backgroundColor: palette.success }]} />
                  <ThemedText style={styles.routeText} numberOfLines={1}>{delivery.pickup}</ThemedText>
                </View>
                <View style={styles.routeLine} />
                <View style={styles.routePoint}>
                  <View style={[styles.routeDot, { backgroundColor: palette.accent }]} />
                  <ThemedText style={styles.routeText} numberOfLines={1}>{delivery.dropoff}</ThemedText>
                </View>
              </View>

              <View style={styles.deliveryFooter}>
                <View style={styles.deliveryMeta}>
                  <Ionicons name="navigate" size={14} color={palette.icon} />
                  <ThemedText style={styles.metaText}>{delivery.distance} km</ThemedText>
                  <Ionicons name="cube" size={14} color={palette.icon} style={{ marginLeft: 12 }} />
                  <ThemedText style={styles.metaText}>{delivery.items} articles</ThemedText>
                </View>
                <TouchableOpacity style={styles.acceptButton}>
                  <ThemedText style={styles.acceptButtonText}>Accepter</ThemedText>
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
    userName: { fontSize: 22, fontWeight: '800', color: palette.text, marginTop: 2 },
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
    quickActionsRow: { flexDirection: 'row', justifyContent: 'space-between' },
    quickAction: { alignItems: 'center', width: (SCREEN_WIDTH - 60) / 4 },
    quickActionIcon: { width: 52, height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
    quickActionText: { fontSize: 11, fontWeight: '600', color: palette.text, textAlign: 'center' },
    deliveryCard: {
      backgroundColor: palette.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      ...Platform.select({
        ios: { shadowColor: palette.heroShadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6 },
        android: { elevation: 2 },
      }),
    },
    deliveryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    restaurantName: { fontSize: 16, color: palette.text },
    earningsBadge: { backgroundColor: palette.success + '20', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    earningsText: { fontSize: 14, fontWeight: '700', color: palette.success },
    routeInfo: { marginBottom: 12 },
    routePoint: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    routeDot: { width: 10, height: 10, borderRadius: 5 },
    routeText: { fontSize: 13, color: palette.textMuted, flex: 1 },
    routeLine: { width: 2, height: 16, backgroundColor: palette.border, marginLeft: 4, marginVertical: 4 },
    deliveryFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: palette.border },
    deliveryMeta: { flexDirection: 'row', alignItems: 'center' },
    metaText: { fontSize: 12, color: palette.textMuted, marginLeft: 4 },
    acceptButton: { backgroundColor: palette.accent, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
    acceptButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  });
