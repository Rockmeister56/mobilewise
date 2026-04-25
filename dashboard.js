// ============================================
// MOBILEWISE AI ANALYTICS ENGINE v2.0
// Real data from Supabase - No more mock data
// ============================================

const SUPABASE_URL = "https://fcgbusobfdwnpoqyuzoe.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjZ2J1c29iZmR3bnBvcXl1em9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzNDA2MjMsImV4cCI6MjA4NTkxNjYyM30.FHEZnxuGHSn_Z3gw9d_Txtfz5Jn55J6qonl8rnA3gPk";

let supabaseClient = null;
let currentClientId = 'mortgage-assist-demo'; // Default - can be changed

// ============================================
// INITIALIZATION
// ============================================

async function initAnalytics() {
    // Initialize Supabase
    if (window.supabase && window.supabase.createClient) {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('✅ Analytics Engine: Supabase connected');
    } else {
        console.warn('⚠️ Supabase SDK not loaded. Using mock data.');
        return;
    }

    // Get client ID from URL params
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('clientId')) {
        currentClientId = urlParams.get('clientId');
        document.getElementById('clientInfo').textContent = `Client: ${currentClientId}`;
    }

    // Load real data
    await refreshDashboard();
    
    // Set up real-time listener for live events
    setupRealtimeListener();
    
    // Auto-refresh every 30 seconds
    setInterval(refreshDashboard, 30000);
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
            console.log('📊 Live event:', event.event_type);
            updateLiveStats(); // Refresh counters immediately
        }
    });
    
    channel.subscribe();
    console.log('👂 Real-time analytics listener active');
}

// ============================================
// DATA FETCHING - REAL DATA FROM SUPABASE
// ============================================

async function fetchMetrics(startDate, endDate) {
    if (!supabaseClient) return null;
    
    try {
        // Fetch all events for this client in date range
        const { data: events, error } = await supabaseClient
            .from('analytics_events')
            .select('*')
            .eq('client_id', currentClientId)
            .gte('created_at', startDate)
            .lte('created_at', endDate)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Aggregate metrics from events
        return {
            splashViews: events.filter(e => e.event_type === 'splash_view').length,
            activateTess: events.filter(e => e.event_type === 'activate_tess').length,
            justBrowsing: events.filter(e => e.event_type === 'just_browsing').length,
            prequalStarts: events.filter(e => e.event_type === 'prequal_start').length,
            prequalCompletes: events.filter(e => e.event_type === 'prequal_complete').length,
            leadsCaptured: events.filter(e => e.event_type === 'lead_captured').length,
            totalEvents: events.length,
            rawEvents: events
        };
        
    } catch (error) {
        console.error('❌ Error fetching analytics:', error);
        return null;
    }
}

async function fetchSessionMetrics(startDate, endDate) {
    if (!supabaseClient) return null;
    
    try {
        const { data: sessions, error } = await supabaseClient
            .from('analytics_sessions')
            .select('*')
            .eq('client_id', currentClientId)
            .gte('started_at', startDate)
            .lte('started_at', endDate);
        
        if (error) throw error;
        
        // Calculate session stats
        const completedSessions = sessions.filter(s => s.ended_at);
        const avgDuration = completedSessions.length > 0 
            ? Math.round(completedSessions.reduce((sum, s) => {
                return sum + (new Date(s.ended_at) - new Date(s.started_at)) / 1000;
              }, 0) / completedSessions.length)
            : 0;
        
        return {
            totalSessions: sessions.length,
            avgDuration: avgDuration,
            deviceTypes: sessions.reduce((acc, s) => {
                acc[s.device_type || 'unknown'] = (acc[s.device_type || 'unknown'] || 0) + 1;
                return acc;
            }, {})
        };
        
    } catch (error) {
        console.error('❌ Error fetching sessions:', error);
        return null;
    }
}

// ============================================
// DASHBOARD UPDATES - REAL DATA
// ============================================

async function refreshDashboard() {
    const timeRange = document.getElementById('timeRange').value;
    const { startDate, endDate } = getDateRange(timeRange);
    
    const metrics = await fetchMetrics(startDate, endDate);
    const sessions = await fetchSessionMetrics(startDate, endDate);
    
    if (metrics) {
        updateAIEngagement(metrics);
        updateLiveStats(metrics);
        updateVoiceConversations(metrics, sessions);
        updateActionCenter(metrics);
        updateActivityTimeline(metrics.rawEvents?.slice(0, 7));
    }
    
    updateTime();
    updateROICalculation(metrics);
}

function getDateRange(range) {
    const now = new Date();
    let startDate;
    
    switch(range) {
        case 'today':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
        case 'yesterday':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
            break;
        case 'week':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
        case 'month':
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
        default:
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }
    
    return {
        startDate: startDate.toISOString(),
        endDate: now.toISOString()
    };
}

// ============================================
// UI UPDATES WITH REAL METRICS
// ============================================

function updateLiveStats(metrics) {
    const liveConvos = Math.min(metrics?.totalEvents || 0, 99);
    const todayLeads = metrics?.leadsCaptured || 0;
    const estimatedValue = todayLeads * 150;
    
    document.getElementById('liveConversations').textContent = liveConvos;
    document.getElementById('todayLeads').textContent = todayLeads;
    document.getElementById('estimatedValue').textContent = '$' + estimatedValue.toLocaleString();
}

