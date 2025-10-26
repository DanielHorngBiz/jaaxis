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
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="border-b bg-background shadow-sm">
          <div className="px-8 py-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-foreground flex items-center justify-center shadow-sm">
                <img src="/placeholder.svg" alt="Jaaxis" className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Jaaxis</h1>
                <p className="text-sm text-muted-foreground">AI Chatbot</p>
              </div>
            </div>
            <Button variant="outline" className="shadow-sm">View Live Chat</Button>
          </div>

          {/* Tab Navigation */}
          <div className="px-8 flex gap-2 -mb-px">
            {tabs.map((tabItem) => {
              const Icon = tabItem.icon;
              const isActive = currentTab === tabItem.id;
              return (
                <Link
                  key={tabItem.id}
                  to={`/dashboard/bot/${botId}/${tabItem.id}`}
                >
                  <button
                    className={`flex items-center gap-2 px-4 py-3 rounded-t-lg transition-all relative ${
                      isActive
                        ? "bg-gradient-subtle text-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{tabItem.label}</span>
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                    )}
                  </button>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-gradient-subtle">
          {renderTabContent()}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BotDetail;
