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

const userFilters = ['Tous', 'Clients', 'Restaurants', 'Livreurs'];

const mockUsers = [
  { id: '1', name: 'Ahmed Benali', email: 'ahmed@example.com', role: 'client', status: 'active', orders: 45, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
  { id: '2', name: 'Le Gourmet Algérien', email: 'gourmet@example.com', role: 'restaurant', status: 'active', orders: 1250, avatar: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=100' },
  { id: '3', name: 'Karim Messaoudi', email: 'karim@example.com', role: 'livreur', status: 'active', orders: 320, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
  { id: '4', name: 'Fatima Zohra', email: 'fatima@example.com', role: 'client', status: 'inactive', orders: 12, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
];

export default function AdminUsersScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const styles = useMemo(() => createStyles(palette), [palette]);
  const [selectedFilter, setSelectedFilter] = useState(0);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'client': return palette.accent;
      case 'restaurant': return palette.success;
      case 'livreur': return '#8B5CF6';
      default: return palette.textMuted;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'client': return 'Client';
      case 'restaurant': return 'Restaurant';
      case 'livreur': return 'Livreur';
      default: return role;
    }
  };

  const renderUser = ({ item, index }: { item: typeof mockUsers[0]; index: number }) => (
    <Animated.View entering={FadeInDown.duration(400).delay(index * 50)}>
      <TouchableOpacity style={styles.userCard} activeOpacity={0.7}>
        <Image source={{ uri: item.avatar }} style={styles.userAvatar} contentFit="cover" />
        <View style={styles.userInfo}>
          <ThemedText type="defaultSemiBold" style={styles.userName}>{item.name}</ThemedText>
          <ThemedText style={styles.userEmail}>{item.email}</ThemedText>
          <View style={styles.userMeta}>
            <View style={[styles.roleBadge, { backgroundColor: getRoleColor(item.role) + '20' }]}>
              <ThemedText style={[styles.roleText, { color: getRoleColor(item.role) }]}>{getRoleLabel(item.role)}</ThemedText>
            </View>
            <ThemedText style={styles.orderCount}>{item.orders} commandes</ThemedText>
          </View>
        </View>
        <View style={styles.userActions}>
          <View style={[styles.statusDot, { backgroundColor: item.status === 'active' ? palette.success : palette.textMuted }]} />
          <Ionicons name="chevron-forward" size={20} color={palette.icon} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <ThemedText type="subtitle" style={styles.headerTitle}>Utilisateurs</ThemedText>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterTabs}>
          {userFilters.map((filter, index) => (
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
        data={mockUsers}
        renderItem={renderUser}
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
    userCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: palette.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      ...Platform.select({
        ios: { shadowColor: palette.heroShadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
        android: { elevation: 3 },
      }),
    },
    userAvatar: { width: 50, height: 50, borderRadius: 25 },
    userInfo: { flex: 1, marginLeft: 12 },
    userName: { fontSize: 16, color: palette.text },
    userEmail: { fontSize: 13, color: palette.textMuted, marginTop: 2 },
    userMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 8 },
    roleBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
    roleText: { fontSize: 11, fontWeight: '600' },
    orderCount: { fontSize: 12, color: palette.textMuted },
    userActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    statusDot: { width: 8, height: 8, borderRadius: 4 },
  });

