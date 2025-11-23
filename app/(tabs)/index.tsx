import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
    Dimensions,
    FlatList,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
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


// Promotions
const promotions = [
  {
    id: 1,
    title: 'Réduction 30%',
    subtitle: 'Sur toutes les pizzas',
    restaurant: 'Pizza Palace',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
    color: '#FF6B6B',
    validUntil: 'Jusqu\'au 30 Nov',
  },
  {
    id: 2,
    title: 'Livraison gratuite',
    subtitle: 'Commande min. 2000 DA',
    restaurant: 'Tous les restaurants',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    color: '#4ECDC4',
    validUntil: 'Toujours valable',
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
    rating: 4.8,
  },
  {
    id: 2,
    name: 'Pizza Margherita',
    restaurant: 'Pizza Palace',
    price: '800 DA',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300',
    rating: 4.6,
  },
  {
    id: 3,
    name: 'Burger Deluxe',
    restaurant: 'Burger House',
    price: '650 DA',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=300',
    rating: 4.7,
  },
  {
    id: 4,
    name: 'Sushi Combo',
    restaurant: 'Sushi Master',
    price: '2500 DA',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300',
    rating: 4.9,
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [selectedCity, setSelectedCity] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const categoryScrollRef = useRef<ScrollView>(null);
  
  // Filter options
  const filterOptions = [
    { id: 'rating', label: 'Meilleures notes', icon: 'star' },
    { id: 'delivery', label: 'Livraison rapide', icon: 'flash' },
    { id: 'price', label: 'Prix bas', icon: 'cash' },
    { id: 'distance', label: 'Plus proche', icon: 'location' },
    { id: 'promo', label: 'Promotions', icon: 'pricetag' },
    { id: 'new', label: 'Nouveautés', icon: 'sparkles' },
  ];


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
            backgroundColor: '#FFFFFF',
            borderBottomColor: '#F0F0F0',
          },
        ]}>
        <View style={styles.headerTop}>
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={20} color="#FF6B6B" />
            <TouchableOpacity
              style={styles.locationButton}
              onPress={() => setIsLocationModalVisible(true)}
              activeOpacity={0.7}>
              <ThemedText style={styles.locationText}>
                {cities[selectedCity]}
              </ThemedText>
              <Ionicons name="chevron-down" size={16} color="#666" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person-circle-outline" size={28} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <Animated.View style={[
          styles.searchContainer, 
          searchAnimatedStyle,
          { 
            backgroundColor: isSearchFocused ? '#FFFFFF' : '#F5F5F5',
            borderWidth: isSearchFocused ? 2 : 1,
            borderColor: isSearchFocused ? '#FF6B6B' : '#E0E0E0',
          }
        ]}>
          <Ionicons 
            name="search" 
            size={20} 
            color={isSearchFocused ? '#FF6B6B' : "#999"} 
            style={styles.searchIcon} 
          />
          <TextInput
            style={[
              styles.searchInput,
              { color: '#000000' }
            ]}
            placeholder="Rechercher un restaurant, un plat..."
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
          {searchText.length > 0 && (
            <TouchableOpacity 
              onPress={() => setSearchText('')}
              style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </Animated.View>
      </Animated.View>

      {/* Main Content */}
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        {/* Enhanced Interactive Filter Section */}
        <Animated.View
          entering={FadeInDown.duration(600).delay(100)}
          style={styles.filterSection}>
          <View style={styles.filterHeader}>
            <ThemedText type="subtitle" style={styles.filterTitle}>
              Catégories
            </ThemedText>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setFilterModalVisible(true)}
              activeOpacity={0.7}>
              <Ionicons name="options-outline" size={20} color="#FF6B6B" />
              <ThemedText style={styles.filterButtonText}>
                {selectedFilters.length > 0 ? `${selectedFilters.length} filtres` : 'Filtrer'}
              </ThemedText>
            </TouchableOpacity>
          </View>
          
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
                    { backgroundColor: selectedCategory === category.id ? category.color : '#F5F5F5' },
                  ]}
                  onPress={() => handleCategoryPress(category.id, index)}
                  activeOpacity={0.8}>
                  <Animated.View
                    style={[
                      styles.categoryIconContainer,
                      selectedCategory === category.id && styles.categoryIconContainerActive,
                    ]}>
                    <ThemedText style={styles.categoryEmoji}>{category.icon}</ThemedText>
                  </Animated.View>
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


        {/* Promotions Banner */}
        <Animated.View
          entering={FadeInUp.duration(600).delay(250)}
          style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Promotions spéciales
            </ThemedText>
            <TouchableOpacity>
              <ThemedText style={styles.seeAllText}>Voir tout</ThemedText>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.promotionsContainer}>
            {promotions.map((promo, index) => (
              <Animated.View
                key={promo.id}
                entering={FadeInRight.duration(500).delay(300 + index * 150)}>
                <TouchableOpacity
                  style={styles.promotionCard}
                  activeOpacity={0.9}>
                  <Image
                    source={{ uri: promo.image }}
                    style={styles.promotionImage}
                    contentFit="cover"
                  />
                  <LinearGradient
                    colors={['transparent', promo.color + 'DD']}
                    style={styles.promotionGradient}
                  />
                  <View style={styles.promotionContent}>
                    <View style={styles.promotionBadge}>
                      <ThemedText style={styles.promotionBadgeText}>
                        {promo.validUntil}
                      </ThemedText>
                    </View>
                    <ThemedText style={styles.promotionTitle}>{promo.title}</ThemedText>
                    <ThemedText style={styles.promotionSubtitle}>{promo.subtitle}</ThemedText>
                    <ThemedText style={styles.promotionRestaurant}>{promo.restaurant}</ThemedText>
                  </View>
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
                  <TouchableOpacity 
                    style={[
                      styles.restaurantCard,
                      { backgroundColor: '#FFFFFF' }
                    ]}
                    onPress={() => router.push(`/restaurant/${restaurant.id}`)}>
                    <View style={styles.restaurantImageContainer}>
                      <Image
                        source={{ uri: restaurant.image }}
                        style={styles.restaurantImage}
                        contentFit="cover"
                        placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
                        transition={200}
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
                      <TouchableOpacity
                        style={styles.favoriteButton}
                        onPress={(e) => {
                          e.stopPropagation();
                          setFavorites(
                            favorites.includes(restaurant.id)
                              ? favorites.filter(id => id !== restaurant.id)
                              : [...favorites, restaurant.id]
                          );
                        }}>
                        <Ionicons
                          name={favorites.includes(restaurant.id) ? 'heart' : 'heart-outline'}
                          size={20}
                          color={favorites.includes(restaurant.id) ? '#FF6B6B' : '#FFFFFF'}
                        />
                      </TouchableOpacity>
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
                    { backgroundColor: '#FFFFFF' },
                  ]}
                  onPress={() => router.push(`/restaurant/${restaurant.id}`)}>
        <Image
                    source={{ uri: restaurant.image }}
                    style={styles.restaurantImageSmall}
                    contentFit="cover"
                    placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
                    transition={200}
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
                      <TouchableOpacity
                        style={styles.favoriteButtonSmall}
                        onPress={(e) => {
                          e.stopPropagation();
                          setFavorites(
                            favorites.includes(restaurant.id)
                              ? favorites.filter(id => id !== restaurant.id)
                              : [...favorites, restaurant.id]
                          );
                        }}>
                        <Ionicons
                          name={favorites.includes(restaurant.id) ? 'heart' : 'heart-outline'}
                          size={18}
                          color={favorites.includes(restaurant.id) ? '#FF6B6B' : '#999'}
                        />
                      </TouchableOpacity>
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
                  { backgroundColor: '#FFFFFF' }
                ]}>
                  <Image
                    source={{ uri: dish.image }}
                    style={styles.dishImage}
                    contentFit="cover"
                    placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
                    transition={200}
                  />
                  <View style={styles.dishInfo}>
                    <View style={styles.dishHeader}>
                      <ThemedText type="defaultSemiBold" style={styles.dishName}>
                        {dish.name}
                      </ThemedText>
                      <View style={styles.dishRating}>
                        <Ionicons name="star" size={12} color="#FFD700" />
                        <ThemedText style={styles.dishRatingText}>{dish.rating}</ThemedText>
                      </View>
                    </View>
                    <ThemedText style={styles.dishRestaurant}>{dish.restaurant}</ThemedText>
                    <View style={styles.dishFooter}>
                      <ThemedText type="defaultSemiBold" style={styles.dishPrice}>
                        {dish.price}
                      </ThemedText>
                      <TouchableOpacity style={styles.addToCartButton}>
                        <Ionicons name="add" size={18} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Bottom Spacing */}
        <View style={{ height: 100 }} />
      </Animated.ScrollView>

      {/* Location Picker Modal */}
      <Modal
        visible={isLocationModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsLocationModalVisible(false)}>
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsLocationModalVisible(false)}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: '#FFFFFF' },
            ]}
            onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <ThemedText type="subtitle" style={styles.modalTitle}>
                Sélectionner une ville
        </ThemedText>
              <TouchableOpacity onPress={() => setIsLocationModalVisible(false)}>
                <Ionicons
                  name="close"
                  size={24}
                  color="#000"
                />
              </TouchableOpacity>
            </View>
            <FlatList
              data={cities}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={[
                    styles.cityItem,
                    {
                      backgroundColor:
                        selectedCity === index
                          ? '#F5F5F5'
                          : 'transparent',
                    },
                  ]}
                  onPress={() => {
                    setSelectedCity(index);
                    setIsLocationModalVisible(false);
                  }}
                  activeOpacity={0.7}>
                  <Ionicons
                    name="location"
                    size={20}
                    color={selectedCity === index ? '#FF6B6B' : '#999'}
                  />
                  <ThemedText
                    style={[
                      styles.cityItemText,
                      selectedCity === index && styles.cityItemTextSelected,
                    ]}>
                    {item}
        </ThemedText>
                  {selectedCity === index && (
                    <Ionicons name="checkmark-circle" size={24} color="#FF6B6B" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>

      {/* Enhanced Filter Modal */}
      <Modal
        visible={filterModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFilterModalVisible(false)}>
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setFilterModalVisible(false)}>
          <View
            style={[styles.filterModalContent, { backgroundColor: '#FFFFFF' }]}
            onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <ThemedText type="subtitle" style={styles.modalTitle}>
                Filtrer les restaurants
              </ThemedText>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.filterOptionsList}>
              {filterOptions.map((filter) => {
                const isSelected = selectedFilters.includes(filter.id);
                return (
                  <TouchableOpacity
                    key={filter.id}
                    style={[
                      styles.filterOptionItem,
                      isSelected && styles.filterOptionItemSelected,
                    ]}
                    onPress={() => {
                      if (isSelected) {
                        setSelectedFilters(selectedFilters.filter(id => id !== filter.id));
                      } else {
                        setSelectedFilters([...selectedFilters, filter.id]);
                      }
                    }}
                    activeOpacity={0.7}>
                    <View style={styles.filterOptionLeft}>
                      <View style={[
                        styles.filterOptionIcon,
                        isSelected && styles.filterOptionIconSelected,
                      ]}>
                        <Ionicons
                          name={filter.icon as any}
                          size={20}
                          color={isSelected ? '#FFFFFF' : '#FF6B6B'}
                        />
                      </View>
                      <ThemedText
                        style={[
                          styles.filterOptionLabel,
                          isSelected && styles.filterOptionLabelSelected,
                        ]}>
                        {filter.label}
                      </ThemedText>
                    </View>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={24} color="#FF6B6B" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <View style={styles.filterModalFooter}>
              <TouchableOpacity
                style={styles.resetFilterButton}
                onPress={() => setSelectedFilters([])}>
                <ThemedText style={styles.resetFilterText}>Réinitialiser</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyFilterButton}
                onPress={() => setFilterModalVisible(false)}>
                <ThemedText style={styles.applyFilterText}>
                  Appliquer ({selectedFilters.length})
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
      </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 18,
    borderBottomWidth: 0,
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
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
    fontWeight: '700',
    marginRight: 4,
    color: '#1A1A1A',
  },
  profileButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    padding: 0,
    color: '#1A1A1A',
  },
  clearButton: {
    marginLeft: 8,
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
    backgroundColor: '#F9F9F9',
  },
  section: {
    marginTop: 24,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: '#000000',
  },
  seeAllText: {
    fontSize: 15,
    color: '#FF6B6B',
    fontWeight: '700',
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingRight: 40,
  },
  categoryItem: {
    width: CATEGORY_ITEM_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 18,
    marginRight: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  categoryItemActive: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  categoryEmoji: {
    fontSize: 28,
    marginBottom: 6,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    color: '#1A1A1A',
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
    width: SCREEN_WIDTH * 0.78,
    marginRight: 15,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
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
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 4,
    color: '#1A1A1A',
  },
  restaurantInfo: {
    padding: 15,
  },
  restaurantName: {
    fontSize: 18,
    marginBottom: 4,
    color: '#000000',
    fontWeight: '700',
  },
  restaurantCuisine: {
    fontSize: 14,
    color: '#4A4A4A',
    marginBottom: 10,
    fontWeight: '500',
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
    color: '#4A4A4A',
    fontWeight: '500',
  },
  restaurantsGrid: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  restaurantCardSmall: {
    width: (SCREEN_WIDTH - 50) / 2,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 15,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
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
    color: '#000000',
    fontWeight: '700',
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
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 2,
    color: '#1A1A1A',
  },
  restaurantCuisineSmall: {
    fontSize: 12,
    color: '#4A4A4A',
    marginBottom: 8,
    fontWeight: '500',
  },
  restaurantMetaSmall: {
    flexDirection: 'row',
    gap: 10,
  },
  metaTextSmall: {
    fontSize: 12,
    color: '#4A4A4A',
    fontWeight: '500',
  },
  dishesContainer: {
    paddingHorizontal: 20,
    paddingRight: 40,
  },
  dishCard: {
    width: 220,
    marginRight: 15,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
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
    color: '#000000',
    fontWeight: '700',
  },
  dishRestaurant: {
    fontSize: 13,
    color: '#4A4A4A',
    marginBottom: 8,
    fontWeight: '500',
  },
  dishHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  dishRating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  dishRatingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  dishFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  dishPrice: {
    fontSize: 16,
    color: '#FF6B6B',
    fontWeight: '700',
  },
  addToCartButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButtonSmall: {
    padding: 4,
  },
  filterSection: {
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    paddingBottom: 20,
    marginTop: 0,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: '#000000',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF6B6B',
  },
  categoryIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIconContainerActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    transform: [{ scale: 1.1 }],
  },
  promotionsContainer: {
    paddingHorizontal: 20,
    paddingRight: 40,
  },
  promotionCard: {
    width: SCREEN_WIDTH * 0.85,
    height: 200,
    borderRadius: 24,
    overflow: 'hidden',
    marginRight: 15,
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  promotionImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  promotionGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
  },
  promotionContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  promotionBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  promotionBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  promotionTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  promotionSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    opacity: 0.95,
    marginBottom: 6,
  },
  promotionRestaurant: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    opacity: 0.85,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 20,
    maxHeight: '70%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  cityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  cityItemText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  cityItemTextSelected: {
    fontWeight: '700',
    color: '#FF6B6B',
  },
  filterModalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    padding: 20,
    maxHeight: '80%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  filterOptionsList: {
    maxHeight: 400,
  },
  filterOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#F5F5F5',
  },
  filterOptionItemSelected: {
    backgroundColor: '#FFF5F5',
    borderWidth: 2,
    borderColor: '#FF6B6B',
  },
  filterOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  filterOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  filterOptionIconSelected: {
    backgroundColor: '#FF6B6B',
  },
  filterOptionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  filterOptionLabelSelected: {
    color: '#FF6B6B',
    fontWeight: '700',
  },
  filterModalFooter: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  resetFilterButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  resetFilterText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A4A4A',
  },
  applyFilterButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#FF6B6B',
    alignItems: 'center',
  },
  applyFilterText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

