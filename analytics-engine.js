// ============================================
// MOBILEWISE AI ANALYTICS ENGINE v4.0
// Supabase-Powered, Per-Client Analytics
// ============================================

const SUPABASE_URL = "https://fcgbusobfdwnpoqyuzoe.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjZ2J1c29iZmR3bnBvcXl1em9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzNDA2MjMsImV4cCI6MjA4NTkxNjYyM30.FHEZnxuGHSn_Z3gw9d_Txtfz5Jn55J6qonl8rnA3gPk";

let supabaseClient = null;
let currentClientId = 'mortgage-assist-demo';
let isDemoMode = false;
let analyticsRealtimeChannel = null;

// ============================================
// ANALYTICS SETTINGS (per-client, from Supabase)
// ============================================

let analyticsSettings = {
    baselineLeads: 20,
    baselineVisitors: 2000,
    perLeadRate: 150
};

let analyticsData = {
    totalLeads: 0,
    phoneCalls: 0,
    tessClicks: 0,
    totalVisitors: 0,
    completedInterviews: 0,
    sessions: [],
    peakHours: {},
    recentActivity: []
};

// ============================================
// INITIALIZATION
// ============================================

async function initAnalytics() {
    // Connect to Supabase
    if (window.supabase && window.supabase.createClient) {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Analytics Engine: Supabase connected');
    } else {
        console.warn('⚠️ Supabase SDK not loaded. Using local storage fallback.');
    }

    // Get client ID from URL params
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('clientId')) {
        currentClientId = urlParams.get('clientId');
    }
    if (urlParams.get('demo') === 'true') {
        isDemoMode = true;
    }
    
    const clientInfo = document.getElementById('clientInfo');
    if (clientInfo) {
        clientInfo.textContent = `Client: ${currentClientId}${isDemoMode ? ' (Demo Mode)' : ''}`;
    }

    // Load settings (from Supabase if available, else localStorage)
    await loadAnalyticsSettings();
    
    // Load analytics data from Supabase
    if (!isDemoMode && supabaseClient) {
        await loadAnalyticsFromSupabase();
        setupRealtimeListener();
        setInterval(() => loadAnalyticsFromSupabase(), 30000);
    } else if (isDemoMode) {
        loadDemoData();
    } else {
        loadAnalyticsFromLocalStorage();
    }
}

// ============================================
// LOAD SETTINGS FROM SUPABASE
// ============================================

async function loadAnalyticsSettings() {
    if (supabaseClient && !isDemoMode) {
        try {
            const { data, error } = await supabaseClient
                .from('clients')
                .select('baseline_leads, baseline_visitors, per_lead_rate')
                .eq('client_id', currentClientId)
                .single();
            
            if (data && !error) {
                analyticsSettings = {
                    baselineLeads: data.baseline_leads || 20,
                    baselineVisitors: data.baseline_visitors || 2000,
                    perLeadRate: data.per_lead_rate || 150
                };
                console.log('📋 Settings loaded from Supabase:', analyticsSettings);
            }
        } catch (e) {
            console.warn('⚠️ Could not load settings from Supabase, using defaults');
        }
    }
    
    // Update display
    const bl = document.getElementById('analyticsBaselineLeads');
    const bv = document.getElementById('analyticsBaselineVisitors');
    const pr = document.getElementById('analyticsPerLeadRate');
    if (bl) bl.textContent = analyticsSettings.baselineLeads;
    if (bv) bv.textContent = analyticsSettings.baselineVisitors.toLocaleString();
    if (pr) pr.textContent = '$' + analyticsSettings.perLeadRate;
}

// ============================================
// LOAD ANALYTICS FROM SUPABASE
// ============================================

