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
      // Fetch Shopify payment and fulfillment statuses
      const cleanUrl = storeUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
      
      // Shopify uses predefined status values
      const paymentStatuses = ['pending', 'authorized', 'paid', 'partially_paid', 'refunded', 'voided'];
      const fulfillmentStatuses = ['unfulfilled', 'partial', 'fulfilled', 'restocked'];

      return new Response(
        JSON.stringify({
          paymentStatuses: paymentStatuses.join(', '),
          fulfillmentStatuses: fulfillmentStatuses.join(', ')
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (storeType === 'woocommerce') {
      // Fetch WooCommerce order statuses
      const cleanUrl = storeUrl.replace(/\/$/, '');
      const apiUrl = `${cleanUrl}/wp-json/wc/v3/reports/orders/totals`;

      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': 'Basic ' + btoa(`${consumerKey}:${consumerSecret}`),
        },
      });

      if (!response.ok) {
        throw new Error(`WooCommerce API error: ${response.status}`);
      }

      const data = await response.json();
      const statuses = data.map((item: any) => item.slug).join(', ');

      return new Response(
        JSON.stringify({ orderStatuses: statuses }),
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
