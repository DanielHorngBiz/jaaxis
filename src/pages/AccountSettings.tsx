import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
      <div className="p-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Settings className="w-4 h-4 text-primary" />
          </div>
          <h1 className="text-xl font-semibold">Account Settings</h1>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setSearchParams({ tab: value })}>
          <TabsList className="mb-6">
            <TabsTrigger value="account" className="gap-2">
              <User className="w-4 h-4" />
              Account
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="billing" className="gap-2">
              <CreditCard className="w-4 h-4" />
              Pricing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <AccountTab />
          </TabsContent>
          <TabsContent value="notifications">
            <NotificationsTab />
          </TabsContent>
          <TabsContent value="billing">
            <BillingTab />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AccountSettings;
