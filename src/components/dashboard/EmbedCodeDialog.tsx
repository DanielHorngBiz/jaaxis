import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useBotConfig } from "@/contexts/BotConfigContext";
import { supabase } from "@/integrations/supabase/client";

interface EmbedCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "widget" | "iframe";
}

const EmbedCodeDialog = ({ open, onOpenChange, type }: EmbedCodeDialogProps) => {
  const { config, chatbotId, updateConfig } = useBotConfig();
  const { toast } = useToast();
  const [domainInput, setDomainInput] = useState("");
  const [pageInput, setPageInput] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const whitelistedDomains = config.whitelisted_domains || [];
  const blockedPages = config.blocked_pages || [];

  const embedCode = type === "widget"
    ? `<script id="jaaxis-chatbot-loader">
  (function() {
    var s = document.createElement('script');
    s.src = "https://staging.jaaxis.com/chatbot.js"
    s.dataset.chatbotId = "d3920e44cf1f6906cH7c0d056debd6h";
    document.body.appendChild(s);
  })();
</script>`
    : `<iframe
  src="https://staging.jaaxis.com/chat/d3920e44cf1f6906cH7c0d056debd6h"
  width="100%"
  height="600"
  frameborder="0"
></iframe>`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(embedCode);
    toast({
      title: "Copied!",
      description: "Embed code copied to clipboard",
    });
  };

  const handleAddDomain = async () => {
    if (!domainInput.trim()) return;

    const newDomains = [...whitelistedDomains, domainInput.trim()];
    setIsAdding(true);

    try {
      const { error } = await supabase
        .from("chatbots")
        .update({ whitelisted_domains: newDomains })
        .eq("id", chatbotId);

      if (error) throw error;

      await updateConfig({ whitelisted_domains: newDomains });
      setDomainInput("");
      toast({
        title: "Domain added",
        description: "Domain has been whitelisted successfully",
      });
    } catch (error) {
      console.error("Error adding domain:", error);
      toast({
        title: "Error",
        description: "Failed to add domain",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveDomain = async (domain: string) => {
    const newDomains = whitelistedDomains.filter((d) => d !== domain);

    try {
      const { error } = await supabase
        .from("chatbots")
        .update({ whitelisted_domains: newDomains })
        .eq("id", chatbotId);

      if (error) throw error;

      await updateConfig({ whitelisted_domains: newDomains });
      toast({
        title: "Domain removed",
        description: "Domain has been removed from whitelist",
      });
    } catch (error) {
      console.error("Error removing domain:", error);
      toast({
        title: "Error",
        description: "Failed to remove domain",
        variant: "destructive",
      });
    }
  };

  const handleAddPage = async () => {
    if (!pageInput.trim()) return;

    const newPages = [...blockedPages, pageInput.trim()];
    setIsAdding(true);

    try {
      const { error } = await supabase
        .from("chatbots")
        .update({ blocked_pages: newPages })
        .eq("id", chatbotId);

      if (error) throw error;

      await updateConfig({ blocked_pages: newPages });
      setPageInput("");
      toast({
        title: "Page added",
        description: "Page has been added to hide list",
      });
    } catch (error) {
      console.error("Error adding page:", error);
      toast({
        title: "Error",
        description: "Failed to add page",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemovePage = async (page: string) => {
    const newPages = blockedPages.filter((p) => p !== page);

    try {
      const { error } = await supabase
        .from("chatbots")
        .update({ blocked_pages: newPages })
        .eq("id", chatbotId);

      if (error) throw error;

      await updateConfig({ blocked_pages: newPages });
      toast({
        title: "Page removed",
        description: "Page has been removed from hide list",
      });
    } catch (error) {
      console.error("Error removing page:", error);
      toast({
        title: "Error",
        description: "Failed to remove page",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Embed Chatbot</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Instructions */}
          <p className="text-sm text-muted-foreground">
            Copy and paste this code into your website just before the closing &lt;/body&gt; tag.
          </p>

          {/* Code Display */}
          <div className="space-y-3">
            <Textarea
              value={embedCode}
              readOnly
              className="font-mono text-xs resize-none h-32"
            />
            <div className="flex justify-end">
              <Button
                onClick={handleCopyCode}
                size="lg"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
            </div>
          </div>

          {/* Add Domain Section */}
          <div className="space-y-3">
            <Label className="text-sm text-muted-foreground">
              Whitelist Domain
            </Label>
            <div className="flex gap-2">
              <Input
                placeholder="https://example.com"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddDomain()}
              />
              <Button
                onClick={handleAddDomain}
                disabled={isAdding || !domainInput.trim()}
                className="shrink-0"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
          </div>

          {/* Whitelisted Domains */}
          {whitelistedDomains.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold">Whitelisted Domains</h3>
              <div className="space-y-2">
                {whitelistedDomains.map((domain, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card"
                  >
                    <div>
                      <p className="font-medium">{domain}</p>
                      <p className="text-sm text-muted-foreground">
                        Added on {new Date().toLocaleDateString("en-US", {
                          month: "2-digit",
                          day: "2-digit",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveDomain(domain)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hide on Pages - Widget Only */}
          {type === "widget" && (
            <>
              <div className="space-y-3">
                <Label className="text-sm text-muted-foreground">
                  Hide on Specific Pages
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="/about, /contact"
                    value={pageInput}
                    onChange={(e) => setPageInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddPage()}
                  />
                  <Button
                    onClick={handleAddPage}
                    disabled={isAdding || !pageInput.trim()}
                    className="shrink-0"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>

              {/* Hidden Pages List */}
              {blockedPages.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold">Hidden Pages</h3>
                  <div className="space-y-2">
                    {blockedPages.map((page, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 rounded-lg border bg-card"
                      >
                        <div>
                          <p className="font-medium">{page}</p>
                          <p className="text-sm text-muted-foreground">
                            Widget will be hidden on this page
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemovePage(page)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmbedCodeDialog;
