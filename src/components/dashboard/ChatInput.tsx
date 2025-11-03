import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, Send, Check, X } from "lucide-react";
import { useRef } from "react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  selectedImage?: string | null;
  onImageSelect?: (image: string) => void;
  onRemoveImage?: () => void;
  editingMessageId?: string | null;
  onCancelEdit?: () => void;
  primaryColor?: string;
  disabled?: boolean;
  showImageUpload?: boolean;
}

export const ChatInput = ({
  value,
  onChange,
  onSend,
  onKeyPress,
  selectedImage,
  onImageSelect,
  onRemoveImage,
  editingMessageId,
  onCancelEdit,
  primaryColor,
  disabled = false,
  showImageUpload = true,
}: ChatInputProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/') && onImageSelect) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onImageSelect(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-card border-t p-4">
      {editingMessageId && onCancelEdit && (
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-sm font-medium text-foreground">Edit message</h4>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full bg-secondary"
            onClick={onCancelEdit}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      {selectedImage && !editingMessageId && onRemoveImage && (
        <div className="mb-3 relative inline-block w-16 h-16">
          <img 
            src={selectedImage} 
            alt="Selected" 
            className="rounded-lg w-full h-full object-cover"
          />
          <button
            onClick={onRemoveImage}
            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-destructive/90"
          >
            ×
          </button>
        </div>
      )}
      <div className="flex items-center gap-3">
        {!editingMessageId && showImageUpload && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-foreground shrink-0"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="w-5 h-5" />
            </Button>
          </>
        )}
        <Input
          placeholder="Write a message"
          className="flex-1 focus-visible:ring-0"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={onKeyPress}
        />
        <Button 
          size="icon" 
          className="shrink-0 shadow-sm text-white"
          style={primaryColor ? { backgroundColor: primaryColor } : undefined}
          onClick={onSend}
          disabled={disabled}
        >
          {editingMessageId ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
};
