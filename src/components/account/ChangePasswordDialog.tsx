import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ChangePasswordDialog = ({ open, onOpenChange }: ChangePasswordDialogProps) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (newPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== retypePassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and re-typed password must match.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
      
      setOldPassword("");
      setNewPassword("");
      setRetypePassword("");
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update password.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setOldPassword("");
    setNewPassword("");
    setRetypePassword("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Change Password</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <p className="text-muted-foreground">
            Password must be at least 8 characters long.
          </p>

          <div className="space-y-2">
            <Label htmlFor="old-password" className="text-lg">Old Password</Label>
            <div className="relative">
              <Input
                id="old-password"
                type={showOldPassword ? "text" : "password"}
                placeholder="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setShowOldPassword(!showOldPassword)}
              >
                {showOldPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password" className="text-lg">New Password</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="retype-password" className="text-lg">Re-type Password</Label>
            <div className="relative">
              <Input
                id="retype-password"
                type={showRetypePassword ? "text" : "password"}
                placeholder="Re-type Password"
                value={retypePassword}
                onChange={(e) => setRetypePassword(e.target.value)}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setShowRetypePassword(!showRetypePassword)}
              >
                {showRetypePassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="text-destructive"
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
