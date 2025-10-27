import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, LogOut, ChevronLeft, ChevronRight, Settings } from "lucide-react";
import logoImage from "@/assets/jaxxis-logo.png";
import jaaxisAvatar from "@/assets/jaaxis-avatar.jpg";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BotAppearanceProvider } from "@/contexts/BotAppearanceContext";

const mockBots = [
  {
    id: "jaaxis",
    name: "Jaaxis",
    avatar: jaaxisAvatar,
  },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', String(isCollapsed));
  }, [isCollapsed]);

  const handleLogout = () => {
    sessionStorage.removeItem("currentUser");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate("/");
  };

  return (
    <BotAppearanceProvider>
      <div className="flex h-screen overflow-hidden bg-gradient-subtle">
        {/* Sidebar */}
        <aside className={`${isCollapsed ? 'w-[72px]' : 'w-[240px]'} bg-background border-r border-border flex flex-col transition-all duration-300 relative h-screen`}>
          {/* Logo */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            {!isCollapsed && (
              <img src={logoImage} alt="Jaxxis" className="h-8" />
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="shrink-0"
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Bot List */}
          <div className="flex-1 overflow-auto p-3">
            <div className="space-y-2">
              {mockBots.map((bot) => {
                const isActive = location.pathname.includes(`/bot/${bot.id}`);
                return (
                  <Link
                    key={bot.id}
                    to={`/dashboard/bot/${bot.id}/training`}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-accent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <img
                      src={bot.avatar}
                      alt={bot.name}
                      className="w-8 h-8 rounded-full object-cover shrink-0"
                    />
                    {!isCollapsed && (
                      <span className="font-medium truncate">{bot.name}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="p-3 border-t border-border space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => navigate("/dashboard")}
            >
              <Plus className="h-4 w-4 shrink-0" />
              {!isCollapsed && <span>New Bot</span>}
            </Button>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2"
                >
                  <Settings className="h-4 w-4 shrink-0" />
                  {!isCollapsed && <span>Settings</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48" align="end">
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => navigate("/account")}
                  >
                    Account Settings
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-destructive hover:text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </BotAppearanceProvider>
  );
};

export default DashboardLayout;
