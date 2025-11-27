import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInDown, FadeInRight, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const menuItems = [
  { id: 1, name: 'Couscous Royal', price: 1200, description: 'Couscous avec agneau, poulet et merguez', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300' },
  { id: 2, name: "Tajine d'Agneau", price: 1500, description: 'Tajine traditionnel avec légumes', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300' },
  { id: 3, name: 'Chorba', price: 400, description: 'Soupe traditionnelle algérienne', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300' },
  { id: 4, name: "Brik à l'œuf", price: 300, description: 'Feuille de brick avec œuf et thon', image: 'https://images.unsplash.com/photo-1565299585323-38174c0a5e0e?w=300' },
];

export default function RestaurantDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const styles = useMemo(() => createStyles(palette), [palette]);

  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<'menu' | 'reviews' | 'info'>('menu');

  const restaurant = {
    id: id,
    name: 'Le Gourmet Algérien',
    cuisine: 'Algérien • Traditionnel',
    rating: 4.8,
    deliveryTime: '25-35 min',
    deliveryFee: '150 DA',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
    description: 'Restaurant traditionnel algérien offrant les meilleurs plats de la cuisine locale avec des ingrédients frais et authentiques.',
    address: '123 Rue Didouche Mourad, Alger',
    phone: '+213 555 123 456',
    hours: 'Lun-Dim: 11h00 - 23h00',
  };

  const toggleItem = (itemId: number) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
      const newQuantities = { ...quantities };
      delete newQuantities[itemId];
      setQuantities(newQuantities);
    } else {
      setSelectedItems([...selectedItems, itemId]);
      setQuantities({ ...quantities, [itemId]: 1 });
    }
  };

  const updateQuantity = (itemId: number, delta: number) => {
    const newQty = (quantities[itemId] || 1) + delta;
    if (newQty > 0) {
      setQuantities({ ...quantities, [itemId]: newQty });
    }
  };

  const totalPrice = selectedItems.reduce((sum, itemId) => {
    const item = menuItems.find((i) => i.id === itemId);
    return sum + (item ? item.price * (quantities[itemId] || 1) : 0);
  }, 0);

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View style={styles.headerImageContainer}>
          <Image source={{ uri: restaurant.image }} style={styles.headerImage} contentFit="cover" />
          <LinearGradient colors={['transparent', 'rgba(0,0,0,0.7)']} style={styles.headerGradient} />
          <TouchableOpacity style={[styles.backButton, { top: insets.top + 10 }]} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <ThemedText style={styles.ratingText}>{restaurant.rating}</ThemedText>
            </View>
            <TouchableOpacity style={styles.favoriteButton} onPress={() => setIsFavorite(!isFavorite)}>
              <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={24} color={isFavorite ? palette.accent : '#FFFFFF'} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Restaurant Info */}
        <Animated.View entering={FadeInUp.duration(600)} style={styles.infoSection}>
          <ThemedText type="title" style={styles.restaurantName}>
            {restaurant.name}
          </ThemedText>
          <ThemedText style={styles.cuisine}>{restaurant.cuisine}</ThemedText>
          <ThemedText style={styles.description}>{restaurant.description}</ThemedText>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={18} color={palette.icon} />
              <ThemedText style={styles.metaText}>{restaurant.deliveryTime}</ThemedText>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="cash-outline" size={18} color={palette.icon} />
              <ThemedText style={styles.metaText}>{restaurant.deliveryFee}</ThemedText>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={18} color={palette.icon} />
              <ThemedText style={styles.metaText}>{restaurant.address}</ThemedText>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={() => router.push(`/reservation/${id}`)}>
              <Ionicons name="calendar-outline" size={20} color={palette.accent} />
              <ThemedText style={styles.actionButtonText}>Réserver</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="call-outline" size={20} color={palette.accent} />
              <ThemedText style={styles.actionButtonText}>Appeler</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="share-outline" size={20} color={palette.accent} />
              <ThemedText style={styles.actionButtonText}>Partager</ThemedText>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Tabs */}
        <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.tabsContainer}>
          <TouchableOpacity style={[styles.tab, activeTab === 'menu' && styles.tabActive]} onPress={() => setActiveTab('menu')}>
            <ThemedText style={[styles.tabText, activeTab === 'menu' && styles.tabTextActive]}>Menu</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, activeTab === 'reviews' && styles.tabActive]} onPress={() => setActiveTab('reviews')}>
            <ThemedText style={[styles.tabText, activeTab === 'reviews' && styles.tabTextActive]}>Avis (24)</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, activeTab === 'info' && styles.tabActive]} onPress={() => setActiveTab('info')}>
            <ThemedText style={[styles.tabText, activeTab === 'info' && styles.tabTextActive]}>Infos</ThemedText>
          </TouchableOpacity>
        </Animated.View>

        {/* Content based on active tab */}
        {activeTab === 'menu' && (
          <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.menuSection}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Menu
            </ThemedText>
            {menuItems.map((item, index) => (
              <Animated.View key={item.id} entering={FadeInRight.duration(400).delay(300 + index * 100)}>
                <TouchableOpacity
                  style={[styles.menuItem, selectedItems.includes(item.id) && styles.menuItemSelected]}
                  onPress={() => toggleItem(item.id)}
                  activeOpacity={0.7}>
                  <Image source={{ uri: item.image }} style={styles.menuItemImage} contentFit="cover" />
                  <View style={styles.menuItemInfo}>
                    <ThemedText type="defaultSemiBold" style={styles.menuItemName}>
                      {item.name}
                    </ThemedText>
                    <ThemedText style={styles.menuItemDescription}>{item.description}</ThemedText>
                    <View style={styles.menuItemFooter}>
                      <ThemedText type="defaultSemiBold" style={styles.menuItemPrice}>
                        {item.price} DA
                      </ThemedText>
                      {selectedItems.includes(item.id) && (
                        <View style={styles.quantityControls}>
                          <TouchableOpacity onPress={() => updateQuantity(item.id, -1)} style={styles.quantityButton}>
                            <Ionicons name="remove" size={18} color={palette.accent} />
                          </TouchableOpacity>
                          <ThemedText style={styles.quantityText}>{quantities[item.id] || 1}</ThemedText>
                          <TouchableOpacity onPress={() => updateQuantity(item.id, 1)} style={styles.quantityButton}>
                            <Ionicons name="add" size={18} color={palette.accent} />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </Animated.View>
        )}

        {activeTab === 'reviews' && (
          <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.reviewsSection}>
            <View style={styles.reviewSummary}>
              <View style={styles.reviewRating}>
                <ThemedText type="title" style={styles.reviewRatingNumber}>
                  4.8
                </ThemedText>
                <View style={styles.reviewStars}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons key={star} name="star" size={20} color="#FFD700" />
                  ))}
                </View>
                <ThemedText style={styles.reviewCount}>24 avis</ThemedText>
              </View>
            </View>
            {[1, 2, 3].map((review) => (
              <View key={review} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewAvatar}>
                    <ThemedText style={styles.reviewAvatarText}>AB</ThemedText>
                  </View>
                  <View style={styles.reviewInfo}>
                    <ThemedText type="defaultSemiBold" style={styles.reviewName}>
                      Ahmed Benali
                    </ThemedText>
                    <View style={styles.reviewRatingSmall}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Ionicons key={star} name="star" size={12} color="#FFD700" />
                      ))}
                    </View>
                  </View>
                  <ThemedText style={styles.reviewDate}>Il y a 2 jours</ThemedText>
                </View>
                <ThemedText style={styles.reviewText}>Excellent restaurant! Le couscous était délicieux et le service rapide.</ThemedText>
              </View>
            ))}
          </Animated.View>
        )}

        {activeTab === 'info' && (
          <Animated.View entering={FadeInDown.duration(600).delay(200)} style={styles.infoTabSection}>
            <View style={styles.infoCard}>
              <Ionicons name="location" size={24} color={palette.accent} />
              <View style={styles.infoContent}>
                <ThemedText type="defaultSemiBold" style={styles.infoTitle}>
                  Adresse
                </ThemedText>
                <ThemedText style={styles.infoText}>{restaurant.address}</ThemedText>
              </View>
            </View>
            <View style={styles.infoCard}>
              <Ionicons name="call" size={24} color={palette.accent} />
              <View style={styles.infoContent}>
                <ThemedText type="defaultSemiBold" style={styles.infoTitle}>
                  Téléphone
                </ThemedText>
                <ThemedText style={styles.infoText}>{restaurant.phone}</ThemedText>
              </View>
            </View>
            <View style={styles.infoCard}>
              <Ionicons name="time" size={24} color={palette.accent} />
              <View style={styles.infoContent}>
                <ThemedText type="defaultSemiBold" style={styles.infoTitle}>
                  Horaires
                </ThemedText>
                <ThemedText style={styles.infoText}>{restaurant.hours}</ThemedText>
              </View>
            </View>
            <View style={styles.infoCard}>
              <Ionicons name="bicycle" size={24} color={palette.accent} />
              <View style={styles.infoContent}>
                <ThemedText type="defaultSemiBold" style={styles.infoTitle}>
                  Livraison
                </ThemedText>
                <ThemedText style={styles.infoText}>
                  {restaurant.deliveryTime} • {restaurant.deliveryFee}
                </ThemedText>
              </View>
            </View>
          </Animated.View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Order Button */}
      {selectedItems.length > 0 && (
        <Animated.View entering={FadeInUp.duration(400)} style={[styles.orderBar, { paddingBottom: insets.bottom + 10 }]}>
          <View style={styles.orderBarInfo}>
            <ThemedText style={styles.orderBarText}>
              {selectedItems.length} article{selectedItems.length > 1 ? 's' : ''}
            </ThemedText>
            <ThemedText type="defaultSemiBold" style={styles.orderBarPrice}>
              {totalPrice} DA
            </ThemedText>
          </View>
          <TouchableOpacity style={styles.orderButton} onPress={() => router.push(`/order/${id}`)}>
            <ThemedText style={styles.orderButtonText}>Commander</ThemedText>
          </TouchableOpacity>
        </Animated.View>
      )}
    </ThemedView>
  );
}

