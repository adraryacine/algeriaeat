import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { ThemeProvider, useTheme } from '@/providers/theme-provider';
import { SessionProvider } from '@/providers/session-provider';
import { OrdersProvider } from '@/providers/orders-provider';

function RootNavigation() {
  const { colorScheme } = useTheme();
  const navigationTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

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
    <ThemeProvider>
      <SessionProvider>
        <OrdersProvider>
          <RootNavigation />
        </OrdersProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