function updateAIEngagement(metrics) {
    const clicks = metrics?.activateTess || 0;
    const totalViews = metrics?.splashViews || 1;
    const engagementRate = totalViews > 0 ? ((clicks / totalViews) * 100).toFixed(1) : 0;
    const avgSession = '—'; // Calculated from sessions
    
    document.getElementById('aiClicks').textContent = clicks;
    document.getElementById('engagementRate').textContent = engagementRate + '%';
    document.getElementById('avgSessionTime').textContent = avgSession;
    document.getElementById('aiTrend').textContent = `${clicks} clicks this period`;
    document.getElementById('aiTrend').style.color = clicks > 0 ? '#38b2ac' : '#a0aec0';
}

function updateVoiceConversations(metrics, sessions) {
    const totalConvos = metrics?.prequalStarts || 0;
    const completedConvos = metrics?.prequalCompletes || 0;
    const completionRate = totalConvos > 0 ? ((completedConvos / totalConvos) * 100).toFixed(0) : 0;
    const avgDuration = sessions?.avgDuration || 0;
    
    document.getElementById('totalConversations').textContent = totalConvos;
    document.getElementById('avgDuration').textContent = avgDuration + 's';
    document.getElementById('completionRate').textContent = completionRate + '%';
    document.getElementById('avgMessages').textContent = '—';
}

function updateActionCenter(metrics) {
    const totalClicks = metrics?.activateTess || 0;
    const leads = metrics?.leadsCaptured || 0;
    const conversionRate = totalClicks > 0 ? ((leads / totalClicks) * 100).toFixed(1) : 0;
    const pipelineValue = leads * 250 * 0.2;
    
    document.getElementById('actionCenterClicks').textContent = totalClicks;
    document.getElementById('actionTrend').textContent = `Conversion Rate: ${conversionRate}%`;
    document.getElementById('pipelineValue').textContent = '$' + Math.round(pipelineValue).toLocaleString();
    
    // Update button breakdown
    updateButtonBreakdown(metrics);
}

function updateButtonBreakdown(metrics) {
    const buttons = {
        'callButton': metrics?.activateTess || 0,
        'scheduleButton': metrics?.prequalStarts || 0,
        'quoteButton': 0,
        'emailButton': metrics?.leadsCaptured || 0
    };
    
    const total = Object.values(buttons).reduce((sum, v) => sum + v, 0) || 1;
    
    Object.entries(buttons).forEach(([id, count]) => {
        const el = document.getElementById(id);
        if (el) {
            const countEl = el.querySelector('.button-count');
            const percentEl = el.querySelector('.button-percent');
            const percent = ((count / total) * 100).toFixed(0);
            
            if (countEl) countEl.textContent = count;
            if (percentEl) percentEl.textContent = percent + '%';
        }
    });
}

function updateActivityTimeline(events) {
    if (!events || events.length === 0) return;
    
    const timeline = document.getElementById('activityTimeline');
    if (!timeline) return;
    
    const eventLabels = {
        'splash_view': 'Visitor viewed welcome screen',
        'activate_tess': 'Visitor clicked "Get AI help"',
        'just_browsing': 'Visitor clicked "Just Browsing"',
        'prequal_start': 'Pre-qualification interview started',
        'prequal_complete': 'Pre-qualification interview completed',
        'lead_captured': '📧 Qualified lead captured!'
    };
    
    timeline.innerHTML = '';
    
    events.slice(0, 7).forEach(event => {
        const timeAgo = getTimeAgo(new Date(event.created_at));
        const label = eventLabels[event.event_type] || event.event_type;
        
        const item = document.createElement('div');
        item.className = 'activity-item';
        item.innerHTML = `
            <div class="activity-time">${timeAgo}</div>
            <div class="activity-desc">${label}</div>
        `;
        timeline.appendChild(item);
    });
}

function updateROICalculation(metrics) {
    const adSpend = parseFloat(document.getElementById('adSpend').value) || 6000;
    const leads = metrics?.leadsCaptured || 0;
    const projectedImpact = leads > 0 ? ((leads / (adSpend / 100)) * 100).toFixed(0) : 30;
    const monthlyValue = leads * 150;
    const roi = adSpend > 0 ? ((monthlyValue * 12) / adSpend * 100).toFixed(0) : 0;
    
    document.getElementById('projectedImpact').textContent = '+' + projectedImpact + '%';
    document.getElementById('additionalLeads').textContent = leads;
    document.getElementById('monthlyValue').textContent = '$' + monthlyValue.toLocaleString();
    document.getElementById('roiValue').textContent = roi + '%';
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return Math.floor(seconds / 60) + ' min ago';
    if (seconds < 86400) return Math.floor(seconds / 3600) + ' hours ago';
    return Math.floor(seconds / 86400) + ' days ago';
}

function updateTime() {
    const now = new Date();
    document.getElementById('lastUpdated').textContent = now.toLocaleTimeString('en-US', {
        hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <span>📊 ${message}</span>
            <button onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 5000);
}

function exportData() {
    const data = {
        timestamp: new Date().toISOString(),
        client: currentClientId,
        metrics: {
            aiClicks: document.getElementById('aiClicks').textContent,
            leads: document.getElementById('todayLeads').textContent,
            conversations: document.getElementById('totalConversations').textContent
        }
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MobileWise-Analytics-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    showNotification('Data exported!');
}

function logout() {
    if (confirm('Logout?')) {
        window.location.href = '/';
    }
}

// ============================================
// CHART INITIALIZATION
// ============================================

function initCharts() {
    const ctx = document.getElementById('aiEngagementChart');
    if (ctx && typeof Chart !== 'undefined') {
        new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'AI Engagement',
                    data: [0, 0, 0, 0, 0, 0, 0],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true },
                    x: { grid: { display: false } }
                }
            }
        });
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('timeRange').addEventListener('change', refreshDashboard);
    document.getElementById('adSpend').addEventListener('input', function() {
        updateROICalculation(null);
    });
    initCharts();
    initAnalytics();
});