import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRef, useState } from 'react';
import {
    Dimensions,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, {
    FadeInDown,
    FadeInRight,
    FadeInUp,
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HEADER_HEIGHT = 120;
const CATEGORY_ITEM_WIDTH = 80;

// Algerian cities
const cities = ['Alger', 'Oran', 'Constantine', 'Annaba', 'Blida'];

// Food categories
const categories = [
  { id: 1, name: 'Tous', icon: '🍽️', color: '#FF6B6B' },
  { id: 2, name: 'Pizza', icon: '🍕', color: '#4ECDC4' },
  { id: 3, name: 'Burger', icon: '🍔', color: '#FFE66D' },
  { id: 4, name: 'Tacos', icon: '🌮', color: '#A8E6CF' },
  { id: 5, name: 'Sushi', icon: '🍣', color: '#FF8B94' },
  { id: 6, name: 'Dessert', icon: '🍰', color: '#C7CEEA' },
  { id: 7, name: 'Café', icon: '☕', color: '#D4A574' },
  { id: 8, name: 'Algérien', icon: '🥘', color: '#FF6B9D' },
];

// Sample restaurants
const restaurants = [
  {
    id: 1,
    name: 'Le Gourmet Algérien',
    cuisine: 'Algérien • Traditionnel',
    rating: 4.8,
    deliveryTime: '25-35 min',
    deliveryFee: '150 DA',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
    featured: true,
  },
  {
    id: 2,
    name: 'Pizza Palace',
    cuisine: 'Italien • Pizza',
    rating: 4.6,
    deliveryTime: '20-30 min',
    deliveryFee: '100 DA',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
    featured: true,
  },
  {
    id: 3,
    name: 'Burger House',
    cuisine: 'Américain • Fast Food',
    rating: 4.7,
    deliveryTime: '15-25 min',
    deliveryFee: '120 DA',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    featured: false,
  },
  {
    id: 4,
    name: 'Sushi Master',
    cuisine: 'Japonais • Sushi',
    rating: 4.9,
    deliveryTime: '30-40 min',
    deliveryFee: '200 DA',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
    featured: false,
  },
  {
    id: 5,
    name: 'Café des Délices',
    cuisine: 'Café • Pâtisserie',
    rating: 4.5,
    deliveryTime: '10-20 min',
    deliveryFee: '80 DA',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400',
    featured: false,
  },
  {
    id: 6,
    name: 'Tacos Express',
    cuisine: 'Mexicain • Tacos',
    rating: 4.4,
    deliveryTime: '15-25 min',
    deliveryFee: '100 DA',
    image: 'https://images.unsplash.com/photo-1565299585323-38174c0a5e0e?w=400',
    featured: false,
  },
];

// Popular dishes
const popularDishes = [
  {
    id: 1,
    name: 'Couscous Royal',
    restaurant: 'Le Gourmet Algérien',
    price: '1200 DA',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300',
  },
  {
    id: 2,
    name: 'Pizza Margherita',
    restaurant: 'Pizza Palace',
    price: '800 DA',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300',
  },
  {
    id: 3,
    name: 'Burger Deluxe',
    restaurant: 'Burger House',
    price: '650 DA',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=300',
  },
  {
    id: 4,
    name: 'Sushi Combo',
    restaurant: 'Sushi Master',
    price: '2500 DA',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300',
  },
];

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [selectedCity, setSelectedCity] = useState(0);
  const categoryScrollRef = useRef<ScrollView>(null);

  const isDark = colorScheme === 'dark';

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, 100], [1, 0.95], 'clamp');
    const translateY = interpolate(scrollY.value, [0, 100], [0, -20], 'clamp');
    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const searchAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(scrollY.value, [0, 50], [1, 0.98], 'clamp');
    return {
      transform: [{ scale }],
    };
  });

  const handleCategoryPress = (categoryId: number, index: number) => {
    setSelectedCategory(categoryId);
    categoryScrollRef.current?.scrollTo({
      x: (index - 1) * CATEGORY_ITEM_WIDTH,
      animated: true,
    });
  };

  return (
    <ThemedView style={styles.container}>
      {/* Animated Header */}
      <Animated.View
        style={[
          styles.header,
          headerAnimatedStyle,
          { 
            paddingTop: insets.top + 10,
            backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
            borderBottomColor: isDark ? '#333' : '#F0F0F0',
          },
        ]}>
        <View style={styles.headerTop}>
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={20} color="#FF6B6B" />
            <TouchableOpacity
              style={styles.locationButton}
              onPress={() => {
                // Location picker logic
              }}>
              <ThemedText style={styles.locationText}>
                {cities[selectedCity]}
              </ThemedText>
              <Ionicons name="chevron-down" size={16} color={isDark ? "#999" : "#666"} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person-circle-outline" size={28} color={isDark ? "#FFF" : "#333"} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <Animated.View style={[
          styles.searchContainer, 
          searchAnimatedStyle,
          { backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5' }
        ]}>
          <Ionicons name="search" size={20} color={isDark ? "#999" : "#999"} style={styles.searchIcon} />
          <ThemedText style={styles.searchPlaceholder}>
            Rechercher un restaurant, un plat...
          </ThemedText>
        </Animated.View>
      </Animated.View>

      {/* Main Content */}
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        {/* Categories Section */}
        <Animated.View
          entering={FadeInDown.duration(600).delay(100)}
          style={styles.section}>
          <ScrollView
            ref={categoryScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}>
            {categories.map((category, index) => (
              <Animated.View
                key={category.id}
                entering={FadeInRight.duration(400).delay(100 + index * 50)}>
                <TouchableOpacity
                  style={[
                    styles.categoryItem,
                    selectedCategory === category.id && styles.categoryItemActive,
                    { backgroundColor: selectedCategory === category.id ? category.color : (isDark ? '#2A2A2A' : '#F5F5F5') },
                  ]}
                  onPress={() => handleCategoryPress(category.id, index)}>
                  <ThemedText style={styles.categoryEmoji}>{category.icon}</ThemedText>
                  <ThemedText
                    style={[
                      styles.categoryName,
                      selectedCategory === category.id && styles.categoryNameActive,
                    ]}>
                    {category.name}
                  </ThemedText>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Featured Restaurants */}
        <Animated.View
          entering={FadeInUp.duration(600).delay(200)}
          style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Restaurants en vedette
            </ThemedText>
            <TouchableOpacity>
              <ThemedText style={styles.seeAllText}>Voir tout</ThemedText>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.restaurantsContainer}>
            {restaurants
              .filter((r) => r.featured)
              .map((restaurant, index) => (
                <Animated.View
                  key={restaurant.id}
                  entering={FadeInRight.duration(500).delay(300 + index * 100)}>
                  <TouchableOpacity style={[
                    styles.restaurantCard,
                    { backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF' }
                  ]}>
                    <View style={styles.restaurantImageContainer}>
                      <Image
                        source={{ uri: restaurant.image }}
                        style={styles.restaurantImage}
                        contentFit="cover"
                      />
                      <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.7)']}
                        style={styles.restaurantImageGradient}
                      />
                      <View style={styles.ratingBadge}>
                        <Ionicons name="star" size={12} color="#FFD700" />
                        <ThemedText style={styles.ratingText}>
                          {restaurant.rating}
                        </ThemedText>
                      </View>
                    </View>
                    <View style={styles.restaurantInfo}>
                      <ThemedText type="defaultSemiBold" style={styles.restaurantName}>
                        {restaurant.name}
                      </ThemedText>
                      <ThemedText style={styles.restaurantCuisine}>
                        {restaurant.cuisine}
                      </ThemedText>
                      <View style={styles.restaurantMeta}>
                        <View style={styles.metaItem}>
                          <Ionicons name="time-outline" size={14} color="#666" />
                          <ThemedText style={styles.metaText}>
                            {restaurant.deliveryTime}
                          </ThemedText>
                        </View>
                        <View style={styles.metaItem}>
                          <Ionicons name="cash-outline" size={14} color="#666" />
                          <ThemedText style={styles.metaText}>
                            {restaurant.deliveryFee}
                          </ThemedText>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              ))}
          </ScrollView>
        </Animated.View>

        {/* All Restaurants */}
        <Animated.View
          entering={FadeInUp.duration(600).delay(400)}
          style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Tous les restaurants
            </ThemedText>
            <TouchableOpacity>
              <ThemedText style={styles.seeAllText}>Filtrer</ThemedText>
            </TouchableOpacity>
          </View>
          <View style={styles.restaurantsGrid}>
            {restaurants.map((restaurant, index) => (
              <Animated.View
                key={restaurant.id}
                entering={FadeInUp.duration(500).delay(500 + index * 100)}>
                <TouchableOpacity
                  style={[
                    styles.restaurantCardSmall,
                    { backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF' },
                  ]}>
                  <Image
                    source={{ uri: restaurant.image }}
                    style={styles.restaurantImageSmall}
                    contentFit="cover"
                  />
                  <View style={styles.restaurantInfoSmall}>
                    <View style={styles.restaurantHeaderSmall}>
                      <ThemedText
                        type="defaultSemiBold"
                        style={styles.restaurantNameSmall}
                        numberOfLines={1}>
                        {restaurant.name}
                      </ThemedText>
                      <View style={styles.ratingBadgeSmall}>
                        <Ionicons name="star" size={12} color="#FFD700" />
                        <ThemedText style={styles.ratingTextSmall}>
                          {restaurant.rating}
                        </ThemedText>
                      </View>
                    </View>
                    <ThemedText
                      style={styles.restaurantCuisineSmall}
                      numberOfLines={1}>
                      {restaurant.cuisine}
                    </ThemedText>
                    <View style={styles.restaurantMetaSmall}>
                      <View style={styles.metaItem}>
                        <Ionicons name="time-outline" size={12} color="#666" />
                        <ThemedText style={styles.metaTextSmall}>
                          {restaurant.deliveryTime}
                        </ThemedText>
                      </View>
                      <View style={styles.metaItem}>
                        <Ionicons name="cash-outline" size={12} color="#666" />
                        <ThemedText style={styles.metaTextSmall}>
                          {restaurant.deliveryFee}
                        </ThemedText>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Popular Dishes */}
        <Animated.View
          entering={FadeInUp.duration(600).delay(600)}
          style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Plats populaires
            </ThemedText>
            <TouchableOpacity>
              <ThemedText style={styles.seeAllText}>Voir tout</ThemedText>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dishesContainer}>
            {popularDishes.map((dish, index) => (
              <Animated.View
                key={dish.id}
                entering={FadeInRight.duration(500).delay(700 + index * 100)}>
                <TouchableOpacity style={[
                  styles.dishCard,
                  { backgroundColor: isDark ? '#2A2A2A' : '#FFFFFF' }
                ]}>
                  <Image
                    source={{ uri: dish.image }}
                    style={styles.dishImage}
                    contentFit="cover"
                  />
                  <View style={styles.dishInfo}>
                    <ThemedText type="defaultSemiBold" style={styles.dishName}>
                      {dish.name}
                    </ThemedText>
                    <ThemedText style={styles.dishRestaurant}>{dish.restaurant}</ThemedText>
                    <ThemedText type="defaultSemiBold" style={styles.dishPrice}>
                      {dish.price}
                    </ThemedText>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Bottom Spacing */}
        <View style={{ height: 100 }} />
      </Animated.ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 4,
  },
  profileButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 15,
    color: '#999',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  section: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  seeAllText: {
    fontSize: 15,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingRight: 40,
  },
  categoryItem: {
    width: CATEGORY_ITEM_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 16,
    marginRight: 12,
  },
  categoryItemActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  categoryEmoji: {
    fontSize: 28,
    marginBottom: 6,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  categoryNameActive: {
    fontWeight: '700',
    color: '#FFFFFF',
  },
  restaurantsContainer: {
    paddingHorizontal: 20,
    paddingRight: 40,
  },
  restaurantCard: {
    width: SCREEN_WIDTH * 0.75,
    marginRight: 15,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  restaurantImageContainer: {
    width: '100%',
    height: 180,
    position: 'relative',
  },
  restaurantImage: {
    width: '100%',
    height: '100%',
  },
  restaurantImageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  ratingBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
    color: '#333',
  },
  restaurantInfo: {
    padding: 15,
  },
  restaurantName: {
    fontSize: 18,
    marginBottom: 4,
  },
  restaurantCuisine: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  restaurantMeta: {
    flexDirection: 'row',
    gap: 15,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: '#666',
  },
  restaurantsGrid: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  restaurantCardSmall: {
    width: (SCREEN_WIDTH - 50) / 2,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 15,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  restaurantImageSmall: {
    width: '100%',
    height: 120,
  },
  restaurantInfoSmall: {
    padding: 12,
  },
  restaurantHeaderSmall: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  restaurantNameSmall: {
    fontSize: 15,
    flex: 1,
    marginRight: 8,
  },
  ratingBadgeSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  ratingTextSmall: {
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 2,
    color: '#333',
  },
  restaurantCuisineSmall: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  restaurantMetaSmall: {
    flexDirection: 'row',
    gap: 10,
  },
  metaTextSmall: {
    fontSize: 11,
    color: '#666',
  },
  dishesContainer: {
    paddingHorizontal: 20,
    paddingRight: 40,
  },
  dishCard: {
    width: 200,
    marginRight: 15,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  dishImage: {
    width: '100%',
    height: 140,
  },
  dishInfo: {
    padding: 12,
  },
  dishName: {
    fontSize: 16,
    marginBottom: 4,
  },
  dishRestaurant: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  dishPrice: {
    fontSize: 16,
    color: '#FF6B6B',
  },
});

