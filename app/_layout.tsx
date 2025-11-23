import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';


export default function RootLayout() {
  // Force light mode
  const colorScheme = 'light';

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="restaurant/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="order/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="reservation/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="payment" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="login" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="signup" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="edit-profile" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}