const createStyles = (palette: typeof Colors.light) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: palette.background,
    },
    headerImageContainer: {
      width: '100%',
      height: 300,
      position: 'relative',
    },
    headerImage: {
      width: '100%',
      height: '100%',
    },
    headerGradient: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 150,
    },
    backButton: {
      position: 'absolute',
      left: 20,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerInfo: {
      position: 'absolute',
      bottom: 20,
      right: 20,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    favoriteButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    ratingBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: palette.glass,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
    },
    ratingText: {
      fontSize: 14,
      fontWeight: '700',
      marginLeft: 4,
      color: palette.text,
    },
    infoSection: {
      padding: 20,
      backgroundColor: palette.surface,
      marginBottom: 12,
    },
    restaurantName: {
      fontSize: 28,
      fontWeight: '800',
      marginBottom: 4,
      color: palette.text,
    },
    cuisine: {
      fontSize: 16,
      color: palette.textMuted,
      marginBottom: 12,
      fontWeight: '600',
    },
    description: {
      fontSize: 15,
      color: palette.textMuted,
      lineHeight: 22,
      marginBottom: 20,
      fontWeight: '400',
    },
    metaRow: {
      gap: 12,
      marginBottom: 20,
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    metaText: {
      fontSize: 14,
      color: palette.textMuted,
      fontWeight: '500',
    },
    actionButtons: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 10,
    },
    actionButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 12,
      borderRadius: 12,
      backgroundColor: palette.surfaceMuted,
      gap: 6,
    },
    actionButtonText: {
      fontSize: 15,
      fontWeight: '600',
      color: palette.accent,
    },
    menuSection: {
      padding: 20,
      backgroundColor: palette.surface,
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: '700',
      marginBottom: 20,
      color: palette.text,
    },
    menuItem: {
      flexDirection: 'row',
      backgroundColor: palette.card,
      borderRadius: 18,
      marginBottom: 16,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: palette.border,
      ...Platform.select({
        ios: {
          shadowColor: palette.heroShadow,
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    menuItemSelected: {
      borderWidth: 2,
      borderColor: palette.accent,
    },
    menuItemImage: {
      width: 100,
      height: 100,
    },
    menuItemInfo: {
      flex: 1,
      padding: 12,
      justifyContent: 'space-between',
    },
    menuItemName: {
      fontSize: 17,
      fontWeight: '700',
      marginBottom: 4,
      color: palette.text,
    },
    menuItemDescription: {
      fontSize: 13,
      color: palette.textMuted,
      marginBottom: 8,
      fontWeight: '400',
      lineHeight: 18,
    },
    menuItemFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    menuItemPrice: {
      fontSize: 16,
      color: palette.accent,
      fontWeight: '700',
    },
    quantityControls: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    quantityButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: palette.surfaceMuted,
      justifyContent: 'center',
      alignItems: 'center',
    },
    quantityText: {
      fontSize: 16,
      fontWeight: '700',
      minWidth: 24,
      textAlign: 'center',
      color: palette.text,
    },
    orderBar: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: palette.surface,
      paddingHorizontal: 20,
      paddingTop: 16,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: palette.border,
      ...Platform.select({
        ios: {
          shadowColor: palette.heroShadow,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        android: {
          elevation: 8,
        },
      }),
    },
    orderBarInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    orderBarText: {
      fontSize: 14,
      color: palette.textMuted,
    },
    orderBarPrice: {
      fontSize: 20,
      fontWeight: '700',
      color: palette.accent,
    },
    orderButton: {
      backgroundColor: palette.accent,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
    },
    orderButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '700',
    },
    tabsContainer: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      paddingVertical: 12,
      backgroundColor: palette.surface,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: palette.border,
    },
    tab: {
      flex: 1,
      paddingVertical: 10,
      alignItems: 'center',
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    tabActive: {
      borderBottomColor: palette.accent,
    },
    tabText: {
      fontSize: 15,
      fontWeight: '600',
      color: palette.textMuted,
    },
    tabTextActive: {
      color: palette.accent,
      fontWeight: '700',
    },
    reviewsSection: {
      padding: 20,
      backgroundColor: palette.background,
    },
    reviewSummary: {
      backgroundColor: palette.card,
      padding: 20,
      borderRadius: 16,
      marginBottom: 20,
      ...Platform.select({
        ios: {
          shadowColor: palette.heroShadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    reviewRating: {
      alignItems: 'center',
    },
    reviewRatingNumber: {
      fontSize: 48,
      fontWeight: '800',
      color: palette.text,
      marginBottom: 8,
    },
    reviewStars: {
      flexDirection: 'row',
      gap: 4,
      marginBottom: 8,
    },
    reviewCount: {
      fontSize: 14,
      color: palette.textMuted,
      fontWeight: '500',
    },
    reviewItem: {
      backgroundColor: palette.card,
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
      ...Platform.select({
        ios: {
          shadowColor: palette.heroShadow,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.08,
          shadowRadius: 4,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    reviewHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    reviewAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: palette.accent,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    reviewAvatarText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '700',
    },
    reviewInfo: {
      flex: 1,
    },
    reviewName: {
      fontSize: 15,
      marginBottom: 4,
      color: palette.text,
      fontWeight: '700',
    },
    reviewRatingSmall: {
      flexDirection: 'row',
      gap: 2,
    },
    reviewDate: {
      fontSize: 12,
      color: palette.textMuted,
      fontWeight: '400',
    },
    reviewText: {
      fontSize: 14,
      color: palette.textMuted,
      lineHeight: 20,
      fontWeight: '400',
    },
    infoTabSection: {
      padding: 20,
      backgroundColor: palette.background,
    },
    infoCard: {
      flexDirection: 'row',
      backgroundColor: palette.card,
      padding: 20,
      borderRadius: 16,
      marginBottom: 16,
      alignItems: 'flex-start',
      ...Platform.select({
        ios: {
          shadowColor: palette.heroShadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        android: {
          elevation: 4,
        },
      }),
    },
    infoContent: {
      flex: 1,
      marginLeft: 16,
    },
    infoTitle: {
      fontSize: 16,
      marginBottom: 4,
      color: palette.text,
      fontWeight: '700',
    },
    infoText: {
      fontSize: 14,
      color: palette.textMuted,
      lineHeight: 20,
      fontWeight: '400',
    },
  });
