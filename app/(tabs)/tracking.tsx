import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
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
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
    interpolate,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const trackingSteps = [
  { id: 1, title: 'Commande confirmée', time: '14:30', completed: true, icon: 'checkmark-circle' },
  { id: 2, title: 'En préparation', time: '14:35', completed: true, icon: 'restaurant' },
  { id: 3, title: 'En route', time: '15:00', completed: true, icon: 'bicycle', active: true },
  { id: 4, title: 'Livraison', time: '15:25', completed: false, icon: 'location' },
];

export default function TrackingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(3);
  const [estimatedTime, setEstimatedTime] = useState(15);
  const [driverLocation, setDriverLocation] = useState({ lat: 36.7538, lng: 3.0588 });
  const pulseAnimation = useSharedValue(0);
  const progressAnimation = useSharedValue(75);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setEstimatedTime((prev) => (prev > 0 ? prev - 1 : 0));
      if (estimatedTime > 0) {
        progressAnimation.value = withTiming((estimatedTime / 15) * 100, { duration: 1000 });
      }
    }, 60000);
    return () => clearInterval(timer);
  }, [estimatedTime]);

  useEffect(() => {
    pulseAnimation.value = withRepeat(
      withTiming(1, { duration: 2000 }),
      -1,
      true
    );
  }, []);

  const order = {
    id: 'ORD-12345',
    restaurant: 'Le Gourmet Algérien',
    items: ['Couscous Royal x2', 'Tajine d\'Agneau x1'],
    total: 4050,
    estimatedTime: '15:25',
    deliveryAddress: '123 Rue Didouche Mourad, Alger',
    driverName: 'Ahmed Benali',
    driverPhone: '+213 555 789 012',
    driverRating: 4.8,
  };

  const pulseStyle = useAnimatedStyle(() => {
    const opacity = interpolate(pulseAnimation.value, [0, 1], [0.5, 1]);
    const scale = interpolate(pulseAnimation.value, [0, 1], [1, 1.2]);
    return {
      opacity,
      transform: [{ scale }],
    };
  });

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${progressAnimation.value}%`,
    };
  });

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <ThemedText type="subtitle" style={styles.headerTitle}>
          Suivi de commande
        </ThemedText>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Enhanced Order Info Card */}
        <Animated.View entering={FadeInDown.duration(600)} style={styles.orderCard}>
          <LinearGradient
            colors={['#FF6B6B', '#FF8E8E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.orderCardGradient}>
            <View style={styles.orderHeader}>
              <View>
                <ThemedText style={styles.orderIdWhite}>Commande #{order.id}</ThemedText>
                <ThemedText type="defaultSemiBold" style={styles.restaurantNameWhite}>
                  {order.restaurant}
                </ThemedText>
              </View>
              <View style={styles.statusBadgeWhite}>
                <Ionicons name="bicycle" size={16} color="#FFFFFF" />
                <ThemedText style={styles.statusTextWhite}>En route</ThemedText>
              </View>
            </View>
            
            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBarBackground}>
                <Animated.View style={[styles.progressBarFill, progressStyle]}>
                  <LinearGradient
                    colors={['#FFFFFF', '#FFF5F5']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.progressGradient}
                  />
                </Animated.View>
              </View>
              <View style={styles.progressInfo}>
                <ThemedText style={styles.progressText}>
                  {estimatedTime} min restants
                </ThemedText>
                <ThemedText style={styles.progressText}>
                  {Math.round((estimatedTime / 15) * 100)}% complété
                </ThemedText>
              </View>
            </View>
          </LinearGradient>

          <View style={styles.orderDetails}>
            <View style={styles.orderItems}>
              {order.items.map((item, index) => (
                <View key={index} style={styles.orderItemRow}>
                  <Ionicons name="checkmark-circle" size={16} color="#4ECDC4" />
                  <ThemedText style={styles.orderItem}>{item}</ThemedText>
                </View>
              ))}
            </View>
            <View style={styles.orderFooter}>
              <View>
                <ThemedText style={styles.orderLabel}>Livraison estimée</ThemedText>
                <View style={styles.timeContainer}>
                  <Ionicons name="time" size={18} color="#FF6B6B" />
                  <ThemedText type="defaultSemiBold" style={styles.orderTime}>
                    {estimatedTime} min
                  </ThemedText>
                </View>
              </View>
              <View style={styles.orderTotal}>
                <ThemedText style={styles.orderLabel}>Total</ThemedText>
                <ThemedText type="defaultSemiBold" style={styles.orderTotalAmount}>
                  {order.total} DA
                </ThemedText>
              </View>
            </View>
            <TouchableOpacity style={styles.trackButton}>
              <Ionicons name="location" size={18} color="#FFFFFF" />
              <ThemedText style={styles.trackButtonText}>Suivre sur la carte</ThemedText>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Enhanced Tracking Steps */}
        <Animated.View entering={FadeInUp.duration(600).delay(200)} style={styles.trackingSection}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Statut de la commande
            </ThemedText>
            <TouchableOpacity style={styles.refreshButton}>
              <Ionicons name="refresh" size={20} color="#FF6B6B" />
            </TouchableOpacity>
          </View>
          {trackingSteps.map((step, index) => {
            const isActive = step.active || (index === currentStep && !step.completed);
            return (
              <Animated.View
                key={step.id}
                entering={FadeInDown.duration(400).delay(300 + index * 100)}
                style={styles.trackingStep}>
                <View style={styles.stepIndicator}>
                  {step.completed ? (
                    <View style={styles.stepCompleted}>
                      <Ionicons name="checkmark" size={16} color="#FFF" />
                    </View>
                  ) : isActive ? (
                    <Animated.View style={[styles.stepActive, pulseStyle]}>
                      <View style={styles.stepActiveDot} />
                      <View style={styles.stepActivePulse} />
                    </Animated.View>
                  ) : (
                    <View style={styles.stepPending} />
                  )}
                  {index < trackingSteps.length - 1 && (
                    <View
                      style={[
                        styles.stepLine,
                        step.completed && styles.stepLineCompleted,
                        isActive && styles.stepLineActive,
                      ]}
                    />
                  )}
                </View>
                <View style={styles.stepContent}>
                  <View style={styles.stepHeader}>
                    <View style={styles.stepIconContainer}>
                      <Ionicons
                        name={step.icon as any}
                        size={20}
                        color={
                          step.completed
                            ? '#4ECDC4'
                            : isActive
                            ? '#FF6B6B'
                            : '#999'
                        }
                      />
                    </View>
                    <View style={styles.stepTextContainer}>
                      <ThemedText
                        type="defaultSemiBold"
                        style={[
                          styles.stepTitle,
                          step.completed && styles.stepTitleCompleted,
                          isActive && styles.stepTitleActive,
                        ]}>
                        {step.title}
                      </ThemedText>
                      <ThemedText style={styles.stepTime}>{step.time}</ThemedText>
                    </View>
                  </View>
                  {isActive && (
                    <View style={styles.activeStepBadge}>
                      <ThemedText style={styles.activeStepText}>En cours...</ThemedText>
                    </View>
                  )}
                </View>
              </Animated.View>
            );
          })}
        </Animated.View>

        {/* Enhanced Delivery Info */}
        <Animated.View entering={FadeInUp.duration(600).delay(400)} style={styles.deliveryCard}>
          <View style={styles.deliveryCardHeader}>
            <ThemedText type="subtitle" style={styles.deliveryCardTitle}>
              Livreur
            </ThemedText>
            <View style={styles.driverRating}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <ThemedText style={styles.driverRatingText}>{order.driverRating}</ThemedText>
            </View>
          </View>
          <View style={styles.deliveryHeader}>
            <View style={styles.driverAvatar}>
              <Ionicons name="person" size={32} color="#FF6B6B" />
              <Animated.View style={[styles.driverStatusIndicator, pulseStyle]} />
            </View>
            <View style={styles.deliveryInfo}>
              <ThemedText type="defaultSemiBold" style={styles.deliveryName}>
                {order.driverName}
              </ThemedText>
              <ThemedText style={styles.deliveryPhone}>{order.driverPhone}</ThemedText>
              <View style={styles.driverStats}>
                <View style={styles.driverStatItem}>
                  <Ionicons name="time" size={14} color="#666" />
                  <ThemedText style={styles.driverStatText}>5 min</ThemedText>
                </View>
                <View style={styles.driverStatItem}>
                  <Ionicons name="location" size={14} color="#666" />
                  <ThemedText style={styles.driverStatText}>1.2 km</ThemedText>
                </View>
              </View>
            </View>
            <View style={styles.deliveryActions}>
              <TouchableOpacity style={styles.callButton}>
                <Ionicons name="call" size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.messageButton}>
                <Ionicons name="chatbubble" size={20} color="#FF6B6B" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.deliveryAddress}>
            <Ionicons name="location" size={18} color="#FF6B6B" />
            <View style={styles.addressContainer}>
              <ThemedText style={styles.deliveryAddressLabel}>Adresse de livraison</ThemedText>
              <ThemedText style={styles.deliveryAddressText}>
                {order.deliveryAddress}
              </ThemedText>
            </View>
          </View>
        </Animated.View>

        {/* Enhanced Map Placeholder */}
        <Animated.View entering={FadeInUp.duration(600).delay(600)} style={styles.mapContainer}>
          <View style={styles.mapHeader}>
            <ThemedText type="subtitle" style={styles.mapTitle}>
              Suivi en temps réel
            </ThemedText>
            <TouchableOpacity style={styles.mapControls}>
              <Ionicons name="expand" size={20} color="#FF6B6B" />
            </TouchableOpacity>
          </View>
          <View style={styles.mapPlaceholder}>
            <LinearGradient
              colors={['#F5F5F5', '#E0E0E0']}
              style={styles.mapGradient}>
              <Ionicons name="map" size={64} color="#999" />
              <ThemedText style={styles.mapPlaceholderText}>
                Carte de suivi en temps réel
              </ThemedText>
              <View style={styles.mapMarkers}>
                <View style={styles.restaurantMarker}>
                  <Ionicons name="restaurant" size={24} color="#4ECDC4" />
                </View>
                <Animated.View style={[styles.driverMarker, pulseStyle]}>
                  <Ionicons name="bicycle" size={24} color="#FF6B6B" />
                </Animated.View>
                <View style={styles.destinationMarker}>
                  <Ionicons name="location" size={24} color="#FF6B6B" />
                </View>
              </View>
            </LinearGradient>
          </View>
          <View style={styles.mapLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#4ECDC4' }]} />
              <ThemedText style={styles.legendText}>Restaurant</ThemedText>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#FF6B6B' }]} />
              <ThemedText style={styles.legendText}>Livreur</ThemedText>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#FF6B6B' }]} />
              <ThemedText style={styles.legendText}>Destination</ThemedText>
            </View>
          </View>
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
  orderCard: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
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
  orderCardGradient: {
    padding: 20,
  },
  orderIdWhite: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
    fontWeight: '500',
  },
  restaurantNameWhite: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  statusBadgeWhite: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusTextWhite: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  progressContainer: {
    marginTop: 20,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressGradient: {
    flex: 1,
    borderRadius: 4,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  orderDetails: {
    padding: 20,
  },
  orderItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  orderId: {
    fontSize: 14,
    color: '#4A4A4A',
    marginBottom: 4,
    fontWeight: '500',
  },
  restaurantName: {
    fontSize: 18,
    color: '#000000',
    fontWeight: '700',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF6B6B',
  },
  orderItems: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  orderItem: {
    fontSize: 14,
    color: '#4A4A4A',
    marginBottom: 4,
    fontWeight: '500',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderLabel: {
    fontSize: 12,
    color: '#4A4A4A',
    marginBottom: 4,
    fontWeight: '500',
  },
  orderTime: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '700',
  },
  orderTotal: {
    alignItems: 'flex-end',
  },
  orderTotalAmount: {
    fontSize: 18,
    color: '#FF6B6B',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B6B',
    padding: 14,
    borderRadius: 12,
    marginTop: 12,
    gap: 8,
  },
  trackButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  trackingSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 20,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
  },
  refreshButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackingStep: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  stepIndicator: {
    alignItems: 'center',
    marginRight: 16,
  },
  stepCompleted: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4ECDC4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepActive: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF5F5',
    borderWidth: 3,
    borderColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  stepActiveDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FF6B6B',
    zIndex: 2,
  },
  stepActivePulse: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6B6B',
    opacity: 0.3,
  },
  stepIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepTextContainer: {
    flex: 1,
  },
  activeStepBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF5F5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  activeStepText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF6B6B',
  },
  stepPending: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  stepLine: {
    width: 3,
    height: 50,
    backgroundColor: '#E0E0E0',
    marginTop: 4,
  },
  stepLineCompleted: {
    backgroundColor: '#4ECDC4',
  },
  stepLineActive: {
    backgroundColor: '#FF6B6B',
  },
  stepContent: {
    flex: 1,
    paddingTop: 4,
  },
  stepTitle: {
    fontSize: 16,
    color: '#4A4A4A',
    marginBottom: 4,
    fontWeight: '600',
  },
  stepTitleCompleted: {
    color: '#4ECDC4',
  },
  stepTitleActive: {
    color: '#FF6B6B',
  },
  stepTime: {
    fontSize: 12,
    color: '#666',
    fontWeight: '400',
  },
  deliveryCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 20,
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
  deliveryCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  deliveryCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  driverRating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  driverRatingText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  deliveryHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  driverAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  driverStatusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4ECDC4',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  driverStats: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  driverStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  driverStatText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  deliveryActions: {
    flexDirection: 'row',
    gap: 8,
  },
  messageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deliveryInfo: {
    flex: 1,
    marginLeft: 12,
  },
  deliveryName: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 4,
    fontWeight: '700',
  },
  deliveryPhone: {
    fontSize: 14,
    color: '#4A4A4A',
    fontWeight: '500',
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deliveryAddress: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  addressContainer: {
    flex: 1,
    marginLeft: 8,
  },
  deliveryAddressLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontWeight: '500',
  },
  deliveryAddressText: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '600',
  },
  mapContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
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
  mapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  mapControls: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholder: {
    height: 250,
    position: 'relative',
    overflow: 'hidden',
  },
  mapGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholderText: {
    fontSize: 14,
    color: '#666',
    marginTop: 12,
    fontWeight: '500',
  },
  mapMarkers: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  restaurantMarker: {
    position: 'absolute',
    top: '20%',
    left: '20%',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
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
  driverMarker: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateX: -24 }, { translateY: -24 }],
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
  destinationMarker: {
    position: 'absolute',
    bottom: '20%',
    right: '20%',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
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
  mapLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
});

