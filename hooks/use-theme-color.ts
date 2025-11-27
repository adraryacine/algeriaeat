/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAccessibility } from '@/hooks/use-accessibility';

const colorblindOverrides: Partial<Record<keyof typeof Colors.light, string>> = {
  accent: '#0072B2',
  tint: '#D55E00',
  success: '#009E73',
  danger: '#CC79A7',
};

const highContrastOverrides = {
  textLight: '#0A0A0A',
  textDark: '#F8FAFC',
  backgroundLight: '#FFFFFF',
  backgroundDark: '#020617',
};

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark,
  forceHighContrast?: boolean
) {
  const theme = useColorScheme() ?? 'light';
  const { colorblindMode, highContrast } = useAccessibility();
  const colorFromProps = props[theme];
  let color = colorFromProps ?? Colors[theme][colorName];

  if (colorblindMode && colorblindOverrides[colorName]) {
    color = colorblindOverrides[colorName]!;
  }

  if (forceHighContrast || highContrast) {
    if (colorName === 'text' || colorName === 'textMuted') {
      color = theme === 'dark' ? highContrastOverrides.textDark : highContrastOverrides.textLight;
    }
    if (colorName === 'background' || colorName === 'surface') {
      color =
        theme === 'dark' ? highContrastOverrides.backgroundDark : highContrastOverrides.backgroundLight;
    }
  }

  return color;
}
