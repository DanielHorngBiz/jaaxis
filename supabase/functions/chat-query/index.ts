import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// RAG Configuration
const EMBEDDING_MODEL = 'text-embedding-3-small';
const TOP_K = 5; // Number of chunks to retrieve
const SIMILARITY_THRESHOLD = 0.7; // Minimum similarity score

// Build available tools based on store connection, access level, and forwarding rules
function getAvailableTools(
  storeConnected: boolean,
  storeAccess: string,
  allowedStatuses: string[],
  forwardingRules: string | null  // Pass actual rules, not boolean
): any[] {
  const tools: any[] = [];

  // Forward tool - available if forwarding rules exist, rules embedded in description
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
            description: "Customer's email to verify ownership"
          },
          verification_phone: {
            type: "string",
            description: "Customer's phone to verify ownership"
          }
        },
        required: ["order_number"],
        anyOf: [
          { required: ["verification_email"] },
          { required: ["verification_phone"] }
        ],
        additionalProperties: false
      }
    });

    // Build edit_order description with allowed statuses
    let editDescription = "Edit order details such as status, shipping address, shipping name, billing address, or billing name. Cannot edit tracking information. If the customer hasn't provided verification info, ask them for their email or phone before calling this tool.";
    
    if (allowedStatuses.length > 0) {
      editDescription += ` For status changes, only these statuses are allowed: ${allowedStatuses.join(', ')}.`;
    }

    tools.push({
      type: "function",
      name: "edit_order",
      description: editDescription,
      parameters: {
        type: "object",
        properties: {
          order_number: {
            type: "string",
            description: "The order number to edit"
          },
          verification_email: {
            type: "string",
            description: "Customer's email to verify ownership"
          },
          verification_phone: {
            type: "string",
            description: "Customer's phone to verify ownership"
          },
          updates: {
            type: "object",
            description: "The fields to update",
            properties: {
              status: {
                type: "string",
                description: "New order status"
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
            },
            additionalProperties: false
          }
        },
        required: ["order_number", "updates"],
        anyOf: [
          { required: ["verification_email"] },
          { required: ["verification_phone"] }
        ],
        additionalProperties: false
      }
    });
  }

  return tools;
}

