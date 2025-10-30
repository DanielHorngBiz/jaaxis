import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

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
  "#F99D1D",
  "#6366F1",
  "#3B82F6",
  "#0EA5E9",
  "#EC4899",
  "#14B8A6",
];

export const CreateChatbotDialog = ({ open, onOpenChange }: CreateChatbotDialogProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [chatbotName, setChatbotName] = useState("");
  const [chatbotImage, setChatbotImage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [customColor, setCustomColor] = useState("#F99D1D");
  const [knowledge, setKnowledge] = useState("");
  const [persona, setPersona] = useState("");
  const [rules, setRules] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleNext = () => {
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
      // Create chatbot logic here
      toast({
        title: "Chatbot Created",
        description: "Your chatbot has been created successfully",
      });
      onOpenChange(false);
      // Reset form
      setCurrentStep(1);
      setChatbotName("");
      setChatbotImage(null);
      setKnowledge("");
      setPersona("");
      setRules("");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
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

  const getInitial = () => {
    return chatbotName.trim().charAt(0).toUpperCase() || "F";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Create Chatbot</DialogTitle>
        </DialogHeader>

        {/* Step Indicators */}
        <div className="flex items-center justify-between mb-8 px-4">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-2 flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    currentStep === step.number
                      ? "bg-foreground text-background"
                      : currentStep > step.number
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step.number}
                </div>
                <span
                  className={`text-sm font-medium ${
                    currentStep === step.number
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-px flex-1 mx-2 mt-[-24px] transition-colors ${
                    currentStep > step.number ? "bg-primary/20" : "bg-border"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="px-8 py-6 min-h-[400px]">
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Step 1: Basics</h2>

              <div className="space-y-2">
                <Label htmlFor="chatbot-name">
                  Chatbot Name <span className="text-muted-foreground text-sm">(required)</span>
                </Label>
                <Input
                  id="chatbot-name"
                  placeholder="e.g., Customer Support Bot"
                  value={chatbotName}
                  onChange={(e) => setChatbotName(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Give your bot a clear, descriptive name.
                </p>
              </div>

              <div className="space-y-2">
                <Label>
                  Chatbot Image <span className="text-muted-foreground text-sm">(optional)</span>
                </Label>
                <div className="flex items-center gap-4">
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white relative overflow-hidden"
                    style={{ backgroundColor: selectedColor === "custom" ? customColor : selectedColor }}
                  >
                    {chatbotImage ? (
                      <img src={chatbotImage} alt="Chatbot" className="w-full h-full object-cover" />
                    ) : (
                      getInitial()
                    )}
                    <label
                      htmlFor="image-upload"
                      className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Upload className="w-6 h-6 text-white" />
                    </label>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <label htmlFor="image-upload" className="cursor-pointer">
                        Upload Image
                      </label>
                    </Button>
                    {chatbotImage && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setChatbotImage(null)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Don't worry if you don't have a logo yet — we'll use the first letter of the name.
                </p>
              </div>

              <div className="space-y-3">
                <Label>Color</Label>
                <div className="flex gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      className={`w-10 h-10 rounded-full transition-all ${
                        selectedColor === color
                          ? "ring-2 ring-offset-2 ring-primary"
                          : "hover:scale-110"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <Label htmlFor="custom-color" className="shrink-0">Custom</Label>
                  <Input
                    id="custom-color"
                    type="text"
                    placeholder="#F99D1D"
                    value={customColor}
                    onChange={(e) => {
                      setCustomColor(e.target.value);
                      setSelectedColor("custom");
                    }}
                    className="max-w-[150px]"
                  />
                  <button
                    className={`w-10 h-10 rounded-full transition-all ${
                      selectedColor === "custom"
                        ? "ring-2 ring-offset-2 ring-primary"
                        : "hover:scale-110"
                    }`}
                    style={{ backgroundColor: customColor }}
                    onClick={() => setSelectedColor("custom")}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Step 2: Knowledge</h2>
              <div className="space-y-2">
                <Label htmlFor="knowledge">Knowledge Base</Label>
                <Textarea
                  id="knowledge"
                  placeholder="Add information your chatbot should know about..."
                  value={knowledge}
                  onChange={(e) => setKnowledge(e.target.value)}
                  className="min-h-[300px]"
                />
                <p className="text-sm text-muted-foreground">
                  Provide background information, FAQs, or documentation that will help your chatbot respond accurately.
                </p>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Step 3: Persona</h2>
              <div className="space-y-2">
                <Label htmlFor="persona">Chatbot Personality</Label>
                <Textarea
                  id="persona"
                  placeholder="Describe how your chatbot should behave and communicate..."
                  value={persona}
                  onChange={(e) => setPersona(e.target.value)}
                  className="min-h-[300px]"
                />
                <p className="text-sm text-muted-foreground">
                  Define your chatbot's tone, style, and personality. Should it be formal, friendly, professional, or casual?
                </p>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Step 4: Rules</h2>
              <div className="space-y-2">
                <Label htmlFor="rules">Conversation Rules</Label>
                <Textarea
                  id="rules"
                  placeholder="Define rules and guidelines for your chatbot..."
                  value={rules}
                  onChange={(e) => setRules(e.target.value)}
                  className="min-h-[300px]"
                />
                <p className="text-sm text-muted-foreground">
                  Set boundaries and guidelines. What topics should it avoid? What format should responses follow?
                </p>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Step 5: Preview</h2>
              <div className="border rounded-lg p-6 bg-secondary/20">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white overflow-hidden"
                      style={{ backgroundColor: selectedColor === "custom" ? customColor : selectedColor }}
                    >
                      {chatbotImage ? (
                        <img src={chatbotImage} alt="Chatbot" className="w-full h-full object-cover" />
                      ) : (
                        getInitial()
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{chatbotName || "Untitled Bot"}</h3>
                      <p className="text-sm text-muted-foreground">Ready to deploy</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 pt-4">
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground">Knowledge</p>
                      <p className="text-sm mt-1">{knowledge || "No knowledge base added"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground">Persona</p>
                      <p className="text-sm mt-1">{persona || "No persona defined"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground">Rules</p>
                      <p className="text-sm mt-1">{rules || "No rules specified"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between px-8 py-4 border-t">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            Back
          </Button>
          <Button onClick={handleNext} className="min-w-[100px]">
            {currentStep === 5 ? "Create" : "Next"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
