// MobileWise Dashboard - Interactive JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all dashboard components
    initDashboard();
});

function initDashboard() {
    // Set current date
    updateDateTime();
    
    // Initialize charts
    initCharts();
    
    // Initialize ROI calculator
    initROICalculator();
    
    // Initialize navigation
    initNavigation();
    
    // Initialize real-time updates
    initRealTimeUpdates();
    
    // Initialize export functionality
    initExportFunctionality();
    
    // Simulate initial data load
    simulateDataUpdates();
}

// Update date and time display
function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    document.getElementById('currentDateTime').textContent = 
        now.toLocaleDateString('en-US', options);
}

// Initialize charts with Chart.js
function initCharts() {
    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart').getContext('2d');
    window.revenueChart = new Chart(revenueCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            datasets: [{
                label: 'Revenue ($)',
                data: [12000, 19000, 15000, 25000, 22000, 30000, 28000],
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
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            }
        }
    });
    
    // User Growth Chart
    const growthCtx = document.getElementById('growthChart').getContext('2d');
    window.growthChart = new Chart(growthCtx, {
        type: 'bar',
        data: {
            labels: ['Mobile', 'Tablet', 'Desktop', 'Wearables', 'IoT'],
            datasets: [{
                label: 'User Growth',
                data: [65, 59, 80, 45, 30],
                backgroundColor: [
                    'rgba(102, 126, 234, 0.8)',
                    'rgba(118, 75, 162, 0.8)',
                    'rgba(56, 178, 172, 0.8)',
                    'rgba(237, 137, 54, 0.8)',
                    'rgba(255, 107, 107, 0.8)'
                ],
                borderColor: [
                    '#667eea',
                    '#764ba2',
                    '#38b2ac',
                    '#ed8936',
                    '#ff6b6b'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Initialize ROI Calculator
function initROICalculator() {
    const calculateBtn = document.getElementById('calculateROI');
    const resetBtn = document.getElementById('resetCalculator');
    
    calculateBtn.addEventListener('click', calculateROI);
    resetBtn.addEventListener('click', resetCalculator);
    
    // Add input event listeners for real-time calculation
    const inputs = ['adSpend', 'conversionRate', 'avgOrderValue', 'customers'];
    inputs.forEach(id => {
        document.getElementById(id).addEventListener('input', calculateROI);
    });
    
    // Initial calculation
    calculateROI();
}

function calculateROI() {
    // Get input values
    const adSpend = parseFloat(document.getElementById('adSpend').value) || 0;
    const conversionRate = parseFloat(document.getElementById('conversionRate').value) || 0;
    const avgOrderValue = parseFloat(document.getElementById('avgOrderValue').value) || 0;
    const customers = parseInt(document.getElementById('customers').value) || 0;
    
    // Calculate metrics
    const totalRevenue = customers * avgOrderValue;
    const conversions = customers * (conversionRate / 100);
    const revenueFromAds = conversions * avgOrderValue;
    const profit = revenueFromAds - adSpend;
    const roi = adSpend > 0 ? ((profit / adSpend) * 100).toFixed(1) : 0;
    
    // Update results
    document.getElementById('totalRevenue').textContent = formatCurrency(totalRevenue);
    document.getElementById('conversions').textContent = conversions.toFixed(0);
    document.getElementById('revenueFromAds').textContent = formatCurrency(revenueFromAds);
    document.getElementById('profit').textContent = formatCurrency(profit);
    document.getElementById('roiPercentage').textContent = roi + '%';
    
    // Color code ROI
    const roiElement = document.getElementById('roiPercentage');
    roiElement.style.color = roi >= 100 ? '#38b2ac' : roi >= 0 ? '#667eea' : '#ff6b6b';
}

function resetCalculator() {
    document.getElementById('adSpend').value = 5000;
    document.getElementById('conversionRate').value = 3.5;
    document.getElementById('avgOrderValue').value = 120;
    document.getElementById('customers').value = 1000;
    calculateROI();
}

function formatCurrency(value) {
    return '$' + value.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}

// Initialize navigation
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            
            // Handle navigation (simulated)
            const section = this.getAttribute('data-section');
            showNotification(`Navigating to ${section} section`);
        });
    });
}

// Initialize real-time updates
function initRealTimeUpdates() {
    // Update time every minute
    setInterval(updateDateTime, 60000);
    
    // Simulate real-time data updates every 10 seconds
    setInterval(simulateDataUpdates, 10000);
}

function simulateDataUpdates() {
    // Update stats with random fluctuations
    const stats = ['totalUsers', 'activeSessions', 'conversionRateStat', 'revenueToday'];
    
    stats.forEach(statId => {
        const element = document.getElementById(statId);
        if (element) {
            const currentValue = parseInt(element.textContent.replace(/,/g, '')) || 0;
            const change = Math.floor(Math.random() * 20) - 5; // -5 to +15
            const newValue = Math.max(0, currentValue + change);
            
            element.textContent = newValue.toLocaleString();
            
            // Update trend indicator
            const trendElement = element.parentElement.querySelector('.stat-trend');
            if (trendElement) {
                const isPositive = change >= 0;
                trendElement.className = `stat-trend ${isPositive ? 'positive' : 'negative'}`;
                trendElement.innerHTML = `<i class="fas fa-${isPositive ? 'arrow-up' : 'arrow-down'}"></i> ${Math.abs(change)}%`;
            }
        }
    });
    
    // Update charts with new data
    if (window.revenueChart) {
        const newData = window.revenueChart.data.datasets[0].data;
        newData.push(Math.floor(Math.random() * 10000) + 20000);
        newData.shift();
        window.revenueChart.update();
    }
    
    // Add new activity item
    addActivityItem();
}

function addActivityItem() {
    const activities = [
        { type: 'lead', text: 'New high-value lead from Facebook Ads', time: 'Just now' },
        { type: 'sale', text: 'Enterprise plan purchased by TechCorp Inc.', time: '5 min ago' },
        { type: 'support', text: 'Customer support ticket resolved', time: '15 min ago' },
        { type: 'lead', text: 'Mobile app demo requested', time: '30 min ago' },
        { type: 'sale', text: 'Annual subscription renewal', time: '1 hour ago' }
    ];
    
    const randomActivity = activities[Math.floor(Math.random() * activities.length)];
    const activityList = document.getElementById('activityList');
    
    // Create new activity item
    const activityItem = document.createElement('div');
    activityItem.className = 'activity-item';
    activityItem.innerHTML = `
        <div class="activity-icon ${randomActivity.type}">
            <i class="fas fa-${randomActivity.type === 'lead' ? 'user-plus' : randomActivity.type === 'sale' ? 'dollar-sign' : 'headset'}"></i>
        </div>
        <div class="activity-details">
            <h4>${randomActivity.text}</h4>
            <p>${randomActivity.type.charAt(0).toUpperCase() + randomActivity.type.slice(1)}</p>
        </div>
        <div class="activity-time">${randomActivity.time}</div>
    `;
    
    // Add to top of list
    activityList.insertBefore(activityItem, activityList.firstChild);
    
    // Limit list to 5 items
    if (activityList.children.length > 5) {
        activityList.removeChild(activityList.lastChild);
    }
}

// Initialize export functionality
function initExportFunctionality() {
    const exportBtn = document.getElementById('exportData');
    const exportModal = document.getElementById('exportModal');
    const closeModal = document.querySelector('.close-modal');
    const exportOptions = document.querySelectorAll('.export-option');
    const confirmExportBtn = document.getElementById('confirmExport');
    
    // Open modal
    exportBtn.addEventListener('click', () => {
        exportModal.style.display = 'flex';
    });
    
    // Close modal
    closeModal.addEventListener('click', () => {
        exportModal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === exportModal) {
            exportModal.style.display = 'none';
        }
    });
    
    // Select export option
    exportOptions.forEach(option => {
        option.addEventListener('click', () => {
            exportOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
        });
    });
    
    // Confirm export
    confirmExportBtn.addEventListener('click', () => {
        const selectedOption = document.querySelector('.export-option.selected');
        if (selectedOption) {
            const format = selectedOption.getAttribute('data-format');
            exportData(format);
            exportModal.style.display = 'none';
            showNotification(`Data exported as ${format.toUpperCase()} successfully!`);
        } else {
            showNotification('Please select an export format', 'warning');
        }
    });
}

