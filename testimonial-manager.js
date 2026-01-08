// ===================================================
// TESTIMONIAL MANAGER JS - GROUPS SYSTEM
// ===================================================

// Global variables
let currentSelectedGroupId = null;
let testimonialData = window.testimonialData || {};

// ===================================================
// INITIALIZATION
// ===================================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Testimonial Manager Initializing...');
    
    // Initialize data structure
    initializeTestimonialData();
    
    // Setup event listeners
    setupEventListeners();
    
    // Load and display data
    loadAndDisplayData();
    
    // Update code output
    updateCodeOutput();
    
    console.log('✅ Testimonial Manager Ready');
});

// ===================================================
// DATA INITIALIZATION
// ===================================================
function initializeTestimonialData() {
    // Ensure testimonialData has the right structure
    if (!testimonialData.testimonialGroups) {
        testimonialData.testimonialGroups = {}; // EMPTY - NO SAMPLE GROUPS
    }
    
    if (!testimonialData.statistics) {
        testimonialData.statistics = {
            totalGroups: 0,
            totalVideos: 0,
            totalViews: 0
        };
    }
    
    // Ensure concerns exist (for the form dropdown)
    if (!testimonialData.concerns) {
        testimonialData.concerns = {
            price: { title: 'Price Concerns', icon: '💰', videoType: 'skeptical' },
            time: { title: 'Time/Speed', icon: '⏰', videoType: 'speed' },
            trust: { title: 'Trust/Reliability', icon: '🤝', videoType: 'skeptical' },
            results: { title: 'Results/Effectiveness', icon: '📈', videoType: 'convinced' },
            general: { title: 'General Feedback', icon: '⭐', videoType: 'skeptical' }
        };
    }
    
    // Load from localStorage if available
    const savedData = localStorage.getItem('testimonialManagerData');
    if (savedData) {
        try {
            const parsedData = JSON.parse(savedData);
            testimonialData.testimonialGroups = parsedData.testimonialGroups || {};
            testimonialData.statistics = parsedData.statistics || testimonialData.statistics;
            console.log('📂 Loaded data from localStorage');
        } catch (e) {
            console.error('❌ Error loading from localStorage:', e);
        }
    }
    
    // NO SAMPLE GROUPS - Start fresh
}

function initializeSampleGroups() {
    testimonialData.testimonialGroups = {
        "group_price": {
            id: "group_price",
            name: "Price Concerns",
            slug: "price-concerns",
            icon: "💰",
            description: "Testimonials about pricing and value",
            concerns: ["price"],
            testimonials: [],
            createdAt: new Date().toISOString(),
            viewCount: 0
        },
        "group_trust": {
            id: "group_trust",
            name: "Trust & Reliability",
            slug: "trust-reliability",
            icon: "🤝",
            description: "Testimonials about trust and reliability",
            concerns: ["trust"],
            testimonials: [],
            createdAt: new Date().toISOString(),
            viewCount: 0
        }
    };
    
    updateStatistics();
    console.log('📊 Initialized with sample groups');
}

// ===================================================
// EVENT LISTENERS SETUP
// ===================================================
function setupEventListeners() {
    // Add Group Button
    const addGroupBtn = document.getElementById('addTestimonialGroupBtn');
    if (addGroupBtn) {
        addGroupBtn.addEventListener('click', showAddTestimonialGroupModal);
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('addTestimonialGroupModal');
        if (event.target === modal || event.target.classList.contains('modal-backdrop')) {
            hideAddTestimonialGroupModal();
        }
        
        const allModal = document.getElementById('allTestimonialsModal');
        if (event.target === allModal || (event.target.classList.contains('modal-backdrop') && event.target.closest('.modal-dialog'))) {
            hideAllTestimonialsModal();
        }
        
        const videoModal = document.getElementById('videoPlayerModal');
        if (event.target === videoModal || (event.target.classList.contains('modal-backdrop') && event.target.closest('.modal-dialog'))) {
            hideVideoPlayerModal();
        }
    });
    
    // Escape key to close modals
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            hideAddTestimonialGroupModal();
            hideAllTestimonialsModal();
            hideVideoPlayerModal();
        }
    });
}

