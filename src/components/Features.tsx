import { Bot, Zap, MessageSquare, Users, ArrowRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import feature1Video from "@/assets/feature-1.webm";
import feature2Video from "@/assets/feature-2.webm";
import feature3Video from "@/assets/feature-3.webm";
import feature4Video from "@/assets/feature-4.webm";

const Features = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const triggerRefs = useRef<(HTMLDivElement | null)[]>([]);

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
    const section = document.querySelector("#features");
    if (!section) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const sectionHeight = rect.height;
      const scrolled = -rect.top;
      const totalScrollDistance = sectionHeight - window.innerHeight;
      
      // Calculate overall progress (0-100)
      const overallProgress = Math.min(Math.max((scrolled / totalScrollDistance) * 100, 0), 100);
      
      // Calculate per-feature progress (0-100 for current feature)
      const featureProgress = (overallProgress % 25) * 4; // 4 features = 25% each
      
      setScrollProgress(featureProgress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const index = Number((entry.target as HTMLElement).dataset.index);
            setActiveFeature(index);
          }
        });
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 1],
        rootMargin: "-35% 0px -35% 0px",
      }
    );

    triggerRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" className="py-24 px-6 lg:px-8 bg-background">
      <div className="max-w-5xl mx-auto w-full">
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
          <div className="relative min-h-[500vh]">
            <div className="grid lg:grid-cols-[1fr_2fr] gap-12 lg:gap-16">
              
              {/* LEFT: Single sticky card that changes content */}
              <div className="lg:sticky lg:top-24 lg:h-screen flex items-center">
                <div className="relative w-full">
                  {/* SVG Progress Ring */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
                    <rect
                      x="2"
                      y="2"
                      width="calc(100% - 4px)"
                      height="calc(100% - 4px)"
                      rx="12"
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="3"
                      strokeDasharray="1000"
                      strokeDashoffset={1000 - (scrollProgress * 10)}
                      className="transition-all duration-300"
                    />
                  </svg>
                  
                  {/* Active Feature Content */}
                  <div className="w-full p-8 rounded-xl border border-primary bg-primary/5 shadow-lg relative">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                        <activeFeatureData.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold mb-3 text-foreground">
                          {activeFeatureData.title}
                        </h3>
                        <p className="text-base leading-relaxed text-muted-foreground">
                          {activeFeatureData.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT: Sticky video */}
              <div className="lg:sticky lg:top-24 lg:h-screen flex items-center">
                <div className="w-full rounded-2xl border border-border overflow-hidden shadow-xl">
                  <video
                    key={activeFeature}
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

            {/* INVISIBLE SCROLL TRIGGERS (positioned absolutely below) */}
            <div className="absolute top-[100vh] left-0 w-full space-y-[100vh]">
              {features.map((_, index) => (
                <div
                  key={index}
                  ref={(el) => (triggerRefs.current[index] = el)}
                  data-index={index}
                  className="h-[100vh]"
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>
        </div>
    </section>
  );
};

export default Features;
