import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plus } from "lucide-react";
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
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">Hey Daniel,</h1>
          <p className="text-muted-foreground">Great to see you back!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {mockBots.map((bot) => (
            <Link key={bot.id} to={`/dashboard/bot/${bot.id}`}>
              <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-foreground flex items-center justify-center">
                      <img src={bot.avatar} alt={bot.name} className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{bot.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Created on {bot.createdAt}
                      </p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-primary" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <div className="flex justify-center">
          <Button size="lg" className="gap-2">
            <Plus className="w-4 h-4" />
            Create a Chatbot
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
