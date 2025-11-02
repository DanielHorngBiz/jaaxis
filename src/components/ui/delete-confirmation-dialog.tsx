import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  isDeleting?: boolean;
}

export function DeleteConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  title = "Delete Confirmation",
  description,
  isDeleting = false,
}: DeleteConfirmationDialogProps) {
  const [confirmText, setConfirmText] = useState("");

  const handleConfirm = () => {
    if (confirmText === "Delete") {
      onConfirm();
      setConfirmText("");
    }
  };

  const handleClose = () => {
    setConfirmText("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center pt-4">
          <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <AlertTriangle className="w-10 h-10 text-destructive" />
          </div>
        </div>

        <DialogHeader>
          <DialogTitle className="text-center">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-center">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="confirm-delete">Type "Delete" to confirm</Label>
            <Input
              id="confirm-delete"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Delete"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={confirmText !== "Delete" || isDeleting}
              variant="destructive"
              className="flex-1"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
