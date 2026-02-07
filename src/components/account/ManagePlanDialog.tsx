import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import CancelPlanDialog from "./CancelPlanDialog";

interface ManagePlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planName: string;
  renewsAt?: string;
}

const ManagePlanDialog = ({
  open,
  onOpenChange,
  planName,
  renewsAt,
}: ManagePlanDialogProps) => {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const handleCancelConfirm = () => {
    // TODO: Implement actual cancellation logic
    console.log("Plan cancelled");
    setCancelDialogOpen(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Plan</DialogTitle>
          <DialogDescription>
            Subscription & billing settings
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Current Plan Info */}
          <Card className="bg-secondary/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">You're on {planName} Plan</p>
                  {renewsAt && (
                    <p className="text-sm text-muted-foreground">
                      Renews at {renewsAt}
                    </p>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-destructive hover:text-destructive"
                  onClick={() => setCancelDialogOpen(true)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => {
                // TODO: Implement edit billing
                console.log("Edit billing clicked");
              }}
            >
              Edit Billing Info
            </Button>

            <Button
              variant="default"
              onClick={() => {
                // TODO: Implement view invoices
                console.log("View invoices clicked");
              }}
            >
              Invoices & Payments
            </Button>
          </div>
        </div>

        <CancelPlanDialog
          open={cancelDialogOpen}
          onOpenChange={setCancelDialogOpen}
          onConfirm={handleCancelConfirm}
          endDate={renewsAt}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ManagePlanDialog;
