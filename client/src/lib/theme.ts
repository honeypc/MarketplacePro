import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark';
export type ColorTheme = 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'pink';

export interface ThemeColors {
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  muted: string;
  mutedForeground: string;
}

export const colorThemes: Record<ColorTheme, ThemeColors> = {
  blue: {
    primary: 'hsl(221, 83%, 53%)',
    primaryForeground: 'hsl(210, 40%, 98%)',
    secondary: 'hsl(210, 40%, 96%)',
    secondaryForeground: 'hsl(222, 84%, 5%)',
    accent: 'hsl(210, 40%, 96%)',
    accentForeground: 'hsl(222, 84%, 5%)',
    muted: 'hsl(210, 40%, 96%)',
    mutedForeground: 'hsl(215, 16%, 47%)',
  },
  purple: {
    primary: 'hsl(262, 83%, 58%)',
    primaryForeground: 'hsl(210, 40%, 98%)',
    secondary: 'hsl(270, 40%, 96%)',
    secondaryForeground: 'hsl(262, 84%, 5%)',
    accent: 'hsl(270, 40%, 96%)',
    accentForeground: 'hsl(262, 84%, 5%)',
    muted: 'hsl(270, 40%, 96%)',
    mutedForeground: 'hsl(262, 16%, 47%)',
  },
  green: {
    primary: 'hsl(142, 76%, 36%)',
    primaryForeground: 'hsl(210, 40%, 98%)',
    secondary: 'hsl(138, 40%, 96%)',
    secondaryForeground: 'hsl(142, 84%, 5%)',
    accent: 'hsl(138, 40%, 96%)',
    accentForeground: 'hsl(142, 84%, 5%)',
    muted: 'hsl(138, 40%, 96%)',
    mutedForeground: 'hsl(142, 16%, 47%)',
  },
  orange: {
    primary: 'hsl(25, 95%, 53%)',
    primaryForeground: 'hsl(210, 40%, 98%)',
    secondary: 'hsl(33, 40%, 96%)',
    secondaryForeground: 'hsl(25, 84%, 5%)',
    accent: 'hsl(33, 40%, 96%)',
    accentForeground: 'hsl(25, 84%, 5%)',
    muted: 'hsl(33, 40%, 96%)',
    mutedForeground: 'hsl(25, 16%, 47%)',
  },
  red: {
    primary: 'hsl(0, 84%, 60%)',
    primaryForeground: 'hsl(210, 40%, 98%)',
    secondary: 'hsl(0, 40%, 96%)',
    secondaryForeground: 'hsl(0, 84%, 5%)',
    accent: 'hsl(0, 40%, 96%)',
    accentForeground: 'hsl(0, 84%, 5%)',
    muted: 'hsl(0, 40%, 96%)',
    mutedForeground: 'hsl(0, 16%, 47%)',
  },
  pink: {
    primary: 'hsl(326, 78%, 68%)',
    primaryForeground: 'hsl(210, 40%, 98%)',
    secondary: 'hsl(326, 40%, 96%)',
    secondaryForeground: 'hsl(326, 84%, 5%)',
    accent: 'hsl(326, 40%, 96%)',
    accentForeground: 'hsl(326, 84%, 5%)',
    muted: 'hsl(326, 40%, 96%)',
    mutedForeground: 'hsl(326, 16%, 47%)',
  },
};

interface ThemeStore {
  mode: ThemeMode;
  colorTheme: ColorTheme;
  setMode: (mode: ThemeMode) => void;
  setColorTheme: (theme: ColorTheme) => void;
  toggleMode: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      mode: 'light',
      colorTheme: 'blue',
      setMode: (mode: ThemeMode) => {
        set({ mode });
        updateThemeClass(mode, get().colorTheme);
      },
      setColorTheme: (colorTheme: ColorTheme) => {
        set({ colorTheme });
        updateThemeClass(get().mode, colorTheme);
      },
      toggleMode: () => {
        const newMode = get().mode === 'light' ? 'dark' : 'light';
        set({ mode: newMode });
        updateThemeClass(newMode, get().colorTheme);
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          updateThemeClass(state.mode, state.colorTheme);
        }
      },
    }
  )
);