// ===================================================
// GROUP MANAGEMENT
// ===================================================
function showAddTestimonialGroupModal() {
    const modal = document.getElementById('addTestimonialGroupModal');
    if (modal) {
        modal.style.display = 'flex';
        document.getElementById('newGroupName').focus();
        
        // Populate concern checkboxes
        populateConcernCheckboxes();
    }
}

function hideAddTestimonialGroupModal() {
    const modal = document.getElementById('addTestimonialGroupModal');
    if (modal) {
        modal.style.display = 'none';
        
        // Clear form
        document.getElementById('newGroupName').value = '';
        document.getElementById('newGroupSlug').value = '';
        document.getElementById('newGroupIcon').value = '📁';
        document.getElementById('newGroupDescription').value = '';
        
        // Clear checkboxes
        const checkboxes = document.querySelectorAll('.concern-checkbox');
        checkboxes.forEach(cb => cb.checked = false);
    }
}

function populateConcernCheckboxes() {
    const container = document.getElementById('concernsCheckboxContainer');
    if (!container) return;
    
    const concerns = {
        'price': '💰 See What Others Say About Value',
        'time': '⏰ Hear From Busy Professionals',
        'trust': '🤝 Real Client Experiences',
        'general': '⭐ What Our Clients Say',
        'results': '📈 See The Results Others Got'
    };
    
    container.innerHTML = '';
    
    for (const [key, label] of Object.entries(concerns)) {
        const checkboxId = `concern_${key}`;
        const html = `
            <div class="concern-checkbox-item">
                <input type="checkbox" 
                       id="${checkboxId}" 
                       class="concern-checkbox" 
                       value="${key}">
                <label for="${checkboxId}" class="concern-checkbox-label">
                    ${label}
                </label>
            </div>
        `;
        container.innerHTML += html;
    }
}

function createTestimonialGroup() {
    // Get form values
    const name = document.getElementById('newGroupName').value.trim();
    const slug = document.getElementById('newGroupSlug').value.trim();
    const icon = document.getElementById('newGroupIcon').value.trim() || '📁';
    const description = document.getElementById('newGroupDescription').value.trim();
    
    // Validation
    if (!name) {
        showError('Please enter a group name');
        return;
    }
    
    if (!slug) {
        showError('Please enter a group slug (URL-friendly name)');
        return;
    }
    
    // Get selected concerns
    const selectedConcerns = [];
    const checkboxes = document.querySelectorAll('.concern-checkbox:checked');
    checkboxes.forEach(cb => {
        selectedConcerns.push(cb.value);
    });
    
    // Create group ID
    const groupId = 'group_' + slug.replace(/[^a-z0-9]/g, '_') + '_' + Date.now();
    
    // Create new group object
    const newGroup = {
        id: groupId,
        name: name,
        slug: slug,
        icon: icon,
        description: description,
        concerns: selectedConcerns,
        testimonials: [],
        createdAt: new Date().toISOString(),
        viewCount: 0
    };
    
    // Add to data structure
    testimonialData.testimonialGroups[groupId] = newGroup;
    
    // Update statistics
    updateStatistics();
    
    // Save to localStorage
    saveToLocalStorage();
    
    // Update ALL UI components
    updateGroupsDisplay();
    updateGroupDropdown();
    selectGroup(groupId); // Auto-select the new group
    
    // Close modal and show success
    hideAddTestimonialGroupModal();
    showSuccess(`✅ Group "${name}" created successfully!`);
    
    console.log('Created new group:', newGroup);
}

