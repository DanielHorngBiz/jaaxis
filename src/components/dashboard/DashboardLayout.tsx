import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, LogOut, ChevronLeft, ChevronRight, Settings } from "lucide-react";
import logoImage from "@/assets/jaxxis-logo.png";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const mockBots = [
  {
    id: "jaaxis",
    name: "Jaaxis",
    avatar: "/placeholder.svg",
    color: "bg-foreground",
  },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem("currentUser");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gradient-subtle">
      {/* Sidebar */}
      <aside className={`${isCollapsed ? 'w-[72px]' : 'w-[240px]'} bg-background border-r border-border flex flex-col transition-all duration-300 relative`}>
        {/* Collapse Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full border bg-background shadow-md hover:shadow-lg transition-all"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </Button>

        {!isCollapsed && (
          <div className="p-6">
            <Link to="/" className="flex items-center gap-2 group justify-center">
              <img src={logoImage} alt="Jaaxis" className="h-8 transition-transform group-hover:scale-105" />
            </Link>
          </div>
        )}

        <div className={`px-4 ${isCollapsed ? 'mt-16' : 'mb-6'}`}>
          <Button className={`w-full gap-2 shadow-sm ${isCollapsed ? 'justify-center px-0' : ''}`} size="sm">
            <Plus className={`${isCollapsed ? 'w-4 h-4' : 'w-4 h-4'}`} />
            {!isCollapsed && "Create Chatbot"}
          </Button>
        </div>

        <div className="flex-1 px-4 space-y-1 overflow-y-auto">
          {!isCollapsed && (
            <p className="px-3 mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Your Bots</p>
          )}
          {mockBots.map((bot) => (
            <Link key={bot.id} to={`/dashboard/bot/${bot.id}`}>
              <div
                className={`flex items-center ${isCollapsed ? 'justify-center p-2' : 'gap-3 p-3'} rounded-lg transition-all hover:bg-secondary/80 ${
                  location.pathname.includes(bot.id) ? "bg-secondary shadow-sm" : ""
                }`}
                title={isCollapsed ? bot.name : undefined}
              >
                <div className={`${isCollapsed ? 'w-9 h-9' : 'w-8 h-8'} rounded-lg ${bot.color} flex items-center justify-center shadow-sm flex-shrink-0`}>
                  <img src={bot.avatar} alt={bot.name} className={`${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'}`} />
                </div>
                {!isCollapsed && <span className="text-sm font-medium truncate">{bot.name}</span>}
              </div>
            </Link>
          ))}
        </div>

        <div className="p-4 border-t border-border">
          <Popover>
            <PopoverTrigger asChild>
              {isCollapsed ? (
                <button className="w-full flex justify-center hover:bg-secondary/50 p-2 rounded-lg transition-colors">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">DH</span>
                  </div>
                </button>
              ) : (
                <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-primary">DH</span>
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-medium truncate">Daniel Hung</p>
                    <p className="text-xs text-muted-foreground truncate">daniel@jaaxis.com</p>
                  </div>
                </button>
              )}
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0" align="end" side="top">
              <div className="p-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-base font-semibold text-primary">DH</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">Daniel Hung</p>
                    <p className="text-xs text-muted-foreground truncate">daniel@jaaxis.com</p>
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
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default DashboardLayout;
