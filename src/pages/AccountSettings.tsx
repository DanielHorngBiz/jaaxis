import { useSearchParams } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Settings, User, Bell, CreditCard } from "lucide-react";
import AccountTab from "@/components/account/AccountTab";
import BillingTab from "@/components/account/BillingTab";
import NotificationsTab from "@/components/account/NotificationsTab";
import { TabbedPageLayout } from "@/components/layout/TabbedPageLayout";
import { ContentContainer } from "@/components/layout/ContentContainer";

const tabs = [
  { id: "account", label: "Account", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "billing", label: "Plans & Billing", icon: CreditCard },
];

const AccountSettings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "account";

  const handleTabChange = (tab: string) => {
    setSearchParams({ tab });
  };

  return (
    <DashboardLayout>
      <TabbedPageLayout
        title="Account Settings"
        icon={Settings}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      >
        <ContentContainer className="px-8 py-12 max-w-4xl mx-auto">
          {activeTab === "account" && <AccountTab />}
          {activeTab === "notifications" && <NotificationsTab />}
          {activeTab === "billing" && <BillingTab />}
        </ContentContainer>
      </TabbedPageLayout>
    </DashboardLayout>
  );
};

export default AccountSettings;
