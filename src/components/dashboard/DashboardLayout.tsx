import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, LogOut, ChevronLeft, ChevronRight, Settings } from "lucide-react";
import logoImage from "@/assets/jaxxis-logo.png";
import defaultAvatar from "@/assets/jaaxis-avatar.jpg";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from "lucide-react";
import { CreateChatbotDialog } from "./CreateChatbotDialog";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved === 'true';
  });
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [bots, setBots] = useState<any[]>([]);

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', String(isCollapsed));
  }, [isCollapsed]);

  useEffect(() => {
    if (user) {
      fetchBots();
    }
  }, [user]);

  const fetchBots = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('chatbots')
      .select('id, name, slug, avatar_url, primary_color')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bots:', error);
    } else {
      setBots(data || []);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate("/");
  };

  const getInitials = () => {
    if (!profile) return "U";
    return `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`.toUpperCase();
  };

  const getFullName = () => {
    if (!profile) return "User";
    return `${profile.first_name} ${profile.last_name}`;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-subtle">
      {/* Sidebar */}
      <aside className={`${isCollapsed ? 'w-[72px]' : 'w-[240px]'} bg-background border-r border-border flex flex-col transition-all duration-300 relative h-screen`}>
        {/* Collapse Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full border bg-background shadow-md hover:shadow-lg transition-all"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </Button>

        <div className="p-6 h-20 flex items-center justify-center">
          {!isCollapsed && (
            <Link to="/dashboard" className="flex items-center gap-2 group">
              <img src={logoImage} alt="Jaaxis" className="h-8 transition-transform group-hover:scale-105" />
            </Link>
          )}
        </div>

        <div className="px-4 mb-6">
          <Button 
            className={`${isCollapsed ? 'w-9 h-9 p-0' : 'w-full'} gap-2 shadow-sm`} 
            size={isCollapsed ? "icon" : "sm"}
            onClick={() => setCreateDialogOpen(true)}
          >
            <Plus className="w-4 h-4" />
            {!isCollapsed && "Create Chatbot"}
          </Button>
        </div>

        <CreateChatbotDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />

        <div className="flex-1 px-4 space-y-1 overflow-y-auto">
          {bots.map((bot) => (
            <div
              key={bot.id}
              onClick={() => {
                // If already viewing this bot and in chat, go to settings
                if (location.pathname.includes(`/bot/${bot.slug}/chat`)) {
                  navigate(`/dashboard/bot/${bot.slug}`);
                } else if (!location.pathname.includes(bot.slug)) {
                  // If viewing a different bot, navigate to this bot's settings
                  navigate(`/dashboard/bot/${bot.slug}`);
                }
                // If already on this bot's settings page, do nothing
              }}
              className={`flex items-center ${isCollapsed ? 'justify-center p-2' : 'gap-3 p-3'} rounded-lg transition-all hover:bg-secondary/80 cursor-pointer ${
                location.pathname.includes(bot.slug) ? "bg-secondary shadow-sm" : ""
              }`}
              title={isCollapsed ? bot.name : undefined}
            >
              <div className={`${isCollapsed ? 'w-9 h-9' : 'w-9 h-9'} rounded-full shadow-sm flex-shrink-0 flex items-center justify-center text-sm font-bold text-white`} style={{ backgroundColor: bot.primary_color || '#FF9800' }}>
                {bot.avatar_url ? (
                  <img
                    src={bot.avatar_url}
                    alt={bot.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  bot.name.trim().charAt(0).toUpperCase() || "B"
                )}
              </div>
              {!isCollapsed && <span className="text-sm font-medium truncate">{bot.name}</span>}
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-border">
          <Popover>
            <PopoverTrigger asChild>
              {isCollapsed ? (
                <button className="w-full flex justify-center hover:bg-secondary/50 p-2 rounded-lg transition-colors">
                  {profile?.avatar_url ? (
                    <div className="w-9 h-9 rounded-full overflow-hidden shadow-sm flex-shrink-0">
                      <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-primary">{getInitials()}</span>
                    </div>
                  )}
                </button>
              ) : (
                <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors">
                  {profile?.avatar_url ? (
                    <div className="w-9 h-9 rounded-full overflow-hidden shadow-sm flex-shrink-0">
                      <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-primary">{getInitials()}</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-medium truncate">{getFullName()}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                </button>
              )}
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0" align="end" side="top">
              <div className="p-3 border-b border-border">
                <div className="flex items-center gap-3">
                  {profile?.avatar_url ? (
                    <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm flex-shrink-0">
                      <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-base font-semibold text-primary">{getInitials()}</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{getFullName()}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Usage Section */}
              <button
                onClick={() => {
                  navigate('/account-settings?tab=billing');
                  document.body.click(); // Close popover
                }}
                className="w-full p-3 border-b border-border hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <svg className="w-12 h-12 transform -rotate-90">
                      <circle
                        cx="24"
                        cy="24"
                        r="22"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        className="text-muted"
                      />
                      <circle
                        cx="24"
                        cy="24"
                        r="22"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray={`${(1000 / 3000) * 138.2} 138.2`}
                        className="text-primary"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold">33%</span>
                    </div>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold">1,000 Remaining</p>
                    <p className="text-xs text-muted-foreground">of 3,000 replies</p>
                  </div>
                </div>
              </button>
              
              <div className="p-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
                  onClick={() => navigate('/account-settings')}
                >
                  <Settings className="w-4 h-4" />
                  Account Settings
                </Button>
                
                <div className="px-2 py-1.5">
                  <Select defaultValue="en">
                    <SelectTrigger className="w-full h-9 gap-2 text-muted-foreground hover:text-foreground border-none bg-transparent hover:bg-secondary/50 px-2">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="zh">繁體中文</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  Log out
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
};

export default DashboardLayout;
