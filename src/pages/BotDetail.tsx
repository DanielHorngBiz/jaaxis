import { useParams, useNavigate } from "react-router-dom";
import { Wand2, Eye, Link2, Settings } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import TrainingTab from "@/components/dashboard/tabs/TrainingTab";
import PreviewTab from "@/components/dashboard/tabs/PreviewTab";
import ConnectTab from "@/components/dashboard/tabs/ConnectTab";
import SettingsTab from "@/components/dashboard/tabs/SettingsTab";
import { TabbedPageLayout } from "@/components/layout/TabbedPageLayout";
import { ContentContainer } from "@/components/layout/ContentContainer";

const tabs = [
  { id: "training", label: "Training", icon: Wand2 },
  { id: "preview", label: "Preview", icon: Eye },
  { id: "connect", label: "Connect", icon: Link2 },
  { id: "settings", label: "Settings", icon: Settings },
];

const BotDetail = () => {
  const { botId, tab = "training" } = useParams();
  const navigate = useNavigate();
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
      <TabbedPageLayout
        title="Jaaxis"
        tabs={tabs}
        activeTab={currentTab}
        onTabChange={(tabId) => {
          navigate(`/dashboard/bot/${botId}/${tabId}`);
        }}
      >
        <ContentContainer>
          {renderTabContent()}
        </ContentContainer>
      </TabbedPageLayout>
    </DashboardLayout>
  );
};

export default BotDetail;
