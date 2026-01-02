import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Build available tools based on store connection, access level, and forwarding rules
function getAvailableTools(
  storeConnected: boolean,
  storeAccess: string,
  allowedStatuses: string[],
  forwardingRules: string | null
): any[] {
  const tools: any[] = [];

  // Forward tool - available if forwarding rules exist
  if (forwardingRules) {
    tools.push({
      type: "function",
      name: "forward_to_human",
      description: `Forward the conversation to a human agent.

USE THIS TOOL WHEN:
${forwardingRules}

Do NOT use for general questions - only when the above rules apply.`,
      parameters: {
        type: "object",
        properties: {
          reason: {
            type: "string",
            description: "Brief explanation of why this is being forwarded"
          }
        },
        required: ["reason"],
        additionalProperties: false
      }
    });
  }

  // Order tools only if store is connected
  if (!storeConnected) {
    return tools;
  }

  // read_order is always available when store is connected
  tools.push({
    type: "function",
    name: "read_order",
    description: "Look up orders by order number, customer name, email, or phone. At least one identifier must be provided.",
    parameters: {
      type: "object",
      properties: {
        order_number: {
          type: "string",
          description: "The order number to look up (e.g., '#1001' or '1001')"
        },
        customer_name: {
          type: "string",
          description: "Customer's name (billing or shipping)"
        },
        customer_email: {
          type: "string",
          description: "Customer's email address"
        },
        customer_phone: {
          type: "string",
          description: "Customer's phone number"
        }
      },
      anyOf: [
        { required: ["order_number"] },
        { required: ["customer_name"] },
        { required: ["customer_email"] },
        { required: ["customer_phone"] }
      ],
      additionalProperties: false
    }
  });

  // Write tools only if readwrite access
  if (storeAccess === 'readwrite') {
    tools.push({
      type: "function",
      name: "cancel_order",
      description: "Cancel an order and process a refund. Cannot cancel orders that are already completed, refunded, or cancelled. If the customer hasn't provided verification info, ask them for their email or phone before calling this tool.",
      parameters: {
        type: "object",
        properties: {
          order_number: {
            type: "string",
            description: "The order number to cancel"
          },
          verification_email: {
            type: "string",
            description: "Customer's email for verification"
          },
          verification_phone: {
            type: "string",
            description: "Customer's phone for verification"
          }
        },
        required: ["order_number"],
        additionalProperties: false
      }
    });

    // Only add edit_order if there are allowed statuses to change to
    if (allowedStatuses.length > 0) {
      tools.push({
        type: "function",
        name: "edit_order",
        description: `Update an order's status. If the customer hasn't provided verification info, ask them for their email or phone before calling this tool.

ALLOWED STATUS VALUES: ${allowedStatuses.join(', ')}

Only these statuses can be set. If a customer requests a status not in this list, politely explain that you can only update to the allowed statuses.`,
        parameters: {
          type: "object",
          properties: {
            order_number: {
              type: "string",
              description: "The order number to update"
            },
            new_status: {
              type: "string",
              enum: allowedStatuses,
              description: "New status for the order"
            },
            verification_email: {
              type: "string",
              description: "Customer's email for verification"
            },
            verification_phone: {
              type: "string",
              description: "Customer's phone for verification"
            }
          },
          required: ["order_number", "new_status"],
          additionalProperties: false
        }
      });
    }
  }

  return tools;
}

// Verify customer owns the order via email or phone
function verifyOrderOwnership(
  order: any,
  email?: string,
  phone?: string
): boolean {
  if (email) {
    const normalizedEmail = email.toLowerCase().trim();
    if (
      order.billing_email?.toLowerCase() === normalizedEmail ||
      order.shipping_email?.toLowerCase() === normalizedEmail
    ) {
      return true;
    }
  }
  if (phone) {
    const normalizedPhone = phone.replace(/\D/g, '');
    const billingPhone = order.billing_phone?.replace(/\D/g, '') || '';
    const shippingPhone = order.shipping_phone?.replace(/\D/g, '') || '';
    if (
      (billingPhone && billingPhone === normalizedPhone) ||
      (shippingPhone && shippingPhone === normalizedPhone)
    ) {
      return true;
    }
  }
  return false;
}

