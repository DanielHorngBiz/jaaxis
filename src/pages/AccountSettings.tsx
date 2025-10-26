import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Settings, User, Bell, CreditCard } from "lucide-react";
import AccountTab from "@/components/account/AccountTab";
import BillingTab from "@/components/account/BillingTab";
import NotificationsTab from "@/components/account/NotificationsTab";

const AccountSettings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "account";
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    if (!searchParams.get("tab")) {
      setSearchParams({ tab: "account" });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const updateIndicator = () => {
      const activeButton = tabsContainerRef.current?.querySelector('[data-state="active"]') as HTMLElement;
      if (activeButton && tabsContainerRef.current) {
        const containerRect = tabsContainerRef.current.getBoundingClientRect();
        const buttonRect = activeButton.getBoundingClientRect();
        setIndicatorStyle({
          left: buttonRect.left - containerRect.left,
          width: buttonRect.width,
        });
      }
    };

    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [activeTab]);

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
          <div className="px-8 border-b border-border relative">
            <div className="flex gap-2 -mb-px relative" ref={tabsContainerRef}>
              <button
                data-state={activeTab === "account" ? "active" : "inactive"}
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
                data-state={activeTab === "notifications" ? "active" : "inactive"}
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
                data-state={activeTab === "billing" ? "active" : "inactive"}
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
