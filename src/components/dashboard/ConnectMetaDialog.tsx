import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Check } from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MetaPage {
  id: string;
  fbPageName: string;
  fbPageId: string;
  igPageName: string;
  igPageId: string;
  followers: {
    facebook: number;
    instagram: number;
  };
}

// Mock data for 5 FB/IG page pairs
const mockMetaPages: MetaPage[] = [
  {
    id: "1",
    fbPageName: "Tech Solutions Hub",
    fbPageId: "fb_123456789",
    igPageName: "@techsolutionshub",
    igPageId: "ig_987654321",
    followers: {
      facebook: 15400,
      instagram: 23800,
    },
  },
  {
    id: "2",
    fbPageName: "Digital Marketing Pro",
    fbPageId: "fb_234567890",
    igPageName: "@digitalmarketingpro",
    igPageId: "ig_876543210",
    followers: {
      facebook: 32100,
      instagram: 45200,
    },
  },
  {
    id: "3",
    fbPageName: "Creative Studio",
    fbPageId: "fb_345678901",
    igPageName: "@creativestudio",
    igPageId: "ig_765432109",
    followers: {
      facebook: 8900,
      instagram: 12500,
    },
  },
  {
    id: "4",
    fbPageName: "E-commerce Experts",
    fbPageId: "fb_456789012",
    igPageName: "@ecommerceexperts",
    igPageId: "ig_654321098",
    followers: {
      facebook: 27600,
      instagram: 38900,
    },
  },
  {
    id: "5",
    fbPageName: "Brand Builders",
    fbPageId: "fb_567890123",
    igPageName: "@brandbuilders",
    igPageId: "ig_543210987",
    followers: {
      facebook: 19200,
      instagram: 28400,
    },
  },
];

interface ConnectMetaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ConnectMetaDialog = ({ open, onOpenChange }: ConnectMetaDialogProps) => {
  const [selectedPages, setSelectedPages] = useState<string[]>([]);

  const togglePageSelection = (pageId: string) => {
    setSelectedPages((prev) =>
      prev.includes(pageId)
        ? prev.filter((id) => id !== pageId)
        : [...prev, pageId]
    );
  };

  const handleConnect = () => {
    console.log("Connecting pages:", selectedPages);
    // TODO: Implement actual connection logic
    onOpenChange(false);
  };

  const formatFollowers = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-0 gap-0">
        <DialogHeader className="px-8 pt-6 pb-4">
          <DialogTitle className="text-xl font-semibold">
            Connect Meta Platforms
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Select the Facebook and Instagram pages you want to connect
          </p>
        </DialogHeader>

        <ScrollArea className="max-h-[500px] px-8 py-4">
          <div className="space-y-3">
            {mockMetaPages.map((page) => (
              <button
                key={page.id}
                onClick={() => togglePageSelection(page.id)}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  selectedPages.includes(page.id)
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    {/* Facebook Page */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-600/10 flex items-center justify-center flex-shrink-0">
                        <Facebook className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {page.fbPageName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatFollowers(page.followers.facebook)} followers
                        </p>
                      </div>
                    </div>

                    {/* Instagram Page */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center flex-shrink-0">
                        <Instagram className="w-5 h-5 text-pink-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {page.igPageName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatFollowers(page.followers.instagram)} followers
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Selection Indicator */}
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      selectedPages.includes(page.id)
                        ? "border-primary bg-primary"
                        : "border-border"
                    }`}
                  >
                    {selectedPages.includes(page.id) && (
                      <Check className="w-3 h-3 text-primary-foreground" />
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>

        <div className="px-8 py-4 border-t bg-muted/30">
          <div className="flex gap-3 justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {selectedPages.length} page{selectedPages.length !== 1 ? "s" : ""}{" "}
              selected
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="h-11"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                className="h-11"
                onClick={handleConnect}
                disabled={selectedPages.length === 0}
              >
                Connect Selected
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectMetaDialog;
