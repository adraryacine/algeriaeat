import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useOrders } from '@/providers/orders-provider';
import type { Order } from '@/types/order';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const orderFilters = ['Toutes', 'En cours', 'Livrées', 'Annulées'] as const;

export default function OrdersScreen() {
  const { orders } = useOrders();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[(colorScheme ?? 'light') as 'light' | 'dark'];
  const styles = useMemo(() => createStyles(palette), [palette]);

  const [refreshing, setRefreshing] = React.useState(false);
  const [selectedFilter, setSelectedFilter] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<(typeof orders)[0] | null>(null);
  const [orderDetailsModal, setOrderDetailsModal] = useState(false);
  const [ratingModal, setRatingModal] = useState(false);
  const [rating, setRating] = useState(0);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const filteredOrders: Order[] = useMemo(() => {
    if (selectedFilter === 0) return orders;
    if (selectedFilter === 1) {
      return orders.filter((order: Order) => order.status === 'En route');
    }
    if (selectedFilter === 2) {
      return orders.filter((order: Order) => order.status === 'Livré');
    }
    return orders.filter((order: Order) => order.status === 'Annulée');
  }, [orders, selectedFilter]);

  const handleOrderPress = (order: Order) => {
    if (order.canTrack) {
      router.push('/(tabs)/tracking');
    } else {
      setSelectedOrder(order);
      setOrderDetailsModal(true);
    }
  };

  const handleRateOrder = (order: Order) => {
    setSelectedOrder(order);
    setRating(order.rating || 0);
    setRatingModal(true);
  };

  const renderOrder = ({ item, index }: { item: Order; index: number }) => (
    <Animated.View entering={FadeInDown.duration(400).delay(index * 100)}>
      <TouchableOpacity style={styles.orderCard} onPress={() => handleOrderPress(item)} activeOpacity={0.7}>
        <View style={styles.orderImageContainer}>
          <Image source={{ uri: item.image }} style={styles.orderImage} contentFit="cover" />
          {item.canTrack && (
            <View style={styles.trackingBadge}>
              <Ionicons name="bicycle" size={12} color="#FFFFFF" />
            </View>
          )}
        </View>
        <View style={styles.orderInfo}>
          <View style={styles.orderHeader}>
            <View style={styles.orderHeaderLeft}>
              <ThemedText type="defaultSemiBold" style={styles.orderRestaurant}>
                {item.restaurant}
              </ThemedText>
              <View style={[styles.statusBadge, { backgroundColor: item.statusColor + '20' }]}>
                <ThemedText style={[styles.statusText, { color: item.statusColor }]}>{item.status}</ThemedText>
              </View>
            </View>
          </View>
          <ThemedText style={styles.orderId}>Commande #{item.id}</ThemedText>
          <ThemedText style={styles.orderDate}>{item.date}</ThemedText>
          {item.canTrack && (
            <View style={styles.estimatedTimeContainer}>
              <Ionicons name="time" size={14} color={palette.accent} />
              <ThemedText style={styles.estimatedTime}>Livraison dans {item.estimatedTime}</ThemedText>
            </View>
          )}
          <View style={styles.orderFooter}>
            <ThemedText style={styles.orderItems}>{item.items} article(s)</ThemedText>
            <ThemedText type="defaultSemiBold" style={styles.orderTotal}>
              {item.total} DA
            </ThemedText>
          </View>
          <View style={styles.orderActions}>
            {item.canTrack && (
              <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/(tabs)/tracking')}>
                <Ionicons name="location" size={16} color={palette.accent} />
                <ThemedText style={styles.actionButtonText}>Suivre</ThemedText>
              </TouchableOpacity>
            )}
            {item.canReorder && (
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="refresh" size={16} color={palette.accent} />
                <ThemedText style={styles.actionButtonText}>Commander à nouveau</ThemedText>
              </TouchableOpacity>
            )}
            {item.canRate && (
              <TouchableOpacity style={styles.actionButton} onPress={() => handleRateOrder(item)}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <ThemedText style={styles.actionButtonText}>{item.rating ? `Noté ${item.rating}/5` : 'Noter'}</ThemedText>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <ThemedText type="subtitle" style={styles.headerTitle}>
          Mes commandes
        </ThemedText>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color={palette.text} />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterTabs}>
          {orderFilters.map((filter, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.filterTab, selectedFilter === index && styles.filterTabActive]}
              onPress={() => setSelectedFilter(index)}
              activeOpacity={0.7}>
              <ThemedText style={[styles.filterTabText, selectedFilter === index && styles.filterTabTextActive]}>
                {filter}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {filteredOrders.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="receipt-outline" size={64} color={palette.icon} />
          <ThemedText style={styles.emptyStateText}>Aucune commande pour le moment</ThemedText>
        </View>
      ) : (
        <FlatList<Order>
          data={filteredOrders}
          renderItem={renderOrder}
          keyExtractor={(item: Order) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={palette.accent} />}
        />
      )}

      {/* Order Details Modal */}
      <Modal visible={orderDetailsModal} transparent animationType="slide" onRequestClose={() => setOrderDetailsModal(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setOrderDetailsModal(false)}>
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <ThemedText type="subtitle" style={styles.modalTitle}>
                Détails de la commande
              </ThemedText>
              <TouchableOpacity onPress={() => setOrderDetailsModal(false)}>
                <Ionicons name="close" size={24} color={palette.text} />
              </TouchableOpacity>
            </View>
            {selectedOrder && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.modalOrderInfo}>
                  <ThemedText style={styles.modalOrderId}>Commande #{selectedOrder.id}</ThemedText>
                  <ThemedText type="defaultSemiBold" style={styles.modalRestaurant}>
                    {selectedOrder.restaurant}
                  </ThemedText>
                  <ThemedText style={styles.modalDate}>{selectedOrder.date}</ThemedText>
                  <ThemedText style={[styles.modalDate, {fontWeight:'bold'}]}>Paiement: {selectedOrder.paymentMethod}</ThemedText>
                </View>
                <View style={styles.modalItems}>
                  <ThemedText type="defaultSemiBold" style={styles.modalSectionTitle}>
                    Articles commandés
                  </ThemedText>
                  {selectedOrder.itemsList.map((item: string, index: number) => (
                    <View key={index} style={styles.modalItemRow}>
                      <Ionicons name="checkmark-circle" size={16} color={palette.success} />
                      <ThemedText style={styles.modalItemText}>{item}</ThemedText>
                    </View>
                  ))}
                </View>
                <View style={styles.modalTotal}>
                  <ThemedText type="defaultSemiBold" style={styles.modalTotalLabel}>
                    Total
                  </ThemedText>
                  <ThemedText type="defaultSemiBold" style={styles.modalTotalAmount}>
                    {selectedOrder.total} DA
                  </ThemedText>
                </View>
              </ScrollView>
            )}
          </View>
        </Pressable>
      </Modal>

      {/* Rating Modal */}
      <Modal visible={ratingModal} transparent animationType="fade" onRequestClose={() => setRatingModal(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setRatingModal(false)}>
          <View style={styles.ratingModalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <ThemedText type="subtitle" style={styles.modalTitle}>
                Noter la commande
              </ThemedText>
              <TouchableOpacity onPress={() => setRatingModal(false)}>
                <Ionicons name="close" size={24} color={palette.text} />
              </TouchableOpacity>
            </View>
            {selectedOrder && (
              <View style={styles.ratingContent}>
                <ThemedText style={styles.ratingRestaurant}>{selectedOrder.restaurant}</ThemedText>
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity key={star} onPress={() => setRating(star)} style={styles.starButton}>
                      <Ionicons name={star <= rating ? 'star' : 'star-outline'} size={40} color={star <= rating ? '#FFD700' : palette.icon} />
                    </TouchableOpacity>
                  ))}
                </View>
                <TouchableOpacity
                  style={styles.submitRatingButton}
                  onPress={() => {
                    setRatingModal(false);
                  }}>
                  <ThemedText style={styles.submitRatingText}>Envoyer la note</ThemedText>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </Pressable>
      </Modal>
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
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: palette.border,
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: palette.text,
    },
    searchButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    filterContainer: {
      backgroundColor: palette.surface,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: palette.border,
    },
    filterTabs: {
      paddingHorizontal: 20,
      paddingVertical: 12,
      gap: 8,
    },
    filterTab: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: palette.surfaceMuted,
      marginRight: 8,
    },
    filterTabActive: {
      backgroundColor: palette.accent,
    },
    filterTabText: {
      fontSize: 14,
      fontWeight: '600',
      color: palette.textMuted,
    },
    filterTabTextActive: {
      color: '#FFFFFF',
      fontWeight: '700',
    },
    listContent: {
      padding: 20,
    },
    orderCard: {
      backgroundColor: palette.card,
      borderRadius: 20,
      marginBottom: 16,
      overflow: 'hidden',
      ...Platform.select({
        ios: {
          shadowColor: palette.heroShadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.12,
          shadowRadius: 12,
        },
        android: {
          elevation: 6,
        },
      }),
    },
    orderImageContainer: {
      position: 'relative',
      width: '100%',
      height: 180,
    },
    orderImage: {
      width: '100%',
      height: '100%',
    },
    trackingBadge: {
      position: 'absolute',
      top: 12,
      right: 12,
      backgroundColor: palette.accent,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    orderInfo: {
      flex: 1,
      padding: 16,
      justifyContent: 'space-between',
    },
    orderHeader: {
      marginBottom: 8,
    },
    orderHeaderLeft: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 4,
    },
    estimatedTimeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: palette.accentMuted,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 12,
      alignSelf: 'flex-start',
      marginTop: 8,
      marginBottom: 8,
      gap: 6,
    },
    estimatedTime: {
      fontSize: 12,
      fontWeight: '700',
      color: palette.accent,
    },
    orderActions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: palette.border,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: palette.accentMuted,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 12,
      gap: 6,
    },
    actionButtonText: {
      fontSize: 13,
      fontWeight: '600',
      color: palette.accent,
    },
    orderRestaurant: {
      flex: 1,
      fontSize: 16,
      color: palette.text,
      fontWeight: '700',
    },
    statusBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '700',
    },
    orderId: {
      fontSize: 12,
      color: palette.textMuted,
      marginBottom: 4,
      fontWeight: '500',
    },
    orderDate: {
      fontSize: 12,
      color: palette.textMuted,
      marginBottom: 8,
      fontWeight: '500',
    },
    orderFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    orderItems: {
      fontSize: 14,
      color: palette.textMuted,
      fontWeight: '500',
    },
    orderTotal: {
      fontSize: 16,
      color: palette.accent,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyStateText: {
      fontSize: 16,
      color: palette.textMuted,
      marginTop: 16,
      fontWeight: '500',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: palette.overlay,
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: palette.surface,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      maxHeight: '80%',
      ...Platform.select({
        ios: {
          shadowColor: palette.heroShadow,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.2,
          shadowRadius: 12,
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
      padding: 20,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: palette.border,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: palette.text,
    },
    modalBody: {
      padding: 20,
    },
    modalOrderInfo: {
      marginBottom: 20,
    },
    modalOrderId: {
      fontSize: 14,
      color: palette.textMuted,
      marginBottom: 4,
      fontWeight: '500',
    },
    modalRestaurant: {
      fontSize: 20,
      color: palette.text,
      marginBottom: 4,
      fontWeight: '700',
    },
    modalDate: {
      fontSize: 14,
      color: palette.textMuted,
      fontWeight: '500',
    },
    modalItems: {
      marginBottom: 20,
    },
    modalSectionTitle: {
      fontSize: 16,
      color: palette.text,
      marginBottom: 12,
      fontWeight: '700',
    },
    modalItemRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
      gap: 8,
    },
    modalItemText: {
      fontSize: 14,
      color: palette.textMuted,
      fontWeight: '500',
    },
    modalTotal: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 16,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: palette.border,
    },
    modalTotalLabel: {
      fontSize: 18,
      color: palette.text,
      fontWeight: '700',
    },
    modalTotalAmount: {
      fontSize: 20,
      color: palette.accent,
      fontWeight: '700',
    },
    ratingModalContent: {
      backgroundColor: palette.surface,
      borderRadius: 24,
      padding: 20,
      margin: 20,
      maxWidth: 400,
      alignSelf: 'center',
      ...Platform.select({
        ios: {
          shadowColor: palette.heroShadow,
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.3,
          shadowRadius: 20,
        },
        android: {
          elevation: 10,
        },
      }),
    },
    ratingContent: {
      alignItems: 'center',
      paddingVertical: 20,
    },
    ratingRestaurant: {
      fontSize: 18,
      fontWeight: '700',
      color: palette.text,
      marginBottom: 24,
    },
    starsContainer: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 24,
    },
    starButton: {
      padding: 4,
    },
    submitRatingButton: {
      backgroundColor: palette.accent,
      paddingHorizontal: 32,
      paddingVertical: 14,
      borderRadius: 12,
    },
    submitRatingText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '700',
    },
  });
