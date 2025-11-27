import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSession } from '@/providers/session-provider';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useMemo } from 'react';
import { Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const menuItems = [
  { id: 'vehicle', title: 'Mon véhicule', icon: 'bicycle', route: '' },
  { id: 'documents', title: 'Mes documents', icon: 'document-text', route: '' },
  { id: 'zones', title: 'Zones de livraison', icon: 'location', route: '' },
  { id: 'schedule', title: 'Mon planning', icon: 'calendar', route: '' },
  { id: 'ratings', title: 'Mes évaluations', icon: 'star', route: '' },
  { id: 'notifications', title: 'Notifications', icon: 'notifications', route: '' },
  { id: 'help', title: 'Aide & Support', icon: 'help-circle', route: '' },
];

export default function LivreurProfileScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const styles = useMemo(() => createStyles(palette), [palette]);
  const { user, signOut, switchRole } = useSession();

  const livreurStats = user?.role === 'livreur' ? {
    deliveries: user.total_deliveries || 0,
    rating: user.average_rating || 0,
    earnings: user.total_earnings || 0,
  } : { deliveries: 245, rating: 4.8, earnings: 125000 };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <ThemedText type="subtitle" style={styles.headerTitle}>Mon profil</ThemedText>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color={palette.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <Animated.View entering={FadeInDown.duration(600)} style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} contentFit="cover" />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={40} color={palette.accent} />
              </View>
            )}
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={20} color={palette.success} />
            </View>
          </View>
          <ThemedText type="title" style={styles.userName}>{user?.name || 'Livreur'}</ThemedText>
          <ThemedText style={styles.userEmail}>{user?.email}</ThemedText>
          <View style={styles.vehicleBadge}>
            <Ionicons name="bicycle" size={14} color={palette.accent} />
            <ThemedText style={styles.vehicleText}>Moto</ThemedText>
          </View>
        </Animated.View>

        {/* Stats */}
        <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.statsContainer}>
          <View style={styles.statItem}>
            <ThemedText style={styles.statValue}>{livreurStats.deliveries}</ThemedText>
            <ThemedText style={styles.statLabel}>Livraisons</ThemedText>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <View style={styles.ratingValue}>
              <ThemedText style={styles.statValue}>{livreurStats.rating}</ThemedText>
              <Ionicons name="star" size={16} color="#FFD700" />
            </View>
            <ThemedText style={styles.statLabel}>Note</ThemedText>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <ThemedText style={styles.statValue}>{(livreurStats.earnings / 1000).toFixed(0)}K</ThemedText>
            <ThemedText style={styles.statLabel}>Gains (DA)</ThemedText>
          </View>
        </Animated.View>

        {/* Menu Items */}
        <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.menuSection}>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem} activeOpacity={0.7}>
              <View style={styles.menuItemLeft}>
                <View style={styles.menuItemIcon}>
                  <Ionicons name={item.icon as any} size={22} color={palette.accent} />
                </View>
                <ThemedText style={styles.menuItemTitle}>{item.title}</ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={20} color={palette.icon} />
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Switch Mode */}
        <Animated.View entering={FadeInDown.duration(600).delay(300)} style={styles.switchSection}>
          <ThemedText style={styles.switchSectionTitle}>Changer de mode</ThemedText>
          <TouchableOpacity style={styles.switchButton} onPress={() => switchRole('client')}>
            <Ionicons name="person" size={20} color={palette.accent} />
            <ThemedText style={styles.switchButtonText}>Mode Client</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.switchButton} onPress={() => switchRole('restaurant')}>
            <Ionicons name="restaurant" size={20} color={palette.success} />
            <ThemedText style={[styles.switchButtonText, { color: palette.success }]}>Mode Restaurant</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.switchButton} onPress={() => switchRole('admin')}>
            <Ionicons name="shield" size={20} color="#F59E0B" />
            <ThemedText style={[styles.switchButtonText, { color: '#F59E0B' }]}>Mode Admin</ThemedText>
          </TouchableOpacity>
        </Animated.View>

        {/* Logout */}
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
            <Ionicons name="log-out-outline" size={20} color={palette.danger} />
            <ThemedText style={styles.logoutButtonText}>Déconnexion</ThemedText>
          </TouchableOpacity>
        </View>

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
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingBottom: 16,
      backgroundColor: palette.surface,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: palette.border,
    },
    headerTitle: { fontSize: 22, fontWeight: '700', color: palette.text },
    settingsButton: { padding: 8 },
    scrollView: { flex: 1 },
    profileCard: {
      alignItems: 'center',
      paddingVertical: 24,
      paddingHorizontal: 20,
      backgroundColor: palette.surface,
      marginHorizontal: 20,
      marginTop: 20,
      borderRadius: 20,
      ...Platform.select({
        ios: { shadowColor: palette.heroShadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12 },
        android: { elevation: 4 },
      }),
    },
    avatarContainer: { position: 'relative' },
    avatar: { width: 80, height: 80, borderRadius: 40 },
    avatarPlaceholder: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: palette.accentMuted,
      justifyContent: 'center',
      alignItems: 'center',
    },
    verifiedBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: palette.surface, borderRadius: 12 },
    userName: { fontSize: 22, color: palette.text, marginTop: 12 },
    userEmail: { fontSize: 14, color: palette.textMuted, marginTop: 4 },
    vehicleBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: palette.accentMuted,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      marginTop: 12,
      gap: 6,
    },
    vehicleText: { fontSize: 13, fontWeight: '600', color: palette.accent },
    statsContainer: {
      flexDirection: 'row',
      backgroundColor: palette.surface,
      marginHorizontal: 20,
      marginTop: 16,
      borderRadius: 16,
      padding: 20,
    },
    statItem: { flex: 1, alignItems: 'center' },
    statDivider: { width: 1, backgroundColor: palette.border },
    statValue: { fontSize: 22, fontWeight: '800', color: palette.text },
    ratingValue: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    statLabel: { fontSize: 12, color: palette.textMuted, marginTop: 4 },
    menuSection: {
      backgroundColor: palette.surface,
      marginHorizontal: 20,
      marginTop: 20,
      borderRadius: 16,
      overflow: 'hidden',
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: palette.border,
    },
    menuItemLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    menuItemIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: palette.accentMuted,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    menuItemTitle: { fontSize: 16, color: palette.text, fontWeight: '500' },
    switchSection: { paddingHorizontal: 20, marginTop: 24 },
    switchSectionTitle: { fontSize: 14, fontWeight: '600', color: palette.textMuted, marginBottom: 12 },
    switchButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: palette.surface,
      padding: 16,
      borderRadius: 12,
      gap: 12,
      marginBottom: 8,
    },
    switchButtonText: { fontSize: 16, fontWeight: '600', color: palette.accent },
    logoutSection: { paddingHorizontal: 20, marginTop: 24 },
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: palette.surface,
      padding: 16,
      borderRadius: 12,
      gap: 8,
      borderWidth: 1,
      borderColor: palette.danger,
    },
    logoutButtonText: { fontSize: 16, fontWeight: '600', color: palette.danger },
  });
