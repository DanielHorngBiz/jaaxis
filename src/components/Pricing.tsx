import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const PRICING_PLANS = [
  {
    name: "Basic",
    price: "$19",
    period: "month",
    description: "7-Day Free Trial",
    features: [
      "300 replies per month",
      "1 AI bot",
      "Unlimited knowledge",
      "Access to all integrations",
      "$10 per 100 additional replies",
    ],
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$49",
    period: "month",
    description: "Get Started",
    features: [
      "3000 replies per month",
      "3 AI bots",
      "Unlimited knowledge",
      "Access to all integrations",
      "$10 per 100 additional replies",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "$149",
    period: "month",
    description: "Get Started",
    features: [
      "15,000 replies per month",
      "5 AI bots",
      "Unlimited knowledge",
      "Access to all integrations",
      "$10 per 100 additional replies",
    ],
    highlighted: false,
  },
];

const Pricing = () => {

  return (
    <section id="pricing" className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="max-w-5xl mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-background mb-3 sm:mb-4">
            <span className="text-xs font-medium text-foreground">Pricing</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground px-2 sm:px-0">
            Choose the plan that's right for your business. All plans include our core features.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 max-w-5xl mx-auto">
          {PRICING_PLANS.map((plan, index) => (
            <div
              key={index}
              className={`relative p-5 sm:p-6 lg:p-8 rounded-lg sm:rounded-xl border transition-all duration-300 ${
                plan.highlighted
                  ? "border-primary shadow-lg bg-card sm:scale-[1.02]"
                  : "border-border bg-card hover:border-primary/20 hover:shadow-md"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full whitespace-nowrap">
                  Most Popular
                </div>
              )}
              
              <div className="text-center mb-5 sm:mb-6 lg:mb-8">
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">{plan.name}</h3>
              <div className="mb-2">
                <span className="text-3xl sm:text-4xl font-bold text-foreground">{plan.price}</span>
                <span className="text-sm sm:text-base text-muted-foreground">/{plan.period}</span>
              </div>
            </div>

            <Button
              className="w-full mb-4 sm:mb-5 lg:mb-6"
              variant={plan.highlighted ? "default" : "outline"}
              size="lg"
              asChild
            >
              <a href="/auth">
                {plan.name === "Basic" ? "7-Day Free Trial" : "Get Started"}
              </a>
            </Button>

              <div className="space-y-2 sm:space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start gap-2 sm:gap-3">
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-foreground">{feature}</span>
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
