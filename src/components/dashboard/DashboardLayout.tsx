import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, ChevronLeft } from "lucide-react";
import logoImage from "@/assets/jaxxis-logo.png";

const mockBots = [
  {
    id: "test",
    name: "Test",
    avatar: "T",
    color: "bg-red-500",
  },
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

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-[200px] bg-muted/30 border-r flex flex-col p-4">
        <Link to="/" className="mb-8">
          <div className="flex items-center gap-2">
            <img src={logoImage} alt="Jaaxis" className="h-8" />
          </div>
        </Link>

        <Button className="w-full mb-6 gap-2">
          <Plus className="w-4 h-4" />
          Create a Chatbot
        </Button>

        <div className="space-y-2 flex-1">
          {mockBots.map((bot) => (
            <Link key={bot.id} to={`/dashboard/bot/${bot.id}`}>
              <div
                className={`flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors ${
                  location.pathname.includes(bot.id) ? "bg-muted" : ""
                }`}
              >
                {bot.avatar.startsWith("/") ? (
                  <div className={`w-6 h-6 rounded-full ${bot.color} flex items-center justify-center`}>
                    <img src={bot.avatar} alt={bot.name} className="w-4 h-4" />
                  </div>
                ) : (
                  <div className={`w-6 h-6 rounded-full ${bot.color} flex items-center justify-center text-white text-xs font-semibold`}>
                    {bot.avatar}
                  </div>
                )}
                <span className="text-sm font-medium">{bot.name}</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="pt-4 border-t flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <span className="text-sm font-semibold">DH</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Daniel Hung</p>
            <p className="text-xs text-muted-foreground truncate">metal666gun@gmail.com</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default DashboardLayout;
