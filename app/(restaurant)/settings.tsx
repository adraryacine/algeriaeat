import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSession } from '@/providers/session-provider';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const settingsItems = [
  { id: 'profile', title: 'Profil du restaurant', icon: 'business', route: '' },
  { id: 'hours', title: 'Horaires d\'ouverture', icon: 'time', route: '' },
  { id: 'delivery', title: 'Zones de livraison', icon: 'location', route: '' },
  { id: 'payments', title: 'Paiements & Factures', icon: 'card', route: '' },
  { id: 'notifications', title: 'Notifications', icon: 'notifications', route: '' },
  { id: 'staff', title: 'Gestion du personnel', icon: 'people', route: '' },
  { id: 'integrations', title: 'Intégrations', icon: 'apps', route: '' },
  { id: 'support', title: 'Support', icon: 'help-circle', route: '' },
];

export default function RestaurantSettingsScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const styles = useMemo(() => createStyles(palette), [palette]);
  const { user, signOut, switchRole } = useSession();

  const restaurantName = user?.role === 'restaurant' ? user.restaurant_name : 'Mon Restaurant';

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <ThemedText type="subtitle" style={styles.headerTitle}>Paramètres</ThemedText>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Restaurant Info Card */}
        <View style={styles.restaurantCard}>
          <View style={styles.restaurantAvatar}>
            <Ionicons name="restaurant" size={32} color={palette.accent} />
          </View>
          <View style={styles.restaurantInfo}>
            <ThemedText type="defaultSemiBold" style={styles.restaurantName}>{restaurantName}</ThemedText>
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={14} color={palette.success} />
              <ThemedText style={styles.verifiedText}>Restaurant vérifié</ThemedText>
            </View>
          </View>
          <TouchableOpacity style={styles.editProfileButton}>
            <Ionicons name="create-outline" size={20} color={palette.accent} />
          </TouchableOpacity>
        </View>

        {/* Settings Menu */}
        <View style={styles.menuSection}>
          {settingsItems.map((item) => (
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
        </View>

        {/* Switch Mode Section */}
        <View style={styles.switchSection}>
          <ThemedText style={styles.switchSectionTitle}>Changer de mode</ThemedText>
          <TouchableOpacity style={styles.switchButton} onPress={() => switchRole('client')}>
            <Ionicons name="person" size={20} color={palette.accent} />
            <ThemedText style={styles.switchButtonText}>Mode Client</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.switchButton} onPress={() => switchRole('livreur')}>
            <Ionicons name="bicycle" size={20} color="#8B5CF6" />
            <ThemedText style={[styles.switchButtonText, { color: '#8B5CF6' }]}>Mode Livreur</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.switchButton} onPress={() => switchRole('admin')}>
            <Ionicons name="shield" size={20} color="#F59E0B" />
            <ThemedText style={[styles.switchButtonText, { color: '#F59E0B' }]}>Mode Admin</ThemedText>
          </TouchableOpacity>
        </View>

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
      paddingHorizontal: 20,
      paddingBottom: 16,
      backgroundColor: palette.surface,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: palette.border,
    },
    headerTitle: { fontSize: 22, fontWeight: '700', color: palette.text },
    scrollView: { flex: 1 },
    restaurantCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: palette.surface,
      margin: 20,
      padding: 16,
      borderRadius: 16,
    },
    restaurantAvatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: palette.accentMuted,
      justifyContent: 'center',
      alignItems: 'center',
    },
    restaurantInfo: { flex: 1, marginLeft: 12 },
    restaurantName: { fontSize: 18, color: palette.text },
    verifiedBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 },
    verifiedText: { fontSize: 12, color: palette.success },
    editProfileButton: { padding: 8 },
    menuSection: {
      backgroundColor: palette.surface,
      marginHorizontal: 20,
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
