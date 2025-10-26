import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, MessageCircle, Plus } from "lucide-react";

const PLANS = [
  {
    name: "Starter",
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
    action: "Cancel",
    variant: "default" as const,
    current: true,
  },
  {
    name: "Scale",
    price: 149,
    features: ["15,000 Replies / Month", "5 Bots", "Unlimited Knowledge", "Unlimited Team Members"],
    action: "Upgrade",
    variant: "outline" as const,
  },
];

const BillingTab = () => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Plans & Billing</h2>

      {/* Pricing Plans */}
      <div className="grid grid-cols-3 gap-4">
        {PLANS.map((plan) => (
          <Card key={plan.name} className={plan.current ? "border-primary" : ""}>
            <CardContent className="p-6 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{plan.name}</h3>
                </div>
                {plan.renewsAt && (
                  <p className="text-xs text-muted-foreground mb-2">
                    (Renews at {plan.renewsAt})
                  </p>
                )}
                <p className="text-3xl font-bold">${plan.price}/month</p>
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
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Extra Replies</h3>
                <p className="text-muted-foreground">$10 Per 100 Replies</p>
              </div>
            </div>
            <Button variant="outline">Add Now</Button>
          </div>
        </CardContent>
      </Card>

      {/* Replies Usage */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">Replies Usage</h3>
              <div className="text-right">
                <p className="text-2xl font-bold">2,000</p>
                <p className="text-sm text-muted-foreground">of 3,000 used</p>
              </div>
            </div>
            <div className="space-y-2">
              <Progress value={66.67} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>66.7% used</span>
                <span>1,000 remaining</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Payment Methods</h3>
        <div className="grid grid-cols-3 gap-4">
          {/* Black Card */}
          <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-6 text-white aspect-[1.586/1]">
            <div className="space-y-8">
              <p className="text-lg tracking-wider">XXXX XXXX XXXX 0329</p>
              <div className="flex items-end justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] opacity-70">Card Holder Name</p>
                  <p className="text-xs font-medium">HILLERY NEVELIN</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] opacity-70">Expired Date</p>
                  <p className="text-xs font-medium">10/28</p>
                </div>
                <div className="flex gap-1">
                  <div className="w-6 h-6 rounded-full bg-red-500 opacity-80" />
                  <div className="w-6 h-6 rounded-full bg-orange-500 opacity-80 -ml-3" />
                </div>
              </div>
            </div>
          </div>

          {/* Blue Card */}
          <div className="relative bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg p-6 text-white aspect-[1.586/1]">
            <div className="space-y-8">
              <p className="text-lg tracking-wider">XXXX XXXX XXXX 0329</p>
              <div className="flex items-end justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] opacity-70">Card Holder Name</p>
                  <p className="text-xs font-medium">HILLERY NEVELIN</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] opacity-70">Expired Date</p>
                  <p className="text-xs font-medium">10/28</p>
                </div>
                <div className="text-xl font-bold">VISA</div>
              </div>
            </div>
          </div>

          {/* Add Card */}
          <button className="border-2 border-dashed rounded-lg aspect-[1.586/1] flex items-center justify-center hover:bg-secondary/50 transition-colors">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
              <Plus className="w-6 h-6 text-primary-foreground" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillingTab;
