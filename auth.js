// ============================================
// MOBILEWISE AI — CLIENT PORTAL AUTH GATE
// ============================================

(async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const clientId = urlParams.get('clientId');
    const portalKey = urlParams.get('key');

    // No clientId? Show error
    if (!clientId) {
        document.body.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:center;min-height:100vh;background:#060b14;color:white;font-family:system-ui,sans-serif;text-align:center;padding:20px;">
                <div>
                    <div style="font-size:4rem;margin-bottom:16px;">🔒</div>
                    <h1 style="color:#f8c400;margin-bottom:8px;">Access Restricted</h1>
                    <p style="color:rgba(255,255,255,0.5);">Please use the link provided by your account manager.</p>
                </div>
            </div>`;
        return;
    }

    // Check portal key against Supabase
    const SUPABASE_URL = "https://fcgbusobfdwnpoqyuzoe.supabase.co";
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjZ2J1c29iZmR3bnBvcXl1em9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzNDA2MjMsImV4cCI6MjA4NTkxNjYyM30.FHEZnxuGHSn_Z3gw9d_Txtfz5Jn55J6qonl8rnA3gPk";

    try {
        const { createClient } = supabase;
        const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
        const { data, error } = await sb
            .from('clients')
            .select('portal_key, name')
            .eq('client_id', clientId)
            .single();

        // If client has no portal key set, allow access (not configured yet)
        if (data && !data.portal_key) {
            console.log('✅ No portal key set — allowing access');
            return; // Allow the dashboard to load
        }

        // If key matches, allow access
        if (data && data.portal_key === portalKey) {
            console.log('✅ Portal key valid — welcome to', data.name);
            return; // Allow the dashboard to load
        }

        // Key doesn't match — deny
        document.body.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:center;min-height:100vh;background:#060b14;color:white;font-family:system-ui,sans-serif;text-align:center;padding:20px;">
                <div>
                    <div style="font-size:4rem;margin-bottom:16px;">🔒</div>
                    <h1 style="color:#f44336;margin-bottom:8px;">Invalid Access Key</h1>
                    <p style="color:rgba(255,255,255,0.5);">The link you used is incorrect or has expired.</p>
                    <p style="color:rgba(255,255,255,0.3);font-size:0.85rem;margin-top:12px;">Please contact your account manager for a new link.</p>
                </div>
            </div>`;
    } catch(e) {
        console.error('Auth check failed:', e);
        // If Supabase is down, allow access rather than blocking
        console.warn('⚠️ Auth check failed — allowing access');
    }
})();