async function loadAnalyticsFromSupabase() {
    if (!supabaseClient) return;
    
    try {
        // Get event counts grouped by type
        const { data: eventCounts, error: countError } = await supabaseClient
            .from('analytics_events')
            .select('event_type, created_at')
            .eq('client_id', currentClientId);
        
        if (countError) throw countError;
        
        // Count by event type
        let totalLeads = 0;
        let phoneCalls = 0;
        let tessClicks = 0;
        let totalVisitors = 0;
        let completedInterviews = 0;
        const peakHours = {};
        const dailyClicks = {}; // For 30-day chart
        
        (eventCounts || []).forEach(e => {
            const d = new Date(e.created_at);
            const hourLabel = d.getHours() + ':00';
            const dayKey = d.toISOString().split('T')[0]; // YYYY-MM-DD
            
            switch(e.event_type) {
                case 'splash_view': totalVisitors++; break;
                case 'activate_tess': tessClicks++; totalVisitors++; break;  // count clicks as visitors too 
                    peakHours[hourLabel] = (peakHours[hourLabel] || 0) + 1;
                    dailyClicks[dayKey] = (dailyClicks[dayKey] || 0) + 1;
                    break;
                case 'lead_captured': totalLeads++; completedInterviews++; break;
                case 'phone_connect': phoneCalls++; break;
                case 'prequal_complete': completedInterviews++; break;
            }
        });
        
        // Get recent activity
        const { data: recentEvents, error: recentError } = await supabaseClient
            .from('analytics_events')
            .select('event_type, event_data, created_at')
            .eq('client_id', currentClientId)
            .in('event_type', ['lead_captured', 'phone_connect'])
            .order('created_at', { ascending: false })
            .limit(50);
        
        const recentActivity = (recentEvents || []).map(e => ({
            type: e.event_type === 'lead_captured' ? 'lead' : 'phone',
            email: e.event_data?.email || 'Unknown',
            value: analyticsSettings.perLeadRate,
            time: new Date(e.created_at).toLocaleString()
        }));
        
        analyticsData = {
            totalLeads,
            phoneCalls,
            tessClicks,
            totalVisitors,
            completedInterviews,
            peakHours,
            dailyClicks,  // NEW: real daily data for the chart
            recentActivity
        };
        
        console.log('📊 Loaded from Supabase:', totalLeads, 'leads,', phoneCalls, 'calls,', tessClicks, 'clicks');
        
    } catch (e) {
        console.error('❌ Error loading from Supabase:', e.message);
    }
    
    refreshAnalyticsDisplay();
}

// ============================================
// REAL-TIME LISTENER
// ============================================

function setupRealtimeListener() {
    if (!supabaseClient) return;
    
    // Unsubscribe existing channel
    if (analyticsRealtimeChannel) {
        supabaseClient.removeChannel(analyticsRealtimeChannel);
    }
    
    analyticsRealtimeChannel = supabaseClient.channel('analytics-live-' + currentClientId);
    
    analyticsRealtimeChannel.on('broadcast', { event: 'analytics_event' }, (payload) => {
        const event = payload.payload;
        if (event.client_id === currentClientId) {
            console.log('📡 Realtime event:', event.event_type);
            // Refresh from Supabase to get accurate counts
            loadAnalyticsFromSupabase();
        }
    });
    
    analyticsRealtimeChannel.subscribe();
    console.log('👂 Real-time listener active for', currentClientId);
}

// ============================================
// DEMO MODE
// ============================================

function loadDemoData() {
    console.log('📊 Loading demo analytics data...');
    analyticsData = {
        totalLeads: 42,
        phoneCalls: 7,
        tessClicks: 128,
        totalVisitors: 2100,
        completedInterviews: 38,
        sessions: [],
        peakHours: {
            '9:00': 12, '10:00': 18, '11:00': 22, '12:00': 15,
            '13:00': 10, '14:00': 24, '15:00': 20, '16:00': 7
        },
        recentActivity: [
            { type: 'lead', email: 'john@abcmortgage.com', value: 150, time: 'Today 2:45 PM' },
            { type: 'lead', email: 'sarah@homeloans.com', value: 150, time: 'Today 1:30 PM' },
            { type: 'phone', time: 'Today 12:15 PM' },
            { type: 'lead', email: 'mike@premierlending.com', value: 150, time: 'Today 11:00 AM' },
            { type: 'lead', email: 'lisa@coastalfunding.com', value: 150, time: 'Today 10:20 AM' },
            { type: 'lead', email: 'david@peaklending.com', value: 150, time: 'Yesterday 4:10 PM' },
            { type: 'phone', time: 'Yesterday 3:00 PM' },
            { type: 'lead', email: 'amanda@sunrisemortgage.com', value: 150, time: 'Yesterday 1:45 PM' }
        ]
    };
    analyticsSettings = { baselineLeads: 20, baselineVisitors: 2000, perLeadRate: 150 };
    refreshAnalyticsDisplay();
}

