import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    FlatList,
    Platform,
    RefreshControl,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
    Modal,
    Pressable,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const orders = [
  {
    id: 'ORD-12345',
    restaurant: 'Le Gourmet Algérien',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
    items: 3,
    total: 4050,
    status: 'En route',
    date: 'Aujourd\'hui, 14:30',
    statusColor: '#FF6B6B',
    canReorder: true,
    canRate: false,
    canTrack: true,
    estimatedTime: '15 min',
    itemsList: ['Couscous Royal x2', 'Tajine d\'Agneau x1'],
  },
  {
    id: 'ORD-12344',
    restaurant: 'Pizza Palace',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
    items: 2,
    total: 1800,
    status: 'Livré',
    date: 'Hier, 19:45',
    statusColor: '#4ECDC4',
    canReorder: true,
    canRate: true,
    canTrack: false,
    rating: 5,
    itemsList: ['Pizza Margherita x1', 'Pizza Pepperoni x1'],
  },
  {
    id: 'ORD-12343',
    restaurant: 'Burger House',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    items: 1,
    total: 650,
    status: 'Livré',
    date: '23 Nov, 12:20',
    statusColor: '#4ECDC4',
    canReorder: true,
    canRate: true,
    canTrack: false,
    rating: 4,
    itemsList: ['Burger Deluxe x1'],
  },
];

const orderFilters = ['Toutes', 'En cours', 'Livrées', 'Annulées'];

