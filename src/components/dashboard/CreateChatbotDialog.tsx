import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  const [chatPosition, setChatPosition] = useState<"left" | "right">("right");
  const [mobileDisplay, setMobileDisplay] = useState<"show" | "hide">("show");
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
    setChatPosition("right");
    setMobileDisplay("show");
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        {/* Step Indicators */}
        <div className="px-8 pt-8 pb-6 border-b bg-background">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all",
                      currentStep === step.number
                        ? "bg-foreground text-background scale-110"
                        : currentStep > step.number
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {step.number}
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium transition-colors",
                      currentStep === step.number
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "h-px flex-1 mx-2 transition-colors",
                      currentStep > step.number ? "bg-primary/30" : "bg-border"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto px-8 py-8" style={{ maxHeight: "calc(90vh - 200px)" }}>
          {currentStep === 1 && (
            <div className="space-y-8 max-w-2xl mx-auto">
              <div>
                <h2 className="text-xl font-bold mb-1">Step 1: Basics</h2>
                <p className="text-sm text-muted-foreground">Set up your chatbot's basic information</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="chatbot-name">
                    Chatbot Name <span className="text-muted-foreground text-xs">(required)</span>
                  </Label>
                  <Input
                    id="chatbot-name"
                    placeholder="e.g., Customer Support Bot"
                    value={chatbotName}
                    onChange={(e) => setChatbotName(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Give your bot a clear, descriptive name.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>
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
                  <p className="text-xs text-muted-foreground">
                    Don't worry if you don't have a logo yet — we'll use the first letter of the name.
                  </p>
                </div>

                <div className="space-y-3">
                  <Label>Color</Label>
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
                        className="w-28"
                      />
                      <div
                        className="w-8 h-8 rounded-full border-2 border-border"
                        style={{ backgroundColor: selectedColor }}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Chat Position</Label>
                  <RadioGroup 
                    value={chatPosition} 
                    onValueChange={(value) => setChatPosition(value as "left" | "right")}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="left" id="pos-left" />
                      <Label htmlFor="pos-left" className="cursor-pointer font-normal">Left</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="right" id="pos-right" />
                      <Label htmlFor="pos-right" className="cursor-pointer font-normal">Right</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Mobile Display</Label>
                  <RadioGroup 
                    value={mobileDisplay}
                    onValueChange={(value) => setMobileDisplay(value as "show" | "hide")}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="show" id="mobile-show" />
                      <Label htmlFor="mobile-show" className="cursor-pointer font-normal">Show</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="hide" id="mobile-hide" />
                      <Label htmlFor="mobile-hide" className="cursor-pointer font-normal">Hide</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-8 max-w-2xl mx-auto">
              <div>
                <h2 className="text-xl font-bold mb-1">Step 2: Knowledge</h2>
                <p className="text-sm text-muted-foreground">Add information your chatbot should know about</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="knowledge">Knowledge Base</Label>
                <Textarea
                  id="knowledge"
                  placeholder="Provide background information, FAQs, or documentation that will help your chatbot respond accurately..."
                  value={knowledge}
                  onChange={(e) => setKnowledge(e.target.value)}
                  className="min-h-[300px] resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  The more context you provide, the better your chatbot will perform.
                </p>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-8 max-w-2xl mx-auto">
              <div>
                <h2 className="text-xl font-bold mb-1">Step 3: Persona</h2>
                <p className="text-sm text-muted-foreground">Define how your chatbot should behave and communicate</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="persona">Chatbot Personality</Label>
                <Textarea
                  id="persona"
                  placeholder="Describe your chatbot's tone and style. Should it be formal, friendly, professional, or casual?..."
                  value={persona}
                  onChange={(e) => setPersona(e.target.value)}
                  className="min-h-[300px] resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Example: "Be friendly and helpful, use simple language, and always stay professional."
                </p>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-8 max-w-2xl mx-auto">
              <div>
                <h2 className="text-xl font-bold mb-1">Step 4: Rules</h2>
                <p className="text-sm text-muted-foreground">Set boundaries and guidelines for conversations</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rules">Conversation Rules</Label>
                <Textarea
                  id="rules"
                  placeholder="Define rules and guidelines. What topics should it avoid? What format should responses follow?..."
                  value={rules}
                  onChange={(e) => setRules(e.target.value)}
                  className="min-h-[300px] resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Example: "Never discuss politics or religion. Keep responses under 100 words."
                </p>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-8 max-w-2xl mx-auto">
              <div>
                <h2 className="text-xl font-bold mb-1">Step 5: Preview</h2>
                <p className="text-sm text-muted-foreground">Review your chatbot configuration</p>
              </div>

              <div className="space-y-6">
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
                      <p className="text-sm text-muted-foreground">
                        {chatPosition.charAt(0).toUpperCase() + chatPosition.slice(1)} • {mobileDisplay === "show" ? "Visible" : "Hidden"} on mobile
                      </p>
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
            </div>
          )}
        </div>

        {/* Navigation Footer */}
        <div className="flex items-center justify-between px-8 py-4 border-t bg-background">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            Back
          </Button>
          <div className="text-xs text-muted-foreground">
            Step {currentStep} of {steps.length}
          </div>
          <Button onClick={handleNext} className="min-w-[100px]">
            {currentStep === 5 ? "Create Bot" : "Next"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