// ============================================
// LOCAL STORAGE FALLBACK
// ============================================

function loadAnalyticsFromLocalStorage() {
    const saved = localStorage.getItem('mobilewise_analytics_data');
    if (saved) {
        analyticsData = JSON.parse(saved);
    }
    refreshAnalyticsDisplay();
}

function saveAnalyticsData() {
    localStorage.setItem('mobilewise_analytics_data', JSON.stringify(analyticsData));
}

// ============================================
// EVENT TRACKING (called by bridge or Realtime)
// ============================================

function trackAnalyticsEvent(eventType, eventData = {}) {
    const now = new Date();
    
    switch(eventType) {
        case 'splash_view':
            analyticsData.totalVisitors++;
            break;
        case 'activate_tess':
            analyticsData.tessClicks++;
            break;
        case 'lead_captured':
            analyticsData.totalLeads++;
            analyticsData.completedInterviews++;
            analyticsData.recentActivity.unshift({
                type: 'lead',
                email: eventData.email || 'Unknown',
                value: analyticsSettings.perLeadRate,
                time: now.toLocaleString()
            });
            if (analyticsData.recentActivity.length > 50) {
                analyticsData.recentActivity = analyticsData.recentActivity.slice(0, 50);
            }
            break;
        case 'phone_connect':
            analyticsData.phoneCalls++;
            analyticsData.recentActivity.unshift({
                type: 'phone',
                time: now.toLocaleString()
            });
            break;
        case 'prequal_complete':
            analyticsData.completedInterviews++;
            break;
    }
    
    saveAnalyticsData();
    refreshAnalyticsDisplay();
}

// ============================================
// DISPLAY REFRESH
// ============================================

