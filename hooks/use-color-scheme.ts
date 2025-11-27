import { useContext } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

import { ThemeContext } from '@/providers/theme-provider';

export function useColorScheme() {
  const context = useContext(ThemeContext);

  if (context) {
    return context.colorScheme;
  }

  return useSystemColorScheme();
}
