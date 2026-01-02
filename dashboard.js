// MobileWise AI Dashboard - JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('MobileWise AI Dashboard Loading...');
    
    // Initialize dashboard
    initDashboard();
    
    // Simulate real-time updates
    simulateDataUpdates();
    
    // Update every 10 seconds
    setInterval(simulateDataUpdates, 10000);
    
    // Update time every minute
    setInterval(updateTime, 60000);
});

function initDashboard() {
    // Set initial time
    updateTime();
    
    // Initialize charts if needed
    if (typeof Chart !== 'undefined') {
        initCharts();
    }
    
    // Set up event listeners
    document.getElementById('timeRange').addEventListener('change', updateDataByTimeRange);
    document.getElementById('adSpend').addEventListener('input', updateROICalculation);
    
    // Initial ROI calculation
    updateROICalculation();
}

function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour12: true, 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('lastUpdated').textContent = timeString;
}

function simulateDataUpdates() {
    console.log('Updating dashboard data...');
    
    // Simulate live data updates
    updateLiveStats();
    updateAIEngagement();
    updateVoiceConversations();
    updateTestimonialData();
    updateActionCenter();
    updateActivityTimeline();
    updateROICalculation();
    
    // Add visual feedback
    document.querySelectorAll('.live-value').forEach(el => {
        el.classList.add('updated');
        setTimeout(() => el.classList.remove('updated'), 1000);
    });
}

function updateLiveStats() {
    // Generate random but realistic data
    const liveConvos = Math.floor(Math.random() * 5) + 1;
    const todayLeads = Math.floor(Math.random() * 15) + 5;
    const estimatedValue = todayLeads * 150; // $150 per lead average
    
    document.getElementById('liveConversations').textContent = liveConvos;
    document.getElementById('todayLeads').textContent = todayLeads;
    document.getElementById('estimatedValue').textContent = '$' + estimatedValue.toLocaleString();
}

function updateAIEngagement() {
    const clicks = Math.floor(Math.random() * 50) + 20;
    const trend = Math.floor(Math.random() * 30) - 10; // -10 to +20
    const engagementRate = (Math.random() * 20 + 5).toFixed(1); // 5-25%
    const avgSession = Math.floor(Math.random() * 120) + 30; // 30-150 seconds
    const peakHour = `${Math.floor(Math.random() * 12) + 8}:${Math.floor(Math.random() * 6)}0`; // 8:00-20:00
    
    document.getElementById('aiClicks').textContent = clicks;
    document.getElementById('aiTrend').textContent = `${trend >= 0 ? '+' : ''}${trend}% vs previous period`;
    document.getElementById('aiTrend').style.color = trend >= 0 ? '#38b2ac' : '#ff6b6b';
    document.getElementById('engagementRate').textContent = engagementRate + '%';
    document.getElementById('avgSessionTime').textContent = avgSession + 's';
    document.getElementById('peakHour').textContent = peakHour;
}

function updateVoiceConversations() {
    const totalConvos = Math.floor(Math.random() * 40) + 10;
    const avgMessages = Math.floor(Math.random() * 15) + 3;
    const avgDuration = Math.floor(Math.random() * 180) + 60; // 60-240 seconds
    const completionRate = (Math.random() * 40 + 50).toFixed(0); // 50-90%
    
    document.getElementById('totalConversations').textContent = totalConvos;
    document.getElementById('avgMessages').textContent = avgMessages;
    document.getElementById('avgDuration').textContent = avgDuration + 's';
    document.getElementById('completionRate').textContent = completionRate + '%';
}

function updateTestimonialData() {
    const viewed = Math.floor(Math.random() * 100) + 50;
    const price = Math.floor(Math.random() * 30) + 10;
    const time = Math.floor(Math.random() * 25) + 5;
    const trust = Math.floor(Math.random() * 20) + 5;
    const watchTime = Math.floor(Math.random() * 90) + 30; // 30-120 seconds
    const postWatch = (Math.random() * 15 + 5).toFixed(1); // 5-20%
    
    document.getElementById('testimonialsViewed').textContent = viewed;
    document.getElementById('priceTestimonials').textContent = price;
    document.getElementById('timeTestimonials').textContent = time;
    document.getElementById('trustTestimonials').textContent = trust;
    document.getElementById('avgWatchTime').textContent = watchTime + 's';
    document.getElementById('postWatchConversion').textContent = postWatch + '%';
}

