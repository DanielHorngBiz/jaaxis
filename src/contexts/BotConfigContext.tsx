import { createContext, useContext, useState, useEffect, ReactNode } from "react";

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
  brandLogo: "/src/assets/jaaxis-avatar.jpg",
  primaryColor: "#9b8b6f",
  chatPosition: "right",
  mobileDisplay: "show",
};

const BotConfigContext = createContext<BotConfigContextType | undefined>(undefined);

export const BotConfigProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<BotConfig>(() => {
    const saved = localStorage.getItem("botConfig");
    return saved ? JSON.parse(saved) : defaultConfig;
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