// NEW FUNCTION: UPDATE GROUP DROPDOWN
function updateGroupDropdown() {
    const dropdown = document.getElementById('selectGroupDropdown');
    if (!dropdown) return;
    
    dropdown.innerHTML = '<option value="">-- Select a Group to Add Testimonials --</option>';
    
    if (!testimonialData.testimonialGroups || Object.keys(testimonialData.testimonialGroups).length === 0) {
        dropdown.innerHTML = '<option value="">No groups yet - Create one first</option>';
        return;
    }
    
    // Add all groups to dropdown
    for (const [groupId, group] of Object.entries(testimonialData.testimonialGroups)) {
        const option = document.createElement('option');
        option.value = groupId;
        option.textContent = `${group.icon || '📁'} ${group.name}`;
        
        // Select if this is the current group
        if (groupId === currentSelectedGroupId) {
            option.selected = true;
        }
        
        dropdown.appendChild(option);
    }
}

// ===================================================
// UI UPDATES
// ===================================================
function loadAndDisplayData() {
    updateGroupsDisplay();
    updateGroupDropdown(); // NEW LINE - Initialize dropdown
    updateStatisticsDisplay();
}

function updateGroupsDisplay() {
    const container = document.getElementById('testimonialGroupsContainer');
    const noGroupsMessage = document.getElementById('noGroupsMessage');
    
    if (!container) return;
    
    const groups = testimonialData.testimonialGroups;
    const groupIds = Object.keys(groups);
    
    if (groupIds.length === 0) {
        if (noGroupsMessage) noGroupsMessage.style.display = 'block';
        container.innerHTML = '';
        return;
    }
    
    if (noGroupsMessage) noGroupsMessage.style.display = 'none';
    
    // Create group buttons
container.innerHTML = groupIds.map(groupId => {
    const group = groups[groupId];
    const isActive = currentSelectedGroupId === groupId;
    
    return `
        <div class="testimonial-group-btn ${isActive ? 'active' : ''}" 
             onclick="selectGroup('${groupId}')"
             data-description="${group.description || 'No description provided'}">
            <div class="group-info">
                <span class="group-icon">${group.icon || '📁'}</span>
                <span class="group-name">${group.name}</span>
            </div>
            <span class="group-count">${group.testimonials ? group.testimonials.length : 0}</span>
        </div>
    `;
}).join('');
}

function selectGroup(groupId) {
    if (!testimonialData.testimonialGroups[groupId]) {
        showError('Group not found');
        return;
    }
    
    currentSelectedGroupId = groupId;
    const group = testimonialData.testimonialGroups[groupId];
    
    // Update ALL UI components
    updateGroupsDisplay();
    updateCurrentGroupDisplay(group);
    updateGroupDropdown(); // NEW LINE - Update dropdown selection
    
    console.log('Selected group:', group.name);
    showSuccess(`📂 Selected: ${group.name}`);
}

function updateCurrentGroupDisplay(group) {
    const display = document.getElementById('currentGroupName');
    if (display) {
        if (group) {
            display.textContent = group.name;
            display.style.color = '#2196F3'; // Primary color
        } else {
            display.textContent = 'None selected';
            display.style.color = '#888';
        }
    }
}

function displayGroupTestimonials(group) {
    // This will display testimonials in the main content area
    // We'll add this after the form or in a separate section
    updateCodeOutput(); // For now, update the code output
}

