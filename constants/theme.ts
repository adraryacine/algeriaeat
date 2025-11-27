/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#FF6B6B';
const tintColorDark = '#FF8A5C';

type Palette = {
  text: string;
  textMuted: string;
  background: string;
  surface: string;
  surfaceMuted: string;
  card: string;
  cardMuted: string;
  border: string;
  tint: string;
  accent: string;
  accentSecondary: string;
  accentMuted: string;
  icon: string;
  tabIconDefault: string;
  tabIconSelected: string;
  chip: string;
  overlay: string;
  glass: string;
  success: string;
  warning: string;
  danger: string;
  gradientPrimary: readonly [string, string, string?];
  gradientMuted: readonly [string, string];
  heroShadow: string;
};

export const Colors: Record<'light' | 'dark', Palette> = {
  light: {
    text: '#0F172A',
    textMuted: '#64748B',
    background: '#F4F6FB',
    surface: '#FFFFFF',
    surfaceMuted: '#F1F5F9',
    card: '#FFFFFF',
    cardMuted: '#EEF2FF',
    border: '#E2E8F0',
    tint: tintColorLight,
    accent: '#FF6B6B',
    accentSecondary: '#4ECDC4',
    accentMuted: 'rgba(255, 107, 107, 0.15)',
    icon: '#94A3B8',
    tabIconDefault: '#94A3B8',
    tabIconSelected: tintColorLight,
    chip: 'rgba(15, 23, 42, 0.06)',
    overlay: 'rgba(15, 23, 42, 0.45)',
    glass: 'rgba(255, 255, 255, 0.75)',
    success: '#22C55E',
    warning: '#F97316',
    danger: '#EF4444',
    gradientPrimary: ['#FF9770', '#FF6B6B', '#C94892'] as const,
    gradientMuted: ['#FEE2E2', '#FFE4E6'] as const,
    heroShadow: 'rgba(15, 23, 42, 0.12)',
  },
  dark: {
    text: '#F4F4F5',
    textMuted: '#A1A1AA',
    background: '#05070E',
    surface: '#0F172A',
    surfaceMuted: '#1A2238',
    card: '#111D32',
    cardMuted: '#1E2A44',
    border: '#1E293B',
    tint: tintColorDark,
    accent: '#FF8A5C',
    accentSecondary: '#4ECDC4',
    accentMuted: 'rgba(255, 138, 92, 0.22)',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    chip: 'rgba(148, 163, 184, 0.15)',
    overlay: 'rgba(5, 7, 14, 0.75)',
    glass: 'rgba(15, 23, 42, 0.85)',
    success: '#34D399',
    warning: '#FDBA74',
    danger: '#F87171',
    gradientPrimary: ['#1E1B4B', '#312E81', '#0F172A'] as const,
    gradientMuted: ['#1F2937', '#0F172A'] as const,
    heroShadow: 'rgba(0, 0, 0, 0.55)',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
