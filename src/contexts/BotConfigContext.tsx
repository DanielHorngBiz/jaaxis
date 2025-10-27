import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import defaultAvatar from "@/assets/jaaxis-avatar.jpg";

interface BotConfig {
  botName: string;
  brandLogo: string;
  primaryColor: string;
  chatPosition: "left" | "right";
  mobileDisplay: "show" | "hide";
}

interface BotConfigContextType {
  config: BotConfig;
  updateConfig: (updates: Partial<BotConfig>) => void;
}

const defaultConfig: BotConfig = {
  botName: "Jaaxis",
  brandLogo: defaultAvatar,
  primaryColor: "#9b8b6f",
  chatPosition: "right",
  mobileDisplay: "show",
};

const BotConfigContext = createContext<BotConfigContextType | undefined>(undefined);

export const BotConfigProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<BotConfig>(() => {
    const saved = localStorage.getItem("botConfig");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.brandLogo || typeof parsed.brandLogo !== "string" || parsed.brandLogo.startsWith("/src/")) {
          parsed.brandLogo = defaultAvatar;
        }
        return { ...defaultConfig, ...parsed };
      } catch {
        // ignore parsing error and fall back
      }
    }
    return defaultConfig;
  });

  useEffect(() => {
    localStorage.setItem("botConfig", JSON.stringify(config));
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent("botConfigUpdated", { detail: config }));
  }, [config]);

  const updateConfig = (updates: Partial<BotConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  return (
    <BotConfigContext.Provider value={{ config, updateConfig }}>
      {children}
    </BotConfigContext.Provider>
  );
};

export const useBotConfig = () => {
  const context = useContext(BotConfigContext);
  if (!context) {
    throw new Error("useBotConfig must be used within BotConfigProvider");
  }
  return context;
};
