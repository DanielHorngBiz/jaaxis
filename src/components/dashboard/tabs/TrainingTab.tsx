import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, Trash2, Globe, FileText, CheckCircle2, Clock, RefreshCw, ChevronDown } from "lucide-react";
import { useState, useRef } from "react";

interface QAPair {
  id: string;
  question: string;
  answer: string;
}

interface TrainedItem {
  id: string;
  name: string;
  type: 'text' | 'qa' | 'website' | 'file';
  lastUpdated: string;
}

const TrainingTab = () => {
  const [persona, setPersona] = useState("");
  const [qaPairs, setQaPairs] = useState<QAPair[]>([{ id: '1', question: '', answer: '' }]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [trainedItems, setTrainedItems] = useState<TrainedItem[]>([
    { id: '1', name: 'plain_text_knowledge(3).txt', type: 'text', lastUpdated: '2 days ago' },
    { id: '2', name: 'flexpresets.com.txt', type: 'website', lastUpdated: '1 week ago' },
    { id: '3', name: 'plain_text_knowledge(2).txt', type: 'text', lastUpdated: '2 weeks ago' },
    { id: '4', name: 'plain_qna_knowledge.txt', type: 'qa', lastUpdated: '2 weeks ago' },
    { id: '5', name: 'plain_text_knowledge(1).txt', type: 'text', lastUpdated: '2 weeks ago' },
    { id: '6', name: 'plain_text_knowledge.txt', type: 'text', lastUpdated: '3 weeks ago' },
  ]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const personaTemplates = {
    friendly: "You are a friendly and approachable assistant. Use a warm, conversational tone. Be empathetic and personable in your responses. Use casual language while maintaining professionalism.",
    professional: "You are a professional business assistant. Maintain a formal and courteous tone. Provide clear, concise responses. Focus on efficiency and accuracy in all communications.",
    witty: "You are a clever and witty assistant with a good sense of humor. Use playful language and occasional humor to engage users. Keep responses entertaining while remaining helpful and informative."
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).filter(file => {
      const validTypes = ['.txt', '.pdf', '.csv', '.docx'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      return validTypes.includes(fileExtension) && file.size <= 200 * 1024 * 1024;
    });
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleFileUpload(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(filteredTrainedItems.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, id]);
    } else {
      setSelectedItems(prev => prev.filter(itemId => itemId !== id));
    }
  };

  const handleDeleteSelected = () => {
    setTrainedItems(prev => prev.filter(item => !selectedItems.includes(item.id)));
    setSelectedItems([]);
  };

  const handleDeleteItem = (id: string) => {
    setTrainedItems(prev => prev.filter(item => item.id !== id));
    setSelectedItems(prev => prev.filter(itemId => itemId !== id));
  };

  const handleRefresh = () => {
    // Refresh logic here
    console.log('Refreshing trained items...');
  };

  const filteredTrainedItems = trainedItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                            <Trash2 className="h-4 w-4 text-destructive" />
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
            <TabsContent value="website" className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="website-url">Website URL</Label>
                <Input 
                  id="website-url"
                  placeholder="https://site1.com, https://site2.com"
                  type="text"
                />
                <p className="text-xs text-muted-foreground">
                  You can enter multiple URLs separated by commas.
                </p>
              </div>
              <div className="flex justify-end">
                <Button>
                  Scrape & Ingest
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="files" className="mt-6 space-y-6">
              <div 
                className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-12 h-12 mx-auto mb-3 bg-blue-100/50 rounded-xl flex items-center justify-center">
                  <Upload className="h-6 w-6 text-blue-500" />
                </div>
                <h4 className="text-lg font-semibold text-blue-500 mb-2">Drag And Drop</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  TXT, PDF, CSV, DOCX (max: 200MB each)
                </p>
                <Button variant="outline" type="button" onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}>
                  Browse files
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  multiple
                  accept=".txt,.pdf,.csv,.docx"
                  onChange={(e) => handleFileUpload(e.target.files)}
                />
              </div>
              
              <div className="border-t pt-6">
                <h4 className="text-sm font-medium mb-4">Uploaded Files ({uploadedFiles.length})</h4>
                {uploadedFiles.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No files uploaded yet
                  </div>
                ) : (
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{file.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeFile(index)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button>Save</Button>
              </div>
            </TabsContent>
            <TabsContent value="trained" className="mt-6 space-y-4">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Input
                    placeholder="Search by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={handleRefresh}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteSelected}
                    disabled={selectedItems.length === 0}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete selected ({selectedItems.length})
                  </Button>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted/50 border-b">
                    <div className="grid grid-cols-[40px_1fr_200px_100px] gap-4 p-3 font-medium text-sm">
                      <Checkbox
                        checked={filteredTrainedItems.length > 0 && selectedItems.length === filteredTrainedItems.length}
                        onCheckedChange={handleSelectAll}
                      />
                      <div>Name</div>
                      <div>Last Updated</div>
                      <div>Action</div>
                    </div>
                  </div>
                  
                  <div className="divide-y">
                    {filteredTrainedItems.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground text-sm">
                        No trained items found
                      </div>
                    ) : (
                      filteredTrainedItems.map((item) => (
                        <div key={item.id} className="grid grid-cols-[40px_1fr_200px_100px] gap-4 p-3 items-center hover:bg-muted/30 transition-colors">
                          <Checkbox
                            checked={selectedItems.includes(item.id)}
                            onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                          />
                          <div className="text-sm text-foreground">
                            {item.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {item.lastUpdated}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon">
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDeleteItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
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
