import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
}

export const defaultColors: ThemeColors = {
  primary: '#3b82f6', // blue-500
  secondary: '#64748b', // slate-500
  accent: '#10b981', // emerald-500
};

export const colorPresets: Record<string, ThemeColors> = {
  blue: {
    primary: '#3b82f6',
    secondary: '#64748b',
    accent: '#10b981',
  },
  purple: {
    primary: '#8b5cf6',
    secondary: '#64748b',
    accent: '#f59e0b',
  },
  green: {
    primary: '#10b981',
    secondary: '#64748b',
    accent: '#3b82f6',
  },
  orange: {
    primary: '#f59e0b',
    secondary: '#64748b',
    accent: '#8b5cf6',
  },
  red: {
    primary: '#ef4444',
    secondary: '#64748b',
    accent: '#10b981',
  },
  pink: {
    primary: '#ec4899',
    secondary: '#64748b',
    accent: '#3b82f6',
  },
};

interface ThemeStore {
  mode: ThemeMode;
  colors: ThemeColors;
  setMode: (mode: ThemeMode) => void;
  setColors: (colors: ThemeColors) => void;
  setColorPreset: (preset: string) => void;
  toggleMode: () => void;
}

export const useTheme = create<ThemeStore>()(
  persist(
    (set, get) => ({
      mode: 'light',
      colors: defaultColors,
      setMode: (mode) => {
        set({ mode });
        updateTheme(mode, get().colors);
      },
      setColors: (colors) => {
        set({ colors });
        updateTheme(get().mode, colors);
      },
      setColorPreset: (preset) => {
        const colors = colorPresets[preset] || defaultColors;
        set({ colors });
        updateTheme(get().mode, colors);
      },
      toggleMode: () => {
        const newMode = get().mode === 'light' ? 'dark' : 'light';
        set({ mode: newMode });
        updateTheme(newMode, get().colors);
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          updateTheme(state.mode, state.colors);
        }
      },
    }
  )
);

function updateTheme(mode: ThemeMode, colors: ThemeColors) {
  const root = document.documentElement;
  
  // Update theme mode
  if (mode === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  
  // Update color variables
  root.style.setProperty('--primary', colors.primary);
  root.style.setProperty('--secondary', colors.secondary);
  root.style.setProperty('--accent', colors.accent);
  
  // Convert hex to hsl for proper theme integration
  const primaryHsl = hexToHsl(colors.primary);
  const secondaryHsl = hexToHsl(colors.secondary);
  const accentHsl = hexToHsl(colors.accent);
  
  root.style.setProperty('--primary-hsl', primaryHsl);
  root.style.setProperty('--secondary-hsl', secondaryHsl);
  root.style.setProperty('--accent-hsl', accentHsl);
}

function hexToHsl(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      default: h = 0;
    }
    h /= 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}