import { Bot, Zap, MessageSquare, Shield, TrendingUp, Users, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";

const Features = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

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

  useEffect(() => {
    const observers = sectionRefs.current.map((section, index) => {
      if (!section) return null;
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveFeature(index);
            }
          });
        },
        {
          threshold: 0.6,
          rootMargin: "-20% 0px -20% 0px",
        }
      );

      observer.observe(section);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, []);

  const scrollToFeature = (index: number) => {
    sectionRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

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
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Sticky Feature List */}
          <div className="lg:sticky lg:top-24 lg:self-start space-y-6 h-fit">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isActive = activeFeature === index;
              
              return (
                <button
                  key={index}
                  onClick={() => scrollToFeature(index)}
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

          {/* Right Column - Scrolling Feature Visuals */}
          <div className="space-y-12 lg:space-y-24">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              
              return (
                <div
                  key={index}
                  ref={(el) => (sectionRefs.current[index] = el)}
                  className="min-h-[60vh] lg:min-h-[80vh] flex items-center"
                >
                  <div
                    className={`w-full rounded-2xl border border-border p-8 lg:p-12 transition-all duration-700 bg-${feature.visual} ${
                      activeFeature === index
                        ? "opacity-100 scale-100 shadow-xl"
                        : "opacity-40 scale-95"
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-8">
                      <div className="w-20 h-20 rounded-2xl bg-primary/20 backdrop-blur-sm flex items-center justify-center">
                        <Icon className="h-10 w-10 text-primary" />
                      </div>
                      <div className="space-y-4 max-w-md">
                        <h3 className="text-2xl lg:text-3xl font-bold text-foreground">
                          {feature.title}
                        </h3>
                        <p className="text-base lg:text-lg text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                      <div className="pt-4">
                        <div className="inline-flex items-center gap-2 text-sm text-primary font-medium">
                          Learn more
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
