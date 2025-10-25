import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "./ui/button";
import feature1Video from "@/assets/feature-1.webm";
import feature2Video from "@/assets/feature-2.webm";
import feature3Video from "@/assets/feature-3.webm";
import feature4Video from "@/assets/feature-4.webm";

gsap.registerPlugin(ScrollTrigger);

const Features = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const features = [
    {
      title: "Launch in Minutes",
      description: "Turn your docs into an AI agent and deploy across web, Messenger, and Instagram instantly.",
      video: feature1Video,
      visual: "gradient-from-primary/20 to-primary/5",
    },
    {
      title: "Smart Store Integration",
      description: "Connect with Shopify and WooCommerce so your AI handles orders, refunds, and support automatically.",
      video: feature2Video,
      visual: "gradient-from-accent/20 to-accent/5",
    },
    {
      title: "Learn From Every Chat",
      description: "Edit past conversations to improve responses. No training required, changes apply instantly.",
      video: feature3Video,
      visual: "gradient-from-primary/15 to-secondary",
    },
    {
      title: "Seamless Human Handoff",
      description: "Set custom rules to route complex cases to your team while capturing customer details automatically.",
      video: feature4Video,
      visual: "gradient-from-secondary to-primary/5",
    },
  ];

  const activeFeatureData = features[activeFeature];

  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return;

    // Only apply ScrollTrigger on desktop
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    
    if (!mediaQuery.matches) {
      // Mobile: simple scroll-based progress
      const handleScroll = () => {
        const section = sectionRef.current;
        if (!section) return;
        const rect = section.getBoundingClientRect();
        const sectionHeight = rect.height;
        const viewportHeight = window.innerHeight;
        const totalScrollable = sectionHeight - viewportHeight;
        const scrolledIntoSection = Math.min(Math.max(-rect.top, 0), totalScrollable);
        const ratio = totalScrollable > 0 ? scrolledIntoSection / totalScrollable : 0;
        const totalProgress = ratio * 1600;
        const newActiveFeature = Math.min(Math.floor(totalProgress / 400), 3);
        setActiveFeature(newActiveFeature);
        const progressWithinFeature = totalProgress % 400;
        setScrollProgress(progressWithinFeature);
      };
      window.addEventListener("scroll", handleScroll);
      handleScroll();
      return () => window.removeEventListener("scroll", handleScroll);
    }

    // Desktop: GSAP ScrollTrigger
    const ctx = gsap.context(() => {
      const totalScrollDistance = features.length * window.innerHeight * 2.5;

      // Pin the entire content (header + grid) at center
      ScrollTrigger.create({
        trigger: sectionRef.current,
        pin: contentRef.current,
        start: "center center",
        end: () => `+=${totalScrollDistance}`,
        pinSpacing: true,
        scrub: true,
        anticipatePin: 1,
      });

      // Create progress animations for each feature
      features.forEach((_, index) => {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: () => `top+=${index * window.innerHeight * 2.5} top`,
          end: () => `top+=${(index + 1) * window.innerHeight * 2.5} top`,
          scrub: true,
          onUpdate: (self) => {
            const progress = self.progress * 400;
            setScrollProgress(progress);
            setActiveFeature(index);
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [features.length]);


  return (
    <section ref={sectionRef} id="features" className="py-24 px-6 lg:px-8 bg-background mb-24">
      <div ref={contentRef} className="max-w-5xl mx-auto w-full">
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

          {/* Features Grid - Desktop: Side by side with pinning, Mobile: Stacked */}
          <div className="relative">
            {/* TWO COLUMNS */}
            <div ref={gridRef} className="grid lg:grid-cols-[1fr_2fr] gap-12 lg:gap-16">
              
              {/* LEFT: All feature cards */}
              <div className="h-fit space-y-4">
                {features.map((feature, index) => {
                  const isActive = activeFeature === index;
                  
                  return (
                    <div key={index} className="relative">
                      {/* Progress ring - only visible on active card */}
                      {isActive && (
                        <svg 
                          className="absolute inset-0 w-full h-full pointer-events-none"
                          preserveAspectRatio="none"
                        >
                          {/* Animated progress - travels around all 4 sides */}
                          <rect
                            x="1.5"
                            y="1.5"
                            width="calc(100% - 3px)"
                            height="calc(100% - 3px)"
                            rx="12"
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
                        <div className="w-full">
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
                  );
                })}
              </div>

              {/* RIGHT: Video display */}
              <div className="relative">
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
          </div>
        </div>
    </section>
  );
};

export default Features;
