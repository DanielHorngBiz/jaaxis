import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "./ui/button";

gsap.registerPlugin(ScrollTrigger);

const Features = () => {
  const [featureState, setFeatureState] = useState({
    activeFeature: 0,
    scrollProgress: 0,
    isInViewport: false
  });
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const features = [
    {
      title: "Launch in Minutes",
      description: "Turn your docs into an AI agent and deploy across web, Messenger, and Instagram instantly.",
      video: "https://jaaxis.com/wp-content/uploads/2025/06/GIF-1.webm",
      visual: "gradient-from-primary/20 to-primary/5",
    },
    {
      title: "Smart Store Integration",
      description: "Connect with Shopify and WooCommerce so your AI handles orders, refunds, and support automatically.",
      video: "https://jaaxis.com/wp-content/uploads/2025/06/GIF-2.webm",
      visual: "gradient-from-accent/20 to-accent/5",
    },
    {
      title: "Learn From Every Chat",
      description: "Edit past conversations to improve responses. No training required, changes apply instantly.",
      video: "https://jaaxis.com/wp-content/uploads/2025/06/GIF-3.webm",
      visual: "gradient-from-primary/15 to-secondary",
    },
    {
      title: "Seamless Human Handoff",
      description: "Set custom rules to route complex cases to your team while capturing customer details automatically.",
      video: "https://jaaxis.com/wp-content/uploads/2025/06/GIF-04-V2.webm",
      visual: "gradient-from-secondary to-primary/5",
    },
  ];

  const activeFeatureData = features[featureState.activeFeature];

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
        const progressWithinFeature = totalProgress % 400;
        setFeatureState({
          activeFeature: newActiveFeature,
          scrollProgress: progressWithinFeature,
          isInViewport: featureState.isInViewport
        });
      };
      window.addEventListener("scroll", handleScroll);
      handleScroll();
      return () => window.removeEventListener("scroll", handleScroll);
    }

    // Desktop: GSAP ScrollTrigger
    const ctx = gsap.context(() => {
      const step = window.innerHeight * 1.2;
      const totalScrollDistance = (features.length - 1) * step;

      // Single ScrollTrigger that pins section and handles all feature switching
      ScrollTrigger.create({
        trigger: sectionRef.current,
        pin: contentRef.current,
        start: "top top",
        end: () => `+=${totalScrollDistance}`,
        pinSpacing: true,
        markers: false,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Calculate which feature based on overall progress
          const totalProgress = self.progress;
          const exactFeaturePosition = totalProgress * features.length;
          const featureIndex = Math.min(Math.floor(exactFeaturePosition), features.length - 1);
          const progressWithinFeature = exactFeaturePosition - featureIndex;
          
          setFeatureState(prev => ({
            ...prev,
            activeFeature: featureIndex,
            scrollProgress: progressWithinFeature * 400
          }));
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Viewport detection for videos
  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setFeatureState(prev => ({
            ...prev,
            isInViewport: entry.isIntersecting
          }));
        });
      },
      { threshold: 0.8 }
    );

    observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Control video playback based on active feature AND viewport visibility
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === featureState.activeFeature && featureState.isInViewport) {
          video.currentTime = 0; // Reset to start when switching to this feature
          video.play().catch(() => {
            // Ignore autoplay errors
          });
        } else {
          video.pause();
        }
      }
    });
  }, [featureState.activeFeature, featureState.isInViewport]);


  return (
    <section ref={sectionRef} id="features" className="relative bg-background pb-24 lg:pb-0">
      <div className="min-h-screen py-24 px-6 lg:px-8 flex items-center">
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
                  const isActive = featureState.activeFeature === index;
                  
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
                            strokeDashoffset={400 - featureState.scrollProgress}
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
                              isActive ? "text-foreground" : "text-foreground/70"
                            }`}
                          >
                            {feature.title}
                          </h3>
                          {/* Description with smooth expand/collapse */}
                          <div 
                            className={`grid transition-all duration-300 ${
                              isActive ? 'grid-rows-[1fr] mt-3' : 'grid-rows-[0fr]'
                            }`}
                          >
                            <div className="overflow-hidden">
                              <p className="text-base leading-relaxed text-muted-foreground">
                                {feature.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* RIGHT: Video display - All videos preloaded */}
              <div className="relative">
                <div className="w-full rounded-2xl border border-border overflow-hidden shadow-xl relative">
                  {features.map((feature, index) => (
                    <video
                      key={index}
                      ref={(el) => (videoRefs.current[index] = el)}
                      src={feature.video}
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      className={`w-full h-auto transition-opacity duration-500 ${
                        index === featureState.activeFeature
                          ? "opacity-100 relative" 
                          : "opacity-0 absolute inset-0 pointer-events-none"
                      }`}
                      style={{ willChange: 'opacity' }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