// Verify order ownership by matching email or phone
function verifyOrderOwnership(
  order: any,
  email?: string,
  phone?: string
): boolean {
  if (email) {
    const normalizedEmail = email.toLowerCase().trim();
    if (
      order.billing_email?.toLowerCase().trim() === normalizedEmail ||
      order.shipping_email?.toLowerCase().trim() === normalizedEmail
    ) {
      return true;
    }
  }
  if (phone) {
    const normalizedPhone = phone.replace(/\D/g, ''); // Remove non-digits
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

  // Forward to human tool - POC: just return success, no actual forwarding
  if (toolName === "forward_to_human") {
    const reason = args.reason || "User request requires human assistance";
    console.log(`Forwarding to human. Reason: ${reason}`);
    
    return {
      success: true,
      result: {
        forwarded: true,
        message: "Your request has been forwarded to our support team. They will get back to you shortly.",
        reason: reason
      }
    };
  }

  // Read order tool - flexible lookup
  if (toolName === "read_order") {
    const orderNumber = args.order_number?.replace('#', '').trim();
    const customerName = args.customer_name?.trim();
    const customerEmail = args.customer_email?.toLowerCase().trim();
    const customerPhone = args.customer_phone?.replace(/\D/g, '');

    // Validate at least one identifier is provided
    if (!orderNumber && !customerName && !customerEmail && !customerPhone) {
      return { success: false, error: "Please provide at least one of: order number, name, email, or phone" };
    }

    let query = supabase.from('orders').select('*');

    if (orderNumber) {
      query = query.eq('order_number', `#${orderNumber}`);
    }
    
    // Execute query
    const { data: orders, error } = await query;

    if (error) {
      return { success: false, error: `Failed to search orders: ${error.message}` };
    }

    // Filter by other criteria if no order_number or need additional filtering
    let filteredOrders = orders || [];
    
    if (!orderNumber && filteredOrders.length === 0) {
      // If no order number, fetch all and filter
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

    // Apply additional filters
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

    // Return multiple orders summary
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

  // For write operations, require order_number
  const orderNumber = args.order_number?.replace('#', '').trim();
  
  if (!orderNumber) {
    return { success: false, error: "Order number is required" };
  }

  // Cancel order tool
  if (toolName === "cancel_order") {
    const verificationEmail = args.verification_email;
    const verificationPhone = args.verification_phone;

    // Require verification
    if (!verificationEmail && !verificationPhone) {
      return { success: false, error: "For security, please provide the email or phone number associated with this order to verify ownership" };
    }

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

    // Verify ownership
    if (!verifyOrderOwnership(order, verificationEmail, verificationPhone)) {
      return { success: false, error: "The email or phone provided doesn't match our records for this order. Please double-check and try again." };
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
    const verificationEmail = args.verification_email;
    const verificationPhone = args.verification_phone;

    // Require verification
    if (!verificationEmail && !verificationPhone) {
      return { success: false, error: "For security, please provide the email or phone number associated with this order to verify ownership" };
    }

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

    // Verify ownership
    if (!verifyOrderOwnership(order, verificationEmail, verificationPhone)) {
      return { success: false, error: "The email or phone provided doesn't match our records for this order. Please double-check and try again." };
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

// Generate embedding for a single query
async function generateQueryEmbedding(
  query: string,
  apiKey: string
): Promise<number[]> {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input: query,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Embedding API failed: ${errorText}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

// Search knowledge chunks using vector similarity
async function searchKnowledge(
  supabase: any,
  chatbotId: string,
  queryEmbedding: number[],
  topK: number = TOP_K,
  threshold: number = SIMILARITY_THRESHOLD
): Promise<{ content: string; similarity: number }[]> {
  // Format embedding as pgvector expects
  const embeddingString = `[${queryEmbedding.join(',')}]`;
  
  const { data, error } = await supabase.rpc('search_knowledge_chunks', {
    p_chatbot_id: chatbotId,
    p_query_embedding: embeddingString,
    p_match_count: topK,
    p_match_threshold: threshold,
  });

  if (error) {
    console.error('Knowledge search error:', error);
    return [];
  }

  return data || [];
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

    const { chatbot_id, message, conversation_history = [], has_attachments = false } = await req.json();

    if (!chatbot_id || !message) {
      throw new Error('chatbot_id and message are required');
    }

    console.log(`Processing query for chatbot: ${chatbot_id}`);
    console.log(`User message: ${message}`);
    console.log(`Has attachments: ${has_attachments}`);

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

    // Variables to pass tool results to RAG layer
    let toolResultsForRag: any[] = [];
    let analyzerMessageForRag: any = null;

    // ========== CHECK FOR AUTOMATIC FORWARDING (attachments) ==========
    if (has_attachments) {
      console.log('Attachments detected - triggering automatic forwarding...');
      
      // Create the forwarding result directly (bypass LLM for this decision)
      const forwardResult = {
        success: true,
        result: {
          forwarded: true,
          message: "Your request has been forwarded to our support team. They will get back to you shortly.",
          reason: "Message contains attachments that require human review"
        }
      };
      
      // Set up tool results for RAG layer (same format as if LLM called the tool)
      toolResultsForRag = [{
        tool_call_id: 'auto_forward_attachments',
        role: 'tool',
        content: JSON.stringify(forwardResult)
      }];
      
      // Create mock analyzer message (as if LLM decided to forward)
      analyzerMessageForRag = {
        role: 'assistant',
        content: null,
        tool_calls: [{
          id: 'auto_forward_attachments',
          type: 'function',
          function: {
            name: 'forward_to_human',
            arguments: JSON.stringify({ reason: 'Message contains attachments that require human review' })
          }
        }]
      };
      
      console.log('Skipping Query Analyzer - auto-forwarded due to attachments');
    } else {
      // ========== LAYER 1: Query Analyzer with Tool Calling ==========
      console.log('Running Query Analyzer (Layer 1)...');

      // Build tools array dynamically based on store connection, access level, and forwarding rules
      // Base forwarding rules that are always active
      const baseForwardingRules = `- The user explicitly asks to speak with a human, agent, representative, or real person
- The user expresses strong frustration, anger, or confusion that the bot cannot resolve`;

      // Combine base rules with custom rules
      const allForwardingRules = forwardingRules 
        ? `${baseForwardingRules}\n${forwardingRules}`
        : baseForwardingRules;

      // Pass actual forwarding rules to tool descriptions
      const availableTools = getAvailableTools(storeConnected, storeAccess, allowedStatuses, allForwardingRules);
      console.log(`Available tools: ${availableTools.map((t: any) => t.name).join(', ') || 'none'}`);

      // Query Analyzer system prompt - ONLY for tool routing, NOT for answering questions
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
          { role: 'user', content: message },
        ],
      };

      // Add tools if available
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
        console.error('Query Analyzer error:', errorText);
        throw new Error(`Query Analyzer failed: ${errorText}`);
      }

      const analyzerResult = await analyzerResponse.json();
      
      // Parse Responses API format
      let analyzerContent = null;
      const toolCalls: any[] = [];

      for (const item of analyzerResult.output || []) {
        if (item.type === 'message') {
          analyzerContent = item.content?.[0]?.text || null;
        } else if (item.type === 'function_call') {
          toolCalls.push({
            id: item.call_id,
            type: 'function',
            function: {
              name: item.name,
              arguments: item.arguments
            }
          });
        }
      }

      console.log('Query Analyzer response:', analyzerContent || '(no text output)');
      console.log('Tool calls:', JSON.stringify(toolCalls));

      // If Query Analyzer is asking a clarifying question (has text but no tool calls), return it directly
      if (analyzerContent && toolCalls.length === 0) {
        console.log('Query Analyzer: Returning clarifying question directly, skipping RAG');
        const responseStream = new ReadableStream({
          start(controller) {
            const chunk = {
              choices: [{ delta: { content: analyzerContent }, index: 0 }]
            };
            controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(chunk)}\n\n`));
            controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
            controller.close();
          }
        });
        return new Response(responseStream, {
          headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
        });
      }

      // Handle tool calls
      if (toolCalls.length > 0) {
        console.log('Processing tool calls...');
        
        analyzerMessageForRag = {
          role: 'assistant',
          content: analyzerContent,
          tool_calls: toolCalls
        };
        
        for (const toolCall of toolCalls) {
          const toolName = toolCall.function.name;
          const toolArgs = JSON.parse(toolCall.function.arguments);
          
          const result = await executeTool(
            toolName, 
            toolArgs, 
            supabase, 
            storeAccess, 
            allowedStatuses
          );
          
          toolResultsForRag.push({
            tool_call_id: toolCall.id,
            role: 'tool',
            content: JSON.stringify(result)
          });
        }

        console.log('Tool results:', JSON.stringify(toolResultsForRag));
      } else {
        console.log('Query Analyzer: No tools needed, passing to RAG layer');
      }
    }

    // ========== LAYER 2: RAG Answer Generator ==========
    console.log('Running RAG Answer Generator (Layer 2)...');

    // Perform RAG: Generate query embedding and search for relevant chunks
    console.log('Generating query embedding...');
    const queryEmbedding = await generateQueryEmbedding(message, OPENAI_API_KEY);
    
    console.log('Searching knowledge base...');
    const relevantChunks = await searchKnowledge(supabase, chatbot_id, queryEmbedding);
    console.log(`Found ${relevantChunks.length} relevant chunks`);

    // Build knowledge context from retrieved chunks
    let knowledgeContext = '';
    if (relevantChunks.length > 0) {
      knowledgeContext = `KNOWLEDGE BASE:
${relevantChunks.map((chunk, i) => `[${i + 1}] (similarity: ${chunk.similarity.toFixed(2)}) ${chunk.content}`).join('\n\n---\n\n')}`;
    } else {
      knowledgeContext = 'KNOWLEDGE BASE: No relevant information found in the knowledge base.';
    }

    // RAG system prompt - establishes role, then tone, then KB context
    const chatbotName = chatbot.name || 'this business';
    const ragSystemPrompt = `You are a customer support assistant for ${chatbotName}.

TONE: ${persona}

${knowledgeContext}

RULES:
1. Answer based SOLELY on the knowledge base above
2. Never make up facts or information not in the KB
3. If query is IRRELEVANT to KB topics, politely decline
4. If only PARTS are relevant, answer those parts only
5. If query IS RELEVANT but KB has no answer, use the forward_to_human tool
6. If KB is empty/no matches for an IRRELEVANT query, politely decline without forwarding`;

    // RAG layer forwarding tool - all usage logic in description
    const ragForwardingTool = {
      type: "function",
      name: "forward_to_human",
      description: `Forward to a human agent when the user's question IS RELEVANT to the business but the answer is NOT in the knowledge base.

USE THIS TOOL WHEN:
- User asks about pricing, policies, or details not documented in KB
- User has account-specific questions you cannot answer
- KB exists but doesn't contain the needed information

DO NOT USE when:
- Query is irrelevant to the business (just politely decline instead)
- You can answer from the KB`,
      parameters: {
        type: "object",
        properties: {
          reason: {
            type: "string",
            description: "What specific information the user needs that isn't in the KB"
          }
        },
        required: ["reason"],
        additionalProperties: false
      }
    };

    // Build messages for the RAG layer
    const ragMessages: any[] = [
      { role: 'system', content: ragSystemPrompt },
      ...conversation_history.map((msg: any) => ({
        role: msg.role === 'bot' ? 'assistant' : msg.role,
        content: msg.content,
      })),
    ];

    // If we have tool results from Layer 1, include them in the context
    if (toolResultsForRag.length > 0 && analyzerMessageForRag) {
      // Add the analyzer's tool call
      ragMessages.push({
        role: 'assistant',
        content: analyzerMessageForRag.content,
        tool_calls: analyzerMessageForRag.tool_calls
      });
      
      // Add tool results
      for (const tr of toolResultsForRag) {
        ragMessages.push({
          role: 'tool',
          tool_call_id: tr.tool_call_id,
          content: tr.content
        });
      }
      
      // Add user message with context about tool results
      ragMessages.push({ 
        role: 'user', 
        content: `${message}\n\n[Note: Tool results above have been processed. Please incorporate them into your response.]` 
      });
    } else {
      ragMessages.push({ role: 'user', content: message });
    }

    // Single API call with Responses API
    console.log('Calling GPT-5 for final response...');
    const ragResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5',
        reasoning: { effort: 'low' },
        input: ragMessages,
        tools: [ragForwardingTool],
        stream: true,
      }),
    });

    if (!ragResponse.ok) {
      const errorText = await ragResponse.text();
      throw new Error(`RAG request failed: ${errorText}`);
    }

    // Transform Responses API SSE to Chat Completions format for client compatibility
    const transformStream = new TransformStream({
      transform(chunk, controller) {
        const text = new TextDecoder().decode(chunk);
        const lines = text.split('\n');
        
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6);
          if (data === '[DONE]') {
            controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
            continue;
          }
          
          try {
            const event = JSON.parse(data);
            // Transform response.output_text.delta to chat completions format
            if (event.type === 'response.output_text.delta') {
              const transformed = {
                choices: [{
                  delta: { content: event.delta },
                  index: 0
                }]
              };
              controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(transformed)}\n\n`));
            }
          } catch (e) {
            // Skip unparseable lines
          }
        }
      }
    });

    // Return transformed streaming response
    return new Response(ragResponse.body?.pipeThrough(transformStream), {
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
