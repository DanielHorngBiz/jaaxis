import { Bot, Zap, MessageSquare, Users, ArrowRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import feature1Video from "@/assets/feature-1.webm";
import feature2Video from "@/assets/feature-2.webm";
import feature3Video from "@/assets/feature-3.webm";
import feature4Video from "@/assets/feature-4.webm";

const Features = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const features = [
    {
      icon: Zap,
      title: "Launch in Minutes",
      description: "Turn your docs into an AI agent and deploy across web, Messenger, and Instagram instantly.",
      video: feature1Video,
      visual: "gradient-from-primary/20 to-primary/5",
    },
    {
      icon: MessageSquare,
      title: "Smart Store Integration",
      description: "Connect with Shopify and WooCommerce so your AI handles orders, refunds, and support automatically.",
      video: feature2Video,
      visual: "gradient-from-accent/20 to-accent/5",
    },
    {
      icon: Bot,
      title: "Learn From Every Chat",
      description: "Edit past conversations to improve responses. No training required, changes apply instantly.",
      video: feature3Video,
      visual: "gradient-from-primary/15 to-secondary",
    },
    {
      icon: Users,
      title: "Seamless Human Handoff",
      description: "Set custom rules to route complex cases to your team while capturing customer details automatically.",
      video: feature4Video,
      visual: "gradient-from-secondary to-primary/5",
    },
  ];

  const activeFeatureData = features[activeFeature];

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
          rootMargin: "-30% 0px -30% 0px",
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
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-secondary/50 mb-4">
            <span className="text-xs font-medium text-foreground">Features</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Powerful Features for
            <br />
            Modern Customer Support
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to deliver exceptional customer experiences with AI.
          </p>
        </div>

        {/* Features Grid - Desktop: Side by side with sticky, Mobile: Stacked */}
        <div className="grid lg:grid-cols-[1fr_2fr] gap-12 lg:gap-16 relative">

          {/* Left Column - Scrollable Feature List */}
          <div className="space-y-6 z-10">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isActive = activeFeature === index;
              
              return (
                <div key={index}>
                  <button
                    ref={(el) => (triggerRefs.current[index] = el)}
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
                        {isActive && (
                          <p className="text-base leading-relaxed text-muted-foreground animate-fade-in">
                            {feature.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                  
                  {/* Spacer between features for smooth scroll */}
                  {index < features.length - 1 && (
                    <div className="h-[60vh]" aria-hidden="true" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column - Fixed Visual with Fade Transitions */}
          <div className="lg:sticky lg:top-24 lg:self-start z-10">
            <div className="min-h-0 flex items-start">
              <div
                key={activeFeature}
                className="w-full rounded-2xl border border-border overflow-hidden shadow-xl animate-fade-in"
              >
                <video
                  src={activeFeatureData.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Features;
