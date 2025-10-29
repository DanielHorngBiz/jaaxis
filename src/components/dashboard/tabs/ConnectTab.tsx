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
          <CardContent className="p-6 flex flex-col">
            <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
              <MessageCircle className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Chat Widget</h3>
            <p className="text-sm text-muted-foreground mb-6 flex-1">
              Embed a collapsible chat widget on your website.
            </p>
            <Button className="w-full">Get Code</Button>
          </CardContent>
        </Card>

        {/* Chat iframe */}
        <Card>
          <CardContent className="p-6 flex flex-col">
            <div className="w-14 h-14 rounded-xl bg-yellow-500/10 flex items-center justify-center mb-4">
              <Frame className="w-7 h-7 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Chat iframe</h3>
            <p className="text-sm text-muted-foreground mb-6 flex-1">
              Embed a chat window via iframe for flexible placement.
            </p>
            <Button variant="outline" className="w-full">Get Code</Button>
          </CardContent>
        </Card>

        {/* Connect Meta Platforms */}
        <Card>
          <CardContent className="p-6 flex flex-col">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600/10 to-pink-500/10 flex items-center justify-center gap-1.5 mb-4">
              <Facebook className="w-6 h-6 text-blue-600" />
              <Instagram className="w-6 h-6 text-pink-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Connect Meta Platforms</h3>
            <p className="text-sm text-muted-foreground mb-6 flex-1">
              Connect to Messenger and Instagram.
            </p>
            <Button variant="outline" className="w-full">Connect</Button>
          </CardContent>
        </Card>

        {/* Store */}
        <Card>
          <CardContent className="p-6 flex flex-col">
            <div className="w-14 h-14 rounded-xl bg-green-500/10 flex items-center justify-center mb-4">
              <Store className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Store</h3>
            <p className="text-sm text-muted-foreground mb-6 flex-1">
              Connect your bot to a Store.
            </p>
            <Button variant="outline" className="w-full">Connect</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConnectTab;
