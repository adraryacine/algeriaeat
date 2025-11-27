import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Animated, {
  FadeInDown,
  FadeInUp,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const routeCoordinates = [
  { latitude: 36.7738, longitude: 3.0588 },
  { latitude: 36.7638, longitude: 3.0588 },
  { latitude: 36.7538, longitude: 3.0658 },
  { latitude: 36.7438, longitude: 3.071 },
];

const trackingSteps = [
  { id: 1, title: 'Commande confirmée', time: '14:30', completed: true, icon: 'checkmark-circle' },
  { id: 2, title: 'En préparation', time: '14:35', completed: true, icon: 'restaurant' },
  { id: 3, title: 'En route', time: '15:00', completed: true, icon: 'bicycle', active: true },
  { id: 4, title: 'Livraison', time: '15:25', completed: false, icon: 'location' },
];

export default function TrackingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const palette = Colors[scheme];
  const styles = useMemo(() => createStyles(palette), [palette]);

  const [currentStep, setCurrentStep] = useState<number>(3);
  const [estimatedTime, setEstimatedTime] = useState<number>(15);
  const [driverLocation, setDriverLocation] = useState<typeof routeCoordinates[number]>(routeCoordinates[1]);

  useEffect(() => {
    const locationTimer = setInterval(() => {
      setDriverLocation((prev: typeof routeCoordinates[number]) => {
        const currentIndex = routeCoordinates.findIndex(
          (coord) => coord.latitude === prev.latitude && coord.longitude === prev.longitude
        );
        const nextIndex = currentIndex === -1 || currentIndex === routeCoordinates.length - 1 ? 0 : currentIndex + 1;
        return routeCoordinates[nextIndex];
      });
    }, 5000);
    return () => clearInterval(locationTimer);
  }, []);
  const pulseAnimation = useSharedValue(0);
  const progressAnimation = useSharedValue(75);

  useEffect(() => {
    const timer = setInterval(() => {
    setEstimatedTime((prev) => {
        const next = prev > 0 ? prev - 1 : 0;
        progressAnimation.value = withTiming((next / 15) * 100, { duration: 1000 });
        return next;
      });
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    pulseAnimation.value = withRepeat(withTiming(1, { duration: 2000 }), -1, true);
  }, []);

  const order = {
    id: 'ORD-12345',
    restaurant: 'Le Gourmet Algérien',
    items: ['Couscous Royal x2', "Tajine d'Agneau x1"],
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
            colors={palette.gradientPrimary as unknown as [string, string, ...string[]]}
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
                <ThemedText style={styles.progressText}>{estimatedTime} min restants</ThemedText>
                <ThemedText style={styles.progressText}>{Math.round((estimatedTime / 15) * 100)}% complété</ThemedText>
              </View>
            </View>
          </LinearGradient>

          <View style={styles.orderDetails}>
            <View style={styles.orderItems}>
              {order.items.map((item, index) => (
                <View key={index} style={styles.orderItemRow}>
                  <Ionicons name="checkmark-circle" size={16} color={palette.success} />
                  <ThemedText style={styles.orderItem}>{item}</ThemedText>
                </View>
              ))}
            </View>
            <View style={styles.orderFooter}>
              <View>
                <ThemedText style={styles.orderLabel}>Livraison estimée</ThemedText>
                <View style={styles.timeContainer}>
                  <Ionicons name="time" size={18} color={palette.accent} />
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
              <Ionicons name="refresh" size={20} color={palette.accent} />
            </TouchableOpacity>
          </View>
          {trackingSteps.map((step, index) => {
            const isActive = step.active || (index === currentStep && !step.completed);
            return (
              <Animated.View key={step.id} entering={FadeInDown.duration(400).delay(300 + index * 100)} style={styles.trackingStep}>
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
                    <View style={[styles.stepLine, step.completed && styles.stepLineCompleted, isActive && styles.stepLineActive]} />
                  )}
                </View>
                <View style={styles.stepContent}>
                  <View style={styles.stepHeader}>
                    <View style={styles.stepIconContainer}>
                      <Ionicons
                        name={step.icon as any}
                        size={20}
                        color={step.completed ? palette.success : isActive ? palette.accent : palette.icon}
                      />
                    </View>
                    <View style={styles.stepTextContainer}>
                      <ThemedText
                        type="defaultSemiBold"
                        style={[styles.stepTitle, step.completed && styles.stepTitleCompleted, isActive && styles.stepTitleActive]}>
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
              <Ionicons name="person" size={32} color={palette.accent} />
              <Animated.View style={[styles.driverStatusIndicator, pulseStyle]} />
            </View>
            <View style={styles.deliveryInfo}>
              <ThemedText type="defaultSemiBold" style={styles.deliveryName}>
                {order.driverName}
              </ThemedText>
              <ThemedText style={styles.deliveryPhone}>{order.driverPhone}</ThemedText>
              <View style={styles.driverStats}>
                <View style={styles.driverStatItem}>
                  <Ionicons name="time" size={14} color={palette.icon} />
                  <ThemedText style={styles.driverStatText}>5 min</ThemedText>
                </View>
                <View style={styles.driverStatItem}>
                  <Ionicons name="location" size={14} color={palette.icon} />
                  <ThemedText style={styles.driverStatText}>1.2 km</ThemedText>
                </View>
              </View>
            </View>
            <View style={styles.deliveryActions}>
              <TouchableOpacity style={styles.callButton}>
                <Ionicons name="call" size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.messageButton}>
                <Ionicons name="chatbubble" size={20} color={palette.accent} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.deliveryAddress}>
            <Ionicons name="location" size={18} color={palette.accent} />
            <View style={styles.addressContainer}>
              <ThemedText style={styles.deliveryAddressLabel}>Adresse de livraison</ThemedText>
              <ThemedText style={styles.deliveryAddressText}>{order.deliveryAddress}</ThemedText>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(600).delay(600)} style={styles.mapContainer}>
          <View style={styles.mapHeader}>
            <ThemedText type="subtitle" style={styles.mapTitle}>
              Suivi en temps réel
            </ThemedText>
            <TouchableOpacity style={styles.mapControls}>
              <Ionicons name="expand" size={20} color={palette.accent} />
            </TouchableOpacity>
          </View>
          <MapView
            style={styles.mapPlaceholder}
            initialRegion={{
              latitude: driverLocation.latitude,
              longitude: driverLocation.longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}>
            <Marker coordinate={routeCoordinates[0]} title="Restaurant" pinColor="#4CAF50" />
            <Marker coordinate={routeCoordinates[routeCoordinates.length - 1]} title="Destination" pinColor="#FF6B6B" />
            <Marker coordinate={driverLocation} title="Livreur" pinColor={palette.accent} />
            <Polyline coordinates={routeCoordinates} strokeColor={palette.accent} strokeWidth={4} />
          </MapView>
          <View style={styles.mapLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
              <ThemedText style={styles.legendText}>Restaurant</ThemedText>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: palette.accent }]} />
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

const createStyles = (palette: typeof Colors.light) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: palette.background,
    },
    header: {
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
    scrollView: {
      flex: 1,
    },
    orderCard: {
      backgroundColor: palette.card,
      margin: 20,
      borderRadius: 20,
      overflow: 'hidden',
      ...Platform.select({
        ios: {
          shadowColor: palette.heroShadow,
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
      color: palette.textMuted,
      marginBottom: 4,
      fontWeight: '500',
    },
    restaurantName: {
      fontSize: 18,
      color: palette.text,
      fontWeight: '700',
    },
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: palette.accentMuted,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      gap: 6,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '700',
      color: palette.accent,
    },
    orderItems: {
      marginBottom: 16,
      paddingBottom: 16,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: palette.border,
    },
    orderItem: {
      fontSize: 14,
      color: palette.textMuted,
      marginBottom: 4,
      fontWeight: '500',
    },
    orderFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    orderLabel: {
      fontSize: 12,
      color: palette.textMuted,
      marginBottom: 4,
      fontWeight: '500',
    },
    orderTime: {
      fontSize: 16,
      color: palette.text,
      fontWeight: '700',
    },
    orderTotal: {
      alignItems: 'flex-end',
    },
    orderTotalAmount: {
      fontSize: 18,
      color: palette.accent,
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
      backgroundColor: palette.accent,
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
      backgroundColor: palette.card,
      marginHorizontal: 20,
      marginBottom: 20,
      padding: 20,
      borderRadius: 20,
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
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: palette.text,
    },
    refreshButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: palette.accentMuted,
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
      backgroundColor: palette.success,
      justifyContent: 'center',
      alignItems: 'center',
    },
    stepActive: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: palette.accentMuted,
      borderWidth: 3,
      borderColor: palette.accent,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
    stepActiveDot: {
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: palette.accent,
      zIndex: 2,
    },
    stepActivePulse: {
      position: 'absolute',
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: palette.accent,
      opacity: 0.3,
    },
    stepIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: palette.surfaceMuted,
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
      backgroundColor: palette.accentMuted,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      marginTop: 8,
    },
    activeStepText: {
      fontSize: 12,
      fontWeight: '700',
      color: palette.accent,
    },
    stepPending: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: palette.surfaceMuted,
      borderWidth: 2,
      borderColor: palette.border,
    },
    stepLine: {
      width: 3,
      height: 50,
      backgroundColor: palette.border,
      marginTop: 4,
    },
    stepLineCompleted: {
      backgroundColor: palette.success,
    },
    stepLineActive: {
      backgroundColor: palette.accent,
    },
    stepContent: {
      flex: 1,
      paddingTop: 4,
    },
    stepTitle: {
      fontSize: 16,
      color: palette.textMuted,
      marginBottom: 4,
      fontWeight: '600',
    },
    stepTitleCompleted: {
      color: palette.success,
    },
    stepTitleActive: {
      color: palette.accent,
    },
    stepTime: {
      fontSize: 12,
      color: palette.textMuted,
      fontWeight: '400',
    },
    deliveryCard: {
      backgroundColor: palette.card,
      marginHorizontal: 20,
      marginBottom: 20,
      padding: 20,
      borderRadius: 20,
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
    deliveryCardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    deliveryCardTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: palette.text,
    },
    driverRating: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: palette.surfaceMuted,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      gap: 4,
    },
    driverRatingText: {
      fontSize: 14,
      fontWeight: '700',
      color: palette.text,
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
      backgroundColor: palette.accentMuted,
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
      backgroundColor: palette.success,
      borderWidth: 2,
      borderColor: palette.card,
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
      color: palette.textMuted,
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
      backgroundColor: palette.accentMuted,
      justifyContent: 'center',
      alignItems: 'center',
    },
    deliveryInfo: {
      flex: 1,
      marginLeft: 12,
    },
    deliveryName: {
      fontSize: 16,
      color: palette.text,
      marginBottom: 4,
      fontWeight: '700',
    },
    deliveryPhone: {
      fontSize: 14,
      color: palette.textMuted,
      fontWeight: '500',
    },
    callButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: palette.accent,
      justifyContent: 'center',
      alignItems: 'center',
    },
    deliveryAddress: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingTop: 16,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: palette.border,
    },
    addressContainer: {
      flex: 1,
      marginLeft: 8,
    },
    deliveryAddressLabel: {
      fontSize: 12,
      color: palette.textMuted,
      marginBottom: 4,
      fontWeight: '500',
    },
    deliveryAddressText: {
      fontSize: 14,
      color: palette.text,
      fontWeight: '600',
    },
    mapContainer: {
      marginHorizontal: 20,
      marginBottom: 20,
      borderRadius: 20,
      overflow: 'hidden',
      backgroundColor: palette.card,
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
    mapHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: palette.border,
    },
    mapTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: palette.text,
    },
    mapControls: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: palette.accentMuted,
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
      color: palette.textMuted,
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
      backgroundColor: palette.card,
      justifyContent: 'center',
      alignItems: 'center',
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
    driverMarker: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: palette.card,
      justifyContent: 'center',
      alignItems: 'center',
      transform: [{ translateX: -24 }, { translateY: -24 }],
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
    destinationMarker: {
      position: 'absolute',
      bottom: '20%',
      right: '20%',
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: palette.card,
      justifyContent: 'center',
      alignItems: 'center',
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
    mapLegend: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 16,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: palette.border,
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
      color: palette.textMuted,
      fontWeight: '500',
    },
  });
