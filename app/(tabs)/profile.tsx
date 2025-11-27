import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemeToggle } from '@/components/theme-toggle';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLoyalty } from '@/providers/loyalty-provider';
import { useSession } from '@/providers/session-provider';
import type { DeliveryAddress } from '@/types/user';

const menuItems = [
  { id: 1, title: 'Mes commandes', icon: 'receipt', route: '/(tabs)/orders', badge: '3' },
  { id: 2, title: 'Mes favoris', icon: 'heart', route: '', badge: '8' },
  { id: 3, title: 'Adresses', icon: 'location', route: '', badge: '2' },
  { id: 4, title: 'Moyens de paiement', icon: 'card', route: '', badge: '1' },
  { id: 5, title: 'Notifications', icon: 'notifications', route: '', badge: '5' },
  { id: 6, title: 'Paramètres', icon: 'settings', route: '' },
  { id: 7, title: 'Aide & Support', icon: 'help-circle', route: '' },
  { id: 8, title: 'À propos', icon: 'information-circle', route: '' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const palette = Colors[scheme];
  const styles = useMemo(() => createStyles(palette), [palette]);
  const { isAuthenticated, user, signOut, isLoading, switchRole } = useSession();
  const { loyalty } = useLoyalty();
  const stats = [
    { label: 'Commandes', value: '12', icon: 'receipt' },
    { label: 'Favoris', value: '8', icon: 'heart' },
    { label: 'Points', value: loyalty.points.toString(), icon: 'star' },
  ];
  // Get location from addresses for client, or wilaya for other roles
  const getLocation = () => {
    if (!user) return 'Alger';
    if (user.role === 'client' && user.addresses?.length > 0) {
      const defaultAddr =
        (user.addresses.find((address: DeliveryAddress) => address.is_default) as DeliveryAddress | undefined) ||
        (user.addresses[0] as DeliveryAddress);
      return defaultAddr?.commune || defaultAddr?.wilaya || 'Alger';
    }
    if (user.role === 'restaurant') return user.commune || user.wilaya || 'Alger';
    if (user.role === 'livreur') return user.wilaya || 'Alger';
    return 'Alger';
  };

  const profile = {
    name: user?.name || 'Invité',
    email: user?.email || 'Connectez-vous pour plus de détails',
    location: getLocation(),
    phone: user?.phone || '+213 ••• •••',
    avatar: user?.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
  };

  if (!isAuthenticated) {
    return (
      <ThemedView style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
          <ThemedText type="subtitle" style={styles.headerTitle}>
            Profil
          </ThemedText>
        </View>
        <View style={styles.loginContainer}>
          <Ionicons name="person-circle-outline" size={80} color={palette.icon} />
          <ThemedText type="subtitle" style={styles.loginTitle}>
            Connectez-vous
          </ThemedText>
          <ThemedText style={styles.loginSubtitle}>
            Connectez-vous pour accéder à votre profil et vos commandes
          </ThemedText>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/login')}>
            <ThemedText style={styles.loginButtonText}>Se connecter</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.signupButton}
            onPress={() => router.push('/signup')}>
            <ThemedText style={styles.signupButtonText}>Créer un compte</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <ThemedText type="subtitle" style={styles.headerTitle}>
          Profil
        </ThemedText>
        <View style={styles.headerActions}>
          <ThemeToggle />
          <TouchableOpacity onPress={() => router.push('/edit-profile')}>
            <Ionicons name="create-outline" size={24} color={palette.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <Animated.View entering={FadeInDown.duration(600)} style={styles.loyaltyCard}>
          <LinearGradient
            colors={[palette.gradientPrimary[0], palette.gradientPrimary[1]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.loyaltyGradient}
          />
          <View style={styles.loyaltyContent}>
            <View style={styles.loyaltyHeader}>
              <View>
                <ThemedText style={styles.loyaltyLabel}>Niveau</ThemedText>
                <ThemedText style={styles.loyaltyTier}>{loyalty.tier.toUpperCase()}</ThemedText>
              </View>
              <View style={styles.loyaltyBadge}>
                <Ionicons name="star" size={16} color="#FDE68A" />
                <ThemedText style={styles.loyaltyBadgeText}>{loyalty.points} pts</ThemedText>
              </View>
            </View>
            <View style={styles.loyaltyProgress}>
              <View
                style={[
                  styles.loyaltyProgressFill,
                  { width: `${Math.min((loyalty.points / loyalty.nextTierPoints) * 100, 100)}%` },
                ]}
              />
            </View>
            <ThemedText style={styles.loyaltyNext}>Prochain palier: {loyalty.nextTierPoints} pts</ThemedText>
            <View style={styles.loyaltyBenefitsRow}>
              {loyalty.benefits.slice(0, 3).map((benefit: (typeof loyalty.benefits)[number]) => (
                <View key={benefit.id} style={styles.loyaltyBenefit}>
                  <Ionicons name={benefit.icon as any} size={18} color="#FFFFFF" />
                  <ThemedText style={styles.loyaltyBenefitText}>{benefit.label}</ThemedText>
                </View>
              ))}
            </View>
          </View>
        </Animated.View>

        {/* Profile Header */}
        <Animated.View entering={FadeInDown.duration(600)} style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: profile.avatar }}
              style={styles.avatar}
              contentFit="cover"
            />
            <TouchableOpacity
              style={styles.editAvatarButton}
              onPress={() => router.push('/edit-profile')}>
              <Ionicons name="camera" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <ThemedText type="title" style={styles.profileName}>
            {profile.name}
          </ThemedText>
          <ThemedText style={styles.profileEmail}>{profile.email}</ThemedText>
          <ThemedText style={styles.profilePhone}>{profile.phone}</ThemedText>
          <View style={styles.locationBadge}>
            <Ionicons name="location" size={16} color={palette.accent} />
            <ThemedText style={styles.locationText}>{profile.location}</ThemedText>
          </View>
          
          {/* Stats */}
          <View style={styles.statsContainer}>
            {stats.map((stat) => (
              <View key={stat.label} style={styles.statItem}>
                <Ionicons name={stat.icon as any} size={20} color={palette.accent} />
                <ThemedText type="defaultSemiBold" style={styles.statValue}>
                  {stat.value}
                </ThemedText>
                <ThemedText style={styles.statLabel}>{stat.label}</ThemedText>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Loyalty Details */}
        <Animated.View entering={FadeInDown.duration(400).delay(150)} style={styles.loyaltySection}>
          <View style={styles.loyaltySectionHeader}>
            <ThemedText type="subtitle" style={styles.loyaltySectionTitle}>
              Mes avantages
            </ThemedText>
            <TouchableOpacity>
              <ThemedText style={styles.loyaltyLink}>Historique</ThemedText>
            </TouchableOpacity>
          </View>
          {loyalty.benefits.map((benefit: (typeof loyalty.benefits)[number]) => (
            <View key={benefit.id} style={styles.loyaltyBenefitRow}>
              <View style={styles.loyaltyBenefitIcon}>
                <Ionicons name={benefit.icon as any} size={18} color={palette.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText style={styles.loyaltyBenefitTitle}>{benefit.label}</ThemedText>
                <ThemedText style={styles.loyaltyBenefitDescription}>{benefit.description}</ThemedText>
              </View>
            </View>
          ))}
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(200)} style={styles.loyaltyGrid}>
          <View style={styles.referralCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="gift" size={20} color={palette.accent} />
              <ThemedText style={styles.cardHeaderText}>Parrainage</ThemedText>
            </View>
            <ThemedText style={styles.referralCode}>{loyalty.referral.code}</ThemedText>
            <ThemedText style={styles.referralHint}>Partage ton code pour gagner 300 pts</ThemedText>
            <View style={styles.referralStats}>
              <View>
                <ThemedText style={styles.referralStatValue}>{loyalty.referral.totalReferrals}</ThemedText>
                <ThemedText style={styles.referralStatLabel}>Filleuls</ThemedText>
              </View>
              <View>
                <ThemedText style={styles.referralStatValue}>{loyalty.referral.pendingRewards}</ThemedText>
                <ThemedText style={styles.referralStatLabel}>En attente</ThemedText>
              </View>
              <View>
                <ThemedText style={styles.referralStatValue}>{loyalty.referral.redeemedRewards}</ThemedText>
                <ThemedText style={styles.referralStatLabel}>Bonus</ThemedText>
              </View>
            </View>
            <TouchableOpacity style={styles.shareButton}>
              <Ionicons name="share-social" size={16} color="#FFFFFF" />
              <ThemedText style={styles.shareButtonText}>Partager</ThemedText>
            </TouchableOpacity>
          </View>

          <View style={styles.cashbackCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="wallet" size={20} color="#FFFFFF" />
              <ThemedText style={[styles.cardHeaderText, { color: '#FFFFFF' }]}>Cashback</ThemedText>
            </View>
            <ThemedText style={styles.cashbackBalance}>{loyalty.cashback.balance} {loyalty.cashback.currency}</ThemedText>
            <ThemedText style={styles.cashbackHint}>Disponible dans ton portefeuille</ThemedText>
            <View style={styles.cashbackRow}>
              <ThemedText style={styles.cashbackLabel}>En cours</ThemedText>
              <ThemedText style={styles.cashbackValue}>{loyalty.cashback.upcoming} {loyalty.cashback.currency}</ThemedText>
            </View>
            <TouchableOpacity style={styles.withdrawButton}>
              <ThemedText style={styles.withdrawButtonText}>Retirer</ThemedText>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(250)} style={styles.historySection}>
          <View style={styles.loyaltySectionHeader}>
            <ThemedText type="subtitle" style={styles.loyaltySectionTitle}>
              Activité fidélité
            </ThemedText>
            <TouchableOpacity>
              <ThemedText style={styles.loyaltyLink}>Voir tout</ThemedText>
            </TouchableOpacity>
          </View>
          {loyalty.history.map((item: (typeof loyalty.history)[number]) => (
            <View key={item.id} style={styles.historyRow}>
              <View style={styles.historyIcon}>
                <Ionicons
                  name={
                    item.type === 'order'
                      ? 'receipt'
                      : item.type === 'referral'
                        ? 'gift'
                        : item.type === 'cashback'
                          ? 'cash'
                          : 'sparkles'
                  }
                  size={18}
                  color={palette.accent}
                />
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText style={styles.historyTitle}>{item.title}</ThemedText>
                <ThemedText style={styles.historyDate}>{item.date}</ThemedText>
              </View>
              <ThemedText style={styles.historyPoints}>+{item.points} pts</ThemedText>
            </View>
          ))}
        </Animated.View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <Animated.View
              key={item.id}
              entering={FadeInDown.duration(400).delay(100 + index * 50)}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => item.route && router.push(item.route as any)}
                activeOpacity={0.7}>
                <View style={styles.menuItemLeft}>
                  <View style={styles.menuItemIcon}>
                    <Ionicons name={item.icon as any} size={22} color={palette.accent} />
                  </View>
                  <ThemedText style={styles.menuItemTitle}>{item.title}</ThemedText>
                </View>
                <View style={styles.menuItemRight}>
                  {item.badge && (
                    <View style={styles.badge}>
                      <ThemedText style={styles.badgeText}>{item.badge}</ThemedText>
                    </View>
                  )}
                  <Ionicons name="chevron-forward" size={20} color={palette.icon} />
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Role Switch Section */}
        <Animated.View entering={FadeInDown.duration(400).delay(500)} style={styles.switchSection}>
          <ThemedText style={styles.switchSectionTitle}>Mode démo</ThemedText>
          <TouchableOpacity style={styles.switchButton} onPress={() => switchRole('restaurant')}>
            <Ionicons name="restaurant" size={20} color={palette.success} />
            <ThemedText style={[styles.switchButtonText, { color: palette.success }]}>Mode Restaurant</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.switchButton} onPress={() => switchRole('livreur')}>
            <Ionicons name="bicycle" size={20} color="#8B5CF6" />
            <ThemedText style={[styles.switchButtonText, { color: '#8B5CF6' }]}>Mode Livreur</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.switchButton} onPress={() => switchRole('admin')}>
            <Ionicons name="shield" size={20} color="#F59E0B" />
            <ThemedText style={[styles.switchButtonText, { color: '#F59E0B' }]}>Mode Admin</ThemedText>
          </TouchableOpacity>
        </Animated.View>

        {/* Logout Button */}
        <Animated.View entering={FadeInDown.duration(400).delay(600)} style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
            <Ionicons name="log-out-outline" size={20} color={palette.danger} />
            <ThemedText style={[styles.logoutButtonText, { color: palette.danger }]}>Déconnexion</ThemedText>
          </TouchableOpacity>
        </Animated.View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </ThemedView>
  );
}

