import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-24 px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-accent opacity-10 pointer-events-none" />
      
      <div className="max-w-4xl mx-auto text-center relative">
        <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
          Ready to transform your
          <br />
          customer support?
        </h2>
        
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join thousands of businesses using Jaaxis to deliver exceptional customer experiences with AI-powered automation.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button size="lg" className="group h-11 px-6">
            Get Started Free
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Button>
          <Button size="lg" variant="outline" className="h-11 px-6">
            Schedule a Demo
          </Button>
        </div>

        <p className="text-sm text-muted-foreground mt-6">
          No credit card required · Free 14-day trial · Cancel anytime
        </p>
      </div>
    </section>
  );
};

export default CTA;
