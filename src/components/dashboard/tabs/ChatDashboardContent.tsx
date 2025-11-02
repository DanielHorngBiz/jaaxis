import { useState } from "react";
import { MessageSquare, Star, Pause, Archive, Send, Paperclip, Instagram, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  sender: string;
  avatar?: string;
  preview: string;
  timestamp: string;
  unread?: boolean;
  starred?: boolean;
  archived?: boolean;
  platform: "all" | "starred" | "messenger" | "instagram" | "website" | "archived";
}

const mockMessages: Message[] = [
  {
    id: "1",
    sender: "Michelle Hoh",
    preview: "你好 我想請問一下這是哪種只在lightroom裡...",
    timestamp: "24/10/2025",
    unread: true,
    platform: "instagram",
  },
  {
    id: "2",
    sender: "Charles",
    preview: "You: 可以先關到高感的背景用",
    timestamp: "24/10/2025",
    platform: "messenger",
  },
  {
    id: "3",
    sender: "Lain Liu",
    preview: "謝謝您",
    timestamp: "23/10/2025",
    unread: true,
    platform: "messenger",
  },
  {
    id: "4",
    sender: "ZT",
    preview: "You: 您好，教學可以參考這裡：...",
    timestamp: "22/10/2025",
    platform: "website",
  },
];

export const ChatDashboardContent = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(mockMessages[0]);

  const filteredMessages = mockMessages.filter((msg) => {
    if (selectedPlatform === "all") return !msg.archived;
    if (selectedPlatform === "starred") return msg.starred;
    if (selectedPlatform === "archived") return msg.archived;
    return msg.platform === selectedPlatform;
  });

  const getPlatformIcon = (platform: Message["platform"]) => {
    switch (platform) {
      case "instagram":
        return <Instagram className="w-3 h-3 text-white" />;
      case "messenger":
        return <Facebook className="w-3 h-3 text-white" />;
      case "website":
        return <MessageSquare className="w-3 h-3 text-white" />;
      default:
        return null;
    }
  };

  const getPlatformColor = (platform: Message["platform"]) => {
    switch (platform) {
      case "instagram":
        return "bg-gradient-to-tr from-[#f58529] via-[#dd2a7b] to-[#8134af]";
      case "messenger":
        return "bg-[#0084ff]";
      case "website":
        return "bg-primary";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Platform Tabs */}
      <div className="border-b bg-card px-6">
        <Tabs value={selectedPlatform} onValueChange={setSelectedPlatform}>
          <TabsList className="w-full justify-start h-auto bg-transparent border-b rounded-none p-0 gap-2">
            <TabsTrigger value="all">
              All messages
            </TabsTrigger>
            <TabsTrigger value="starred">
              Starred
            </TabsTrigger>
            <TabsTrigger value="messenger">
              Messenger
            </TabsTrigger>
            <TabsTrigger value="instagram">
              Instagram
            </TabsTrigger>
            <TabsTrigger value="website">
              Website
            </TabsTrigger>
            <TabsTrigger value="archived">
              Archived
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-96 border-r bg-card flex flex-col">
          <ScrollArea className="flex-1">
            {filteredMessages.map((message) => (
              <div
                key={message.id}
                onClick={() => setSelectedMessage(message)}
                className={`flex items-start gap-3 p-4 cursor-pointer hover:bg-secondary/50 transition-colors border-l-4 ${
                  selectedMessage?.id === message.id
                    ? "border-l-primary bg-secondary/30"
                    : "border-l-transparent"
                }`}
              >
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={message.avatar} />
                    <AvatarFallback>{message.sender[0]}</AvatarFallback>
                  </Avatar>
                  <div className={cn(
                    "absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center border-2 border-background",
                    getPlatformColor(message.platform)
                  )}>
                    {getPlatformIcon(message.platform)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`font-medium ${message.unread ? "text-foreground" : "text-muted-foreground"}`}>
                      {message.sender}
                    </span>
                    <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{message.preview}</p>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>

        {/* Chat View */}
        <div className="flex-1 flex flex-col">
          {selectedMessage ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 border-b bg-card">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{selectedMessage.sender[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{selectedMessage.sender}</h3>
                    <p className="text-xs text-muted-foreground">Assign this conversation</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Star className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Pause className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Archive className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Messages Area */}
              <ScrollArea className="flex-1 p-6">
                <div className="max-w-3xl mx-auto space-y-4">
                  <div className="flex flex-col items-start gap-2">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{selectedMessage.sender[0]}</AvatarFallback>
                      </Avatar>
                      <div className="bg-secondary rounded-2xl rounded-tl-sm px-4 py-2 max-w-md">
                        <p className="text-sm">請問更使用Flexoresets是用RAW會比JPG格式還要來得嗎</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground ml-11">Fri 11:22 PM</span>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-2 max-w-md">
                      <p className="text-sm">是的喔，RAW本身能調整的部分就會比較多</p>
                    </div>
                    <span className="text-xs text-muted-foreground mr-2">Sat 1:42 PM</span>
                  </div>

                  <div className="flex flex-col items-start gap-2">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{selectedMessage.sender[0]}</AvatarFallback>
                      </Avatar>
                      <div className="bg-secondary rounded-2xl rounded-tl-sm px-4 py-2 max-w-md">
                        <p className="text-sm">所以使用RAW檔的話 需要先把白平衡調整好再套用嗎 還是可以直接套用沒關係</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-2 max-w-md">
                      <p className="text-sm">可以先調到高感的背景用</p>
                    </div>
                    <span className="text-xs text-muted-foreground mr-2">Sent</span>
                  </div>
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="p-4 border-t bg-card">
                <div className="flex items-end gap-2">
                  <Button variant="ghost" size="icon" className="mb-1">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <Textarea 
                    placeholder="Reply on Instagram..." 
                    className="flex-1 min-h-[40px] resize-none"
                    rows={1}
                  />
                  <Button size="icon" className="mb-1">
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a conversation to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
