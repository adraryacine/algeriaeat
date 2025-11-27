import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { memo, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTheme } from '@/providers/theme-provider';

export const ThemeToggle = memo(function ThemeToggle() {
  const scheme = useColorScheme() ?? 'light';
  const palette = Colors[scheme];
  const { toggleTheme, preference } = useTheme();
  const isSystem = preference === 'system';

  const iconName = useMemo(() => {
    if (scheme === 'dark') {
      return 'moon';
    }
    return 'sunny';
  }, [scheme]);

  return (
    <Pressable style={[styles.button, { borderColor: palette.border }]} onPress={toggleTheme}>
      <LinearGradient
        colors={scheme === 'dark' ? palette.gradientPrimary : palette.gradientMuted}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.glow, { shadowColor: palette.heroShadow }]}
      />
      <View style={styles.content}>
        <Ionicons name={iconName as any} size={18} color={scheme === 'dark' ? '#FCE7F3' : '#1F2937'} />
        <ThemedText type="defaultSemiBold" style={styles.label}>
          {scheme === 'dark' ? 'Dark' : 'Light'}
        </ThemedText>
        {isSystem && (
          <View style={[styles.badge, { backgroundColor: palette.accentMuted }]}>
            <ThemedText style={styles.badgeText}>Auto</ThemedText>
          </View>
        )}
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  button: {
    position: 'relative',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  glow: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.85,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    textTransform: 'capitalize',
  },
  badge: {
    borderRadius: 40,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
});

