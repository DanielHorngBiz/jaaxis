import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Order management tools definition
const orderTools = [
  {
    type: "function",
    function: {
      name: "read_order",
      description: "Look up an order by order number and return all order details including status, items, billing/shipping info, and tracking.",
      parameters: {
        type: "object",
        properties: {
          order_number: {
            type: "string",
            description: "The order number to look up (e.g., '#1001' or '1001')"
          }
        },
        required: ["order_number"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "cancel_order",
      description: "Cancel an order and process a refund. Changes the order status to 'refunded'.",
      parameters: {
        type: "object",
        properties: {
          order_number: {
            type: "string",
            description: "The order number to cancel"
          }
        },
        required: ["order_number"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "edit_order",
      description: "Edit order details like status, shipping address, or billing address. Cannot edit tracking information.",
      parameters: {
        type: "object",
        properties: {
          order_number: {
            type: "string",
            description: "The order number to edit"
          },
          updates: {
            type: "object",
            description: "The fields to update",
            properties: {
              status: {
                type: "string",
                description: "New order status (e.g., 'processing', 'completed')"
              },
              shipping_address: {
                type: "string",
                description: "New shipping address"
              },
              shipping_name: {
                type: "string",
                description: "New shipping recipient name"
              },
              billing_address: {
                type: "string",
                description: "New billing address"
              },
              billing_name: {
                type: "string",
                description: "New billing name"
              }
            }
          }
        },
        required: ["order_number", "updates"]
      }
    }
  }
];

// Execute order tool
async function executeOrderTool(
  toolName: string,
  args: any,
  supabase: any,
  storeAccess: string,
  allowedStatuses: string[]
): Promise<{ success: boolean; result?: any; error?: string }> {
  console.log(`Executing tool: ${toolName} with args:`, args);

  // Normalize order number (remove # if present)
  const orderNumber = args.order_number?.replace('#', '').trim();
  
  if (!orderNumber) {
    return { success: false, error: "Order number is required" };
  }

  // Read order tool
  if (toolName === "read_order") {
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('order_number', `#${orderNumber}`)
      .single();

    if (error || !order) {
      return { success: false, error: `Order #${orderNumber} not found` };
    }

    return { success: true, result: order };
  }

  // Cancel order tool
  if (toolName === "cancel_order") {
    if (storeAccess !== "readwrite") {
      return { success: false, error: "I don't have permission to cancel orders. Would you like me to connect you with someone who can help?" };
    }

    // Check if 'refunded' or 'cancelled' is in allowed statuses
    const canRefund = allowedStatuses.some(s => 
      s.toLowerCase().includes('refund') || s.toLowerCase().includes('cancel')
    );
    
    if (!canRefund && allowedStatuses.length > 0) {
      return { success: false, error: "I'm not authorized to cancel orders. Would you like me to connect you with someone who can help?" };
    }

    // Get current order
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('order_number', `#${orderNumber}`)
      .single();

    if (fetchError || !order) {
      return { success: false, error: `Order #${orderNumber} not found` };
    }

    // Check if order can be cancelled
    const nonCancellableStatuses = ['completed', 'refunded', 'cancelled'];
    if (nonCancellableStatuses.includes(order.status)) {
      return { success: false, error: `Order #${orderNumber} cannot be cancelled because it's already ${order.status}` };
    }

    // Update order status to refunded
    const { error: updateError } = await supabase
      .from('orders')
      .update({ status: 'refunded', updated_at: new Date().toISOString() })
      .eq('order_number', `#${orderNumber}`);

    if (updateError) {
      return { success: false, error: `Failed to cancel order: ${updateError.message}` };
    }

    return { 
      success: true, 
      result: { 
        message: `Order #${orderNumber} has been cancelled and a refund of $${order.order_total.toFixed(2)} has been initiated.`,
        refund_amount: order.order_total
      } 
    };
  }

  // Edit order tool
  if (toolName === "edit_order") {
    if (storeAccess !== "readwrite") {
      return { success: false, error: "I don't have permission to edit orders. Would you like me to connect you with someone who can help?" };
    }

    const updates = args.updates || {};
    
    // Get current order
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('order_number', `#${orderNumber}`)
      .single();

    if (fetchError || !order) {
      return { success: false, error: `Order #${orderNumber} not found` };
    }

    // Build update object (excluding tracking info)
    const updateData: any = { updated_at: new Date().toISOString() };
    const changedFields: string[] = [];

    if (updates.status) {
      // Check if status is allowed
      const statusAllowed = allowedStatuses.length === 0 || 
        allowedStatuses.some(s => s.toLowerCase().trim() === updates.status.toLowerCase().trim());
      
      if (!statusAllowed) {
        return { success: false, error: `I'm not authorized to set the status to "${updates.status}". Allowed statuses are: ${allowedStatuses.join(', ')}` };
      }
      updateData.status = updates.status;
      changedFields.push(`status to "${updates.status}"`);
    }

    if (updates.shipping_address) {
      updateData.shipping_address = updates.shipping_address;
      changedFields.push('shipping address');
    }

    if (updates.shipping_name) {
      updateData.shipping_name = updates.shipping_name;
      changedFields.push('shipping name');
    }

    if (updates.billing_address) {
      updateData.billing_address = updates.billing_address;
      changedFields.push('billing address');
    }

    if (updates.billing_name) {
      updateData.billing_name = updates.billing_name;
      changedFields.push('billing name');
    }

    if (changedFields.length === 0) {
      return { success: false, error: "No valid fields to update. I can update: status, shipping address, shipping name, billing address, or billing name." };
    }

    // Update the order
    const { error: updateError } = await supabase
      .from('orders')
      .update(updateData)
      .eq('order_number', `#${orderNumber}`);

    if (updateError) {
      return { success: false, error: `Failed to update order: ${updateError.message}` };
    }

    return { 
      success: true, 
      result: { 
        message: `Order #${orderNumber} has been updated. Changed: ${changedFields.join(', ')}.`
      } 
    };
  }

  return { success: false, error: `Unknown tool: ${toolName}` };
}

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
    const storeConnected = chatbot.store_connected || false;
    const storeAccess = chatbot.store_access || 'read';
    const storeOrderStatuses = chatbot.store_order_statuses || '';
    const allowedStatuses = storeOrderStatuses
      ? storeOrderStatuses.split(',').map((s: string) => s.trim()).filter(Boolean)
      : [];

    console.log(`Store connected: ${storeConnected}, Access: ${storeAccess}, Allowed statuses: ${allowedStatuses.join(', ')}`);

    // ========== LAYER 1: Query Analyzer with Tool Calling ==========
    console.log('Running Query Analyzer (Layer 1)...');

    // Build tools array based on access level
    let availableTools: any[] = [];
    let toolsDescription = '';
    
    if (storeConnected) {
      // Read tool is always available
      availableTools.push(orderTools[0]); // read_order
      toolsDescription = '\n\nYou have access to order management tools:\n- read_order: Look up order details\n';
      
      if (storeAccess === 'readwrite') {
        availableTools.push(orderTools[1]); // cancel_order
        availableTools.push(orderTools[2]); // edit_order
        toolsDescription += '- cancel_order: Cancel an order and process refund\n';
        toolsDescription += '- edit_order: Edit order details (status, addresses)\n';
        
        if (allowedStatuses.length > 0) {
          toolsDescription += `\nFor status changes, you can only set these statuses: ${allowedStatuses.join(', ')}\n`;
        }
      }
    }

    const queryAnalyzerSystemPrompt = `${persona}
${toolsDescription}
You are a query analyzer. Your job is to classify the user's query into one of these categories:
- "forward": If the query matches forwarding rules and should be handled by a human
- "tool_required": If the user is asking about orders and you should use a tool
- "general": If this is a general question that can be answered using the knowledge base

${forwardingRules ? `FORWARDING RULES:
${forwardingRules}

If the user's message matches any of these forwarding rules, respond with the classification "forward" and provide a friendly message explaining that the conversation is being forwarded to a human.` : ''}

${storeConnected ? `ORDER QUERIES:
If the user is asking about order status, order details, wants to cancel an order, or modify an order, classify as "tool_required" and use the appropriate tool.` : ''}

Respond in JSON format:
{
  "classification": "forward" | "tool_required" | "general",
  "response": "Only include this if classification is 'forward' - the message to show the user",
  "reasoning": "Brief explanation of why you classified it this way"
}`;

    const analyzerBody: any = {
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
    };

    // Add tools if available
    if (availableTools.length > 0) {
      analyzerBody.tools = availableTools;
    }

    const analyzerResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(analyzerBody),
    });

    if (!analyzerResponse.ok) {
      const errorText = await analyzerResponse.text();
      console.error('Query Analyzer error:', errorText);
      throw new Error(`Query Analyzer failed: ${errorText}`);
    }

    const analyzerResult = await analyzerResponse.json();
    const analyzerMessage = analyzerResult.choices[0]?.message;
    const analyzerContent = analyzerMessage?.content || '';
    const toolCalls = analyzerMessage?.tool_calls || [];

    console.log('Query Analyzer response:', analyzerContent);
    console.log('Tool calls:', JSON.stringify(toolCalls));

    // Handle tool calls
    if (toolCalls.length > 0) {
      console.log('Processing tool calls...');
      
      const toolResults: any[] = [];
      
      for (const toolCall of toolCalls) {
        const toolName = toolCall.function.name;
        const toolArgs = JSON.parse(toolCall.function.arguments);
        
        const result = await executeOrderTool(
          toolName, 
          toolArgs, 
          supabase, 
          storeAccess, 
          allowedStatuses
        );
        
        toolResults.push({
          tool_call_id: toolCall.id,
          role: 'tool',
          content: JSON.stringify(result)
        });
      }

      // Get final response with tool results
      const finalResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            analyzerMessage,
            ...toolResults,
          ],
        }),
      });

      if (!finalResponse.ok) {
        const errorText = await finalResponse.text();
        console.error('Final response error:', errorText);
        throw new Error(`Final response failed: ${errorText}`);
      }

      const finalResult = await finalResponse.json();
      const finalContent = finalResult.choices[0]?.message?.content || '';

      return new Response(JSON.stringify({
        success: true,
        response: finalContent,
        classification: 'tool_required',
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Parse the analyzer response for classification
    let classification = 'general';
    let forwardResponse = '';

    try {
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
