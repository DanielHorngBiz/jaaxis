import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

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
  const [persona, setPersona] = useState("");
  const [rules, setRules] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
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
      toast({
        title: "Chatbot Created",
        description: "Your chatbot has been created successfully",
      });
      onOpenChange(false);
      resetForm();
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
    setPersona("");
    setRules("");
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
      <DialogContent className="sm:max-w-[540px] p-0 gap-0">
        {/* Step indicator at top */}
        <div className="px-8 pt-6 pb-4">
          <div className="flex items-center justify-center gap-2">
            {steps.map((step, index) => (
              <>
                <div
                  key={step.number}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors",
                    currentStep === step.number
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  )}
                >
                  {step.number}
                </div>
                {index < steps.length - 1 && (
                  <div className="w-12 h-px bg-border" />
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
                  Chatbot Image <span className="text-muted-foreground text-xs">(optional)</span>
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
            <div className="space-y-2">
              <Label htmlFor="knowledge" className="text-sm font-medium">Knowledge Base</Label>
              <Textarea
                id="knowledge"
                placeholder="Provide background information, FAQs, or documentation that will help your chatbot respond accurately..."
                value={knowledge}
                onChange={(e) => setKnowledge(e.target.value)}
                className="min-h-[200px] resize-none"
              />
            </div>
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
            >
              {currentStep === 5 ? "Create Bot" : "Next"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
