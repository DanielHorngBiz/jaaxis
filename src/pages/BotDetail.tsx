import { useParams, Link, useLocation } from "react-router-dom";
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
  const location = useLocation();
  
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
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="border-b bg-background">
          <div className="px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-foreground flex items-center justify-center">
                <img src="/placeholder.svg" alt="Jaaxis" className="w-6 h-6" />
              </div>
              <h1 className="text-xl font-semibold">Jaaxis</h1>
            </div>
            <Button variant="outline">Chat Dashboard</Button>
          </div>

          {/* Tab Navigation */}
          <div className="px-8 flex gap-1">
            {tabs.map((tabItem) => {
              const Icon = tabItem.icon;
              const isActive = currentTab === tabItem.id;
              return (
                <Link
                  key={tabItem.id}
                  to={`/dashboard/bot/${botId}/${tabItem.id}`}
                >
                  <button
                    className={`flex items-center gap-2 px-4 py-3 rounded-t-lg transition-colors ${
                      isActive
                        ? "bg-background border-t border-x"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{tabItem.label}</span>
                  </button>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-muted/30">
          {renderTabContent()}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BotDetail;
