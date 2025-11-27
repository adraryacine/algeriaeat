import AsyncStorage from '@react-native-async-storage/async-storage';
import { PropsWithChildren, createContext, useContext, useEffect, useMemo, useState } from 'react';

type FontScale = 'normal' | 'large' | 'xlarge';

type AccessibilitySettings = {
  fontScale: FontScale;
  reduceMotion: boolean;
  highContrast: boolean;
  colorblindMode: boolean;
  dataSaver: boolean;
};

type AccessibilityContextValue = AccessibilitySettings & {
  setFontScale: (scale: FontScale) => void;
  toggleReduceMotion: () => void;
  toggleHighContrast: () => void;
  toggleColorblindMode: () => void;
  toggleDataSaver: () => void;
};

const STORAGE_KEY = 'algeriaeat.accessibility-settings';
const defaultSettings: AccessibilitySettings = {
  fontScale: 'normal',
  reduceMotion: false,
  highContrast: false,
  colorblindMode: false,
  dataSaver: false,
};

const AccessibilityContext = createContext<AccessibilityContextValue | undefined>(undefined);

export function AccessibilityProvider({ children }: PropsWithChildren) {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (value) {
          setSettings((prev) => ({ ...prev, ...JSON.parse(value) }));
        }
      })
      .finally(() => setIsHydrated(true));
  }, []);

  const persistSettings = async (next: AccessibilitySettings) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore persistence errors
    }
  };

  const updateSettings = (partial: Partial<AccessibilitySettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      if (isHydrated) {
        void persistSettings(next);
      }
      return next;
    });
  };

  const value = useMemo<AccessibilityContextValue>(
    () => ({
      ...settings,
      setFontScale: (scale) => updateSettings({ fontScale: scale }),
      toggleReduceMotion: () => updateSettings({ reduceMotion: !settings.reduceMotion }),
      toggleHighContrast: () => updateSettings({ highContrast: !settings.highContrast }),
      toggleColorblindMode: () => updateSettings({ colorblindMode: !settings.colorblindMode }),
      toggleDataSaver: () => updateSettings({ dataSaver: !settings.dataSaver }),
    }),
    [settings, isHydrated]
  );

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>;
}

export function useAccessibilityContext() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
}

