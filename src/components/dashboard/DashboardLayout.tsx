import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, LogOut } from "lucide-react";
import logoImage from "@/assets/jaxxis-logo.png";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

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
      <aside className="w-[240px] bg-background border-r border-border flex flex-col">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2 group">
            <img src={logoImage} alt="Jaaxis" className="h-8 transition-transform group-hover:scale-105" />
          </Link>
        </div>

        <div className="px-4 mb-6">
          <Button className="w-full gap-2 shadow-sm" size="sm">
            <Plus className="w-4 h-4" />
            Create Chatbot
          </Button>
        </div>

        <div className="flex-1 px-4 space-y-1">
          <p className="px-3 mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Your Bots</p>
          {mockBots.map((bot) => (
            <Link key={bot.id} to={`/dashboard/bot/${bot.id}`}>
              <div
                className={`flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-secondary/80 ${
                  location.pathname.includes(bot.id) ? "bg-secondary shadow-sm" : ""
                }`}
              >
                <div className={`w-8 h-8 rounded-lg ${bot.color} flex items-center justify-center shadow-sm`}>
                  <img src={bot.avatar} alt={bot.name} className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium">{bot.name}</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-semibold text-primary">DH</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Daniel Hung</p>
              <p className="text-xs text-muted-foreground truncate">daniel@jaaxis.com</p>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default DashboardLayout;