// Execute tool (order tools and forward_to_human)
async function executeTool(
  toolName: string,
  args: any,
  supabase: any,
  storeAccess: string,
  allowedStatuses: string[]
): Promise<{ success: boolean; result?: any; error?: string }> {
  console.log(`Executing tool: ${toolName} with args:`, args);

  // Forward to human tool
  if (toolName === "forward_to_human") {
    const reason = args.reason || "User request requires human assistance";
    console.log(`Forwarding to human. Reason: ${reason}`);
    
    return {
      success: true,
      result: {
        forwarded: true,
        reason: reason
      }
    };
  }

  // Read order tool
  if (toolName === "read_order") {
    const orderNumber = args.order_number?.replace('#', '').trim();
    const customerName = args.customer_name?.trim();
    const customerEmail = args.customer_email?.toLowerCase().trim();
    const customerPhone = args.customer_phone?.replace(/\D/g, '');

    if (!orderNumber && !customerName && !customerEmail && !customerPhone) {
      return { success: false, error: "Please provide at least one of: order number, name, email, or phone" };
    }

    let query = supabase.from('orders').select('*');

    if (orderNumber) {
      query = query.eq('order_number', `#${orderNumber}`);
    }
    
    const { data: orders, error } = await query;

    if (error) {
      return { success: false, error: `Failed to search orders: ${error.message}` };
    }

    let filteredOrders = orders || [];
    
    if (!orderNumber && filteredOrders.length === 0) {
      const { data: allOrders, error: allError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (allError) {
        return { success: false, error: `Failed to search orders: ${allError.message}` };
      }
      filteredOrders = allOrders || [];
    }

    if (customerName) {
      const nameLower = customerName.toLowerCase();
      filteredOrders = filteredOrders.filter((o: any) =>
        o.billing_name?.toLowerCase().includes(nameLower) ||
        o.shipping_name?.toLowerCase().includes(nameLower)
      );
    }

    if (customerEmail) {
      filteredOrders = filteredOrders.filter((o: any) =>
        o.billing_email?.toLowerCase() === customerEmail ||
        o.shipping_email?.toLowerCase() === customerEmail
      );
    }

    if (customerPhone) {
      filteredOrders = filteredOrders.filter((o: any) => {
        const billingPhone = o.billing_phone?.replace(/\D/g, '') || '';
        const shippingPhone = o.shipping_phone?.replace(/\D/g, '') || '';
        return billingPhone === customerPhone || shippingPhone === customerPhone;
      });
    }

    if (filteredOrders.length === 0) {
      return { success: false, error: "No orders found matching the provided information" };
    }

    if (filteredOrders.length === 1) {
      return { success: true, result: filteredOrders[0] };
    }

    return { 
      success: true, 
      result: {
        message: `Found ${filteredOrders.length} orders`,
        orders: filteredOrders.map((o: any) => ({
          order_number: o.order_number,
          status: o.status,
          total: o.order_total,
          date: o.created_at
        }))
      }
    };
  }

  const orderNumber = args.order_number?.replace('#', '').trim();
  
  if (!orderNumber) {
    return { success: false, error: "Order number is required" };
  }

  // Cancel order tool
  if (toolName === "cancel_order") {
    const verificationEmail = args.verification_email;
    const verificationPhone = args.verification_phone;

    if (!verificationEmail && !verificationPhone) {
      return { success: false, error: "For security, please provide the email or phone number associated with this order to verify ownership" };
    }

    if (storeAccess !== "readwrite") {
      return { success: false, error: "I don't have permission to cancel orders. Would you like me to connect you with someone who can help?" };
    }

    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('order_number', `#${orderNumber}`)
      .single();

    if (fetchError || !order) {
      return { success: false, error: "Order not found" };
    }

    if (!verifyOrderOwnership(order, verificationEmail, verificationPhone)) {
      return { success: false, error: "The email or phone number provided doesn't match our records for this order. Please verify and try again." };
    }

    if (['completed', 'cancelled', 'refunded'].includes(order.status)) {
      return { success: false, error: `Cannot cancel order - it is already ${order.status}` };
    }

    const { error: updateError } = await supabase
      .from('orders')
      .update({ status: 'cancelled' })
      .eq('id', order.id);

    if (updateError) {
      return { success: false, error: `Failed to cancel order: ${updateError.message}` };
    }

    return { 
      success: true, 
      result: { 
        message: `Order ${order.order_number} has been cancelled. A refund will be processed within 5-7 business days.`,
        order_number: order.order_number,
        previous_status: order.status,
        new_status: 'cancelled'
      }
    };
  }

  // Edit order tool
  if (toolName === "edit_order") {
    const newStatus = args.new_status;
    const verificationEmail = args.verification_email;
    const verificationPhone = args.verification_phone;

    if (!verificationEmail && !verificationPhone) {
      return { success: false, error: "For security, please provide the email or phone number associated with this order to verify ownership" };
    }

    if (storeAccess !== "readwrite") {
      return { success: false, error: "I don't have permission to edit orders. Would you like me to connect you with someone who can help?" };
    }

    if (!allowedStatuses.includes(newStatus)) {
      return { success: false, error: `Status '${newStatus}' is not allowed. Available statuses: ${allowedStatuses.join(', ')}` };
    }

    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('order_number', `#${orderNumber}`)
      .single();

    if (fetchError || !order) {
      return { success: false, error: "Order not found" };
    }

    if (!verifyOrderOwnership(order, verificationEmail, verificationPhone)) {
      return { success: false, error: "The email or phone number provided doesn't match our records for this order. Please verify and try again." };
    }

    const { error: updateError } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', order.id);

    if (updateError) {
      return { success: false, error: `Failed to update order: ${updateError.message}` };
    }

    return { 
      success: true, 
      result: { 
        message: `Order ${order.order_number} status updated to '${newStatus}'.`,
        order_number: order.order_number,
        previous_status: order.status,
        new_status: newStatus
      }
    };
  }

  return { success: false, error: `Unknown tool: ${toolName}` };
}

// Use OpenAI file_search to retrieve knowledge chunks
async function searchKnowledgeWithFileSearch(
  vectorStoreId: string,
  query: string,
  apiKey: string
): Promise<{ text: string; filename: string; score: number }[]> {
  console.log(`Searching vector store ${vectorStoreId} for: ${query}`);

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4.1', // Use a lightweight model for search-only
      input: query,
      tools: [{
        type: "file_search",
        vector_store_ids: [vectorStoreId],
        max_num_results: 5
      }],
      include: ["file_search_call.results"],
      tool_choice: "required" // Force file search to run
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('File search failed:', errorText);
    return [];
  }

  const data = await response.json();
  
  // Extract search results from the response
  const chunks: { text: string; filename: string; score: number }[] = [];
  
  // Find the file_search_call output
  for (const output of data.output || []) {
    if (output.type === 'file_search_call' && output.results) {
      for (const result of output.results) {
        chunks.push({
          text: result.text || '',
          filename: result.filename || 'unknown',
          score: result.score || 0
        });
      }
    }
  }

  console.log(`File search returned ${chunks.length} chunks`);
  return chunks;
}

