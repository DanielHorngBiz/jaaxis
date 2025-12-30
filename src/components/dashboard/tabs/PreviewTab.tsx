import { Card } from "@/components/ui/card";
import { Pencil, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBotConfig } from "@/contexts/BotConfigContext";
import defaultAvatar from "@/assets/jaaxis-avatar.jpg";
import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { ChatInput } from "../ChatInput";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  images?: string[];
  timestamp: Date;
  originalContent?: string;
  showingOriginal?: boolean;
}

const PreviewTab = () => {
  const { config, chatbotId } = useBotConfig();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleToggleOriginal = (messageId: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, showingOriginal: !msg.showingOriginal } : msg
      )
    );
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() && selectedImages.length === 0) return;
    if (!chatbotId) {
      toast({
        title: "Error",
        description: "Chatbot not found",
        variant: "destructive"
      });
      return;
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      images: selectedImages.length > 0 ? [...selectedImages] : undefined,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue("");
    setSelectedImages([]);
    setIsLoading(true);

    try {
      // Prepare conversation history (exclude images for now)
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Call the chat-query edge function
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          chatbot_id: chatbotId,
          message: currentInput,
          conversation_history: conversationHistory,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const contentType = response.headers.get('content-type');

      if (contentType?.includes('text/event-stream')) {
        // Handle streaming response
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let botMessageId = (Date.now() + 1).toString();
        let fullContent = '';

        // Create initial bot message
        setMessages(prev => [...prev, {
          id: botMessageId,
          role: 'bot',
          content: '',
          timestamp: new Date()
        }]);

        if (reader) {
          let buffer = '';
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            
            // Process complete lines
            const lines = buffer.split('\n');
            buffer = lines.pop() || ''; // Keep incomplete line in buffer

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6).trim();
                if (data === '[DONE]') continue;

                try {
                  const parsed = JSON.parse(data);
                  
                  // Handle different response formats
                  // OpenAI Chat Completions format
                  if (parsed.choices?.[0]?.delta?.content) {
                    fullContent += parsed.choices[0].delta.content;
                    setMessages(prev => prev.map(msg =>
                      msg.id === botMessageId ? { ...msg, content: fullContent } : msg
                    ));
                  }
                  // Assistants API format
                  else if (parsed.event === 'thread.message.delta') {
                    const textDelta = parsed.data?.delta?.content?.[0]?.text?.value;
                    if (textDelta) {
                      fullContent += textDelta;
                      setMessages(prev => prev.map(msg =>
                        msg.id === botMessageId ? { ...msg, content: fullContent } : msg
                      ));
                    }
                  }
                } catch (e) {
                  // Skip non-JSON lines
                }
              } else if (line.startsWith('event: ')) {
                // Handle SSE events
                const eventType = line.slice(7).trim();
                if (eventType === 'thread.message.delta') {
                  // Next data line will be the delta
                }
              }
            }
          }
        }
      } else {
        // Handle non-streaming JSON response
        const data = await response.json();
        
        if (data.success && data.response) {
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'bot',
            content: data.response,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, botMessage]);
        } else if (data.error) {
          throw new Error(data.error);
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get response",
        variant: "destructive"
      });
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
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
          ? { 
              ...msg, 
              content: inputValue,
              originalContent: msg.originalContent || msg.content,
              showingOriginal: false
            }
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
                    className="flex flex-col items-start gap-2 max-w-[80%] group"
                    onMouseEnter={() => setHoveredMessageId(message.id)}
                    onMouseLeave={() => setHoveredMessageId(null)}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage src={config.brandLogo} />
                        <AvatarFallback>{config.botName[0]}</AvatarFallback>
                      </Avatar>
                      <div className="relative flex items-center gap-2">
                        <div className="bg-secondary text-foreground rounded-2xl rounded-tl-sm px-4 py-2 break-words">
                          <p className="text-sm whitespace-pre-wrap">{message.showingOriginal ? message.originalContent : message.content}</p>
                        </div>
                        {hoveredMessageId === message.id && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-transparent text-muted-foreground/60 hover:text-muted-foreground"
                            onClick={() => handleEditMessage(message.id, message.content)}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                    {message.originalContent && (
                      <button
                        onClick={() => handleToggleOriginal(message.id)}
                        className="text-xs text-muted-foreground hover:text-foreground underline ml-11"
                      >
                        {message.showingOriginal ? 'View edited' : 'View original'}
                      </button>
                    )}
                  </div>
                )}
                {message.role === 'user' && (
                  <div className="flex flex-col items-end gap-2 max-w-[80%]">
                    {message.images && message.images.length > 0 && (
                      <div className="flex flex-wrap gap-2 justify-end">
                        {message.images.map((img, i) => (
                          <img 
                            key={i}
                            src={img} 
                            alt={`Uploaded ${i + 1}`}
                            className="rounded-lg max-h-48 max-w-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => setPreviewImage(img)}
                          />
                        ))}
                      </div>
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
            {isLoading && messages[messages.length - 1]?.role === 'user' && (
              <div className="flex justify-start">
                <div className="flex items-start gap-3 max-w-[80%]">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={config.brandLogo} />
                    <AvatarFallback>{config.botName[0]}</AvatarFallback>
                  </Avatar>
                  <div className="bg-secondary text-foreground rounded-2xl rounded-tl-sm px-4 py-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={editingMessageId ? handleSaveEdit : handleSend}
          onKeyPress={handleKeyPress}
          selectedImages={selectedImages}
          onImagesSelect={setSelectedImages}
          onRemoveImage={(index) => setSelectedImages(prev => prev.filter((_, i) => i !== index))}
          editingMessageId={editingMessageId}
          onCancelEdit={handleCancelEdit}
          primaryColor={config.primaryColor}
          disabled={isLoading || (!inputValue.trim() && selectedImages.length === 0)}
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