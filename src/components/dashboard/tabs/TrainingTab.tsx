import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { KnowledgeSection } from "@/components/dashboard/KnowledgeSection";

const TrainingTab = () => {
  const [persona, setPersona] = useState("");

  const personaTemplates = {
    friendly: "You are a friendly and approachable assistant. Use a warm, conversational tone. Be empathetic and personable in your responses. Use casual language while maintaining professionalism.",
    professional: "You are a professional business assistant. Maintain a formal and courteous tone. Provide clear, concise responses. Focus on efficiency and accuracy in all communications.",
    witty: "You are a clever and witty assistant with a good sense of humor. Use playful language and occasional humor to engage users. Keep responses entertaining while remaining helpful and informative."
  };

  return (
    <div className="space-y-8">
      {/* Persona Section */}
      <div className="pb-8 border-b">
        <h3 className="text-lg font-semibold mb-2">Persona</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Define your bot's personality and communication style
        </p>
        <div className="space-y-4">
          <Textarea
            className="min-h-[140px] resize-none"
            placeholder="Type here..."
            value={persona}
            onChange={(e) => setPersona(e.target.value)}
          />
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setPersona(personaTemplates.friendly)}>Friendly</Button>
              <Button variant="outline" size="sm" onClick={() => setPersona(personaTemplates.professional)}>Professional</Button>
              <Button variant="outline" size="sm" onClick={() => setPersona(personaTemplates.witty)}>Witty</Button>
            </div>
            <Button>Save</Button>
          </div>
        </div>
      </div>

      {/* Knowledge Section */}
      <div className="pb-8 border-b">
        <h3 className="text-lg font-semibold mb-2">Knowledge</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Tell the bot everything it needs to know about your products & services
        </p>
        <KnowledgeSection />
      </div>

      {/* Forwarding Rules Section */}
      <div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Forwarding Rules</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Tell the bot when to forward to a human (one per line, or use regex+ lines)
          </p>
        </div>
        <div className="space-y-4">
          <Textarea
            placeholder="Type here..."
            className="min-h-[120px] resize-none"
          />
          <div className="flex justify-end">
            <Button>Save</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingTab;
