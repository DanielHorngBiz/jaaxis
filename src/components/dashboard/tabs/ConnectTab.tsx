import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Frame, Instagram, Facebook } from "lucide-react";

const ConnectTab = () => {
  return (
    <div className="p-8 lg:p-12 max-w-5xl mx-auto animate-fade-in">
      <h2 className="text-3xl font-bold mb-2">Connect</h2>
      <p className="text-muted-foreground mb-8">Integrate your chatbot across multiple platforms</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chat Widget */}
        <Card className="shadow-sm border-border hover:shadow-lg hover:shadow-primary/5 transition-all">
          <CardHeader>
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Chat Widget</CardTitle>
            </div>
            <CardDescription className="text-sm leading-relaxed">
              Embed a collapsible chat widget on your website.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="shadow-sm">Get Code</Button>
          </CardContent>
        </Card>

        {/* Chat iframe */}
        <Card className="shadow-sm border-border hover:shadow-lg hover:shadow-primary/5 transition-all">
          <CardHeader>
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                <Frame className="w-6 h-6 text-yellow-600" />
              </div>
              <CardTitle className="text-lg">Chat iframe</CardTitle>
            </div>
            <CardDescription className="text-sm leading-relaxed">
              Embed a chat window via iframe for flexible placement.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="shadow-sm">Get Code</Button>
          </CardContent>
        </Card>

        {/* Connect Meta Platforms */}
        <Card className="md:col-span-2 shadow-sm border-border hover:shadow-lg hover:shadow-primary/5 transition-all">
          <CardHeader>
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center">
                <Facebook className="w-6 h-6 text-blue-600" />
              </div>
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center">
                <Instagram className="w-6 h-6 text-pink-600" />
              </div>
              <CardTitle className="text-lg">Connect Meta Platforms</CardTitle>
            </div>
            <CardDescription className="text-sm leading-relaxed">
              Connect your bot to Facebook Messenger and Instagram for instant replies.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="shadow-sm">Connect</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConnectTab;
