import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Lock } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-accent">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
          <Lock className="h-4 w-4 text-white" />
          <span className="text-sm text-white font-medium">256-bit SSL secured</span>
        </div>
        
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          Take Control of Your Files Today!
        </h2>
        
        <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
          Join thousands of businesses using Jaaxis to transform their customer support experience with AI-powered automation.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <div className="flex items-center space-x-2 text-white">
            <FileText className="h-5 w-5" />
            <span>50+ file formats</span>
          </div>
          <div className="hidden sm:block h-6 w-px bg-white/30"></div>
          <div className="flex items-center space-x-2 text-white">
            <Lock className="h-5 w-5" />
            <span>SSL certified and secure</span>
          </div>
        </div>

        <Button size="lg" variant="outline" className="bg-white text-primary hover:bg-white/90 border-0 shadow-xl group">
          Get Started Now
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </section>
  );
};

export default CTA;