// ===================================================
// TESTIMONIAL MANAGEMENT
// ===================================================
function addVideoTestimonial() {
    // Use dropdown value instead of currentSelectedGroupId
    const dropdown = document.getElementById('selectGroupDropdown');
    const groupId = dropdown ? dropdown.value : currentSelectedGroupId;
    
    if (!groupId) {
        showError('Please select a group from the dropdown first');
        return;
    }
    
    // Get form values
    const title = document.getElementById('testimonialTitle').value.trim();
    const concernType = document.getElementById('concernType').value;
    const videoUrl = document.getElementById('videoUrl').value.trim();
    const author = document.getElementById('authorName').value.trim();
    const text = document.getElementById('testimonialText').value.trim();
    
    // Validation
    if (!title) {
        showError('Please enter a testimonial title');
        return;
    }
    
    if (!videoUrl) {
        showError('Please enter a video URL');
        return;
    }
    
    if (!author) {
        showError('Please enter an author name');
        return;
    }
    
    // Get selected group
    const group = testimonialData.testimonialGroups[groupId];
    if (!group) {
        showError('Selected group not found');
        return;
    }
    
    // Create testimonial object
    const testimonial = {
        id: 'testimonial_' + Date.now(),
        title: title,
        concernType: concernType,
        videoUrl: videoUrl,
        author: author,
        text: text,
        addedAt: new Date().toISOString(),
        views: 0
    };
    
    // Add to group
    if (!group.testimonials) group.testimonials = [];
    group.testimonials.push(testimonial);
    
    // Update statistics
    updateStatistics();
    
    // Save to localStorage
    saveToLocalStorage();
    
    // Update ALL UI components
    updateGroupsDisplay();
    updateCodeOutput();
    
    // Clear form
    document.getElementById('testimonialTitle').value = '';
    document.getElementById('videoUrl').value = '';
    document.getElementById('authorName').value = '';
    document.getElementById('testimonialText').value = '';
    
    // Hide video preview
    const videoPreview = document.getElementById('videoPreview');
    if (videoPreview) videoPreview.style.display = 'none';
    
    showSuccess(`✅ Video testimonial added to "${group.name}"!`);
    console.log('Added testimonial to group:', group.name, testimonial);
}

function addTextTestimonial() {
// Use dropdown value instead of currentSelectedGroupId
    const dropdown = document.getElementById('selectGroupDropdown');
    const groupId = dropdown ? dropdown.value : currentSelectedGroupId;
    
    if (!groupId) {
        showError('Please select a group from the dropdown first');
        return;
    }

    if (!currentSelectedGroupId) {
        showError('Please select a group first');
        return;
    }
    
    // Get form values
    const title = document.getElementById('testimonialTitle').value.trim();
    const concernType = document.getElementById('concernType').value;
    const author = document.getElementById('authorName').value.trim();
    const text = document.getElementById('testimonialText').value.trim();
    
    // Validation
    if (!title) {
        showError('Please enter a testimonial title');
        return;
    }
    
    if (!text) {
        showError('Please enter testimonial text');
        return;
    }
    
    if (!author) {
        showError('Please enter an author name');
        return;
    }
    
    // Get current group
    const group = testimonialData.testimonialGroups[currentSelectedGroupId];
    if (!group) return;
    
    // Create testimonial object
    const testimonial = {
        id: 'testimonial_' + Date.now(),
        title: title,
        concernType: concernType,
        author: author,
        text: text,
        addedAt: new Date().toISOString(),
        views: 0
    };
    
    // Add to group
    if (!group.testimonials) group.testimonials = [];
    group.testimonials.push(testimonial);
    
    // Update statistics
    updateStatistics();
    
    // Save to localStorage
    saveToLocalStorage();
    
    // Update UI
    updateGroupsDisplay();
    updateCodeOutput();
    
    // Clear form
    document.getElementById('testimonialTitle').value = '';
    document.getElementById('authorName').value = '';
    document.getElementById('testimonialText').value = '';
    
    showSuccess('✅ Text testimonial added!');
    console.log('Added text testimonial:', testimonial);
}

function testVideoUrl() {
    const videoUrl = document.getElementById('videoUrl').value.trim();
    const videoPreview = document.getElementById('videoPreview');
    const previewPlayer = document.getElementById('previewVideoPlayer');
    const videoStatus = document.getElementById('videoStatus');
    
    if (!videoUrl) {
        showError('Please enter a video URL');
        return;
    }
    
    // Simple URL validation
    if (!videoUrl.startsWith('http')) {
        showError('Please enter a valid URL starting with http:// or https://');
        return;
    }
    
    // Try to load video
    if (previewPlayer) {
        previewPlayer.src = videoUrl;
        previewPlayer.load();
        
        previewPlayer.onloadeddata = function() {
            if (videoPreview) {
                videoPreview.style.display = 'block';
                videoPreview.scrollIntoView({ behavior: 'smooth' });
            }
            if (videoStatus) {
                videoStatus.textContent = '✅ Video loaded successfully';
                videoStatus.className = 'info-value status-ready';
            }
            showSuccess('✅ Video URL is valid!');
        };
        
        previewPlayer.onerror = function() {
            if (videoPreview) videoPreview.style.display = 'none';
            if (videoStatus) {
                videoStatus.textContent = '❌ Failed to load video';
                videoStatus.className = 'info-value status-error';
            }
            showError('❌ Could not load video. Please check the URL.');
        };
    }
}

