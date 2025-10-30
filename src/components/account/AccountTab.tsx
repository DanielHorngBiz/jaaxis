import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2, Edit2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { ChangePasswordDialog } from "./ChangePasswordDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AccountTab = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState(user?.email || "");

  const handleEmailEdit = async () => {
    if (!isEditingEmail) {
      setIsEditingEmail(true);
      setNewEmail(user?.email || "");
      return;
    }

    if (!newEmail || !newEmail.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (newEmail === user?.email) {
      setIsEditingEmail(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail,
      });

      if (error) throw error;

      toast({
        title: "Email update initiated",
        description: "Please check your new email to confirm the change.",
      });
      
      setIsEditingEmail(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update email.",
        variant: "destructive",
      });
    }
  };

  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    return user?.email?.[0].toUpperCase() || "U";
  };

  return (
    <div className="space-y-8">
      {/* Profile Picture */}
      <div className="pb-8 border-b">
        <h3 className="text-lg font-semibold mb-6">Profile Picture</h3>
        <div className="flex items-center gap-6">
          <Avatar className="w-20 h-20">
            <AvatarImage src={profile?.avatar_url || ""} />
            <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">PNG, JPG Under 15MB</p>
          </div>
          <div className="flex gap-3">
            <Button>Upload new picture</Button>
            <Button variant="outline">Remove</Button>
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div className="pb-8 border-b">
        <h3 className="text-lg font-semibold mb-6">Personal Info</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName">First name</Label>
            <Input id="firstName" defaultValue={profile?.first_name || ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" defaultValue={profile?.last_name || ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="flex gap-2">
              <Input 
                id="email" 
                value={isEditingEmail ? newEmail : user?.email || ""} 
                disabled={!isEditingEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className={!isEditingEmail ? "bg-muted" : ""}
              />
              <Button 
                size="icon" 
                variant="ghost" 
                className="flex-shrink-0"
                onClick={handleEmailEdit}
              >
                <Edit2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="flex gap-2">
              <Input id="password" type="password" value="········" disabled className="bg-muted" />
              <Button 
                size="icon" 
                variant="ghost" 
                className="flex-shrink-0"
                onClick={() => setPasswordDialogOpen(true)}
              >
                <Edit2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="pb-8 border-b">
        <h3 className="text-lg font-semibold mb-6">Address</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="street">Street/Avenue</Label>
            <Input id="street" placeholder="Enter street address" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" placeholder="Enter city" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input id="state" placeholder="Enter state" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="postal">Postal Code</Label>
            <Input id="postal" placeholder="Enter postal code" />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Account
        </Button>
        <Button>Save Changes</Button>
      </div>

      <ChangePasswordDialog 
        open={passwordDialogOpen} 
        onOpenChange={setPasswordDialogOpen} 
      />
    </div>
  );
};

export default AccountTab;
