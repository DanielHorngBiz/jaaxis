import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { ContentContainer } from "@/components/layout/ContentContainer";
import { LAYOUT_CONSTANTS } from "@/lib/layout-constants";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import defaultAvatar from "@/assets/jaaxis-avatar.jpg";
import { CreateChatbotDialog } from "@/components/dashboard/CreateChatbotDialog";

const Dashboard = () => {
  const { user, profile } = useAuth();
  const [bots, setBots] = useState<any[]>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchBots();
    }
  }, [user]);

  const fetchBots = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('chatbots')
      .select('id, name, slug, avatar_url, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bots:', error);
    } else {
      setBots(data || []);
    }
  };
  return (
    <DashboardLayout>
      <ContentContainer 
        maxWidth="dashboard" 
        className={LAYOUT_CONSTANTS.padding.page}
      >
        <div className="mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold mb-2">Hey {profile?.first_name || 'there'},</h1>
          <p className="text-muted-foreground text-lg">Great to see you back!</p>
        </div>

        {bots.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {bots.map((bot) => (
              <Link key={bot.id} to={`/dashboard/bot/${bot.slug}`} className="group animate-scale-in">
                <Card className="p-6 hover:shadow-lg hover:shadow-primary/5 transition-all border-border hover:border-primary/20">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full overflow-hidden shadow-sm flex-shrink-0">
                        <img
                          src={bot.avatar_url || defaultAvatar}
                          alt={bot.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            if (target.src !== defaultAvatar) target.src = defaultAvatar;
                          }}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{bot.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Created on {new Date(bot.created_at).toLocaleDateString()}
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
        ) : (
          <div className="text-center py-16 animate-fade-in">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Plus className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">No chatbots yet</h2>
              <p className="text-muted-foreground mb-8">
                Get started by creating your first chatbot
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-center">
          <Button 
            size="lg" 
            className="gap-2 shadow-lg shadow-primary/20 h-12 px-8"
            onClick={() => setCreateDialogOpen(true)}
          >
            <Plus className="w-5 h-5" />
            Create a Chatbot
          </Button>
        </div>

        <CreateChatbotDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
      </ContentContainer>
    </DashboardLayout>
  );
};

export default Dashboard;
