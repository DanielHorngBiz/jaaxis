import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Upload, Trash2, Plus, MoreHorizontal } from "lucide-react";

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
              <Input id="bot-name" defaultValue="Jaaxis" className="flex-1" />
              <Button variant="ghost" size="icon" className="shrink-0">
                <Pencil className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="flex justify-end">
            <Button>Save</Button>
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
              <div className="w-24 h-24 rounded-full bg-foreground flex items-center justify-center shadow-sm">
                <img src="/placeholder.svg" alt="Logo" className="w-14 h-14" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Image
                </Button>
                <Button variant="outline">
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
                    className="w-10 h-10 rounded-full border-2 border-transparent hover:border-foreground/30 transition-all hover:scale-110"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <Button variant="outline">
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
                  className="w-10 h-10 rounded-full border"
                  style={{ backgroundColor: "#9b835a" }}
                />
              </div>
            </div>
          </div>

          {/* Alignment */}
          <div>
            <Label className="mb-4 block">Chat Position</Label>
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
            <Label className="mb-4 block">Mobile Display</Label>
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

          <div className="flex justify-end pt-4">
            <Button>Save</Button>
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
        <Button variant="destructive" className="gap-2">
          <Trash2 className="w-4 h-4" />
          Delete the Bot
        </Button>
      </div>
    </div>
  );
};

export default SettingsTab;
