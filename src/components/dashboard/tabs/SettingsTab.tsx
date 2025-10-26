import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Pencil, Upload, Trash2 } from "lucide-react";

const colors = [
  "#FF9800",
  "#9C27B0",
  "#2196F3",
  "#03A9F4",
  "#E91E63",
  "#009688",
];

const SettingsTab = () => {
  return (
    <div className="p-8 lg:p-12 max-w-4xl mx-auto animate-fade-in">
      <h2 className="text-3xl font-bold mb-2">Settings</h2>
      <p className="text-muted-foreground mb-8">Customize your chatbot's appearance and behavior</p>

      {/* General Section */}
      <Card className="mb-8 shadow-sm border-border hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-xl">General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="bot-name" className="text-sm font-medium mb-2 block">
              Bot Name
            </Label>
            <div className="flex items-center gap-3">
              <Input id="bot-name" defaultValue="Jaaxis" className="flex-1" />
              <Button variant="ghost" size="icon" className="shrink-0">
                <Pencil className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button size="sm" className="shadow-sm">Save Changes</Button>
          </div>
        </CardContent>
      </Card>

      {/* Appearance Section */}
      <Card className="shadow-sm border-border hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-xl">Appearance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Brand Logo */}
          <div>
            <Label className="text-sm font-medium mb-4 block">Brand Logo</Label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-xl bg-foreground flex items-center justify-center shadow-sm">
                <img src="/placeholder.svg" alt="Logo" className="w-14 h-14" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2 shadow-sm">
                  <Upload className="w-4 h-4" />
                  Upload Image
                </Button>
                <Button variant="outline" size="sm" className="shadow-sm">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Color Picker */}
          <div>
            <Label className="text-sm font-medium mb-4 block">Primary Color</Label>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    className="w-10 h-10 rounded-lg border-2 border-transparent hover:border-foreground/30 transition-all hover:scale-110"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <Button variant="outline" size="sm" className="shadow-sm">
                Custom
              </Button>
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  defaultValue="#9b835a"
                  className="w-28"
                  readOnly
                />
                <div
                  className="w-10 h-10 rounded-lg border shadow-sm"
                  style={{ backgroundColor: "#9b835a" }}
                />
              </div>
            </div>
          </div>

          {/* Alignment */}
          <div>
            <Label className="text-sm font-medium mb-4 block">Chat Position</Label>
            <RadioGroup defaultValue="right" className="flex gap-4">
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
            <Label className="text-sm font-medium mb-4 block">Mobile Display</Label>
            <RadioGroup defaultValue="show" className="flex gap-4">
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

          <div className="flex justify-end pt-4 border-t">
            <Button size="sm" className="shadow-sm">Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsTab;
