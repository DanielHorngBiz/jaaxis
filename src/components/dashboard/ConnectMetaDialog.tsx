import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Check } from "lucide-react";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MetaPage {
  id: string;
  fbPageName: string;
  igHandle?: string;
}

// Mock data for 5 FB/IG page pairs
const mockMetaPages: MetaPage[] = [
  {
    id: "1",
    fbPageName: "Tech Solutions Hub",
    igHandle: "@techsolutionshub",
  },
  {
    id: "2",
    fbPageName: "Digital Marketing Pro",
    // No IG account
  },
  {
    id: "3",
    fbPageName: "Creative Studio",
    igHandle: "@creativestudio",
  },
  {
    id: "4",
    fbPageName: "E-commerce Experts",
    // No IG account
  },
  {
    id: "5",
    fbPageName: "Brand Builders",
    igHandle: "@brandbuilders",
  },
];

interface ConnectMetaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConnect?: () => void;
}

const ConnectMetaDialog = ({ open, onOpenChange, onConnect }: ConnectMetaDialogProps) => {
  const [selectedPage, setSelectedPage] = useState<string | null>(null);

  const togglePageSelection = (pageId: string) => {
    setSelectedPage((prev) => (prev === pageId ? null : pageId));
  };

  const handleConnect = () => {
    console.log("Connecting page:", selectedPage);
    onConnect?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px] p-0 gap-0">
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
                className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                  selectedPage === page.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    {/* Facebook Page */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center flex-shrink-0">
                        <Facebook className="w-4 h-4 text-blue-600" />
                      </div>
                      <p className="font-semibold text-sm">
                        {page.fbPageName}
                      </p>
                    </div>

                    {/* Instagram as sub-item */}
                    {page.igHandle ? (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center flex-shrink-0">
                          <Instagram className="w-4 h-4 text-pink-600" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {page.igHandle}
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 flex-shrink-0" />
                        <p className="text-sm text-muted-foreground italic">
                          No Instagram Business account connected
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Selection Indicator */}
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      selectedPage === page.id
                        ? "border-primary bg-primary"
                        : "border-border"
                    }`}
                  >
                    {selectedPage === page.id && (
                      <Check className="w-3 h-3 text-primary-foreground" />
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>

        <div className="px-8 py-4 border-t bg-muted/30">
          <div className="flex justify-end">
            <Button
              className="h-11"
              onClick={handleConnect}
              disabled={!selectedPage}
            >
              Connect
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectMetaDialog;
