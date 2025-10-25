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
    const handleScroll = () => {
      const section = document.querySelector("#features");
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const sectionHeight = rect.height;
      const viewportHeight = window.innerHeight;
      const totalScrollable = sectionHeight - viewportHeight;
      
      // How far we've scrolled into the section (0 to totalScrollable)
      const scrolledIntoSection = Math.min(Math.max(-rect.top, 0), totalScrollable);
      
      // Convert to 0-1 ratio
      const ratio = totalScrollable > 0 ? scrolledIntoSection / totalScrollable : 0;
      
      // Map to 0-400 (full perimeter)
      const progress = ratio * 400;
      
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial calculation
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
            const index = Number((entry.target as HTMLElement).dataset.index);
            setActiveFeature(index);
          }
        });
      },
      {
        threshold: [0, 0.3, 0.5, 0.7, 1],
        rootMargin: "-40% 0px -40% 0px",
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
          <div className="relative">
            {/* TWO STICKY COLUMNS */}
            <div className="grid lg:grid-cols-[1fr_2fr] gap-12 lg:gap-16">
              
              {/* LEFT: All feature cards (sticky container) */}
              <div className="lg:sticky lg:top-24 lg:self-start h-fit space-y-4">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  const isActive = activeFeature === index;
                  
                  return (
                    <div key={index} className="relative">
                      {/* Progress ring - only visible on active card */}
                      {isActive && (
                        <svg 
                          className="absolute inset-0 w-full h-full pointer-events-none"
                          viewBox="0 0 100 100"
                          preserveAspectRatio="xMidYMid meet"
                        >
                          {/* Background track (optional) */}
                          <rect
                            x="2" y="2" width="96" height="96" rx="10"
                            fill="none"
                            stroke="hsl(var(--border))"
                            strokeWidth="2"
                            opacity="0.2"
                            pathLength="400"
                          />
                          {/* Animated progress - travels around all 4 sides */}
                          <rect
                            x="2" y="2" width="96" height="96" rx="10"
                            fill="none"
                            stroke="hsl(var(--primary))"
                            strokeWidth="3"
                            pathLength="400"
                            strokeDasharray="400"
                            strokeDashoffset={400 - scrollProgress}
                            strokeLinecap="round"
                            style={{ opacity: 0.8 }}
                          />
                        </svg>
                      )}
                      
                      {/* Feature Card */}
                      <div
                        className={`w-full p-6 rounded-xl border transition-all duration-300 relative ${
                          isActive
                            ? "border-primary bg-primary/5 shadow-lg"
                            : "border-border bg-card opacity-50"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                              isActive ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                            }`}
                          >
                            <Icon className="h-6 w-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3
                              className={`text-xl font-bold transition-colors ${
                                isActive ? "text-foreground mb-3" : "text-foreground/70"
                              }`}
                            >
                              {feature.title}
                            </h3>
                            {/* Description only shown when active */}
                            {isActive && (
                              <p className="text-base leading-relaxed text-muted-foreground animate-fade-in">
                                {feature.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* RIGHT: Sticky video with scroll triggers */}
              <div className="relative">
                <div className="lg:sticky lg:top-24 lg:self-start">
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

                {/* SCROLL TRIGGERS (in the right column to create scroll height) */}
                <div className="space-y-[100vh] mt-[50vh]">
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
          </div>
        </div>
    </section>
  );
};

export default Features;
