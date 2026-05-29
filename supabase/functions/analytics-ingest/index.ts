// ============================================
// analytics-ingest — Edge Function
// ============================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://fcgbusobfdwnpoqyuzoe.supabase.co";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get service role key from environment
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!serviceKey) {
      return new Response(
        JSON.stringify({ success: false, error: "SUPABASE_SERVICE_ROLE_KEY not set" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(SUPABASE_URL, serviceKey);

    const body = await req.json();
    const { client_id, session_id, event_type, event_data = {}, source_url, referrer, timestamp } = body;

    if (!client_id || !session_id || !event_type) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields: client_id, session_id, event_type" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const now = timestamp ? new Date(timestamp).toISOString() : new Date().toISOString();

    // Upsert session
    const { error: sessionErr } = await supabase
      .from("analytics_sessions")
      .upsert({ client_id, session_id, source_url: source_url || null, referrer: referrer || null, started_at: now }, { onConflict: "session_id" });

    if (sessionErr) console.error("Session error:", sessionErr.message);

    // Insert event
    const { error: eventErr } = await supabase
      .from("analytics_events")
      .insert({ client_id, session_id, event_type, event_data, created_at: now });

    if (eventErr) {
      return new Response(
        JSON.stringify({ success: false, error: eventErr.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`✅ ${event_type} — ${client_id}`);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("Fatal:", msg);
    return new Response(
      JSON.stringify({ success: false, error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});