import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section id="home" className="relative pt-32 pb-24 px-6 lg:px-8 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-secondary/50 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-foreground">Introducing AI-Powered Support</span>
          </div>

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
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button size="lg" className="group h-11 px-6">
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="h-11 px-6">
              View Demo
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
            
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/30">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
            </div>

            {/* Chat interface */}
            <div className="p-8 space-y-6">
              <div className="flex items-start gap-3 animate-fade-in">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <div className="flex-1 max-w-md">
                  <div className="bg-secondary/80 rounded-2xl rounded-tl-sm px-4 py-3">
                    <p className="text-sm text-foreground">Hi! I'm your AI assistant. How can I help you today?</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 justify-end animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <div className="flex-1 max-w-md">
                  <div className="bg-primary rounded-2xl rounded-tr-sm px-4 py-3 ml-auto">
                    <p className="text-sm text-primary-foreground">I need help with my recent order</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 animate-fade-in" style={{ animationDelay: "0.4s" }}>
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <div className="flex-1 max-w-md">
                  <div className="bg-secondary/80 rounded-2xl rounded-tl-sm px-4 py-3">
                    <p className="text-sm text-foreground">I'd be happy to help! Let me pull up your order details...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
