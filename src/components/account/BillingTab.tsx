import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check } from "lucide-react";
import AddRepliesDialog from "./AddRepliesDialog";

const PLANS = [
  {
    name: "Basic",
    price: 19,
    features: ["300 Replies / Month", "1 Bot", "Unlimited Knowledge", "Unlimited Team Members"],
    action: "Downgrade",
    variant: "outline" as const,
  },
  {
    name: "Pro",
    price: 49,
    renewsAt: "Jan 20, 2025",
    features: ["1000 Replies / Month", "3 Bots", "Unlimited Knowledge", "Unlimited Team Members"],
    action: "Manage",
    variant: "default" as const,
    current: true,
  },
  {
    name: "Enterprise",
    price: 149,
    features: ["15,000 Replies / Month", "5 Bots", "Unlimited Knowledge", "Unlimited Team Members"],
    action: "Upgrade",
    variant: "outline" as const,
  },
];

const BillingTab = () => {
  const totalReplies = 3000;
  const remainingReplies = 1000;
  const remainingPercentage = (remainingReplies / totalReplies) * 100;

  return (
    <div className="space-y-8">
      {/* Plans & Usage Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Plans & Billing</h3>
        
        {/* Replies Usage */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Replies Usage</h3>
                <div className="text-right">
                  <p className="text-2xl font-bold">{remainingReplies.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">of {totalReplies.toLocaleString()} remaining</p>
                </div>
              </div>
              <Progress value={remainingPercentage} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pricing Plans */}
      <div className="grid grid-cols-3 gap-4">
        {PLANS.map((plan) => (
          <Card key={plan.name} className={`relative ${plan.current ? "border-primary" : ""}`}>
            {plan.current && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                Current Plan
              </div>
            )}
            <CardContent className="p-6 pt-8 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{plan.name}</h3>
                </div>
                <div>
                  <span className="text-3xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                {plan.renewsAt && (
                  <p className="text-xs text-muted-foreground mt-1">
                    (Renews at {plan.renewsAt})
                  </p>
                )}
              </div>

              <Button 
                variant={plan.variant} 
                className="w-full"
              >
                {plan.action}
              </Button>

              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">What's included:</p>
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-foreground flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Extra Replies */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Extra Replies</h3>
              <p className="text-sm text-muted-foreground">$10 Per 100 Replies</p>
            </div>
            <AddRepliesDialog />
          </div>
        </CardContent>
      </Card>

    </div>
  );
};

export default BillingTab;
