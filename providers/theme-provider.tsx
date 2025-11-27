import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance, ColorSchemeName } from 'react-native';
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

type ThemePreference = 'system' | 'light' | 'dark';

type ThemeContextValue = {
  colorScheme: NonNullable<ColorSchemeName>;
  preference: ThemePreference;
  isDark: boolean;
  toggleTheme: () => void;
  setPreference: (preference: ThemePreference) => void;
};

const STORAGE_KEY = 'algeriaeat.theme-preference';

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: PropsWithChildren) {
  const [preference, setPreference] = useState<ThemePreference>('system');
  const [systemScheme, setSystemScheme] = useState<NonNullable<ColorSchemeName>>(
    Appearance.getColorScheme() ?? 'light'
  );

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (value === 'light' || value === 'dark') {
          setPreference(value);
        }
      })
      .catch(() => null);
  }, []);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (colorScheme) {
        setSystemScheme(colorScheme);
      }
    });

    return () => subscription.remove();
  }, []);

  const resolvedScheme: NonNullable<ColorSchemeName> =
    preference === 'system' ? systemScheme : preference;

  const persistPreference = async (value: ThemePreference) => {
    try {
      if (value === 'system') {
        await AsyncStorage.removeItem(STORAGE_KEY);
      } else {
        await AsyncStorage.setItem(STORAGE_KEY, value);
      }
    } catch {
      // Swallow storage errors to avoid blocking UI
    }
  };

  const handlePreferenceChange = (value: ThemePreference) => {
    setPreference(value);
    void persistPreference(value);
  };

  const toggleTheme = () => {
    const nextScheme = resolvedScheme === 'dark' ? 'light' : 'dark';
    handlePreferenceChange(nextScheme);
  };

  const value = useMemo(
    () => ({
      colorScheme: resolvedScheme,
      preference,
      isDark: resolvedScheme === 'dark',
      toggleTheme,
      setPreference: handlePreferenceChange,
    }),
    [resolvedScheme, preference]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return context;
}

