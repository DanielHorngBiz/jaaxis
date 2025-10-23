import { Card, CardContent } from "@/components/ui/card";
import { Bot, Zap, MessageSquare, Shield, TrendingUp, Users } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Bot,
      title: "AI-Powered Conversations",
      description: "Leverage advanced AI to provide intelligent, context-aware responses that feel natural and human-like.",
    },
    {
      icon: Zap,
      title: "Instant Response",
      description: "Deliver lightning-fast replies to customer queries, reducing wait times and improving satisfaction.",
    },
    {
      icon: MessageSquare,
      title: "Multi-Channel Support",
      description: "Engage customers across web, mobile, social media, and messaging platforms from a single dashboard.",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade encryption and compliance with industry standards to keep your data secure and protected.",
    },
    {
      icon: TrendingUp,
      title: "Analytics & Insights",
      description: "Track performance metrics, understand customer behavior, and optimize your support strategy with real-time analytics.",
    },
    {
      icon: Users,
      title: "Seamless Handoff",
      description: "Smoothly transfer complex queries to human agents with full conversation context and history.",
    },
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-primary font-semibold mb-2">🚀 Our Features</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Advanced Features to Supercharge <br />
            Your AI Chatbot
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Discover powerful capabilities designed to enhance your customer support experience and drive business growth.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border"
            >
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
