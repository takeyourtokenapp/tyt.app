import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

/**
 * Issue Certificate Edge Function
 *
 * Issues academy certificate when user completes all lessons in a track.
 * Awards achievement badge and prepares for future Solana SBT minting.
 */

interface CertificateRequest {
  track_id: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { track_id }: CertificateRequest = await req.json();

    if (!track_id) {
      return new Response(
        JSON.stringify({ error: 'track_id is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Check if track exists
    const { data: track, error: trackError } = await supabaseClient
      .from('academy_tracks')
      .select('id, slug, title, difficulty')
      .eq('id', track_id)
      .maybeSingle();

    if (trackError || !track) {
      return new Response(
        JSON.stringify({ error: 'Track not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Check track completion
    const { data: isComplete, error: completionError } = await supabaseClient.rpc(
      'check_track_completion',
      {
        p_user_id: user.id,
        p_track_id: track_id,
      }
    );

    if (completionError) {
      console.error('Error checking completion:', completionError);
      return new Response(
        JSON.stringify({ error: 'Failed to check track completion' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (!isComplete) {
      return new Response(
        JSON.stringify({
          error: 'Track not complete',
          message: 'You must complete all lessons before receiving a certificate',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Check if certificate already issued
    const { data: existingCert, error: certCheckError } = await supabaseClient
      .from('academy_certificates')
      .select('id, certificate_url, issued_at')
      .eq('user_id', user.id)
      .eq('track_id', track_id)
      .maybeSingle();

    if (certCheckError && certCheckError.code !== 'PGRST116') {
      console.error('Error checking existing certificate:', certCheckError);
      return new Response(
        JSON.stringify({ error: 'Database error' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (existingCert) {
      return new Response(
        JSON.stringify({
          success: true,
          already_issued: true,
          certificate: existingCert,
          message: 'Certificate already issued for this track',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Generate certificate URL
    const certificateUrl = `https://takeyourtoken.app/certificates/${user.id}/${track.slug}`;

    // Issue certificate using service role
    const { data: certificate, error: insertError } = await supabaseAdmin
      .from('academy_certificates')
      .insert({
        user_id: user.id,
        track_id: track_id,
        certificate_url: certificateUrl,
        issued_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error issuing certificate:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to issue certificate' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Award achievement badge
    const certificateCount = await supabaseAdmin
      .from('academy_certificates')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (certificateCount.count && certificateCount.count >= 3) {
      await supabaseAdmin
        .from('user_achievements')
        .insert({
          user_id: user.id,
          badge_code: 'academy_graduate',
          source: 'academy',
          metadata: {
            track_id: track_id,
            track_title: track.title,
            certificates_total: certificateCount.count,
          },
        })
        .onConflict('user_id, badge_code');
    }

    // Update user rank after certificate
    await supabaseAdmin.rpc('update_user_rank', { p_user_id: user.id });

    // Check for new achievements
    await supabaseAdmin.rpc('check_achievements', { p_user_id: user.id });

    // TODO: Phase 2 - Mint Solana SBT NFT
    // This will be implemented when Solana program is deployed
    // For now, certificate_url serves as the certificate reference

    const response = {
      success: true,
      certificate: {
        ...certificate,
        track: {
          title: track.title,
          slug: track.slug,
          difficulty: track.difficulty,
        },
      },
      message: 'Certificate issued successfully',
      next_steps: {
        view_certificate: certificateUrl,
        share_on_social: true,
        mint_sbt: 'Coming in Phase 2',
      },
    };

    console.log('Certificate issued:', {
      user_id: user.id,
      track_id: track_id,
      track_title: track.title,
    });

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Issue certificate error:', error);

    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
