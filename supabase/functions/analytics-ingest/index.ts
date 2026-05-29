// ============================================
// analytics-ingest — Edge Function
// Receives analytics events from bridge Realtime broadcasts
// and writes them to analytics_sessions + analytics_events
// ============================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://fcgbusobfdwnpoqyuzoe.supabase.co";
const SUPABASE_SERVICE_KEY = Deno.env.get("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjZ2J1c29iZmR3bnBvcXl1em9lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDM0MDYyMywiZXhwIjoyMDg1OTE2NjIzfQ.18SQQEfLXlpmw0x7vC4WEiSE9aHY71acY6CWmPxHXHY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const body = await req.json();
    const {
      client_id,
      session_id,
      event_type,
      event_data = {},
      source_url,
      referrer,
      timestamp,
    } = body;

    // Validate required fields
    if (!client_id || !session_id || !event_type) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Missing required fields: client_id, session_id, event_type" 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const now = timestamp ? new Date(timestamp).toISOString() : new Date().toISOString();

    // 1. Upsert session
    const { error: sessionError } = await supabase
      .from("analytics_sessions")
      .upsert(
        {
          client_id,
          session_id,
          source_url: source_url || null,
          referrer: referrer || null,
          started_at: now,
        },
        { onConflict: "session_id" }
      );

    if (sessionError) {
      console.error("Session upsert error:", sessionError);
    }

    // 2. Insert event
    const { error: eventError } = await supabase
      .from("analytics_events")
      .insert({
        client_id,
        session_id,
        event_type,
        event_data,
        created_at: now,
      });

    if (eventError) {
      console.error("Event insert error:", eventError);
      return new Response(
        JSON.stringify({ success: false, error: eventError.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    console.log(`✅ ${event_type} — ${client_id}`);

    return new Response(
      JSON.stringify({ success: true }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error("Fatal error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});