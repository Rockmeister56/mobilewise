// ===================================================
// MOBILEWISE AI DASHBOARD HUB
// ===================================================

class DashboardHub {
    constructor() {
        this.userData = null;
        this.notifications = [];
        this.activity = [];
        this.initialize();
    }
    
    async initialize() {
        console.log('🚀 Initializing MobileWise AI Dashboard Hub...');
        
        // Load user data
        await this.loadUserData();
        
        // Load notifications
        await this.loadNotifications();
        
        // Load recent activity
        await this.loadRecentActivity();
        
        // Initialize event listeners
        this.setupEventListeners();
        
        // Update UI
        this.updateUI();
        
        // Start live updates
        this.startLiveUpdates();
        
        console.log('✅ Dashboard Hub initialized successfully');
    }
    
    async loadUserData() {
        try {
            // Try to load from localStorage first
            const savedUser = localStorage.getItem('mobilewiseUser');
            const savedSession = localStorage.getItem('mobilewiseSession');
            
            if (savedUser && savedSession === 'active') {
                this.userData = JSON.parse(savedUser);
            } else {
                // Default demo user
                this.userData = {
                    id: 'demo',
                    name: 'Demo Client',
                    email: 'demo@mobilewise.ai',
                    plan: 'premium',
                    industry: 'Financial Services',
                    joined: '2024-01-15',
                    avatarInitials: 'DC'
                };
                
                // Save for future sessions
                localStorage.setItem('mobilewiseUser', JSON.stringify(this.userData));
                localStorage.setItem('mobilewiseSession', 'active');
            }
        } catch (error) {
            console.error('Error loading user data:', error);
            this.userData = this.getDemoUser();
        }
    }
    
    getDemoUser() {
        return {
            id: 'demo',
            name: 'Demo Client',
            email: 'demo@mobilewise.ai',
            plan: 'premium',
            industry: 'Financial Services',
            joined: '2024-01-15',
            avatarInitials: 'DC'
        };
    }
    
    async loadNotifications() {
        // Simulated notifications (in production, this would come from API)
        this.notifications = [
            {
                id: 1,
                type: 'success',
                title: 'Testimonial Performance Update',
                message: 'Your "Price Concern" testimonial has 245 views today',
                time: '5 minutes ago',
                read: false,
                icon: 'fas fa-chart-line'
            },
            {
                id: 2,
                type: 'info',
                title: 'New Feature Available',
                message: 'Smart Banners beta testing starts next week',
                time: '2 hours ago',
                read: false,
                icon: 'fas fa-bolt'
            },
            {
                id: 3,
                type: 'warning',
                title: 'Action Required',
                message: 'Please update your payment method',
                time: '1 day ago',
                read: true,
                icon: 'fas fa-credit-card'
            },
            {
                id: 4,
                type: 'info',
                title: 'Monthly Report Ready',
                message: 'Your January performance report is available',
                time: '2 days ago',
                read: true,
                icon: 'fas fa-file-alt'
            }
        ];
        
        this.updateNotificationBadge();
    }
    
    async loadRecentActivity() {
        // Simulated activity data
        this.activity = [
            {
                id: 1,
                type: 'testimonial',
                title: 'New testimonial added',
                description: 'Added "Rate Anxiety" testimonial for Mortgage industry',
                time: 'Just now',
                icon: 'fas fa-plus-circle',
                iconColor: 'success'
            },
            {
                id: 2,
                type: 'analytics',
                title: 'Performance milestone reached',
                description: 'AI assistant engaged 100+ visitors in the last hour',
                time: '15 minutes ago',
                icon: 'fas fa-trophy',
                iconColor: 'info'
            },
            {
                id: 3,
                type: 'system',
                title: 'System update completed',
                description: 'Dashboard performance improvements deployed',
                time: '1 hour ago',
                icon: 'fas fa-sync-alt',
                iconColor: 'warning'
            },
            {
                id: 4,
                type: 'user',
                title: 'Client settings updated',
                description: 'Updated notification preferences and contact info',
                time: '2 hours ago',
                icon: 'fas fa-user-cog',
                iconColor: 'info'
            }
        ];
        
        this.renderActivityFeed();
    }
    
