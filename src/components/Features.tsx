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
  const [smoothProgress, setSmoothProgress] = useState(0);
  const triggerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const targetRef = useRef(0);
  const rafRef = useRef<number | null>(null);

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

  // Update target ref when scroll progress changes
  useEffect(() => {
    targetRef.current = scrollProgress;
  }, [scrollProgress]);

  // Smooth easing animation
  useEffect(() => {
    const tick = () => {
      setSmoothProgress((prev) => {
        const next = prev + (targetRef.current - prev) * 0.15;
        return next;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const activeTrigger = triggerRefs.current[activeFeature];
      if (!activeTrigger) return;

      const rect = activeTrigger.getBoundingClientRect();
      const triggerHeight = rect.height;
      const viewportCenter = window.innerHeight / 2;
      const triggerCenter = rect.top + triggerHeight / 2;
      const distanceFromCenter = viewportCenter - triggerCenter;
      
      // Calculate progress based on how far through the trigger we've scrolled
      const progress = Math.min(Math.max(((distanceFromCenter + triggerHeight / 2) / triggerHeight) * 100, 0), 100);
      
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial calculation
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeFeature]);

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
                          preserveAspectRatio="none"
                          aria-hidden="true"
                        >
                          {/* Optional track */}
                          <rect
                            x="2"
                            y="2"
                            width="96"
                            height="96"
                            rx="12"
                            fill="none"
                            stroke="hsl(var(--border))"
                            strokeWidth="2"
                            opacity="0.35"
                            pathLength={100}
                          />
                          {/* Animated progress */}
                          <rect
                            x="2"
                            y="2"
                            width="96"
                            height="96"
                            rx="12"
                            fill="none"
                            stroke="hsl(var(--primary))"
                            strokeWidth="3"
                            pathLength={100}
                            strokeDasharray={100}
                            strokeDashoffset={100 - smoothProgress}
                            strokeLinecap="round"
                            className="transition-[stroke-dashoffset] duration-100 ease-linear"
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
