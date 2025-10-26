import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wand2, Eye, Link2, Settings } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import TrainingTab from "@/components/dashboard/tabs/TrainingTab";
import PreviewTab from "@/components/dashboard/tabs/PreviewTab";
import ConnectTab from "@/components/dashboard/tabs/ConnectTab";
import SettingsTab from "@/components/dashboard/tabs/SettingsTab";

const tabs = [
  { id: "training", label: "Training", icon: Wand2 },
  { id: "preview", label: "Preview", icon: Eye },
  { id: "connect", label: "Connect", icon: Link2 },
  { id: "settings", label: "Settings", icon: Settings },
];

const BotDetail = () => {
  const { botId, tab = "training" } = useParams();
  
  const currentTab = tab || "training";

  const renderTabContent = () => {
    switch (currentTab) {
      case "training":
        return <TrainingTab />;
      case "preview":
        return <PreviewTab botName="Jaaxis" />;
      case "connect":
        return <ConnectTab />;
      case "settings":
        return <SettingsTab />;
      default:
        return <TrainingTab />;
    }
  };

  return (
    <DashboardLayout>
      <div className="flex h-screen">
        {/* Vertical Navigation */}
        <aside className="w-[220px] bg-background border-r border-border flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-foreground flex items-center justify-center shadow-sm">
                <img src="/placeholder.svg" alt="Jaaxis" className="w-7 h-7" />
              </div>
              <div>
                <h2 className="font-semibold text-base">Jaaxis</h2>
                <p className="text-xs text-muted-foreground">AI Chatbot</p>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-4 space-y-1">
            {tabs.map((tabItem) => {
              const Icon = tabItem.icon;
              const isActive = currentTab === tabItem.id;
              return (
                <Link
                  key={tabItem.id}
                  to={`/dashboard/bot/${botId}/${tabItem.id}`}
                >
                  <button
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="text-sm font-medium">{tabItem.label}</span>
                  </button>
                </Link>
              );
            })}
          </nav>

          {/* Footer Action */}
          <div className="p-4 border-t border-border">
            <Button variant="outline" className="w-full shadow-sm" size="sm">
              View Live Chat
            </Button>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-gradient-subtle">
          {renderTabContent()}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BotDetail;
