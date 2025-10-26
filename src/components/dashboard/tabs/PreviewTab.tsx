import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Paperclip, Send } from "lucide-react";

interface PreviewTabProps {
  botName: string;
}

const PreviewTab = ({ botName }: PreviewTabProps) => {
  return (
    <div className="flex items-center justify-center p-8 lg:p-12 min-h-full animate-fade-in">
      <Card className="w-full max-w-md shadow-xl border-border overflow-hidden">
        {/* Chat Header */}
        <div className="bg-[#9b8b6f] text-white p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-foreground flex items-center justify-center shadow-sm">
            <img src="/placeholder.svg" alt={botName} className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-base">{botName}</h3>
            <p className="text-xs text-white/80">AI Assistant</p>
          </div>
        </div>

        {/* Chat Content */}
        <div className="bg-white h-[440px] p-6">
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            Start a conversation to preview your bot
          </div>
        </div>

        {/* Chat Input */}
        <div className="bg-white border-t p-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground shrink-0">
            <Paperclip className="w-5 h-5" />
          </Button>
          <Input
            placeholder="Write a message"
            className="flex-1 border-none shadow-none focus-visible:ring-0 px-0"
          />
          <Button size="icon" className="bg-[#9b8b6f] hover:bg-[#8a7a5f] shrink-0 shadow-sm">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PreviewTab;
