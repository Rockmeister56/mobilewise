import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://fcgbusobfdwnpoqyuzoe.supabase.co";
const EMAILJS_SERVICE_ID = "service_b9bppgb";
const EMAILJS_TEMPLATE_ID = "template_yf09xm5";
const EMAILJS_PUBLIC_KEY = "7-9oxa3UC3uKxtqGM";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function sendInvoiceEmail(clientName: string, clientEmail: string, invoiceData: any) {
  try {
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        template_params: {
          to_email: clientEmail,
          client_name: clientName,
          invoice_number: invoiceData.invoice_number,
          period: invoiceData.period,
          baseline_leads: invoiceData.baseline_leads,
          total_leads: invoiceData.total_leads,
          incremental_leads: invoiceData.incremental_leads,
          per_lead_rate: invoiceData.per_lead_rate,
          amount_due: invoiceData.amount_due,
        },
      }),
    });
    const text = await response.text();
    console.log("EmailJS response:", response.status, text);
    return response.ok;
  } catch (e) {
    console.error("Email send error:", e);
    return false;
  }
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!serviceKey) {
      return new Response(
        JSON.stringify({ success: false, error: "Service key not configured" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(SUPABASE_URL, serviceKey);

    const { data: clients, error: clientError } = await supabase
      .from("clients")
      .select("client_id, name, baseline_leads, per_lead_rate, metadata")
      .not("client_id", "is", null)
      .limit(50);

    if (clientError) {
      return new Response(
        JSON.stringify({ success: false, error: clientError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const periodEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    const periodStr = `${periodStart.toLocaleDateString()} - ${periodEnd.toLocaleDateString()}`;
    const results = [];

    for (const client of (clients || [])) {
      const baseline = client.baseline_leads || 20;
      const rate = client.per_lead_rate || 150;

      const { count, error: countError } = await supabase
        .from("analytics_events")
        .select("*", { count: "exact", head: true })
        .eq("client_id", client.client_id)
        .eq("event_type", "lead_captured")
        .gte("created_at", periodStart.toISOString())
        .lte("created_at", periodEnd.toISOString());

      if (countError) {
        results.push({ client: client.client_id, error: countError.message });
        continue;
      }

      const totalLeads = count || 0;
      const incremental = Math.max(0, totalLeads - baseline);
      const amountDue = incremental * rate;

      if (incremental === 0) {
        results.push({ client: client.client_id, status: "skipped", reason: "No incremental leads" });
        continue;
      }

      const { data: leads } = await supabase
        .from("analytics_events")
        .select("created_at, event_data")
        .eq("client_id", client.client_id)
        .eq("event_type", "lead_captured")
        .gte("created_at", periodStart.toISOString())
        .lte("created_at", periodEnd.toISOString())
        .order("created_at", { ascending: true })
        .limit(500);

      const lineItems = (leads || []).map((l: any) => ({
        date: new Date(l.created_at).toLocaleDateString(),
        email: l.event_data?.email || "Unknown",
        status: "Qualified"
      }));

      const monthStr = String(periodStart.getMonth() + 1).padStart(2, "0");
      const yearStr = String(periodStart.getFullYear()).slice(2);
      const invoiceNumber = `INV-${yearStr}${monthStr}-${client.client_id.substring(0, 4).toUpperCase()}`;

      const { error: invError } = await supabase.from("invoices").insert({
        client_id: client.client_id,
        invoice_number: invoiceNumber,
        period_start: periodStart.toISOString().split("T")[0],
        period_end: periodEnd.toISOString().split("T")[0],
        baseline_leads: baseline,
        total_leads: totalLeads,
        incremental_leads: incremental,
        per_lead_rate: rate,
        amount_due: amountDue,
        line_items: lineItems,
        status: "pending"
      });

      if (invError) {
        results.push({ client: client.client_id, error: invError.message });
        continue;
      }

      const metadata = client.metadata || {};
      const clientEmail = metadata?.modules?.emailConfig?.loanOfficerEmail || 
                    metadata?.modules?.emailConfig?.clientEmail || 
                    "mobilewise.ai@gmail.com";

      const emailSent = await sendInvoiceEmail(client.name || client.client_id, clientEmail, {
        invoice_number: invoiceNumber,
        period: periodStr,
        baseline_leads: baseline,
        total_leads: totalLeads,
        incremental_leads: incremental,
        per_lead_rate: rate,
        amount_due: amountDue,
      });

      if (emailSent) {
        await supabase.from("invoices").update({ status: "sent", sent_at: new Date().toISOString() }).eq("invoice_number", invoiceNumber);
      }

      results.push({ 
        client: client.client_id, 
        invoice: invoiceNumber, 
        amount: amountDue, 
        leads: incremental,
        email_sent: emailSent,
        email_to: clientEmail
      });
    }

    return new Response(
      JSON.stringify({ success: true, period: periodStr, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});