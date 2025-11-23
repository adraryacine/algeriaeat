import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  // Force light mode colors for better visibility
  const defaultColors: Record<string, string> = {
    default: '#1A1A1A',
    defaultSemiBold: '#1A1A1A',
    title: '#000000',
    subtitle: '#1A1A1A',
    link: '#FF6B6B',
  };
  
  const color = lightColor || defaultColors[type] || '#1A1A1A';

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
    color: '#1A1A1A',
    fontWeight: '400',
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 40,
    color: '#000000',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
    color: '#1A1A1A',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#FF6B6B',
    fontWeight: '600',
  },
});
