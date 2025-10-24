import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "$10",
      period: "month",
      description: "Perfect for small teams",
      features: [
        "Up to 1,000 messages",
        "Basic AI features",
        "Email support",
        "1 user account",
      ],
      highlighted: false,
    },
    {
      name: "Professional",
      price: "$45",
      period: "month",
      description: "For growing businesses",
      features: [
        "Up to 10,000 messages",
        "Advanced AI features",
        "Priority support",
        "5 user accounts",
        "Custom branding",
        "Advanced analytics",
        "API access",
      ],
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "$145",
      period: "month",
      description: "For large organizations",
      features: [
        "Unlimited messages",
        "Enterprise AI features",
        "24/7 phone support",
        "Unlimited users",
        "Custom integrations",
        "Dedicated account manager",
        "Advanced analytics + reporting",
      ],
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 px-6 lg:px-8 bg-secondary/30">
      <div className="max-w-5xl mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-background mb-4">
            <span className="text-xs font-medium text-foreground">Pricing</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose the plan that's right for your business. All plans include our core features.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative p-8 rounded-xl border transition-all duration-300 ${
                plan.highlighted
                  ? "border-primary shadow-lg bg-card scale-[1.02]"
                  : "border-border bg-card hover:border-primary/20 hover:shadow-md"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                  Most Popular
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-lg font-semibold text-foreground mb-2">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <Button
                className="w-full mb-6"
                variant={plan.highlighted ? "default" : "outline"}
                size="lg"
              >
                Get Started
              </Button>

              <div className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
