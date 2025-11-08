import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";
const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          video.play().catch(() => {
            // Ignore autoplay errors
          });
        } else {
          video.pause();
        }
      });
    }, {
      threshold: 0.8
    });
    observer.observe(video);
    return () => {
      observer.disconnect();
    };
  }, []);
  return <section id="home" className="relative pt-32 pb-24 px-6 lg:px-8 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
      
      <div className="max-w-5xl mx-auto relative">
        <div className="max-w-4xl mx-auto text-center space-y-8 pt-8">
          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] tracking-tight">
            AI Customer Support
            <br />
            <span className="text-primary">That Actually Works</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Automate customer conversations with intelligent AI that understands context, resolves issues instantly, and scales with your business.
          </p>

          {/* CTA Buttons */}
          <div className="flex justify-center pt-4">
            <Button size="lg" className="group h-11 px-6" asChild>
              <a href="#pricing">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full bg-primary/10 border-2 border-background" />
                <div className="w-7 h-7 rounded-full bg-primary/20 border-2 border-background" />
                <div className="w-7 h-7 rounded-full bg-primary/30 border-2 border-background" />
              </div>
              <span>Trusted by 10,000+ teams</span>
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-border" />
            <span>★★★★★ 4.9/5 rating</span>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="max-w-5xl mx-auto mt-20">
          <div className="relative rounded-xl border border-border bg-card shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

            {/* Demo Video */}
            <div className="relative w-full" style={{
            paddingBottom: '75%'
          }}>
              <video ref={videoRef} src="https://jaaxis.com/wp-content/uploads/2025/06/GIF-5.webm" loop muted playsInline preload="metadata" className="absolute inset-0 w-full h-full object-cover" {...{
              fetchpriority: "high"
            } as any} />
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default Hero;