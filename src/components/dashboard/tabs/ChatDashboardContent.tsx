import { useState } from "react";
import { format, isToday, isYesterday, isSameDay } from "date-fns";
import { Star, Pause, Play, Archive, Send, Paperclip, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import instagramIcon from "@/assets/instagram.svg";
import messengerIcon from "@/assets/messenger.svg";
import jaaxisIcon from "@/assets/jaaxis.svg";

interface Message {
  id: string;
  sender: string;
  avatar?: string;
  preview: string;
  timestamp: string;
  unread?: boolean;
  starred?: boolean;
  archived?: boolean;
  paused?: boolean;
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
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(messages[0]);

  const filteredMessages = messages.filter((msg) => {
    if (selectedPlatform === "all") return !msg.archived;
    if (selectedPlatform === "starred") return msg.starred && !msg.archived;
    if (selectedPlatform === "archived") return msg.archived;
    return msg.platform === selectedPlatform && !msg.archived;
  });

  const toggleStar = () => {
    if (!selectedMessage || selectedMessage.archived) return;
    
    setMessages(prev => prev.map(msg => 
      msg.id === selectedMessage.id 
        ? { ...msg, starred: !msg.starred }
        : msg
    ));
    setSelectedMessage(prev => prev ? { ...prev, starred: !prev.starred } : null);
  };

  const togglePause = () => {
    if (!selectedMessage || selectedMessage.archived) return;
    
    setMessages(prev => prev.map(msg => 
      msg.id === selectedMessage.id 
        ? { ...msg, paused: !msg.paused }
        : msg
    ));
    setSelectedMessage(prev => prev ? { ...prev, paused: !prev.paused } : null);
  };

  const toggleArchive = () => {
    if (!selectedMessage) return;
    
    setMessages(prev => prev.map(msg => 
      msg.id === selectedMessage.id 
        ? { ...msg, archived: !msg.archived, starred: msg.archived ? msg.starred : false, paused: msg.archived ? msg.paused : true }
        : msg
    ));
    
    if (!selectedMessage.archived) {
      // Archiving: unstar and pause the message
      setSelectedMessage(prev => prev ? { ...prev, archived: true, starred: false, paused: true } : null);
    } else {
      // Unarchiving: restore the message
      setSelectedMessage(prev => prev ? { ...prev, archived: false } : null);
    }
  };

  const getPlatformIcon = (platform: Message["platform"]) => {
    switch (platform) {
      case "instagram":
        return <img src={instagramIcon} alt="Instagram" className="w-full h-full" />;
      case "messenger":
        return <img src={messengerIcon} alt="Messenger" className="w-full h-full" />;
      case "website":
        return <img src={jaaxisIcon} alt="Website" className="w-full h-full" />;
      default:
        return null;
    }
  };

  const getPlatformBgColor = (platform: Message["platform"]) => {
    switch (platform) {
      case "instagram":
      case "messenger":
      case "website":
        return "bg-white";
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
                    "absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center border-2 border-background p-0.5",
                    getPlatformBgColor(message.platform)
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
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={toggleStar}
                    disabled={selectedMessage?.archived}
                    className={selectedMessage?.starred ? "text-yellow-500" : ""}
                  >
                    <Star className={cn("h-5 w-5", selectedMessage?.starred && "fill-current")} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={togglePause}
                    disabled={selectedMessage?.archived}
                  >
                    {selectedMessage?.paused ? (
                      <Play className="h-5 w-5" />
                    ) : (
                      <Pause className="h-5 w-5" />
                    )}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={toggleArchive}
                  >
                    <Archive className={cn("h-5 w-5", selectedMessage?.archived && "fill-current")} />
                  </Button>
                </div>
              </div>

              {/* Messages Area */}
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-center my-6">
                    <span className="text-xs text-muted-foreground">Oct 24, 2025</span>
                  </div>

                  <div className="flex flex-col items-start gap-2">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{selectedMessage.sender[0]}</AvatarFallback>
                      </Avatar>
                      <div className="bg-secondary rounded-2xl rounded-tl-sm px-4 py-2 max-w-md">
                        <p className="text-sm">請問更使用Flexoresets是用RAW會比JPG格式還要來得嗎</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground ml-11">11:22 PM</span>
                  </div>

                  <div className="flex items-center justify-center my-6">
                    <span className="text-xs text-muted-foreground">Oct 25, 2025</span>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-2 max-w-md">
                      <p className="text-sm">是的喔，RAW本身能調整的部分就會比較多</p>
                    </div>
                    <span className="text-xs text-muted-foreground mr-2">1:42 PM</span>
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
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="shrink-0">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <Textarea 
                    placeholder="Reply on Instagram..." 
                    className="flex-1 min-h-[40px] resize-none"
                    rows={1}
                  />
                  <Button size="icon" className="shrink-0">
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
