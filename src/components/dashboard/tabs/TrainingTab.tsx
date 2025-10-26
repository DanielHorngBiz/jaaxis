import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCircle, Lightbulb } from "lucide-react";

const TrainingTab = () => {
  return (
    <div className="p-8 max-w-5xl">
      <h2 className="text-3xl font-bold mb-8">Training</h2>

      {/* Persona Section */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <UserCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle>Persona</CardTitle>
              <p className="text-sm text-muted-foreground">Define the bot's persona</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            className="min-h-[120px] resize-none"
            defaultValue="You are a friendly and helpful assistant. Only when the customer is using Chinese, respond in Traditional Chinese (zh-hant), and use a Taiwan friendly tone; never use Simplified Chinese (zh-cn). Otherwise, please respond in the same language they're using."
          />
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm">
              Restore Original
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Friendly</Button>
              <Button variant="outline" size="sm">Professional</Button>
              <Button variant="outline" size="sm">Witty</Button>
            </div>
            <Button size="sm">Save</Button>
          </div>
        </CardContent>
      </Card>

      {/* Knowledge Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <CardTitle>Knowledge</CardTitle>
              <p className="text-sm text-muted-foreground">
                Tell the bot everything it needs to know about your products & services
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="text" className="w-full">
            <TabsList>
              <TabsTrigger value="text">Text</TabsTrigger>
              <TabsTrigger value="qa">Q&A</TabsTrigger>
              <TabsTrigger value="website">Website</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
              <TabsTrigger value="trained">Trained Knowledge</TabsTrigger>
            </TabsList>
            <TabsContent value="text" className="mt-4">
              <Textarea
                placeholder="Type here..."
                className="min-h-[200px] resize-none"
              />
            </TabsContent>
            <TabsContent value="qa" className="mt-4">
              <p className="text-sm text-muted-foreground">Q&A content coming soon</p>
            </TabsContent>
            <TabsContent value="website" className="mt-4">
              <p className="text-sm text-muted-foreground">Website import coming soon</p>
            </TabsContent>
            <TabsContent value="files" className="mt-4">
              <p className="text-sm text-muted-foreground">File upload coming soon</p>
            </TabsContent>
            <TabsContent value="trained" className="mt-4">
              <p className="text-sm text-muted-foreground">No trained knowledge yet</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainingTab;
