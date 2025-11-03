import { Card } from "@/components/ui/card";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBotConfig } from "@/contexts/BotConfigContext";
import defaultAvatar from "@/assets/jaaxis-avatar.jpg";
import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { ChatInput } from "../ChatInput";

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  image?: string;
  timestamp: Date;
}

const PreviewTab = () => {
  const { config } = useBotConfig();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
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
    if (!inputValue.trim() && !selectedImage) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      image: selectedImage || undefined,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setSelectedImage(null);

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
      if (editingMessageId) {
        handleSaveEdit();
      } else {
        handleSend();
      }
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

  const handleSaveEdit = () => {
    if (!inputValue.trim() || !editingMessageId) return;
    
    setMessages(prev => 
      prev.map(msg => 
        msg.id === editingMessageId 
          ? { ...msg, content: inputValue }
          : msg
      )
    );
    setEditingMessageId(null);
    setInputValue("");
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
        <ScrollArea ref={scrollAreaRef} className="bg-white h-[500px] px-4 py-6">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'bot' && (
                  <div 
                    className="flex items-start gap-3 max-w-[80%] group"
                    onMouseEnter={() => setHoveredMessageId(message.id)}
                    onMouseLeave={() => setHoveredMessageId(null)}
                  >
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src={config.brandLogo} />
                      <AvatarFallback>{config.botName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="relative flex items-center gap-2">
                      <div className="bg-secondary text-foreground rounded-2xl rounded-tl-sm px-4 py-2 break-words">
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                      {hoveredMessageId === message.id && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-transparent text-muted-foreground hover:text-foreground"
                          onClick={() => handleEditMessage(message.id, message.content)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                )}
                {message.role === 'user' && (
                  <div className="flex flex-col items-end gap-2 max-w-[80%]">
                    {message.image && (
                      <img 
                        src={message.image} 
                        alt="Uploaded" 
                        className="rounded-lg max-h-48 max-w-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => setPreviewImage(message.image!)}
                      />
                    )}
                    {message.content && (
                      <div
                        className="text-white rounded-2xl rounded-tr-sm px-4 py-2 break-all"
                        style={{ backgroundColor: config.primaryColor }}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={editingMessageId ? handleSaveEdit : handleSend}
          onKeyPress={handleKeyPress}
          selectedImage={selectedImage}
          onImageSelect={setSelectedImage}
          onRemoveImage={() => setSelectedImage(null)}
          editingMessageId={editingMessageId}
          onCancelEdit={handleCancelEdit}
          primaryColor={config.primaryColor}
          disabled={!inputValue.trim() && !selectedImage}
        />
      </Card>

      {/* Image Preview Dialog */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 overflow-hidden w-fit border-0">
          <DialogClose className="absolute right-2 top-2 z-10 bg-black/60 text-white p-1.5 opacity-70 hover:opacity-100 hover:bg-black/80 transition-all focus:outline-none focus:ring-0">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </DialogClose>
          {previewImage && (
            <img 
              src={previewImage} 
              alt="Preview" 
              className="w-auto h-auto max-w-[90vw] max-h-[90vh] object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PreviewTab;
