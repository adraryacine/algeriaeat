import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { Dimensions, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function LivreurMapScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const styles = useMemo(() => createStyles(palette), [palette]);

  return (
    <ThemedView style={styles.container}>
      {/* Map Placeholder */}
      <View style={styles.mapContainer}>
        <View style={[styles.mapPlaceholder, { backgroundColor: colorScheme === 'dark' ? '#1a1a2e' : '#E8F4FD' }]}>
          <Ionicons name="map" size={64} color={palette.textMuted} />
          <ThemedText style={styles.mapPlaceholderText}>Carte en cours de chargement...</ThemedText>
          <ThemedText style={styles.mapSubtext}>Intégration Google Maps / Mapbox</ThemedText>
        </View>
      </View>

      {/* Top Controls */}
      <View style={[styles.topControls, { top: insets.top + 10 }]}>
        <TouchableOpacity style={styles.controlButton}>
          <Ionicons name="menu" size={24} color={palette.text} />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={palette.icon} />
          <ThemedText style={styles.searchText}>Rechercher une adresse...</ThemedText>
        </View>
        <TouchableOpacity style={styles.controlButton}>
          <Ionicons name="layers" size={24} color={palette.text} />
        </TouchableOpacity>
      </View>

      {/* Bottom Card */}
      <View style={[styles.bottomCard, { paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.activeDeliveryHeader}>
          <View style={styles.activeIndicator} />
          <ThemedText type="defaultSemiBold" style={styles.activeDeliveryTitle}>Livraison en cours</ThemedText>
        </View>

        <View style={styles.deliveryInfo}>
          <View style={styles.routeInfo}>
            <View style={styles.routePoint}>
              <View style={[styles.routeDot, { backgroundColor: palette.success }]} />
              <View style={styles.routeDetails}>
                <ThemedText style={styles.routeLabel}>Récupération</ThemedText>
                <ThemedText style={styles.routeAddress}>Le Gourmet Algérien</ThemedText>
                <ThemedText style={styles.routeSubtext}>Rue Didouche Mourad, Alger</ThemedText>
              </View>
            </View>
            <View style={styles.routeLine} />
            <View style={styles.routePoint}>
              <View style={[styles.routeDot, { backgroundColor: palette.accent }]} />
              <View style={styles.routeDetails}>
                <ThemedText style={styles.routeLabel}>Livraison</ThemedText>
                <ThemedText style={styles.routeAddress}>Ahmed Benali</ThemedText>
                <ThemedText style={styles.routeSubtext}>45 Rue Larbi Ben M'hidi, Alger</ThemedText>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.deliveryStats}>
          <View style={styles.stat}>
            <Ionicons name="time" size={18} color={palette.accent} />
            <ThemedText style={styles.statValue}>12 min</ThemedText>
            <ThemedText style={styles.statLabel}>ETA</ThemedText>
          </View>
          <View style={styles.stat}>
            <Ionicons name="navigate" size={18} color={palette.accent} />
            <ThemedText style={styles.statValue}>2.3 km</ThemedText>
            <ThemedText style={styles.statLabel}>Distance</ThemedText>
          </View>
          <View style={styles.stat}>
            <Ionicons name="cash" size={18} color={palette.success} />
            <ThemedText style={styles.statValue}>400 DA</ThemedText>
            <ThemedText style={styles.statLabel}>Gain</ThemedText>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.callButton}>
            <Ionicons name="call" size={20} color={palette.accent} />
            <ThemedText style={styles.callButtonText}>Appeler</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navigateButton}>
            <Ionicons name="navigate" size={20} color="#FFFFFF" />
            <ThemedText style={styles.navigateButtonText}>Naviguer</ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Floating Controls */}
      <View style={styles.floatingControls}>
        <TouchableOpacity style={styles.floatingButton}>
          <Ionicons name="locate" size={22} color={palette.accent} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.floatingButton}>
          <Ionicons name="compass" size={22} color={palette.accent} />
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const createStyles = (palette: typeof Colors.light) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: palette.background },
    mapContainer: { flex: 1 },
    mapPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    mapPlaceholderText: { fontSize: 16, color: palette.textMuted, marginTop: 16 },
    mapSubtext: { fontSize: 12, color: palette.textMuted, marginTop: 4 },
    topControls: {
      position: 'absolute',
      left: 20,
      right: 20,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    controlButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: palette.surface,
      justifyContent: 'center',
      alignItems: 'center',
      ...Platform.select({
        ios: { shadowColor: palette.heroShadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 8 },
        android: { elevation: 4 },
      }),
    },
    searchBar: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: palette.surface,
      borderRadius: 22,
      paddingHorizontal: 16,
      height: 44,
      gap: 8,
      ...Platform.select({
        ios: { shadowColor: palette.heroShadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 8 },
        android: { elevation: 4 },
      }),
    },
    searchText: { fontSize: 14, color: palette.textMuted },
    bottomCard: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: palette.surface,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingHorizontal: 20,
      paddingTop: 20,
      ...Platform.select({
        ios: { shadowColor: palette.heroShadow, shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.15, shadowRadius: 12 },
        android: { elevation: 8 },
      }),
    },
    activeDeliveryHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    activeIndicator: { width: 10, height: 10, borderRadius: 5, backgroundColor: palette.success, marginRight: 8 },
    activeDeliveryTitle: { fontSize: 16, color: palette.text },
    deliveryInfo: { marginBottom: 16 },
    routeInfo: {},
    routePoint: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
    routeDot: { width: 12, height: 12, borderRadius: 6, marginTop: 4 },
    routeDetails: { flex: 1 },
    routeLabel: { fontSize: 11, color: palette.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
    routeAddress: { fontSize: 15, fontWeight: '600', color: palette.text, marginTop: 2 },
    routeSubtext: { fontSize: 12, color: palette.textMuted, marginTop: 2 },
    routeLine: { width: 2, height: 20, backgroundColor: palette.border, marginLeft: 5, marginVertical: 4 },
    deliveryStats: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 16, borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: palette.border, marginBottom: 16 },
    stat: { alignItems: 'center' },
    statValue: { fontSize: 16, fontWeight: '700', color: palette.text, marginTop: 4 },
    statLabel: { fontSize: 11, color: palette.textMuted, marginTop: 2 },
    actionButtons: { flexDirection: 'row', gap: 12 },
    callButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: palette.accentMuted,
      paddingVertical: 14,
      borderRadius: 12,
      gap: 8,
    },
    callButtonText: { fontSize: 15, fontWeight: '600', color: palette.accent },
    navigateButton: {
      flex: 2,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: palette.accent,
      paddingVertical: 14,
      borderRadius: 12,
      gap: 8,
    },
    navigateButtonText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
    floatingControls: {
      position: 'absolute',
      right: 20,
      bottom: 320,
      gap: 12,
    },
    floatingButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: palette.surface,
      justifyContent: 'center',
      alignItems: 'center',
      ...Platform.select({
        ios: { shadowColor: palette.heroShadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 8 },
        android: { elevation: 4 },
      }),
    },
  });
