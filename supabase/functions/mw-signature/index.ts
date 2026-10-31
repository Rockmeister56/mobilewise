// ============================================
// mw-signature — Edge Function
//
// Lets the master dashboard read signed agreements without opening
// agreement_signatures to the public anon key.
//
// WHERE THIS GOES
//     supabase/functions/mw-signature/index.ts
//
// DEPLOY
//     cd "D:\Mobilewise AI\MobileWise-AI-Markets\AI-Voice-Assist"
//     supabase functions deploy mw-signature
//
// No environment variable to set. SUPABASE_SERVICE_ROLE_KEY is already
// present inside an Edge Function, the same way analytics-ingest uses it.
//
//
// WHY IT EXISTS
//
// master-dashboard.html carries the anon key in its source. Row level
// security stops that key reading agreement_signatures — which is correct,
// because the table holds signature images, email addresses and IP
// addresses for every contract signed, and anyone can read the anon key out
// of any page.
//
// But the dashboard legitimately needs two things from that table:
//   1. Has this deal been signed? (so the tray stops saying "waiting")
//   2. What figures were signed?  (so "Mark set up" can compare them with
//      what was agreed, before anyone is billed)
//
// Opening the table, or putting a view in front of it, would let anyone
// with the anon key read the agreed rate and baseline of every client.
// This answers those two questions and returns nothing else.
//
//
// WHAT IT WILL NOT DO
//
// It never lists signatures. Both actions require a deal_id, which is a
// uuid, so there is nothing to enumerate — you can only ask about a deal
// whose id you already have.
//
// It never returns signature_image_base64, client_ip, user_agent or
// pdf_storage_path. Those stay behind the service key.
// ============================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://fcgbusobfdwnpoqyuzoe.supabase.co";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Exactly what the dashboard needs, and nothing more. Adding a column here
// widens what the browser side can see, so add one only when a screen
// genuinely needs it.
const TERMS_COLUMNS =
  "id,deal_id,client_email,client_company_name,created_at," +
  "baseline_leads_numeral,min_ppc_visitors_numeral," +
  "per_lead_rate,term_selected,document_hash,contract_version";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function reply(status: number, obj: unknown): Response {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return reply(405, { ok: false, error: "This endpoint takes POST." });
  }

  try {
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!serviceKey) {
      return reply(500, {
        ok: false,
        error: "SUPABASE_SERVICE_ROLE_KEY not set on this function.",
      });
    }
    const supabase = createClient(SUPABASE_URL, serviceKey);

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return reply(400, { ok: false, error: "Body was not valid JSON." });
    }

    const action = String(body.action || "");
    if (action !== "status" && action !== "terms") {
      return reply(400, { ok: false, error: "action must be status or terms." });
    }

    // ------------------------------------------------------------------
    // status — which of these deals have been signed?
    //
    // Answers only about ids the dashboard already has in front of it.
    // It cannot be used to discover a deal.
    // ------------------------------------------------------------------
    if (action === "status") {
      const raw = Array.isArray(body.deal_ids) ? body.deal_ids : [];
      const ids = raw
        .map((v) => String(v || "").trim())
        .filter((v) => UUID_RE.test(v));

      if (ids.length === 0) return reply(200, { ok: true, signed: {} });
      if (ids.length > 200) {
        return reply(400, {
          ok: false,
          error: "Too many deal ids in one request (limit 200).",
        });
      }

      const { data, error } = await supabase
        .from("agreement_signatures")
        .select("deal_id,created_at")
        .in("deal_id", ids)
        .order("created_at", { ascending: false });

      if (error) {
        return reply(502, {
          ok: false,
          error: "Could not read the signatures table: " + error.message,
        });
      }

      // Latest signature wins for each deal.
      const signed: Record<string, string> = {};
      for (const row of data || []) {
        const id = String(row.deal_id || "");
        if (id && !signed[id]) signed[id] = row.created_at;
      }
      return reply(200, { ok: true, signed });
    }

    // ------------------------------------------------------------------
    // terms — what did they actually sign?
    //
    // This is what the comparison at "Mark set up" runs against, so it is
    // the half that protects the billing figures.
    //
    // The email fallback is for agreements signed in July, before deal_id
    // existed. It is only reached when the deal_id lookup finds nothing,
    // and a valid deal_id still has to have been asked for — so it cannot
    // be used to look a signature up by email alone.
    // ------------------------------------------------------------------
    const dealId = String(body.deal_id || "").trim();
    if (!UUID_RE.test(dealId)) {
      return reply(400, { ok: false, error: "deal_id must be a uuid." });
    }

    const byDeal = await supabase
      .from("agreement_signatures")
      .select(TERMS_COLUMNS)
      .eq("deal_id", dealId)
      .order("created_at", { ascending: false })
      .limit(1);

    if (byDeal.error) {
      return reply(502, {
        ok: false,
        error: "Could not read the signatures table: " + byDeal.error.message,
      });
    }

    let sig = (byDeal.data && byDeal.data[0]) || null;
    let matchedBy = sig ? "deal_id" : "";

    const email = String(body.email || "").trim();
    if (!sig && email && email.length < 320) {
      const byEmail = await supabase
        .from("agreement_signatures")
        .select(TERMS_COLUMNS)
        .ilike("client_email", email)
        .order("created_at", { ascending: false })
        .limit(1);

      if (byEmail.error) {
        return reply(502, {
          ok: false,
          error: "Could not read the signatures table: " + byEmail.error.message,
        });
      }
      if (byEmail.data && byEmail.data[0]) {
        sig = byEmail.data[0];
        matchedBy = "email";
      }
    }

    return reply(200, { ok: true, sig, matched_by: matchedBy });
  } catch (err) {
    // Said out loud, never swallowed. A read that failed and a deal nobody
    // has signed look identical to the dashboard, and only one of them is
    // a problem the person needs to know about.
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("mw-signature fatal:", msg);
    return reply(500, { ok: false, error: msg });
  }
});
