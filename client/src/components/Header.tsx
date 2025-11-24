import { Building2, Bell, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/components/ThemeProvider";

export default function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="flex h-14 items-center justify-between gap-4 px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Building2 className="h-6 w-6 text-primary" data-testid="icon-logo" />
          <div>
            <h1 className="text-lg font-bold" data-testid="text-app-title">Demolition Tracker</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative" data-testid="button-notifications">
            <Bell className="h-4 w-4" />
            <Badge className="absolute -right-1 -top-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs bg-destructive" data-testid="badge-notification-count">
              3
            </Badge>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            data-testid="button-theme-toggle"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </header>
  );
}
