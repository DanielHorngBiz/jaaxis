import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plus, Sparkles, MessageCircle, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const mockBots = [
  {
    id: "jaaxis",
    name: "Jaaxis",
    avatar: "/placeholder.svg",
    createdAt: "Oct 5, 2025",
    conversations: 1247,
    responseRate: "98%",
  },
];

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="p-6 lg:p-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-accent flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold">Welcome back, Daniel</h1>
              <p className="text-muted-foreground text-sm lg:text-base">
                Here's what's happening with your chatbots
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="p-6 border-border hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Conversations</p>
                <p className="text-2xl font-bold">1,247</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 border-border hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Response Rate</p>
                <p className="text-2xl font-bold">98%</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 border-border hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Bots</p>
                <p className="text-2xl font-bold">{mockBots.length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Chatbots Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Your Chatbots</h2>
            <Button className="gap-2 shadow-lg">
              <Plus className="w-4 h-4" />
              New Chatbot
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {mockBots.map((bot) => (
              <Link key={bot.id} to={`/dashboard/bot/${bot.id}`} className="group">
                <Card className="p-6 border-border hover:shadow-xl hover:shadow-primary/5 transition-all hover:-translate-y-0.5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-accent flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                        <img src={bot.avatar} alt={bot.name} className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{bot.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Created {bot.createdAt}
                        </p>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Conversations</p>
                      <p className="text-lg font-semibold">{bot.conversations}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Response Rate</p>
                      <p className="text-lg font-semibold text-green-600">{bot.responseRate}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
