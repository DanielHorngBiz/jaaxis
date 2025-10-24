import { Bot, Zap, MessageSquare, Shield, TrendingUp, Users } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Bot,
      title: "AI-Powered Conversations",
      description: "Advanced AI that understands context and delivers natural, human-like responses to customer queries.",
    },
    {
      icon: Zap,
      title: "Instant Response",
      description: "Lightning-fast replies that reduce wait times and significantly improve customer satisfaction.",
    },
    {
      icon: MessageSquare,
      title: "Multi-Channel Support",
      description: "Engage customers across web, mobile, social media, and messaging platforms seamlessly.",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade encryption and compliance with industry standards to protect your data.",
    },
    {
      icon: TrendingUp,
      title: "Analytics & Insights",
      description: "Real-time performance metrics and customer behavior insights to optimize your strategy.",
    },
    {
      icon: Users,
      title: "Seamless Handoff",
      description: "Smooth transfer to human agents with complete conversation context when needed.",
    },
  ];

  return (
    <section id="features" className="py-24 px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-secondary/50 mb-4">
            <span className="text-xs font-medium text-foreground">Features</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Everything you need to deliver
            <br />
            exceptional support
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful capabilities designed to enhance your customer experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-6 rounded-xl border border-border bg-card hover:shadow-lg hover:border-primary/20 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
