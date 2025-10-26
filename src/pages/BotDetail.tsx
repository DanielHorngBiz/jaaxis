import { useParams, Link } from "react-router-dom";
import { Wand2, Eye, Link2, Settings, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import TrainingTab from "@/components/dashboard/tabs/TrainingTab";
import PreviewTab from "@/components/dashboard/tabs/PreviewTab";
import ConnectTab from "@/components/dashboard/tabs/ConnectTab";
import SettingsTab from "@/components/dashboard/tabs/SettingsTab";

const tabs = [
  { id: "training", label: "Training", icon: Wand2, description: "Train your AI" },
  { id: "preview", label: "Preview", icon: Eye, description: "Test your bot" },
  { id: "connect", label: "Connect", icon: Link2, description: "Integrate channels" },
  { id: "settings", label: "Settings", icon: Settings, description: "Configure bot" },
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
      <div className="flex flex-col lg:flex-row h-screen">
        {/* Vertical Navigation */}
        <aside className="lg:w-64 bg-background border-b lg:border-b-0 lg:border-r border-border">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-accent flex items-center justify-center shadow-lg">
                <img src="/placeholder.svg" alt="Jaaxis" className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-base">Jaaxis</h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <p className="text-xs text-muted-foreground">Active</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-4">
            <div className="space-y-1">
              {tabs.map((tabItem) => {
                const Icon = tabItem.icon;
                const isActive = currentTab === tabItem.id;
                return (
                  <Link
                    key={tabItem.id}
                    to={`/dashboard/bot/${botId}/${tabItem.id}`}
                  >
                    <button
                      className={`
                        w-full group flex items-start gap-3 px-3 py-3 rounded-lg 
                        transition-all
                        ${isActive
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                        }
                      `}
                    >
                      <Icon className="w-5 h-5 shrink-0 mt-0.5" />
                      <div className="text-left flex-1">
                        <p className={`text-sm font-medium ${isActive ? "text-primary-foreground" : ""}`}>
                          {tabItem.label}
                        </p>
                        <p className={`text-xs ${isActive ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                          {tabItem.description}
                        </p>
                      </div>
                    </button>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Footer Action */}
          <div className="p-4 border-t border-border mt-auto">
            <Button variant="outline" className="w-full gap-2" size="sm">
              <ExternalLink className="w-4 h-4" />
              View Live
            </Button>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-muted/30">
          {renderTabContent()}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BotDetail;
