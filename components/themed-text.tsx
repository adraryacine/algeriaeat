import { StyleSheet, Text, type TextProps } from 'react-native';

import { useAccessibility } from '@/hooks/use-accessibility';
import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

const TYPE_STYLES = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'none',
  },
});

const typeColorMap: Record<NonNullable<ThemedTextProps['type']>, keyof typeof TYPE_STYLES> = {
  default: 'default',
  defaultSemiBold: 'defaultSemiBold',
  title: 'title',
  subtitle: 'subtitle',
  link: 'link',
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const { fontScale, highContrast } = useAccessibility();
  const token = type === 'link' ? 'tint' : 'text';
  const color = useThemeColor({ light: lightColor, dark: darkColor }, token, highContrast);
  const scaleFactor = fontScale === 'large' ? 1.1 : fontScale === 'xlarge' ? 1.25 : 1;
  const baseStyle = TYPE_STYLES[typeColorMap[type]];
  const scaledStyle = {
    ...baseStyle,
    fontSize: baseStyle.fontSize ? baseStyle.fontSize * scaleFactor : undefined,
    lineHeight: baseStyle.lineHeight ? baseStyle.lineHeight * scaleFactor : undefined,
  };

  return (
    <Text
      style={[
        { color },
        scaledStyle,
        style,
      ]}
      {...rest}
    />
  );
}
