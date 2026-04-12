// MobileWise AI Health Client - Fixed Version
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
        console.warn('⚠️ Health Client: No clientId provided');
        return;
    }
    
    const SUPABASE_URL = "https://fcgbusobfdwnpoqyuzoe.supabase.co";
    const SUPABASE_ANON_KEY = "sb_publishable_whfuQ3XwtHhjwC-VLG2Z6A_L8vv_EFX";
    
    let supabaseClient = null;  // FIXED: renamed variable
    let lastPingTime = 0;
    
    // Load Supabase SDK first
    function loadSupabaseSDK() {
        return new Promise((resolve, reject) => {
            if (window.supabase && window.supabase.createClient) {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
            script.onload = () => {
                const checkInterval = setInterval(() => {
                    if (window.supabase && window.supabase.createClient) {
                        clearInterval(checkInterval);
                        resolve();
                    }
                }, 100);
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    async function init() {
        await loadSupabaseSDK();
        
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);  // FIXED
        const channel = supabaseClient.channel('health-monitor');  // FIXED
        
        channel.on('broadcast', { event: 'ping_all' }, () => {
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
        if (!supabaseClient) return;  // FIXED
        const start = performance.now();
        supabaseClient.channel('health-monitor').send({  // FIXED
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