// ===================================================
// TESTIMONIAL DISPLAY (CARD VIEW)
// ===================================================
function showTestimonialsForGroup(groupId) {
    const group = testimonialData.testimonialGroups[groupId];
    if (!group) return;
    
    // Create testimonials grid
    const container = document.getElementById('allTestimonialsContent');
    if (!container) return;
    
    if (!group.testimonials || group.testimonials.length === 0) {
        container.innerHTML = `
            <div class="empty-testimonials">
                <div class="empty-icon">🎬</div>
                <h3>No testimonials yet</h3>
                <p>Add testimonials to this group to see them here</p>
            </div>
        `;
        return;
    }
    
    // Create testimonials grid
    container.innerHTML = `
        <div class="testimonials-grid">
            ${group.testimonials.map(testimonial => createTestimonialCard(testimonial)).join('')}
        </div>
    `;
    
    // Show modal
    document.getElementById('allTestimonialsModal').style.display = 'flex';
    document.getElementById('totalTestimonialsCount').textContent = group.testimonials.length;
}

function createTestimonialCard(testimonial) {
    const concernIcons = {
        'price': '💰',
        'time': '⏰',
        'trust': '🤝',
        'results': '📈',
        'general': '⭐'
    };
    
    const concernLabels = {
        'price': 'Price Concern',
        'time': 'Time/Speed',
        'trust': 'Trust/Reliability',
        'results': 'Results',
        'general': 'General Feedback'
    };
    
    const icon = concernIcons[testimonial.concernType] || '⭐';
    const label = concernLabels[testimonial.concernType] || 'Testimonial';
    
    return `
        <div class="testimonial-card" onclick="playTestimonialVideo('${testimonial.id}')">
            <div class="testimonial-card-header">
                <span class="testimonial-concern-icon">${icon}</span>
                <span class="testimonial-concern-label">${label}</span>
            </div>
            <div class="testimonial-card-body">
                <h4 class="testimonial-title">${testimonial.title || 'Untitled Testimonial'}</h4>
                <p class="testimonial-author">👤 ${testimonial.author || 'Anonymous'}</p>
                ${testimonial.text ? `<p class="testimonial-text">${testimonial.text}</p>` : ''}
            </div>
            <div class="testimonial-card-footer">
                <button class="btn btn-primary btn-play">
                    <span class="btn-icon">▶️</span>
                    Play Video
                </button>
                <span class="testimonial-views">👁️ ${testimonial.views || 0} views</span>
            </div>
        </div>
    `;
}

