import { useEffect, useRef, useState } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import defaultAvatar from "@/assets/jaaxis-avatar.jpg";
interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface TabbedPageLayoutProps {
  title: string;
  icon?: LucideIcon;
  avatarSrc?: string;
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  children: React.ReactNode;
  headerAction?: React.ReactNode;
}

export const TabbedPageLayout = ({
  title,
  icon: Icon,
  avatarSrc,
  tabs,
  activeTab,
  onTabChange,
  children,
  headerAction,
}: TabbedPageLayoutProps) => {
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const updateIndicator = () => {
      if (tabsContainerRef.current) {
        const activeButton = tabsContainerRef.current.querySelector(
          `[data-state="active"]`
        ) as HTMLElement;
        if (activeButton) {
          setIndicatorStyle({
            left: activeButton.offsetLeft,
            width: activeButton.offsetWidth,
          });
        }
      }
    };

    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [activeTab]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {avatarSrc ? (
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src={avatarSrc}
                    alt={title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      if (target.src !== defaultAvatar) target.src = defaultAvatar;
                    }}
                  />
                </div>
              ) : Icon ? (
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
              ) : null}
              <h1 className="text-2xl font-bold">{title}</h1>
            </div>
            {headerAction}
          </div>

          {/* Tabs */}
          <div className="relative" ref={tabsContainerRef}>
            <div className="flex gap-6 border-b border-border/40">
              {tabs.map((tab) => {
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    data-state={activeTab === tab.id ? "active" : "inactive"}
                    className={cn(
                      "flex items-center gap-2 px-1 py-3 text-sm font-medium transition-colors relative",
                      activeTab === tab.id
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <TabIcon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
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
        {children}
      </div>
    </div>
  );
};