// Dedicated 3rd LLM for generating forwarding confirmation messages
async function generateForwardingConfirmation(
  forwardResult: { forwarded: boolean; reason: string },
  chatbotName: string,
  persona: string,
  apiKey: string
): Promise<string> {
  console.log('Generating forwarding confirmation via 3rd LLM (GPT-5-mini)...');
  
  const prompt = `You are a customer support assistant for ${chatbotName}.

TONE: ${persona}

A customer's request has just been forwarded to a human agent.

FORWARDING RESULT:
${JSON.stringify(forwardResult)}

YOUR ONLY TASK:
Compose a brief, friendly message to the user that:
1. Acknowledges their request
2. Explains why it was forwarded (use the "reason" field naturally)
3. Confirms a human will follow up

CONSTRAINTS:
- Maximum 1-2 sentences
- Do NOT ask follow-up questions
- Do NOT offer alternatives or suggestions
- Be warm but concise`;

  try {
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-5-mini',
        messages: [
          { role: 'system', content: prompt }
        ],
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      console.error('3rd LLM error:', await response.text());
      return 'Your request has been forwarded to our support team. They will get back to you shortly.';
    }

    const data = await response.json();
    const confirmationText = data.choices?.[0]?.message?.content || 
      'Your request has been forwarded to our support team. They will get back to you shortly.';
    
    console.log('3rd LLM confirmation:', confirmationText);
    return confirmationText;
  } catch (error) {
    console.error('3rd LLM error:', error);
    return 'Your request has been forwarded to our support team. They will get back to you shortly.';
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const { chatbot_id, message, conversation_history = [], has_attachments = false } = await req.json();

    if (!chatbot_id || !message) {
      throw new Error('chatbot_id and message are required');
    }

    console.log(`Processing query for chatbot: ${chatbot_id}`);
    console.log(`User message: ${message}`);
    console.log(`Has attachments: ${has_attachments}`);

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Fetch chatbot data including vector store ID
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
    const vectorStoreId = chatbot.openai_vector_store_id;
    const allowedStatuses = storeOrderStatuses
      ? storeOrderStatuses.split(',').map((s: string) => s.trim()).filter(Boolean)
      : [];

    console.log(`Store connected: ${storeConnected}, Access: ${storeAccess}`);
    console.log(`Vector store ID: ${vectorStoreId || 'none'}`);

    let toolResults: any[] = [];
    let analyzerFunctionCalls: any[] = []; // Store raw function_call objects from Layer 1
    let isForwardingFlow = false;

    // ========== CHECK FOR AUTOMATIC FORWARDING (attachments) ==========
    if (has_attachments) {
      console.log('Attachments detected - triggering automatic forwarding...');
      isForwardingFlow = true;
      
      const forwardResult = {
        success: true,
        result: {
          forwarded: true,
          message: "Your request has been forwarded to our support team. They will get back to you shortly.",
          reason: "Message contains attachments that require human review"
        }
      };

      // Store as function_call object (Responses API format)
      analyzerFunctionCalls.push({
        type: 'function_call',
        call_id: 'auto_forward_attachments',
        name: 'forward_to_human',
        arguments: JSON.stringify({ reason: "Message contains attachments that require human review" })
      });

      toolResults.push({
        call_id: 'auto_forward_attachments',
        output: JSON.stringify(forwardResult)
      });
    } else {
      // ========== LAYER 1: Query Analyzer ==========
      console.log('Running Query Analyzer (Layer 1)...');

      const availableTools = getAvailableTools(storeConnected, storeAccess, allowedStatuses, forwardingRules);
      console.log(`Available tools: ${availableTools.map((t: any) => t.name).join(', ') || 'none'}`);

      const queryAnalyzerSystemPrompt = `You are a query router. Your job is to call tools.

RULES:
- Call a tool when the user's request matches its purpose
- NEVER respond with text UNLESS asking for a missing tool parameter (e.g., order ID, email)
- If no tool applies, do not respond at all

${persona ? `Tone for clarifying questions: ${persona}` : ''}`;

      const analyzerBody: any = {
        model: 'gpt-5',
        reasoning: { effort: 'low' },
        input: [
          { role: 'system', content: queryAnalyzerSystemPrompt },
          ...conversation_history.map((msg: any) => ({
            role: msg.role === 'bot' ? 'assistant' : msg.role,
            content: msg.content,
          })),
          { role: 'user', content: message }
        ],
      };

      if (availableTools.length > 0) {
        analyzerBody.tools = availableTools;
      }

      const analyzerResponse = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(analyzerBody),
      });

      if (!analyzerResponse.ok) {
        const errorText = await analyzerResponse.text();
        throw new Error(`Query analyzer failed: ${errorText}`);
      }

      const analyzerData = await analyzerResponse.json();
      
      // Extract outputs
      let analyzerContent = '';
      let toolCalls: any[] = [];
      
      for (const output of analyzerData.output || []) {
        if (output.type === 'message') {
          for (const content of output.content || []) {
            if (content.type === 'output_text') {
              analyzerContent += content.text;
            }
          }
        } else if (output.type === 'function_call') {
          // Store raw function_call object for Responses API format
          analyzerFunctionCalls.push(output);
          toolCalls.push({
            id: output.call_id,
            name: output.name,
            arguments: output.arguments
          });
        }
      }

      console.log(`Query Analyzer response: ${analyzerContent || '(no text output)'}`);
      console.log(`Tool calls: ${JSON.stringify(toolCalls.map(tc => tc.name))}`);

      // Execute tools if any
      if (toolCalls.length > 0) {

        // Check if this is a forwarding flow (forward_to_human called)
        isForwardingFlow = toolCalls.some(tc => tc.name === 'forward_to_human');

        for (const toolCall of toolCalls) {
          const toolName = toolCall.name;
          const toolArgs = JSON.parse(toolCall.arguments);
          
          const result = await executeTool(
            toolName, 
            toolArgs, 
            supabase, 
            storeAccess, 
            allowedStatuses
          );
          
          // Store as function_call_output (Responses API format)
          toolResults.push({
            type: 'function_call_output',
            call_id: toolCall.id,
            output: JSON.stringify(result)
          });
        }

        console.log('Tool results:', JSON.stringify(toolResults));
      } else if (analyzerContent && analyzerContent.trim()) {
        // Query Analyzer returned a clarifying question (no tool call, but has text)
        // Return this directly to the user without going through RAG
        console.log('Query Analyzer returned clarifying question, returning directly:', analyzerContent);
        
        return new Response(JSON.stringify({
          success: true,
          response: analyzerContent,
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } else {
        console.log('Query Analyzer: No tools needed, passing to RAG layer');
      }
    }

    // ========== BRANCH: Forwarding vs Normal Flow ==========
    if (isForwardingFlow) {
      // ========== FORWARDING PATH: Skip RAG, use 3rd LLM for confirmation ==========
      console.log('Forwarding flow - skipping RAG, using 3rd LLM for confirmation...');

      const chatbotName = chatbot.name || 'this business';
      
      // Extract the forwarding result from toolResults
      let forwardResult = { forwarded: true, reason: 'User request requires human assistance' };
      for (const tr of toolResults) {
        try {
          const parsed = JSON.parse(tr.output || '{}');
          if (parsed.result?.forwarded === true) {
            forwardResult = parsed.result;
            break;
          } else if (parsed.success && parsed.result?.forwarded === true) {
            forwardResult = parsed.result;
            break;
          }
        } catch (e) {
          console.error('Error parsing tool result:', e);
        }
      }
      
      console.log('Forward result for 3rd LLM:', forwardResult);

      // Use dedicated 3rd LLM for confirmation
      const confirmationMessage = await generateForwardingConfirmation(
        forwardResult,
        chatbotName,
        persona,
        LOVABLE_API_KEY!
      );

      return new Response(JSON.stringify({
        success: true,
        response: confirmationMessage,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else {
      // ========== NORMAL PATH: RAG (Layer 2) then 2nd LLM (Layer 3) ==========
      console.log('Normal flow - running RAG (Layer 2)...');

      // Search knowledge using OpenAI file_search
      let knowledgeContext = '';
      
      if (vectorStoreId) {
        console.log('Searching knowledge base via file_search...');
        const relevantChunks = await searchKnowledgeWithFileSearch(vectorStoreId, message, OPENAI_API_KEY);
        console.log(`Found ${relevantChunks.length} relevant chunks`);

        if (relevantChunks.length > 0) {
          knowledgeContext = `KNOWLEDGE BASE:
${relevantChunks.map((chunk, i) => `[${i + 1}] (score: ${chunk.score.toFixed(2)}, file: ${chunk.filename}) ${chunk.text}`).join('\n\n---\n\n')}`;
        } else {
          knowledgeContext = 'KNOWLEDGE BASE: No relevant information found in the knowledge base.';
        }
      } else {
        console.log('No vector store configured for this chatbot');
        knowledgeContext = 'KNOWLEDGE BASE: No knowledge base has been configured.';
      }

      // ========== 2nd LLM (Layer 3) with KB context ==========
      console.log('Running 2nd LLM (Layer 3) with KB context...');

      const chatbotName = chatbot.name || 'this business';
      const ragSystemPrompt = `You are a customer support assistant for ${chatbotName}.

TONE: ${persona}

${knowledgeContext}

Follow these rules for handling user queries:

1. **Always answer queries based SOLELY on the knowledge base above.** Never make up facts or use outside information.

2. **If the user query is clearly out of scope or irrelevant** to the knowledge base, politely inform the user that you don't have information about that subject. **Do NOT use the forward_to_human tool in this case.**

3. **If only part of the query is relevant**, answer that part; clearly decline the irrelevant part.

4. **If the query is relevant but the knowledge is insufficient**, use the forward_to_human tool to escalate to a human agent. Only use this for relevant queries with insufficient knowledge to answer.

5. **Never use forward_to_human when the knowledge base contains no relevant information.** In such cases, either respond politely (for greetings or general conversation) or decline the query as out of scope, as appropriate.

For every user query, reason step by step:
- First, determine if the query is relevant to the knowledge base topics.
- If not relevant, decide whether the query is a greeting or general conversation, and respond politely; otherwise, politely decline as out of scope.
- If relevant, check if sufficient information exists to answer fully.
- Respond directly if you can; otherwise, escalate using forward_to_human, but only if the query is relevant and the knowledge base is insufficient.`;

      // RAG layer forwarding tool
      const ragForwardingTool = {
        type: "function",
        name: "forward_to_human",
        description: `Forward to a human agent when the query is relevant to the business but the knowledge base is insufficient to provide an accurate answer, or when you're unsure about the answer.`,
        parameters: {
          type: "object",
          properties: {
            reason: {
              type: "string",
              description: "What information the user needs that isn't available in the knowledge base"
            }
          },
          required: ["reason"],
          additionalProperties: false
        }
      };

      // Build messages for 2nd LLM
      const llmMessages: any[] = [
        { role: 'system', content: ragSystemPrompt },
        ...conversation_history.map((msg: any) => ({
          role: msg.role === 'bot' ? 'assistant' : msg.role,
          content: msg.content,
        })),
      ];

      // Include tool results from Layer 1 if any (store-related tools) - Responses API format
      if (toolResults.length > 0 && analyzerFunctionCalls.length > 0) {
        // Add each function_call object directly
        for (const fc of analyzerFunctionCalls) {
          llmMessages.push(fc);
        }
        
        // Add function_call_output items
        for (const tr of toolResults) {
          llmMessages.push(tr);
        }
        
        llmMessages.push({ 
          role: 'user', 
          content: `${message}\n\n[Note: Tool results above have been processed. Please incorporate them into your response.]` 
        });
      } else {
        llmMessages.push({ role: 'user', content: message });
      }

      // Call 2nd LLM with KB context and forwarding tool
      console.log('Calling GPT-5 for final response...');
      const llmResponse = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-5',
          reasoning: { effort: 'low' },
          input: llmMessages,
          tools: [ragForwardingTool],
          stream: false,
        }),
      });

      if (!llmResponse.ok) {
        const errorText = await llmResponse.text();
        console.error('2nd LLM API error:', errorText);
        throw new Error(`2nd LLM request failed: ${errorText}`);
      }

      const llmData = await llmResponse.json();
      console.log('2nd LLM response:', JSON.stringify(llmData, null, 2));

      // Check if 2nd LLM called forward_to_human
      let finalOutputText = '';
      let llmCalledForward = false;

      for (const output of llmData.output || []) {
        if (output.type === 'message') {
          for (const content of output.content || []) {
            if (content.type === 'output_text') {
              finalOutputText += content.text;
            }
          }
        } else if (output.type === 'function_call' && output.name === 'forward_to_human') {
          llmCalledForward = true;
          const forwardArgs = JSON.parse(output.arguments || '{}');
          console.log(`2nd LLM called forward_to_human: ${forwardArgs.reason}`);
          
          // Execute forwarding and get result
          const forwardResult = await executeTool('forward_to_human', forwardArgs, supabase, storeAccess, allowedStatuses);
          
          // Use dedicated 3rd LLM for confirmation
          const chatbotName = chatbot.name || 'this business';
          finalOutputText = await generateForwardingConfirmation(
            forwardResult.result || { forwarded: true, reason: forwardArgs.reason },
            chatbotName,
            persona,
            LOVABLE_API_KEY!
          );
        }
      }

      if (!finalOutputText) {
        if (llmCalledForward) {
          finalOutputText = 'Your request has been forwarded to our support team.';
        } else {
          finalOutputText = llmData.output_text || 'I apologize, but I was unable to generate a response. Please try again.';
        }
      }

      return new Response(JSON.stringify({
        success: true,
        response: finalOutputText,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

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
