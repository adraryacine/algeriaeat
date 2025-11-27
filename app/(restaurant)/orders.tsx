import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { FlatList, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const orderFilters = ['Toutes', 'En attente', 'En cours', 'Prêtes', 'Livrées'];

const mockOrders = [
  { id: 'ORD-1234', client: 'Ahmed B.', items: ['Couscous Royal x2', 'Chorba x1'], total: 3200, status: 'pending', time: '14:30', address: '45 Rue Didouche, Alger' },
  { id: 'ORD-1233', client: 'Fatima K.', items: ['Tajine Zitoune x1', 'Salade x2'], total: 2100, status: 'preparing', time: '14:25', address: '12 Bd Mohamed V, Alger' },
  { id: 'ORD-1232', client: 'Mohamed S.', items: ['Chakhchoukha x3'], total: 4500, status: 'ready', time: '14:20', address: '78 Rue Larbi Ben M\'hidi, Alger' },
  { id: 'ORD-1231', client: 'Sara L.', items: ['Rechta x2', 'Bourek x4'], total: 3800, status: 'delivered', time: '14:00', address: '23 Rue Abane Ramdane, Alger' },
];

export default function RestaurantOrdersScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const styles = useMemo(() => createStyles(palette), [palette]);
  const [selectedFilter, setSelectedFilter] = useState(0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#F59E0B';
      case 'preparing': return palette.accent;
      case 'ready': return palette.success;
      case 'delivered': return palette.textMuted;
      default: return palette.textMuted;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'preparing': return 'En préparation';
      case 'ready': return 'Prête';
      case 'delivered': return 'Livrée';
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
            <Ionicons name="person" size={14} color={palette.icon} />
            <ThemedText style={styles.orderDetailText}>{item.client}</ThemedText>
          </View>
          <View style={styles.orderDetailRow}>
            <Ionicons name="location" size={14} color={palette.icon} />
            <ThemedText style={styles.orderDetailText} numberOfLines={1}>{item.address}</ThemedText>
          </View>
        </View>

        <View style={styles.itemsList}>
          {item.items.map((orderItem, i) => (
            <ThemedText key={i} style={styles.itemText}>• {orderItem}</ThemedText>
          ))}
        </View>

        <View style={styles.orderFooter}>
          <ThemedText type="defaultSemiBold" style={styles.orderTotal}>{item.total} DA</ThemedText>
          {item.status === 'pending' && (
            <View style={styles.actionButtons}>
              <TouchableOpacity style={[styles.actionButton, styles.rejectButton]}>
                <Ionicons name="close" size={18} color={palette.danger} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.acceptButton]}>
                <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                <ThemedText style={styles.acceptButtonText}>Accepter</ThemedText>
              </TouchableOpacity>
            </View>
          )}
          {item.status === 'preparing' && (
            <TouchableOpacity style={[styles.actionButton, styles.readyButton]}>
              <Ionicons name="checkmark-done" size={18} color="#FFFFFF" />
              <ThemedText style={styles.acceptButtonText}>Marquer prête</ThemedText>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <ThemedText type="subtitle" style={styles.headerTitle}>Commandes</ThemedText>
        <TouchableOpacity style={styles.refreshButton}>
          <Ionicons name="refresh" size={24} color={palette.text} />
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
    refreshButton: { padding: 8 },
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
    orderDetails: { gap: 6, marginBottom: 12, paddingBottom: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: palette.border },
    orderDetailRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    orderDetailText: { fontSize: 13, color: palette.textMuted, flex: 1 },
    itemsList: { marginBottom: 12 },
    itemText: { fontSize: 14, color: palette.text, marginBottom: 4 },
    orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    orderTotal: { fontSize: 18, color: palette.accent },
    actionButtons: { flexDirection: 'row', gap: 8 },
    actionButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, gap: 4 },
    rejectButton: { backgroundColor: palette.danger + '15', borderWidth: 1, borderColor: palette.danger },
    acceptButton: { backgroundColor: palette.success },
    readyButton: { backgroundColor: palette.accent },
    acceptButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 13 },
  });