export default function OrdersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = React.useState(false);
  const [selectedFilter, setSelectedFilter] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null);
  const [orderDetailsModal, setOrderDetailsModal] = useState(false);
  const [ratingModal, setRatingModal] = useState(false);
  const [rating, setRating] = useState(0);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const filteredOrders = selectedFilter === 0
    ? orders
    : selectedFilter === 1
    ? orders.filter(o => o.status === 'En route' || o.status === 'En préparation')
    : selectedFilter === 2
    ? orders.filter(o => o.status === 'Livré')
    : orders.filter(o => o.status === 'Annulée');

  const handleOrderPress = (order: typeof orders[0]) => {
    if (order.canTrack) {
      router.push('/(tabs)/tracking');
    } else {
      setSelectedOrder(order);
      setOrderDetailsModal(true);
    }
  };

  const handleRateOrder = (order: typeof orders[0]) => {
    setSelectedOrder(order);
    setRating(order.rating || 0);
    setRatingModal(true);
  };

  const renderOrder = ({ item, index }: { item: typeof orders[0]; index: number }) => (
    <Animated.View entering={FadeInDown.duration(400).delay(index * 100)}>
      <TouchableOpacity
        style={styles.orderCard}
        onPress={() => handleOrderPress(item)}
        activeOpacity={0.7}>
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
                <ThemedText style={[styles.statusText, { color: item.statusColor }]}>
                  {item.status}
                </ThemedText>
              </View>
            </View>
          </View>
          <ThemedText style={styles.orderId}>Commande #{item.id}</ThemedText>
          <ThemedText style={styles.orderDate}>{item.date}</ThemedText>
          {item.canTrack && (
            <View style={styles.estimatedTimeContainer}>
              <Ionicons name="time" size={14} color="#FF6B6B" />
              <ThemedText style={styles.estimatedTime}>
                Livraison dans {item.estimatedTime}
              </ThemedText>
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
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => router.push('/(tabs)/tracking')}>
                <Ionicons name="location" size={16} color="#FF6B6B" />
                <ThemedText style={styles.actionButtonText}>Suivre</ThemedText>
              </TouchableOpacity>
            )}
            {item.canReorder && (
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="refresh" size={16} color="#FF6B6B" />
                <ThemedText style={styles.actionButtonText}>Commander à nouveau</ThemedText>
              </TouchableOpacity>
            )}
            {item.canRate && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleRateOrder(item)}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <ThemedText style={styles.actionButtonText}>
                  {item.rating ? `Noté ${item.rating}/5` : 'Noter'}
                </ThemedText>
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
          <Ionicons name="search" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterTabs}>
          {orderFilters.map((filter, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.filterTab,
                selectedFilter === index && styles.filterTabActive,
              ]}
              onPress={() => setSelectedFilter(index)}
              activeOpacity={0.7}>
              <ThemedText
                style={[
                  styles.filterTabText,
                  selectedFilter === index && styles.filterTabTextActive,
                ]}>
                {filter}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {filteredOrders.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="receipt-outline" size={64} color="#CCC" />
          <ThemedText style={styles.emptyStateText}>
            Aucune commande pour le moment
          </ThemedText>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          renderItem={renderOrder}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}

      {/* Order Details Modal */}
      <Modal
        visible={orderDetailsModal}
        transparent
        animationType="slide"
        onRequestClose={() => setOrderDetailsModal(false)}>
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setOrderDetailsModal(false)}>
          <View
            style={styles.modalContent}
            onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <ThemedText type="subtitle" style={styles.modalTitle}>
                Détails de la commande
              </ThemedText>
              <TouchableOpacity onPress={() => setOrderDetailsModal(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            {selectedOrder && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.modalOrderInfo}>
                  <ThemedText style={styles.modalOrderId}>
                    Commande #{selectedOrder.id}
                  </ThemedText>
                  <ThemedText type="defaultSemiBold" style={styles.modalRestaurant}>
                    {selectedOrder.restaurant}
                  </ThemedText>
                  <ThemedText style={styles.modalDate}>{selectedOrder.date}</ThemedText>
                </View>
                <View style={styles.modalItems}>
                  <ThemedText type="defaultSemiBold" style={styles.modalSectionTitle}>
                    Articles commandés
                  </ThemedText>
                  {selectedOrder.itemsList.map((item, index) => (
                    <View key={index} style={styles.modalItemRow}>
                      <Ionicons name="checkmark-circle" size={16} color="#4ECDC4" />
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
      <Modal
        visible={ratingModal}
        transparent
        animationType="fade"
        onRequestClose={() => setRatingModal(false)}>
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setRatingModal(false)}>
          <View
            style={styles.ratingModalContent}
            onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <ThemedText type="subtitle" style={styles.modalTitle}>
                Noter la commande
              </ThemedText>
              <TouchableOpacity onPress={() => setRatingModal(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            {selectedOrder && (
              <View style={styles.ratingContent}>
                <ThemedText style={styles.ratingRestaurant}>
                  {selectedOrder.restaurant}
                </ThemedText>
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => setRating(star)}
                      style={styles.starButton}>
                      <Ionicons
                        name={star <= rating ? 'star' : 'star-outline'}
                        size={40}
                        color={star <= rating ? '#FFD700' : '#CCC'}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
                <TouchableOpacity
                  style={styles.submitRatingButton}
                  onPress={() => {
                    setRatingModal(false);
                    // Handle rating submission
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
  searchButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
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
    backgroundColor: '#F5F5F5',
    marginRight: 8,
  },
  filterTabActive: {
    backgroundColor: '#FF6B6B',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A4A4A',
  },
  filterTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  listContent: {
    padding: 20,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
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
    backgroundColor: '#FF6B6B',
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
    backgroundColor: '#FFF5F5',
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
    color: '#FF6B6B',
  },
  orderActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FF6B6B',
  },
  orderRestaurant: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
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
    color: '#666',
    marginBottom: 4,
    fontWeight: '500',
  },
  orderDate: {
    fontSize: 12,
    color: '#666',
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
    color: '#4A4A4A',
    fontWeight: '500',
  },
  orderTotal: {
    fontSize: 16,
    color: '#FF6B6B',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#4A4A4A',
    marginTop: 16,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
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
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
  },
  modalBody: {
    padding: 20,
  },
  modalOrderInfo: {
    marginBottom: 20,
  },
  modalOrderId: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    fontWeight: '500',
  },
  modalRestaurant: {
    fontSize: 20,
    color: '#000000',
    marginBottom: 4,
    fontWeight: '700',
  },
  modalDate: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  modalItems: {
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontSize: 16,
    color: '#000000',
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
    color: '#4A4A4A',
    fontWeight: '500',
  },
  modalTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  modalTotalLabel: {
    fontSize: 18,
    color: '#000000',
    fontWeight: '700',
  },
  modalTotalAmount: {
    fontSize: 20,
    color: '#FF6B6B',
    fontWeight: '700',
  },
  ratingModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    margin: 20,
    maxWidth: 400,
    alignSelf: 'center',
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
  ratingContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  ratingRestaurant: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
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
    backgroundColor: '#FF6B6B',
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

