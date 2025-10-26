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
    <div className="p-8 max-w-4xl">
      <h2 className="text-3xl font-bold mb-8">Settings</h2>

      {/* General Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="bot-name" className="text-sm font-medium mb-2 block">
              Bot Name
            </Label>
            <div className="flex items-center gap-2">
              <Input id="bot-name" defaultValue="Jaaxis" className="flex-1" />
              <Button variant="ghost" size="icon">
                <Pencil className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="flex justify-end">
            <Button size="sm">Save</Button>
          </div>
        </CardContent>
      </Card>

      {/* Appearance Section */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Brand Logo */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Brand Logo :</Label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-foreground flex items-center justify-center">
                <img src="/placeholder.svg" alt="Logo" className="w-12 h-12" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Images
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Color Picker */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Color :</Label>
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    className="w-8 h-8 rounded-full border-2 border-transparent hover:border-foreground transition-colors"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <Button variant="outline" size="sm">
                Custom
              </Button>
              <Input
                type="text"
                defaultValue="#9b835a"
                className="w-24"
                readOnly
              />
              <div
                className="w-8 h-8 rounded-full border"
                style={{ backgroundColor: "#9b835a" }}
              />
            </div>
          </div>

          {/* Alignment */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Alignment :</Label>
            <RadioGroup defaultValue="right" className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="left" id="left" />
                <Label htmlFor="left" className="cursor-pointer">Left</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="right" id="right" />
                <Label htmlFor="right" className="cursor-pointer">Right</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Show on Mobile */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Show on Mobile :</Label>
            <RadioGroup defaultValue="show" className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="show" id="show" />
                <Label htmlFor="show" className="cursor-pointer">Show</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hide" id="hide" />
                <Label htmlFor="hide" className="cursor-pointer">Hide</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex justify-end pt-4">
            <Button size="sm">Save</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsTab;
