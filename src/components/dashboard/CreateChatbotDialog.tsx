import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Trash2, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

interface CreateChatbotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const steps = [
  { number: 1, label: "Basics" },
  { number: 2, label: "Knowledge" },
  { number: 3, label: "Persona" },
  { number: 4, label: "Rules" },
  { number: 5, label: "Preview" },
];

const colorOptions = [
  "#FF9800",
  "#9C27B0",
  "#2196F3",
  "#03A9F4",
  "#E91E63",
  "#009688",
];

export const CreateChatbotDialog = ({ open, onOpenChange }: CreateChatbotDialogProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [chatbotName, setChatbotName] = useState("");
  const [chatbotImage, setChatbotImage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [customColor, setCustomColor] = useState("#FF9800");
  const [knowledge, setKnowledge] = useState("");
  const [qaPairs, setQaPairs] = useState<{id: string; question: string; answer: string;}[]>([{ id: '1', question: '', answer: '' }]);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [persona, setPersona] = useState("");
  const [rules, setRules] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleNext = async () => {
    if (currentStep === 1 && !chatbotName.trim()) {
      toast({
        title: "Chatbot Name Required",
        description: "Please enter a name for your chatbot",
        variant: "destructive",
      });
      return;
    }
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      await handleCreateBot();
    }
  };

  const handleCreateBot = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a chatbot",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);

    try {
      // Generate a slug from the chatbot name
      const slug = chatbotName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      const { data, error } = await supabase
        .from('chatbots')
        .insert({
          user_id: user.id,
          name: chatbotName,
          slug,
          avatar_url: chatbotImage,
          primary_color: selectedColor,
          persona: persona || null,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Chatbot Created",
        description: "Your chatbot has been created successfully",
      });

      onOpenChange(false);
      resetForm();
      navigate(`/dashboard/bot/${slug}`);
    } catch (error: any) {
      console.error('Error creating chatbot:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create chatbot",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setChatbotName("");
    setChatbotImage(null);
    setSelectedColor(colorOptions[0]);
    setCustomColor("#FF9800");
    setKnowledge("");
    setQaPairs([{ id: '1', question: '', answer: '' }]);
    setWebsiteUrl("");
    setUploadedFiles([]);
    setPersona("");
    setRules("");
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setChatbotImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setCustomColor(color);
  };

  const getInitial = () => {
    return chatbotName.trim().charAt(0).toUpperCase() || "B";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-0 gap-0">
        {/* Step indicator at top */}
        <div className="px-8 pt-6 pb-4">
          <div className="flex items-center justify-center gap-2">
            {steps.map((step, index) => (
              <>
                <div key={step.number} className="flex flex-col items-center gap-1.5">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors",
                      currentStep === step.number
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                    )}
                  >
                    {step.number}
                  </div>
                  <span className={cn(
                    "text-xs font-medium transition-colors",
                    currentStep === step.number
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}>
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-8 h-px bg-border mb-5" />
                )}
              </>
            ))}
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 1 && (
          <div className="px-8 py-6 space-y-6">
            <h2 className="text-xl font-semibold">Basics</h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="chatbot-name" className="text-sm font-medium">
                  Chatbot Name <span className="text-muted-foreground text-xs">(required)</span>
                </Label>
                <Input
                  id="chatbot-name"
                  placeholder="e.g., Customer Support Bot"
                  value={chatbotName}
                  onChange={(e) => setChatbotName(e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Logo <span className="text-muted-foreground text-xs">(optional)</span>
                </Label>
                  <div className="flex items-center gap-4">
                    <div
                      className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white relative overflow-hidden shadow-sm"
                      style={{ backgroundColor: selectedColor }}
                    >
                      {chatbotImage ? (
                        <img src={chatbotImage} alt="Chatbot" className="w-full h-full object-cover" />
                      ) : (
                        getInitial()
                      )}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <Button 
                        variant="outline" 
                        className="gap-2"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="w-4 h-4" />
                        Upload Image
                      </Button>
                      {chatbotImage && (
                        <Button
                          variant="outline"
                          onClick={() => setChatbotImage(null)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Color</Label>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex gap-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color}
                          onClick={() => handleColorSelect(color)}
                          className={cn(
                            "w-8 h-8 rounded-full border-2 transition-all hover:scale-110",
                            selectedColor === color 
                              ? "border-foreground" 
                              : "border-transparent hover:border-foreground/30"
                          )}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Button variant="outline">Custom</Button>
                        <input
                          aria-label="Pick custom color"
                          type="color"
                          value={customColor}
                          onChange={(e) => handleColorSelect(e.target.value)}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>
                      <Input
                        type="text"
                        placeholder="#FF9800"
                        value={selectedColor}
                        onChange={(e) => handleColorSelect(e.target.value)}
                        className="w-28 h-11"
                      />
                      <div
                        className="w-8 h-8 rounded-full border-2 border-border"
                        style={{ backgroundColor: selectedColor }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
        )}

        {currentStep === 2 && (
          <div className="px-8 py-6 space-y-6">
            <h2 className="text-xl font-semibold">Knowledge</h2>
            <Tabs defaultValue="text" className="w-full">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="text">Text</TabsTrigger>
                <TabsTrigger value="qa">Q&A</TabsTrigger>
                <TabsTrigger value="website">Website</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
              </TabsList>
              <TabsContent value="text" className="mt-6 space-y-4">
                <Textarea
                  placeholder="Type here..."
                  className="min-h-[200px] resize-none"
                  value={knowledge}
                  onChange={(e) => setKnowledge(e.target.value)}
                />
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
                </div>
              </TabsContent>
              <TabsContent value="website" className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="website-url">Website URL</Label>
                  <Input 
                    id="website-url"
                    placeholder="https://site1.com, https://site2.com"
                    type="text"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    You can enter multiple URLs separated by commas.
                  </p>
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
              </TabsContent>
            </Tabs>
          </div>
        )}

        {currentStep === 3 && (
          <div className="px-8 py-6 space-y-6">
            <h2 className="text-xl font-semibold">Persona</h2>
            <div className="space-y-2">
              <Label htmlFor="persona" className="text-sm font-medium">Chatbot Personality</Label>
              <Textarea
                id="persona"
                placeholder="Describe your chatbot's tone and style. Should it be formal, friendly, professional, or casual?..."
                value={persona}
                onChange={(e) => setPersona(e.target.value)}
                className="min-h-[200px] resize-none"
              />
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="px-8 py-6 space-y-6">
            <h2 className="text-xl font-semibold">Rules</h2>
            <div className="space-y-2">
              <Label htmlFor="rules" className="text-sm font-medium">Conversation Rules</Label>
              <Textarea
                id="rules"
                placeholder="Define rules and guidelines. What topics should it avoid? What format should responses follow?..."
                value={rules}
                onChange={(e) => setRules(e.target.value)}
                className="min-h-[200px] resize-none"
              />
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="px-8 py-6 space-y-6">
            <h2 className="text-xl font-semibold">Preview</h2>

            <div className="border rounded-lg p-6 bg-secondary/10">
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white overflow-hidden shadow-sm"
                      style={{ backgroundColor: selectedColor }}
                    >
                      {chatbotImage ? (
                        <img src={chatbotImage} alt="Chatbot" className="w-full h-full object-cover" />
                      ) : (
                        getInitial()
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{chatbotName || "Untitled Bot"}</h3>
                      <p className="text-sm text-muted-foreground">Ready to deploy</p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    {knowledge && (
                      <div>
                        <p className="text-sm font-semibold mb-1">Knowledge</p>
                        <p className="text-sm text-muted-foreground line-clamp-3">{knowledge}</p>
                      </div>
                    )}
                    {persona && (
                      <div>
                        <p className="text-sm font-semibold mb-1">Persona</p>
                        <p className="text-sm text-muted-foreground line-clamp-3">{persona}</p>
                      </div>
                    )}
                    {rules && (
                      <div>
                        <p className="text-sm font-semibold mb-1">Rules</p>
                        <p className="text-sm text-muted-foreground line-clamp-3">{rules}</p>
                      </div>
                    )}
                    {!knowledge && !persona && !rules && (
                      <p className="text-sm text-muted-foreground italic">
                        No additional configuration added yet
                      </p>
                    )}
                  </div>
                </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="px-8 py-4 border-t bg-muted/30">
          <div className="flex gap-3 justify-end">
            {currentStep > 1 && (
              <Button 
                variant="outline" 
                className="h-11" 
                onClick={handleBack}
              >
                Back
              </Button>
            )}
            <Button 
              className="h-11" 
              onClick={handleNext}
              disabled={isCreating}
            >
              {currentStep === 5 ? (isCreating ? "Creating..." : "Create Bot") : "Next"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
