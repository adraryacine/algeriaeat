import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useOrders } from '@/providers/orders-provider';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import React, { Fragment, useMemo } from 'react';
import {
  Dimensions,
  FlatList,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function LivreurMapScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const styles = useMemo(() => createStyles(palette), [palette]);
  const { orders } = useOrders();

  const deliveries = orders.slice(0, 4).map((order, index) => ({
    id: order.id,
    restaurant: order.restaurant,
    status: index === 0 ? 'en route' : index === 1 ? 'en attente' : 'planifiée',
    earnings: 300 + index * 50,
    eta: `${10 + index * 5} min`,
    distance: `${(1.2 + index * 0.3).toFixed(1)} km`,
    pickup: {
      latitude: 36.7738 - index * 0.01,
      longitude: 3.0588 + index * 0.01,
    },
    dropoff: {
      latitude: 36.7538 - index * 0.01,
      longitude: 3.0688,
    },
  }));

  return (
    <ThemedView style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: deliveries[0]?.pickup.latitude ?? 36.7638,
          longitude: deliveries[0]?.pickup.longitude ?? 3.0588,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation
        followsUserLocation>
        {deliveries.map((delivery) => (
          <Fragment key={delivery.id}>
            <Marker
              coordinate={delivery.pickup}
              title={delivery.restaurant}
              description="Pickup"
              pinColor="#4CAF50"
            />
            <Marker
              coordinate={delivery.dropoff}
              title="Client"
              description={delivery.eta}
              pinColor="#FF6B6B"
            />
          </Fragment>
        ))}
      </MapView>

      {/* Map controls */}
      <View style={[styles.topControls, { top: insets.top + 10 }]}>
        <TouchableOpacity style={styles.controlButton}>
          <Ionicons name="menu" size={22} color={palette.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton}>
          <Ionicons name="locate" size={22} color={palette.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton}>
          <Ionicons name="layers" size={22} color={palette.text} />
        </TouchableOpacity>
      </View>

      {/* Bottom sheet */}
      <View style={[styles.bottomSheet, { paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.sheetHeader}>
          <View>
            <ThemedText type="subtitle" style={styles.sheetTitle}>
              Missions du jour
            </ThemedText>
            <ThemedText style={styles.sheetSubtitle}>{deliveries.length} livraisons actives</ThemedText>
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options" size={18} color={palette.accent} />
            <ThemedText style={styles.filterText}>Filtrer</ThemedText>
          </TouchableOpacity>
        </View>

        <FlatList
          data={deliveries}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.deliveryCard}>
              <View style={styles.deliveryHeader}>
                <View>
                  <ThemedText type="defaultSemiBold" style={styles.deliveryRestaurant}>
                    {item.restaurant}
                  </ThemedText>
                  <ThemedText style={styles.deliveryId}>{item.id}</ThemedText>
                </View>
                <View
                  style={[
                    styles.deliveryStatus,
                    item.status === 'en route' && styles.statusActive,
                    item.status === 'en attente' && styles.statusPending,
                  ]}>
                  <ThemedText
                    style={[
                      styles.deliveryStatusText,
                      (item.status === 'en route' || item.status === 'en attente') && styles.deliveryStatusTextActive,
                    ]}>
                    {item.status}
                  </ThemedText>
                </View>
              </View>
              <View style={styles.deliveryMeta}>
                <View style={styles.metaRow}>
                  <Ionicons name="time" size={16} color={palette.icon} />
                  <ThemedText style={styles.metaText}>{item.eta}</ThemedText>
                </View>
                <View style={styles.metaRow}>
                  <Ionicons name="navigate" size={16} color={palette.icon} />
                  <ThemedText style={styles.metaText}>{item.distance}</ThemedText>
                </View>
                <View style={styles.metaRow}>
                  <Ionicons name="cash" size={16} color={palette.success} />
                  <ThemedText style={styles.metaText}>{item.earnings} DA</ThemedText>
                </View>
              </View>
              <View style={styles.deliveryActions}>
                <TouchableOpacity style={styles.actionPrimary}>
                  <Ionicons name="navigate" size={16} color="#FFFFFF" />
                  <ThemedText style={styles.actionPrimaryText}>Commencer</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionSecondary}>
                  <ThemedText style={styles.actionSecondaryText}>Détails</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </ThemedView>
  );
}

const createStyles = (palette: typeof Colors.light) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: palette.background },
    map: { flex: 1 },
    topControls: {
      position: 'absolute',
      left: 16,
      right: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    controlButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: palette.surface,
      justifyContent: 'center',
      alignItems: 'center',
      ...Platform.select({
        ios: { shadowColor: palette.heroShadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 6 },
        android: { elevation: 4 },
      }),
    },
    bottomSheet: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: palette.surface,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingHorizontal: 20,
      paddingTop: 16,
      maxHeight: SCREEN_WIDTH * 1.2,
      ...Platform.select({
        ios: { shadowColor: palette.heroShadow, shadowOffset: { width: 0, height: -6 }, shadowOpacity: 0.2, shadowRadius: 20 },
        android: { elevation: 12 },
      }),
    },
    sheetHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    sheetTitle: { fontSize: 20, fontWeight: '700', color: palette.text },
    sheetSubtitle: { fontSize: 13, color: palette.textMuted },
    filterButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: palette.accentMuted,
    },
    filterText: { fontSize: 13, color: palette.accent, fontWeight: '600' },
    deliveryCard: {
      backgroundColor: palette.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      ...Platform.select({
        ios: { shadowColor: palette.heroShadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6 },
        android: { elevation: 3 },
      }),
    },
    deliveryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    deliveryRestaurant: { fontSize: 16, fontWeight: '700', color: palette.text },
    deliveryId: { fontSize: 12, color: palette.textMuted },
    deliveryStatus: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      backgroundColor: palette.surfaceMuted,
    },
    statusActive: { backgroundColor: palette.accent },
    statusPending: { backgroundColor: palette.accentMuted },
    deliveryStatusText: { fontSize: 12, color: palette.text },
    deliveryStatusTextActive: { color: '#FFFFFF' },
    deliveryMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    metaText: { fontSize: 13, color: palette.textMuted, fontWeight: '500' },
    deliveryActions: { flexDirection: 'row', gap: 10 },
    actionPrimary: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingVertical: 10,
      borderRadius: 12,
      backgroundColor: palette.accent,
    },
    actionPrimaryText: { color: '#FFFFFF', fontWeight: '700' },
    actionSecondary: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: palette.border,
    },
    actionSecondaryText: { color: palette.text, fontWeight: '600' },
  });
