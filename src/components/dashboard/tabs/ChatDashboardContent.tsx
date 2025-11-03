import { useState, useEffect, useRef } from "react";
import { format, isToday, isYesterday, isSameDay } from "date-fns";
import { Star, Pause, Play, Archive, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatInput } from "../ChatInput";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { MessageSquare } from "lucide-react";
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

interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: string;
  originalContent?: string;
  showingOriginal?: boolean;
}

const mockMessages: Message[] = [
  {
    id: "1",
    sender: "Sarah Johnson",
    preview: "Hi! I have a question about your product...",
    timestamp: "24/10/2025",
    unread: true,
    platform: "instagram",
  },
  {
    id: "2",
    sender: "Michael Chen",
    preview: "Thanks for the quick response! Really...",
    timestamp: "24/10/2025",
    platform: "instagram",
  },
  {
    id: "3",
    sender: "Emma Davis",
    preview: "Can you help me with the shipping...",
    timestamp: "23/10/2025",
    unread: true,
    platform: "instagram",
  },
  {
    id: "4",
    sender: "James Wilson",
    preview: "You: Sure! The tutorial can be found...",
    timestamp: "24/10/2025",
    platform: "messenger",
  },
  {
    id: "5",
    sender: "Olivia Brown",
    preview: "Is this available in other colors?",
    timestamp: "23/10/2025",
    unread: true,
    platform: "messenger",
  },
  {
    id: "6",
    sender: "Daniel Martinez",
    preview: "You: Yes, we have it in blue, red, and...",
    timestamp: "22/10/2025",
    platform: "messenger",
  },
  {
    id: "7",
    sender: "Sophia Anderson",
    preview: "How long does delivery usually take?",
    timestamp: "24/10/2025",
    unread: true,
    platform: "website",
  },
  {
    id: "8",
    sender: "Lucas Thompson",
    preview: "You: Great question! Delivery takes 3-5...",
    timestamp: "23/10/2025",
    platform: "website",
  },
  {
    id: "9",
    sender: "Ava Garcia",
    preview: "Thank you so much for your help!",
    timestamp: "22/10/2025",
    platform: "website",
  },
];

