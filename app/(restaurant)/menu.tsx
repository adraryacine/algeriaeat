import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useMemo, useState } from 'react';
import { FlatList, Platform, ScrollView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const categories = ['Tous', 'Plats', 'Entrées', 'Desserts', 'Boissons'];

const mockMenuItems = [
  { id: '1', name: 'Couscous Royal', category: 'Plats', price: 1600, description: 'Couscous traditionnel avec viande et légumes', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200', available: true },
  { id: '2', name: 'Tajine Zitoune', category: 'Plats', price: 1400, description: 'Poulet aux olives et citron confit', image: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=200', available: true },
  { id: '3', name: 'Chorba Frik', category: 'Entrées', price: 400, description: 'Soupe traditionnelle au blé vert', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=200', available: true },
  { id: '4', name: 'Makrout', category: 'Desserts', price: 300, description: 'Gâteau aux dattes et miel', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=200', available: false },
  { id: '5', name: 'Hamoud Boualem', category: 'Boissons', price: 100, description: 'Limonade algérienne', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=200', available: true },
];

export default function RestaurantMenuScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const styles = useMemo(() => createStyles(palette), [palette]);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [menuItems, setMenuItems] = useState(mockMenuItems);

  const toggleAvailability = (itemId: string) => {
    setMenuItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, available: !item.available } : item
    ));
  };

  const renderMenuItem = ({ item, index }: { item: typeof mockMenuItems[0]; index: number }) => (
    <Animated.View entering={FadeInDown.duration(400).delay(index * 50)}>
      <View style={[styles.menuCard, !item.available && styles.menuCardDisabled]}>
        <Image source={{ uri: item.image }} style={styles.menuImage} contentFit="cover" />
        <View style={styles.menuInfo}>
          <View style={styles.menuHeader}>
            <ThemedText type="defaultSemiBold" style={styles.menuName}>{item.name}</ThemedText>
            <ThemedText style={styles.menuCategory}>{item.category}</ThemedText>
          </View>
          <ThemedText style={styles.menuDescription} numberOfLines={2}>{item.description}</ThemedText>
          <View style={styles.menuFooter}>
            <ThemedText type="defaultSemiBold" style={styles.menuPrice}>{item.price} DA</ThemedText>
            <View style={styles.availabilityToggle}>
              <ThemedText style={styles.availabilityLabel}>{item.available ? 'Disponible' : 'Épuisé'}</ThemedText>
              <Switch
                value={item.available}
                onValueChange={() => toggleAvailability(item.id)}
                trackColor={{ false: palette.surfaceMuted, true: palette.success + '50' }}
                thumbColor={item.available ? palette.success : palette.textMuted}
                style={{ transform: [{ scale: 0.8 }] }}
              />
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="create-outline" size={20} color={palette.accent} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <ThemedText type="subtitle" style={styles.headerTitle}>Menu</ThemedText>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterTabs}>
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.filterTab, selectedCategory === index && styles.filterTabActive]}
              onPress={() => setSelectedCategory(index)}>
              <ThemedText style={[styles.filterTabText, selectedCategory === index && styles.filterTabTextActive]}>
                {category}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={menuItems}
        renderItem={renderMenuItem}
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
    menuCard: {
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
    menuCardDisabled: { opacity: 0.6 },
    menuImage: { width: 100, height: 100 },
    menuInfo: { flex: 1, padding: 12 },
    menuHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    menuName: { fontSize: 16, color: palette.text, flex: 1, marginRight: 8 },
    menuCategory: { fontSize: 11, color: palette.textMuted, backgroundColor: palette.surfaceMuted, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
    menuDescription: { fontSize: 12, color: palette.textMuted, marginTop: 4, lineHeight: 16 },
    menuFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
    menuPrice: { fontSize: 16, color: palette.accent },
    availabilityToggle: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    availabilityLabel: { fontSize: 11, color: palette.textMuted },
    editButton: { padding: 12, justifyContent: 'center' },
  });
