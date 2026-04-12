// MobileWise AI Health Client - Add to any client site with:
// <script src="https://mobilewise.netlify.app/health/health-client.js?clientId=YOUR_CLIENT_ID"></script>

(function() {
    const urlParams = new URLSearchParams(window.location.search);
    let clientId = urlParams.get('clientId');
    
    if (!clientId) {
        const scripts = document.getElementsByTagName('script');
        for (let script of scripts) {
            const src = script.src;
            if (src && src.includes('health-client.js')) {
                const match = src.match(/clientId=([^&]+)/);
                if (match) clientId = decodeURIComponent(match[1]);
                break;
            }
        }
    }
    
    if (!clientId) {
        console.warn('⚠️ Health Client: No clientId provided. Add ?clientId=YOUR_ID to script src');
        return;
    }
    
    const SUPABASE_URL = "https://fcgbusobfdwnpoqyuzoe.supabase.co";
    const SUPABASE_ANON_KEY = "sb_publishable_whfuQ3XwtHhjwC-VLG2Z6A_L8vv_EFX";
    
    let supabase;
    let lastPingTime = 0;
    
    async function init() {
        const { createClient } = window.supabase;
        if (!createClient) {
            await new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        }
        
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        const channel = supabase.channel('health-monitor');
        
        channel.on('broadcast', { event: 'ping_all' }, (payload) => {
            sendHeartbeat();
        });
        
        await channel.subscribe();
        
        channel.send({
            type: 'broadcast',
            event: 'client_register',
            payload: {
                clientId: clientId,
                timestamp: Date.now(),
                userAgent: navigator.userAgent,
                url: window.location.href
            }
        });
        
        setInterval(sendHeartbeat, 25000);
        sendHeartbeat();
        
        console.log(`🩺 Health Client active for: ${clientId}`);
    }
    
    function sendHeartbeat() {
        if (!supabase) return;
        const start = performance.now();
        supabase.channel('health-monitor').send({
            type: 'broadcast',
            event: 'heartbeat',
            payload: {
                clientId: clientId,
                timestamp: Date.now(),
                latency: lastPingTime || 0
            }
        });
        lastPingTime = Math.round(performance.now() - start);
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();