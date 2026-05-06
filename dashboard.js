// ============================================
// MOBILEWISE AI ANALYTICS ENGINE v3.1
// Client Performance Analytics + Demo Mode
// ============================================

const SUPABASE_URL = "https://fcgbusobfdwnpoqyuzoe.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjZ2J1c29iZmR3bnBvcXl1em9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzNDA2MjMsImV4cCI6MjA4NTkxNjYyM30.FHEZnxuGHSn_Z3gw9d_Txtfz5Jn55J6qonl8rnA3gPk";

let supabaseClient = null;
let currentClientId = 'mortgage-assist-demo';
let isDemoMode = false;

// ============================================
// ANALYTICS SETTINGS & DATA
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
    if (window.supabase && window.supabase.createClient) {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Analytics Engine: Supabase connected');
    } else {
        console.warn('⚠️ Supabase SDK not loaded. Using local storage.');
    }

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

    loadAnalyticsSettings();
    
    if (!isDemoMode) {
        setupRealtimeListener();
        setInterval(refreshAnalytics, 30000);
        
        // ===== LIVE ACTIVITY TICKER =====
        var tickerChannel = supabaseClient.channel('analytics-live-ticker');
        tickerChannel.on('broadcast', { event: 'analytics_event' }, function(payload) {
            var event = payload.payload;
            if (event.client_id !== currentClientId) return;
            
            var ticker = document.getElementById('live-activity');
            var text = document.getElementById('live-activity-text');
            if (!ticker || !text) return;
            
            switch(event.event_type) {
                case 'splash_view': 
                    text.textContent = '👀 Visitor viewing splash screen'; 
                    break;
                case 'activate_tess': 
                    text.textContent = '🤖 Visitor activated Tess'; 
                    break;
                case 'prequal_start': 
                    text.textContent = '📋 Pre-qualification interview started'; 
                    break;
                case 'lead_captured': 
                    text.textContent = '📧 Lead captured: ' + (event.event_data?.email || 'new lead'); 
                    break;
                case 'phone_connect': 
                    text.textContent = '📞 Phone call initiated'; 
                    break;
                default:
                    text.textContent = '🟢 Visitor activity detected';
            }
            
            ticker.style.display = 'block';
            setTimeout(function() { ticker.style.display = 'none'; }, 4000);
        });
        tickerChannel.subscribe();
        console.log('👂 Live activity ticker active');
    }
}

// ============================================
// REAL-TIME LISTENER
// ============================================

function setupRealtimeListener() {
    if (!supabaseClient) return;
    
    const channel = supabaseClient.channel('analytics-live');
    
    channel.on('broadcast', { event: 'analytics_event' }, (payload) => {
        const event = payload.payload;
        if (event.client_id === currentClientId) {
            trackAnalyticsEvent(event.event_type, event.event_data || {});
        }
    });
    
    channel.subscribe();
    console.log('👂 Real-time analytics listener active');
}

// ============================================
// SETTINGS MANAGEMENT
// ============================================

function loadAnalyticsSettings() {
    const saved = localStorage.getItem('mobilewise_analytics_settings');
    if (saved) {
        analyticsSettings = JSON.parse(saved);
    }
    
    const bl = document.getElementById('analyticsBaselineLeads');
    const bv = document.getElementById('analyticsBaselineVisitors');
    const pr = document.getElementById('analyticsPerLeadRate');
    if (bl) bl.textContent = analyticsSettings.baselineLeads;
    if (bv) bv.textContent = analyticsSettings.baselineVisitors.toLocaleString();
    if (pr) pr.textContent = '$' + analyticsSettings.perLeadRate;
    
    loadAnalyticsData();
}