function refreshAnalyticsDisplay() {
    const settings = analyticsSettings;
    const data = analyticsData;
    
    // Money row
    const totalLeadsEl = document.getElementById('analyticsTotalLeads');
    const incrementalEl = document.getElementById('analyticsIncrementalLeads');
    const phoneEl = document.getElementById('analyticsPhoneCalls');
    const revenueEl = document.getElementById('analyticsRevenue');
    const revenueDetailEl = document.getElementById('analyticsRevenueDetail');
    
    if (totalLeadsEl) totalLeadsEl.textContent = data.totalLeads;
    
    const incremental = Math.max(0, data.totalLeads - settings.baselineLeads);
    if (incrementalEl) {
        incrementalEl.textContent = '+' + incremental + ' above baseline';
        incrementalEl.style.color = incremental > 0 ? '#4caf50' : '#f44336';
    }
    
    if (phoneEl) phoneEl.textContent = data.phoneCalls;
    
    const revenue = incremental * settings.perLeadRate;
    if (revenueEl) revenueEl.textContent = '$' + revenue.toLocaleString();
    if (revenueDetailEl) revenueDetailEl.textContent = incremental + ' leads × $' + settings.perLeadRate;
    
   // Before vs After
// Use total visitors (splash + clicks) for more accurate conversion rate
const totalVisitors = Math.max(data.totalVisitors, data.tessClicks, 1);
const beforeRate = settings.baselineVisitors > 0 ? ((settings.baselineLeads / settings.baselineVisitors) * 100).toFixed(1) : 0;
const afterRate = ((data.totalLeads / totalVisitors) * 100).toFixed(1);
const improvement = beforeRate > 0 ? (((afterRate - beforeRate) / beforeRate) * 100).toFixed(0) : 0;
    
    const beforeLeadsEl = document.getElementById('analyticsBeforeLeads');
    const beforeRateEl = document.getElementById('analyticsBeforeRate');
    const afterLeadsEl = document.getElementById('analyticsAfterLeads');
    const afterRateEl = document.getElementById('analyticsAfterRate');
    const improvementEl = document.getElementById('analyticsImprovement');
    
    if (beforeLeadsEl) beforeLeadsEl.textContent = settings.baselineLeads;
    if (beforeRateEl) beforeRateEl.textContent = beforeRate + '% conversion';
    if (afterLeadsEl) afterLeadsEl.textContent = data.totalLeads;
    if (afterRateEl) afterRateEl.textContent = afterRate + '% conversion';
    
    if (improvementEl) {
        improvementEl.textContent = improvement + '%';
        improvementEl.style.color = improvement > 0 ? '#4caf50' : improvement < 0 ? '#f44336' : 'white';
    }
    
    // Win statement
    const winEl = document.getElementById('analyticsWinStatement');
    if (winEl) {
        if (incremental > 0) {
            winEl.innerHTML = '📈 Tess is delivering <strong>' + incremental + ' more leads</strong> than forms alone — a <strong>' + improvement + '% increase</strong>';
            winEl.style.color = '#4caf50';
        } else if (incremental === 0 && data.totalLeads > 0) {
            winEl.innerHTML = '📊 Tess is matching your current form performance. Room to grow!';
            winEl.style.color = '#f8c400';
        } else {
            winEl.innerHTML = '⏳ Waiting for lead data. Events will appear as prospects engage with Tess.';
            winEl.style.color = 'rgba(255,255,255,0.5)';
        }
    }
    
    // Engagement metrics
    const clicksEl = document.getElementById('analyticsClicks');
    if (clicksEl) clicksEl.textContent = data.tessClicks;
    
    const avgSessionEl = document.getElementById('analyticsAvgSession');
    if (avgSessionEl) avgSessionEl.textContent = '—';
    
    const peakEl = document.getElementById('analyticsPeakHour');
    if (peakEl) peakEl.textContent = '--:--';
    
    const completionRate = data.tessClicks > 0 ? ((data.completedInterviews / data.tessClicks) * 100).toFixed(0) : 0;
    const completionEl = document.getElementById('analyticsCompletionRate');
    if (completionEl) completionEl.textContent = completionRate + '%';
    
    renderEngagementChart();
    renderRecentFeed();
    updateTime();
}

// ============================================
// ENGAGEMENT BAR CHART
// ============================================

function renderEngagementChart() {
    const container = document.getElementById('engagementBarChart');
    const labels = document.getElementById('engagementBarLabels');
    if (!container || !labels) return;
    
    // Build last 30 days from real data
    const barData = [];
    const now = new Date();
    
    for (let i = 29; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const dayKey = d.toISOString().split('T')[0];
        const dayNum = d.getDate();
        const isToday = i === 0;
        
        // Pull from real dailyClicks data
        const clicks = (analyticsData.dailyClicks && analyticsData.dailyClicks[dayKey]) || 0;
        barData.push({ label: dayNum, value: clicks, isToday, dayKey });
    }
    
    const maxVal = Math.max(...barData.map(d => d.value), 1);
    
    // Make container scrollable
    if (container.parentElement) {
        container.parentElement.style.overflowX = 'auto';
    }
    
    container.innerHTML = barData.map((d) => {
        const height = Math.max((d.value / maxVal) * 120, 2);
        const color = d.isToday ? 
            'linear-gradient(180deg, #f8c400, #d4a000)' : 
            (d.value > 0 ? 'linear-gradient(180deg, #3a7080, #2a5060)' : 'linear-gradient(180deg, #2a3040, #1a2030)');
        const opacity = d.isToday ? '0.9' : '0.5';
        return `<div style="flex:0 0 24px; display:flex; flex-direction:column; align-items:center; gap:2px;" title="${d.dayKey}: ${d.value} clicks">
            <span style="color: rgba(255,255,255,${opacity}); font-size: 0.55rem;">${d.value || ''}</span>
            <div style="width:18px; height:${height}px; background:${color}; border-radius:4px 4px 0 0; min-height:2px;"></div>
        </div>`;
    }).join('');
    
    labels.innerHTML = barData.map((d, i) => {
        const showLabel = d.label % 5 === 0 || i === 29;
        return `<span style="flex:0 0 24px; text-align:center; color: rgba(255,255,255,${showLabel ? '0.6' : '0.2'}); font-size: 0.55rem;">${showLabel ? d.label : ''}</span>`;
    }).join('');
}

