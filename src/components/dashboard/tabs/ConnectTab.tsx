import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Frame, Instagram, Facebook, Store } from "lucide-react";

const ConnectTab = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-2">Integration Options</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Connect your bot to various platforms and embed it on your website
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chat Widget */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Chat Widget</h3>
                <p className="text-sm text-muted-foreground">
                  Embed a collapsible chat widget on your website.
                </p>
              </div>
            </div>
            <Button>Get Code</Button>
          </CardContent>
        </Card>

        {/* Chat iframe */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                <Frame className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Chat iframe</h3>
                <p className="text-sm text-muted-foreground">
                  Embed a chat window via iframe for flexible placement.
                </p>
              </div>
            </div>
            <Button variant="outline">Get Code</Button>
          </CardContent>
        </Card>

        {/* Connect Meta Platforms */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex gap-2 shrink-0">
                <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center shrink-0">
                  <Facebook className="w-6 h-6 text-blue-600 shrink-0" />
                </div>
                <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center shrink-0">
                  <Instagram className="w-6 h-6 text-pink-600 shrink-0" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg mb-1">Connect Meta Platforms</h3>
                <p className="text-sm text-muted-foreground">
                  Connect to Messenger and Instagram.
                </p>
              </div>
            </div>
            <Button variant="outline">Connect</Button>
          </CardContent>
        </Card>

        {/* Store */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <Store className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Store</h3>
                <p className="text-sm text-muted-foreground">
                  Connect your bot to a Store.
                </p>
              </div>
            </div>
            <Button variant="outline">Connect</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConnectTab;
