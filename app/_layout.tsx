import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect } from 'react';

import { ThemeProvider, useTheme } from '@/providers/theme-provider';
import { SessionProvider } from '@/providers/session-provider';
import { OrdersProvider } from '@/providers/orders-provider';
import { LoyaltyProvider } from '@/providers/loyalty-provider';
import { AccessibilityProvider } from '@/providers/accessibility-provider';
import { useSession } from '@/providers/session-provider';

function RootNavigation() {
  const { colorScheme } = useTheme();
  const navigationTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
  const segments = useSegments();
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useSession();

  useEffect(() => {
    if (isLoading) return;
    const firstSegment = segments[0] ?? '';
    const authScreens = ['login', 'signup'];
    const onAuthScreen = authScreens.includes(firstSegment);

    if (!isAuthenticated && !onAuthScreen) {
      router.replace('/login');
    } else if (isAuthenticated && onAuthScreen) {
      const target =
        user?.role === 'restaurant'
          ? '/(restaurant)/dashboard'
          : user?.role === 'livreur'
            ? '/(livreur)/home'
            : user?.role === 'admin'
              ? '/(admin)/dashboard'
              : '/(tabs)';
      router.replace(target);
    }
  }, [segments, isAuthenticated, isLoading, router, user?.role]);

  return (
    <NavigationThemeProvider value={navigationTheme}>
      <Stack>
        {/* Client tabs (default) */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
        {/* Restaurant tabs */}
        <Stack.Screen name="(restaurant)" options={{ headerShown: false }} />
        
        {/* Livreur tabs */}
        <Stack.Screen name="(livreur)" options={{ headerShown: false }} />
        
        {/* Admin tabs */}
        <Stack.Screen name="(admin)" options={{ headerShown: false }} />
        
        {/* Shared screens */}
        <Stack.Screen name="restaurant/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="order/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="reservation/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="payment" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="login" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="signup" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="edit-profile" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AccessibilityProvider>
      <ThemeProvider>
        <SessionProvider>
          <LoyaltyProvider>
            <OrdersProvider>
              <RootNavigation />
            </OrdersProvider>
          </LoyaltyProvider>
        </SessionProvider>
      </ThemeProvider>
    </AccessibilityProvider>
  );
}
