import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Settings, User, Bell, CreditCard } from "lucide-react";
import AccountTab from "@/components/account/AccountTab";
import BillingTab from "@/components/account/BillingTab";
import NotificationsTab from "@/components/account/NotificationsTab";

const AccountSettings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "account";

  useEffect(() => {
    if (!searchParams.get("tab")) {
      setSearchParams({ tab: "account" });
    }
  }, [searchParams, setSearchParams]);

  return (
    <DashboardLayout>
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="border-b bg-background shadow-sm">
          <div className="px-8 py-5 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Settings className="w-4 h-4 text-primary" />
            </div>
            <h1 className="text-xl font-semibold">Account Settings</h1>
          </div>

          {/* Tab Navigation */}
          <div className="px-8 border-b border-border">
            <div className="flex gap-2 -mb-px">
              <button
                onClick={() => setSearchParams({ tab: "account" })}
                className={`flex items-center gap-2 px-4 py-3 rounded-t-lg transition-all duration-200 relative ${
                  activeTab === "account"
                    ? "bg-gradient-subtle text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <User className="w-4 h-4" />
                <span className="text-sm">Account</span>
              </button>
              <button
                onClick={() => setSearchParams({ tab: "notifications" })}
                className={`flex items-center gap-2 px-4 py-3 rounded-t-lg transition-all duration-200 relative ${
                  activeTab === "notifications"
                    ? "bg-gradient-subtle text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Bell className="w-4 h-4" />
                <span className="text-sm">Notifications</span>
              </button>
              <button
                onClick={() => setSearchParams({ tab: "billing" })}
                className={`flex items-center gap-2 px-4 py-3 rounded-t-lg transition-all duration-200 relative ${
                  activeTab === "billing"
                    ? "bg-gradient-subtle text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span className="text-sm">Pricing</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-gradient-subtle">
          <div className="p-8 max-w-4xl">
            {activeTab === "account" && <AccountTab />}
            {activeTab === "notifications" && <NotificationsTab />}
            {activeTab === "billing" && <BillingTab />}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AccountSettings;