// ============================================
// RECENT ACTIVITY FEED
// ============================================

function renderRecentFeed() {
    const feed = document.getElementById('analyticsRecentFeed');
    if (!feed) return;
    
    if (analyticsData.recentActivity.length === 0) {
        feed.innerHTML = '<div style="color: rgba(255,255,255,0.4); text-align: center; padding: 30px;">No leads yet this period. Events will appear here in real time.</div>';
        return;
    }
    
    feed.innerHTML = analyticsData.recentActivity.slice(0, 10).map(event => {
        const icon = event.type === 'lead' ? '📧' : '📞';
        const detail = event.type === 'lead' ? 
            `Lead captured: ${event.email} — $${event.value}` : 
            'Phone call initiated';
        return `<div style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 1.1rem;">${icon}</span>
            <span style="color: white; font-size: 0.85rem; flex:1;">${detail}</span>
            <span style="color: rgba(255,255,255,0.3); font-size: 0.7rem;">${event.time}</span>
        </div>`;
    }).join('');
}

// ============================================
// EXPORT & UTILITIES
// ============================================

function exportAnalyticsReport() {
    const settings = analyticsSettings;
    const data = analyticsData;
    const incremental = Math.max(0, data.totalLeads - settings.baselineLeads);
    const revenue = incremental * settings.perLeadRate;
    
    const report = `
MOBILEWISE AI — CLIENT PERFORMANCE REPORT
==========================================
Client: ${currentClientId}
Generated: ${new Date().toLocaleString()}

BASELINE: ${settings.baselineLeads} leads/month from forms
CURRENT: ${data.totalLeads} leads/month with Tess
INCREMENTAL: ${incremental} additional leads
REVENUE: $${revenue.toLocaleString()} (${incremental} × $${settings.perLeadRate})

ENGAGEMENT:
  Tess Clicks: ${data.tessClicks}
  Phone Calls: ${data.phoneCalls}
  Completion Rate: ${document.getElementById('analyticsCompletionRate')?.textContent || '0%'}

RECENT ACTIVITY:
${data.recentActivity.slice(0, 10).map(e => `  [${e.time}] ${e.type === 'lead' ? 'Lead: ' + e.email : 'Phone Call'}`).join('\n')}
`;
    
    console.log(report);
    
    // Also download as text file
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mobilewise-report-${currentClientId}-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

function refreshAnalytics() {
    if (!isDemoMode && supabaseClient) {
        loadAnalyticsFromSupabase();
    } else {
        refreshAnalyticsDisplay();
    }
}

function updateTime() {
    const now = new Date();
    const timeEl = document.getElementById('lastUpdated');
    if (timeEl) {
        timeEl.textContent = now.toLocaleTimeString('en-US', {
            hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
    }
}

function logout() {
    if (confirm('Logout?')) {
        window.location.href = '/';
    }
}

// ============================================
// INIT
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initAnalytics();
});

// Expose globally
window.trackAnalyticsEvent = trackAnalyticsEvent;
window.analyticsData = analyticsData;
window.analyticsSettings = analyticsSettings;
window.refreshAnalytics = refreshAnalytics;
window.exportAnalyticsReport = exportAnalyticsReport;