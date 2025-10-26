import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Frame, Instagram, Facebook } from "lucide-react";

const ConnectTab = () => {
  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold">Connect</h2>

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
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center">
                  <Facebook className="w-6 h-6 text-blue-600" />
                </div>
                <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center">
                  <Instagram className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Connect Meta Platforms</h3>
                  <p className="text-sm text-muted-foreground">
                    Connect your bot to Facebook Messenger and Instagram for instant replies.
                  </p>
                </div>
              </div>
              <Button variant="outline">Connect</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConnectTab;