function playTestimonialVideo(testimonialId) {
    // Find testimonial in current group
    if (!currentSelectedGroupId) return;
    
    const group = testimonialData.testimonialGroups[currentSelectedGroupId];
    if (!group || !group.testimonials) return;
    
    const testimonial = group.testimonials.find(t => t.id === testimonialId);
    if (!testimonial || !testimonial.videoUrl) return;
    
    // Increment view count
    testimonial.views = (testimonial.views || 0) + 1;
    group.viewCount = (group.viewCount || 0) + 1;
    
    // Update statistics
    updateStatistics();
    saveToLocalStorage();
    
    // Show video player
    const videoPlayer = document.getElementById('testimonialVideoPlayer');
    const videoTitle = document.getElementById('videoPlayerTitle');
    const videoInfo = document.getElementById('videoPlayerInfo');
    
    if (videoPlayer) {
        videoPlayer.src = testimonial.videoUrl;
        videoPlayer.load();
    }
    
    if (videoTitle) {
        videoTitle.textContent = testimonial.title || 'Video Testimonial';
    }
    
    if (videoInfo) {
        videoInfo.innerHTML = `
            <div class="video-info-item">
                <strong>Author:</strong> ${testimonial.author || 'Unknown'}
            </div>
            <div class="video-info-item">
                <strong>Concern:</strong> ${testimonial.concernType || 'General'}
            </div>
            ${testimonial.text ? `
            <div class="video-info-item">
                <strong>Testimonial:</strong> ${testimonial.text}
            </div>` : ''}
        `;
    }
    
    document.getElementById('videoPlayerModal').style.display = 'flex';
}

function hideAllTestimonialsModal() {
    document.getElementById('allTestimonialsModal').style.display = 'none';
}

function hideVideoPlayerModal() {
    const videoPlayer = document.getElementById('testimonialVideoPlayer');
    if (videoPlayer) {
        videoPlayer.pause();
        videoPlayer.src = '';
    }
    document.getElementById('videoPlayerModal').style.display = 'none';
}

// ===================================================
// STATISTICS & DATA MANAGEMENT
// ===================================================
function updateStatistics() {
    const groups = testimonialData.testimonialGroups;
    let totalGroups = 0;
    let totalVideos = 0;
    let totalViews = 0;
    
    for (const [groupId, group] of Object.entries(groups)) {
        totalGroups++;
        totalVideos += group.testimonials ? group.testimonials.length : 0;
        totalViews += group.viewCount || 0;
    }
    
    testimonialData.statistics = {
        totalGroups,
        totalVideos,
        totalViews
    };
    
    updateStatisticsDisplay();
}

function updateStatisticsDisplay() {
    const stats = testimonialData.statistics;
    
    if (document.getElementById('statTotalGroups')) {
        document.getElementById('statTotalGroups').textContent = stats.totalGroups || 0;
    }
    if (document.getElementById('statTotalVideos')) {
        document.getElementById('statTotalVideos').textContent = stats.totalVideos || 0;
    }
    if (document.getElementById('statTotalViews')) {
        document.getElementById('statTotalViews').textContent = stats.totalViews || 0;
    }
}

function saveToLocalStorage() {
    try {
        const dataToSave = {
            testimonialGroups: testimonialData.testimonialGroups,
            statistics: testimonialData.statistics,
            savedAt: new Date().toISOString()
        };
        
        localStorage.setItem('testimonialManagerData', JSON.stringify(dataToSave));
        console.log('💾 Data saved to localStorage');
    } catch (e) {
        console.error('❌ Error saving to localStorage:', e);
    }
}

function saveAllData() {
    saveToLocalStorage();
    showSuccess('✅ All data saved successfully!');
}

// ===================================================
// CODE GENERATOR & DOWNLOAD
// ===================================================
function updateCodeOutput() {
    const codeOutput = document.getElementById('codeOutput');
    if (!codeOutput) return;
    
    // Create formatted data structure
    const formattedData = {
        ...testimonialData,
        __generated: new Date().toISOString(),
        __version: "2.0-groups-system"
    };
    
    const jsonString = JSON.stringify(formattedData, null, 2);
    
    codeOutput.textContent = `// ===================================================\n` +
                             `// 🎬 TESTIMONIALS DATA - GENERATED\n` +
                             `// Generated: ${new Date().toLocaleString()}\n` +
                             `// Total Groups: ${formattedData.statistics?.totalGroups || 0}\n` +
                             `// Total Videos: ${formattedData.statistics?.totalVideos || 0}\n` +
                             `// ===================================================\n\n` +
                             `window.testimonialData = ${jsonString};\n\n` +
                             `console.log('✅ Testimonials Data Loaded:', \n` +
                             `  Object.keys(window.testimonialData.testimonialGroups).length, 'groups');\n` +
                             `console.log('🎬 Videos:', window.testimonialData.statistics?.totalVideos || 0);`;
}

