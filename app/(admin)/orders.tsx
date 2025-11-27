import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { FlatList, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const orderFilters = ['Toutes', 'En cours', 'Livrées', 'Annulées', 'Litiges'];

const mockOrders = [
  { id: 'ORD-15421', restaurant: 'Le Gourmet Algérien', client: 'Ahmed B.', livreur: 'Karim M.', total: 2800, status: 'delivering', time: '14:30' },
  { id: 'ORD-15420', restaurant: 'Pizza Palace', client: 'Fatima K.', livreur: 'Said L.', total: 1500, status: 'preparing', time: '14:25' },
  { id: 'ORD-15419', restaurant: 'Burger House', client: 'Mohamed S.', livreur: null, total: 1900, status: 'dispute', time: '14:20' },
  { id: 'ORD-15418', restaurant: 'Sushi Master', client: 'Sara L.', livreur: 'Omar B.', total: 3200, status: 'delivered', time: '14:00' },
];

export default function AdminOrdersScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const styles = useMemo(() => createStyles(palette), [palette]);
  const [selectedFilter, setSelectedFilter] = useState(0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparing': return '#F59E0B';
      case 'delivering': return palette.accent;
      case 'delivered': return palette.success;
      case 'cancelled': return palette.textMuted;
      case 'dispute': return palette.danger;
      default: return palette.textMuted;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'preparing': return 'En préparation';
      case 'delivering': return 'En livraison';
      case 'delivered': return 'Livrée';
      case 'cancelled': return 'Annulée';
      case 'dispute': return 'Litige';
      default: return status;
    }
  };

  const renderOrder = ({ item, index }: { item: typeof mockOrders[0]; index: number }) => (
    <Animated.View entering={FadeInDown.duration(400).delay(index * 50)}>
      <TouchableOpacity style={styles.orderCard} activeOpacity={0.7}>
        <View style={styles.orderHeader}>
          <View>
            <ThemedText type="defaultSemiBold" style={styles.orderId}>{item.id}</ThemedText>
            <ThemedText style={styles.orderTime}>{item.time}</ThemedText>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
            <ThemedText style={[styles.statusText, { color: getStatusColor(item.status) }]}>{getStatusLabel(item.status)}</ThemedText>
          </View>
        </View>
        
        <View style={styles.orderDetails}>
          <View style={styles.orderDetailRow}>
            <Ionicons name="restaurant" size={14} color={palette.icon} />
            <ThemedText style={styles.orderDetailText}>{item.restaurant}</ThemedText>
          </View>
          <View style={styles.orderDetailRow}>
            <Ionicons name="person" size={14} color={palette.icon} />
            <ThemedText style={styles.orderDetailText}>{item.client}</ThemedText>
          </View>
          <View style={styles.orderDetailRow}>
            <Ionicons name="bicycle" size={14} color={palette.icon} />
            <ThemedText style={styles.orderDetailText}>{item.livreur || 'Non assigné'}</ThemedText>
          </View>
        </View>

        <View style={styles.orderFooter}>
          <ThemedText type="defaultSemiBold" style={styles.orderTotal}>{item.total} DA</ThemedText>
          <TouchableOpacity style={styles.viewButton}>
            <ThemedText style={styles.viewButtonText}>Voir détails</ThemedText>
            <Ionicons name="arrow-forward" size={14} color={palette.accent} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <ThemedText type="subtitle" style={styles.headerTitle}>Commandes</ThemedText>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color={palette.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterTabs}>
          {orderFilters.map((filter, index) => (
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
        data={mockOrders}
        renderItem={renderOrder}
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
    searchButton: { padding: 8 },
    filterContainer: { backgroundColor: palette.surface, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: palette.border },
    filterTabs: { paddingHorizontal: 20, paddingVertical: 12, gap: 8 },
    filterTab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: palette.surfaceMuted, marginRight: 8 },
    filterTabActive: { backgroundColor: palette.accent },
    filterTabText: { fontSize: 14, fontWeight: '600', color: palette.textMuted },
    filterTabTextActive: { color: '#FFFFFF', fontWeight: '700' },
    listContent: { padding: 20 },
    orderCard: {
      backgroundColor: palette.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      ...Platform.select({
        ios: { shadowColor: palette.heroShadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
        android: { elevation: 3 },
      }),
    },
    orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
    orderId: { fontSize: 16, color: palette.text },
    orderTime: { fontSize: 12, color: palette.textMuted, marginTop: 2 },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    statusText: { fontSize: 11, fontWeight: '700' },
    orderDetails: { gap: 8, marginBottom: 12, paddingBottom: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: palette.border },
    orderDetailRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    orderDetailText: { fontSize: 13, color: palette.textMuted },
    orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    orderTotal: { fontSize: 18, color: palette.accent },
    viewButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    viewButtonText: { fontSize: 13, fontWeight: '600', color: palette.accent },
  });

