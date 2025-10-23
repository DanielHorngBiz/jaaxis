import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Check } from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "Start Plan",
      price: "$10",
      period: "month",
      description: "Perfect for small businesses",
      features: [
        "Up to 1,000 messages",
        "Basic AI features",
        "Email support",
        "1 user account",
      ],
      highlighted: false,
    },
    {
      name: "Pro Plan",
      price: "$45",
      period: "month",
      description: "For growing businesses",
      features: [
        "Up to 10,000 messages",
        "Advanced AI features",
        "Priority support",
        "5 user accounts",
        "Custom branding",
        "Advanced Analytics",
        "API Access",
      ],
      highlighted: true,
    },
    {
      name: "Enterprise Plan",
      price: "$145",
      period: "month",
      description: "For large organizations",
      features: [
        "Unlimited messages",
        "Enterprise AI features",
        "24/7 Phone support",
        "Unlimited users",
        "Custom integrations",
        "Dedicated account manager",
        "Advanced Analytics + Reporting",
      ],
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-navy">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-primary font-semibold mb-2">💎 Flexible Plans</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-navy-foreground mb-4">
            Pricing & Plans
          </h2>
          <p className="text-lg text-navy-foreground/80 max-w-3xl mx-auto">
            Choose the perfect plan for your business needs. All plans include our core features.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative ${
                plan.highlighted
                  ? "border-2 border-primary shadow-xl scale-105"
                  : "border-border bg-card"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}
              <CardHeader className="text-center pb-8 pt-8">
                <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-5xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
                <p className="text-muted-foreground">{plan.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  className="w-full"
                  variant={plan.highlighted ? "default" : "outline"}
                  size="lg"
                >
                  Get Started
                </Button>
                <div className="space-y-3 pt-4">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