function exportData(format) {
    // In a real app, this would make an API call to export data
    // For demo, we'll simulate the export
    console.log(`Exporting data in ${format} format...`);
    
    // Simulate download
    const data = {
        timestamp: new Date().toISOString(),
        revenue: window.revenueChart.data.datasets[0].data,
        growth: window.growthChart.data.datasets[0].data,
        stats: {
            totalUsers: document.getElementById('totalUsers').textContent,
            activeSessions: document.getElementById('activeSessions').textContent,
            conversionRateStat: document.getElementById('conversionRateStat').textContent,
            revenueToday: document.getElementById('revenueToday').textContent
        }
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `MobileWise-Export-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// Notification system
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
        <span>${message}</span>
        <button class="close-notification"><i class="fas fa-times"></i></button>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Add styles for notification
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
                box-shadow: 0 10px 25px rgba(0,0,0,0.15);
                display: flex;
                align-items: center;
                z-index: 10000;
                animation: slideIn 0.3s ease;
                border-left: 5px solid #38b2ac;
            }
            .notification.warning {
                border-left-color: #ed8936;
            }
            .notification i {
                margin-right: 10px;
                font-size: 20px;
            }
            .notification.success i {
                color: #38b2ac;
            }
            .notification.warning i {
                color: #ed8936;
            }
            .close-notification {
                background: none;
                border: none;
                margin-left: 15px;
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
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Close button
    notification.querySelector('.close-notification').addEventListener('click', () => {
        notification.remove();
    });
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

// Initialize the dashboard
initDashboard();