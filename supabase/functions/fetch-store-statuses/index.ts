import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { storeType, storeUrl, accessToken, consumerKey, consumerSecret } = await req.json();

    console.log('Fetching statuses for:', { storeType, storeUrl });

    if (storeType === 'shopify') {
      // Shopify predefined status values
      const paymentStatuses = ['pending', 'authorized', 'partially_paid', 'paid', 'partially_refunded', 'refunded', 'voided', 'unpaid'];
      const fulfillmentStatuses = ['fulfilled', 'partial', 'unfulfilled', 'restocked', 'on_hold', 'scheduled'];

      return new Response(
        JSON.stringify({
          paymentStatuses: paymentStatuses.join(', '),
          fulfillmentStatuses: fulfillmentStatuses.join(', ')
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (storeType === 'woocommerce') {
      // WooCommerce predefined order statuses
      const orderStatuses = ['pending', 'processing', 'on-hold', 'completed', 'cancelled', 'refunded', 'failed'];

      return new Response(
        JSON.stringify({ orderStatuses: orderStatuses.join(', ') }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    throw new Error('Invalid store type');

  } catch (error) {
    console.error('Error fetching statuses:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
