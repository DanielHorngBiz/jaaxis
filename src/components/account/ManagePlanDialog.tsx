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
import { CreditCard, FileText } from "lucide-react";

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
                      Renews {renewsAt}
                    </p>
                  )}
                </div>
                <Button variant="destructive" size="sm">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Action Buttons */}
          <div className="grid grid-cols-1 gap-3">
            <Button
              variant="outline"
              className="justify-start gap-3 h-12"
              onClick={() => {
                // TODO: Implement edit billing
                console.log("Edit billing clicked");
              }}
            >
              <CreditCard className="w-5 h-5" />
              Edit Billing Information
            </Button>

            <Button
              variant="outline"
              className="justify-start gap-3 h-12"
              onClick={() => {
                // TODO: Implement view invoices
                console.log("View invoices clicked");
              }}
            >
              <FileText className="w-5 h-5" />
              View Invoices & Payments
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManagePlanDialog;
