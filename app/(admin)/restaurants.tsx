import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useMemo, useState } from 'react';
import { FlatList, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const restaurantFilters = ['Tous', 'En attente', 'Vérifiés', 'Suspendus'];

const mockRestaurants = [
  { id: '1', name: 'Le Gourmet Algérien', cuisine: 'Algérien', wilaya: 'Alger', status: 'verified', rating: 4.8, orders: 1250, image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200' },
  { id: '2', name: 'Pizza Palace', cuisine: 'Italien', wilaya: 'Oran', status: 'verified', rating: 4.5, orders: 890, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200' },
  { id: '3', name: 'Nouveau Restaurant', cuisine: 'Fast Food', wilaya: 'Constantine', status: 'pending', rating: 0, orders: 0, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200' },
  { id: '4', name: 'Sushi Master', cuisine: 'Japonais', wilaya: 'Alger', status: 'suspended', rating: 3.2, orders: 156, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=200' },
];

export default function AdminRestaurantsScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const styles = useMemo(() => createStyles(palette), [palette]);
  const [selectedFilter, setSelectedFilter] = useState(0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return palette.success;
      case 'pending': return '#F59E0B';
      case 'suspended': return palette.danger;
      default: return palette.textMuted;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'verified': return 'Vérifié';
      case 'pending': return 'En attente';
      case 'suspended': return 'Suspendu';
      default: return status;
    }
  };

  const renderRestaurant = ({ item, index }: { item: typeof mockRestaurants[0]; index: number }) => (
    <Animated.View entering={FadeInDown.duration(400).delay(index * 50)}>
      <TouchableOpacity style={styles.restaurantCard} activeOpacity={0.7}>
        <Image source={{ uri: item.image }} style={styles.restaurantImage} contentFit="cover" />
        <View style={styles.restaurantInfo}>
          <View style={styles.restaurantHeader}>
            <ThemedText type="defaultSemiBold" style={styles.restaurantName}>{item.name}</ThemedText>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
              <ThemedText style={[styles.statusText, { color: getStatusColor(item.status) }]}>{getStatusLabel(item.status)}</ThemedText>
            </View>
          </View>
          <ThemedText style={styles.restaurantCuisine}>{item.cuisine} • {item.wilaya}</ThemedText>
          <View style={styles.restaurantMeta}>
            {item.rating > 0 && (
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={12} color="#FFD700" />
                <ThemedText style={styles.ratingText}>{item.rating}</ThemedText>
              </View>
            )}
            <ThemedText style={styles.orderCount}>{item.orders} commandes</ThemedText>
          </View>
        </View>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="ellipsis-vertical" size={20} color={palette.icon} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <ThemedText type="subtitle" style={styles.headerTitle}>Restaurants</ThemedText>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterTabs}>
          {restaurantFilters.map((filter, index) => (
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
        data={mockRestaurants}
        renderItem={renderRestaurant}
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
    addButton: { backgroundColor: palette.accent, width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
    filterContainer: { backgroundColor: palette.surface, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: palette.border },
    filterTabs: { paddingHorizontal: 20, paddingVertical: 12, gap: 8 },
    filterTab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: palette.surfaceMuted, marginRight: 8 },
    filterTabActive: { backgroundColor: palette.accent },
    filterTabText: { fontSize: 14, fontWeight: '600', color: palette.textMuted },
    filterTabTextActive: { color: '#FFFFFF', fontWeight: '700' },
    listContent: { padding: 20 },
    restaurantCard: {
      flexDirection: 'row',
      backgroundColor: palette.card,
      borderRadius: 16,
      overflow: 'hidden',
      marginBottom: 12,
      ...Platform.select({
        ios: { shadowColor: palette.heroShadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
        android: { elevation: 3 },
      }),
    },
    restaurantImage: { width: 100, height: 100 },
    restaurantInfo: { flex: 1, padding: 12 },
    restaurantHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    restaurantName: { fontSize: 16, color: palette.text, flex: 1, marginRight: 8 },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
    statusText: { fontSize: 10, fontWeight: '700' },
    restaurantCuisine: { fontSize: 13, color: palette.textMuted, marginTop: 4 },
    restaurantMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 12 },
    ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    ratingText: { fontSize: 12, fontWeight: '600', color: palette.text },
    orderCount: { fontSize: 12, color: palette.textMuted },
    menuButton: { padding: 12, justifyContent: 'center' },
  });

