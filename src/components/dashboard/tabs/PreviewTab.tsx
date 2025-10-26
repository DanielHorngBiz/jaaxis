import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Paperclip, Send } from "lucide-react";

interface PreviewTabProps {
  botName: string;
}

const PreviewTab = ({ botName }: PreviewTabProps) => {
  return (
    <div className="flex items-center justify-center p-8 min-h-full">
      <Card className="w-full max-w-md shadow-lg overflow-hidden">
        {/* Chat Header */}
        <div className="bg-[#9b8b6f] text-white p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center">
            <img src="/placeholder.svg" alt={botName} className="w-6 h-6" />
          </div>
          <h3 className="font-semibold">{botName}</h3>
        </div>

        {/* Chat Content */}
        <div className="bg-white h-[400px] p-4">
          {/* Empty state */}
        </div>

        {/* Chat Input */}
        <div className="bg-white border-t p-4 flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Paperclip className="w-5 h-5" />
          </Button>
          <Input
            placeholder="Write a message"
            className="flex-1 border-none focus-visible:ring-0"
          />
          <Button size="icon" className="bg-[#9b8b6f] hover:bg-[#8a7a5f]">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PreviewTab;
