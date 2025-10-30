import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ChangeEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentEmail: string;
}

export const ChangeEmailDialog = ({ open, onOpenChange, currentEmail }: ChangeEmailDialogProps) => {
  const [newEmail, setNewEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!newEmail || !newEmail.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (newEmail === currentEmail) {
      toast({
        title: "Same email",
        description: "New email must be different from current email.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail,
      });

      if (error) throw error;

      toast({
        title: "Email update initiated",
        description: "Please check your new email to confirm the change.",
      });
      
      setNewEmail("");
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update email.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setNewEmail("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Change Email</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="current-email">Current Email</Label>
            <Input
              id="current-email"
              value={currentEmail}
              disabled
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-email">New Email</Label>
            <Input
              id="new-email"
              type="email"
              placeholder="Enter new email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
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