function updateActionCenter() {
    const totalClicks = Math.floor(Math.random() * 80) + 20;
    const conversionRate = (Math.random() * 15 + 5).toFixed(1); // 5-20%
    const pipelineValue = totalClicks * 250 * 0.2; // $250 avg value, 20% close rate
    
    // Update button stats
    const buttons = ['callButton', 'scheduleButton', 'quoteButton', 'emailButton'];
    buttons.forEach(buttonId => {
        const button = document.getElementById(buttonId);
        if (button) {
            const count = Math.floor(Math.random() * 30) + 5;
            const percent = Math.floor(Math.random() * 100);
            
            const countEl = button.querySelector('.button-count');
            const percentEl = button.querySelector('.button-percent');
            
            if (countEl) countEl.textContent = count;
            if (percentEl) {
                percentEl.textContent = percent + '%';
                percentEl.style.color = percent >= 30 ? '#38b2ac' : percent >= 15 ? '#ed8936' : '#ff6b6b';
            }
        }
    });
    
    document.getElementById('actionCenterClicks').textContent = totalClicks;
    document.getElementById('actionTrend').textContent = `Conversion Rate: ${conversionRate}%`;
    document.getElementById('pipelineValue').textContent = '$' + Math.round(pipelineValue).toLocaleString();
}

function updateActivityTimeline() {
    const activities = [
        { time: 'Just now', desc: 'Visitor engaged with AI assistant' },
        { time: '5 min ago', desc: 'Qualified lead captured from Facebook' },
        { time: '12 min ago', desc: 'Price concern testimonial viewed' },
        { time: '25 min ago', desc: 'Schedule call button clicked' },
        { time: '45 min ago', desc: 'Voice conversation completed (3.2m)' },
        { time: '1 hour ago', desc: 'New visitor from Google search' },
        { time: '2 hours ago', desc: 'Email contact form submitted' }
    ];
    
    // Randomly select 3-5 activities
    const numActivities = Math.floor(Math.random() * 3) + 3;
    const selectedActivities = [];
    
    for (let i = 0; i < numActivities; i++) {
        selectedActivities.push(activities[Math.floor(Math.random() * activities.length)]);
    }
    
    const timeline = document.getElementById('activityTimeline');
    if (timeline) {
        timeline.innerHTML = '';
        selectedActivities.forEach(activity => {
            const item = document.createElement('div');
            item.className = 'activity-item';
            item.innerHTML = `
                <div class="activity-time">${activity.time}</div>
                <div class="activity-desc">${activity.desc}</div>
            `;
            timeline.appendChild(item);
        });
    }
}

function updateROICalculation() {
    const adSpend = parseFloat(document.getElementById('adSpend').value) || 6000;
    
    // Calculate based on ad spend
    const projectedImpact = 30; // Base 30% improvement
    const additionalLeads = Math.round(adSpend / 100 * 1.5); // 1.5 leads per $100 spend
    const monthlyValue = additionalLeads * 150; // $150 per lead
    const roi = ((monthlyValue * 12) / adSpend * 100).toFixed(0);
    
    document.getElementById('projectedImpact').textContent = '+' + projectedImpact + '%';
    document.getElementById('additionalLeads').textContent = additionalLeads;
    document.getElementById('monthlyValue').textContent = '$' + monthlyValue.toLocaleString();
    document.getElementById('roiValue').textContent = roi + '%';
    
    // Color code ROI
    const roiElement = document.getElementById('roiValue');
    if (roi >= 200) {
        roiElement.style.color = '#38b2ac';
    } else if (roi >= 100) {
        roiElement.style.color = '#667eea';
    } else {
        roiElement.style.color = '#ff6b6b';
    }
}