    setupEventListeners() {
        // Notifications button
        const notificationsBtn = document.getElementById('notificationsBtn');
        const closeNotifications = document.getElementById('closeNotifications');
        const notificationsPanel = document.getElementById('notificationsPanel');
        
        if (notificationsBtn) {
            notificationsBtn.addEventListener('click', () => {
                notificationsPanel.classList.add('active');
                this.renderNotifications();
            });
        }
        
        if (closeNotifications) {
            closeNotifications.addEventListener('click', () => {
                notificationsPanel.classList.remove('active');
            });
        }
        
        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }
        
        // Close notifications when clicking outside
        document.addEventListener('click', (e) => {
            if (notificationsPanel.classList.contains('active') && 
                !notificationsPanel.contains(e.target) && 
                e.target !== notificationsBtn) {
                notificationsPanel.classList.remove('active');
            }
        });
        
        // Quick action buttons
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.textContent.trim();
                console.log(`Quick action: ${action}`);
                this.showToast(`Action "${action}" initiated`, 'info');
            });
        });
        
        // Update time every minute
        setInterval(() => this.updateCurrentTime(), 60000);
    }
    
    updateUI() {
        // Update user info
        if (this.userData) {
            document.getElementById('userName').textContent = this.userData.name;
            document.getElementById('userPlan').textContent = 
                `${this.userData.plan.charAt(0).toUpperCase() + this.userData.plan.slice(1)} Plan`;
            
            const userAvatar = document.getElementById('userAvatar');
            if (userAvatar) {
                userAvatar.innerHTML = `<span>${this.userData.avatarInitials}</span>`;
            }
            
            // Update welcome stats (simulated)
            document.getElementById('aiEngagements').textContent = 
                this.formatNumber(1847 + Math.floor(Math.random() * 100));
            document.getElementById('estimatedROI').textContent = 
                this.formatCurrency(8420 + Math.floor(Math.random() * 500));
            document.getElementById('timeSaved').textContent = 
                127 + Math.floor(Math.random() * 10);
            
            // Update testimonial count
            const testimonialCount = 12 + Math.floor(Math.random() * 3);
            document.getElementById('testimonialCount').textContent = 
                `${testimonialCount} active`;
        }
        
        // Update current time
        this.updateCurrentTime();
    }
    
    updateCurrentTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        const dateString = now.toLocaleDateString();
        
        const timeElement = document.getElementById('currentTime');
        if (timeElement) {
            timeElement.textContent = `${dateString} ${timeString}`;
        }
    }
    
    updateNotificationBadge() {
        const unreadCount = this.notifications.filter(n => !n.read).length;
        const badge = document.querySelector('.notification-count');
        
        if (badge) {
            if (unreadCount > 0) {
                badge.textContent = unreadCount;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        }
    }
    
    renderNotifications() {
        const container = document.getElementById('notificationsList');
        if (!container) return;
        
        if (this.notifications.length === 0) {
            container.innerHTML = `
                <div class="no-notifications">
                    <i class="fas fa-bell-slash"></i>
                    <p>No notifications</p>
                </div>
            `;
            return;
        }
        
        let html = '';
        
        this.notifications.forEach(notification => {
            html += `
                <div class="notification-item ${notification.read ? 'read' : 'unread'}" 
                     data-id="${notification.id}">
                    <div class="notification-icon ${notification.type}">
                        <i class="${notification.icon}"></i>
                    </div>
                    <div class="notification-content">
                        <div class="notification-title">${notification.title}</div>
                        <div class="notification-message">${notification.message}</div>
                        <div class="notification-time">${notification.time}</div>
                    </div>
                    ${!notification.read ? '<div class="notification-dot"></div>' : ''}
                </div>
            `;
        });
        
        container.innerHTML = html;
        
        // Add click handlers
        container.querySelectorAll('.notification-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const id = parseInt(item.dataset.id);
                this.markNotificationAsRead(id);
                item.classList.remove('unread');
                item.classList.add('read');
                this.updateNotificationBadge();
            });
        });
    }
    
    renderActivityFeed() {
        const container = document.getElementById('activityFeed');
        if (!container) return;
        
        if (this.activity.length === 0) {
            container.innerHTML = `
                <div class="no-activity">
                    <i class="fas fa-history"></i>
                    <p>No recent activity</p>
                </div>
            `;
            return;
        }
        
        let html = '';
        
        this.activity.forEach(item => {
            html += `
                <div class="activity-item">
                    <div class="activity-icon ${item.iconColor}">
                        <i class="${item.icon}"></i>
                    </div>
                    <div class="activity-content">
                        <div class="activity-title">${item.title}</div>
                        <div class="activity-description">${item.description}</div>
                        <div class="activity-time">${item.time}</div>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }
    
    markNotificationAsRead(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification) {
            notification.read = true;
            localStorage.setItem('mobilewiseNotifications', JSON.stringify(this.notifications));
        }
    }
    
    markAllNotificationsAsRead() {
        this.notifications.forEach(n => n.read = true);
        localStorage.setItem('mobilewiseNotifications', JSON.stringify(this.notifications));
        this.updateNotificationBadge();
        this.renderNotifications();
    }
    
    logout() {
        if (confirm('Are you sure you want to logout?')) {
            // Clear session
            localStorage.removeItem('mobilewiseSession');
            
            // Redirect to login
            window.location.href = 'login.html';
        }
    }
    
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(toast);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 5000);
    }
    
    startLiveUpdates() {
        // Simulate live updates
        setInterval(() => {
            // Randomly update engagement count
            const engagements = document.getElementById('aiEngagements');
            if (engagements) {
                const current = parseInt(engagements.textContent.replace(/,/g, ''));
                engagements.textContent = this.formatNumber(current + Math.floor(Math.random() * 3));
            }
            
            // Occasionally add new activity
            if (Math.random() > 0.8) {
                this.addRandomActivity();
            }
        }, 30000); // Update every 30 seconds
    }
    
    addRandomActivity() {
        const activities = [
            {
                title: 'AI Assistant Active',
                description: 'AI is currently engaging with multiple visitors',
                icon: 'fas fa-robot',
                iconColor: 'info'
            },
            {
                title: 'Data Sync Complete',
                description: 'All systems synced with latest analytics data',
                icon: 'fas fa-sync',
                iconColor: 'success'
            },
            {
                title: 'Performance Optimized',
                description: 'System performance optimizations applied',
                icon: 'fas fa-bolt',
                iconColor: 'warning'
            }
        ];
        
        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        randomActivity.id = Date.now();
        randomActivity.time = 'Just now';
        
        this.activity.unshift(randomActivity);
        
        // Keep only last 10 activities
        if (this.activity.length > 10) {
            this.activity.pop();
        }
        
        this.renderActivityFeed();
    }
    
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    
    formatCurrency(amount) {
        return '$' + this.formatNumber(amount);
    }
    
    // Public methods for global access
    exportData() {
        const data = {
            user: this.userData,
            activity: this.activity,
            lastExport: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        
        const link = document.createElement('a');
        link.setAttribute('href', dataUri);
        link.setAttribute('download', `mobilewise-export-${new Date().toISOString().split('T')[0]}.json`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showToast('Data exported successfully!', 'success');
    }
    
    refreshAll() {
        this.showToast('Refreshing all data...', 'info');
        
        // Simulate refresh
        setTimeout(() => {
            this.loadRecentActivity();
            this.loadNotifications();
            this.updateUI();
            this.showToast('All data refreshed!', 'success');
        }, 1500);
    }
    
    viewAllActivity() {
        this.showToast('Opening activity log...', 'info');
        // In a real app, this would open a modal or new page
    }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.dashboardHub = new DashboardHub();
    
    // Make methods globally available
    window.exportData = () => window.dashboardHub.exportData();
    window.refreshAll = () => window.dashboardHub.refreshAll();
    window.viewAllActivity = () => window.dashboardHub.viewAllActivity();
    
    // Add toast styles
    const toastStyles = document.createElement('style');
    toastStyles.textContent = `
        .toast {
            position: fixed;
            top: 90px;
            right: 30px;
            background: white;
            border-radius: 12px;
            padding: 15px 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            min-width: 300px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
            border-left: 4px solid #3b82f6;
        }
        
        .toast-success {
            border-left-color: #10b981;
        }
        
        .toast-error {
            border-left-color: #ef4444;
        }
        
        .toast-info {
            border-left-color: #3b82f6;
        }
        
        .toast-content {
            display: flex;
            align-items: center;
            gap: 12px;
            flex: 1;
        }
        
        .toast-content i {
            font-size: 1.2rem;
        }
        
        .toast-success .toast-content i {
            color: #10b981;
        }
        
        .toast-error .toast-content i {
            color: #ef4444;
        }
        
        .toast-info .toast-content i {
            color: #3b82f6;
        }
        
        .toast-close {
            background: none;
            border: none;
            color: #9ca3af;
            cursor: pointer;
            padding: 5px;
            font-size: 1rem;
            margin-left: 15px;
        }
        
        .toast-close:hover {
            color: #6b7280;
        }
        
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        /* Notification item styles */
        .notification-item {
            display: flex;
            align-items: flex-start;
            gap: 15px;
            padding: 15px;
            border-radius: 10px;
            cursor: pointer;
            transition: background 0.3s;
            position: relative;
        }
        
        .notification-item:hover {
            background: #f3f4f6;
        }
        
        .notification-item.unread {
            background: #f0f9ff;
        }
        
        .notification-icon {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
        }
        
        .notification-icon.success {
            background: rgba(16, 185, 129, 0.1);
            color: #10b981;
        }
        
        .notification-icon.info {
            background: rgba(59, 130, 246, 0.1);
            color: #3b82f6;
        }
        
        .notification-icon.warning {
            background: rgba(245, 158, 11, 0.1);
            color: #f59e0b;
        }
        
        .notification-content {
            flex: 1;
        }
        
        .notification-title {
            font-weight: 600;
            margin-bottom: 4px;
            color: #111827;
        }
        
        .notification-message {
            color: #6b7280;
            font-size: 0.9rem;
            margin-bottom: 4px;
        }
        
        .notification-time {
            font-size: 0.8rem;
            color: #9ca3af;
        }
        
        .notification-dot {
            position: absolute;
            top: 15px;
            right: 15px;
            width: 8px;
            height: 8px;
            background: #3b82f6;
            border-radius: 50%;
        }
        
        .no-notifications, .no-activity {
            text-align: center;
            padding: 40px 20px;
            color: #9ca3af;
        }
        
        .no-notifications i, .no-activity i {
            font-size: 3rem;
            margin-bottom: 15px;
            opacity: 0.5;
        }
  /* ============================================
   TOOLS GRID STYLES (MISSING - ADD THIS)
   ============================================ */

.tools-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
    gap: 25px;
    margin-bottom: 40px;
}

/* Make sure tool cards work properly in grid */
.tool-card {
    width: 100%;
    min-width: 0; /* Critical for grid items */
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    transition: transform 0.3s, box-shadow 0.3s;
    display: flex;
    flex-direction: column;
}

.tool-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

/* Responsive adjustments */
@media (max-width: 1200px) {
    .tools-grid {
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    }
}

@media (max-width: 768px) {
    .tools-grid {
        grid-template-columns: 1fr;
    }
}
    `;
    document.head.appendChild(toastStyles);
});