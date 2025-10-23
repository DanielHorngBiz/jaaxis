import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";

const Hero = () => {
  return (
    <section id="home" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-subtle">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
              AI-Driven Chatbots <br />
              <span className="text-primary">Automate Engage & Scale</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl">
              Transform the way you connect with customers using our advanced AI customer support bot to automate
              responses, engage customers effectively, and scale your operations effortlessly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="group">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="group">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
          </div>

          <div className="relative animate-scale-in">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-border">
              <div className="space-y-6">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                  </div>
                  <div className="flex-1">
                    <div className="bg-secondary rounded-lg p-3">
                      <p className="text-sm text-foreground">Hello! How can I help you today?</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3 justify-end">
                  <div className="flex-1">
                    <div className="bg-primary rounded-lg p-3 ml-12">
                      <p className="text-sm text-primary-foreground">I need help with my order</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                  </div>
                  <div className="flex-1">
                    <div className="bg-secondary rounded-lg p-3">
                      <p className="text-sm text-foreground">I'd be happy to help! Could you provide your order number?</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      disabled
                    />
                    <Button size="icon">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
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
