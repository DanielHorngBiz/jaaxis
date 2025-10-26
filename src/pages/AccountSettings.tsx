import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Settings, User, Bell, CreditCard } from "lucide-react";
import AccountTab from "@/components/account/AccountTab";
import BillingTab from "@/components/account/BillingTab";
import NotificationsTab from "@/components/account/NotificationsTab";

const AccountSettings = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<"account" | "notifications" | "billing">("account");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "billing" || tab === "notifications" || tab === "account") {
      setActiveTab(tab);
    }
  }, [searchParams]);

  return (
    <DashboardLayout>
      <div className="flex gap-8 p-8">
        {/* Left Sidebar */}
        <div className="w-64 flex-shrink-0">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Settings className="w-4 h-4 text-primary" />
            </div>
            <h1 className="text-xl font-semibold">Account Settings</h1>
          </div>

          <div className="space-y-1">
            <Button
              variant={activeTab === "account" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("account")}
            >
              <User className="w-4 h-4 mr-2" />
              Account
            </Button>
            <Button
              variant={activeTab === "notifications" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("notifications")}
            >
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </Button>
            <Button
              variant={activeTab === "billing" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("billing")}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Pricing
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 max-w-4xl">
          {activeTab === "account" && <AccountTab />}
          {activeTab === "notifications" && <NotificationsTab />}
          {activeTab === "billing" && <BillingTab />}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AccountSettings;
