import { Moon, Sun, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useTheme, colorPresets } from "@/lib/theme";
import { useI18n } from "@/lib/i18n";

export function ThemeSelector() {
  const { t } = useI18n();
  const { mode, toggleMode, setColorPreset } = useTheme();

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMode}
        className="h-8 w-8"
      >
        {mode === 'light' ? (
          <Moon className="h-4 w-4" />
        ) : (
          <Sun className="h-4 w-4" />
        )}
      </Button>
      
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Palette className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Choose Theme Colors</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            {Object.entries(colorPresets).map(([name, colors]) => (
              <Card
                key={name}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setColorPreset(name)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm capitalize">{name}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex space-x-2">
                    <div
                      className="w-6 h-6 rounded-full border border-gray-300"
                      style={{ backgroundColor: colors.primary }}
                    />
                    <div
                      className="w-6 h-6 rounded-full border border-gray-300"
                      style={{ backgroundColor: colors.secondary }}
                    />
                    <div
                      className="w-6 h-6 rounded-full border border-gray-300"
                      style={{ backgroundColor: colors.accent }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}