function updateThemeClass(mode: ThemeMode, colorTheme: ColorTheme) {
  const root = document.documentElement;
  
  // Update theme mode
  if (mode === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  
  // Update color theme
  const colors = colorThemes[colorTheme];
  const style = root.style;
  
  // Set CSS custom properties
  if (mode === 'light') {
    style.setProperty('--primary', colors.primary);
    style.setProperty('--primary-foreground', colors.primaryForeground);
    style.setProperty('--secondary', colors.secondary);
    style.setProperty('--secondary-foreground', colors.secondaryForeground);
    style.setProperty('--accent', colors.accent);
    style.setProperty('--accent-foreground', colors.accentForeground);
    style.setProperty('--muted', colors.muted);
    style.setProperty('--muted-foreground', colors.mutedForeground);
    
    // Light mode specific colors
    style.setProperty('--background', 'hsl(0, 0%, 100%)');
    style.setProperty('--foreground', 'hsl(222, 84%, 5%)');
    style.setProperty('--card', 'hsl(0, 0%, 100%)');
    style.setProperty('--card-foreground', 'hsl(222, 84%, 5%)');
    style.setProperty('--popover', 'hsl(0, 0%, 100%)');
    style.setProperty('--popover-foreground', 'hsl(222, 84%, 5%)');
    style.setProperty('--border', 'hsl(214, 32%, 91%)');
    style.setProperty('--input', 'hsl(214, 32%, 91%)');
    style.setProperty('--ring', colors.primary);
    style.setProperty('--destructive', 'hsl(0, 84%, 60%)');
    style.setProperty('--destructive-foreground', 'hsl(210, 40%, 98%)');
  } else {
    // Dark mode colors
    style.setProperty('--primary', colors.primary);
    style.setProperty('--primary-foreground', colors.primaryForeground);
    style.setProperty('--secondary', 'hsl(217, 33%, 17%)');
    style.setProperty('--secondary-foreground', 'hsl(210, 40%, 98%)');
    style.setProperty('--accent', 'hsl(217, 33%, 17%)');
    style.setProperty('--accent-foreground', 'hsl(210, 40%, 98%)');
    style.setProperty('--muted', 'hsl(217, 33%, 17%)');
    style.setProperty('--muted-foreground', 'hsl(215, 20%, 65%)');
    
    // Dark mode specific colors
    style.setProperty('--background', 'hsl(222, 84%, 5%)');
    style.setProperty('--foreground', 'hsl(210, 40%, 98%)');
    style.setProperty('--card', 'hsl(222, 84%, 5%)');
    style.setProperty('--card-foreground', 'hsl(210, 40%, 98%)');
    style.setProperty('--popover', 'hsl(222, 84%, 5%)');
    style.setProperty('--popover-foreground', 'hsl(210, 40%, 98%)');
    style.setProperty('--border', 'hsl(217, 33%, 17%)');
    style.setProperty('--input', 'hsl(217, 33%, 17%)');
    style.setProperty('--ring', colors.primary);
    style.setProperty('--destructive', 'hsl(0, 62%, 30%)');
    style.setProperty('--destructive-foreground', 'hsl(210, 40%, 98%)');
  }
}

// Helper hook for theme
export const useTheme = () => {
  const { mode, colorTheme, setMode, setColorTheme, toggleMode } = useThemeStore();
  
  return {
    mode,
    colorTheme,
    setMode,
    setColorTheme,
    toggleMode,
    isDark: mode === 'dark',
  };
};

// Theme names for UI
export const themeNames: Record<ColorTheme, string> = {
  blue: 'Blue',
  purple: 'Purple',
  green: 'Green',
  orange: 'Orange',
  red: 'Red',
  pink: 'Pink',
};