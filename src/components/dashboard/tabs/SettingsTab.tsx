import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Upload, Trash2, Plus, MoreHorizontal } from "lucide-react";
import { useBotConfig } from "@/contexts/BotConfigContext";
import { useToast } from "@/hooks/use-toast";
import { useState, useRef } from "react";

const colors = [
  "#FF9800",
  "#9C27B0",
  "#2196F3",
  "#03A9F4",
  "#E91E63",
  "#009688",
];

const SettingsTab = () => {
  const { config, updateConfig } = useBotConfig();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedColor, setSelectedColor] = useState(config.primaryColor);
  const [customColor, setCustomColor] = useState(config.primaryColor);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        updateConfig({ brandLogo: imageUrl });
        toast({ title: "Brand logo updated successfully" });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveBotName = () => {
    toast({ title: "Bot name saved successfully" });
  };

  const handleSaveAppearance = () => {
    updateConfig({ primaryColor: selectedColor });
    toast({ title: "Appearance settings saved successfully" });
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setCustomColor(color);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      {/* General Section */}
      <div className="pb-8 border-b">
        <h3 className="text-lg font-semibold mb-2">General</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Basic bot configuration and settings
        </p>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="bot-name">Bot Name</Label>
            <div className="flex items-center gap-3">
              <Input 
                id="bot-name" 
                value={config.botName}
                onChange={(e) => updateConfig({ botName: e.target.value })}
                className="flex-1" 
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSaveBotName}>Save</Button>
          </div>
        </div>
      </div>

      {/* Appearance Section */}
      <div className="pb-8 border-b">
        <h3 className="text-lg font-semibold mb-2">Appearance</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Customize how your bot looks and appears to users
        </p>
        <div className="space-y-8">
          {/* Brand Logo */}
          <div>
            <Label className="mb-4 block">Brand Logo</Label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-full overflow-hidden shadow-sm">
                <img src={config.brandLogo} alt="Brand Logo" className="w-full h-full object-cover" />
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
                <Button 
                  variant="outline"
                  onClick={() => {
                    updateConfig({ brandLogo: "/src/assets/jaaxis-avatar.jpg" });
                    toast({ title: "Brand logo reset to default" });
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Color Picker */}
          <div>
            <Label className="mb-4 block">Primary Color</Label>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorSelect(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                      selectedColor === color ? 'border-foreground' : 'border-transparent hover:border-foreground/30'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="color"
                  value={customColor}
                  onChange={(e) => {
                    setCustomColor(e.target.value);
                    handleColorSelect(e.target.value);
                  }}
                  className="w-12 h-8 p-0 border-0 cursor-pointer"
                />
                <Input
                  type="text"
                  value={selectedColor}
                  onChange={(e) => handleColorSelect(e.target.value)}
                  className="w-28"
                />
                <div
                  className="w-8 h-8 rounded-full border"
                  style={{ backgroundColor: selectedColor }}
                />
              </div>
            </div>
          </div>

          {/* Alignment */}
          <div>
            <Label className="mb-4 block">Chat Position</Label>
            <RadioGroup 
              value={config.chatPosition} 
              onValueChange={(value) => updateConfig({ chatPosition: value as "left" | "right" })}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="left" id="left" />
                <Label htmlFor="left" className="cursor-pointer font-normal">Left</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="right" id="right" />
                <Label htmlFor="right" className="cursor-pointer font-normal">Right</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Show on Mobile */}
          <div>
            <Label className="mb-4 block">Mobile Display</Label>
            <RadioGroup 
              value={config.mobileDisplay}
              onValueChange={(value) => updateConfig({ mobileDisplay: value as "show" | "hide" })}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="show" id="show" />
                <Label htmlFor="show" className="cursor-pointer font-normal">Show</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hide" id="hide" />
                <Label htmlFor="hide" className="cursor-pointer font-normal">Hide</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={handleSaveAppearance}>Save</Button>
          </div>
        </div>
      </div>

      {/* Blocklist Section */}
      <div className="pb-8 border-b">
        <h3 className="text-lg font-semibold mb-2">Blocklist</h3>
        <p className="text-sm text-muted-foreground mb-6">
          The bot won't respond if the message contains these words (separated by comma)
        </p>
        <div className="space-y-6">
          <Textarea
            placeholder="社群導則, meta, 撒反政黨, 您的其他, whatsapp, 智慧財產"
            className="min-h-[100px]"
          />
          <div className="flex justify-end">
            <Button>Save</Button>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="pb-8 border-b">
        <h3 className="text-lg font-semibold mb-6">Team</h3>
        <div className="space-y-6">
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">metal666grin@gmail.com</TableCell>
                  <TableCell>Owner</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">contact@flexpresets.com</TableCell>
                  <TableCell>support</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil className="w-4 h-4 text-primary" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">metal66grin@gmail.com</TableCell>
                  <TableCell>admin</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil className="w-4 h-4 text-primary" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-center">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Member
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Bot Section */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Delete Bot</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Delete this bot and all data. The action is not reversible
        </p>
        <Button variant="outline" className="gap-2 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">
          <Trash2 className="w-4 h-4" />
          Delete the Bot
        </Button>
      </div>
    </div>
  );
};

export default SettingsTab;
