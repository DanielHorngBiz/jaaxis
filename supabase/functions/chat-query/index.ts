import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const { chatbot_id, message, conversation_history = [] } = await req.json();

    if (!chatbot_id || !message) {
      throw new Error('chatbot_id and message are required');
    }

    console.log(`Processing query for chatbot: ${chatbot_id}`);
    console.log(`User message: ${message}`);

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Fetch chatbot data
    const { data: chatbot, error: chatbotError } = await supabase
      .from('chatbots')
      .select('*')
      .eq('id', chatbot_id)
      .single();

    if (chatbotError || !chatbot) {
      throw new Error(`Chatbot not found: ${chatbotError?.message}`);
    }

    const persona = chatbot.persona || 'You are a helpful assistant.';
    const forwardingRules = chatbot.forwarding_rules || '';

    // ========== LAYER 1: Query Analyzer ==========
    console.log('Running Query Analyzer (Layer 1)...');

    const queryAnalyzerSystemPrompt = `${persona}

You are a query analyzer. Your job is to classify the user's query into one of these categories:
- "forward": If the query matches forwarding rules and should be handled by a human
- "general": If this is a general question that can be answered using the knowledge base

${forwardingRules ? `FORWARDING RULES:
${forwardingRules}

If the user's message matches any of these forwarding rules, respond with the classification "forward" and provide a friendly message explaining that the conversation is being forwarded to a human.` : ''}

Respond in JSON format:
{
  "classification": "forward" | "general",
  "response": "Only include this if classification is 'forward' - the message to show the user",
  "reasoning": "Brief explanation of why you classified it this way"
}`;

    const analyzerResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5',
        reasoning: { effort: 'low' },
        messages: [
          { role: 'system', content: queryAnalyzerSystemPrompt },
          ...conversation_history.map((msg: any) => ({
            role: msg.role === 'bot' ? 'assistant' : msg.role,
            content: msg.content,
          })),
          { role: 'user', content: message },
        ],
      }),
    });

    if (!analyzerResponse.ok) {
      const errorText = await analyzerResponse.text();
      console.error('Query Analyzer error:', errorText);
      throw new Error(`Query Analyzer failed: ${errorText}`);
    }

    const analyzerResult = await analyzerResponse.json();
    const analyzerContent = analyzerResult.choices[0]?.message?.content || '';
    console.log('Query Analyzer response:', analyzerContent);

    // Parse the analyzer response
    let classification = 'general';
    let forwardResponse = '';

    try {
      // Try to parse JSON from the response
      const jsonMatch = analyzerContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        classification = parsed.classification || 'general';
        forwardResponse = parsed.response || '';
        console.log(`Classification: ${classification}, Reasoning: ${parsed.reasoning}`);
      }
    } catch (e) {
      console.log('Could not parse analyzer response as JSON, defaulting to general');
    }

    // If forward, return immediately with the response
    if (classification === 'forward' && forwardResponse) {
      console.log('Query classified as forward, returning forwarding message');
      return new Response(JSON.stringify({
        success: true,
        response: forwardResponse,
        classification: 'forward',
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ========== LAYER 2: RAG Answer Generator ==========
    console.log('Running RAG Answer Generator (Layer 2)...');

    // Check if assistant exists
    if (!chatbot.openai_assistant_id) {
      // No assistant, use regular GPT-5 without RAG
      console.log('No assistant configured, using GPT-5 without RAG');
      
      const directResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-5',
          reasoning: { effort: 'low' },
          messages: [
            { role: 'system', content: persona },
            ...conversation_history.map((msg: any) => ({
              role: msg.role === 'bot' ? 'assistant' : msg.role,
              content: msg.content,
            })),
            { role: 'user', content: message },
          ],
          stream: true,
        }),
      });

      if (!directResponse.ok) {
        const errorText = await directResponse.text();
        throw new Error(`GPT-5 request failed: ${errorText}`);
      }

      // Return streaming response
      return new Response(directResponse.body, {
        headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
      });
    }

    // Use Assistants API with file_search for RAG
    console.log(`Using assistant: ${chatbot.openai_assistant_id}`);

    // Create a thread
    const threadResponse = await fetch('https://api.openai.com/v1/threads', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2',
      },
      body: JSON.stringify({
        messages: [
          ...conversation_history.map((msg: any) => ({
            role: msg.role === 'bot' ? 'assistant' : 'user',
            content: msg.content,
          })),
          { role: 'user', content: message },
        ],
      }),
    });

    if (!threadResponse.ok) {
      const errorText = await threadResponse.text();
      throw new Error(`Failed to create thread: ${errorText}`);
    }

    const thread = await threadResponse.json();
    console.log(`Created thread: ${thread.id}`);

    // Run the assistant
    const runResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2',
      },
      body: JSON.stringify({
        assistant_id: chatbot.openai_assistant_id,
        additional_instructions: persona,
        stream: true,
      }),
    });

    if (!runResponse.ok) {
      const errorText = await runResponse.text();
      throw new Error(`Failed to run assistant: ${errorText}`);
    }

    // Stream the response back
    return new Response(runResponse.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });

  } catch (error) {
    console.error('Error in chat-query:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
