import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Paperclip, Send } from "lucide-react";
import { useBotConfig } from "@/contexts/BotConfigContext";
import defaultAvatar from "@/assets/jaaxis-avatar.jpg";
import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const PreviewTab = () => {
  const { config } = useBotConfig();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");

    // Bot responds after a short delay
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: "Hi, this is a sample message.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center justify-center p-8 lg:p-12 h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md shadow-xl border-border overflow-hidden rounded-2xl">
        {/* Chat Header */}
        <div className="text-white p-5 flex items-center gap-4" style={{ backgroundColor: config.primaryColor }}>
          <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-sm overflow-hidden">
            <img
              src={config.brandLogo}
              alt={config.botName}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                if (target.src !== defaultAvatar) target.src = defaultAvatar;
              }}
            />
          </div>
          <div>
            <h3 className="font-semibold text-base">{config.botName}</h3>
          </div>
        </div>

        {/* Chat Content */}
        <ScrollArea ref={scrollAreaRef} className="bg-white h-[500px] p-6">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'bot' && (
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={config.brandLogo} />
                      <AvatarFallback>{config.botName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="bg-secondary text-foreground rounded-2xl rounded-tl-sm px-4 py-2 max-w-md">
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                )}
                {message.role === 'user' && (
                  <div
                    className="text-white rounded-2xl rounded-tr-sm px-4 py-2 max-w-md"
                    style={{ backgroundColor: config.primaryColor }}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Chat Input */}
        <div className="bg-white border-t p-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground shrink-0">
            <Paperclip className="w-5 h-5" />
          </Button>
          <Input
            placeholder="Write a message"
            className="flex-1 border-none shadow-none focus-visible:ring-0 px-0"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button 
            size="icon" 
            className="shrink-0 shadow-sm text-white"
            style={{ backgroundColor: config.primaryColor }}
            onClick={handleSend}
            disabled={!inputValue.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PreviewTab;