function copyCode() {
    const code = document.getElementById('codeOutput').textContent;
    navigator.clipboard.writeText(code).then(() => {
        showSuccess('✅ Code copied to clipboard!');
    }).catch(err => {
        showError('❌ Failed to copy: ' + err);
    });
}

function downloadJSFile() {
    updateCodeOutput();
    let code = document.getElementById('codeOutput').textContent;
    
    // Add player integration functions to the downloaded file
    const playerIntegrationCode = `

// ===================================================
// PLAYER INTEGRATION FUNCTIONS (ADDED BY MANAGER)
// ===================================================

// Get testimonials for a specific concern
window.testimonialData.getConcernTestimonials = function(concernKey) {
    const results = [];
    
    if (!this.testimonialGroups) return results;
    
    for (const [groupId, group] of Object.entries(this.testimonialGroups)) {
        if (group.concerns && group.concerns.includes(concernKey)) {
            if (group.testimonials) {
                results.push(...group.testimonials.map(t => ({
                    ...t,
                    groupName: group.name,
                    groupIcon: group.icon
                })));
            }
        }
    }
    
    return results;
};

// Get all available concerns for button display
window.testimonialData.getAvailableConcerns = function() {
    const concerns = [];
    for (const [key, data] of Object.entries(this.concerns)) {
        concerns.push({
            key: key,
            title: data.buttonText || data.title,
            icon: data.icon,
            videoType: data.videoType
        });
    }
    return concerns;
};

console.log('🎬 Testimonial Player Integration Ready');
console.log('💰 Available concerns:', window.testimonialData.getAvailableConcerns().length);
`;
    
    const fullCode = code + playerIntegrationCode;
    
    const blob = new Blob([fullCode], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'testimonials-data.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showSuccess('✅ JS file downloaded with player integration!');
}

function loadSampleData() {
    if (confirm('Load sample data? This will replace your current groups.')) {
        initializeSampleGroups();
        updateGroupsDisplay();
        updateCodeOutput();
        showSuccess('✅ Sample data loaded!');
    }
}

// ===================================================
// UTILITY FUNCTIONS
// ===================================================
function showSuccess(message) {
    const el = document.getElementById('successMessage');
    if (el) {
        el.textContent = message;
        el.style.display = 'block';
        setTimeout(() => el.style.display = 'none', 3000);
    }
}

function showError(message) {
    const el = document.getElementById('errorMessage');
    if (el) {
        el.textContent = message;
        el.style.display = 'block';
        setTimeout(() => el.style.display = 'none', 3000);
    }
}

function showWarning(message) {
    const el = document.getElementById('warningMessage');
    if (el) {
        el.textContent = message;
        el.style.display = 'block';
        setTimeout(() => el.style.display = 'none', 3000);
    }
}

// ===================================================
// EXPORT FUNCTIONS TO WINDOW OBJECT
// ===================================================
window.updateGroupDropdown = updateGroupDropdown; // ADD THIS LINE
window.selectGroup = selectGroup;
window.showAddTestimonialGroupModal = showAddTestimonialGroupModal;
window.hideAddTestimonialGroupModal = hideAddTestimonialGroupModal;
window.createTestimonialGroup = createTestimonialGroup;
window.addVideoTestimonial = addVideoTestimonial;
window.addTextTestimonial = addTextTestimonial;
window.testVideoUrl = testVideoUrl;
window.playTestimonialVideo = playTestimonialVideo;
window.hideAllTestimonialsModal = hideAllTestimonialsModal;
window.hideVideoPlayerModal = hideVideoPlayerModal;
window.saveAllData = saveAllData;
window.downloadJSFile = downloadJSFile;
window.loadSampleData = loadSampleData;
window.copyCode = copyCode;
window.showTestimonialsForGroup = showTestimonialsForGroup;