function updateDataByTimeRange() {
    const timeRange = document.getElementById('timeRange').value;
    console.log('Updating data for:', timeRange);
    
    // In a real app, this would fetch new data from API
    // For now, just simulate new data
    simulateDataUpdates();
    
    // Show notification
    showNotification(`Data updated for ${timeRange} period`);
}

function initCharts() {
    // AI Engagement Chart
    const ctx = document.getElementById('aiEngagementChart');
    if (ctx) {
        new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'AI Engagement',
                    data: [12, 19, 15, 25, 22, 30, 28],
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
                    y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
                    x: { grid: { color: 'rgba(0,0,0,0.05)' } }
                }
            }
        });
    }
}

// Video Vault function - placeholder for v2.0
function openVideoVault(category) {
    const categories = {
        'overview': 'System Overview Videos',
        'tutorials': 'Tutorial Videos', 
        'advanced': 'Advanced Features Videos',
        'faq': 'FAQ Explanation Videos'
    };
    
    alert(`Video Vault: ${categories[category]}\n\nThis feature is coming in version 2.0!\n\nUsers will access detailed explanation videos triggered when additional information is needed.`);
    
    console.log(`Video Vault accessed: ${category} - Ready for v2.0 implementation`);
}

// Optional: Coming soon handler for the main button
document.addEventListener('DOMContentLoaded', function() {
    const videoVaultBtn = document.querySelector('a[href="video-vault-system.html"]');
    
    if (videoVaultBtn) {
        videoVaultBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Video Vault System\n\nComing in version 2.0!\n\nThis will be a parallel system to Testimonial Manager for informational videos.');
        });
    }
});

function exportData() {
    const data = {
        timestamp: new Date().toISOString(),
        liveStats: {
            conversations: document.getElementById('liveConversations').textContent,
            leads: document.getElementById('todayLeads').textContent,
            value: document.getElementById('estimatedValue').textContent
        },
        aiEngagement: {
            clicks: document.getElementById('aiClicks').textContent,
            engagementRate: document.getElementById('engagementRate').textContent
        }
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportName = `MobileWise-Export-${new Date().toISOString().split('T')[0]}.json`;
    
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', exportName);
    link.click();
    
    showNotification('Data exported successfully!');
}

function refreshDashboard() {
    simulateDataUpdates();
    showNotification('Dashboard refreshed with latest data');
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        showNotification('Logged out successfully');
        // In real app: window.location.href = '/logout';
    }
}

function showDetails(type) {
    const details = {
        'ai': 'AI Assistant Engagement Details',
        'action': 'Action Center Button Breakdown'
    };
    
    if (details[type]) {
        showNotification(details[type] + ' - Feature coming soon!');
    }
}

// Placeholder for Video Vault functionality
// Add this script tag after the card or in your JS file

// You could add a click handler for the coming soon version
document.addEventListener('DOMContentLoaded', function() {
    const videoVaultBtn = document.querySelector('a[href="video-vault-system.html"]');
    
    if (videoVaultBtn) {
        videoVaultBtn.addEventListener('click', function(e) {
            // Prevent navigation if page doesn't exist yet
            e.preventDefault();
            
            // Show coming soon modal/alert
            alert('Video Vault System\n\nThis feature is coming in version 2.0!\n\nUsers will access detailed explanation videos and tutorials here, triggered by AI when additional information is needed.');
            
            console.log('Video Vault accessed - Ready for v2.0 implementation');
        });
    }
});

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <span>📊 ${message}</span>
            <button onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add styles if not already present
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                padding: 15px 20px;
                border-radius: 10px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.2);
                z-index: 1000;
                animation: slideIn 0.3s ease;
                border-left: 5px solid #667eea;
            }
            .notification-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 15px;
            }
            .notification button {
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: #a0aec0;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Add slideOut animation
const slideOutStyle = document.createElement('style');
slideOutStyle.textContent = `
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(slideOutStyle);