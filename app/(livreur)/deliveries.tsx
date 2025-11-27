import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { FlatList, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const deliveryFilters = ['Toutes', 'En cours', 'Terminées', 'Annulées'];

const mockDeliveries = [
  { id: 'DEL-001', restaurant: 'Le Gourmet Algérien', client: 'Ahmed B.', pickup: 'Rue Didouche Mourad', dropoff: '45 Rue Larbi Ben M\'hidi', status: 'active', earnings: 400, time: '14:30' },
  { id: 'DEL-002', restaurant: 'Pizza Palace', client: 'Fatima K.', pickup: 'Bd Mohamed V', dropoff: '12 Rue Abane Ramdane', status: 'completed', earnings: 350, time: '13:45' },
  { id: 'DEL-003', restaurant: 'Burger House', client: 'Mohamed S.', pickup: 'Rue Hassiba Ben Bouali', dropoff: '78 Rue Asselah Hocine', status: 'completed', earnings: 300, time: '12:20' },
];

export default function LivreurDeliveriesScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const styles = useMemo(() => createStyles(palette), [palette]);
  const [selectedFilter, setSelectedFilter] = useState(0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return palette.accent;
      case 'completed': return palette.success;
      case 'cancelled': return palette.danger;
      default: return palette.textMuted;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'En cours';
      case 'completed': return 'Terminée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  const renderDelivery = ({ item, index }: { item: typeof mockDeliveries[0]; index: number }) => (
    <Animated.View entering={FadeInDown.duration(400).delay(index * 50)}>
      <TouchableOpacity style={styles.deliveryCard} activeOpacity={0.7}>
        <View style={styles.deliveryHeader}>
          <View>
            <ThemedText type="defaultSemiBold" style={styles.deliveryId}>{item.id}</ThemedText>
            <ThemedText style={styles.deliveryTime}>{item.time}</ThemedText>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
            <ThemedText style={[styles.statusText, { color: getStatusColor(item.status) }]}>{getStatusLabel(item.status)}</ThemedText>
          </View>
        </View>
        
        <View style={styles.deliveryDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="restaurant" size={14} color={palette.icon} />
            <ThemedText style={styles.detailText}>{item.restaurant}</ThemedText>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="person" size={14} color={palette.icon} />
            <ThemedText style={styles.detailText}>{item.client}</ThemedText>
          </View>
        </View>

        <View style={styles.routeInfo}>
          <View style={styles.routePoint}>
            <View style={[styles.routeDot, { backgroundColor: palette.success }]} />
            <ThemedText style={styles.routeText} numberOfLines={1}>{item.pickup}</ThemedText>
          </View>
          <View style={styles.routeLine} />
          <View style={styles.routePoint}>
            <View style={[styles.routeDot, { backgroundColor: palette.accent }]} />
            <ThemedText style={styles.routeText} numberOfLines={1}>{item.dropoff}</ThemedText>
          </View>
        </View>

        <View style={styles.deliveryFooter}>
          <ThemedText type="defaultSemiBold" style={styles.earnings}>{item.earnings} DA</ThemedText>
          {item.status === 'active' && (
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.navigateButton}>
                <Ionicons name="navigate" size={18} color={palette.accent} />
                <ThemedText style={styles.navigateText}>Navigation</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.completeButton}>
                <Ionicons name="checkmark" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <ThemedText type="subtitle" style={styles.headerTitle}>Mes livraisons</ThemedText>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterTabs}>
          {deliveryFilters.map((filter, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.filterTab, selectedFilter === index && styles.filterTabActive]}
              onPress={() => setSelectedFilter(index)}>
              <ThemedText style={[styles.filterTabText, selectedFilter === index && styles.filterTabTextActive]}>
                {filter}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={mockDeliveries}
        renderItem={renderDelivery}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
}

const createStyles = (palette: typeof Colors.light) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: palette.background },
    header: {
      paddingHorizontal: 20,
      paddingBottom: 16,
      backgroundColor: palette.surface,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: palette.border,
    },
    headerTitle: { fontSize: 22, fontWeight: '700', color: palette.text },
    filterContainer: { backgroundColor: palette.surface, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: palette.border },
    filterTabs: { paddingHorizontal: 20, paddingVertical: 12, gap: 8 },
    filterTab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: palette.surfaceMuted, marginRight: 8 },
    filterTabActive: { backgroundColor: palette.accent },
    filterTabText: { fontSize: 14, fontWeight: '600', color: palette.textMuted },
    filterTabTextActive: { color: '#FFFFFF', fontWeight: '700' },
    listContent: { padding: 20 },
    deliveryCard: {
      backgroundColor: palette.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      ...Platform.select({
        ios: { shadowColor: palette.heroShadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
        android: { elevation: 3 },
      }),
    },
    deliveryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
    deliveryId: { fontSize: 16, color: palette.text },
    deliveryTime: { fontSize: 12, color: palette.textMuted, marginTop: 2 },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    statusText: { fontSize: 11, fontWeight: '700' },
    deliveryDetails: { gap: 6, marginBottom: 12, paddingBottom: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: palette.border },
    detailRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    detailText: { fontSize: 13, color: palette.textMuted },
    routeInfo: { marginBottom: 12 },
    routePoint: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    routeDot: { width: 10, height: 10, borderRadius: 5 },
    routeText: { fontSize: 13, color: palette.text, flex: 1 },
    routeLine: { width: 2, height: 16, backgroundColor: palette.border, marginLeft: 4, marginVertical: 4 },
    deliveryFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    earnings: { fontSize: 18, color: palette.success },
    actionButtons: { flexDirection: 'row', gap: 8 },
    navigateButton: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: palette.accentMuted },
    navigateText: { fontSize: 13, fontWeight: '600', color: palette.accent },
    completeButton: { backgroundColor: palette.success, width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  });
