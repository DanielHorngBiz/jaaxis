import React, { createContext, useContext, useState, ReactNode } from "react";
import jaaxisAvatar from "@/assets/jaaxis-avatar.jpg";

export interface BotAppearance {
  botName: string;
  brandLogo: string;
  primaryColor: string;
  chatPosition: "left" | "right";
  mobileDisplay: "show" | "hide";
}

interface BotAppearanceContextType {
  appearance: BotAppearance;
  updateAppearance: (updates: Partial<BotAppearance>) => void;
}

const defaultAppearance: BotAppearance = {
  botName: "Jaaxis",
  brandLogo: jaaxisAvatar,
  primaryColor: "#3888FF",
  chatPosition: "right",
  mobileDisplay: "show",
};

const BotAppearanceContext = createContext<BotAppearanceContextType | undefined>(undefined);

export const BotAppearanceProvider = ({ children }: { children: ReactNode }) => {
  const [appearance, setAppearance] = useState<BotAppearance>(defaultAppearance);

  const updateAppearance = (updates: Partial<BotAppearance>) => {
    setAppearance((prev) => ({ ...prev, ...updates }));
  };

  return (
    <BotAppearanceContext.Provider value={{ appearance, updateAppearance }}>
      {children}
    </BotAppearanceContext.Provider>
  );
};

export const useBotAppearance = () => {
  const context = useContext(BotAppearanceContext);
  if (!context) {
    throw new Error("useBotAppearance must be used within BotAppearanceProvider");
  }
  return context;
};
