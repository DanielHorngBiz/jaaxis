import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import logoImage from "@/assets/jaxxis-logo.png";
import jaaxisAvatar from "@/assets/jaaxis-avatar.jpg";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
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

  const user = (() => {
    try {
      const raw = sessionStorage.getItem("currentUser");
      return raw ? (JSON.parse(raw) as { firstName?: string; lastName?: string; email?: string }) : null;
    } catch {
      return null;
    }
  })();

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
          <div className="p-4 border-b border-border">
            <img src={logoImage} alt="Jaaxis" className={`${isCollapsed ? 'h-8 mx-auto' : 'h-8'}`} />
          </div>

          {/* Collapse toggle */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-16 h-7 w-7 rounded-full shadow-sm"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>

          {/* Create */}
          <div className="p-3">
            <Button className="w-full justify-center gap-2">
              <Plus className="h-4 w-4 shrink-0" />
              {!isCollapsed && <span>Create Chatbot</span>}
            </Button>
          </div>

          {/* Your bots */}
          {!isCollapsed && (
            <div className="px-4 py-2 text-xs font-medium tracking-wide text-muted-foreground/80">
              YOUR BOTS
            </div>
          )}

          <div className="flex-1 overflow-auto p-3 pt-0">
            <div className="space-y-1">
              {mockBots.map((bot) => {
                const isActive = location.pathname.includes(`/bot/${bot.id}`);
                return (
                  <Link
                    key={bot.id}
                    to={`/dashboard/bot/${bot.id}/training`}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-primary/10 text-foreground"
                        : "hover:bg-accent text-foreground"
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

          {/* Account Card */}
          <div className="p-3 border-t border-border">
            <div className="bg-muted/30 rounded-xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                {`${(user?.firstName?.[0] || 'D').toUpperCase()}${(user?.lastName?.[0] || 'H').toUpperCase()}`}
              </div>
              {!isCollapsed && (
                <div className="leading-tight">
                  <div className="text-sm font-medium">{user ? `${user.firstName} ${user.lastName}` : 'Daniel Hung'}</div>
                  <div className="text-xs text-muted-foreground">{user?.email || 'daniel@jaaxis.com'}</div>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </BotAppearanceProvider>
  );
};

export default DashboardLayout;
