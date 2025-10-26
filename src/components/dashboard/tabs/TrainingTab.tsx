import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCircle, Lightbulb, AlertTriangle } from "lucide-react";

const TrainingTab = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold">Training</h2>

      {/* Persona Section */}
      <div className="pb-8 border-b">
        <h3 className="text-lg font-semibold mb-6">Persona</h3>
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
        <h3 className="text-lg font-semibold mb-6">Knowledge</h3>
        <div>
          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="text">Text</TabsTrigger>
              <TabsTrigger value="qa">Q&A</TabsTrigger>
              <TabsTrigger value="website">Website</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
              <TabsTrigger value="trained">Trained</TabsTrigger>
            </TabsList>
            <TabsContent value="text" className="mt-6">
              <Textarea
                placeholder="Type here..."
                className="min-h-[240px] resize-none"
              />
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
        <div className="flex items-start gap-3 mb-6">
          <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold">Forwarding Rules</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Tell the bot when to forward to a human (one per line, or use regex+ lines)
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <Textarea
            placeholder="提馬退款,轉接真人"
            className="min-h-[120px] resize-none"
          />
          <p className="text-sm text-muted-foreground">
            These are **per assistant**. Base safety rules still apply globally.
          </p>
          <div className="flex justify-end">
            <Button>Save</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingTab;
