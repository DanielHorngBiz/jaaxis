import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Create mock user
    const mockEmail = 'daniel@jaaxis.com';
    const mockPassword = 'daniel';

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers();
    const userExists = existingUser?.users.find(u => u.email === mockEmail);

    let userId: string;

    if (userExists) {
      console.log('User already exists:', mockEmail);
      userId = userExists.id;
    } else {
      // Create the user
      const { data: newUser, error: userError } = await supabaseAdmin.auth.admin.createUser({
        email: mockEmail,
        password: mockPassword,
        email_confirm: true,
        user_metadata: {
          first_name: 'Daniel',
          last_name: 'Hung'
        }
      });

      if (userError) throw userError;
      userId = newUser.user.id;
      console.log('Created user:', mockEmail);
    }

    // Check if profile exists
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!existingProfile) {
      // Create profile
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert({
          user_id: userId,
          first_name: 'Daniel',
          last_name: 'Hung'
        });

      if (profileError) throw profileError;
      console.log('Created profile for user');
    }

    // Check if Jaaxis chatbot exists
    const { data: existingBot } = await supabaseAdmin
      .from('chatbots')
      .select('*')
      .eq('user_id', userId)
      .eq('slug', 'jaaxis')
      .single();

    let botId: string;

    if (existingBot) {
      console.log('Jaaxis bot already exists');
      botId = existingBot.id;
    } else {
      // Create Jaaxis chatbot
      const { data: newBot, error: botError } = await supabaseAdmin
        .from('chatbots')
        .insert({
          user_id: userId,
          name: 'Jaaxis',
          slug: 'jaaxis',
          primary_color: '#3888FF',
          chat_position: 'right',
          mobile_display: 'show',
          persona: 'You are a friendly and helpful assistant. Only when the customer is using Chinese, respond in Traditional Chinese (zh-hant), and use a Taiwan friendly tone; never use Simplified Chinese (zh-cn). Otherwise, please respond in the same language they\'re using.',
        })
        .select()
        .single();

      if (botError) throw botError;
      botId = newBot.id;
      console.log('Created Jaaxis chatbot');
    }

    // Insert team members
    const teamMembers = [
      { email: 'metal666grin@gmail.com', role: 'owner' },
      { email: 'contact@flexpresets.com', role: 'support' },
      { email: 'metal66grin@gmail.com', role: 'admin' }
    ];

    for (const member of teamMembers) {
      const { data: existing } = await supabaseAdmin
        .from('team_members')
        .select('*')
        .eq('chatbot_id', botId)
        .eq('email', member.email)
        .single();

      if (!existing) {
        await supabaseAdmin
          .from('team_members')
          .insert({
            chatbot_id: botId,
            email: member.email,
            role: member.role
          });
        console.log(`Added team member: ${member.email}`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Mock data seeded successfully',
        user: { email: mockEmail, password: mockPassword },
        userId,
        botId
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error: any) {
    console.error('Error seeding mock data:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error occurred' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
