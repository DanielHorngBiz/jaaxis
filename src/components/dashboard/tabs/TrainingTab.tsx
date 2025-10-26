import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCircle, Lightbulb } from "lucide-react";

const TrainingTab = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      {/* Persona Section */}
      <div className="pb-8 border-b">
        <h3 className="text-lg font-semibold mb-2">Persona</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Define your bot's personality and communication style
        </p>
        <div className="space-y-4">
          <Textarea
            className="min-h-[140px] resize-none"
            defaultValue="You are a friendly and helpful assistant. Only when the customer is using Chinese, respond in Traditional Chinese (zh-hant), and use a Taiwan friendly tone; never use Simplified Chinese (zh-cn). Otherwise, please respond in the same language they're using."
          />
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Friendly</Button>
              <Button variant="outline" size="sm">Professional</Button>
              <Button variant="outline" size="sm">Witty</Button>
            </div>
            <Button>Save</Button>
          </div>
        </div>
      </div>

      {/* Knowledge Section */}
      <div className="pb-8 border-b">
        <h3 className="text-lg font-semibold mb-2">Knowledge</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Tell the bot everything it needs to know about your products & services
        </p>
        <div>
          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="text">Text</TabsTrigger>
              <TabsTrigger value="qa">Q&A</TabsTrigger>
              <TabsTrigger value="website">Website</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
              <TabsTrigger value="trained">Trained</TabsTrigger>
            </TabsList>
            <TabsContent value="text" className="mt-6 space-y-4">
              <Textarea
                placeholder="Type here..."
                className="min-h-[200px] resize-none"
              />
              <div className="flex justify-end">
                <Button>Save</Button>
              </div>
            </TabsContent>
            <TabsContent value="qa" className="mt-6">
              <div className="text-center py-12 text-muted-foreground">
                <p>Q&A content coming soon</p>
              </div>
            </TabsContent>
            <TabsContent value="website" className="mt-6">
              <div className="text-center py-12 text-muted-foreground">
                <p>Website import coming soon</p>
              </div>
            </TabsContent>
            <TabsContent value="files" className="mt-6">
              <div className="text-center py-12 text-muted-foreground">
                <p>File upload coming soon</p>
              </div>
            </TabsContent>
            <TabsContent value="trained" className="mt-6">
              <div className="text-center py-12 text-muted-foreground">
                <p>No trained knowledge yet</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Forwarding Rules Section */}
      <div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Forwarding Rules</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Tell the bot when to forward to a human (one per line, or use regex+ lines)
          </p>
        </div>
        <div>
          <Textarea
            placeholder="提馬退款,轉接真人"
            className="min-h-[120px] resize-none"
          />
          <p className="text-sm text-muted-foreground mt-4">
            These are **per assistant**. Base safety rules still apply globally.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrainingTab;
