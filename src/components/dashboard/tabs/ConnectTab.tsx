import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Frame, Instagram } from "lucide-react";

const ConnectTab = () => {
  return (
    <div className="p-8 max-w-5xl">
      <h2 className="text-3xl font-bold mb-8">Connect</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chat Widget */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-blue-600" />
              </div>
              <CardTitle>Chat Widget</CardTitle>
            </div>
            <CardDescription>
              Embed a collapsible chat widget on your website.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button>Get Code</Button>
          </CardContent>
        </Card>

        {/* Chat iframe */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Frame className="w-5 h-5 text-yellow-600" />
              </div>
              <CardTitle>Chat iframe</CardTitle>
            </div>
            <CardDescription>
              Embed a chat window via iframe for flexible placement.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline">Get Code</Button>
          </CardContent>
        </Card>

        {/* Connect Meta Platforms */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center">
                <Instagram className="w-5 h-5 text-pink-600" />
              </div>
              <CardTitle>Connect Meta Platforms</CardTitle>
            </div>
            <CardDescription>
              Connect your bot to Facebook Messenger and Instagram for instant replies.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline">Connect</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConnectTab;
