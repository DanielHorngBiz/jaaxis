import { Bot, Zap, MessageSquare, Users, ArrowRight, CheckCircle2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";

const Features = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const triggerRefs = useRef<(HTMLDivElement | null)[]>([]);

  const features = [
    {
      icon: Zap,
      title: "Launch Your AI Agent in Minutes",
      description: "Transform your content into an intelligent AI assistant and deploy it across every channel your customers use—no coding required.",
      bullets: [
        "Train instantly with docs, URLs, or files",
        "Go live on web, Messenger, and Instagram",
        "Built-in multilingual support for global reach"
      ],
      visual: "gradient-from-primary/20 to-primary/5",
    },
    {
      icon: MessageSquare,
      title: "Smart E-Commerce Integration",
      description: "Connect seamlessly with Shopify, WooCommerce, and major platforms so your AI can handle orders, process refunds, and resolve customer issues autonomously.",
      bullets: [
        "Native integration with leading platforms",
        "Understands complex customer inquiries",
        "End-to-end resolution without escalation"
      ],
      visual: "gradient-from-accent/20 to-accent/5",
    },
    {
      icon: Bot,
      title: "Refine AI Through Conversations",
      description: "Make your AI smarter by editing past interactions. No complex training, no technical expertise—just click, edit, and improve.",
      bullets: [
        "Learn from real customer conversations",
        "Instant improvements without retraining",
        "Simple interface anyone can use"
      ],
      visual: "gradient-from-primary/15 to-secondary",
    },
    {
      icon: Users,
      title: "Seamless Human Handoff",
      description: "Intelligently escalate to your team when needed. Set custom triggers, capture customer details, and ensure smooth transitions that maintain context.",
      bullets: [
        "Smart routing based on conversation signals",
        "Customizable escalation rules",
        "Automatic contact capture for follow-up"
      ],
      visual: "gradient-from-secondary to-primary/5",
    },
  ];

  const activeFeatureData = features[activeFeature];
  const ActiveIcon = activeFeatureData.icon;

  useEffect(() => {
    const observers = triggerRefs.current.map((trigger, index) => {
      if (!trigger) return null;
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveFeature(index);
            }
          });
        },
        {
          threshold: 0.5,
          rootMargin: "-40% 0px -40% 0px",
        }
      );

      observer.observe(trigger);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, []);

  return (
    <section id="features" className="py-24 px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-secondary/50 mb-4">
            <span className="text-xs font-medium text-foreground">Features</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Advanced Features to Supercharge
            <br />
            Your AI Agent
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Equip your AI agent with powerful tools to resolve customer issues faster, deliver instant answers in any language, and create a seamless support experience across platforms.
          </p>
        </div>

        {/* Features Grid - Desktop: Side by side with sticky, Mobile: Stacked */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 relative">

          {/* Left Column - Sticky Feature List */}
          <div className="lg:sticky lg:top-24 lg:self-start space-y-6 h-fit z-10">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isActive = activeFeature === index;
              
              return (
                <button
                  key={index}
                  onClick={() => setActiveFeature(index)}
                  className={`w-full text-left p-8 rounded-xl border transition-all duration-300 ${
                    isActive
                      ? "border-primary bg-primary/5 shadow-lg"
                      : "border-border bg-card hover:border-primary/30 hover:bg-secondary/50"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                        isActive ? "bg-primary text-primary-foreground scale-110" : "bg-primary/10 text-primary"
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`text-xl font-bold mb-3 transition-colors ${
                          isActive ? "text-foreground" : "text-foreground/70"
                        }`}
                      >
                        {feature.title}
                      </h3>
                      <p
                        className={`text-sm leading-relaxed mb-4 transition-all duration-300 ${
                          isActive ? "text-muted-foreground opacity-100" : "text-muted-foreground/60 opacity-60"
                        }`}
                      >
                        {feature.description}
                      </p>
                      <ul className="space-y-2.5">
                        {feature.bullets.map((bullet, bulletIndex) => (
                          <li
                            key={bulletIndex}
                            className={`flex items-start gap-3 text-sm transition-all duration-300 ${
                              isActive ? "text-foreground opacity-100" : "text-foreground/60 opacity-60"
                            }`}
                          >
                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </button>
              );
            })}
            
            <div className="pt-6">
              <Button className="w-full gap-2" size="lg" variant="gradient">
                Start Building Your AI Agent
                <ArrowRight className="h-4 w-4" />
              </Button>
              <p className="text-xs text-muted-foreground mt-5 text-center font-medium">
                Join 10,000+ businesses delivering exceptional support
              </p>
            </div>
          </div>

          {/* Right Column - Fixed Visual with Fade Transitions */}
          <div className="lg:sticky lg:top-24 lg:self-start z-10">
            <div className="min-h-[60vh] lg:min-h-[70vh] flex items-center">
              <div
                key={activeFeature}
                className={`w-full rounded-2xl border border-border p-8 lg:p-12 shadow-xl bg-${activeFeatureData.visual} animate-fade-in`}
              >
                <div className="flex flex-col items-center justify-center h-full text-center space-y-8">
                  <div className="w-20 h-20 rounded-2xl bg-primary/20 backdrop-blur-sm flex items-center justify-center animate-scale-in">
                    <ActiveIcon className="h-10 w-10 text-primary" />
                  </div>
                  <div className="space-y-4 max-w-lg">
                    <h3 className="text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                      {activeFeatureData.title}
                    </h3>
                    <p className="text-base lg:text-lg text-muted-foreground leading-relaxed">
                      {activeFeatureData.description}
                    </p>
                  </div>
                  <div className="pt-4">
                    <div className="inline-flex items-center gap-2 text-sm text-primary font-medium cursor-pointer hover:gap-3 transition-all">
                      Learn more
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Triggers to drive pinned section */}
          <div className="hidden lg:block col-span-2" aria-hidden="true">
            {features.map((_, index) => (
              <div
                key={index}
                ref={(el) => (triggerRefs.current[index] = el)}
                className="h-[100vh]"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
