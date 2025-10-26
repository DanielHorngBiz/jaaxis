import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { UserCircle, Lightbulb, RotateCcw } from "lucide-react";

const TrainingTab = () => {
  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Training</h1>
        <p className="text-muted-foreground">
          Configure your bot's personality and knowledge base
        </p>
      </div>

      {/* Persona Section */}
      <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <UserCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl mb-1">Bot Persona</CardTitle>
                <CardDescription>
                  Define how your bot communicates with users
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Configured
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Textarea
              className="min-h-[160px] resize-none text-sm leading-relaxed focus:ring-2 focus:ring-primary/20"
              defaultValue="You are a friendly and helpful assistant. Only when the customer is using Chinese, respond in Traditional Chinese (zh-hant), and use a Taiwan friendly tone; never use Simplified Chinese (zh-cn). Otherwise, please respond in the same language they're using."
            />
          </div>
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex gap-2">
              <Badge variant="outline" className="cursor-pointer hover:bg-secondary transition-colors">
                Friendly
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-secondary transition-colors">
                Professional
              </Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-secondary transition-colors">
                Witty
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
              <Button size="sm" className="shadow-sm">
                Save Changes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Knowledge Section */}
      <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl mb-1">Knowledge Base</CardTitle>
                <CardDescription>
                  Provide information about your products & services
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
              0 sources
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid grid-cols-5 w-full mb-6">
              <TabsTrigger value="text" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Text
              </TabsTrigger>
              <TabsTrigger value="qa">Q&A</TabsTrigger>
              <TabsTrigger value="website">Website</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
              <TabsTrigger value="trained">Trained</TabsTrigger>
            </TabsList>
            
            <TabsContent value="text" className="space-y-4">
              <Textarea
                placeholder="Enter your bot's knowledge here. For example, information about your products, services, policies, or common questions..."
                className="min-h-[280px] resize-none focus:ring-2 focus:ring-primary/20"
              />
              <div className="flex justify-end">
                <Button className="shadow-sm">
                  Add Knowledge
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="qa" className="min-h-[280px]">
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Lightbulb className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-2">Q&A Training</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Upload question and answer pairs to train your bot on specific responses
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="website" className="min-h-[280px]">
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Lightbulb className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-2">Website Scraping</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Import content from your website to train your bot automatically
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="files" className="min-h-[280px]">
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Lightbulb className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-2">File Upload</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Upload documents, PDFs, or other files to expand your bot's knowledge
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="trained" className="min-h-[280px]">
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Lightbulb className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-2">No Trained Knowledge</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Your trained knowledge sources will appear here once you add them
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainingTab;
