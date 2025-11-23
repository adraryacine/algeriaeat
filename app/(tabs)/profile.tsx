import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

const stats = [
  { label: 'Commandes', value: '12', icon: 'receipt' },
  { label: 'Favoris', value: '8', icon: 'heart' },
  { label: 'Points', value: '450', icon: 'star' },
];

// Mock user profile - Miss Lqehba from Bejaia
const MOCK_USER_PROFILE = {
  name: 'Miss Lqehba',
  email: 'miss.lqehba@example.com',
  phone: '+213 555 123 789',
  city: 'Bejaia',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
};

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  
  // Check if user is logged in (in a real app, this would check AsyncStorage or context)
  React.useEffect(() => {
    // For demo purposes, we'll check if we should show logged in state
    // In a real app, this would come from a context or storage
  }, []);

  if (!isLoggedIn) {
    return (
      <ThemedView style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
          <ThemedText type="subtitle" style={styles.headerTitle}>
            Profil
          </ThemedText>
        </View>
        <View style={styles.loginContainer}>
          <Ionicons name="person-circle-outline" size={80} color="#CCC" />
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
        <TouchableOpacity onPress={() => router.push('/edit-profile')}>
          <Ionicons name="create-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Profile Header */}
        <Animated.View entering={FadeInDown.duration(600)} style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: MOCK_USER_PROFILE.avatar }}
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
            {MOCK_USER_PROFILE.name}
          </ThemedText>
          <ThemedText style={styles.profileEmail}>{MOCK_USER_PROFILE.email}</ThemedText>
          <ThemedText style={styles.profilePhone}>{MOCK_USER_PROFILE.phone}</ThemedText>
          <View style={styles.locationBadge}>
            <Ionicons name="location" size={16} color="#FF6B6B" />
            <ThemedText style={styles.locationText}>{MOCK_USER_PROFILE.city}</ThemedText>
          </View>
          
          {/* Stats */}
          <View style={styles.statsContainer}>
            {stats.map((stat) => (
              <View key={stat.label} style={styles.statItem}>
                <Ionicons name={stat.icon as any} size={20} color="#FF6B6B" />
                <ThemedText type="defaultSemiBold" style={styles.statValue}>
                  {stat.value}
                </ThemedText>
                <ThemedText style={styles.statLabel}>{stat.label}</ThemedText>
              </View>
            ))}
          </View>
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
                    <Ionicons name={item.icon as any} size={22} color="#FF6B6B" />
                  </View>
                  <ThemedText style={styles.menuItemTitle}>{item.title}</ThemedText>
                </View>
                <View style={styles.menuItemRight}>
                  {item.badge && (
                    <View style={styles.badge}>
                      <ThemedText style={styles.badgeText}>{item.badge}</ThemedText>
                    </View>
                  )}
                  <Ionicons name="chevron-forward" size={20} color="#999" />
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Logout Button */}
        <Animated.View entering={FadeInDown.duration(400).delay(500)} style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={() => setIsLoggedIn(false)}>
            <Ionicons name="log-out-outline" size={20} color="#FF6B6B" />
            <ThemedText style={styles.logoutButtonText}>Déconnexion</ThemedText>
          </TouchableOpacity>
        </Animated.View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 8,
    color: '#000000',
  },
  loginSubtitle: {
    fontSize: 15,
    color: '#4A4A4A',
    textAlign: 'center',
    marginBottom: 32,
    fontWeight: '500',
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#FF6B6B',
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
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  signupButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  profileHeader: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    padding: 30,
    marginBottom: 20,
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
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
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
    borderTopColor: '#F0F0F0',
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 20,
    color: '#000000',
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    color: '#4A4A4A',
    fontWeight: '500',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
    color: '#000000',
  },
  profileEmail: {
    fontSize: 15,
    color: '#4A4A4A',
    marginBottom: 4,
    fontWeight: '500',
  },
  profilePhone: {
    fontSize: 15,
    color: '#4A4A4A',
    marginBottom: 8,
    fontWeight: '500',
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'center',
    gap: 6,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF6B6B',
  },
  menuSection: {
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
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
    backgroundColor: '#FFF5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemTitle: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '600',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    backgroundColor: '#FF6B6B',
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
  logoutSection: {
    paddingHorizontal: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B6B',
  },
});

