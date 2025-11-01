import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Trash2, Globe, FileText, CheckCircle2, Clock } from "lucide-react";
import { useState } from "react";

interface QAPair {
  id: string;
  question: string;
  answer: string;
}

const TrainingTab = () => {
  const [persona, setPersona] = useState("");
  const [qaPairs, setQaPairs] = useState<QAPair[]>([{ id: '1', question: '', answer: '' }]);

  const personaTemplates = {
    friendly: "You are a friendly and approachable assistant. Use a warm, conversational tone. Be empathetic and personable in your responses. Use casual language while maintaining professionalism.",
    professional: "You are a professional business assistant. Maintain a formal and courteous tone. Provide clear, concise responses. Focus on efficiency and accuracy in all communications.",
    witty: "You are a clever and witty assistant with a good sense of humor. Use playful language and occasional humor to engage users. Keep responses entertaining while remaining helpful and informative."
  };

  return (
    <div className="space-y-8">
      {/* Persona Section */}
      <div className="pb-8 border-b">
        <h3 className="text-lg font-semibold mb-2">Persona</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Define your bot's personality and communication style
        </p>
        <div className="space-y-4">
          <Textarea
            className="min-h-[140px] resize-none"
            placeholder="Type here..."
            value={persona}
            onChange={(e) => setPersona(e.target.value)}
          />
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setPersona(personaTemplates.friendly)}>Friendly</Button>
              <Button variant="outline" size="sm" onClick={() => setPersona(personaTemplates.professional)}>Professional</Button>
              <Button variant="outline" size="sm" onClick={() => setPersona(personaTemplates.witty)}>Witty</Button>
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
            <TabsContent value="qa" className="mt-6 space-y-4">
              <div className="space-y-4">
                {qaPairs.map((pair, index) => (
                  <div key={pair.id} className="grid gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={`question-${pair.id}`}>Question</Label>
                        {index > 0 && (
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setQaPairs(qaPairs.filter((_, i) => i !== index))}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <Input 
                        id={`question-${pair.id}`}
                        placeholder="Type question..."
                        value={pair.question}
                        onChange={(e) => {
                          const newPairs = [...qaPairs];
                          newPairs[index].question = e.target.value;
                          setQaPairs(newPairs);
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`answer-${pair.id}`}>Answer</Label>
                      <Textarea 
                        id={`answer-${pair.id}`}
                        placeholder="Type answer..."
                        className="min-h-[100px] resize-none"
                        value={pair.answer}
                        onChange={(e) => {
                          const newPairs = [...qaPairs];
                          newPairs[index].answer = e.target.value;
                          setQaPairs(newPairs);
                        }}
                      />
                    </div>
                  </div>
                ))}
                <div className="flex justify-center">
                  <Button 
                    size="icon" 
                    variant="outline"
                    onClick={() => setQaPairs([...qaPairs, { id: Date.now().toString(), question: '', answer: '' }])}
                  >
                    +
                  </Button>
                </div>
                <div className="flex justify-end">
                  <Button>Save</Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="website" className="mt-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="website-url">Website URL</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="website-url"
                      placeholder="https://example.com"
                      type="url"
                    />
                    <Button className="shrink-0">
                      <Globe className="mr-2 h-4 w-4" />
                      Import
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    The bot will crawl and learn from the content on this website
                  </p>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h4 className="text-sm font-medium mb-4">Imported Websites (0)</h4>
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No websites imported yet
                </div>
              </div>
            </TabsContent>
            <TabsContent value="files" className="mt-6 space-y-6">
              <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h4 className="text-sm font-medium mb-2">Upload Files</h4>
                <p className="text-xs text-muted-foreground mb-4">
                  Drag and drop files here, or click to browse
                </p>
                <Button variant="outline" size="sm">
                  Choose Files
                </Button>
                <p className="text-xs text-muted-foreground mt-4">
                  Supported: PDF, DOC, DOCX, TXT (Max 10MB)
                </p>
              </div>
              
              <div className="border-t pt-6">
                <h4 className="text-sm font-medium mb-4">Uploaded Files (0)</h4>
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No files uploaded yet
                </div>
              </div>
            </TabsContent>
            <TabsContent value="trained" className="mt-6 space-y-4">
              <div className="grid gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <CardTitle className="text-sm font-medium">Text Knowledge</CardTitle>
                      </div>
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">0 entries</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <CardTitle className="text-sm font-medium">Q&A Pairs</CardTitle>
                      </div>
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">0 pairs</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <CardTitle className="text-sm font-medium">Website Content</CardTitle>
                      </div>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">0 websites</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Upload className="h-4 w-4 text-muted-foreground" />
                        <CardTitle className="text-sm font-medium">Uploaded Files</CardTitle>
                      </div>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">0 files</p>
                  </CardContent>
                </Card>
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
        <div className="space-y-4">
          <Textarea
            placeholder="Type here..."
            className="min-h-[120px] resize-none"
          />
          <div className="flex justify-end">
            <Button>Save</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingTab;
