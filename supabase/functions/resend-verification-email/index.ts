import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const { data: userData, error: userError } = await supabase.auth.admin.listUsers();

    if (userError) {
      console.error("Error fetching users:", userError);
      return new Response(JSON.stringify({ error: "Cannot fetch user" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const user = userData.users.find((u: any) => u.email === email);

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    if (user.email_confirmed_at) {
      return new Response(JSON.stringify({
        success: true,
        message: "Email is already verified"
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const { data: canResendData, error: canResendError } = await supabase.rpc(
      "can_resend_verification_email",
      { p_user_id: user.id }
    );

    if (canResendError) {
      console.error("Rate limit check error:", canResendError);
      return new Response(JSON.stringify({ error: "Rate limit check failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const canResend = Array.isArray(canResendData) ? canResendData[0] : canResendData;

    if (!canResend) {
      return new Response(JSON.stringify({
        success: false,
        message: "Too many requests. Please try again later."
      }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: "signup",
      email,
      options: {
        redirectTo: `${Deno.env.get("SITE_URL") || "https://takeyourtoken.app"}/app/dashboard`,
      }
    });

    if (linkError || !linkData) {
      console.error("Link generation error:", linkError);
      return new Response(JSON.stringify({ error: "Cannot generate link" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    await supabase.from("email_verification_log").insert({
      user_id: user.id,
      email,
      ip_address: req.headers.get("x-forwarded-for") ?? null,
      user_agent: req.headers.get("user-agent") ?? null
    });

    return new Response(JSON.stringify({
      success: true,
      message: "Verification email sent! Please check your inbox and spam folder."
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (e) {
    console.error("Unexpected error:", e);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
