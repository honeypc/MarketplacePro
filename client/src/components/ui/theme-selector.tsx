import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Moon, Sun, Palette, Monitor } from 'lucide-react';
import { useTheme, ColorTheme, themeNames } from '@/lib/theme';
import { useTranslation } from '@/lib/i18n';

export function ThemeSelector() {
  const { mode, colorTheme, setMode, setColorTheme, toggleMode, isDark } = useTheme();
  const { t } = useTranslation();

  const colorPreviews: Record<ColorTheme, string> = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
    pink: 'bg-pink-500',
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 px-3">
          {isDark ? (
            <Moon className="h-4 w-4 mr-2" />
          ) : (
            <Sun className="h-4 w-4 mr-2" />
          )}
          <span className="hidden sm:inline">{t('theme')}</span>
          <Palette className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1 text-sm font-medium">
          {t('theme')}
        </div>
        <DropdownMenuSeparator />
        
        {/* Theme Mode */}
        <DropdownMenuItem onClick={() => setMode('light')}>
          <Sun className="h-4 w-4 mr-2" />
          <span>{t('lightMode')}</span>
          {mode === 'light' && <div className="ml-auto h-2 w-2 rounded-full bg-primary" />}
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => setMode('dark')}>
          <Moon className="h-4 w-4 mr-2" />
          <span>{t('darkMode')}</span>
          {mode === 'dark' && <div className="ml-auto h-2 w-2 rounded-full bg-primary" />}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {/* Color Themes */}
        <div className="px-2 py-1 text-sm font-medium">
          Colors
        </div>
        
        <div className="grid grid-cols-3 gap-1 p-2">
          {Object.entries(themeNames).map(([code, name]) => (
            <button
              key={code}
              onClick={() => setColorTheme(code as ColorTheme)}
              className={`
                flex items-center gap-2 p-2 rounded-md text-sm hover:bg-accent
                ${colorTheme === code ? 'bg-accent' : ''}
              `}
            >
              <div className={`h-4 w-4 rounded-full ${colorPreviews[code as ColorTheme]}`} />
              <span className="text-xs">{name}</span>
              {colorTheme === code && (
                <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}