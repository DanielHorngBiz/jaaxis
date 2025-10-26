import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plus, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const mockBots = [
  {
    id: "jaaxis",
    name: "Jaaxis",
    avatar: "/placeholder.svg",
    createdAt: "10/5/2025",
  },
];

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="p-8 lg:p-12 max-w-6xl">
        <div className="mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2">Hey Daniel,</h1>
          <p className="text-muted-foreground text-lg">Great to see you back!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {mockBots.map((bot) => (
            <Link key={bot.id} to={`/dashboard/bot/${bot.id}`} className="group animate-scale-in">
              <Card className="p-6 hover:shadow-lg hover:shadow-primary/5 transition-all border-border hover:border-primary/20">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-foreground flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                      <img src={bot.avatar} alt={bot.name} className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{bot.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Created on {bot.createdAt}
                      </p>
                    </div>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <div className="flex justify-center">
          <Button size="lg" className="gap-2 shadow-lg shadow-primary/20 h-12 px-8">
            <Plus className="w-5 h-5" />
            Create a Chatbot
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
