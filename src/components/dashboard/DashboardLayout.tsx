import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, LogOut, Menu, X } from "lucide-react";
import logoImage from "@/assets/jaxxis-logo.png";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const mockBots = [
  {
    id: "jaaxis",
    name: "Jaaxis",
    avatar: "/placeholder.svg",
    color: "bg-gradient-accent",
  },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    sessionStorage.removeItem("currentUser");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-background border-b z-50 flex items-center justify-between px-4">
        <img src={logoImage} alt="Jaaxis" className="h-7" />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-72 bg-background border-r border-border
        flex flex-col
        transform transition-transform duration-200 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:transform-none
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link to="/" className="flex items-center gap-2 group">
            <img 
              src={logoImage} 
              alt="Jaaxis" 
              className="h-7 transition-transform group-hover:scale-105"
            />
          </Link>
        </div>

        {/* Create Button */}
        <div className="p-6">
          <Button className="w-full gap-2 h-11 shadow-sm font-medium">
            <Plus className="w-4 h-4" />
            New Chatbot
          </Button>
        </div>

        {/* Bots List */}
        <div className="flex-1 px-4 overflow-y-auto">
          <div className="mb-3">
            <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Your Chatbots
            </h3>
          </div>
          <div className="space-y-1">
            {mockBots.map((bot) => (
              <Link key={bot.id} to={`/dashboard/bot/${bot.id}`}>
                <div
                  className={`
                    group flex items-center gap-3 px-3 py-2.5 rounded-lg 
                    transition-all cursor-pointer
                    ${location.pathname.includes(bot.id) 
                      ? "bg-primary/10 text-primary" 
                      : "hover:bg-muted text-foreground"
                    }
                  `}
                >
                  <div className={`w-9 h-9 rounded-lg ${bot.color} flex items-center justify-center shadow-sm transition-transform group-hover:scale-105`}>
                    <img src={bot.avatar} alt={bot.name} className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{bot.name}</p>
                    <p className="text-xs text-muted-foreground">Active</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/50">
            <div className="w-9 h-9 rounded-full bg-gradient-accent flex items-center justify-center shadow-sm">
              <span className="text-sm font-semibold text-white">DH</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Daniel Hung</p>
              <p className="text-xs text-muted-foreground truncate">daniel@jaaxis.com</p>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 lg:pt-0 pt-16">{children}</main>
    </div>
  );
};

export default DashboardLayout;
