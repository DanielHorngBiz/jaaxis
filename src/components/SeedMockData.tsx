import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "lucide-react";

export const SeedMockData = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const { toast } = useToast();

  const seedData = async () => {
    setIsSeeding(true);
    try {
      const { data, error } = await supabase.functions.invoke('seed-mock-data');

      if (error) throw error;

      toast({
        title: "Mock data seeded!",
        description: `User created: ${data.user.email} / ${data.user.password}`,
      });

      // Optionally auto-login
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: data.user.email,
        password: data.user.password,
      });

      if (!loginError) {
        window.location.href = '/dashboard';
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Seeding failed",
        description: error.message || "Failed to seed mock data",
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={seedData}
      disabled={isSeeding}
      className="gap-2"
    >
      <Database className="w-4 h-4" />
      {isSeeding ? "Seeding..." : "Use Mock User"}
    </Button>
  );
};
