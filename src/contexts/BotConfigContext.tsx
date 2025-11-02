import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

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
  chatbotId: string | null;
}

const defaultConfig: BotConfig = {
  botName: "",
  brandLogo: "",
  primaryColor: "#3888FF",
  chatPosition: "right",
  mobileDisplay: "show",
};

const BotConfigContext = createContext<BotConfigContextType | undefined>(undefined);

export const BotConfigProvider = ({ children }: { children: ReactNode }) => {
  const { botId } = useParams();
  const [chatbotId, setChatbotId] = useState<string | null>(null);
  const [config, setConfig] = useState<BotConfig>(defaultConfig);

  useEffect(() => {
    if (botId) {
      loadBotConfig(botId);
    }
  }, [botId]);

  const loadBotConfig = async (slug: string) => {
    try {
      const { data, error } = await supabase
        .from("chatbots")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) throw error;

      if (data) {
        setChatbotId(data.id);
        setConfig({
          botName: data.name || "",
          brandLogo: data.avatar_url || "",
          primaryColor: data.primary_color || "#3888FF",
          chatPosition: (data.chat_position as "left" | "right") || "right",
          mobileDisplay: (data.mobile_display as "show" | "hide") || "show",
        });
      }
    } catch (error) {
      console.error("Error loading bot config:", error);
    }
  };

  const updateConfig = async (updates: Partial<BotConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);

    if (chatbotId) {
      try {
        await supabase
          .from("chatbots")
          .update({
            name: updates.botName !== undefined ? updates.botName : undefined,
            avatar_url: updates.brandLogo !== undefined ? updates.brandLogo : undefined,
            primary_color: updates.primaryColor !== undefined ? updates.primaryColor : undefined,
            chat_position: updates.chatPosition !== undefined ? updates.chatPosition : undefined,
            mobile_display: updates.mobileDisplay !== undefined ? updates.mobileDisplay : undefined,
          })
          .eq("id", chatbotId);
      } catch (error) {
        console.error("Error updating bot config:", error);
      }
    }

    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent("botConfigUpdated", { detail: newConfig }));
  };

  return (
    <BotConfigContext.Provider value={{ config, updateConfig, chatbotId }}>
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
