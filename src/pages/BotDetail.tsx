import { useParams, useNavigate } from "react-router-dom";
import { Wand2, Eye, Link2, Settings, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import TrainingTab from "@/components/dashboard/tabs/TrainingTab";
import PreviewTab from "@/components/dashboard/tabs/PreviewTab";
import ConnectTab from "@/components/dashboard/tabs/ConnectTab";
import SettingsTab from "@/components/dashboard/tabs/SettingsTab";
import { TabbedPageLayout } from "@/components/layout/TabbedPageLayout";
import { ContentContainer } from "@/components/layout/ContentContainer";
import { BotConfigProvider, useBotConfig } from "@/contexts/BotConfigContext";

const tabs = [
  { id: "training", label: "Training", icon: Wand2 },
  { id: "preview", label: "Preview", icon: Eye },
  { id: "connect", label: "Connect", icon: Link2 },
  { id: "settings", label: "Settings", icon: Settings },
];

const BotDetailContent = () => {
  const { botId, tab = "training" } = useParams();
  const navigate = useNavigate();
  const currentTab = tab || "training";
  const { config } = useBotConfig();

  const renderTabContent = () => {
    switch (currentTab) {
      case "training":
        return <TrainingTab />;
      case "preview":
        return <PreviewTab />;
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
      <TabbedPageLayout
        title={config.botName}
        avatarSrc={config.brandLogo}
        tabs={tabs}
        activeTab={currentTab}
        onTabChange={(tabId) => {
          navigate(`/dashboard/bot/${botId}/${tabId}`);
        }}
        actionButton={
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => navigate("/chat-dashboard")}
          >
            <MessageSquare className="h-4 w-4" />
            Chat Dashboard
          </Button>
        }
      >
        <ContentContainer className="px-8 py-12 max-w-4xl mx-auto">
          {renderTabContent()}
        </ContentContainer>
      </TabbedPageLayout>
    </DashboardLayout>
  );
};

const BotDetail = () => {
  return (
    <BotConfigProvider>
      <BotDetailContent />
    </BotConfigProvider>
  );
};

export default BotDetail;
