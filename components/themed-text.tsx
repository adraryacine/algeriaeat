import { StyleSheet, Text, type TextProps } from 'react-native';

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
  const token = type === 'link' ? 'tint' : 'text';
  const color = useThemeColor({ light: lightColor, dark: darkColor }, token);

  return (
    <Text
      style={[
        { color },
        TYPE_STYLES[typeColorMap[type]],
        style,
      ]}
      {...rest}
    />
  );
}
