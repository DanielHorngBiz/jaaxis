import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCircle, Lightbulb } from "lucide-react";

const TrainingTab = () => {
  return (
    <div className="p-8 lg:p-12 max-w-5xl mx-auto animate-fade-in">
      <h2 className="text-3xl font-bold mb-2">Training</h2>
      <p className="text-muted-foreground mb-8">Configure your bot's personality and knowledge base</p>

      {/* Persona Section */}
      <Card className="mb-8 shadow-sm border-border hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <UserCircle className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Persona</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Define how your bot communicates</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            className="min-h-[140px] resize-none text-sm leading-relaxed"
            defaultValue="You are a friendly and helpful assistant. Only when the customer is using Chinese, respond in Traditional Chinese (zh-hant), and use a Taiwan friendly tone; never use Simplified Chinese (zh-cn). Otherwise, please respond in the same language they're using."
          />
          <div className="flex items-center justify-between pt-2">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              Restore Original
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Friendly</Button>
              <Button variant="outline" size="sm">Professional</Button>
              <Button variant="outline" size="sm">Witty</Button>
            </div>
            <Button size="sm" className="shadow-sm">Save</Button>
          </div>
        </CardContent>
      </Card>

      {/* Knowledge Section */}
      <Card className="shadow-sm border-border hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-xl">Knowledge</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Provide information about your products & services
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainingTab;