export const ChatDashboardContent = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(messages[0]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Store chat messages per conversation
  const [conversationChats, setConversationChats] = useState<Record<string, ChatMessage[]>>({
    "1": [
      { id: '1-1', role: 'user', content: 'Hi! I have a question about your product features.', timestamp: '11:22 AM' },
      { id: '1-2', role: 'bot', content: 'Of course! What would you like to know?', timestamp: '11:23 AM' },
      { id: '1-3', role: 'user', content: 'Does it come with a warranty and what does it cover?', timestamp: '11:25 AM' },
      { id: '1-4', role: 'bot', content: 'Yes! It includes a 2-year warranty covering all manufacturing defects.', timestamp: '11:28 AM' },
    ],
    "2": [
      { id: '2-1', role: 'user', content: 'Thanks for the quick response! Really appreciate it.', timestamp: '9:15 AM' },
      { id: '2-2', role: 'bot', content: 'You\'re welcome! Is there anything else I can help you with?', timestamp: '9:16 AM' },
      { id: '2-3', role: 'user', content: 'Yes, what are the shipping options?', timestamp: '9:18 AM' },
      { id: '2-4', role: 'bot', content: 'We offer standard (5-7 days) and express (2-3 days) shipping.', timestamp: '9:19 AM' },
    ],
    "3": [
      { id: '3-1', role: 'user', content: 'Can you help me with the shipping details?', timestamp: '2:30 PM' },
      { id: '3-2', role: 'bot', content: 'Absolutely! What would you like to know about shipping?', timestamp: '2:31 PM' },
      { id: '3-3', role: 'user', content: 'Do you ship internationally?', timestamp: '2:33 PM' },
      { id: '3-4', role: 'bot', content: 'Yes, we ship to over 50 countries worldwide!', timestamp: '2:34 PM' },
    ],
    "4": [
      { id: '4-1', role: 'user', content: 'Do you have a tutorial on how to use this?', timestamp: '10:00 AM' },
      { id: '4-2', role: 'bot', content: 'Sure! The tutorial can be found in our help center.', timestamp: '10:01 AM' },
      { id: '4-3', role: 'user', content: 'Perfect, thank you!', timestamp: '10:03 AM' },
    ],
    "5": [
      { id: '5-1', role: 'user', content: 'Is this available in other colors?', timestamp: '3:45 PM' },
      { id: '5-2', role: 'bot', content: 'Yes! We have blue, red, green, and black options.', timestamp: '3:46 PM' },
      { id: '5-3', role: 'user', content: 'Great! I\'ll take the blue one.', timestamp: '3:48 PM' },
    ],
    "6": [
      { id: '6-1', role: 'user', content: 'What payment methods do you accept?', timestamp: '1:20 PM' },
      { id: '6-2', role: 'bot', content: 'Yes, we have it in blue, red, and green. Which one would you prefer?', timestamp: '1:21 PM' },
      { id: '6-3', role: 'user', content: 'I think I\'ll go with blue, thanks!', timestamp: '1:23 PM' },
    ],
    "7": [
      { id: '7-1', role: 'user', content: 'How long does delivery usually take?', timestamp: '4:10 PM' },
      { id: '7-2', role: 'bot', content: 'Standard delivery takes 5-7 business days, express is 2-3 days.', timestamp: '4:11 PM' },
      { id: '7-3', role: 'user', content: 'Can I track my order?', timestamp: '4:13 PM' },
      { id: '7-4', role: 'bot', content: 'Yes, you\'ll receive a tracking number once your order ships.', timestamp: '4:14 PM' },
    ],
    "8": [
      { id: '8-1', role: 'user', content: 'What\'s the return policy?', timestamp: '11:30 AM' },
      { id: '8-2', role: 'bot', content: 'Great question! Delivery takes 3-5 business days for standard shipping.', timestamp: '11:31 AM' },
      { id: '8-3', role: 'user', content: 'And for returns?', timestamp: '11:33 AM' },
      { id: '8-4', role: 'bot', content: 'We offer 30-day returns for unused items in original packaging.', timestamp: '11:34 AM' },
    ],
    "9": [
      { id: '9-1', role: 'user', content: 'Thank you so much for your help!', timestamp: '5:00 PM' },
      { id: '9-2', role: 'bot', content: 'You\'re very welcome! Feel free to reach out if you need anything else.', timestamp: '5:01 PM' },
    ],
  });
  
  const [inputValue, setInputValue] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);

  const handleToggleOriginal = (messageId: string) => {
    if (!selectedMessage) return;
    setConversationChats(prev => ({
      ...prev,
      [selectedMessage.id]: (prev[selectedMessage.id] || []).map(msg =>
        msg.id === messageId ? { ...msg, showingOriginal: !msg.showingOriginal } : msg
      )
    }));
  };
  const selectedMessageRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState({ top: 0, height: 0, visible: false });

  const filteredMessages = messages.filter((msg) => {
    if (selectedPlatform === "all") return !msg.archived;
    if (selectedPlatform === "starred") return msg.starred && !msg.archived;
    if (selectedPlatform === "archived") return msg.archived;
    return msg.platform === selectedPlatform && !msg.archived;
  });

  useEffect(() => {
    const updateIndicator = () => {
      if (selectedMessageRef.current && listRef.current) {
        const rect = selectedMessageRef.current.getBoundingClientRect();
        const listRect = listRef.current.getBoundingClientRect();
        setIndicator({
          top: rect.top - listRect.top + listRef.current.scrollTop,
          height: rect.height,
          visible: true
        });
        selectedMessageRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        });
      } else {
        setIndicator(prev => ({ ...prev, visible: false }));
      }
    };

    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [selectedMessage, filteredMessages]);

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

  const handleDelete = () => {
    if (!selectedMessage) return;
    
    setMessages(prev => prev.filter(msg => msg.id !== selectedMessage.id));
    setSelectedMessage(null);
    setShowDeleteDialog(false);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() || !selectedMessage) return;
    
    if (editingMessageId) {
      setConversationChats(prev => ({
        ...prev,
        [selectedMessage.id]: (prev[selectedMessage.id] || []).map(msg =>
          msg.id === editingMessageId 
            ? { 
                ...msg, 
                content: inputValue,
                originalContent: msg.originalContent || msg.content,
                showingOriginal: false
              } 
            : msg
        )
      }));
      setEditingMessageId(null);
    } else {
      const newMessage: ChatMessage = {
        id: `${selectedMessage.id}-${Date.now()}`,
        role: 'bot',
        content: inputValue,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      };
      setConversationChats(prev => ({
        ...prev,
        [selectedMessage.id]: [...(prev[selectedMessage.id] || []), newMessage]
      }));
    }
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEditMessage = (messageId: string, content: string) => {
    setEditingMessageId(messageId);
    setInputValue(content);
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setInputValue("");
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
            <div ref={listRef} className="relative">
              {indicator.visible && (
                <div 
                  className="absolute left-0 w-1 bg-primary rounded-r-md transition-all duration-300 ease-out pointer-events-none z-10"
                  style={{ top: `${indicator.top}px`, height: `${indicator.height}px` }}
                />
              )}
              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  ref={selectedMessage?.id === message.id ? selectedMessageRef : null}
                  onClick={() => setSelectedMessage(message)}
                  className={cn(
                    "flex items-start gap-3 p-4 cursor-pointer hover:bg-secondary/50 transition-colors",
                    selectedMessage?.id === message.id && "bg-secondary/30"
                  )}
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
            </div>
          </ScrollArea>
        </div>

        {/* Chat View */}
        <div className="flex-1 flex flex-col">
          {selectedMessage ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 border-b bg-card">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{selectedMessage.sender[0]}</AvatarFallback>
                    </Avatar>
                    <div className={cn(
                      "absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center border-2 border-background p-0.5",
                      getPlatformBgColor(selectedMessage.platform)
                    )}>
                      {getPlatformIcon(selectedMessage.platform)}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium">{selectedMessage.sender}</h3>
                    {selectedMessage.platform === "website" && (
                      <p className="text-xs text-muted-foreground">{selectedMessage.sender.toLowerCase().replace(' ', '')}@email.com</p>
                    )}
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
                  {selectedMessage?.archived && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setShowDeleteDialog(true)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Messages Area */}
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-center my-6">
                    <span className="text-xs text-muted-foreground">Oct 24, 2025</span>
                  </div>

                  {(conversationChats[selectedMessage.id] || []).map((chatMsg, index) => (
                    <div key={chatMsg.id}>
                      {index > 0 && (conversationChats[selectedMessage.id] || [])[index - 1].timestamp !== chatMsg.timestamp && (
                        <div className="flex items-center justify-center my-6">
                          <span className="text-xs text-muted-foreground">Oct 25, 2025</span>
                        </div>
                      )}

                      {chatMsg.role === 'user' ? (
                        <div className="flex flex-col items-start gap-2">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{selectedMessage.sender[0]}</AvatarFallback>
                            </Avatar>
                            <div className="bg-secondary rounded-2xl rounded-tl-sm px-4 py-2 max-w-md">
                              <p className="text-sm">{chatMsg.content}</p>
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground ml-11">{chatMsg.timestamp}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-end gap-2">
                          <div 
                            className="group flex items-center gap-2"
                            onMouseEnter={() => setHoveredMessageId(chatMsg.id)}
                            onMouseLeave={() => setHoveredMessageId(null)}
                          >
                            {hoveredMessageId === chatMsg.id && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-transparent text-muted-foreground/60 hover:text-muted-foreground"
                                onClick={() => handleEditMessage(chatMsg.id, chatMsg.content)}
                              >
                                <Pencil className="h-3 w-3" />
                              </Button>
                            )}
                            <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-2 max-w-md">
                              <p className="text-sm">{chatMsg.showingOriginal ? chatMsg.originalContent : chatMsg.content}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mr-2">
                            <span className="text-xs text-muted-foreground">{chatMsg.timestamp}</span>
                            {chatMsg.originalContent && (
                              <button
                                onClick={() => handleToggleOriginal(chatMsg.id)}
                                className="text-xs text-muted-foreground hover:text-foreground underline"
                              >
                                {chatMsg.showingOriginal ? 'View edited' : 'View original'}
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <ChatInput
                value={inputValue}
                onChange={setInputValue}
                onSend={handleSendMessage}
                onKeyPress={handleKeyPress}
                editingMessageId={editingMessageId}
                onCancelEdit={handleCancelEdit}
                disabled={!inputValue.trim()}
              />
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

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Conversation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete this conversation?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
