import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wand2, Eye, Link2, Settings } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import TrainingTab from "@/components/dashboard/tabs/TrainingTab";
import PreviewTab from "@/components/dashboard/tabs/PreviewTab";
import ConnectTab from "@/components/dashboard/tabs/ConnectTab";
import SettingsTab from "@/components/dashboard/tabs/SettingsTab";
import { useEffect, useRef, useState } from "react";

const tabs = [
  { id: "training", label: "Training", icon: Wand2 },
  { id: "preview", label: "Preview", icon: Eye },
  { id: "connect", label: "Connect", icon: Link2 },
  { id: "settings", label: "Settings", icon: Settings },
];

const BotDetail = () => {
  const { botId, tab = "training" } = useParams();
  const currentTab = tab || "training";
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const updateIndicator = () => {
      const activeTab = tabsContainerRef.current?.querySelector('[data-state="active"]') as HTMLElement;
      if (activeTab && tabsContainerRef.current) {
        const containerRect = tabsContainerRef.current.getBoundingClientRect();
        const tabRect = activeTab.getBoundingClientRect();
        setIndicatorStyle({
          left: tabRect.left - containerRect.left,
          width: tabRect.width,
        });
      }
    };

    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [currentTab]);

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
          <div className="px-8 border-b border-border relative">
            <div className="flex gap-2 -mb-px relative" ref={tabsContainerRef}>
              {tabs.map((tabItem) => {
                const Icon = tabItem.icon;
                const isActive = currentTab === tabItem.id;
                return (
                  <Link
                    key={tabItem.id}
                    to={`/dashboard/bot/${botId}/${tabItem.id}`}
                  >
                    <button
                      data-state={isActive ? "active" : "inactive"}
                      className={`flex items-center gap-2 px-4 py-3 rounded-t-lg transition-all duration-200 relative ${
                        isActive
                          ? "bg-gradient-subtle text-foreground font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{tabItem.label}</span>
                    </button>
                  </Link>
                );
              })}
              <div
                className="absolute bottom-0 h-0.5 bg-primary transition-all duration-300 ease-out"
                style={{
                  left: `${indicatorStyle.left}px`,
                  width: `${indicatorStyle.width}px`,
                }}
              />
            </div>
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
