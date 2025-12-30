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
  hasForwardingRules: boolean
): any[] {
  const tools: any[] = [];

  // Forward tool - always available if forwarding rules exist
  if (hasForwardingRules) {
    tools.push({
      type: "function",
      function: {
        name: "forward_to_human",
        description: "Forward the conversation to a human agent when the user's request matches the forwarding rules or requires human assistance that you cannot provide.",
        parameters: {
          type: "object",
          properties: {
            reason: {
              type: "string",
              description: "Brief explanation of why this is being forwarded to a human"
            }
          },
          required: ["reason"],
          additionalProperties: false
        }
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
    function: {
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
    }
  });

  // Write tools only if readwrite access
  if (storeAccess === 'readwrite') {
    tools.push({
      type: "function",
      function: {
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
      }
    });

    // Build edit_order description with allowed statuses
    let editDescription = "Edit order details such as status, shipping address, shipping name, billing address, or billing name. Cannot edit tracking information. If the customer hasn't provided verification info, ask them for their email or phone before calling this tool.";
    
    if (allowedStatuses.length > 0) {
      editDescription += ` For status changes, only these statuses are allowed: ${allowedStatuses.join(', ')}.`;
    }

    tools.push({
      type: "function",
      function: {
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

    // Build tools array dynamically based on store connection, access level, and forwarding rules
    const hasForwardingRules = Boolean(forwardingRules && forwardingRules.trim());
    const availableTools = getAvailableTools(storeConnected, storeAccess, allowedStatuses, hasForwardingRules);
    console.log(`Available tools: ${availableTools.map((t: any) => t.function.name).join(', ') || 'none'}`);

    // Simplified system prompt - no JSON classification needed
    const queryAnalyzerSystemPrompt = `${persona}

You are a helpful assistant. Use the available tools when needed to help the user.

${forwardingRules ? `FORWARDING RULES - Use the forward_to_human tool when the user's request matches any of these:
${forwardingRules}` : ''}

If no tools are needed, respond directly to help the user.`;

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
    const toolCalls = analyzerMessage?.tool_calls || [];

    console.log('Query Analyzer response:', analyzerMessage?.content || '(tool calls only)');
    console.log('Tool calls:', JSON.stringify(toolCalls));

    // Variables to pass tool results to RAG layer
    let toolResultsForRag: any[] = [];
    let analyzerMessageForRag: any = null;

    // Handle tool calls
    if (toolCalls.length > 0) {
      console.log('Processing tool calls...');
      
      analyzerMessageForRag = analyzerMessage;
      
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
    }

    // ========== LAYER 2: RAG Answer Generator ==========
    console.log('Running RAG Answer Generator (Layer 2)...');

    // Build base messages for RAG
    const baseMessages = [
      { role: 'system', content: persona },
      ...conversation_history.map((msg: any) => ({
        role: msg.role === 'bot' ? 'assistant' : msg.role,
        content: msg.content,
      })),
      { role: 'user', content: message },
    ];

    // If we have tool results, include them in the context
    const ragMessages = toolResultsForRag.length > 0
      ? [...baseMessages, analyzerMessageForRag, ...toolResultsForRag]
      : baseMessages;

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
          messages: ragMessages,
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

    // Build additional instructions including tool results if any
    let additionalInstructions = persona;
    if (toolResultsForRag.length > 0) {
      const toolContext = toolResultsForRag.map(tr => {
        const content = JSON.parse(tr.content);
        return `Tool result: ${JSON.stringify(content)}`;
      }).join('\n');
      additionalInstructions += `\n\nCONTEXT FROM TOOLS:\n${toolContext}\n\nUse the above tool results to help answer the user's question.`;
    }

    // Build thread messages - include tool context in the user message if needed
    let userMessageContent = message;
    if (toolResultsForRag.length > 0) {
      const toolContext = toolResultsForRag.map(tr => {
        const content = JSON.parse(tr.content);
        return JSON.stringify(content, null, 2);
      }).join('\n\n');
      userMessageContent = `${message}\n\n[Tool Results for context]:\n${toolContext}`;
    }

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
          { role: 'user', content: userMessageContent },
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
        additional_instructions: additionalInstructions,
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
