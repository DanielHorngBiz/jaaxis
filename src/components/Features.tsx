import { Bot, Zap, MessageSquare, Shield, TrendingUp, Users, ArrowRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";

const Features = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const triggerRefs = useRef<(HTMLDivElement | null)[]>([]);

  const features = [
    {
      icon: Bot,
      title: "AI-Powered Conversations",
      description: "Advanced AI that understands context and delivers natural, human-like responses to customer queries.",
      visual: "gradient-from-primary/20 to-primary/5",
    },
    {
      icon: Zap,
      title: "Instant Response",
      description: "Lightning-fast replies that reduce wait times and significantly improve customer satisfaction.",
      visual: "gradient-from-accent/20 to-accent/5",
    },
    {
      icon: MessageSquare,
      title: "Multi-Channel Support",
      description: "Engage customers across web, mobile, social media, and messaging platforms seamlessly.",
      visual: "gradient-from-primary/15 to-secondary",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade encryption and compliance with industry standards to protect your data.",
      visual: "gradient-from-muted to-card",
    },
    {
      icon: TrendingUp,
      title: "Analytics & Insights",
      description: "Real-time performance metrics and customer behavior insights to optimize your strategy.",
      visual: "gradient-from-primary/10 to-background",
    },
    {
      icon: Users,
      title: "Seamless Handoff",
      description: "Smooth transfer to human agents with complete conversation context when needed.",
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
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Everything you need to deliver
            <br />
            exceptional support
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful capabilities designed to enhance your customer experience.
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
                  className={`w-full text-left p-6 rounded-xl border transition-all duration-300 ${
                    isActive
                      ? "border-primary bg-primary/5 shadow-md"
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
                        className={`text-lg font-semibold mb-2 transition-colors ${
                          isActive ? "text-foreground" : "text-foreground/70"
                        }`}
                      >
                        {feature.title}
                      </h3>
                      <p
                        className={`text-sm leading-relaxed transition-all duration-300 ${
                          isActive ? "text-muted-foreground opacity-100" : "text-muted-foreground/60 opacity-60"
                        }`}
                      >
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
            
            <div className="pt-4">
              <Button className="w-full gap-2" size="lg">
                Explore All Features
                <ArrowRight className="h-4 w-4" />
              </Button>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Trusted by 10,000+ businesses worldwide
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
                  <div className="space-y-4 max-w-md">
                    <h3 className="text-2xl lg:text-3xl font-bold text-foreground">
                      {activeFeatureData.title}
                    </h3>
                    <p className="text-base lg:text-lg text-muted-foreground">
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
                className="h-[85vh] lg:h-[95vh]"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