const createStyles = (palette: typeof Colors.light) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: palette.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingBottom: 16,
      backgroundColor: palette.surface,
      borderBottomWidth: 1,
      borderBottomColor: palette.border,
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: palette.text,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    scrollView: {
      flex: 1,
    },
    loginContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
      gap: 12,
    },
    loginTitle: {
      fontSize: 24,
      fontWeight: '700',
      marginTop: 24,
      marginBottom: 8,
      color: palette.text,
    },
    loginSubtitle: {
      fontSize: 15,
      color: palette.textMuted,
      textAlign: 'center',
      marginBottom: 32,
      fontWeight: '500',
    },
    loginButton: {
      width: '100%',
      backgroundColor: palette.accent,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginBottom: 12,
    },
    loginButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '700',
    },
    signupButton: {
      width: '100%',
      backgroundColor: palette.surfaceMuted,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: palette.border,
    },
    signupButtonText: {
      color: palette.text,
      fontSize: 16,
      fontWeight: '600',
    },
    loyaltyCard: {
      margin: 20,
      borderRadius: 24,
      overflow: 'hidden',
      position: 'relative',
      backgroundColor: palette.surface,
    },
    loyaltyGradient: {
      ...StyleSheet.absoluteFillObject,
      opacity: 0.9,
    },
    loyaltyContent: {
      padding: 20,
      gap: 16,
    },
    loyaltyHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    loyaltyLabel: {
      color: '#D1FAE5',
      fontSize: 13,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    loyaltyTier: {
      fontSize: 26,
      color: '#FFFFFF',
      fontWeight: '800',
    },
    loyaltyBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.25)',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
      gap: 4,
    },
    loyaltyBadgeText: {
      color: '#FFFFFF',
      fontWeight: '700',
    },
    loyaltyProgress: {
      width: '100%',
      height: 8,
      borderRadius: 999,
      backgroundColor: 'rgba(255,255,255,0.2)',
      overflow: 'hidden',
    },
    loyaltyProgressFill: {
      height: '100%',
      backgroundColor: '#FCD34D',
    },
    loyaltyNext: {
      color: '#F8FAFC',
      fontSize: 13,
    },
    loyaltyBenefitsRow: {
      flexDirection: 'row',
      gap: 12,
    },
    loyaltyBenefit: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.2)',
      padding: 10,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    loyaltyBenefitText: {
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: '600',
    },
    loyaltySection: {
      backgroundColor: palette.surface,
      marginHorizontal: 20,
      borderRadius: 20,
      padding: 18,
      marginBottom: 16,
    },
    loyaltySectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    loyaltySectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: palette.text,
    },
    loyaltyLink: {
      fontSize: 13,
      color: palette.accent,
      fontWeight: '600',
    },
    loyaltyBenefitRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 10,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: palette.border,
    },
    loyaltyBenefitIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: palette.accentMuted,
    },
    loyaltyBenefitTitle: {
      fontSize: 15,
      color: palette.text,
      fontWeight: '600',
    },
    loyaltyBenefitDescription: {
      fontSize: 13,
      color: palette.textMuted,
    },
    loyaltyGrid: {
      flexDirection: 'row',
      gap: 12,
      marginHorizontal: 20,
      marginBottom: 16,
      flexWrap: 'wrap',
    },
    referralCard: {
      flex: 1,
      minWidth: 160,
      backgroundColor: palette.surface,
      borderRadius: 20,
      padding: 18,
      gap: 10,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: palette.border,
    },
    cashbackCard: {
      flex: 1,
      minWidth: 160,
      borderRadius: 20,
      padding: 18,
      gap: 12,
      backgroundColor: palette.accent,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 4,
    },
    cardHeaderText: {
      fontSize: 14,
      fontWeight: '700',
      color: palette.text,
    },
    referralCode: {
      fontSize: 24,
      fontWeight: '800',
      letterSpacing: 1,
      color: palette.text,
    },
    referralHint: {
      fontSize: 13,
      color: palette.textMuted,
    },
    referralStats: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
    },
    referralStatValue: {
      fontSize: 18,
      fontWeight: '700',
      color: palette.text,
      textAlign: 'center',
    },
    referralStatLabel: {
      fontSize: 12,
      color: palette.textMuted,
      textAlign: 'center',
    },
    shareButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingVertical: 10,
      borderRadius: 12,
      backgroundColor: palette.accent,
    },
    shareButtonText: {
      color: '#FFFFFF',
      fontWeight: '600',
    },
    cashbackBalance: {
      fontSize: 28,
      color: '#FFFFFF',
      fontWeight: '800',
    },
    cashbackHint: {
      fontSize: 13,
      color: 'rgba(255,255,255,0.85)',
    },
    cashbackRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    cashbackLabel: {
      fontSize: 13,
      color: 'rgba(255,255,255,0.8)',
    },
    cashbackValue: {
      fontSize: 16,
      color: '#FFFFFF',
      fontWeight: '700',
    },
    withdrawButton: {
      marginTop: 8,
      paddingVertical: 10,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.4)',
      alignItems: 'center',
    },
    withdrawButtonText: {
      color: '#FFFFFF',
      fontWeight: '600',
    },
    historySection: {
      backgroundColor: palette.surface,
      marginHorizontal: 20,
      borderRadius: 20,
      padding: 18,
      marginBottom: 20,
    },
    historyRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: palette.border,
    },
    historyIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: palette.accentMuted,
      marginRight: 12,
    },
    historyTitle: {
      fontSize: 15,
      color: palette.text,
      fontWeight: '600',
    },
    historyDate: {
      fontSize: 12,
      color: palette.textMuted,
    },
    historyPoints: {
      fontSize: 14,
      color: palette.accent,
      fontWeight: '700',
    },
    profileHeader: {
      backgroundColor: palette.surface,
      alignItems: 'center',
      padding: 30,
      marginBottom: 20,
      borderRadius: 24,
      marginHorizontal: 20,
      shadowColor: palette.heroShadow,
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 10 },
      shadowRadius: 25,
    },
    avatarContainer: {
      position: 'relative',
      marginBottom: 16,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
    },
    editAvatarButton: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: palette.accent,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 3,
      borderColor: palette.surface,
      ...Platform.select({
        ios: {
          shadowColor: palette.heroShadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      marginTop: 24,
      paddingTop: 24,
      borderTopWidth: 1,
      borderTopColor: palette.border,
    },
    statItem: {
      alignItems: 'center',
      gap: 4,
    },
    statValue: {
      fontSize: 20,
      color: palette.text,
      fontWeight: '700',
    },
    statLabel: {
      fontSize: 12,
      color: palette.textMuted,
      fontWeight: '500',
    },
    profileName: {
      fontSize: 24,
      fontWeight: '700',
      marginBottom: 4,
      color: palette.text,
    },
    profileEmail: {
      fontSize: 15,
      color: palette.textMuted,
      marginBottom: 4,
      fontWeight: '500',
    },
    profilePhone: {
      fontSize: 15,
      color: palette.textMuted,
      marginBottom: 8,
      fontWeight: '500',
    },
    locationBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: palette.accentMuted,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      alignSelf: 'center',
      gap: 6,
    },
    locationText: {
      fontSize: 14,
      fontWeight: '700',
      color: palette.accent,
    },
    menuSection: {
      backgroundColor: palette.surface,
      marginBottom: 20,
      borderRadius: 24,
      marginHorizontal: 20,
      overflow: 'hidden',
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: palette.border,
    },
    menuItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    menuItemIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: palette.accentMuted,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    menuItemTitle: {
      fontSize: 16,
      color: palette.text,
      fontWeight: '600',
    },
    menuItemRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    badge: {
      backgroundColor: palette.accent,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 12,
      minWidth: 24,
      alignItems: 'center',
    },
    badgeText: {
      color: '#FFFFFF',
      fontSize: 11,
      fontWeight: '700',
    },
    switchSection: {
      paddingHorizontal: 20,
      marginBottom: 16,
    },
    switchSectionTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: palette.textMuted,
      marginBottom: 12,
    },
    switchButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: palette.surface,
      padding: 16,
      borderRadius: 12,
      gap: 12,
      marginBottom: 8,
    },
    switchButtonText: {
      fontSize: 16,
      fontWeight: '600',
    },
    logoutSection: {
      paddingHorizontal: 20,
    },
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
    logoutButtonText: {
      fontSize: 16,
      fontWeight: '600',
    },
  });

