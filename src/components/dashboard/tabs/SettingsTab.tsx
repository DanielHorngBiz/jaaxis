import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Upload, Trash2, Plus } from "lucide-react";
import { useBotConfig } from "@/contexts/BotConfigContext";
import { useToast } from "@/hooks/use-toast";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import defaultAvatar from "@/assets/jaaxis-avatar.jpg";
import AddTeamMemberDialog from "@/components/dashboard/AddTeamMemberDialog";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { useNavigate } from "react-router-dom";
const colors = [
  "#FF9800",
  "#9C27B0",
  "#2196F3",
  "#03A9F4",
  "#E91E63",
  "#009688",
];

interface TeamMember {
  id: string;
  email: string;
  role: string;
  created_at: string;
  accepted?: boolean;
}

const SettingsTab = () => {
  const { config, updateConfig, chatbotId } = useBotConfig();
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [botName, setBotName] = useState(config.botName);
  const [brandLogo, setBrandLogo] = useState<string>(config.brandLogo || "");
  const [selectedColor, setSelectedColor] = useState(config.primaryColor);
  const [customColor, setCustomColor] = useState(config.primaryColor);
  const [chatPosition, setChatPosition] = useState(config.chatPosition);
  const [mobileDisplay, setMobileDisplay] = useState(config.mobileDisplay);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);
  const [memberToEdit, setMemberToEdit] = useState<TeamMember | null>(null);
  const [editRole, setEditRole] = useState<string>("");
  const [showDeleteBotDialog, setShowDeleteBotDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Whitelist Domain state
  const [whitelistInput, setWhitelistInput] = useState("");
  const [whitelistedDomains, setWhitelistedDomains] = useState<string[]>([]);
  
  // Block Pages state
  const [blockPagesInput, setBlockPagesInput] = useState("");
  const [blockedPages, setBlockedPages] = useState<string[]>([]);
  
  // Blocklist state
  const [blocklistInput, setBlocklistInput] = useState("");

  useEffect(() => {
    if (chatbotId) {
      fetchTeamMembers();
      fetchBotSettings();
    }
  }, [chatbotId]);

  const fetchTeamMembers = async () => {
    if (!chatbotId) return;

    try {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .eq("chatbot_id", chatbotId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setTeamMembers(data || []);
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };

  const fetchBotSettings = async () => {
    if (!chatbotId) return;

    try {
      const { data, error } = await supabase
        .from("chatbots")
        .select("whitelisted_domains, blocked_pages, blocklist")
        .eq("id", chatbotId)
        .single();

      if (error) throw error;
      
      if (data) {
        setWhitelistedDomains(data.whitelisted_domains || []);
        setBlockedPages(data.blocked_pages || []);
        setBlocklistInput(data.blocklist || "");
      }
    } catch (error) {
      console.error("Error fetching bot settings:", error);
    }
  };

  const handleDeleteMember = async () => {
    if (!memberToDelete) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("team_members")
        .delete()
        .eq("id", memberToDelete.id);

      if (error) throw error;

      toast({
        title: "Team member removed",
        description: `${memberToDelete.email} has been removed from your team`,
      });

      fetchTeamMembers();
      setMemberToDelete(null);
    } catch (error) {
      console.error("Error deleting team member:", error);
      toast({
        title: "Error",
        description: "Failed to remove team member. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteBot = async () => {
    if (!chatbotId) return;

    setIsDeleting(true);
    try {
      // Delete all related data first
      await supabase.from("team_members").delete().eq("chatbot_id", chatbotId);
      await supabase.from("knowledge_sources").delete().eq("chatbot_id", chatbotId);
      
      // Delete the chatbot
      const { error } = await supabase
        .from("chatbots")
        .delete()
        .eq("id", chatbotId);

      if (error) throw error;

      toast({
        title: "Bot deleted",
        description: "Your bot and all associated data have been permanently deleted.",
      });

      // Navigate back to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error deleting bot:", error);
      toast({
        title: "Error",
        description: "Failed to delete bot. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteBotDialog(false);
    }
  };

  const handleEditMember = async () => {
    if (!memberToEdit) return;

    try {
      const { error } = await supabase
        .from("team_members")
        .update({ role: editRole })
        .eq("id", memberToEdit.id);

      if (error) throw error;

      toast({
        title: "Role updated",
        description: `${memberToEdit.email}'s role has been updated to ${editRole}`,
      });

      fetchTeamMembers();
    } catch (error) {
      console.error("Error updating team member:", error);
      toast({
        title: "Error",
        description: "Failed to update role. Please try again.",
        variant: "destructive",
      });
    } finally {
      setMemberToEdit(null);
      setEditRole("");
    }
  };

  const openEditDialog = (member: TeamMember) => {
    setMemberToEdit(member);
    setEditRole(member.role);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setBrandLogo(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveBotName = () => {
    updateConfig({ botName });
    toast({ title: "Bot name saved successfully" });
  };

  const handleSaveAppearance = () => {
    updateConfig({ 
      brandLogo,
      primaryColor: selectedColor,
      chatPosition,
      mobileDisplay
    });
    toast({ title: "Appearance settings saved successfully" });
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setCustomColor(color);
  };

  const handleAddWhitelistDomain = async () => {
    if (!whitelistInput.trim() || !chatbotId) return;
    
    const domains = whitelistInput.split(',').map(d => d.trim()).filter(d => d);
    const updatedDomains = [...whitelistedDomains, ...domains];
    
    try {
      const { error } = await supabase
        .from("chatbots")
        .update({ whitelisted_domains: updatedDomains })
        .eq("id", chatbotId);

      if (error) throw error;

      setWhitelistedDomains(updatedDomains);
      setWhitelistInput("");
      toast({ title: "Domain(s) added to whitelist" });
    } catch (error) {
      console.error("Error adding whitelist domain:", error);
      toast({ title: "Failed to add domain(s)", variant: "destructive" });
    }
  };

  const handleRemoveWhitelistDomain = async (domain: string) => {
    if (!chatbotId) return;

    const updatedDomains = whitelistedDomains.filter(d => d !== domain);
    
    try {
      const { error } = await supabase
        .from("chatbots")
        .update({ whitelisted_domains: updatedDomains })
        .eq("id", chatbotId);

      if (error) throw error;

      setWhitelistedDomains(updatedDomains);
      toast({ title: "Domain removed from whitelist" });
    } catch (error) {
      console.error("Error removing whitelist domain:", error);
      toast({ title: "Failed to remove domain", variant: "destructive" });
    }
  };

  const handleBlockPages = async () => {
    if (!blockPagesInput.trim() || !chatbotId) return;
    
    const pages = blockPagesInput.split(',').map(p => p.trim()).filter(p => p);
    const updatedPages = [...blockedPages, ...pages];
    
    try {
      const { error } = await supabase
        .from("chatbots")
        .update({ blocked_pages: updatedPages })
        .eq("id", chatbotId);

      if (error) throw error;

      setBlockedPages(updatedPages);
      setBlockPagesInput("");
      toast({ title: "Page(s) blocked successfully" });
    } catch (error) {
      console.error("Error blocking pages:", error);
      toast({ title: "Failed to block page(s)", variant: "destructive" });
    }
  };

  const handleUnblockPage = async (url: string) => {
    if (!chatbotId) return;

    const updatedPages = blockedPages.filter(p => p !== url);
    
    try {
      const { error } = await supabase
        .from("chatbots")
        .update({ blocked_pages: updatedPages })
        .eq("id", chatbotId);

      if (error) throw error;

      setBlockedPages(updatedPages);
      toast({ title: "Page unblocked" });
    } catch (error) {
      console.error("Error unblocking page:", error);
      toast({ title: "Failed to unblock page", variant: "destructive" });
    }
  };

  const handleSaveBlocklist = async () => {
    if (!chatbotId) return;

    try {
      const { error } = await supabase
        .from("chatbots")
        .update({ blocklist: blocklistInput })
        .eq("id", chatbotId);

      if (error) throw error;

      toast({ title: "Blocklist saved successfully" });
    } catch (error) {
      console.error("Error saving blocklist:", error);
      toast({ title: "Failed to save blocklist", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-8">
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
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
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
            <Label className="mb-4 block">Logo</Label>
            <div className="flex items-center gap-4">
              {brandLogo && (
                <div className="w-24 h-24 rounded-full overflow-hidden shadow-sm">
                  <img
                    src={brandLogo}
                    alt="Brand Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
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
                {brandLogo && (
                  <Button 
                    variant="ghost"
                    size="icon"
                    onClick={() => setBrandLogo("")}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                )}
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
                  className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 ${
                    selectedColor === color ? 'border-foreground' : 'border-transparent hover:border-foreground/30'
                  }`}
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
                    onChange={(e) => {
                      setCustomColor(e.target.value);
                      handleColorSelect(e.target.value);
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                <Input
                  type="text"
                  value={selectedColor}
                  onChange={(e) => handleColorSelect(e.target.value)}
                  className="w-32"
                />
                <div
                  className="w-6 h-6 rounded-full border"
                  style={{ backgroundColor: selectedColor }}
                />
              </div>
            </div>
          </div>

          {/* Alignment */}
          <div>
            <Label className="mb-4 block">Chat Position</Label>
            <RadioGroup 
              value={chatPosition} 
              onValueChange={(value) => setChatPosition(value as "left" | "right")}
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
              value={mobileDisplay}
              onValueChange={(value) => setMobileDisplay(value as "show" | "hide")}
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

      {/* Whitelist Domain Section */}
      <div className="pb-8 border-b">
        <h3 className="text-lg font-semibold mb-2">Whitelist Domain</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Separate each domain by commas
        </p>
        <div className="space-y-6">
          <Textarea
            placeholder="https://example.com, https://another-site.com"
            className="min-h-[60px] resize-none"
            value={whitelistInput}
            onChange={(e) => setWhitelistInput(e.target.value)}
          />
          <div className="flex justify-end">
            <Button onClick={handleAddWhitelistDomain}>Save</Button>
          </div>
          
          {whitelistedDomains.length > 0 && (
            <div>
              <h4 className="text-base font-semibold mb-4">Whitelisted Domains</h4>
              <div className="space-y-3">
                {whitelistedDomains.map((domain, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{domain}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveWhitelistDomain(domain)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hide On Specific Pages Section */}
      <div className="pb-8 border-b">
        <h3 className="text-lg font-semibold mb-2">Hide On Specific Pages</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Enter full URLs separated by commas. These pages will not show the chatbot.
        </p>
        <div className="space-y-6">
          <Textarea
            placeholder="https://example.com/private, https://example.com/admin"
            className="min-h-[60px] resize-none"
            value={blockPagesInput}
            onChange={(e) => setBlockPagesInput(e.target.value)}
          />
          <div className="flex justify-end">
            <Button onClick={handleBlockPages}>Save</Button>
          </div>
          
          {blockedPages.length > 0 && (
            <div>
              <h4 className="text-base font-semibold mb-4">Hidden Pages</h4>
              <div className="space-y-3">
                {blockedPages.map((url, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{url}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleUnblockPage(url)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
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
            placeholder="Type here..."
            className="min-h-[60px] resize-none"
            value={blocklistInput}
            onChange={(e) => setBlocklistInput(e.target.value)}
          />
          <div className="flex justify-end">
            <Button onClick={handleSaveBlocklist}>Save</Button>
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
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">{user?.email}</TableCell>
                  <TableCell>Owner (You)</TableCell>
                  <TableCell className="text-right"></TableCell>
                </TableRow>
                {teamMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.email}</TableCell>
                    <TableCell className="capitalize">
                      {member.role}
                      {!member.accepted && <span className="text-muted-foreground ml-1">(Pending)</span>}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {member.accepted && (
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => openEditDialog(member)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setMemberToDelete(member)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-center">
            <AddTeamMemberDialog chatbotId={chatbotId || ""} onMemberAdded={fetchTeamMembers} />
          </div>
        </div>
      </div>

      {/* Delete Bot Section */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Delete Bot</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Delete this bot and all data. The action is not reversible
        </p>
        <Button 
          variant="outline" 
          className="gap-2 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
          onClick={() => setShowDeleteBotDialog(true)}
        >
          <Trash2 className="w-4 h-4" />
          Delete the Bot
        </Button>
      </div>

      {/* Delete Bot Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={showDeleteBotDialog}
        onOpenChange={setShowDeleteBotDialog}
        onConfirm={handleDeleteBot}
        description="Deleting this bot will permanently erase all conversations, settings, and data."
        isDeleting={isDeleting}
      />

      {/* Delete Member Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={!!memberToDelete}
        onOpenChange={() => setMemberToDelete(null)}
        onConfirm={handleDeleteMember}
        title="Remove Team Member"
        description={`Are you sure you want to remove ${memberToDelete?.email} from your team? This action cannot be undone.`}
        isDeleting={isDeleting}
      />

      {/* Edit Member Role Dialog */}
      <Dialog open={!!memberToEdit} onOpenChange={() => setMemberToEdit(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Team Member Role</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label>E-mail</Label>
              <Input value={memberToEdit?.email || ""} disabled />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select value={editRole} onValueChange={setEditRole}>
                <SelectTrigger id="edit-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setMemberToEdit(null)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleEditMember}>
                Update Role
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsTab;