function loadAnalyticsData() {
    // ===== DEMO MODE: Load sample data =====
    if (isDemoMode) {
        console.log('📊 Loading demo analytics data...');
        analyticsData = {
            totalLeads: 42,
            phoneCalls: 7,
            tessClicks: 128,
            totalVisitors: 2100,
            completedInterviews: 38,
            sessions: [
                { type: 'click', time: Date.now() - 3600000 },
                { type: 'interview_start', time: Date.now() - 3500000 },
                { type: 'click', time: Date.now() - 1800000 },
                { type: 'interview_start', time: Date.now() - 1700000 }
            ],
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
        updateTime();
        return;
    }
    
    // ===== NORMAL MODE: Load from localStorage =====
    const saved = localStorage.getItem('mobilewise_analytics_data');
    if (saved) {
        analyticsData = JSON.parse(saved);
    }
    refreshAnalyticsDisplay();
    updateTime();
}

function saveAnalyticsData() {
    if (isDemoMode) return; // Don't overwrite demo data
    localStorage.setItem('mobilewise_analytics_data', JSON.stringify(analyticsData));
}

// ============================================
// EVENT TRACKING
// ============================================

function trackAnalyticsEvent(eventType, eventData = {}) {
    if (isDemoMode) return;
    
    const now = new Date();
    const hour = now.getHours();
    const hourLabel = hour + ':00';
    
    switch(eventType) {
        case 'activate_tess':
        case 'splash_view':
            analyticsData.tessClicks++;
            analyticsData.totalVisitors++;
            analyticsData.sessions.push({ type: 'click', time: now.getTime() });
            break;
            
        case 'prequal_start':
            analyticsData.sessions.push({ type: 'interview_start', time: now.getTime() });
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
    }
    
    if (!analyticsData.peakHours[hourLabel]) {
        analyticsData.peakHours[hourLabel] = 0;
    }
    analyticsData.peakHours[hourLabel]++;
    
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
    const beforeRate = settings.baselineVisitors > 0 ? ((settings.baselineLeads / settings.baselineVisitors) * 100).toFixed(1) : 0;
    const afterRate = data.totalVisitors > 0 ? ((data.totalLeads / data.totalVisitors) * 100).toFixed(1) : 0;
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
    
    let totalDuration = 0;
    let sessionCount = 0;
    for (let i = 0; i < data.sessions.length - 1; i++) {
        if (data.sessions[i].type === 'click' && data.sessions[i+1].type === 'interview_start') {
            totalDuration += (data.sessions[i+1].time - data.sessions[i].time) / 1000;
            sessionCount++;
        }
    }
    const avgSession = sessionCount > 0 ? Math.round(totalDuration / sessionCount) : 0;
    const minutes = Math.floor(avgSession / 60);
    const seconds = avgSession % 60;
    const avgSessionEl = document.getElementById('analyticsAvgSession');
    if (avgSessionEl) avgSessionEl.textContent = sessionCount > 0 ? minutes + ':' + (seconds < 10 ? '0' : '') + seconds : '—';
    
    let peakHour = '--:--';
    let peakCount = 0;
    for (const [hour, count] of Object.entries(data.peakHours)) {
        if (count > peakCount) {
            peakCount = count;
            peakHour = hour;
        }
    }
    const peakEl = document.getElementById('analyticsPeakHour');
    if (peakEl) peakEl.textContent = peakHour;
    
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
    
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date().getDay();
    
    const barData = [];
    for (let i = 6; i >= 0; i--) {
        const dayIndex = (today - i + 7) % 7;
        const clicks = analyticsData.tessClicks > 0 ? 
            Math.floor(Math.random() * Math.max(analyticsData.tessClicks, 10)) : 
            Math.floor(Math.random() * 5);
        barData.push({ label: days[dayIndex], value: clicks });
    }
    
    const maxVal = Math.max(...barData.map(d => d.value), 1);
    
    container.innerHTML = barData.map(d => {
        const height = (d.value / maxVal) * 140;
        const color = d.value > 0 ? 
            'linear-gradient(180deg, #f8c400, #d4a000)' : 
            'linear-gradient(180deg, #3a4050, #2a2f3f)';
        return `<div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:4px;">
            <span style="color: rgba(255,255,255,0.6); font-size: 0.7rem;">${d.value}</span>
            <div style="width:100%; height:${height}px; background:${color}; border-radius:6px 6px 0 0; min-height:4px;"></div>
        </div>`;
    }).join('');
    
    labels.innerHTML = barData.map(d => 
        `<span style="flex:1; text-align:center;">${d.label}</span>`
    ).join('');
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
    alert('Report printed to console. Press F12 to view, or copy/paste to send.');
}

function refreshAnalytics() {
    loadAnalyticsData();
    refreshAnalyticsDisplay();
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

// Expose for testing
window.trackAnalyticsEvent = trackAnalyticsEvent;
window.analyticsData = analyticsData;
window.analyticsSettings = analyticsSettings;
window.refreshAnalytics = refreshAnalytics;
window.exportAnalyticsReport = exportAnalyticsReport;
window.updateAnalyticsSettings = updateAnalyticsSettings;