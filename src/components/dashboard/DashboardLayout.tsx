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
...
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </BotAppearanceProvider>
  );
};

export default DashboardLayout;
